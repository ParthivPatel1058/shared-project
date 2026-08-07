-- =============================================================
-- BhoomiX schema — 2 of 2: tables, relationships, policies
--
-- Shape of the data:
--
--   auth.users ─1:1─ profiles ─1:1─ farm_profiles ─1:N─ farm_plots
--                                                          │
--                                                        1:N│
--                                                          ▼
--                                                     crop_cycles ─1:N─ crop_diagnoses
--
--   product_categories ─1:N─ products ─1:N─ order_items ─N:1─ orders ─1:1─ deliveries
--                                    └─1:N─ cart_items          │              │
--                                    └─1:N─ product_reviews     └──N:1── addresses
--                                                                              │
--   profiles ─1:N─ addresses ────────────────────────────────────────────────┘
--
-- Every table carries `user_id` (or reaches one through a parent) so row level
-- security can be expressed without a join in the common case.
--
-- Supersedes the earlier company_services / staff_accounts / schemes
-- migrations, none of which were ever applied.
-- =============================================================


-- ═══ 1. Authority helpers ════════════════════════════════════
-- SECURITY DEFINER so a policy on user_roles can never recurse into itself.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'manager');
$$;

/** Highest-privilege role held by the caller; the app routes on this. */
CREATE OR REPLACE FUNCTION public.my_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((
    SELECT role::text FROM public.user_roles WHERE user_id = auth.uid()
    ORDER BY CASE role::text
      WHEN 'admin' THEN 1 WHEN 'manager' THEN 2 WHEN 'partner' THEN 3 ELSE 4 END
    LIMIT 1), 'user');
$$;


-- ═══ 2. Identity ═════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone              text,
  ADD COLUMN IF NOT EXISTS phone_verified     boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS account_type       public.account_type NOT NULL DEFAULT 'farmer',
  ADD COLUMN IF NOT EXISTS preferred_language text NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS city               text,
  ADD COLUMN IF NOT EXISTS district           text,
  ADD COLUMN IF NOT EXISTS state              text,
  ADD COLUMN IF NOT EXISTS pincode            text,
  -- Null until the role-specific setup wizard is finished; the app uses this
  -- to decide whether to show onboarding instead of the dashboard.
  ADD COLUMN IF NOT EXISTS onboarded_at       timestamptz;

CREATE INDEX IF NOT EXISTS profiles_account_type_idx ON public.profiles (account_type);
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_idx ON public.profiles (phone) WHERE phone IS NOT NULL;

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());


-- ═══ 3. Staff ════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.managers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     text NOT NULL,
  phone         text,
  region        text,
  employee_code text UNIQUE,
  is_active     boolean NOT NULL DEFAULT true,
  created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Managers see their own record" ON public.managers;
CREATE POLICY "Managers see their own record" ON public.managers FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins manage managers" ON public.managers;
CREATE POLICY "Admins manage managers" ON public.managers FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS managers_updated_at ON public.managers;
CREATE TRIGGER managers_updated_at BEFORE UPDATE ON public.managers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS employee_code text,
  ADD COLUMN IF NOT EXISTS region        text;

CREATE UNIQUE INDEX IF NOT EXISTS partners_employee_code_idx
  ON public.partners (employee_code) WHERE employee_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS partners_created_by_idx ON public.partners (created_by);

DROP POLICY IF EXISTS "Managers see partners they created" ON public.partners;
CREATE POLICY "Managers see partners they created" ON public.partners FOR SELECT
  USING (public.is_manager() AND created_by = auth.uid());
DROP POLICY IF EXISTS "Managers update partners they created" ON public.partners;
CREATE POLICY "Managers update partners they created" ON public.partners FOR UPDATE
  USING (public.is_manager() AND created_by = auth.uid())
  WITH CHECK (public.is_manager() AND created_by = auth.uid());
