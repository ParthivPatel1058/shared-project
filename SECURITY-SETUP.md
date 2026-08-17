# Sign-in security — what is built, and what you must switch on

The code is written and committed. **None of it is live yet** — applying the
migrations and deploying the function needs a Supabase access token, which is
not set in my shell. The steps below are the whole job.

---

## Read this first: email delivery is the blocker

Earlier in this project I verified that mail sends from the Resend **sandbox**
address `onboarding@resend.dev`, which only delivers to the Resend account
owner. A test to `parthiv1058@gmail.com` returned 200; a test to any other
address returned 500. `bhoomix.com` could not be verified because its DNS sits
on Afternic parking nameservers.

**If you turn 2FA on before a real sending domain is verified, every public
user is locked out permanently.** They will be asked for a code that can never
arrive.

That is why `MFA_REQUIRED` defaults to `false`. Everything is built and ready;
you flip one secret once mail actually works.

---

## Step 1 — Apply the migrations

```bash
supabase db push --project-ref tzmuivqtlnosgkubhyft
```

Or paste these two files into the SQL editor, in order:

1. `supabase/migrations/20260812000000_cart_quantity_cap.sql`
2. `supabase/migrations/20260812000100_mfa_challenges.sql`

## Step 2 — Set the function secrets

```bash
supabase secrets set MFA_ADMIN_EMAIL=parthiv1058@gmail.com --project-ref tzmuivqtlnosgkubhyft
supabase secrets set MFA_FROM_EMAIL=onboarding@resend.dev --project-ref tzmuivqtlnosgkubhyft
supabase secrets set RESEND_API_KEY=your_resend_key --project-ref tzmuivqtlnosgkubhyft
supabase secrets set MFA_REQUIRED=false --project-ref tzmuivqtlnosgkubhyft
```

The admin address lives in a secret, not in the app bundle, so it never ships
to the browser and can be changed without a redeploy.

## Step 3 — Deploy the function

```bash
supabase functions deploy login-2fa --project-ref tzmuivqtlnosgkubhyft
```

## Step 4 — Turn on email confirmation

Dashboard → Authentication → Providers → Email → **Confirm email: ON**.

This matters more than it looks. With it off, `signUp` hands back a working
session immediately, so anyone can create an account with an address they do
not own and be signed in straight away. That is the hole the kids at your
school walked through.

## Step 5 — Later, when a sending domain is verified

```bash
supabase secrets set MFA_FROM_EMAIL=noreply@yourdomain.com --project-ref tzmuivqtlnosgkubhyft
supabase secrets set MFA_REQUIRED=true --project-ref tzmuivqtlnosgkubhyft
```

From that moment every account except the admin needs an emailed code.

---

## How the sign-in actually works

```
browser  --{email, password}-->  login-2fa (start)
                                   |- domain on blocklist?      -> 403
                                   |- password wrong?           -> 401
                                   |- admin, or MFA off?        -> tokenHash
                                   `- otherwise: email a code   -> challengeId
browser  --{challengeId, code}-->  login-2fa (verify)
                                   `- correct?                  -> tokenHash
browser  --tokenHash-->  verifyOtp()  ->  real session
```

**The browser never calls `signInWithPassword`.** That is the point of the
whole design, and it is worth being clear about why, because the obvious
implementation is broken:

> Sign in with the password in React, then show a "enter your code" screen.

That version is decoration. `signInWithPassword` returns a working access
token the moment the password is right, so an attacker opens the console,
grabs the token, and never sees your code screen. The React gate stops nobody.

Here the password is checked inside the function, the resulting session is
discarded server-side, and the browser gets nothing it can use until the code
comes back. There is no token to steal early.

## Other protections in this change

- **Codes are stored as SHA-256**, never in the clear, so a leaked backup does
  not hand over live second factors.
- **Comparison is timing-safe**, so response time does not leak the code.
- **Five wrong attempts burns the challenge.** A six digit code is only a
  million guesses, which is nothing without a cap.
- **Five code requests per address per fifteen minutes**, so the endpoint
  cannot be used to spray mail at someone.
- **Codes expire in ten minutes and are single use.** Verification marks the
  row consumed *before* minting a session, so a replayed request finds it
  spent.
- **`mfa_challenges` has RLS on and no policies at all.** A signed-in user
  cannot read their own pending code out of the database and skip their inbox.
- **Wrong password and unknown account return the same message**, so the
  endpoint cannot be used to discover who has an account.
- **Disposable inboxes are refused** before the password is even checked, so a
  blocked domain cannot be used to probe which passwords are valid.

---

## Two things I want to flag

**1. The admin bypass is a real weakness, by design.**

You asked for `parthiv1058@gmail.com` to skip the code, and it does. But that
account is the one with the most access, and it is now the only one protected
by a password alone. If that password leaks, there is no second barrier.

There is an irony worth noticing: the admin address is currently the *only*
inbox that can receive a code. So the account that could most easily use 2FA
is the one exempted from it.

My suggestion, whenever testing is done: set `MFA_ADMIN_EMAIL` to an empty
string. Everything else keeps working and the admin gets the same protection
as everyone else.

**2. 2FA is not what stops the spam you described.**

You said kids were mass-creating accounts. 2FA protects *one account* from
someone who stole *its* password. It does not stop someone making a hundred
accounts with a hundred addresses.

What actually stops that, in order of effect:

1. **CAPTCHA on signup** — Supabase supports Cloudflare Turnstile natively.
   This is the single biggest win and it is not in this change, because it
   needs a Turnstile site key from you. Say the word and I will wire it in.
2. **Confirm email ON** (step 4 above) — already covered.
3. **Disposable domain blocking** — already covered.
4. **Lower the auth rate limits** — Dashboard → Authentication → Rate Limits.
   Drop signups per hour per IP to something like 5.
