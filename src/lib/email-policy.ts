/**
 * Throwaway inbox domains refused at signup.
 *
 * This is the polite half of the check. It gives an honest user an immediate,
 * clear error instead of a silent failure later, but it is trivially bypassed
 * by anyone using the API directly. The enforcement that actually holds lives
 * in the `login-2fa` edge function and the `blocked_email_domains` table,
 * which are consulted server-side on every sign-in.
 *
 * Keep this list in step with the seed rows in
 * `supabase/migrations/20260812000100_mfa_challenges.sql`.
 */
const BLOCKED = new Set([
  'mailinator.com',
  'yopmail.com',
  'guerrillamail.com',
  'sharklasers.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'throwawaymail.com',
  'trashmail.com',
  'getnada.com',
  'dispostable.com',
  'maildrop.cc',
  'fakeinbox.com',
  'mohmal.com',
  'emailondeck.com',
  'spamgourmet.com',
  'mailnesia.com',
  'inboxkitten.com',
  'tempr.email',
  'minuteinbox.com',
]);

/** True when the address uses a known disposable inbox provider. */
export function isDisposableEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split('@')[1];
  return domain ? BLOCKED.has(domain) : false;
}
