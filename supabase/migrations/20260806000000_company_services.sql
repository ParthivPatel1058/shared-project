-- =============================================================
-- BhoomiX — Company Service Layer
-- Migration: 20260806000000_company_services.sql
--
-- Adds every table a production agriculture platform needs:
--   1. Enrich profiles with farmer/phone/language fields
--   2. farm_profiles    — land, crops, irrigation, soil per user
--   3. crop_diagnoses   — AI diagnosis + outcome tracking (the moat)
--   4. damage_reports   — PMFBY 72-hour claim evidence packs
--   5. kisan_help_sessions — AI advisory chat history
--   6. notifications    — in-app alert inbox
--   7. product_reviews  — ratings & reviews on agri products
--   8. shops            — agri shop locations for the map
--   9. Admin RLS policies across all tables
--  10. Storage buckets for images
-- =============================================================

-- ─── Helpers ────────────────────────────────────────────────
-- Re-usable function that returns true if the calling user is admin.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;


-- ─── 1. Enrich profiles ──────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone        text,
  ADD COLUMN IF NOT EXISTS state        text,
  ADD COLUMN IF NOT EXISTS district     text,
  ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS is_farmer    boolean NOT NULL DEFAULT true;

-- Admins can see all profiles (for support / moderation).
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());


-- ─── 2. farm_profiles ────────────────────────────────────────
-- One row per user. Holds the farmer's operational data.
CREATE TABLE IF NOT EXISTS public.farm_profiles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  land_size_acres numeric,                        -- total cultivable land
  crops_grown     text[],                         -- e.g. {'Wheat','Soybean','Cotton'}
  soil_type       text,                           -- Loamy / Clay / Sandy / Silty / Black
  irrigation      text,                           -- Canal / Borewell / Rainwater / Drip
  state           text,
  district        text,
  village         text,
  pincode         text CHECK (pincode ~ '^[1-9][0-9]{5}$' OR pincode IS NULL),

  -- Source of truth for the farm's GPS centre (used by weather, mandi proximity).
  lat             numeric,
  lng             numeric,

  kisan_id        text,                           -- PM-KISAN beneficiary ID if any
  aadhaar_linked  boolean NOT NULL DEFAULT false, -- for scheme eligibility checks

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.farm_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own farm profile"
  ON public.farm_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all farm profiles"
  ON public.farm_profiles FOR SELECT
  USING (public.is_admin());

DROP TRIGGER IF EXISTS farm_profiles_updated_at ON public.farm_profiles;
CREATE TRIGGER farm_profiles_updated_at
  BEFORE UPDATE ON public.farm_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS farm_profiles_user_idx ON public.farm_profiles (user_id);
CREATE INDEX IF NOT EXISTS farm_profiles_location_idx ON public.farm_profiles (state, district);


-- ─── 3. crop_diagnoses ───────────────────────────────────────
-- Every leaf scan: the image, AI verdict, treatment, and — critically —
-- the 7-day outcome the farmer reports back. That follow-up label is the
-- dataset no competitor (Plantix etc.) has.
CREATE TABLE IF NOT EXISTS public.crop_diagnoses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- What was scanned.
  crop_name       text,
  image_url       text,                           -- stored in Supabase Storage

  -- AI response (Gemini Vision).
  disease_name    text,
  disease_name_hi text,
  confidence      numeric CHECK (confidence BETWEEN 0 AND 100),
  severity        text CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  treatment_text  text,
  treatment_hi    text,
  is_healthy      boolean NOT NULL DEFAULT false,

  -- Geo context at scan time.
  lat             numeric,
  lng             numeric,
  state           text,

  -- 7-day outcome follow-up (farmer reports back whether treatment worked).
  outcome         text CHECK (outcome IN ('cured', 'improved', 'no_change', 'worsened', NULL)),
  outcome_notes   text,
  outcome_at      timestamptz,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crop_diagnoses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own diagnoses"
  ON public.crop_diagnoses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins + researchers can read (anonymised in the app layer, not here).
CREATE POLICY "Admins can view all diagnoses"
  ON public.crop_diagnoses FOR SELECT
  USING (public.is_admin());

