# BhoomiX — Free Services & Zero-Setup Features

> Everything here is self-serve online. No vendor meetings, no field visits, no
> hardware. Where I could test an endpoint, I did — results are marked
> **TESTED** with the actual response. Where I only read documentation, it says
> so, because the two are not the same and one of them cost me a wrong
> assumption below.
>
> Research date: 6 August 2026.

---

## 1. Tested live — these work today

### 1.1 Open-Meteo — weather, no API key at all ✅

I called it during this research:

```
GET api.open-meteo.com/v1/forecast?latitude=22.72&longitude=75.86&current=...
→ {"temperature_2m":25.9,"precipitation":0.10,"wind_speed_10m":10.0}   (Indore, live)
```

| | |
|---|---|
| API key | **None. No signup at all.** |
| Free tier | 10,000 calls/day (non-commercial) |
| Forecast | Hourly, up to 16 days |
| History | Back to 1940 |
| Models | 30+ |

**This matters immediately**, and I tested your current setup to be precise
about why:

```
VITE_OPENWEATHER_API_KEY          → HTTP 401   ❌ dead
VITE_OPENWEATHER_API_KEY_FALLBACK → HTTP 200   ✅ working
```

So weather is not broken — the fallback rescues it. But two things are wrong:

1. **Your primary key is dead.** Every page load makes a 401 request before
   falling back. That is the console noise my test scripts have been filtering
   as `openweathermap` all along.
2. **The fallback that is actually serving your users is OpenWeatherMap's
   public sample key** — the one copied into thousands of tutorials. It is
   shared with the world and can be revoked without notice, and if it is, your
   weather dies with it.

Open-Meteo needs no key, so both problems disappear rather than being patched.

> **Do this first.** It removes a dead request on every load, removes your
> dependence on a shared public key, and unlocks the forecast features in §3.

### 1.2 SoilGrids (ISRIC) — global soil data ⚠️ but not for India

I wanted to recommend this. I tested it instead, and the result was:

```
lon=5.5  lat=52    (Netherlands, their doc example)  → pH*10 = 46   ✅
lon=75.86 lat=22.72 (Indore)                         → null        ❌
lon=77.4  lat=23.2  (Bhopal area)                    → null        ❌
```

Same endpoint, HTTP 200 both times, ~24s response. It works — **it just has no
usable values at the Indian points I tried.** Their own docs call the v2.0 REST
API beta with no uptime guarantee, and fair use is 5 calls/minute.

**Verdict: do not build soil advice on this.** Use the government Soil Health
Card instead (§2.3) — 22 crore cards already issued, and the farmer can
photograph the one they already have.

### 1.3 data.gov.in — mandi prices ⚠️ get your own key

```
GET api.data.gov.in/resource/9ef84268-...?api-key=<public demo key>
→ {"error": "Rate limit exceeded"}
```

The widely-shared public demo key is exhausted, as you would expect. **Your own
key is free and self-serve**: register on data.gov.in, then copy the key from
*My Account*. That is the entire process — no approval, no call.

Once keyed, you get daily prices across **3,000+ mandis and 200+ commodities**.

---

## 2. The government layer — connecting without meetings

### 2.1 ONDC — this is the answer to "connect government suppliers"

ONDC is the government-backed open commerce network. It is the single most
important thing in this document for your supplier question, because it inverts
the problem: **you don't negotiate with sellers one by one — you join the
network and every seller on it becomes reachable.**

| | |
|---|---|
| Onboarding | **Self-serve.** Generate a self-signed certificate, register on the ONDC registry portal with your Subscriber ID, country, cities, domain and type (buyer or seller node). |
| Setup fee | None |
| Commission | 3–10%, well below traditional marketplaces |
| Agri sellers | FPOs and individual farmers already sell on it |
| Government tie-in | Integrated with **ODOP** (One District One Product) |
| Rural access | CSC e-Grameen network acts as access points |

**What this unlocks for BhoomiX:** register as a *buyer app* and your Agri Market
and Kisan Mart stop being a static catalogue of images. Real sellers, real
inventory, real fulfilment — and you never meet any of them.

This also solves the problem I raised in [BUSINESS-PLAN.md](BUSINESS-PLAN.md):
you wanted a marketplace without holding inventory or running logistics. ONDC is
exactly that, provided by the government, at zero setup cost.

### 2.2 Free government APIs worth wiring

