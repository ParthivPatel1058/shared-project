import { STORE_OFFSET, cartKey } from '@/contexts/CartContext';
import { MART_PRODUCTS } from '@/data/martProducts';
import { products as AGRI_PRODUCTS } from '@/pages/AgriMarket';

/**
 * Resolves a product image from its namespaced cart key.
 *
 * Orders persist the image URL that Vite resolved at the moment the item was
 * added. Those URLs are build-specific (`/assets/name-HASH.jpg`, or
 * `/src/assets/name.jpg` in dev), so any rebuild leaves historical orders
 * pointing at files that no longer exist and the thumbnails break. Looking the
 * image up from the catalog at render time keeps old orders rendering
 * correctly across deploys.
 */
const IMAGE_BY_KEY: Record<number, string> = {};

for (const p of AGRI_PRODUCTS) {
  IMAGE_BY_KEY[cartKey('agri', p.id)] = p.image;
}
for (const p of MART_PRODUCTS) {
  IMAGE_BY_KEY[cartKey('mart', p.id)] = p.image;
}

/**
 * @param key       namespaced product id stored on the cart/order line
 * @param fallback  the URL persisted with the order, used when the product is
 *                  no longer in the catalog (delisted item)
 */
export function imageForKey(key: number | undefined, fallback?: string): string | undefined {
  if (typeof key === 'number' && IMAGE_BY_KEY[key]) return IMAGE_BY_KEY[key];
  return fallback;
}

/** Which store a namespaced key belongs to. */
export const storeForKey = (key: number) =>
  key >= STORE_OFFSET.mart ? ('mart' as const) : ('agri' as const);