DROP TRIGGER IF EXISTS crop_diagnoses_updated_at ON public.crop_diagnoses;
CREATE TRIGGER crop_diagnoses_updated_at
  BEFORE UPDATE ON public.crop_diagnoses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS crop_diagnoses_user_idx ON public.crop_diagnoses (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS crop_diagnoses_disease_idx ON public.crop_diagnoses (disease_name, state);
CREATE INDEX IF NOT EXISTS crop_diagnoses_geo_idx ON public.crop_diagnoses (state, district) WHERE state IS NOT NULL;
-- Add district column for geo index
ALTER TABLE public.crop_diagnoses ADD COLUMN IF NOT EXISTS district text;


-- ─── 4. damage_reports ───────────────────────────────────────
-- PMFBY claim evidence packs. Storing the record means the farmer doesn't
-- lose the evidence if they switch phones, and BhoomiX can follow up on
-- claim status later.
CREATE TABLE IF NOT EXISTS public.damage_reports (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  crop_name       text,
  cause_of_loss   text,                          -- Hailstorm / Flood / Drought / Pest / Fire
  area_affected   text,                          -- e.g. "2 acres"

  -- GPS of the damaged field.
  lat             numeric,
  lng             numeric,
  state           text,
  district        text,

  -- Photo evidence (URLs in Supabase Storage).
  photo_urls      text[] NOT NULL DEFAULT '{}',
  first_photo_at  timestamptz,                   -- timestamp of earliest photo (72-hour clock)

  -- Rainfall corroboration from Open-Meteo pulled at report time.
  rainfall_json   jsonb,

  -- Claim lifecycle.
  status          text NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'submitted', 'acknowledged', 'approved', 'rejected')),
  insurer_name    text,
  policy_number   text,
  claim_reference text,
  submitted_at    timestamptz,
  resolved_at     timestamptz,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.damage_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own damage reports"
  ON public.damage_reports FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all damage reports"
  ON public.damage_reports FOR SELECT
  USING (public.is_admin());

