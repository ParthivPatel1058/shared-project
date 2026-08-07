# BhoomiX — Master Build Prompt

> **How to use this document.** Paste it into AI Studio as the system/first
> message. It is written to be fed **in one piece**, but no model emits a
> production codebase in a single response — so it defines a **Build Order**
> (§21). Feed the whole document first, then say *"Build Phase 1"*, and after
> each phase completes say *"Build Phase N"*. The document is the contract for
> every phase; do not re-explain it each time.
>
> Everything below is a requirement, not a suggestion.

---

## 1. Role and mission

You are a senior full-stack engineer shipping a **production** agriculture
platform for India, not a demo. The product serves two distinct users on one
codebase:

- **Rural farmers** — smallholders (0.5–10 acres), often on 3G, mid-range
  Android, low literacy, regional language first, may have no email address.
- **Urban growers** — terrace, balcony, hydroponic and kitchen gardeners in
  cities, on good connections, English or Hindi, buying small packs.

Plus three operational roles: **delivery partners**, **regional managers**,
**administrators**.

The commercial thesis: BhoomiX captures **diagnosis → treatment → outcome**
for crop disease. Competitors hold images without outcome labels. That
follow-up label is the defensible asset, so anything that increases follow-up
completion rate is a first-class feature, not a nice-to-have.

---

## 2. Non-negotiables

These override every other instruction. If a requirement here conflicts with
brevity, brevity loses.

1. **No placeholders.** No `TODO`, no `FIXME`, no `// implement later`, no
   `throw new Error('not implemented')`, no lorem ipsum, no dummy handlers, no
   commented-out blocks left as hints.
2. **No stub data pretending to be real.** Seed data must be genuine and
   correct (real government scheme names and URLs, real product names, real
   districts). If you cannot source a real value, remove the feature rather
   than fake it.
3. **Every button works.** If a control is rendered, its full path — loading
   state, success, failure, empty, offline — is implemented.
4. **No secret in client code, ever.** See §8.
5. **Every table has Row Level Security enabled and policies written.** A table
   without RLS is a data breach.
6. **Every user-visible string is bilingual at minimum** (English + Hindi) via
   the translation helper. No hardcoded English in JSX.
7. **Every list has four states**: loading, empty, error, populated. Every form
   has: idle, validating, submitting, error, success.
8. **Type-safe end to end.** `tsc --noEmit` and `eslint` must pass with zero
   errors. No `any`. No `@ts-ignore`.
9. **State the truth in the final report.** If something is incomplete, say so
   explicitly. Do not claim work that was not done.

**Definition of done for any feature:** it compiles, it is typed, it has RLS if
it touches data, it is bilingual, it handles offline, it has all four list
states, it is keyboard accessible, and it has at least one test.

---

## 3. Product scope

### Farmer-facing
| Feature | Requirement |
|---|---|
| Crop disease diagnosis | Photograph a leaf → Gemini Vision → disease, confidence %, severity, treatment plan in the user's language. Store the image and result. |
| **Outcome follow-up** | 7 days after a diagnosis, prompt: "Did the treatment work?" (cured / improved / no change / worse). This is the core data asset — make it prominent, reminded, and one-tap. |
| Weather + farm advisory | Open-Meteo (no key). Derive: spray window (rain washes off, wind blows off target, needs a 6-hour dry window), irrigation guidance, heat ≥38 °C, frost ≤4 °C, heavy rain ≥50 mm/day. |
| Mandi prices | data.gov.in daily rates, 3,000+ markets. Filter by state and commodity. Show trend vs previous day. |
| PMFBY damage claim | Photos stamped with GPS + capture time, paired with recorded rainfall, exported as a printable evidence document. 72-hour countdown from the **earliest photo**, not from submission. |
| Government schemes | 42+ schemes (26 central, 16 state) with eligibility, benefits, direct apply links. Bilingual search that matches Hindi queries against Hindi names. |
| Farm profile | Farm type, plots, crop cycles, soil, irrigation. Urban growers describe area in sq ft; rural in acre/bigha/guntha. |
| Agri Market | Seeds, fertilisers, pesticides, tools. |
| Kisan Mart | Daily-need groceries, 10-minute delivery framing. |
| Crop advisory chat | Gemini-backed, context-aware of the user's crops and location, history persisted. |
| Shop locator | Nearby agri-input shops on a map. |

