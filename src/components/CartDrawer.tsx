import { useState } from 'react';
import { Minus, Plus, Trash2, Loader2, PackageCheck, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart, STORE_OFFSET, type StoreKey } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const DELIVERY_FEE = 25;
const FREE_DELIVERY_OVER = 500;

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Cart review and checkout. Quantities can be adjusted per line, and placing
 * an order writes to `orders` then clears the cart.
 */
export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { lines, totalItems, totalPrice, setQuantity, remove, clear } = useCart();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const en = language === 'en';

  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const delivery = totalPrice >= FREE_DELIVERY_OVER || totalPrice === 0 ? 0 : DELIVERY_FEE;
  const grand = totalPrice + delivery;

  /** Recover which store a line came from so the stepper stays in sync. */
  const storeOf = (key: number): StoreKey => (key >= STORE_OFFSET.mart ? 'mart' : 'agri');
  const productIdOf = (key: number) =>
    key >= STORE_OFFSET.mart ? key - STORE_OFFSET.mart : key;

  const placeOrder = async () => {
    if (!user || lines.length === 0) return;
    if (!address.trim() || !phone.trim()) {
      toast.error(en ? 'Add a delivery address and phone number' : 'पता और फ़ोन नंबर भरें');
      return;
    }
    setPlacing(true);
    try {
      const orderNumber = `BX${Date.now().toString().slice(-8)}`;
      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        order_number: orderNumber,
        items: lines.map((l) => ({
          product_id: l.key,
          name: l.name,
          name_hi: l.nameHi,
          price: l.price,
          quantity: l.quantity,
          image: l.image,
        })),
        total_amount: grand,
        status: 'pending',
        delivery_address: address.trim(),
        phone_number: phone.trim(),
      });
      if (error) throw error;

      await clear();
      toast.success(
        en ? `Order ${orderNumber} placed!` : `ऑर्डर ${orderNumber} दर्ज हो गया!`,
      );
      onOpenChange(false);
      navigate('/orders');
    } catch (e) {
      toast.error(en ? 'Could not place the order' : 'ऑर्डर दर्ज नहीं हो सका');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col p-0">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {en ? 'Your cart' : 'आपका कार्ट'}
            {totalItems > 0 && (
              <span className="rounded-full accent-solid px-2 py-0.5 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
            <p className="font-semibold text-foreground">
              {en ? 'Your cart is empty' : 'आपका कार्ट खाली है'}
            </p>
            <p className="text-sm text-muted-foreground">
              {en ? 'Add items from the market to get started.' : 'शुरू करने के लिए बाज़ार से आइटम जोड़ें।'}
            </p>
          </div>
        ) : (
          <>
            {/* Lines */}
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {lines.map((l) => (
                <div key={l.key} className="glass flex gap-3 rounded-2xl p-3">
                  <img
                    src={l.image}
                    alt={en ? l.name : l.nameHi}
                    className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {en ? l.name : l.nameHi}
                    </p>
                    <p className="text-sm font-bold text-primary">₹{l.price}</p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 rounded-lg border border-border">
                        <button
                          onClick={() => setQuantity(storeOf(l.key), productIdOf(l.key), -1)}
                          aria-label={en ? 'Decrease' : 'घटाएं'}
                          className="flex h-8 w-8 items-center justify-center rounded-l-lg hover:bg-foreground/[0.06]"
                        >
                          <Minus strokeWidth={2.5} className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-7 text-center text-sm font-bold tabular-nums">
                          {l.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(storeOf(l.key), productIdOf(l.key), 1)}
                          aria-label={en ? 'Increase' : 'बढ़ाएं'}
                          className="flex h-8 w-8 items-center justify-center rounded-r-lg hover:bg-foreground/[0.06]"
                        >
                          <Plus strokeWidth={2.5} className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-foreground">
                        ₹{(l.price * l.quantity).toLocaleString('en-IN')}
                      </span>

                      <button
                        onClick={() => remove(l.key)}
                        aria-label={en ? 'Remove item' : 'हटाएं'}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout */}
            <div className="space-y-3 border-t border-border p-5">
              <div className="space-y-2">
                <Label htmlFor="addr">{en ? 'Delivery address' : 'डिलीवरी पता'}</Label>
                <Input
                  id="addr"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={en ? 'Village, district, PIN' : 'गाँव, जिला, पिन'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ph">{en ? 'Phone number' : 'फ़ोन नंबर'}</Label>
                <Input
                  id="ph"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="98765 43210"
                />
              </div>

              <dl className="space-y-1 pt-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{en ? 'Items' : 'आइटम'}</dt>
                  <dd className="font-medium">₹{totalPrice.toLocaleString('en-IN')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{en ? 'Delivery' : 'डिलीवरी'}</dt>
                  <dd className="font-medium">
                    {delivery === 0 ? (
                      <span className="text-primary">{en ? 'FREE' : 'मुफ़्त'}</span>
                    ) : (
                      `₹${delivery}`
                    )}
                  </dd>
                </div>
                {delivery > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {en
                      ? `Add ₹${FREE_DELIVERY_OVER - totalPrice} more for free delivery`
                      : `मुफ़्त डिलीवरी के लिए ₹${FREE_DELIVERY_OVER - totalPrice} और जोड़ें`}
                  </p>
                )}
                <div className="flex justify-between border-t border-border pt-2 text-base">
                  <dt className="font-bold">{en ? 'Total' : 'कुल'}</dt>
                  <dd className="font-bold text-primary">₹{grand.toLocaleString('en-IN')}</dd>
                </div>
              </dl>

              <Button onClick={placeOrder} disabled={placing} className="h-12 w-full text-base">
                {placing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {en ? 'Placing order…' : 'ऑर्डर हो रहा है…'}
                  </>
                ) : (
                  <>
                    <PackageCheck className="h-4 w-4" />
                    {en ? 'Place order' : 'ऑर्डर करें'}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
