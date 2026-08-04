# BhoomiX — Platform Strategy: Diagnosis Engine, India Problems, Feature Map

> Answers three questions: can we build on Plantix for free, what India-specific
> problems can we actually solve, and what should we build.
>
> Research date: August 2026. Sources in §8.
> Horizon: 3–7 years. Constraint: near-zero manual labour, social-led growth.

---

## 1. Task one: can we use Plantix for free?

**No. And on inspection, you should not want to.**

### 1.1 What Plantix actually sells

Plantix's API is an enterprise B2B product, not a developer platform:

| Module | What it does |
|---|---|
| Crop Health API | Diagnoses disease, pests, nutrient deficiency (780+ pathogens) |
| Pest & Disease Library API | Multilingual reference content |
| Treatment Recommendations API | Guidance across 950+ catalogued issues |
| Fertilizer Calculator API | Crop-specific nutrient plans |

Their own page states who it is for: *"Mid-sized to multinational crop
protection, fertiliser, and seed companies."* Existing customers are **ITC** and
**Syngenta**.

**There is no free tier, no developer sandbox, no self-serve signup and no
published pricing.** The only route offered is booking a sales demo.

### 1.2 The route I won't help you build

The only genuinely "free" way to get Plantix results is to call the private API
their mobile app uses. Don't. It breaches their terms, it can be cut off without
warning the moment they notice, and being caught doing it ends any chance of a
legitimate partnership — with them or with the corporates who are their
customers. Building your core feature on that is building on someone else's
kill switch.

### 1.3 The strategic reason to skip Plantix even if it were free

This is the important part, and it inverts your premise.

You wrote: *"we are also getting the data that Plantix is getting and based on
that we can create our future model."*

That is exactly what a vision-API licence is written to prevent. Commercial
inference APIs in this category standardly forbid using the returned labels to
train a competing model — it is the single thing the vendor most needs to stop,
because their labels *are* their moat. You would be paying to rent a capability
while being contractually barred from converting it into your own.

Compare the two paths over five years:

```
PATH A — build on Plantix
  Farmer photo ──> Plantix API ──> diagnosis
                       │
                       └── they see every image, every crop, every region
                       └── you likely cannot train on the outputs
                       └── your cost per scan rises with your success
  Year 5: you are a reseller. Your moat is your UI. They can raise
          the price or launch direct, and you have no answer.

PATH B — own the loop  (what you already built)
  Farmer photo ──> your model ──> diagnosis
                       │
                       └── YOU own every image, label and outcome
                       └── you can fine-tune freely
                       └── cost per scan falls as you distil to a small model
  Year 5: you hold an India-specific, field-collected, outcome-labelled
          dataset that Plantix does not have — because they never see
          whether the treatment worked.
```

**Your existing Gemini-based scanner is not a poor man's Plantix. It is the
strategically correct choice, and you already have it working.**

### 1.4 What to actually do — the free diagnosis stack

Three layers, all free or near-free:

**Layer 1 — Open models for the easy 70%**
Free, self-hostable, MIT/Apache licensed models on Hugging Face: MobileNetV2 and
EfficientNet-B4 variants trained on PlantVillage (38 classes, 14 crops), reporting
97%+ on their own test set. Run on-device or on cheap CPU. Cost: ₹0.

*Caveat you must respect:* these are PlantVillage-trained, and PlantVillage-trained
models collapse from ~99% to ~31% on real field photos because they learn the
plain lab background, not the lesion. Use them only as a **fast first pass and a
confidence gate**, never as the final answer.

**Layer 2 — A general vision model for the hard 30%**
Your current Gemini path. Handles cluttered backgrounds, odd angles, multiple
symptoms, and crops outside the 38 classes. Costs a fraction of a rupee per call.

**Layer 3 — The asset nobody else is building**
Every scan writes `{plot GPS, crop, growth stage, diagnosis, confidence, date}`
— and 7 days later, *"did the treatment work?"*

That last field is the whole game. **Plantix has 10.5 million images but almost no
outcome labels**, because a farmer who gets a diagnosis and walks away never tells
them what happened. An India-specific dataset of *diagnosis → treatment → outcome*
is a genuinely defensible asset, and it costs you nothing but a follow-up message.

> **Decision: do not integrate Plantix. Keep your own model. Add outcome capture
> immediately — it is currently missing and it is the single highest-value thing
> in this document.**

---

## 2. Task two: the India-specific problems worth solving

Ranked by (size of pain × how solvable without field staff).

