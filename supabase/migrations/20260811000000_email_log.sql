-- =============================================================
-- Email delivery log.
--
-- Supabase hands auth mail to Resend and forgets it: the dashboard shows that
-- a reset was requested, never whether it arrived. When a farmer says "I never
-- got the email" that difference is the whole answer — sent-but-bounced and
-- never-sent need opposite fixes.
--
-- Resend knows, so we mirror its events back here and read them beside the
-- rest of the data.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.email_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Resend's id for the message. Several events share one id as the message
  -- moves from sent to delivered to opened.
  message_id   text,
  event_type   text NOT NULL,           -- sent | delivered | opened | clicked
                                        -- | bounced | complained | delivery_delayed
  recipient    text NOT NULL,
  subject      text,
  from_address text,

  -- Only present on failures, and the only field that explains a bounce.
  reason       text,

  occurred_at  timestamptz NOT NULL DEFAULT now(),
  raw          jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

-- Admins read it; nobody writes from the app. The webhook uses the service
-- role, which bypasses RLS, so no INSERT policy exists and an event cannot be
-- forged by a signed-in user.
DROP POLICY IF EXISTS "Admins read email events" ON public.email_events;
CREATE POLICY "Admins read email events"
  ON public.email_events FOR SELECT
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS email_events_recipient_idx ON public.email_events (recipient, occurred_at DESC);
CREATE INDEX IF NOT EXISTS email_events_message_idx   ON public.email_events (message_id);
CREATE INDEX IF NOT EXISTS email_events_type_idx      ON public.email_events (event_type, occurred_at DESC);

COMMENT ON TABLE public.email_events IS
  'Raw delivery events mirrored from Resend. One row per event; read email_log instead.';


-- ─── One row per message, like the Resend Emails screen ──────
CREATE OR REPLACE VIEW public.email_log AS
  SELECT
    message_id,
    max(recipient)                                        AS recipient,
    max(subject)                                          AS subject,
    -- Furthest point the message reached. A click implies an open, an open
    -- implies delivery, so the highest rank is the honest status.
    (array_agg(event_type ORDER BY
       CASE event_type
         WHEN 'bounced' THEN 100 WHEN 'complained' THEN 90
         WHEN 'clicked' THEN 50  WHEN 'opened' THEN 40
         WHEN 'delivered' THEN 30 WHEN 'delivery_delayed' THEN 20
         WHEN 'sent' THEN 10 ELSE 0 END DESC))[1]         AS status,
    max(reason)                                           AS failure_reason,
    min(occurred_at)                                      AS sent_at,
    max(occurred_at)                                      AS last_event_at,
    count(*)                                              AS event_count
  FROM public.email_events
  GROUP BY message_id
  ORDER BY min(occurred_at) DESC;

COMMENT ON VIEW public.email_log IS
  'One row per email with its furthest status — the Resend Emails screen, in Supabase.';


-- ─── What Supabase itself recorded, available with no webhook ─
-- Useful immediately and on its own: it answers "did we ask Resend to send
-- anything at all?", which is the first question when mail goes missing.
CREATE OR REPLACE VIEW public.auth_email_status AS
  SELECT
    u.email,
    u.email_confirmed_at,
    u.confirmation_sent_at,
    u.recovery_sent_at,
    u.last_sign_in_at,
    u.created_at,
    (u.email_confirmed_at IS NOT NULL)                    AS is_confirmed,
    CASE
      WHEN u.recovery_sent_at IS NULL THEN 'never requested'
      WHEN u.recovery_sent_at > now() - interval '1 hour' THEN 'reset link still valid'
      ELSE 'reset link expired'
    END                                                   AS reset_state
  FROM auth.users u
  ORDER BY u.created_at DESC;

COMMENT ON VIEW public.auth_email_status IS
  'Per account: confirmation and password-reset mail Supabase has sent.';

-- Both views expose every user email address, so the app must never read them.
REVOKE ALL ON public.email_log FROM anon, authenticated;
REVOKE ALL ON public.auth_email_status FROM anon, authenticated;
REVOKE ALL ON public.email_events FROM anon;