| Source | What you get | Access |
|---|---|---|
| **AGMARKNET / data.gov.in** | Daily mandi prices, 3,000+ markets | Free key, self-serve |
| **API Setu** (MeitY) | Directory of government APIs incl. Agriculture Dept | Free; some need org registration |
| **e-NAM** | Electronic mandi trading | Portal |
| **PM-KISAN / PMFBY / Soil Health Card** | Scheme status and eligibility | Portals; already surfaced in your schemes page |
| **Bhuvan (ISRO)** | Indian satellite imagery, NDVI, land use | Free |
| **WDRA / e-NWR** | Registered warehouses, pledge finance | Portal |

### 2.3 Soil Health Card — better than any soil API for India

Instead of querying a soil model that has no Indian values, read the card the
government already gave the farmer. **22 crore cards issued**, free testing every
two years, real lab values for the actual field.

**Feature:** photograph the card → OCR the nutrient table with your existing
Gemini vision call → plain-language fertiliser plan in the farmer's language.
Zero new services, zero cost, and more accurate than any global model.

---

## 3. Satellite crop monitoring — no hardware, no field visit

This is the biggest capability you are not using, and it needs nothing physical.

| Source | Notes |
|---|---|
| **Copernicus Data Space Ecosystem** (ESA) | Free registration. Full Sentinel-1/2/3/5P archive. Offers S3, STAC, openEO and Sentinel Hub APIs. Crucially, **NDVI can be computed in the cloud** — you request an analysis-ready NDVI product for your field polygon instead of downloading a full granule. |
| **Bhuvan (ISRO)** | Free Indian coverage, NDVI products |
| **NASA Earthdata** | Landsat 5–9, MODIS |
| **ndvi.us** | Free: draw a field, get Sentinel-2 NDVI refreshed every 5 days |

Available indices: **NDVI** (vegetation vigour), **NDWI** (water stress),
**EVI**, **SAVI** (better on bare soil).

**What this becomes in BhoomiX:**

```
Farmer draws his plot once (or you take it from the address GPS)
        ↓
Sentinel-2 passes every ~5 days, free
        ↓
NDVI trend per plot, stored alongside his scan history
        ↓
"Your field's vigour dropped 18% in 10 days while neighbouring
 fields held steady — check the north corner."
```

That is a genuine precision-agriculture feature, delivered from a laptop, for ₹0.

---

## 4. Feature catalogue — all zero-setup

Ordered by (value to farmer × ease of build). Everything below needs only APIs
already listed.

### Tier 1 — build on what you already have

| # | Feature | Built from | Why it lands |
|---|---|---|---|
| 1 | **Spray-window advisor** — "don't spray, rain in 6h / wind too high" | Open-Meteo | Prevents money washed off the field. Pure forecast logic. |
| 2 | **Mandi price card** — today's rate for your crop, 3 nearest markets | data.gov.in | Farmer negotiates from a known number |
| 3 | **Soil Health Card reader** | Gemini vision (have it) | 22 crore cards, barely used |
| 4 | **Irrigation nudge** — soil-moisture proxy from rainfall + crop stage | Open-Meteo | No sensor needed |
| 5 | **PMFBY 72-hour damage pack** — geotagged, timestamped photos | Phone + Open-Meteo corroboration | Recovers real money; see PLATFORM-PLAN.md |
| 6 | **Heat / frost / hail alert** by district | Open-Meteo | Push before the event, not after |
| 7 | **Crop calendar per plot** | Local data | Drives seasonal re-engagement |

### Tier 2 — needs one free registration

| # | Feature | Needs |
|---|---|---|
| 8 | **Plot NDVI health trend** | Copernicus account |
| 9 | **Field stress map** — which corner is struggling | Copernicus (NDWI) |
| 10 | **Sowing-date estimator** from NDVI green-up | Copernicus |
| 11 | **Yield-risk flag** — NDVI vs district average | Copernicus + your own history |
| 12 | **Real products in the marketplace** | ONDC buyer node |
| 13 | **Online payments** | Razorpay (§5) |

### Tier 3 — compounding on your own data

| # | Feature |
|---|---|
| 14 | **Village disease radar** — outbreak spreading nearby, from your own scans |
| 15 | **Counterfeit-input signal** — same batch failing repeatedly across farms |
| 16 | **Price-trend advice** — hold or sell, from mandi history |
| 17 | **Your own fine-tuned disease model**, trained on collected India field images |
| 18 | **District outbreak reports** sold to input companies and insurers |

