/**
 * Mandi price proxy.
 *
 * Exists to keep the data.gov.in key server-side. A `VITE_`-prefixed key is
 * inlined into the JavaScript bundle at build time, so shipping it to the
 * browser publishes it to anyone who opens devtools — and the key is rate
 * limited per account, so an abuser silently breaks prices for every farmer.
 *
 * Also caches: the upstream refreshes once a day, but a farmer checking rates
 * five times an hour would otherwise spend five calls of a finite quota.
 *
 * POST { state?, commodity?, district?, limit? }
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const BASE = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

/** Upstream publishes daily, so an hour of staleness costs a farmer nothing. */
const TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { at: number; body: unknown }>();

interface Price {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrivalDate: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const KEY = Deno.env.get('DATAGOV_API_KEY');
  if (!KEY) {
    console.error('DATAGOV_API_KEY is not set on this function');
    return json({ error: 'Price service is not configured' }, 503);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON in request body' }, 400);
  }

  const state = typeof body.state === 'string' ? body.state.slice(0, 60) : '';
  const commodity = typeof body.commodity === 'string' ? body.commodity.slice(0, 60) : '';
  const district = typeof body.district === 'string' ? body.district.slice(0, 60) : '';
  // Clamp: an unbounded limit lets one caller drain the daily quota.
  const limit = Math.min(Math.max(Number(body.limit) || 100, 1), 500);

  const cacheKey = `${state}|${commodity}|${district}|${limit}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return json({ ...(hit.body as object), cached: true });
  }

  const params = new URLSearchParams({ 'api-key': KEY, format: 'json', limit: String(limit) });
  if (state) params.set('filters[state]', state);
  if (commodity) params.set('filters[commodity]', commodity);
  if (district) params.set('filters[district]', district);

  try {
    const res = await fetch(`${BASE}?${params}`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) {
      console.error('data.gov.in HTTP', res.status);
      return json({ error: 'Could not reach the price service' }, 502);
    }

    const data = await res.json();
    // The platform answers 200 with an error body for a throttled key, so a
    // successful status alone is not enough to trust the payload.
    if (data?.error) {
      console.error('data.gov.in error body:', String(data.error).slice(0, 200));
      return json({ error: 'The government price service is busy' }, 502);
    }

    const prices: Price[] = (data?.records ?? []).map((r: Record<string, string>) => ({
      state: r.state ?? '',
      district: r.district ?? '',
      market: r.market ?? '',
      commodity: r.commodity ?? '',
      variety: r.variety ?? '',
      arrivalDate: r.arrival_date ?? '',
      minPrice: Number(r.min_price) || 0,
      maxPrice: Number(r.max_price) || 0,
      modalPrice: Number(r.modal_price) || 0,
    }));

    const payload = { prices, total: data?.total ?? prices.length, updated: data?.updated_date ?? null };
    cache.set(cacheKey, { at: Date.now(), body: payload });
    return json(payload);
  } catch (e) {
    console.error('mandi-prices failed', e);
    return json({ error: 'Could not load prices right now' }, 500);
  }
});
