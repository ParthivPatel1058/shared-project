-- Shared machine-translation cache.
--
-- English and Hindi strings are hand-authored in the app. The other 21 Eighth
-- Schedule languages are machine-translated on first request and cached here,
-- so a string is only ever paid for once across the whole user base.

CREATE TABLE IF NOT EXISTS public.translations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Hash of the English source, so lookups do not need the full text as a key
  -- and long strings stay indexable.
  source_hash text NOT NULL,
  source_text text NOT NULL,
  lang        text NOT NULL,
  translated  text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),

  UNIQUE (source_hash, lang)
);

CREATE INDEX IF NOT EXISTS translations_lookup_idx ON public.translations (lang, source_hash);

ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- UI copy is not user data: any visitor may read it, but only the edge
-- function (service role) may write, so nobody can poison the cache.
DROP POLICY IF EXISTS "Translations are readable by everyone" ON public.translations;
CREATE POLICY "Translations are readable by everyone"
  ON public.translations FOR SELECT
  USING (true);
