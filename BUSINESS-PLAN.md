# BhoomiX — Competition, Weaknesses, and the Plan to Survive Them

> Written for someone who has not run a company before. No jargon without
> explanation. Every claim sourced (§10).
>
> Research date: August 2026.
> **Target: ₹15,000/month within 6 months → ₹3,00,000/month within 3 years.**
> That is deliberately small. Small is the correct goal here, and §4 explains why.

---

## 1. The honest situation: who you are actually up against

You asked whether other companies are doing this. Yes — many, and some are very
large. Hiding from this would be the worst thing I could do for you. Here is the
complete field.

### 1.1 Direct competitor to your disease scanner — this is the serious one

**Plantix** (made by PEAT, a German company)

| What it has | Number |
|---|---|
| Downloads worldwide | **135 million** |
| Farmers served per year | **~10 million** |
| Users in India | **7 million+** |
| Diseases it can identify | **385** |
| Training images | **10.5 million** |
| Indian languages | 8 |
| Price to the farmer | **Free** |

**You cannot beat Plantix at diagnosis.** They have a 10.5-million-image
dataset built over a decade. You have a general-purpose AI model. If your entire
pitch is "we detect crop disease from a photo," a judge or an investor who knows
the market will immediately ask *"how are you different from Plantix?"* — and
right now you do not have an answer.

**By §3 you will have one.** Plantix has a specific, documented hole.

### 1.2 Direct competitor on your home ground

**Gramophone** — and this one is personal: **it is based in Indore**, your city.

| | |
|---|---|
| Farmers onboarded | **2.5 million** |
| Share in Madhya Pradesh | **80%** of its users |
| Revenue (FY22) | **₹180 crore** |
| Founders | IIT Kharagpur + IIM Ahmedabad |
| Status | **Acquired by Unnati, 4 January 2026** |

They already own the exact geography you would start in, with 2.5 million
farmers and a hundred times your resources.

### 1.3 The government — free, and free is hard to compete with

**Kisan e-Mitra** (built by Wadhwani AI, funded by Google.org, run with the
Agriculture Ministry)

- Voice-based AI chatbot — the farmer *speaks*, no typing
- **11 regional languages**
- **3 million** queries resolved for 290,000+ farmers
- Covers PM-KISAN, crop insurance, agricultural loans
- **Free, and government-branded** (farmers trust it more than a startup)

Anything you build around *government schemes* is already done, free, by an
organisation with more credibility than you can buy.

### 1.4 The marketplace players — the graveyard

These are the companies trying to "remove the middleman." Note what happened:

| Company | What they do | Money | Status |
|---|---|---|---|
| **DeHaat** | Inputs + produce buying, franchise network | ₹3,000cr revenue | **Profitable** (₹369cr) |
| **Ninjacart** | B2B fresh produce supply chain | ₹1,634cr revenue | **Loss ₹256cr; revenue falling** |
| **Arya.ag** | Warehousing + lending against stored grain | ₹2,000cr loan book | **Only fully profitable one** |
| **AgroStar** | Input selling via app + field team | ~12% of digital input market | Growing 35%/yr |
| **Bijak** | B2B trader marketplace, 28 states | $34.5M raised | Operating |
| **Vegrow** | B2B fruit marketplace | $86.6M raised | Operating |
| **WayCool** | Was agri supply chain | — | **Pivoted away entirely** |
| **BharatAgri** | Farmer advisory app | — | **Shut down** |
| **Greenikk** | Banana supply chain | — | **Shut down** |

And the money flowing into this exact model:

```
Agri-marketplace funding:  $490M (2021)  →  $26M (2024)      = down 95%
All agritech funding:      $802M (2022)  →  $96M (H1 2025)
```

**Read this carefully: the "remove the middleman marketplace" is not an
under-served opportunity. It is a category that better-funded, more experienced
teams tried and mostly lost.** Investors have stopped funding it.

---

## 2. Every weakness of BhoomiX — and the fix for each

You asked me to point out every negative and how to eliminate it. Here they all
are. I have not softened any of them.

### 2.1 Fatal-if-ignored weaknesses