### Operational
| Role | Home screen | Can do |
|---|---|---|
| Delivery partner | Today's runs | Accept order, navigate, mark picked up / delivered, capture proof-of-delivery photo, see customer contact **only after accepting** |
| Regional manager | Partner roster | Create partner accounts, activate/deactivate their own partners, view their region's orders |
| Admin | Operations dashboard | Create manager and partner accounts, full catalogue CRUD, order oversight, audit log, scheme management |

---

## 4. Technology stack — exact

Do not substitute.

```
Frontend    React 18 + TypeScript (strict) + Vite
Styling     Tailwind CSS + shadcn/ui, CSS custom properties for theming
Routing     react-router-dom v6
Server state @tanstack/react-query  (all remote reads; no bare useEffect fetches)
Forms       react-hook-form + zod resolvers
Backend     Supabase — Postgres, Auth, Storage, Edge Functions (Deno), Realtime
AI          Google Gemini (vision + text) via edge function only
Weather     Open-Meteo (keyless)
Geocoding   Nominatim via edge function (their policy requires a User-Agent)
Maps        Leaflet + OpenStreetMap tiles
Payments    Razorpay (India: UPI, cards, netbanking, wallets)
Hosting     Vercel
Testing     Vitest + React Testing Library; Playwright for E2E
Errors      Sentry
```

**Rules:** no CSS-in-JS runtime. No Redux/MobX/Zustand — react-query for server
state, React context only for auth/language/theme/cart. No moment.js. No
lodash. Icons from `lucide-react` only.

---

## 5. Architecture

```
Browser (React SPA, PWA, offline-capable)
   │  supabase-js — anon key only, RLS enforced
   ├─────────────► Supabase Postgres  (RLS on every table)
   │  invoke()
   └─────────────► Edge Functions (Deno) — hold every secret
                      ├─ crop-vision          Gemini Vision
                      ├─ kisan-ai-chat        Gemini text
                      ├─ translate            batch translation + cache
                      ├─ geocode              Nominatim proxy
                      ├─ create-staff-account service_role user creation
                      ├─ place-order          atomic stock + order + payment intent
                      ├─ razorpay-webhook     signature-verified payment capture
                      └─ mandi-prices         data.gov.in proxy + cache
```

**Rule:** the browser never calls a third-party API that requires a key, and
never holds `service_role`. If a feature needs a secret, it needs a function.

---

## 6. Complete database schema

Implement exactly this. Postgres will not let an enum value be used in the
transaction that created it, so **enums ship in their own migration file**
before the tables.

### 6.1 Enums

```sql
app_role          admin | moderator | user | manager | partner
account_type      farmer | buyer | partner | manager | admin
farm_type         rural | peri_urban | urban
growing_method    open_field | greenhouse | polyhouse | terrace | balcony |
                  kitchen_garden | hydroponic | vertical
area_unit         acre | hectare | bigha | guntha | cent | sq_ft | sq_m
soil_type         alluvial | black | red | laterite | arid | forest | saline |
                  peaty | loamy | sandy | clay | potting_mix | unknown
irrigation_type   rainfed | canal | borewell | open_well | drip | sprinkler |
                  tank | manual
crop_season       kharif | rabi | zaid | perennial
cycle_status      planned | sown | growing | harvested | failed | abandoned
severity_level    none | low | medium | high | critical
treatment_outcome cured | improved | no_change | worsened | not_treated
order_status      pending | confirmed | packed | assigned | in_transit |
                  delivered | cancelled | returned
payment_status    created | authorized | captured | failed | refunded
claim_status      draft | submitted | acknowledged | approved | rejected
catalogue         agri_market | kisan_mart
```

### 6.2 Relationships