DROP POLICY IF EXISTS "Admins manage partners" ON public.partners;
CREATE POLICY "Admins manage partners" ON public.partners FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Staff can read customer phone numbers and addresses, so creations and
-- status changes are recorded permanently.
CREATE TABLE IF NOT EXISTS public.staff_audit (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role     text NOT NULL,
  action         text NOT NULL CHECK (action IN ('create','activate','deactivate','update','delete')),
  target_user_id uuid,
  target_role    text,
  target_email   text,
  details        jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.staff_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read audit" ON public.staff_audit;
CREATE POLICY "Admins read audit" ON public.staff_audit FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "Managers read own actions" ON public.staff_audit;
CREATE POLICY "Managers read own actions" ON public.staff_audit FOR SELECT
  USING (public.is_manager() AND actor_id = auth.uid());
-- No INSERT policy on purpose: only the service role (edge function) writes
-- here, so an audit entry can never be forged from the app.

CREATE INDEX IF NOT EXISTS staff_audit_actor_idx ON public.staff_audit (actor_id, created_at DESC);


-- ═══ 4. Farm ═════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.farm_profiles (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  farm_type      public.farm_type NOT NULL DEFAULT 'rural',
  growing_method public.growing_method NOT NULL DEFAULT 'open_field',

  -- Number and unit kept together: a terrace grower says 400 sq_ft, a
  -- smallholder says 2 bigha, and converting on write loses their wording.
  total_area     numeric CHECK (total_area IS NULL OR total_area > 0),
  area_unit      public.area_unit NOT NULL DEFAULT 'acre',

  village        text,
  district       text,
  state          text,
  pincode        text CHECK (pincode IS NULL OR pincode ~ '^[1-9][0-9]{5}$'),
  lat            numeric CHECK (lat IS NULL OR lat BETWEEN -90 AND 90),
  lng            numeric CHECK (lng IS NULL OR lng BETWEEN -180 AND 180),

  kisan_id       text,
  aadhaar_linked boolean NOT NULL DEFAULT false,
  has_soil_card  boolean NOT NULL DEFAULT false,

  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.farm_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own farm profile" ON public.farm_profiles;
CREATE POLICY "Users manage own farm profile" ON public.farm_profiles FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins read farm profiles" ON public.farm_profiles;
CREATE POLICY "Admins read farm profiles" ON public.farm_profiles FOR SELECT USING (public.is_admin());

CREATE INDEX IF NOT EXISTS farm_profiles_geo_idx ON public.farm_profiles (state, district);
CREATE INDEX IF NOT EXISTS farm_profiles_type_idx ON public.farm_profiles (farm_type);

DROP TRIGGER IF EXISTS farm_profiles_updated_at ON public.farm_profiles;
CREATE TRIGGER farm_profiles_updated_at BEFORE UPDATE ON public.farm_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- A farm is rarely one piece of land. Plots let advice, diagnoses and yields
-- attach to the specific field they belong to — for an urban grower a "plot"
-- is a bed or a rack.
CREATE TABLE IF NOT EXISTS public.farm_plots (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id     uuid NOT NULL REFERENCES public.farm_profiles(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name        text NOT NULL,
  area        numeric CHECK (area IS NULL OR area > 0),
  area_unit   public.area_unit NOT NULL DEFAULT 'acre',
  soil        public.soil_type NOT NULL DEFAULT 'unknown',
  irrigation  public.irrigation_type NOT NULL DEFAULT 'rainfed',

  lat         numeric CHECK (lat IS NULL OR lat BETWEEN -90 AND 90),
  lng         numeric CHECK (lng IS NULL OR lng BETWEEN -180 AND 180),
  -- GeoJSON polygon when the farmer walks the boundary on the map.
  boundary    jsonb,

  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.farm_plots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own plots" ON public.farm_plots;
CREATE POLICY "Users manage own plots" ON public.farm_plots FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS farm_plots_farm_idx ON public.farm_plots (farm_id);
CREATE INDEX IF NOT EXISTS farm_plots_user_idx ON public.farm_plots (user_id);

DROP TRIGGER IF EXISTS farm_plots_updated_at ON public.farm_plots;
CREATE TRIGGER farm_plots_updated_at BEFORE UPDATE ON public.farm_plots
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- What is planted where, and how it ended. Yield against sowing date is what
-- turns advice into something measurable.
CREATE TABLE IF NOT EXISTS public.crop_cycles (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_id          uuid NOT NULL REFERENCES public.farm_plots(id) ON DELETE CASCADE,
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  crop_name        text NOT NULL,
  crop_name_hi     text,
  variety          text,
  season           public.crop_season NOT NULL DEFAULT 'kharif',
  status           public.cycle_status NOT NULL DEFAULT 'planned',

  sown_on          date,
  expected_harvest date,
  harvested_on     date,
  yield_qty        numeric CHECK (yield_qty IS NULL OR yield_qty >= 0),
  yield_unit       text DEFAULT 'quintal',

  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),

  -- A harvest cannot precede sowing.
  CONSTRAINT crop_cycles_dates_sane CHECK (harvested_on IS NULL OR sown_on IS NULL OR harvested_on >= sown_on)
);
ALTER TABLE public.crop_cycles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own crop cycles" ON public.crop_cycles;
CREATE POLICY "Users manage own crop cycles" ON public.crop_cycles FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS crop_cycles_plot_idx ON public.crop_cycles (plot_id, sown_on DESC);
CREATE INDEX IF NOT EXISTS crop_cycles_user_idx ON public.crop_cycles (user_id, status);

DROP TRIGGER IF EXISTS crop_cycles_updated_at ON public.crop_cycles;
CREATE TRIGGER crop_cycles_updated_at BEFORE UPDATE ON public.crop_cycles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ═══ 5. Crop AI ══════════════════════════════════════════════
-- Diagnosis, treatment given, and — the part that matters — what happened
-- next. Plot and cycle are nullable so a farmer can scan a leaf without
-- having set up their farm first.

CREATE TABLE IF NOT EXISTS public.crop_diagnoses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plot_id         uuid REFERENCES public.farm_plots(id) ON DELETE SET NULL,
  cycle_id        uuid REFERENCES public.crop_cycles(id) ON DELETE SET NULL,

  crop_name       text,
  image_url       text,

  is_healthy      boolean NOT NULL DEFAULT false,
  disease_name    text,
  disease_name_hi text,
  confidence      numeric CHECK (confidence IS NULL OR confidence BETWEEN 0 AND 100),
  severity        public.severity_level NOT NULL DEFAULT 'none',
  treatment       text,
  treatment_hi    text,

  lat             numeric,
  lng             numeric,
  district        text,
  state           text,

  outcome         public.treatment_outcome,
  outcome_notes   text,
  outcome_at      timestamptz,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.crop_diagnoses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own diagnoses" ON public.crop_diagnoses;
CREATE POLICY "Users manage own diagnoses" ON public.crop_diagnoses FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins read diagnoses" ON public.crop_diagnoses;
CREATE POLICY "Admins read diagnoses" ON public.crop_diagnoses FOR SELECT USING (public.is_admin());

CREATE INDEX IF NOT EXISTS crop_diagnoses_user_idx ON public.crop_diagnoses (user_id, created_at DESC);
-- Outbreak lookups: which disease, where, recently.
CREATE INDEX IF NOT EXISTS crop_diagnoses_outbreak_idx
  ON public.crop_diagnoses (state, district, disease_name, created_at DESC)
  WHERE disease_name IS NOT NULL;
-- Rows still awaiting their follow-up label.
CREATE INDEX IF NOT EXISTS crop_diagnoses_pending_outcome_idx
  ON public.crop_diagnoses (user_id, created_at) WHERE outcome IS NULL AND NOT is_healthy;

DROP TRIGGER IF EXISTS crop_diagnoses_updated_at ON public.crop_diagnoses;
CREATE TRIGGER crop_diagnoses_updated_at BEFORE UPDATE ON public.crop_diagnoses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ═══ 6. Insurance claims ═════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.damage_reports (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plot_id         uuid REFERENCES public.farm_plots(id) ON DELETE SET NULL,
  cycle_id        uuid REFERENCES public.crop_cycles(id) ON DELETE SET NULL,

  crop_name       text,
  cause_of_loss   text,
  area_affected   numeric,
  area_unit       public.area_unit DEFAULT 'acre',

  lat             numeric,
  lng             numeric,
  district        text,
  state           text,

  photo_urls      text[] NOT NULL DEFAULT '{}',
  -- Drives the 72-hour countdown; set from the earliest photo, not from
  -- when the report was finally submitted.
  first_photo_at  timestamptz,
  rainfall_json   jsonb,

  status          public.claim_status NOT NULL DEFAULT 'draft',
  insurer_name    text,
  policy_number   text,
  claim_reference text,
  submitted_at    timestamptz,
  resolved_at     timestamptz,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.damage_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own damage reports" ON public.damage_reports;
CREATE POLICY "Users manage own damage reports" ON public.damage_reports FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins read damage reports" ON public.damage_reports;
CREATE POLICY "Admins read damage reports" ON public.damage_reports FOR SELECT USING (public.is_admin());

CREATE INDEX IF NOT EXISTS damage_reports_user_idx ON public.damage_reports (user_id, created_at DESC);

DROP TRIGGER IF EXISTS damage_reports_updated_at ON public.damage_reports;
CREATE TRIGGER damage_reports_updated_at BEFORE UPDATE ON public.damage_reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ═══ 7. Catalogue ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.product_categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text NOT NULL UNIQUE,
  catalogue  public.catalogue NOT NULL,
  name       text NOT NULL,
  name_hi    text NOT NULL,
  icon       text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active  boolean NOT NULL DEFAULT true
);
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read categories" ON public.product_categories;
CREATE POLICY "Anyone can read categories" ON public.product_categories FOR SELECT USING (is_active);
DROP POLICY IF EXISTS "Admins manage categories" ON public.product_categories;
CREATE POLICY "Admins manage categories" ON public.product_categories FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());


CREATE TABLE IF NOT EXISTS public.products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Stable public identifier; the app's static catalogue uses small integers,
  -- so this keeps existing carts and orders resolvable after the move to DB.
  legacy_id     integer,
  sku           text UNIQUE,

  catalogue     public.catalogue NOT NULL,
  category_id   uuid REFERENCES public.product_categories(id) ON DELETE SET NULL,

  name          text NOT NULL,
  name_hi       text NOT NULL,
  description   text,
  description_hi text,

  -- Paise, not rupees: floating point money rounds wrong at scale.
  price_paise   integer NOT NULL CHECK (price_paise >= 0),
  mrp_paise     integer CHECK (mrp_paise IS NULL OR mrp_paise >= price_paise),
  unit          text NOT NULL DEFAULT 'piece',
  pack_size     text,

  image_url     text,
  -- Which kind of grower this is for. An empty array means "everyone", so a
  -- terrace gardener is not shown a tractor implement.
  suitable_for  public.farm_type[] NOT NULL DEFAULT '{}',

  stock_qty     integer NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  in_stock      boolean GENERATED ALWAYS AS (stock_qty > 0) STORED,
  is_active     boolean NOT NULL DEFAULT true,

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active products" ON public.products;
CREATE POLICY "Anyone can read active products" ON public.products FOR SELECT USING (is_active);
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products" ON public.products FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE UNIQUE INDEX IF NOT EXISTS products_legacy_idx
  ON public.products (catalogue, legacy_id) WHERE legacy_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS products_browse_idx ON public.products (catalogue, category_id) WHERE is_active;
CREATE INDEX IF NOT EXISTS products_suitable_idx ON public.products USING gin (suitable_for);
-- Bilingual search without a separate search service.
CREATE INDEX IF NOT EXISTS products_search_idx ON public.products
  USING gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(name_hi,'')));

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ═══ 8. Commerce ═════════════════════════════════════════════

ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS product_uuid uuid REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS status_enum   public.order_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS delivered_at  timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_at  timestamptz,
  ADD COLUMN IF NOT EXISTS notes         text;

CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status_enum, created_at DESC);

-- Line items as rows. `orders.items` stays for the code that still reads it,
-- but this is the queryable form: revenue by product, restock signals, and a
-- price that cannot drift when the catalogue changes.
CREATE TABLE IF NOT EXISTS public.order_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id   uuid REFERENCES public.products(id) ON DELETE SET NULL,

  -- Copied at purchase time: the order must still read correctly after the
  -- product is renamed, repriced or delisted.
  name         text NOT NULL,
  name_hi      text,
  unit_paise   integer NOT NULL CHECK (unit_paise >= 0),
  quantity     integer NOT NULL CHECK (quantity > 0),
  image_url    text,
  line_paise   integer GENERATED ALWAYS AS (unit_paise * quantity) STORED,

  created_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Visibility follows the parent order rather than being restated here.
DROP POLICY IF EXISTS "Users read own order items" ON public.order_items;
CREATE POLICY "Users read own order items" ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users insert own order items" ON public.order_items;
CREATE POLICY "Users insert own order items" ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins read all order items" ON public.order_items;
CREATE POLICY "Admins read all order items" ON public.order_items FOR SELECT USING (public.is_admin());

CREATE INDEX IF NOT EXISTS order_items_order_idx ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS order_items_product_idx ON public.order_items (product_id);


