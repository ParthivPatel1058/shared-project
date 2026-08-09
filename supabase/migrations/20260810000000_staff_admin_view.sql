-- =============================================================
-- Staff administration moves to the Supabase dashboard.
--
-- The staff screen was removed from the app: a farmer opening BhoomiX has no
-- business seeing "Staff Accounts" in their sidebar, and hiding a row by role
-- is presentation, not security. Administration now happens in Supabase,
-- where access is already controlled by project membership.
--
-- `staff_roster` is replaced with a view that is actually readable in the
-- Table Editor — it joins the login email and who created each account,
-- neither of which the old version exposed.
-- =============================================================

DROP VIEW IF EXISTS public.staff_roster;

-- SECURITY DEFINER, not invoker: this view reads auth.users, which no client
-- role may query directly. It is protected instead by the grant below —
-- revoked from anon and authenticated, so it is reachable only from the
-- dashboard and the service role, never from the browser.
CREATE VIEW public.staff_roster
WITH (security_invoker = false) AS
  SELECT
    p.user_id,
    u.email,
    'partner'                                   AS role,
    p.full_name,
    p.phone_number                              AS phone,
    p.region,
    p.employee_code,
    p.vehicle_type,
    p.is_active,
    creator.email                               AS created_by_email,
    p.created_at,
    u.last_sign_in_at,
    (u.last_sign_in_at IS NOT NULL)             AS has_signed_in
  FROM public.partners p
  JOIN auth.users u        ON u.id = p.user_id
  LEFT JOIN auth.users creator ON creator.id = p.created_by

  UNION ALL

  SELECT
    m.user_id,
    u.email,
    'manager',
    m.full_name,
    m.phone,
    m.region,
    m.employee_code,
    NULL,
    m.is_active,
    creator.email,
    m.created_at,
    u.last_sign_in_at,
    (u.last_sign_in_at IS NOT NULL)
  FROM public.managers m
  JOIN auth.users u        ON u.id = m.user_id
  LEFT JOIN auth.users creator ON creator.id = m.created_by

  UNION ALL

  -- Admins hold no profile row of their own; without this an admin would be
  -- invisible on the very screen used to audit who has power.
  SELECT
    r.user_id,
    u.email,
    'admin',
    COALESCE(pr.full_name, split_part(u.email, '@', 1)),
    pr.phone,
    NULL, NULL, NULL,
    true,
    NULL,
    r.created_at,
    u.last_sign_in_at,
    (u.last_sign_in_at IS NOT NULL)
  FROM public.user_roles r
  JOIN auth.users u          ON u.id = r.user_id
  LEFT JOIN public.profiles pr ON pr.id = r.user_id
  WHERE r.role = 'admin';

COMMENT ON VIEW public.staff_roster IS
  'Every staff account with its login email, creator and last sign-in. '
  'Dashboard/service-role only — not exposed to the app.';

-- The app must not be able to read this: it exposes email addresses and
-- sign-in times for every member of staff.
REVOKE ALL ON public.staff_roster FROM anon, authenticated;


-- Roles at a glance, for the same audit question asked the other way round.
CREATE OR REPLACE VIEW public.account_roles AS
  SELECT
    u.id                                        AS user_id,
    u.email,
    COALESCE(
      array_agg(r.role::text ORDER BY r.role) FILTER (WHERE r.role IS NOT NULL),
      ARRAY['user']
    )                                           AS roles,
    u.created_at,
    u.last_sign_in_at
  FROM auth.users u
  LEFT JOIN public.user_roles r ON r.user_id = u.id
  GROUP BY u.id, u.email, u.created_at, u.last_sign_in_at;

COMMENT ON VIEW public.account_roles IS
  'One row per account with every role it holds. Dashboard/service-role only.';

REVOKE ALL ON public.account_roles FROM anon, authenticated;
