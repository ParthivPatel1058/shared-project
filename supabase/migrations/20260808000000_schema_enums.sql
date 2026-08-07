-- =============================================================
-- BhoomiX schema — 1 of 2: enumerated types
--
-- Postgres refuses to use an enum value in the transaction that created it,
-- and Supabase wraps each migration file in one transaction. So every type
-- lives here and every table that references one lives in the next file.
--
-- Enums are used where the set of values is fixed by the domain (a season is
-- kharif, rabi or zaid — never anything else). Free-form vocabularies that
-- grow with the business, such as crop names or scheme categories, stay text.
-- =============================================================

-- The original enum shipped with only these three; staff roles are added.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'partner';

DO $$ BEGIN
  -- What a person comes to BhoomiX to do. Drives which dashboard they land on.
  CREATE TYPE public.account_type AS ENUM ('farmer', 'buyer', 'partner', 'manager', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  -- The rural/urban split is the core product distinction: a smallholder in a
  -- village and someone growing on a Mumbai terrace need different catalogues,
  -- different advice and different units.
  CREATE TYPE public.farm_type AS ENUM ('rural', 'peri_urban', 'urban');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.growing_method AS ENUM (
    'open_field', 'greenhouse', 'polyhouse', 'terrace', 'balcony',
    'kitchen_garden', 'hydroponic', 'vertical'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  -- Indian farmers state land in local units; urban growers use square feet.
  -- Storing the unit alongside the number avoids a lossy conversion on write.
  CREATE TYPE public.area_unit AS ENUM ('acre', 'hectare', 'bigha', 'guntha', 'cent', 'sq_ft', 'sq_m');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.soil_type AS ENUM ('alluvial', 'black', 'red', 'laterite', 'arid', 'forest', 'saline', 'peaty', 'loamy', 'sandy', 'clay', 'potting_mix', 'unknown');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.irrigation_type AS ENUM ('rainfed', 'canal', 'borewell', 'open_well', 'drip', 'sprinkler', 'tank', 'manual');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.crop_season AS ENUM ('kharif', 'rabi', 'zaid', 'perennial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.cycle_status AS ENUM ('planned', 'sown', 'growing', 'harvested', 'failed', 'abandoned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.severity_level AS ENUM ('none', 'low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  -- The follow-up label. Diagnosis plus treatment plus this is the dataset
  -- that image-only competitors cannot assemble.
  CREATE TYPE public.treatment_outcome AS ENUM ('cured', 'improved', 'no_change', 'worsened', 'not_treated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'packed', 'assigned', 'in_transit', 'delivered', 'cancelled', 'returned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.claim_status AS ENUM ('draft', 'submitted', 'acknowledged', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  -- Two storefronts share one product table; this says which one a row is in.
  CREATE TYPE public.catalogue AS ENUM ('agri_market', 'kisan_mart');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