-- The delivery leg, split from the order so a partner can be reassigned and
-- the attempt history survives.
CREATE TABLE IF NOT EXISTS public.deliveries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  partner_id    uuid REFERENCES public.partners(id) ON DELETE SET NULL,

  status        public.order_status NOT NULL DEFAULT 'pending',
  assigned_at   timestamptz,
  picked_up_at  timestamptz,
  delivered_at  timestamptz,
  failed_reason text,
  attempts      integer NOT NULL DEFAULT 0,

  -- Last known position of the partner, for live tracking.
  last_lat      numeric,
  last_lng      numeric,
  last_ping_at  timestamptz,

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers track their delivery" ON public.deliveries;
CREATE POLICY "Customers track their delivery" ON public.deliveries FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
DROP POLICY IF EXISTS "Partners manage their deliveries" ON public.deliveries;
CREATE POLICY "Partners manage their deliveries" ON public.deliveries FOR ALL
  USING (EXISTS (SELECT 1 FROM public.partners p WHERE p.id = partner_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.partners p WHERE p.id = partner_id AND p.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins manage deliveries" ON public.deliveries;
CREATE POLICY "Admins manage deliveries" ON public.deliveries FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS deliveries_partner_idx ON public.deliveries (partner_id, status);

DROP TRIGGER IF EXISTS deliveries_updated_at ON public.deliveries;
CREATE TRIGGER deliveries_updated_at BEFORE UPDATE ON public.deliveries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ═══ 9. Reviews ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,

  rating      smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text,
  is_verified boolean NOT NULL DEFAULT false,

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read reviews" ON public.product_reviews;
CREATE POLICY "Anyone can read reviews" ON public.product_reviews FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Users write own reviews" ON public.product_reviews;
CREATE POLICY "Users write own reviews" ON public.product_reviews FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS product_reviews_product_idx ON public.product_reviews (product_id, rating DESC);

DROP TRIGGER IF EXISTS product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER product_reviews_updated_at BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ═══ 10. Knowledge and services ══════════════════════════════

CREATE TABLE IF NOT EXISTS public.schemes (
  id             text PRIMARY KEY,
  name           text NOT NULL,
  name_hi        text NOT NULL,
  description    text NOT NULL,
  description_hi text NOT NULL,
  eligibility    text NOT NULL,
  eligibility_hi text NOT NULL,
  benefits       text NOT NULL,
  benefits_hi    text NOT NULL,
  link           text NOT NULL,
  category       text NOT NULL,
  state          text,
  is_active      boolean NOT NULL DEFAULT true,
  updated_at     timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read schemes" ON public.schemes;
CREATE POLICY "Anyone can read schemes" ON public.schemes FOR SELECT USING (is_active);
DROP POLICY IF EXISTS "Admins manage schemes" ON public.schemes;
CREATE POLICY "Admins manage schemes" ON public.schemes FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());


CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       text NOT NULL,
  title      text NOT NULL,
  title_hi   text,
  body       text NOT NULL,
  body_hi    text,
  link       text,
  is_read    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS notifications_unread_idx
  ON public.notifications (user_id, created_at DESC) WHERE NOT is_read;


CREATE TABLE IF NOT EXISTS public.kisan_help_sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      text,
  messages   jsonb NOT NULL DEFAULT '[]',
  topic      text,
  language   text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.kisan_help_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own chats" ON public.kisan_help_sessions;
CREATE POLICY "Users manage own chats" ON public.kisan_help_sessions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS kisan_help_user_idx ON public.kisan_help_sessions (user_id, updated_at DESC);

DROP TRIGGER IF EXISTS kisan_help_updated_at ON public.kisan_help_sessions;
CREATE TRIGGER kisan_help_updated_at BEFORE UPDATE ON public.kisan_help_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


CREATE TABLE IF NOT EXISTS public.shops (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name        text NOT NULL,
  name_hi     text,
  category    text NOT NULL DEFAULT 'general',
  address     text NOT NULL,
  city        text NOT NULL,
  state       text NOT NULL,
  pincode     text,
  phone       text,
  open_hours  text,
  lat         numeric NOT NULL,
  lng         numeric NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active shops" ON public.shops;
CREATE POLICY "Anyone can read active shops" ON public.shops FOR SELECT TO authenticated USING (is_active);
DROP POLICY IF EXISTS "Admins manage shops" ON public.shops;
CREATE POLICY "Admins manage shops" ON public.shops FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS shops_geo_idx ON public.shops (state, city);

DROP TRIGGER IF EXISTS shops_updated_at ON public.shops;
CREATE TRIGGER shops_updated_at BEFORE UPDATE ON public.shops
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ═══ 11. Views ═══════════════════════════════════════════════
-- security_invoker keeps the caller's RLS in force, so a manager querying the
-- roster sees only the partners they created.

CREATE OR REPLACE VIEW public.staff_roster WITH (security_invoker = true) AS
  SELECT p.user_id, 'partner'::text AS role, p.full_name, p.phone_number AS phone,
         p.region, p.employee_code, p.is_active, p.created_by, p.created_at
    FROM public.partners p
  UNION ALL
  SELECT m.user_id, 'manager'::text, m.full_name, m.phone,
         m.region, m.employee_code, m.is_active, m.created_by, m.created_at
    FROM public.managers m;

CREATE OR REPLACE VIEW public.product_ratings WITH (security_invoker = true) AS
  SELECT product_id, COUNT(*) AS review_count, ROUND(AVG(rating), 1) AS avg_rating
    FROM public.product_reviews GROUP BY product_id;

/** Shops within `radius_km`, nearest first. */
CREATE OR REPLACE FUNCTION public.nearby_shops(
  p_lat numeric, p_lng numeric, radius_km numeric DEFAULT 25, max_rows integer DEFAULT 30
)
RETURNS SETOF public.shops LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT * FROM public.shops
   WHERE is_active
     AND 6371 * acos(LEAST(1, cos(radians(p_lat)) * cos(radians(lat)) *
         cos(radians(lng) - radians(p_lng)) + sin(radians(p_lat)) * sin(radians(lat)))) <= radius_km
   ORDER BY 6371 * acos(LEAST(1, cos(radians(p_lat)) * cos(radians(lat)) *
         cos(radians(lng) - radians(p_lng)) + sin(radians(p_lat)) * sin(radians(lat))))
   LIMIT max_rows;
$$;


-- ═══ 12. Storage ═════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('crop-images',     'crop-images',     false, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/heic']),
  ('damage-photos',   'damage-photos',   false, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/heic']),
  ('profile-avatars', 'profile-avatars', true,  2097152, ARRAY['image/jpeg','image/png','image/webp']),
  ('product-images',  'product-images',  true,  2097152, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Files live under a folder named for the owner's uid, which is what these
-- policies match on.
DROP POLICY IF EXISTS "Own crop images" ON storage.objects;
CREATE POLICY "Own crop images" ON storage.objects FOR ALL
  USING (bucket_id = 'crop-images' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'crop-images' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Own damage photos" ON storage.objects;
CREATE POLICY "Own damage photos" ON storage.objects FOR ALL
  USING (bucket_id = 'damage-photos' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'damage-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Public read avatars and products" ON storage.objects;
CREATE POLICY "Public read avatars and products" ON storage.objects FOR SELECT
  USING (bucket_id IN ('profile-avatars', 'product-images'));

DROP POLICY IF EXISTS "Own avatar writes" ON storage.objects;
CREATE POLICY "Own avatar writes" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);


-- ═══ 13. Seed categories ═════════════════════════════════════

INSERT INTO public.product_categories (slug, catalogue, name, name_hi, sort_order) VALUES
  ('seeds',       'agri_market', 'Seeds',        'बीज',        1),
  ('fertilisers', 'agri_market', 'Fertilisers',  'उर्वरक',      2),
  ('pesticides',  'agri_market', 'Pesticides',   'कीटनाशक',     3),
  ('tools',       'agri_market', 'Tools',        'उपकरण',       4),
  ('vegetables',  'kisan_mart',  'Vegetables',   'सब्ज़ियाँ',     1),
  ('fruits',      'kisan_mart',  'Fruits',       'फल',          2),
  ('staples',     'kisan_mart',  'Staples',      'किराना',      3),
  ('dairy',       'kisan_mart',  'Dairy',        'डेयरी',       4),
  ('snacks',      'kisan_mart',  'Snacks',       'स्नैक्स',      5)
ON CONFLICT (slug) DO NOTHING;


-- ═══ 14. First admin ═════════════════════════════════════════
-- Only an admin can create staff, so the first one is promoted by email.
-- No-op until that account exists; safe to re-run afterwards.
DO $$
DECLARE seed_email text := 'din1058@gmail.com'; seed_id uuid;
BEGIN
  SELECT id INTO seed_id FROM auth.users WHERE lower(email) = lower(seed_email) LIMIT 1;
  IF seed_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (seed_id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    UPDATE public.profiles SET account_type = 'admin' WHERE id = seed_id;
  END IF;
END $$;
