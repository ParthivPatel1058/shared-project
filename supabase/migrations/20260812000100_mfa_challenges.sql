-- =============================================================
-- Two-factor sign-in: emailed one-time codes.
--
-- The password is checked inside the `login-2fa` edge function and no session
-- is handed to the browser until the emailed code is verified. That ordering
-- is the whole point: `signInWithPassword` called from the browser already
-- returns a working token, so a code screen rendered in React would be
-- decoration — the attacker simply skips the screen and uses the token.
--
-- Nothing here is readable from the app. There is no SELECT policy, so a
-- signed-in user cannot read their own pending code out of the table and skip
-- their inbox. Only the service role, inside the edge function, touches it.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.mfa_challenges (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Kept alongside user_id so a challenge can be rate limited by address even
  -- before we know which account it belongs to.
  email        text NOT NULL,
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,

  -- SHA-256 of the code. Storing the code itself would mean a leaked backup
  -- hands over live second factors.
  code_hash    text NOT NULL,

  expires_at   timestamptz NOT NULL,
  consumed_at  timestamptz,

  -- Bounded so a challenge cannot be brute forced: a six digit code is only a
  -- million guesses, which is nothing without a cap.
  attempts     smallint NOT NULL DEFAULT 0,

  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mfa_challenges ENABLE ROW LEVEL SECURITY;
-- Deliberately no policies: default deny for anon and authenticated.
REVOKE ALL ON public.mfa_challenges FROM anon, authenticated;

CREATE INDEX IF NOT EXISTS mfa_challenges_email_idx
  ON public.mfa_challenges (lower(email), created_at DESC);
CREATE INDEX IF NOT EXISTS mfa_challenges_expiry_idx
  ON public.mfa_challenges (expires_at);

COMMENT ON TABLE public.mfa_challenges IS
  'Pending email second-factor codes. Written only by the login-2fa function.';


-- ─── Disposable address blocklist ────────────────────────────
-- "Only a real email" means throwaway inboxes must not work. Kept as a table
-- rather than a constant in the function so a new domain can be blocked
-- without a redeploy.
CREATE TABLE IF NOT EXISTS public.blocked_email_domains (
  domain     text PRIMARY KEY,
  added_at   timestamptz NOT NULL DEFAULT now(),
  note       text
);

ALTER TABLE public.blocked_email_domains ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.blocked_email_domains FROM anon, authenticated;

INSERT INTO public.blocked_email_domains (domain, note) VALUES
  ('mailinator.com',      'disposable'),
  ('yopmail.com',         'disposable'),
  ('guerrillamail.com',   'disposable'),
  ('sharklasers.com',     'disposable'),
  ('10minutemail.com',    'disposable'),
  ('tempmail.com',        'disposable'),
  ('temp-mail.org',       'disposable'),
  ('throwawaymail.com',   'disposable'),
  ('trashmail.com',       'disposable'),
  ('getnada.com',         'disposable'),
  ('dispostable.com',     'disposable'),
  ('maildrop.cc',         'disposable'),
  ('fakeinbox.com',       'disposable'),
  ('mohmal.com',          'disposable'),
  ('emailondeck.com',     'disposable'),
  ('spamgourmet.com',     'disposable'),
  ('mailnesia.com',       'disposable'),
  ('inboxkitten.com',     'disposable'),
  ('tempr.email',         'disposable'),
  ('minuteinbox.com',     'disposable')
ON CONFLICT (domain) DO NOTHING;

COMMENT ON TABLE public.blocked_email_domains IS
  'Throwaway inbox domains refused at signup and sign-in.';


-- ─── Housekeeping ────────────────────────────────────────────
-- Consumed and expired challenges have no value and should not accumulate.
CREATE OR REPLACE FUNCTION public.purge_expired_mfa_challenges()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  removed integer;
BEGIN
  DELETE FROM public.mfa_challenges
   WHERE expires_at < now() - interval '1 day';
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$$;

REVOKE ALL ON FUNCTION public.purge_expired_mfa_challenges() FROM anon, authenticated;