### 2.1 Counterfeit and sub-standard inputs — the biggest under-served problem

| Metric | Value |
|---|---|
| India's pesticide market that is counterfeit/illegal | **~25%** (FICCI: 30% by volume, 25% by value) |
| Food lost annually to ineffective/illegal products | **10.6 million tonnes** |
| 2023–24 official sampling — seeds sub-standard | 3,630 of 133,588 (**2.7%**) |
| 2023–24 — fertiliser sub-standard | 8,988 of 181,153 (**4.9%**) |
| 2023–24 — pesticides spurious | 2,222 of 80,789 (**2.75%**) |

*(Note the gap between official sampling ~3–5% and industry estimates ~25%.
Official samples are drawn from licensed dealers; the counterfeit trade largely
happens outside that channel. The truth is above the official number.)*

**Why this is your best problem:**
- A farmer buys a fake fungicide, sprays it, the crop dies anyway — and he blames
  the diagnosis, the weather, his luck. He never learns the product was fake.
- **You are the only party that can detect this.** You know the diagnosis, the
  recommended product, and — via outcome capture — whether it worked. When the same
  product from the same dealer fails repeatedly across many farms, that is a
  counterfeit signal nobody else in the chain can see.
- It requires **zero manual labour**. It falls out of data you're already collecting.
- The Agriculture Minister announced a nationwide campaign against fake inputs in
  2025 — you would be building the evidence layer for a stated national priority.

**Feature:** scan the product's QR/barcode and packaging before buying → check
against a batch registry and your own failure history → *"3 farmers near you
reported this batch didn't work."*

### 2.2 The PMFBY 72-hour trap — the highest-value quick win

The single biggest cause of localised crop-insurance claim rejection is the
**72-hour reporting rule**: a farmer must report loss within 72 hours or forfeit
the claim. Farmers in remote areas with patchy connectivity routinely miss it.

Scale of the failure: as of February 2025, **not one claim from the Kharif 2024
season had been settled** — more than four months after harvest.

**Why this is perfect for you:**
- The farmer's phone already has a camera, GPS and a clock. A geotagged,
  timestamped photo taken within 72 hours is exactly the evidence required.
- Fully automatable. Weather data can *trigger* the prompt: hailstorm detected in
  the district → push *"Crop damaged? Photograph it now — you have 72 hours."*
- 2025 reforms added a **12% annual penalty** on delayed payouts, so the system is
  now motivated to accept good evidence.

**Feature:** a one-tap "Damage Report" that captures geotagged, timestamped,
weather-corroborated photos and produces a PMFBY-ready evidence pack. This alone
could be worth more rupees to a farmer than every other feature combined.

### 2.3 The advisory vacuum

Public extension reaches **6.8%** of farmers at 1 officer per 1,162 holdings, and
household access to extension workers *fell* from 6.2% (2012-13) to 3.1% (2018-19).
This is the gap your scanner already addresses — it is real, large, and widening.

### 2.4 Scheme illiteracy

Six major central schemes exist — PM-KISAN (₹6,000/yr), PMFBY, KCC (up to ₹5 lakh),
Soil Health Card (22 crore cards issued, free testing every 2 years), e-NAM,
MGNREGA — plus hundreds of state schemes. Most farmers cannot name half of them,
let alone navigate eligibility.

### 2.5 Price blindness at the moment of sale

Agmarknet publishes daily prices from **3,000+ mandis across 200+ commodities**,
free, via data.gov.in. Almost no farmer sees it in a usable form. A farmer who
knows today's modal price in three nearby mandis negotiates differently.

---

## 3. Task three: the feature map

Organised by build effort. Everything here is low-labour by design — no field
staff, no manual verification, no per-farmer human touch.

### 3.1 Tier 1 — build now (weeks, high impact)

| # | Feature | Why it works in India | Effort |
|---|---|---|---|
| 1 | **Outcome follow-up** — "Did the treatment work?" 7 days after a scan | Builds the dataset nobody else has; one message | Days |
| 2 | **PMFBY 72-hour damage report** — geotagged, timestamped evidence pack | Directly recovers money the farmer would lose | 2–3 weeks |
| 3 | **Mandi price card** — today's price for your crop in the 3 nearest mandis | Free government data, instantly useful | 1 week |
| 4 | **Scheme matcher** — answer 4 questions, see every scheme you qualify for | Removes the navigation problem entirely | 2 weeks |
| 5 | **WhatsApp scanning** — send a leaf photo to a number, get a diagnosis | See §4 — this is the growth engine | 2–3 weeks |
| 6 | **Voice-first everything** — speak the question, hear the answer | Literacy is the real barrier, not smartphones | 2 weeks |
| 7 | **Soil Health Card reader** — photograph the card, get plain-language advice | 22 crore cards exist and are barely used | 1 week |