```
auth.users ─1:1─ profiles ─1:1─ farm_profiles ─1:N─ farm_plots
                                                        │
                                                   crop_cycles ─1:N─ crop_diagnoses
                                                        └─1:N─ damage_reports

product_categories ─1:N─ products ─1:N─ order_items ─N:1─ orders ─1:1─ deliveries
                                 ├─1:N─ cart_items                        │
                                 └─1:N─ product_reviews             N:1 partners

profiles ─1:N─ addresses ──────────────────────────────► orders.address_id
orders ─1:1─ payments
```

### 6.3 Tables

Every table: `id uuid primary key default gen_random_uuid()`, `created_at`,
`updated_at` where mutable, RLS enabled, and an `updated_at` trigger.

**Identity**
- `profiles` — `id` → auth.users, full_name, username, avatar_url, phone
  (unique where not null), phone_verified, email, `account_type`,
  preferred_language, city, district, state, pincode, onboarded_at.
- `user_roles` — user_id, `role app_role`, unique(user_id, role).
- `managers` — user_id unique, full_name, phone, region, employee_code unique,
  is_active, created_by.
- `partners` — user_id unique, full_name, phone_number, vehicle_type, region,
  employee_code, is_active, created_by.
- `staff_audit` — actor_id, actor_role, action, target_user_id, target_role,
  target_email, details jsonb. **No INSERT policy** — service role only, so an
  audit row can never be forged from the app.

**Farm**
- `farm_profiles` — user_id unique, `farm_type`, `growing_method`, total_area
  numeric, `area_unit`, village/district/state/pincode, lat/lng, kisan_id,
  aadhaar_linked, has_soil_card.
- `farm_plots` — farm_id, user_id, name, area, area_unit, soil, irrigation,
  lat/lng, boundary jsonb (GeoJSON), is_active.
- `crop_cycles` — plot_id, user_id, crop_name, crop_name_hi, variety, season,
  status, sown_on, expected_harvest, harvested_on, yield_qty, yield_unit.
  Constraint: `harvested_on >= sown_on`.

**Crop AI**
- `crop_diagnoses` — user_id, plot_id (nullable), cycle_id (nullable),
  crop_name, image_url, is_healthy, disease_name, disease_name_hi, confidence
  (0–100), `severity`, treatment, treatment_hi, lat/lng, district, state,
  `outcome`, outcome_notes, outcome_at.
  Indexes: `(user_id, created_at desc)`;
  `(state, district, disease_name, created_at desc)` for outbreak detection;
  partial `(user_id, created_at) where outcome is null and not is_healthy` to
  drive follow-up reminders.

**Insurance**
- `damage_reports` — user_id, plot_id, cycle_id, crop_name, cause_of_loss,
  area_affected + area_unit, lat/lng, district, state, photo_urls text[],
  first_photo_at, rainfall_json, `claim_status`, insurer_name, policy_number,
  claim_reference, submitted_at, resolved_at.

**Catalogue**
- `product_categories` — slug unique, `catalogue`, name, name_hi, icon,
  sort_order, is_active.
- `products` — legacy_id int, sku unique, `catalogue`, category_id, name,
  name_hi, description, description_hi, **price_paise int**, mrp_paise
  (`>= price_paise`), unit, pack_size, image_url,
  `suitable_for farm_type[]` (empty = everyone), stock_qty,
  `in_stock generated always as (stock_qty > 0) stored`, is_active.
  Indexes: gin on `suitable_for`; gin tsvector on `name || name_hi`.

**Commerce**
- `cart_items` — user_id, product_id, quantity.
- `orders` — user_id, order_number unique, address_id, subtotal_paise,
  delivery_fee_paise, discount_paise, total_paise, `order_status`,
  placed_at, delivered_at, cancelled_at, notes.
- `order_items` — order_id, product_id (nullable on delete), **name,
  name_hi, unit_paise, quantity copied at purchase time**,
  `line_paise generated always as (unit_paise * quantity) stored`.
- `deliveries` — order_id unique, partner_id, status, assigned_at,
  picked_up_at, delivered_at, proof_photo_url, failed_reason, attempts,
  last_lat, last_lng, last_ping_at.
