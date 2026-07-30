/**
 * Google Analytics 4.
 *
 * The Measurement ID comes from `VITE_GA_MEASUREMENT_ID`. When it is absent
 * (local dev, or before an ID has been issued) every function here is a no-op,
 * so nothing is loaded and no console noise appears.
 */

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

/** Honour the browser's Do Not Track signal. */
function doNotTrack(): boolean {
  const nav = navigator as Navigator & { msDoNotTrack?: string };
  const dnt = nav.doNotTrack ?? nav.msDoNotTrack ?? (window as { doNotTrack?: string }).doNotTrack;
  return dnt === '1' || dnt === 'yes';
}

export function isAnalyticsEnabled(): boolean {
  return Boolean(MEASUREMENT_ID) && !doNotTrack();
}

/**
 * Injects the gtag script once.
 *
 * `send_page_view` is disabled because GA4's automatic page_view only fires on
 * a full document load. This is a single-page app, so client-side route
 * changes would never be recorded; `trackPageView` reports them instead.
 */
export function initAnalytics(): void {
  if (loaded || !isAnalyticsEnabled()) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });
}

/** Report a client-side navigation. */
export function trackPageView(path: string, title?: string): void {
  if (!isAnalyticsEnabled() || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title ?? document.title,
  });
}

/** Report a custom event. */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!isAnalyticsEnabled() || !window.gtag) return;
  window.gtag('event', name, params);
}

/* ---- Commerce helpers, using GA4's recommended event names ---- */

export const trackAddToCart = (item: {
  id: number;
  name: string;
  price: number;
  quantity?: number;
}) =>
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: item.price * (item.quantity ?? 1),
    items: [
      {
        item_id: String(item.id),
        item_name: item.name,
        price: item.price,
        quantity: item.quantity ?? 1,
      },
    ],
  });

export const trackPurchase = (order: {
  orderNumber: string;
  total: number;
  items: { id: number; name: string; price: number; quantity: number }[];
}) =>
  trackEvent('purchase', {
    transaction_id: order.orderNumber,
    currency: 'INR',
    value: order.total,
    items: order.items.map((i) => ({
      item_id: String(i.id),
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });

export const trackSearch = (term: string) => trackEvent('search', { search_term: term });
