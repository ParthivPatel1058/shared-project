# BhoomiX — AI Agriculture Platform for Indian Farmers

> **Live:** [bhoomix.vercel.app](https://bhoomix.vercel.app)  
> **Stack:** React 18 · TypeScript · Vite · Tailwind CSS · Supabase · Vercel

---

## What is BhoomiX?

BhoomiX is a full-stack agriculture app built for Indian farmers — from the
smallholder with a basic smartphone to the FPO managing hundreds of acres. It
combines AI crop diagnosis, real-time government scheme discovery, mandi price
intelligence, and hyperlocal weather-driven farm advice into one bilingual
(English + Hindi, plus 21 more Indian languages) progressive web app.

Built as a competition project targeting the problems of **crop disease losses**
and **middleman price exploitation** — two of the largest income drains on
Indian agriculture.

---

## Features

### Crop AI
- **Disease detection** — photograph a leaf, get an AI diagnosis with confidence
  score and treatment plan. Powered by Gemini Vision.
- **Outcome tracking** — "Did the treatment work?" follow-up, building a
  ground-truth dataset no competitor has.

### Weather & Farm Advisory
- **Open-Meteo integration** — no API key, no rate limits, 7-day hourly forecast
  for any GPS location.
- **Spray-window advisor** — warns before rain or high wind washes/blows
  pesticide off target.
- **Irrigation nudge** — flags dry spells and heavy rain coming.
- **Heat / frost / storm alerts** — actionable, not just informational.

### Mandi Prices
- Daily rates from 3,000+ government-regulated markets via data.gov.in.
- Filter by state and commodity. Know the price before you walk in.
- Requires a free personal API key from data.gov.in (2-minute signup).

### PMFBY Damage Report
- Photograph crop damage, stamp with GPS + time.
- Pairs photos with actual rainfall recorded for the location.
- Exports a printable evidence document to support an insurance claim.
- Counts down the 72-hour reporting window (missing it is the #1 rejection cause).

### Government Schemes
- 42 schemes (26 central + 16 state) with eligibility, benefits and direct
  application links.
- Full-text search in both scripts — a Hindi query finds Hindi names.
- Category and state filters.

### Agri Market & Kisan Mart
- Seeds, fertilisers, tools, and daily-need groceries.
- Persistent cart via Supabase.
- Cross-catalogue search (one box covers both stores).

### Other
- **23 Indian languages** — every string bilingual at minimum; others via the
  `tx()` translation helper.
- **Delivery address chip** in navigation — shows the user's saved default
  address, links to the address book.
- **Addresses** — add/edit/default delivery addresses with Nominatim geocoding.
- **Partner registration & order management** — delivery-partner onboarding.
- **Kisan Help** — AI advisory chat.
- **Shop locator** — nearby agri input stores on a map.
- **Settings** — theme, language picker, notification prefs.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Fast HMR, typed |
| Styling | Tailwind CSS + custom CSS vars | Theme-aware, dark/light |
| Auth | Supabase Auth | Email + Google OAuth |
| Database | Supabase Postgres + RLS | Row-level security per user |
| Hosting | Vercel | CI/CD on push |
| Weather | Open-Meteo | No key, no rate limit |
| Geocoding | Nominatim (OSM) | Free, no key |
| AI vision | Google Gemini | Crop disease detection |
| Mandi data | data.gov.in | Government open data |
| Maps | Leaflet | OSM tiles, free |

---

## Free services used (all zero-setup or self-serve)

| Service | What it provides | Key required? |
|---|---|---|
| Open-Meteo | 7-day forecast, hourly data | None |
| Nominatim | Address geocoding + city name | None |
| data.gov.in | Daily mandi prices, 3,000+ markets | Free, self-serve |
| Supabase | Auth, DB, storage | Free tier |
| Vercel | Hosting + CI/CD | Free tier |
| Gemini Vision | Crop disease AI | Free quota |
| Leaflet + OSM | Maps | None |

---

## Getting started

```bash
# 1. Clone
git clone https://github.com/ParthivPatel1058/shared-project.git
cd shared-project

# 2. Install
npm install --legacy-peer-deps

# 3. Environment — copy and fill in your own values
cp .env.example .env
# Required:
#   VITE_SUPABASE_URL
#   VITE_SUPABASE_ANON_KEY
#   VITE_GEMINI_API_KEY   (Gemini Vision for crop disease)
# Optional:
#   VITE_DATAGOV_API_KEY  (mandi prices — free key at data.gov.in)

# 4. Run
npm run dev
```

---

## Environment variables

| Variable | Required | Source |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project settings |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase project settings |
| `VITE_GEMINI_API_KEY` | Yes | Google AI Studio |
| `VITE_DATAGOV_API_KEY` | Optional | data.gov.in → My Account |

`.env` is gitignored. Never commit real keys. See `.env.example` for the full list.

---

## Database

Supabase Postgres. Migrations are in `supabase/migrations/` and apply in
order. Tables: `profiles`, `addresses`, `orders`, `cart_items`, `partners`,
`user_roles`, and an optional `schemes` table (see migration
`20260805120000_schemes.sql`).

Run migrations:
```bash
supabase db push
```

---

## Project structure

```
src/
├── assets/          Static images (hero, product photos)
├── components/      Shared UI — Navigation, FarmAdvisory, WeatherWidget, …
│   └── ui/          shadcn/ui primitives + custom (Button3D, FancyButton, …)
├── contexts/        Auth, Cart, Language, Theme
├── data/            Static catalogues — agriProducts, martProducts, schemes
├── hooks/           useWeather, useFarmAdvisory, useMandiPrices, useAddresses, …
├── i18n/            Language map + 23-language support
├── integrations/    Supabase client + generated types
├── lib/             Analytics, utilities
└── pages/           One file per route
    ├── auth/        Welcome, Login, Signup
    ├── AgriMarket.tsx
    ├── CropDisease.tsx
    ├── DamageReport.tsx   ← PMFBY 72-hour claim pack
    ├── GovSchemes.tsx
    ├── KisanMart.tsx
    ├── MandiPrices.tsx    ← data.gov.in mandi rates
    └── …
supabase/
└── migrations/      SQL migrations in order
```

---

## Key design decisions

**No glass over photos.** The app uses a fixed photographic backdrop. Early
versions used `backdrop-blur` glass for cards — it let the photo bleed through
the text, tinting product names and prices. All content cards use `bg-card`
(solid) now.

**Open-Meteo instead of OpenWeatherMap.** The configured OWM key was returning
401 on every load. Open-Meteo needs no key at all — one call, HTTP 200, and the
hourly/daily data enables the advisory engine.

**Bilingual-first, not English-first.** Every user-visible string goes through
`tx(english, hindi)`. The UI was audited at ~97–99% coverage in Tamil.

**SoilGrids was tested and rejected.** It returns `null` at Indian coordinates.
The Soil Health Card (22 crore already issued) is the better soil-data route.

---

## What was built (history)

| Phase | What was added |
|---|---|
| Foundations | React + Supabase scaffold, Auth, Tailwind |
| Stores | AgriMarket, KisanMart, Cart, Orders |
| Government | GovSchemes (42 schemes), Addresses |
| AI | CropDisease (Gemini Vision), KisanHelp chat |
| Maps | ShopLocator (Leaflet + OSM) |
| Weather | Open-Meteo integration (replaced broken OWM keys) |
| Advisory | FarmAdvisory — spray window, irrigation, extreme alerts |
| Mandi | MandiPrices (data.gov.in), live filtering |
| Insurance | DamageReport — PMFBY 72-hour evidence pack |
| Search | Cross-catalogue search fixed and built |
| UI polish | PixelReactor canvas effect, BhoomixMark rosette, auth pages |
| i18n | 23 Indian languages, Signup rebuilt bilingual |

---

## Competition context

Built for a student hackathon judged on:
1. Problem-solution fit
2. Technical depth
3. Scalability / market potential

Primary differentiator from Plantix (the German incumbent, 135M downloads):
BhoomiX captures **diagnosis → treatment → outcome** data. Plantix has images
but no outcome labels. That dataset, built passively from farmer follow-ups, is
the moat.

See `PLATFORM-PLAN.md` for the full strategic research.  
See `FREE-SERVICES.md` for the zero-setup service audit with live API tests.

---

## Licence

MIT — see `LICENSE`.

---

*Built with Claude Code · Deployed on Vercel · Data from Indian government open APIs*
