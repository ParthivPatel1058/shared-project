import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { trackAddToCart } from '@/lib/analytics';

/**
 * Both stores number their products from 1, and the cart keys on product_id,
 * so an Agri Market item and an AgriNova Mart item could collide on the same row.
 * Each store gets its own numeric band to keep them distinct.
 */
export const STORE_OFFSET = { agri: 0, mart: 100_000 } as const;
export type StoreKey = keyof typeof STORE_OFFSET;

export const cartKey = (store: StoreKey, productId: number) =>
  STORE_OFFSET[store] + productId;

/**
 * Hard ceiling on any single line. Enforced here rather than in each button so
 * every caller inherits it — the stepper, reorder, and anything added later.
 * A matching CHECK constraint on `cart_items` enforces it in the database too,
 * because a client-side cap is only a courtesy: the row can be written by any
 * signed-in user holding a token.
 */
export const MAX_LINE_QUANTITY = 100;

/** Raised when a change would push a line past the ceiling. */
export class QuantityLimitError extends Error {
  constructor() {
    super('quantity-limit');
    this.name = 'QuantityLimitError';
  }
}

export interface CartLine {
  /** Namespaced key actually stored in the DB. */
  key: number;
  name: string;
  nameHi: string;
  price: number;
  quantity: number;
  image: string;
}

export interface AddToCartInput {
  store: StoreKey;
  productId: number;
  name: string;
  nameHi: string;
  /** Rupees, as a number. */
  price: number;
  image: string;
}

