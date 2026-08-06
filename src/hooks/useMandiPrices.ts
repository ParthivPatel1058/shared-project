import { useEffect, useState } from 'react';

export interface MandiPrice {
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

/**
 * Daily mandi prices from the Government of India's open data platform.
 *
 * Covers 3,000+ regulated markets and 200+ commodities, refreshed daily by the
 * Directorate of Marketing & Inspection.
 *
 * The key is free and self-serve — register at data.gov.in and copy it from
 * *My Account* — but it is per-account, so it cannot be shipped in the repo.
 * The widely shared public demo key is permanently rate limited (verified: it
 * returns `{"error":"Rate limit exceeded"}` on every call), which is why the
 * hook reports a missing key rather than silently falling back to it.
 */
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const BASE = `https://api.data.gov.in/resource/${RESOURCE_ID}`;
const API_KEY = import.meta.env.VITE_DATAGOV_API_KEY as string | undefined;

export type MandiStatus = 'loading' | 'ok' | 'no-key' | 'error' | 'empty';

interface Options {
  /** Restrict to one state, e.g. "Madhya Pradesh". */
  state?: string;
  commodity?: string;
  limit?: number;
}

export function useMandiPrices({ state, commodity, limit = 30 }: Options = {}) {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [status, setStatus] = useState<MandiStatus>(API_KEY ? 'loading' : 'no-key');

  useEffect(() => {
    if (!API_KEY) {
      setStatus('no-key');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    (async () => {
      try {
        const params = new URLSearchParams({
          'api-key': API_KEY,
          format: 'json',
          limit: String(limit),
        });
        if (state) params.set('filters[state]', state);
        if (commodity) params.set('filters[commodity]', commodity);

        const res = await fetch(`${BASE}?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // The platform answers 200 with an `error` body for a bad or throttled
        // key, so a successful status alone is not enough to trust the payload.
        if (data?.error) throw new Error(String(data.error));

        const records: MandiPrice[] = (data?.records ?? []).map((r: Record<string, string>) => ({
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

        if (cancelled) return;
        setPrices(records);
        setStatus(records.length ? 'ok' : 'empty');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state, commodity, limit]);

  return { prices, status, hasKey: Boolean(API_KEY) };
}