| # | Weakness | Why it is dangerous | The fix |
|---|---|---|---|
| **1** | **Plantix already does your headline feature, free, better, with 7M Indian users** | Your main differentiator does not exist | **Stop competing on diagnosis.** Compete on what happens *after* the diagnosis — see §3. Plantix's own documented weakness is that it "suggests remedies but does not directly link to purchase or service fulfillment." That sentence is your entire business. |
| **2** | **Your "94% accuracy" is unverified** | Research shows lab-trained models drop from **99% → 31%** on real field photos. Even the best drop to 70–85%. If a judge asks how you measured it, you have no answer | Build a 500-photo test set from real Indore-district fields, on cheap phones, in bad light. Have an agriculture college label them. **Publish the honest number.** A defensible 72% beats an unprovable 94%. |
| **3** | **Wrong advice can destroy a farmer's crop** | This is a real legal and moral liability, not a theoretical one | Add an "I'm not sure" answer. Never let the model guess when confidence is low — route to the nearest Krishi Vigyan Kendra instead. Never recommend banned/restricted chemicals. Log every recommendation given. |
| **4** | **Scans are shown and then thrown away** | Nothing is stored, so you have no data, no history, no asset. A competitor could copy your whole app in a weekend | Persist every scan: farmer, plot GPS, crop, disease, date, whether they acted. This is the only thing you build that cannot be copied. |
| **5** | **No one knows BhoomiX exists** | The best app with zero distribution earns zero | §5 — plug into CSC/VLE (5.4 lakh centres) and input retailers (3 lakh shops). Do not build a field team; you cannot afford one. |
| **6** | **Marketplace has no supply, no logistics, no capital** | You are entering the exact category that shut down BharatAgri and shrank Ninjacart | **Do not hold inventory. Ever.** Be a directory that points farmers to *existing local shops*. Zero stock, zero delivery, zero risk. |

### 2.2 Serious weaknesses

| # | Weakness | Why it hurts | The fix |
|---|---|---|---|
| **7** | **Machine-translated languages may be wrong** | You added 21 machine-translated languages. A mistranslated pesticide dose is dangerous | Ship 4–5 languages you can actually check (Hindi, Marathi, Gujarati + English). Add an in-app "this translation is wrong" button. Expand only as corrections come in. Quantity of languages is worthless if quality is unknown. |
| **8** | **AI costs money on every scan** | At 100,000 scans/month, an expensive model bankrupts you | Cache aggressively (you already do this for translations). Use the cheapest model that passes your accuracy test. Cap free scans per user per day. Costs stay under ₹2,000/month at your scale — see §4.3. |
| **9** | **Farmers use farm apps seasonally, not daily** | Downloads look good; usage dies after sowing | Do not chase daily use. Send *events*: "disease X is spreading in your tehsil this week." Be a utility they open 15 times a year, reliably. |
| **10** | **Many farmers cannot read, or read slowly** | Text-heavy UI excludes your actual user | Voice-first. Big icons. Kisan e-Mitra proves voice works for farmers. Add speech output for every diagnosis. |
| **11** | **App install is a big barrier** | Farmers do not browse app stores. Research shows installs ≠ usage | Make the core scan work on **WhatsApp** and as a website with no install. Meet farmers where they already are. |
| **12** | **You are students, part-time, with exams** | Ambitious plans die on capacity, not ideas | Scope everything to **one district**. 300 farmers used properly beats 30,000 registered and ignored. |
| **13** | **No trust — you are unknown** | Farmers will not give money or land data to a strange app | Do not touch money in year one. Information + local connection only. Borrow trust from CSC/VLE and known local shops. |
| **14** | **Gramophone owns Madhya Pradesh** | 2.5M farmers, 80% in MP, ₹180cr | Do not fight them on input selling. They sell products; you send customers to *independent* shops. Different game. |

### 2.3 Weaknesses in the product itself (found by testing)

Already fixed in this session, listed for completeness:
- Cart and orders were fetched 3× per page load
- Failed cart loads showed an empty cart, looking like lost items
- Razorpay payment script loaded twice and never used
- Mobile home page scrolled sideways (47px overflow)
- Non-partners were told "orders will appear automatically" — they never would
- 10 pages were silently English-only despite the 23-language work