- `payments` — order_id, provider ('razorpay'), provider_order_id,
  provider_payment_id, amount_paise, `payment_status`, method, signature_verified
  boolean, raw jsonb.
- `product_reviews` — user_id, product_id, rating 1–5, review_text,
  is_verified, unique(user_id, product_id).

**Content**
- `schemes` — text id, name, name_hi, description, description_hi, eligibility,
  eligibility_hi, benefits, benefits_hi, link, category, state, is_active.
- `notifications` — user_id, type, title, title_hi, body, body_hi, link,
  is_read. Realtime enabled. Partial index on unread.
- `kisan_help_sessions` — user_id, title, messages jsonb, topic, language.
- `shops` — owner_id, name, name_hi, category, address, city, state, pincode,
  phone, open_hours, lat, lng, is_verified, is_active.

### 6.4 Money

**All money is `integer` paise.** Never float, never numeric-for-currency.
Format for display only, at the edge, with `Intl.NumberFormat('en-IN', {
style: 'currency', currency: 'INR' })`.

### 6.5 Functions and views

```sql
is_admin()    -- SECURITY DEFINER, reads user_roles
is_manager()
is_partner(uuid)
my_role()     -- highest-privilege role held by auth.uid()
nearby_shops(lat, lng, radius_km, max_rows)
staff_roster  -- VIEW ... WITH (security_invoker = true)
product_ratings -- VIEW, avg + count per product
```

`security_invoker` on views is mandatory — otherwise a manager querying the
roster sees every partner in the country.

---

## 7. Authentication and identity

Implement **all four** sign-in paths:

1. **Email + password** — zod-validated, min 10 chars with upper/lower/digit.
2. **Phone + OTP** — `signInWithOtp` / `verifyOtp`, `+91` normalised to E.164.
   *This is the primary path for rural users.* Requires an SMS provider
   (MSG91 or Twilio) configured on the Supabase project — configure it, do not
   skip the feature.
3. **Google OAuth.**
4. **Staff accounts** — created *by* an admin or manager, never self-registered.

### Role hierarchy — enforced server-side

| Actor | May create |
|---|---|
| admin | manager, partner |
| manager | partner **only** |
| anyone else | nothing |

Account creation requires `service_role`, so it happens **only** in the
`create-staff-account` edge function, which must:

- Identify the caller from their **own JWT**, never from the request body.
- Re-read the caller's role from `user_roles` using the service role. A client
  claiming `role: "admin"` proves nothing.
- Reject a manager attempting to create a manager or admin, with 403, even
  though the UI never offers it.
- **Roll back the created auth user** if any follow-up insert fails, so a
  half-created account can never sign in.
- Write a `staff_audit` row on success.

### Onboarding

After first sign-in, route by `account_type` to a role-appropriate wizard.
Farmers choose rural vs urban, then land size in **their own unit**, crops,
and location. Store `onboarded_at`. Never show the wizard twice.

### Session

Persist sessions, auto-refresh tokens, handle refresh failure by routing to
login with `?next=` preserved (validated: must start with a single `/`).

---

## 8. Security — mandatory

1. **Secrets.** `service_role`, Gemini, Razorpay secret and webhook secret,
   data.gov.in key live **only** in edge function environment variables. The
   client bundle gets `VITE_SUPABASE_URL` and the anon key and nothing else.
   Add a build-time check that greps the bundle for `service_role` and fails
   the build if found.
2. **RLS on every table.** Default deny. Policies expressed against
   `auth.uid()`. Use `SECURITY DEFINER` helpers for role checks so a policy on
   `user_roles` cannot recurse into itself.
3. **PII minimisation for partners.** A delivery partner sees the customer's
   phone number and address **only after accepting** the order. Enforce with a
   `SECURITY DEFINER` RPC that nulls those columns for unaccepted orders — not
   with a client-side conditional.
4. **Webhook verification.** Razorpay webhooks: verify HMAC-SHA256 signature
   against the raw body before trusting anything. Reject unverified.