interface CartContextValue {
  lines: CartLine[];
  loading: boolean;
  /** Quantity currently in the cart for a given product. */
  quantityOf: (store: StoreKey, productId: number) => number;
  add: (item: AddToCartInput) => Promise<void>;
  /**
   * Add several units at once, capped at the ceiling. Reorder needs this:
   * calling `add` in a loop cost one round trip per unit, and calling `add`
   * then `setQuantity` raced the state update — the second call read a stale
   * `lines` where the row did not exist yet and quietly did nothing.
   */
  addQuantity: (item: AddToCartInput, quantity: number) => Promise<void>;
  /** Change by a delta; dropping to zero removes the line. */
  setQuantity: (store: StoreKey, productId: number, delta: number) => Promise<void>;
  remove: (key: number) => Promise<void>;
  clear: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);

  // Load the cart whenever the signed-in user changes.
  useEffect(() => {
    let active = true;
    if (!user) {
      setLines([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);
      if (!active) return;
      if (error) {
        // Leave whatever is on screen rather than blanking the cart: showing an
        // empty cart on a failed read looks like the items were lost.
        console.error('cart load failed', error.message);
      } else if (data) {
        setLines(
          data.map((r) => ({
            key: r.product_id,
            name: r.product_name,
            nameHi: r.product_name_hi,
            price: r.price,
            quantity: r.quantity,
            image: r.image,
          })),
        );
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  /**
   * Mirror of `lines` that is current the instant state is set, rather than on
   * the next render. Back-to-back writes (reorder, or a spammed button) read
   * this so each one sees the previous one's result.
   */
  const linesRef = useRef<CartLine[]>([]);
  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const quantityOf = useCallback(
    (store: StoreKey, productId: number) =>
      lines.find((l) => l.key === cartKey(store, productId))?.quantity ?? 0,
    [lines],
  );

  const addQuantity = useCallback(
    async (item: AddToCartInput, quantity: number) => {
      if (!user) throw new Error('not-signed-in');
      const key = cartKey(item.store, item.productId);
      const existing = linesRef.current.find((l) => l.key === key);
      const have = existing?.quantity ?? 0;

      if (have >= MAX_LINE_QUANTITY) throw new QuantityLimitError();

      const next = Math.min(have + Math.max(1, quantity), MAX_LINE_QUANTITY);

      if (existing) {
        const restore = existing.quantity;
        const updated = lines.map((l) => (l.key === key ? { ...l, quantity: next } : l));
        linesRef.current = updated;
        setLines(updated);
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: next })
          .eq('user_id', user.id)
          .eq('product_id', key);
        if (error) {
          setLines((ls) => ls.map((l) => (l.key === key ? { ...l, quantity: restore } : l)));
          throw error;
        }
        return;
      }

      const line: CartLine = {
        key,
        name: item.name,
        nameHi: item.nameHi,
        price: item.price,
        quantity: next,
        image: item.image,
      };
      linesRef.current = [...linesRef.current, line];
      setLines((ls) => [...ls, line]);
      trackAddToCart({ id: key, name: item.name, price: item.price });
      const { error } = await supabase.from('cart_items').insert({
        user_id: user.id,
        product_id: key,
        product_name: item.name,
        product_name_hi: item.nameHi,
        price: item.price,
        quantity: next,
        image: item.image,
      });
      if (error) {
        linesRef.current = linesRef.current.filter((l) => l.key !== key);
        setLines((ls) => ls.filter((l) => l.key !== key));
        throw error;
      }
    },
    [user, lines],
  );

  const add = useCallback(
    async (item: AddToCartInput) => {
      if (!user) throw new Error('not-signed-in');
      const key = cartKey(item.store, item.productId);
      const existing = lines.find((l) => l.key === key);

      if (existing) {
        if (existing.quantity >= MAX_LINE_QUANTITY) throw new QuantityLimitError();
        const next = existing.quantity + 1;
        setLines((ls) => ls.map((l) => (l.key === key ? { ...l, quantity: next } : l)));
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: next })
          .eq('user_id', user.id)
          .eq('product_id', key);
        if (error) {
          // roll back the optimistic bump
          setLines((ls) =>
            ls.map((l) => (l.key === key ? { ...l, quantity: existing.quantity } : l)),
          );
          throw error;
        }
        return;
      }

      const line: CartLine = {
        key,
        name: item.name,
        nameHi: item.nameHi,
        price: item.price,
        quantity: 1,
        image: item.image,
      };
      setLines((ls) => [...ls, line]);
      trackAddToCart({ id: key, name: item.name, price: item.price });
      const { error } = await supabase.from('cart_items').insert({
        user_id: user.id,
        product_id: key,
        product_name: item.name,
        product_name_hi: item.nameHi,
        price: item.price,
        quantity: 1,
        image: item.image,
      });
      if (error) {
        setLines((ls) => ls.filter((l) => l.key !== key));
        throw error;
      }
    },
    [user, lines],
  );

  const setQuantity = useCallback(
    async (store: StoreKey, productId: number, delta: number) => {
      if (!user) throw new Error('not-signed-in');
      const key = cartKey(store, productId);
      const existing = lines.find((l) => l.key === key);
      if (!existing) return;

      const next = existing.quantity + delta;

      if (next > MAX_LINE_QUANTITY) throw new QuantityLimitError();

      if (next <= 0) {
        setLines((ls) => ls.filter((l) => l.key !== key));
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', key);
        if (error) {
          setLines((ls) => [...ls, existing]);
          throw error;
        }
        return;
      }

      setLines((ls) => ls.map((l) => (l.key === key ? { ...l, quantity: next } : l)));
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: next })
        .eq('user_id', user.id)
        .eq('product_id', key);
      if (error) {
        setLines((ls) =>
          ls.map((l) => (l.key === key ? { ...l, quantity: existing.quantity } : l)),
        );
        throw error;
      }
    },
    [user, lines],
  );

  const remove = useCallback(
    async (key: number) => {
      if (!user) return;
      const snapshot = lines;
      setLines((ls) => ls.filter((l) => l.key !== key));
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', key);
      if (error) setLines(snapshot);
    },
    [user, lines],
  );

  const clear = useCallback(async () => {
    if (!user) return;
    const snapshot = lines;
    setLines([]);
    const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);
    if (error) setLines(snapshot);
  }, [user, lines]);

  const totalItems = useMemo(() => lines.reduce((n, l) => n + l.quantity, 0), [lines]);
  const totalPrice = useMemo(
    () => lines.reduce((n, l) => n + l.price * l.quantity, 0),
    [lines],
  );

  const value: CartContextValue = {
    lines,
    loading,
    quantityOf,
    add,
    addQuantity,
    setQuantity,
    remove,
    clear,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
