-- =============================================================
-- BhoomiX — APPLY STEP 2 of 2
-- Run ONLY after STEP 1 has completed successfully.
-- Separate run is required: Postgres will not let the enum values
-- added in STEP 1 be used in the same transaction that added them.
-- =============================================================

-- =============================================================
-- Staff account management.
--
-- Hierarchy, enforced in the database rather than only in the UI:
--   admin   → may create managers and partners, and see everything
--   manager → may create partners only, and see the partners they created
--   partner → delivery/distributor account; sees only its own work
--
-- Account creation itself needs the service-role key, so it happens in the
-- `create-staff-account` edge function. The function re-reads the caller's
-- role from these tables — a client claiming to be an admin proves nothing.
-- =============================================================

-- ─── Role helpers ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'manager'
  );
$$;

/** Highest-privilege role held by the caller. Used by the app to route. */
CREATE OR REPLACE FUNCTION public.my_role()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role::text FROM public.user_roles
      WHERE user_id = auth.uid()
      ORDER BY CASE role::text
        WHEN 'admin'   THEN 1
        WHEN 'manager' THEN 2
        WHEN 'partner' THEN 3
        ELSE 4
      END
      LIMIT 1),
    'user'
  );
$$;


-- ─── managers ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.managers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  full_name   text NOT NULL,
  phone       text,
  region      text,                       -- district / zone they oversee
  employee_code text UNIQUE,

  is_active   boolean NOT NULL DEFAULT true,
  created_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can view their own record"
  ON public.managers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all managers"
  ON public.managers FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS managers_updated_at ON public.managers;
CREATE TRIGGER managers_updated_at
  BEFORE UPDATE ON public.managers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ─── partners: who created them, and where they work ─────────
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS employee_code text,
  ADD COLUMN IF NOT EXISTS region        text;

CREATE UNIQUE INDEX IF NOT EXISTS partners_employee_code_idx
  ON public.partners (employee_code) WHERE employee_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS partners_created_by_idx ON public.partners (created_by);

-- A manager sees the partners they onboarded; an admin sees all.
DROP POLICY IF EXISTS "Managers can view partners they created" ON public.partners;
CREATE POLICY "Managers can view partners they created"
  ON public.partners FOR SELECT
  USING (public.is_manager() AND created_by = auth.uid());

DROP POLICY IF EXISTS "Managers can update partners they created" ON public.partners;
CREATE POLICY "Managers can update partners they created"
  ON public.partners FOR UPDATE
  USING (public.is_manager() AND created_by = auth.uid())
  WITH CHECK (public.is_manager() AND created_by = auth.uid());


-- ─── Audit trail ─────────────────────────────────────────────
-- Staff accounts can accept orders and see customer addresses and phone
-- numbers, so every creation and status change is recorded permanently.
CREATE TABLE IF NOT EXISTS public.staff_audit (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role     text NOT NULL,
  action         text NOT NULL
                 CHECK (action IN ('create', 'activate', 'deactivate', 'update', 'delete')),
  target_user_id uuid,
  target_role    text,
  target_email   text,
  details        jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read the full audit trail"
  ON public.staff_audit FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Managers read their own actions"
  ON public.staff_audit FOR SELECT
  USING (public.is_manager() AND actor_id = auth.uid());

-- Writes come from the edge function on the service role, which bypasses RLS.
-- No INSERT policy is granted, so nobody can forge an audit entry from the app.

CREATE INDEX IF NOT EXISTS staff_audit_actor_idx  ON public.staff_audit (actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS staff_audit_target_idx ON public.staff_audit (target_user_id, created_at DESC);


-- ─── Roster view for the staff screen ────────────────────────
-- One row per staff account, with the RLS of the underlying tables still
-- applying (security_invoker), so a manager sees only their own partners.
CREATE OR REPLACE VIEW public.staff_roster
WITH (security_invoker = true) AS
  SELECT
    p.user_id,
    'partner'::text     AS role,
    p.full_name,
    p.phone_number      AS phone,
    p.region,
    p.employee_code,
    p.is_active,
    p.created_by,
    p.created_at
  FROM public.partners p
  UNION ALL
  SELECT
    m.user_id,
    'manager'::text     AS role,
    m.full_name,
    m.phone,
    m.region,
    m.employee_code,
    m.is_active,
    m.created_by,
    m.created_at
  FROM public.managers m;


-- ─── Bootstrap the first admin ───────────────────────────────
-- Chicken-and-egg: only an admin can create staff, so the first one is
-- promoted here by email. Safe to re-run and a no-op if the account does not
-- exist yet — sign up with this address first, then re-run.
DO $$
DECLARE
  seed_email text := 'din1058@gmail.com';
  seed_id    uuid;
BEGIN
  SELECT id INTO seed_id FROM auth.users WHERE lower(email) = lower(seed_email) LIMIT 1;
  IF seed_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (seed_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