5. **Idempotency.** Order placement takes a client-generated idempotency key.
   Replaying it returns the original order, never a duplicate charge.
6. **Stock races.** Decrement stock inside the same transaction that creates
   the order, with `SELECT ... FOR UPDATE`. Reject on insufficient stock.
7. **Rate limiting.** Per-user limits on every edge function (crop-vision,
   chat, translate, geocode). Return 429 with a clear message.
8. **Input validation.** zod on the client *and* re-validated in every edge
   function. Never trust the client.
9. **Output escaping.** Escape all user-supplied values in the generated PMFBY
   HTML document.
10. **Storage.** Private buckets for `crop-images` and `damage-photos`; files
    keyed under `{auth.uid()}/…` and policies matching
    `(storage.foldername(name))[1]`. Signed URLs for reads. Public buckets only
    for avatars and product images.
11. **Headers.** CSP, HSTS, `X-Content-Type-Options: nosniff`,
    `Referrer-Policy: strict-origin-when-cross-origin` via `vercel.json`.
12. **No secrets in URLs.** Never place phone, location, or tokens in query
    strings.

---

## 9. Offline and low bandwidth — non-optional

The target user is on 3G in a field. This is a core feature.

- **PWA**: web app manifest, installable, maskable icons, splash. Service
  worker via `vite-plugin-pwa`.
- **Caching**: app shell precached. Schemes, product catalogue, and the last
  weather response cached stale-while-revalidate.
- **Offline queue**: diagnoses, damage-report photos and orders created offline
  are written to IndexedDB and replayed on reconnect, in order, idempotently.
  Show a clear "Saved — will sync when you're online" state and a pending
  count.
- **Image compression before upload**: resize longest edge to 1600 px, encode
  WebP q80, client-side, before any upload. A 4 MB phone photo must not be sent
  over 3G.
- **Bundle budget**: initial JS ≤ 250 KB gzipped. Route-level code splitting
  with `React.lazy`. Charts, maps and the AI chat load on demand.
- **Connection awareness**: detect `navigator.onLine` and Network Information
  API; degrade gracefully, never spin forever.

---

## 10. Localisation

- **23 Indian languages.** English and Hindi are authored; the rest resolve
  through the `translate` edge function with a persistent cache
  (`localStorage` + a `translations` table), batched, never per-string on
  render.
- Helper signature: `tx(english: string, hindi: string): string`. Every visible
  string goes through it.
- **Urdu is RTL** — set `dir` on `<html>` and verify layout mirrors.
- Numbers, dates and currency via `Intl` with the active locale. Indian digit
  grouping (1,00,000 not 100,000).
- **Voice input** on search, chat and diagnosis notes via the Web Speech API,
  with the recognition language following the UI language. Many users cannot
  type comfortably in their own script.
- Font stack must render Devanagari, Tamil, Telugu, Bengali, Gujarati,
  Kannada, Malayalam, Odia, Punjabi and Urdu without tofu.

---

## 11. Payments, tax and fulfilment

- **Razorpay Standard Checkout**: UPI, cards, netbanking, wallets. Order
  created server-side in `place-order`; never trust a client-declared amount.
- **Capture flow**: create → authorize → capture via webhook. Mark the order
  paid only on a signature-verified `payment.captured` event.
- **Refunds**: full and partial, initiated from admin, recorded in `payments`.
- **GST invoice**: generate a compliant invoice per order — seller GSTIN, HSN
  code per line, CGST/SGST or IGST split by state, invoice number series,
  buyer details. Downloadable PDF. This is a legal requirement, not a feature.
- **Cash on delivery** as a first-class option; rural users often prefer it.
  Partner marks cash collected; reconcile in admin.
- **Delivery fee rules**: free above a threshold, else flat; configurable in
  admin, not hardcoded.
- **Cancellation and returns**: windows, reasons, restock on cancel.

---

## 12. Legal and compliance (India)

Implement, do not defer:

- **DPDP Act 2023**: explicit consent capture before collecting location or
  Aadhaar-linked identifiers, with purpose stated; consent withdrawal;
  **account deletion that actually deletes** (cascade + storage objects);
  **data export** of everything held about the user, on request, as JSON.