### 3.2 Tier 2 — build in year 1–2

| # | Feature | Notes |
|---|---|---|
| 8 | **Fake-input detector** — scan product before buying, check batch failure history | §2.1. Needs scan volume first |
| 9 | **Village disease radar** — "leaf curl is spreading 4 km away, act now" | Pure data product; strong retention hook |
| 10 | **Spray-window advisor** — don't spray before rain or in high wind | Free weather data, prevents wasted money |
| 11 | **Input cost calculator** — what this treatment should cost | Anti-overcharging |
| 12 | **Crop calendar per plot** — sowing to harvest reminders by crop and region | Drives seasonal re-engagement |
| 13 | **Neighbour benchmark** — anonymous yield/practice comparison in your tehsil | Social proof drives behaviour change |
| 14 | **KCC / loan eligibility pre-check** | Collateral-free limit is now ₹2 lakh |
| 15 | **Shareable diagnosis card** — a clean image the farmer forwards to WhatsApp groups | This is the viral loop; see §4 |

### 3.3 Tier 3 — years 2–4

| # | Feature |
|---|---|
| 16 | **Your own fine-tuned model**, trained on the India field images and outcomes collected in Tiers 1–2 |
| 17 | **Yield prediction per plot** from accumulated scan and weather history |
| 18 | **Disease outbreak early-warning**, sold as district reports to input companies and insurers |
| 19 | **Water/irrigation advisory** from soil type + rainfall + crop stage |
| 20 | **Storage advisor** — when to hold vs sell, using mandi price trends and e-NWR warehouse availability |
| 21 | **Agri-shop directory with verified prices** (the revenue engine from BUSINESS-PLAN.md) |
| 22 | **FPO dashboard** — aggregate view for the 10,000 FPOs covering 30 lakh farmers |

### 3.4 Tier 4 — years 4–7, only if the earlier tiers worked

| # | Feature |
|---|---|
| 23 | **Farmer credit file** — outcome-verified production history as underwriting data for NBFCs |
| 24 | **Traceability for exporters** — plot-level spray records meeting residue-compliance requirements |
| 25 | **Counterfeit-input intelligence sold to regulators and manufacturers** |
| 26 | **Satellite + scan fusion** for plot-level stress detection |
| 27 | **Parametric micro-insurance** priced off your own risk data |

---

## 4. The growth engine — social-led, near-zero labour

You asked specifically for growth without manual field work. Here is the mechanism.

### 4.1 The finding that changes everything

**Since 1 November 2024, WhatsApp service conversations — those the customer
initiates — are free and unlimited.** You are only charged for conversations *you*
start (₹0.115 utility, ~₹0.78 marketing).

Read that again in the context of your product:

```
Farmer sends a leaf photo to your WhatsApp number
        ↓
That is a CUSTOMER-INITIATED conversation  ──>  ₹0.00
        ↓
You have a 24-hour window to reply, free
        ↓
Your AI answers: diagnosis + treatment + nearest shop
        ↓
Total messaging cost: ZERO
```

**Your entire core product can run over WhatsApp at zero messaging cost, forever,
at any scale.** No app install. No literacy requirement. No training. Every farmer
with a smartphone already knows how to send a photo on WhatsApp.

Your only cost is the AI inference — a fraction of a rupee per scan.

### 4.2 The viral loop

Farmers already forward everything to WhatsApp groups. Make that automatic:

```
Farmer scans → gets a diagnosis card image with a small "BhoomiX" mark
      and the number to message
        ↓
He forwards it to his village WhatsApp group (he does this anyway,
      to show he found the answer)
        ↓
40 farmers see it. 3 message the number.
        ↓
Each of those 3 becomes a new free service conversation.
```

**The share is not a marketing ask — it's a farmer showing his neighbours he
solved something.** Design the card so forwarding it makes him look knowledgeable.

### 4.3 The distribution rails, in order of cost

