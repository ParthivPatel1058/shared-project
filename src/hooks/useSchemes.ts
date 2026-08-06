import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ALL_SCHEMES, type Scheme } from '@/data/schemes';

/**
 * Schemes, preferring a live `schemes` table when one exists.
 *
 * The bundled catalogue renders immediately so the page is never empty or
 * blocked on the network. If the optional Supabase table is present, its rows
 * replace the bundled list once they arrive — that is what makes scheme
 * corrections publishable without a redeploy.
 *
 * A missing table is the expected state, not an error: the migration is
 * optional, so a failed query silently keeps the bundled data.
 */
/** Marks that the optional table is absent, so we stop asking this session. */
const MISS_KEY = 'bx_schemes_absent';

/** Postgres columns are snake_case; the Scheme type is camelCase. */
interface SchemeRow {
  id: string;
  name: string;
  name_hi: string;
  description: string;
  description_hi: string;
  eligibility: string;
  eligibility_hi: string;
  benefits: string;
  benefits_hi: string;
  link: string;
  category: string;
  state: string | null;
}

const toScheme = (row: unknown): Scheme => {
  const r = row as SchemeRow;
  return {
    id: r.id,
    name: r.name,
    nameHi: r.name_hi,
    description: r.description,
    descriptionHi: r.description_hi,
    eligibility: r.eligibility,
    eligibilityHi: r.eligibility_hi,
    benefits: r.benefits,
    benefitsHi: r.benefits_hi,
    link: r.link,
    category: r.category as Scheme['category'],
    state: r.state ?? undefined,
  };
};

export function useSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>(ALL_SCHEMES);
  const [source, setSource] = useState<'bundled' | 'live'>('bundled');

  useEffect(() => {
    let cancelled = false;

    // Most installs never create the table, so without this every visit to the
    // page fires a request that is known to 404. Remember the miss for the
    // session and skip it.
    if (sessionStorage.getItem(MISS_KEY)) return;

    (async () => {
      // `schemes` is an optional table, so it is absent from the generated
      // Supabase types. Cast past them rather than regenerating types for a
      // table the project may never create.
      const client = supabase as unknown as {
        from: (t: string) => {
          select: (c: string) => {
            order: (c: string) => Promise<{ data: unknown[] | null; error: unknown }>;
          };
        };
      };

      const { data, error } = await client.from('schemes').select('*').order('name');

      if (cancelled) return;
      // No table, no rows, or no access — keep the bundled catalogue.
      if (error || !data?.length) {
        sessionStorage.setItem(MISS_KEY, '1');
        return;
      }

      setSchemes(data.map(toScheme));
      setSource('live');
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { schemes, source };
}