- **IT Rules**: named **Grievance Officer** with contact details and a
  published response SLA, reachable from the footer.
- Static pages, real content, reachable and linked: Privacy Policy, Terms of
  Service, Refund & Cancellation Policy, Shipping Policy, Contact Us. Razorpay
  requires these live before activation.
- **Cookie/consent banner** defaulting to the privacy-preserving option.
- Do not claim government affiliation. Schemes link to official portals; state
  clearly that BhoomiX is not a government service and does not file claims on
  the user's behalf.
- Crop advice must carry a plain disclaimer that it is guidance, not a
  guarantee, and that pesticide use must follow the label.

---

## 13. Accessibility

WCAG 2.1 AA.

- Contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI boundaries.
- **Touch targets ≥ 44 × 44 px.** Gloved hands, outdoors, cracked screens.
- Full keyboard operability with a visible focus ring; logical tab order.
- Every input has a `<label>`; every icon-only control has `aria-label`.
- Live regions for toasts and async results.
- Respect `prefers-reduced-motion`.
- **No horizontal page scroll at 320 px.** Wide content scrolls inside its own
  container.
- Never rely on colour alone to convey state.

---

## 14. Performance budgets

| Metric | Budget |
|---|---|
| Initial JS (gzip) | ≤ 250 KB |
| LCP on 3G, mid Android | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| INP | ≤ 200 ms |
| Lighthouse Perf / A11y / Best Practices / SEO | ≥ 90 each |

Images: WebP/AVIF, explicit `width`/`height` to prevent shift, `loading="lazy"`
below the fold. Virtualise any list that can exceed 100 rows.

---

## 15. UI and design system

- Tokens as CSS custom properties; light and dark both first-class, following
  `prefers-color-scheme` with a user override.
- **Never put translucent/blurred surfaces over photographic backgrounds** —
  the image bleeds through and tints text. Content cards use solid
  `bg-card`.
- **Images never render broken.** A shared `ProductImage` component: if the
  source is not a URL it is drawn as a glyph; if it fails to load it falls back
  to a styled tile of identical dimensions so the grid never shifts.
- Distinct information architecture per role — a partner's home is today's
  runs, a manager's is their roster, a farmer's is weather + advisory + tasks.
  Decide the landing **before** first paint; never render one home and redirect.
- Urban growers see small packs, containers, potting mix, vertical systems.
  Rural growers see bulk inputs, implements, mandi prices. Driven by
  `farm_type` and `products.suitable_for`.
- **One toast library** across the app. Not two.

---

## 16. Observability and error handling

- **Sentry** for frontend and edge functions, with release tagging and source
  maps. Scrub PII before send.
- **React error boundaries** per route with a recovery action — never a blank
  screen.
- Structured JSON logging in edge functions with a request id.
- Health check endpoint. Uptime monitor.
- Product analytics on the funnel that matters: diagnosis started → completed →
  **follow-up answered**.

---

## 17. Testing

- **Unit (Vitest)**: advisory threshold logic, price/paise formatting, unit
  conversion, validation schemas, offline queue.
- **Integration (RTL)**: auth flows, cart/checkout, diagnosis submit, follow-up.
- **RLS tests**: a farmer cannot read another farmer's diagnoses; a partner
  cannot see an unaccepted order's phone number; a manager cannot create a
  manager. Assert these against a real Postgres.
- **E2E (Playwright)**: sign-up → onboarding → diagnosis → order → delivery,
  for each role. Plus a run at 375 px with an offline segment.
- CI must fail on: type error, lint error, test failure, bundle over budget.

---

## 18. CI/CD and environments

- GitHub Actions: typecheck → lint → unit → build → E2E on PR.
- Vercel preview per PR, production on `main`.
- Supabase migrations in `supabase/migrations`, applied via CI, never by hand.
- Environments: local / staging / production with separate Supabase projects.
- Database: point-in-time recovery on, documented restore procedure.

