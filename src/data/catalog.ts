import { STORE_OFFSET, cartKey } from '@/contexts/CartContext';
import { MART_PRODUCTS } from '@/data/martProducts';
import { AGRI_PRODUCTS } from '@/data/agriProducts';

interface CatalogEntry {
  image: string;
  /** Pack size shown next to the name, e.g. "50g", "1L", "per kg". */
  unit: string;
  unitHi: string;
}

/**
 * Catalog lookup keyed by the namespaced product id stored on cart and order
 * lines.
 *
 * Two things are resolved here rather than persisted:
 *
 *  - Images. Orders used to keep the URL Vite resolved when the item was
 *    added, but those are build-specific (`/assets/name-HASH.jpg`), so any
 *    rebuild left old orders pointing at files that no longer exist.
 *  - Pack size. `cart_items` has no column for it, and resolving keeps the
 *    unit correct even if a product is later repacked.
 */
const BY_KEY: Record<number, CatalogEntry> = {};

for (const p of AGRI_PRODUCTS) {
  // Agri Market prices read like "₹450" + "/kg", so strip the leading slash.
  const unit = (p.unit || '').replace(/^\//, '').trim();
  BY_KEY[cartKey('agri', p.id)] = { image: p.image, unit, unitHi: unit };
}
for (const p of MART_PRODUCTS) {
  BY_KEY[cartKey('mart', p.id)] = { image: p.image, unit: p.tag, unitHi: p.tagHi };
}

/**
 * @param key       namespaced product id stored on the cart/order line
 * @param fallback  the URL persisted with the order, used when the product is
 *                  no longer in the catalog (delisted item)
 */
export function imageForKey(key: number | undefined, fallback?: string): string | undefined {
  if (typeof key === 'number' && BY_KEY[key]) return BY_KEY[key].image;
  return fallback;
}

/** Pack size for a line, or undefined when the product is no longer stocked. */
export function unitForKey(key: number | undefined, en: boolean): string | undefined {
  if (typeof key !== 'number') return undefined;
  const entry = BY_KEY[key];
  if (!entry) return undefined;
  const u = en ? entry.unit : entry.unitHi;
  return u || undefined;
}

/** Which store a namespaced key belongs to. */
export const storeForKey = (key: number) =>
  key >= STORE_OFFSET.mart ? ('mart' as const) : ('agri' as const);
