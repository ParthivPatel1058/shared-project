# Supabase — operating guide

Everything about this project's database in one place: what it is, how to check
it, how to change it, and what to do when it breaks.

---

## The project

| | |
|---|---|
| **Live project ref** | `tzmuivqtlnosgkubhyft` (named `bhoomiconly`) |
| **Dashboard** | https://supabase.com/dashboard/project/tzmuivqtlnosgkubhyft |
| **SQL Editor** | https://supabase.com/dashboard/project/tzmuivqtlnosgkubhyft/sql/new |
| **Plan** | Free |

There is a **second, abandoned** Supabase project — `eskonpwvqqybfnoqkipk`
(`supabase-parthiv`). It is suspended and holds no data this app uses. It once
broke every Vercel deploy for ten days because it was attached as an
integration and Supabase auto-paused it. **Never re-attach it.** It is safe to
delete from the Supabase dashboard.

---

## Check the database in one command

```bash
npm run db:check
```

Prints every table, view, function and storage bucket the app depends on, and
whether it exists. Exits `1` if anything required is missing, so CI can gate on
it. Needs only the anon key — safe to run anywhere.

A table showing `exists (RLS closed to anon — correct)` is **healthy**: it means
row level security is doing its job.

---

## Apply the schema

Migrations live in `supabase/migrations/` and run in filename order.

### Option A — SQL Editor (no login needed)

Run these **as two separate executions**, in order:

1. `supabase/APPLY_STEP_1.sql` — enum types
2. `supabase/APPLY_STEP_2.sql` — tables, policies, views, seed data

Two runs are mandatory. Postgres refuses to *use* an enum value in the same
transaction that created it, and the SQL Editor wraps each execution in one
transaction. Pasting both together fails partway and leaves a half-applied
schema.

Both files are idempotent — safe to re-run if something goes wrong.

### Option B — CLI (needs an access token, see below)

```bash
supabase db push
```

---

## Deploy edge functions

Functions hold every secret; the browser never sees one.

| Function | Purpose | Secret it needs |
|---|---|---|
| `crop-vision` | Gemini crop disease diagnosis | `GEMINI_API_KEY` |
| `kisan-ai-chat` | Advisory chat | `GEMINI_API_KEY` |
| `translate` | Batch translation for 21 languages | `GEMINI_API_KEY` |
| `geocode` | Nominatim proxy (their policy needs a User-Agent) | none |
| `mandi-prices` | data.gov.in proxy + 1-hour cache | `DATAGOV_API_KEY` |
| `create-staff-account` | Creates manager/partner accounts | `SUPABASE_SERVICE_ROLE_KEY` (auto) |

```bash
# set a secret once
supabase secrets set DATAGOV_API_KEY=your-key --project-ref tzmuivqtlnosgkubhyft

# deploy one, or all
supabase functions deploy mandi-prices --project-ref tzmuivqtlnosgkubhyft
npm run fn:deploy
```

---

## Giving Claude direct access

Without a token, Claude can only read through the anon key with RLS enforced —
enough to *check* the database, not to change it. Every migration and function
deploy then falls to you.

To grant full access:

1. Create a personal access token at
   https://supabase.com/dashboard/account/tokens
2. Set it in your shell before starting Claude Code:

   ```powershell
   $env:SUPABASE_ACCESS_TOKEN = "sbp_..."
   ```

3. `.mcp.json` already declares the official Supabase MCP server and reads that
   variable. Restart Claude Code and it can list tables, run SQL, apply
   migrations and deploy functions directly.

The token is read from the environment and is **never** written to a file in
this repo. Treat it like a password: it can modify and delete your database.

---

## Security model

- **RLS is on for every table.** Default deny; policies are written against
  `auth.uid()`.
- **Role checks use `SECURITY DEFINER` helpers** (`is_admin()`, `is_manager()`,
  `my_role()`) so a policy on `user_roles` cannot recurse into itself.
- **Views use `security_invoker = true`** — without it a manager querying
  `staff_roster` would see every partner in the country.
- **`staff_audit` has no INSERT policy.** Only the service role writes to it, so
  an audit entry can never be forged from the app.
- **Delivery partners cannot see a customer's phone or address** until they
  accept the order. Enforced by the `get_partner_orders` RPC nulling those
  columns — not by a client-side condition.
- **Secrets never reach the browser.** The client gets `VITE_SUPABASE_URL` and
  the anon key only.

---

## Troubleshooting

**`npm run db:check` reports missing tables**
The schema has not been applied. Run the two SQL files above.

**Every deploy fails in ~1 second with `Resource provisioning failed`**
A Supabase integration attached to the Vercel project is paused. The real error
is only visible in the Vercel dashboard build log, not the CLI or API. Detach
the integration rather than unpausing it — a free-tier project auto-pauses again
after 7 idle days.

**Login works but every query 401s**
The anon key in `.env` belongs to a different project than `VITE_SUPABASE_URL`.
Both must come from the same project's API settings.

**`vercel build` produces a bundle with an undefined Supabase URL**
Use `npm run build` instead. `vercel build` has been observed to drop the
`VITE_*` variables, producing a site that loads and then fails on every
database call. Always confirm the bundle contains `supabase.co`:

```bash
grep -rl "supabase.co" dist/
```