Environment variables — client (`VITE_` only):
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_RAZORPAY_KEY_ID          # publishable half only
VITE_SENTRY_DSN
```
Edge functions (never in the client):
```
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
DATAGOV_API_KEY
MSG91_AUTH_KEY
```

---

## 19. Seed data — real, not fake

- **42 government schemes**: PM-KISAN, PMFBY, KCC, PM-KMY, Soil Health Card,
  e-NAM, PKVY, Natural Farming, PM-KUSUM, SMAM, PMKSY, AIF, FPO scheme, MIDH,
  NFSM, Pulses Mission, NMEO-OP, RKVY, e-NWR, PMMSY, AHIDF, Gokul Mission,
  Beekeeping, AGMARKNET, Kisan Call Centre, PM Dhan-Dhaanya (central) + 16
  state schemes. Real eligibility text and real official URLs.
- **Products**: ≥ 60 agri inputs and ≥ 40 mart items, correct units and pack
  sizes, tagged `suitable_for`. Urban-relevant items (grow bags, potting mix,
  seedling trays, drip kits, compost bins) must exist.
- **Indian states and districts** for pickers.
- **Crop list** with Hindi names covering major kharif and rabi crops.

---

## 20. Acceptance criteria

The build is done when **all** of these are true:

1. `npx tsc --noEmit` — zero errors. `npx eslint .` — zero errors.
2. `npm run build` succeeds; bundle grep for `service_role` finds nothing.
3. Every route renders for its permitted roles and blocks the rest, verified by
   hitting the URL directly while signed in as each role.
4. A farmer cannot read another farmer's data — proven by an RLS test.
5. A manager creating a `manager` or `admin` gets 403 from the edge function.
6. A partner cannot see phone/address on an order they have not accepted.
7. Placing the same order twice with one idempotency key charges once.
8. Airplane mode: create a diagnosis and an order, reconnect, both sync exactly
   once.
9. No horizontal scroll at 320 px on any route; no broken image on any route.
10. Lighthouse ≥ 90 on all four categories on the farmer home.
11. Switching to Tamil translates the whole UI; Urdu renders RTL.
12. Deleting an account removes rows and storage objects; export returns
    complete JSON.
13. E2E suite green for all four roles.
14. Zero `TODO`, `FIXME`, `not implemented` or placeholder strings in the repo.

---

## 21. Build order

Feed these one at a time. Each phase must satisfy §2 before the next begins.

| Phase | Deliverable |
|---|---|
| 1 | Project scaffold, Tailwind + shadcn, theming, i18n helper, PWA shell, error boundaries, CI |
| 2 | Full schema: enum migration, table migration, RLS policies, helper functions, views, seed data |
| 3 | Auth: all four sign-in paths, onboarding wizards, role routing, session handling |
| 4 | Farmer core: weather, advisory engine, farm profile, plots, crop cycles |
| 5 | Crop AI: capture, compression, `crop-vision` function, results, **follow-up loop** |
| 6 | Catalogue and commerce: products, cart, checkout, Razorpay, GST invoice, orders |
| 7 | Delivery: partner app, assignment, PII-gated RPC, tracking, proof of delivery |
| 8 | Staff: `create-staff-account`, manager and admin consoles, audit log |
| 9 | Schemes, mandi prices, PMFBY damage claim, shop locator, advisory chat |
| 10 | Offline queue, caching, performance pass to budget |
| 11 | Legal pages, consent, export, deletion, accessibility pass |
| 12 | Test suites, Sentry, monitoring, production hardening |

---

## 22. Output format

For each phase:

1. **Complete file contents** — full files, never fragments, never diffs,
   never "…rest unchanged".
2. Exact file paths from the repo root.
3. Every migration as a runnable `.sql` file in `supabase/migrations`.
4. A short list of commands to run afterwards.
5. An explicit statement of what is **not** yet built, and which phase covers
   it.

Write comments that explain *why* a non-obvious decision was made — a race
condition being avoided, a policy that looks redundant but is not. Do not
comment the obvious.

Ask no clarifying questions. Where this document is silent, choose the option a
senior engineer would defend in review, state the choice, and move on.