| Rail | Reach | Cost to you | Manual labour |
|---|---|---|---|
| **WhatsApp forwards** | Compounding | ₹0 | None |
| **Farm YouTubers** | Indian Farmer ~5M subs, Farming Leader 6.5M, My Kisan Dost 1M+ | Free tool access, or a small fee | One email each |
| **Village WhatsApp groups** | Already exist everywhere | ₹0 | Join and answer |
| **CSC / VLE network** | 5.4 lakh centres, 90% of villages | Revenue share | One partnership |
| **Agri-input shops** | ~300,000 shops | They pay *you* | Local visits |
| **FPOs** | 10,000 orgs, 30 lakh farmers | SaaS fee | One conversation per FPO |

**The single highest-leverage action available to you:** get one farm YouTuber
with a few million subscribers to demo the WhatsApp scan in a video. One email,
one video, potentially hundreds of thousands of farmers — versus years of walking
village to village.

The ground is ready: **425 million rural internet users, 95% mobile coverage, and
95% of rural 15–29-year-olds own a smartphone.** The young person in the household
operates the phone for the family. Design for him; serve his father.

### 4.4 Why this needs no field staff

Every mechanism above is either self-serve (WhatsApp), one-to-many (YouTube), or
partner-operated (VLE, FPO, shops). Traditional extension costs **$35 per farmer**;
Digital Green measured an AI chatbot at **$0.35** — 100× cheaper. That ratio is the
entire reason this plan is possible with your team size.

---

## 5. The government layer — everything, in one place

All free, all API-accessible, and almost nobody has assembled them into one
coherent product.

### 5.1 Data sources to integrate

| Source | What you get | Access |
|---|---|---|
| **Agmarknet / data.gov.in** | Daily prices, 3,000+ mandis, 200+ commodities | Free API |
| **API Setu** (MeitY) | Government API directory incl. Agriculture Dept | Free |
| **AgriStack / Farmer Registry** | Farmer ID, land records — 6 crore IDs, 22 states with land APIs | Free, partner |
| **Soil Health Card** | Nutrient status + fertiliser recommendation, 22 crore cards | Portal / card scan |
| **PM-KISAN** | ₹6,000/yr status and eligibility | Portal / Kisan e-Mitra |
| **PMFBY** | Insurance enrolment, claim status | Portal |
| **e-NAM** | Electronic mandi trading | Portal |
| **IMD** | Weather, rainfall, warnings | Free |
| **e-NWR / WDRA** | Warehouse receipts, 44.8 Mt regulated capacity | Portal |

### 5.2 Schemes to surface

Central: PM-KISAN · PMFBY · KCC (₹5 lakh crop loan, ₹2 lakh collateral-free, 4%
effective) · Soil Health Card · e-NAM · MGNREGA · PM-KUSUM · Agriculture
Infrastructure Fund · FPO scheme (₹6,865 cr) · PKVY (organic) · Micro-irrigation

Plus every state scheme for the states you operate in.

### 5.3 How to present them — this is the differentiator

Do **not** build another scheme directory; Kisan e-Mitra already covers PM-KISAN
free in 11 languages and you will not beat a government-branded service on trust.

Do this instead — **make schemes contextual, not searchable:**

```
Farmer scans a diseased crop
        ↓
Diagnosis: severe, likely 40% yield loss
        ↓
System also says:
   "You may be eligible for a PMFBY claim.
    Report within 72 hours — tap to create your evidence pack."
   "Your KCC limit could cover replanting. Check eligibility."
```

Nobody surfaces a scheme *at the moment the farmer needs it*. Everyone else makes
him go looking. That framing is worth more than the content itself.

---

## 6. Seven-year roadmap

**Year 1 — Own the loop**
Outcome capture. WhatsApp scanning. PMFBY damage reports. Mandi prices. Scheme
matcher. One farm-YouTuber collaboration. *Goal: 50,000 scans with outcome labels.*

**Year 2 — Density in one region**
Village disease radar. Fake-input detection. Shop directory and first revenue.
FPO dashboard. *Goal: one district where BhoomiX is the default, plus first ₹.*

**Years 3–4 — Your own model**
Fine-tune on collected India field data. Ship on-device inference to cut cost to
near zero. Sell district outbreak reports. *Goal: no longer dependent on any
third-party vision API.*

**Years 5–7 — Become infrastructure**
Farmer credit files for NBFCs. Traceability for exporters. Counterfeit
intelligence for regulators. *Goal: the data layer other people build on.*

At each stage the previous stage's data is the input to the next. That is the
compounding — and it only works if outcome capture starts now.

---

## 7. The honest risks