DROP TRIGGER IF EXISTS damage_reports_updated_at ON public.damage_reports;
CREATE TRIGGER damage_reports_updated_at
  BEFORE UPDATE ON public.damage_reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS damage_reports_user_idx ON public.damage_reports (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS damage_reports_status_idx ON public.damage_reports (status, created_at DESC);


-- ─── 5. kisan_help_sessions ──────────────────────────────────
-- Each AI chat session with BhoomiX's advisory bot.
-- Persisting these lets the farmer pick up a conversation on another device
-- and lets BhoomiX audit quality / tune the prompts.
CREATE TABLE IF NOT EXISTS public.kisan_help_sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title       text,                              -- auto-generated from first message
  messages    jsonb NOT NULL DEFAULT '[]',       -- [{role, content, ts}]
  topic       text,                              -- 'weather' | 'disease' | 'scheme' | 'market' | 'general'
  language    text NOT NULL DEFAULT 'en',

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kisan_help_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own chat sessions"
  ON public.kisan_help_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all chat sessions"
  ON public.kisan_help_sessions FOR SELECT
  USING (public.is_admin());

DROP TRIGGER IF EXISTS kisan_help_updated_at ON public.kisan_help_sessions;
CREATE TRIGGER kisan_help_updated_at
  BEFORE UPDATE ON public.kisan_help_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS kisan_help_user_idx ON public.kisan_help_sessions (user_id, updated_at DESC);


-- ─── 6. notifications ────────────────────────────────────────
-- In-app alert inbox: order updates, spray-window alerts, scheme deadlines.
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  type        text NOT NULL,                     -- 'order_update' | 'weather_alert' | 'scheme' | 'diagnosis'
  title       text NOT NULL,
  title_hi    text,
  body        text NOT NULL,
  body_hi     text,
  link        text,                              -- in-app route
  is_read     boolean NOT NULL DEFAULT false,

  -- Optional relation to the entity that triggered this notification.
  ref_table   text,
  ref_id      uuid,

  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can send broadcast notifications (INSERT only — they cannot read others' inboxes).
CREATE POLICY "Admins can send notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS notifications_user_unread_idx
  ON public.notifications (user_id, created_at DESC)
  WHERE NOT is_read;

-- Enable realtime so the notification bell updates live.
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Helper: unread count for the current user.
CREATE OR REPLACE FUNCTION public.my_unread_notification_count()
RETURNS bigint
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.notifications
  WHERE user_id = auth.uid() AND NOT is_read;
$$;


-- ─── 7. product_reviews ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Which catalogue: 'agri_market' | 'kisan_mart'
  catalogue       text NOT NULL CHECK (catalogue IN ('agri_market', 'kisan_mart')),
  product_id      integer NOT NULL,
  product_name    text NOT NULL,

  rating          smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text     text,
  review_text_hi  text,

  -- Verified purchase: only farmers who ordered this product can mark verified.
  is_verified     boolean NOT NULL DEFAULT false,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  UNIQUE (user_id, catalogue, product_id)        -- one review per user per product
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone logged in can read reviews.
CREATE POLICY "Authenticated users can read reviews"
  ON public.product_reviews FOR SELECT
  TO authenticated
  USING (true);

-- Users manage their own reviews.
CREATE POLICY "Users manage their own reviews"
  ON public.product_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.product_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.product_reviews FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews"
  ON public.product_reviews FOR ALL
  USING (public.is_admin());

DROP TRIGGER IF EXISTS product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER product_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS product_reviews_product_idx
  ON public.product_reviews (catalogue, product_id, rating DESC);

-- Convenience view: average rating per product.
CREATE OR REPLACE VIEW public.product_avg_ratings AS
SELECT
  catalogue,
  product_id,
  COUNT(*)            AS review_count,
  ROUND(AVG(rating), 1) AS avg_rating
FROM public.product_reviews
GROUP BY catalogue, product_id;


-- ─── 8. shops ────────────────────────────────────────────────
-- Agri-input shops for the Shop Locator map. Populated by admin or
-- partner self-registration; visible to all authenticated users.
CREATE TABLE IF NOT EXISTS public.shops (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  name        text NOT NULL,
  name_hi     text,
  category    text NOT NULL DEFAULT 'general'
              CHECK (category IN ('general', 'seeds', 'fertiliser', 'pesticide', 'equipment', 'vet')),
  address     text NOT NULL,
  city        text NOT NULL,
  state       text NOT NULL,
  pincode     text,
  phone       text,
  open_hours  text,                              -- e.g. "8am–8pm Mon–Sat"

  lat         numeric NOT NULL,
  lng         numeric NOT NULL,

  is_verified boolean NOT NULL DEFAULT false,
  is_active   boolean NOT NULL DEFAULT true,

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- All authenticated users can browse shops.
CREATE POLICY "Authenticated users can view active shops"
  ON public.shops FOR SELECT
  TO authenticated
  USING (is_active);

-- Shop owners can manage their own listing.
CREATE POLICY "Owners can manage their shop"
  ON public.shops FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Admins can manage all shops.
CREATE POLICY "Admins can manage all shops"
  ON public.shops FOR ALL
  USING (public.is_admin());

DROP TRIGGER IF EXISTS shops_updated_at ON public.shops;
CREATE TRIGGER shops_updated_at
  BEFORE UPDATE ON public.shops
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS shops_location_idx ON public.shops (state, city);
CREATE INDEX IF NOT EXISTS shops_geo_idx ON public.shops (lat, lng);

-- Nearest-shops function (returns shops within `radius_km` of a point).
CREATE OR REPLACE FUNCTION public.nearby_shops(
  p_lat      numeric,
  p_lng      numeric,
  radius_km  numeric DEFAULT 25,
  max_rows   integer DEFAULT 30
)
RETURNS SETOF public.shops
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.shops
  WHERE is_active
    AND (
      6371 * acos(
        cos(radians(p_lat)) * cos(radians(lat)) *
        cos(radians(lng) - radians(p_lng)) +
        sin(radians(p_lat)) * sin(radians(lat))
      )
    ) <= radius_km
  ORDER BY (
    6371 * acos(
      cos(radians(p_lat)) * cos(radians(lat)) *
      cos(radians(lng) - radians(p_lng)) +
      sin(radians(p_lat)) * sin(radians(lat))
    )
  )
  LIMIT max_rows;
$$;


-- ─── 9. Admin visibility on pre-existing tables ───────────────
-- Admins need to see orders, cart_items, partners and addresses for ops.

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all cart items" ON public.cart_items;
CREATE POLICY "Admins can view all cart items"
  ON public.cart_items FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all partners" ON public.partners;
CREATE POLICY "Admins can manage all partners"
  ON public.partners FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all addresses" ON public.addresses;
CREATE POLICY "Admins can view all addresses"
  ON public.addresses FOR SELECT
  USING (public.is_admin());


-- ─── 10. Storage buckets ─────────────────────────────────────
-- Supabase Storage: each bucket maps to one domain.
-- Created idempotently — safe to run on a project that already has them.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('crop-images',    'crop-images',    false, 5242880,  ARRAY['image/jpeg','image/png','image/webp','image/heic']),
  ('damage-photos',  'damage-photos',  false, 5242880,  ARRAY['image/jpeg','image/png','image/webp','image/heic']),
  ('profile-avatars','profile-avatars', true, 2097152,  ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: crop-images — only the owner can read/write their folder.
CREATE POLICY "Users own their crop image folder"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'crop-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'crop-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users own their damage photo folder"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'damage-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'damage-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Profile avatars are public (anyone can read the avatar URL).
CREATE POLICY "Profile avatars are public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-avatars');

CREATE POLICY "Users upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users replace their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- ─── Summary ─────────────────────────────────────────────────
-- New tables  : farm_profiles, crop_diagnoses, damage_reports,
--               kisan_help_sessions, notifications, product_reviews, shops
-- New columns : profiles.phone/state/district/preferred_language/is_farmer
-- New buckets : crop-images, damage-photos, profile-avatars
-- New functions: is_admin(), nearby_shops(), my_unread_notification_count()
-- New view    : product_avg_ratings
-- =============================================================