---

## 5. Other free / zero-friction services

| Need | Service | Terms |
|---|---|---|
| **Payments** | **Razorpay** | ₹0 setup, fully online onboarding, sandbox to test, live in under an hour, KYC 2–3 days. No sales call. |
| Payments (alt) | Cashfree | 1.95% flat, auto-activated merchants |
| **Maps / geocoding** | Nominatim (OpenStreetMap) | Free, already in your app |
| **Push notifications** | Firebase Cloud Messaging | Free, unlimited |
| **Messaging** | WhatsApp Business API | **Customer-initiated conversations free and unlimited** since Nov 2024 — see PLATFORM-PLAN.md §4 |
| **Hosting** | Vercel | Free tier, already in use |
| **Database / auth / storage** | Supabase | Free tier, already in use |
| **Error tracking** | Sentry | Free tier, 5k events/month |
| **Analytics** | Umami / Plausible (self-host) | Free, privacy-friendly |
| **Vision AI** | Gemini | Already in use, fractions of a rupee per scan |
| **Open models** | Hugging Face | Free hosted inference; PlantVillage-trained models |

---

## 6. Recommended order

**This week — costs nothing, removes an error**
1. Swap OpenWeatherMap → **Open-Meteo**. No key, kills a live console error.
2. Register a free **data.gov.in** key → ship the mandi price card.
3. Build the **spray-window advisor** on the Open-Meteo data you now have.

**This month**
4. Register on **Copernicus** → NDVI trend for a plot.
5. **Soil Health Card** photo reader using the Gemini call you already make.
6. **PMFBY damage pack**.

**This quarter**
7. **ONDC buyer node** — real sellers, real inventory, no vendor meetings.
8. **Razorpay** sandbox → live payments.

---

## 7. What I could not verify

Being straight about the limits of this research:

- **SoilGrids returns null for India.** Tested at two points, both null, while
  their own example worked. Do not build on it without testing your own
  coordinates first.
- **data.gov.in throughput** — I hit the exhausted public demo key, so I could
  not measure real rate limits on a private key. Register one and test before
  designing around it.
- **Copernicus quotas** — documented as varying by user type; I did not create an
  account, so I have not confirmed the free-tier ceiling.
- **ONDC onboarding effort** — the registry step is self-serve, but building a
  compliant buyer node is real engineering (protocol implementation, not a
  REST call). Budget weeks, not days.
- **Open-Meteo licensing** — free tier is *non-commercial*. If BhoomiX starts
  charging, check their commercial terms.

---

## 8. Sources

**Weather / soil**
- [Open-Meteo](https://open-meteo.com/) · [Open-Meteo — no key required](https://dev.to/0012303/open-meteo-has-a-free-weather-api-no-key-no-signup-real-forecast-data-2nna) · [SoilGrids REST API](https://rest.isric.org/) · [SoilGrids docs & fair use](https://docs.isric.org/globaldata/soilgrids/)

**Government data & ONDC**
- [data.gov.in agriculture APIs](https://www.data.gov.in/apis/?sector=Agriculture) · [API Setu directory](https://apisetu.gov.in/) · [ONDC registration guide](https://www.incorpx.io/blog/register-business-ondc-digital-commerce) · [ONDC onboarding technical case study](https://medium.com/agileinsider/technical-business-case-study-understanding-ondc-and-integrating-the-seller-apps-eccdc720e9f5) · [ONDC seller onboarding](https://www.digicommerce.in/blog/ondc-seller-onboarding-guide/)

**Satellite**
- [Copernicus Data Space Ecosystem](https://dataspace.copernicus.eu/) · [Copernicus APIs](https://documentation.dataspace.copernicus.eu/APIs.html) · [Sentinel-2 collection](https://dataspace.copernicus.eu/data-collections/copernicus-sentinel-missions/sentinel-2) · [Bhuvan free data (ISRO)](https://bhuvan.nrsc.gov.in/wiki/index.php/Free_Satellite_Data_Download) · [ndvi.us](https://ndvi.us/) · [Free satellite imagery sources 2026](https://eos.com/blog/free-satellite-imagery-sources/)

**Payments**
- [Razorpay payment gateway](https://razorpay.com/payment-gateway/) · [Gateway comparison 2026](https://shop2host.com/best-payment-gateway-india)