| Risk | Reality |
|---|---|
| **Your accuracy is unverified** | Still true. Field accuracy is unmeasured. Everything above rests on the diagnosis being trustworthy. Build the 500-photo India field test set before scaling. |
| **Wrong advice can destroy a crop** | Needs calibrated abstention and KVK escalation before you go anywhere near WhatsApp scale. |
| **WhatsApp policy could change** | The free service-conversation window is Meta's decision, not a contract with you. Do not make it your only channel. |
| **Plantix could launch consumer-direct in India** | They already have 7M Indian users. Your defence is outcome data and shop-level local knowledge, not diagnosis accuracy. |
| **Fake-input detection makes enemies** | You will be naming dealers and batches. Publish only aggregate statistical signals, never accusations, and get legal advice before shipping it. |
| **Government dependency** | Schemes and APIs change with policy. Design so the farmer record retains value regardless. |

---

## 8. Sources

**Plantix**
- [API Toolkit (B2B)](https://plantix.net/en/b2b-solutions/api-toolkit/) · [Plantix Intelligence](https://plantix.net/en/plantix-intelligence/api-toolkit/) · [Vision API](https://plantix.net/en/business/plantix-vision-api/) · [API terms](https://plantix.stoplight.io/docs/guides/b51e0c3332f71-plantix-api-terms-and-conditions)

**Open models & the field-accuracy gap**
- [Hugging Face plant-disease models](https://huggingface.co/Daksh159/plant-disease-mobilenetv2) · [PlantVillage dataset](https://github.com/spMohanty/PlantVillage-Dataset) · [Recent advances in plant disease detection (Plant Methods, 2025)](https://link.springer.com/article/10.1186/s13007-025-01450-0)

**Counterfeit inputs**
- [CropLife — Tackling India's fake pesticides](https://croplife.org/case-study/tackling-indias-fake-pesticides/) · [Krishak Jagat — 2023-24 sampling data](https://www.en.krishakjagat.org/india-region/rise-in-spurious-agricultural-inputs-seeds-fertilizers-and-pesticides-found-sub-standard-in-2023-24/) · [NewsOnAir — Minister on fake inputs, Aug 2025](https://www.newsonair.gov.in/strict-action-will-be-taken-against-companies-involved-in-manufacturing-fake-pesticides-fertilisers-seeds-says-union-minister-shivraj-singh-chouhan)

**PMFBY**
- [Operational guidelines & rejection reasons](https://www.global-agriculture.com/india-region/pmfby-operational-guidelines-explained-why-crop-insurance-applications-get-rejected-and-how-farmers-can-appeal/) · [Ground Report — settlement delays](https://www.groundreport.in/groundreport/crop-insurance-delays-farmers-left-waiting-amid-climate-challenges-8766785/) · [2025 reforms](https://responsibleus.com/crop-insurance-in-india-2025-new-reforms-deliver-timely-aid-and-accountability-for-farmers)

**Government data & schemes**
- [data.gov.in agriculture APIs](https://www.data.gov.in/apis/?sector=Agriculture) · [Mandi price dataset](https://www.data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi) · [API Setu — Agriculture Dept](https://directory.apisetu.gov.in/api-collection/agricoop) · [Soil Health Card (PIB)](https://www.pib.gov.in/FactsheetDetails.aspx?Id=148602&reg=48&lang=2) · [PM-KISAN](https://pmkisan.gov.in/)

**WhatsApp economics**
- [Blueticks — 2026 pricing & free service conversations](https://blueticks.co/blog/whatsapp-business-api-pricing-2026) · [Uptail — per-message costs](https://www.uptail.ai/blog/whatsapp-business-api-pricing-2026-what-it-costs-and-how-billing-works)

**Rural reach & agri influencers**
- [Krishi Jagran — farm influencers](https://krishijagran.com/success-story/meet-these-farm-influencers-whose-youtube-videos-are-assisting-millions-of-farmers-with-everyday-farm-related-issues/) · [HEAD Foundation — rural digital adoption](https://digest.headfoundation.org/2025/08/21/scroll-plant-share-innovation-lessons-from-indias-rural-farmers/) · [Ascent — rural YouTube influencers](https://ascentgroupindia.com/blog/top-20-youtube-influencers-impacting-rural-india/)

**Extension gap & cost per farmer**
- [ICRISAT — extension system meta-analysis](https://oar.icrisat.org/11401/1/Agriculture-Extension-System-in-India-A-Meta-analysis.pdf) · [Agency Fund — Digital Green cost per farmer](https://theagencyfund.substack.com/p/bridging-data-divides-at-scale-through)