Still open:
- Scans not persisted (weakness #4 — the important one)
- Field accuracy unmeasured (weakness #2)

---

## 3. The gap nobody fills — your actual business

Here is the single most useful thing in this document.

**Plantix's documented limitation:** it *"suggests remedies but does not
directly link to purchase or service fulfillment in all regions."*

Think about what that means for a farmer in a village near Indore:

```
Farmer's tomato crop has leaf curl.
        │
        ▼
Opens Plantix. Photographs the leaf.
        │
        ▼
Plantix: "Tomato Leaf Curl Virus. Apply Imidacloprid 17.8% SL."
        │
        ▼
Farmer thinks: "...where do I buy that?
                Which shop has it?
                What should it cost?
                Is the shopkeeper cheating me?"
        │
        ▼
        ✗  Plantix stops here. The farmer is on his own.
```

**The diagnosis is not the farmer's problem. Acting on the diagnosis is.**

### 3.1 What BhoomiX does instead

```
Farmer photographs the leaf in BhoomiX.
        │
        ▼
Diagnosis: "Tomato Leaf Curl Virus" (in his language, spoken aloud)
        │
        ▼
"You need: Imidacloprid 17.8% SL, about 100ml for your plot"
        │
        ▼
"Fair price range: ₹180 – ₹240"          ← protects him from overcharging
        │
        ▼
"Available at 3 shops near you:
   • Sharma Krishi Kendra — 2.1 km — ₹200 — ☎ call
   • Verma Agro — 4.5 km — ₹215 — ☎ call
   • Patel Beej Bhandar — 6 km — ₹195 — ☎ call"
        │
        ▼
Farmer calls the shop. Goes. Buys. Treats the crop.
        │
        ▼
7 days later: "Did it work?"   ← this is your data moat
```

**Every part of this already exists in your codebase.** You have disease
detection, GPS/address handling, a shop-locator page, and a marketplace. You do
not need to build a new product. You need to *connect the ones you have.*

### 3.2 Why this is defensible

| Question | Answer |
|---|---|
| Why won't Plantix just add this? | It is a German company serving 30+ countries. Verifying shop-level stock and prices village-by-village in India is slow, unglamorous, boots-on-ground work. Global platforms consistently avoid it. |
| Why won't Gramophone crush you? | Gramophone *sells its own inputs*. It will never send a farmer to a competitor's shop. You are neutral — that is exactly why shops will pay you and farmers will trust you. |
| Why won't the government do it? | Government advisory covers schemes and generic practice, not live local shop prices. |
| What is your moat? | A verified, priced, live directory of local agri-shops — built district by district. Boring, slow, and genuinely hard to copy. |

### 3.3 Your one real technical advantage

**23 languages.** Plantix has 8 Indian languages. Kisan e-Mitra has 11.
You have 23 — every language in the Constitution's Eighth Schedule.

There are farmers in India — Santali, Bodo, Manipuri, Kashmiri, Konkani,
Maithili speakers — that **no existing agri app serves in their own language at
all.** Those communities are too small for a company chasing 10 million users.
They are exactly the right size for a company that needs ₹3 lakh a month.

Fix weakness #7 first (verify quality), then this becomes a genuine, ownable
position: *the only crop advisor that speaks every Indian language.*

---

## 4. The money — how ₹15,000/month becomes ₹3,00,000/month

### 4.1 Why your small target is an advantage, not a limitation

You said ₹15,000 to ₹3 lakh per month. Most people would call that
unambitious. In this market it is the single smartest thing about your plan.

| Venture-funded competitors | BhoomiX |
|---|---|
| Must reach millions of farmers | Needs a few hundred paying shops |
| Must show 10× growth yearly | Needs to cover ₹8,000/month of hosting |
| Investors force expensive expansion | Nobody to answer to |
| Dies when funding stops (funding is down 95%) | Survives on small, boring revenue |
| Cannot serve small language groups — not worth it | Small groups are the whole point |

**Ninjacart lost ₹256 crore last year. You need ₹36 lakh a year at the top end.
You are not in the same game, and that is why you can win yours.**

### 4.2 Who pays — and it is never the farmer

The farmer has no spare cash. That is the founding fact of this whole sector,
and it is what killed BharatAgri (it charged farmers for advisory). **Never
build a revenue line that requires a farmer to pay.**

Your customer is the **agri-input shop**. There are ~300,000 of them in India,
serving 100M+ farmers. They already have money, they already want customers, and
right now they have no way to advertise beyond word of mouth.

**What the shop pays for:** verified listing + being the shop a farmer is sent
to when a diagnosis says he needs a product they stock.

That is a lead — a customer walking in holding a phone that says "buy this here."
Shops pay far more than ₹500/month for that kind of thing today.

### 4.3 The actual numbers

**Your costs (this is the good news):**

| Item | Monthly cost |
|---|---|
| Supabase (database) | ₹0 free tier → ₹2,000 |
| Vercel (hosting) | ₹0 free tier → ₹1,700 |
| Gemini API (~10,000 scans) | ₹200 – ₹1,000 |
| Domain | ₹100 |
| **Total to run BhoomiX** | **₹2,000 – ₹5,000/month** |

**This is the most important number in the document:**

> **You break even at about 10 shops paying ₹500/month.**

Ten shops. In one city. That is your entire survival requirement.

**Revenue path:**

| Phase | Timeline | Who pays | Maths | Monthly |
|---|---|---|---|---|
| **Survive** | Month 1–6 | 30 Indore shops | 30 × ₹500 | **₹15,000** |
| **Stabilise** | Month 6–18 | 150 shops + 20 FPOs | (150×₹500) + (20×₹1,000) | **₹95,000** |
| **Sustain** | Month 18–36 | 400 shops + 60 FPOs + data reports | (400×₹500) + (60×₹1,000) + ₹40,000 | **₹3,00,000** |

**Revenue lines, in the order you should add them:**

1. **Shop listing — ₹500/month.** Free for the first 3 months to build the
   directory. Start charging only once you can show them footfall.
2. **FPO dashboard — ₹1,000/month.** 10,000 FPOs exist, covering 30 lakh
   farmers, and the government funds them (₹6,865 crore scheme). Most run on
   WhatsApp and paper. They have budget; they lack software.
3. **District disease reports — ₹10,000–25,000 per report.** Once you have a
   year of scan data, you know which disease is spreading where, before anyone
   else. Input companies and insurers pay for that.
4. **Grants/CSR.** Agriculture + local languages + smallholders is exactly what
   CSR and government innovation funds exist for. One grant can fund a year.

**Never do:** charge farmers, hold inventory, run delivery, lend money.

---

## 5. Reaching every farmer in India — without a field team

You asked how to reach every farmer. The mistake almost everyone makes is
trying to reach farmers *directly*. That costs money you do not have —
traditional agricultural extension costs **$35 per farmer**.

**Do not reach farmers. Reach the people farmers already trust.**

### 5.1 The three rails that already exist

| Rail | Size | Why it works |
|---|---|---|
| **CSC / Village Level Entrepreneurs** | **5.4 lakh VLEs**, 5.8 lakh centres, **90% of Indian villages** | Government-backed. Villagers already go there for Aadhaar, banking, certificates. The VLE is a trusted local person who earns commission per service. |
| **Agri-input shops** | **~300,000 shops** serving 100M+ farmers | Farmers visit them every season anyway. And they are also your paying customer — the same relationship earns money and distributes the product. |
| **FPOs** | **10,000 FPOs**, **30 lakh farmers**, 40% women | One FPO = 300–1,000 farmers with one trusted manager. Onboarding one FPO is 300–1,000× cheaper than onboarding farmers individually. |

Note the elegance of the shop rail: **the shop pays you money AND brings you
farmers.** Your customer and your distribution channel are the same person.

### 5.2 The cost proof

Digital Green measured this precisely:

| Method | Cost per farmer |
|---|---|
| Traditional extension officer | **$35.00** |
| Community video | **$3.50** |
| **AI chatbot** | **$0.35** |

An AI-based tool is **100× cheaper** than sending a human. This is the entire
economic reason your plan is possible at all with a student budget.

### 5.3 Lower the barrier to almost zero

Research finding: installing an app does not mean farmers use it. Installs and
engagement are different problems.

| Barrier | Fix |
|---|---|
| Must find and install an app | Make the scan work over **WhatsApp** — send a photo, get a reply. Nothing to install. |
| Must read | Speak every answer aloud. |
| Must type | Voice input. Kisan e-Mitra proves this works. |
| Must have a good phone | Compress images on-device; work on 2G. |
| Must trust a stranger | Introduced by their VLE or their regular shopkeeper. |

**WhatsApp-first is probably the highest-impact decision available to you.**
Every farmer with a smartphone already has WhatsApp and already knows how to
send a photo on it. There is nothing to teach.

---

## 6. Management, operations, and logistics

You asked about management and logistics. Here is the honest version.

### 6.1 Logistics: your strategy is to have none

Every company that took on physical goods in this sector lost money —
Ninjacart, WayCool, Greenikk. Warehouses, trucks, and spoilage destroyed them.

**BhoomiX moves information, not goods.** The farmer walks to a shop that
already exists and already has stock. No warehouse. No truck. No spoilage. No
working capital. This is not a compromise — it is the reason you can survive on
₹5,000/month of costs.

Keep the delivery-partner feature you have built, but treat it as a *local
convenience for shops*, not as a logistics business you operate.

### 6.2 Team, at your actual size

| Role | Who | Time |
|---|---|---|
| Product + engineering | 1–2 people | Ongoing |
| Shop onboarding (the real work) | 1 person | Full attention |
| Content/language verification | 1 person + volunteers | Part-time |
| Partnerships (CSC, FPO, KVK) | 1 person | Part-time |

**The most important job is not coding.** It is walking into agri-shops in
Indore and signing them up. The app is already good enough; the directory is
what you do not have.

### 6.3 Operating rhythm

- **Weekly:** how many scans, how many "call shop" taps, how many shops signed
- **Monthly:** shop retention — did they renew? If not, why not?
- **Seasonally:** align with the crop calendar. Kharif sowing (Jun–Jul) and Rabi
  sowing (Oct–Nov) are when farmers care. Everything else is preparation.

### 6.4 The one metric that matters

Not downloads. Not users. **The number of times a farmer tapped "call this shop"
after a diagnosis.**

That number is the product working, the farmer being helped, and the shop's
reason to pay you — all in one. If it goes up, everything works. If it is flat,
nothing else you measure matters.

---

## 7. What to do in the next 90 days

| Weeks | Task | Done when |
|---|---|---|
| **1–2** | Persist every scan (weakness #4) | Scan history visible per farmer |
| **1–2** | Add confidence + "not sure → contact KVK" (weakness #3) | Low-confidence scans never assert an answer |
| **3–4** | Build the 500-photo Indore field test set (weakness #2) | You can state your real accuracy |
| **3–6** | Cut to 5 verified languages; add "report bad translation" (weakness #7) | Quality is known, not assumed |
| **5–8** | Build the shop directory: **visit 30 agri-shops in Indore.** Record name, GPS, phone, what they stock, prices | 30 shops live in the app |
| **7–10** | Wire diagnosis → product → nearby shops → call button (§3.1) | The loop in §3.1 works end-to-end |
| **9–12** | WhatsApp scanning (weakness #11) | Photo in, diagnosis out, no install |
| **11–12** | Offer paid listings to the 30 shops. Free until now | **First ₹15,000/month** |

Everything above is achievable by a small team. Nothing requires funding.

---

## 8. What would make me tell you to stop

Being honest about failure conditions is part of planning. Reconsider if:

- Field accuracy stays **below 65%** after tuning → the diagnosis cannot anchor the product
- After visiting 30 shops, **fewer than 5** will pay ₹500/month → the revenue model is wrong; test FPOs instead
- "Call shop" taps stay near zero → farmers do not want this; the assumption in §3 is wrong
- You cannot keep the shop directory current → the moat decays and you are back to competing with Plantix on diagnosis, which you lose

Test the cheapest one first: **before writing more code, visit 10 shops and ask
whether they would pay ₹500/month for customers sent to them.** That single
afternoon is worth more than three months of development.

---

## 9. The summary, in plain words

1. **Plantix beats you at disease detection.** Accept it and stop competing there.
2. **Gramophone owns Indore with 2.5M farmers.** Do not fight them at input selling.
3. **The government gives scheme advice free in 11 languages.** Do not rebuild it.
4. **The marketplace model is a graveyard** — funding down 95%, shutdowns everywhere. Do not hold inventory.
5. **But nobody closes the last gap:** the farmer knows what is wrong and still has no idea where to buy the cure, or what it should cost.
6. **That gap needs no warehouse, no capital, no logistics** — and you have already built most of the pieces.
7. **Your customer is the shop, not the farmer.** ~300,000 shops exist. You need 30.
8. **Ten shops at ₹500/month covers all your costs.** That is the whole survival requirement.
9. **Reach farmers through VLEs, shops, and FPOs** — never one at a time.
10. **23 languages is your only unbeatable asset.** Verify it, then own it.

You are not going to build a ₹3,000-crore company here, and you said you do not
want to. What you can build is a small, sustainable, genuinely useful service
that no large company will bother to copy — because the money in it is too
small for them and exactly right for you.

---

## 10. Sources

**Plantix**
- [Plantix official](https://plantix.net/en/) · [CGIAR Big Data case study](https://bigdata.cgiar.org/digital-intervention/plant-disease-diagnosis-using-artificial-intelligence-a-case-study-on-plantix/) · [GSMA AgriTech analysis](https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/programme/agritech/detecting-and-managing-crop-pests-and-diseases-with-ai-insights-from-plantix/) · [Functional evaluation (IJCRT)](https://www.ijcrt.org/papers/IJCRTBJ02023.pdf)

**Gramophone**
- [Inc42 — 2.5M farmers](https://inc42.com/startups/how-agritech-startup-gramophone-is-helping-2-5-mn-indian-farmers-improve-crop-yield-increase-profit/) · [Tracxn company profile](https://tracxn.com/d/companies/gramophone/__ctdh-cvEOKclofK2GBF-nMAcBQNm9foJJbf5V8GdG7s) · [YourStory](https://yourstory.com/2020/06/startup-bharat-agritech-gramophone-increased-crop-yield-farmers)

**Kisan e-Mitra / Wadhwani AI**
- [Wadhwani AI — Kisan e-Mitra](https://www.wadhwaniai.org/impact/agriculture-solutions/kisan-e-mitra/) · [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2117392&reg=48&lang=2) · [Tech Observer](https://techobserver.in/news/egov/kisan-e-mitra-ai-chatbot-farmers-government-schemes-321965/)

**Digital Green cost-per-farmer**
- [Agency Fund — bridging data divides at scale](https://theagencyfund.substack.com/p/bridging-data-divides-at-scale-through) · [IEEE Spectrum — AI in Indian agriculture](https://spectrum.ieee.org/ai-agriculture)

**Marketplace competitors & failures**
- [Ninjacart FY25 results](https://www.business-standard.com/companies/news/ninjacart-posts-rs-256-cr-loss-in-fy25-revenue-drops-to-rs-1-634-cr-125122600743_1.html) · [BharatAgri shutdown](https://inc42.com/buzz/agritech-startup-bharatagri-shuts-operations-due-to-funding-crunch/) · [Agritech funding reset](https://www.entrepreneur.com/en-in/news-and-trends/from-boom-to-slowdown-agritech-faces-harsh-reset-as/501268) · [Inc42 Agritech Landscape 2025](https://inc42.com/reports/indian-agritech-market-landscape-report-2025/) · [Bijak (Tracxn)](https://tracxn.com/d/companies/bijak/__633Krg9N0e4_uj7472ccXik-7oxdhw-s7yT03jfHfQc) · [Vegrow (Tracxn)](https://tracxn.com/d/companies/vegrow/__j4vqQU4FgPuHDM-XUvbFnNRVpenbjvtE_oe8g-Gxx4g)

**Distribution rails**
- [CSC — Village Level Entrepreneurs](https://csc.gov.in/vle) · [PIB — VLE AI training / network size](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2145349) · [Agri-input distribution structure](https://www.invadeagro.com/post/how-agri-input-distribution-works-in-india-from-brand-to-branch-to-farm) · [PIB — 10,000 FPOs achieved](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2106913)

**AI field-accuracy gap**
- [Recent advances in plant disease detection (Plant Methods 2025)](https://link.springer.com/article/10.1186/s13007-025-01450-0) · [AI-driven plant disease detection review (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC13066816/)

**App adoption behaviour**
- [Impact of text messages on farmers' app adoption](https://www.sciencedirect.com/science/article/abs/pii/S2214804326000650) · [Mobile-based extension adoption, South India](https://www.sciencedirect.com/science/article/pii/S074301672500292X)
