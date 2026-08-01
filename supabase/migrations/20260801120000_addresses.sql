-- Saved delivery addresses.
--
-- Checkout previously took a single free-text address box, so nothing was
-- reusable between orders and the partner had no structured pincode or
-- coordinates to work from.

CREATE TABLE IF NOT EXISTS public.addresses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  label         text NOT NULL DEFAULT 'Home'
                CHECK (label IN ('Home', 'Work', 'Other')),
  receiver_name text NOT NULL,
  phone         text NOT NULL,

  house         text NOT NULL,           -- flat / house / building
  area          text NOT NULL,           -- street, area, sector
  landmark      text,
  city          text NOT NULL,
  state         text NOT NULL,
  pincode       text NOT NULL CHECK (pincode ~ '^[1-9][0-9]{5}$'),

  -- Captured when the address is pinned from the device, so the delivery
  -- partner gets turn-by-turn navigation rather than just a text blob.
  lat           numeric,
  lng           numeric,

  is_default    boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS addresses_user_idx ON public.addresses (user_id, created_at DESC);

-- At most one default per user.
CREATE UNIQUE INDEX IF NOT EXISTS addresses_one_default_idx
  ON public.addresses (user_id) WHERE is_default;

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own addresses" ON public.addresses;
CREATE POLICY "Users manage their own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Setting a new default has to clear the old one, or the unique index above
-- rejects the write.
CREATE OR REPLACE FUNCTION public.addresses_single_default()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE public.addresses
       SET is_default = false, updated_at = now()
     WHERE user_id = NEW.user_id
       AND id <> NEW.id
       AND is_default;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS addresses_single_default_trg ON public.addresses;
CREATE TRIGGER addresses_single_default_trg
  BEFORE INSERT OR UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.addresses_single_default();

-- The first address a user saves becomes their default automatically.
CREATE OR REPLACE FUNCTION public.addresses_first_is_default()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.addresses WHERE user_id = NEW.user_id) THEN
    NEW.is_default := true;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS addresses_first_is_default_trg ON public.addresses;
CREATE TRIGGER addresses_first_is_default_trg
  BEFORE INSERT ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.addresses_first_is_default();

-- Keep the order's own copy of the address: editing or deleting a saved
-- address must never rewrite the history of an order already placed.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS address_id uuid
  REFERENCES public.addresses(id) ON DELETE SET NULL;
