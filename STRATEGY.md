# BhoomiX — Strategic Analysis & Build Plan

> A first-principles reconstruction of what BhoomiX should be, grounded in what
> has actually happened to every well-funded company that attempted this before.
>
> Research date: August 2026. All figures sourced; see §9.

---

## 0. Executive summary — the one thing that matters

**The current thesis is "AI disease detection + a direct marketplace that removes
the middleman." That thesis, as stated, is the exact thesis that has failed
repeatedly and expensively in India.** Not because it was executed badly, but
because it misdiagnoses the problem.

The middleman's 30–40% is not a *pricing* failure that a cheaper channel fixes.
It is the *price of two services* the farmer cannot otherwise buy:

1. **The ability to wait** — cash today, so he doesn't have to dump at harvest.
2. **The ability to prove** — a reputation that substitutes for collateral.

A marketplace offers neither. That is why farmers who *know* better prices exist
still sell to the arhtiya, and why every "we'll cut out the middleman" platform
has either shrunk, pivoted, or shut down.

**The reframe:** BhoomiX should not try to *replace* the middleman. It should
**dismantle the conditions that make him necessary** — by turning the disease-scan
feature into a credit-and-quality record, and using that record to unlock
storage-backed lending on rails the Government of India has already built.

Same app. Same two features. Completely different business.

---

## 1. What is actually broken (causal, not symptomatic)

Most pitches state the problem as a list of grievances. That produces feature
lists, not strategy. Here is the causal chain:

```
Smallholder: 80% of landholdings, 27% of institutional credit
                          │
                          ▼
        No working capital between sowing and harvest
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                   ▼
Borrows from arhtiya @18–24%        Cannot afford inputs / can't
(vs 6–11% institutional)            act on advice even if given
        │                                   │
        ▼                                   ▼
Loan is repaid IN CROP,             Disease goes untreated
so crop is pre-committed            → ~30% of output lost
        │                                   │
        ▼                                   │
Must sell at harvest, at the                │
bottom of the price curve  ◄────────────────┘
        │
        ▼
Receives 31–43% of consumer price
        │
        ▼
No surplus → no savings → borrows again next season
                    │
                    ▼
                 (loop)
```

**Two structural deficits drive the entire loop:**

| Deficit | Consequence | What the arhtiya sells to patch it |
|---|---|---|
| **Cannot wait** — no storage, no cash buffer | Distress sale at peak supply | Immediate cash advance |
| **Cannot prove** — no records, no verifiable history, often no clear land title (tenant farmers) | Banks won't lend unsecured; buyers won't pay a premium | Personal trust built over decades |

Everything else — the low price, the untreated disease, the debt — is downstream.

**Therefore:** an intervention that does not create *waiting capacity* or
*provable reputation* will not change farmer income, no matter how good the UI is.

---

## 2. The evidence base

### 2.1 The disease/diagnosis gap is real and severe

| Metric | Value |
|---|---|
| Annual Indian crop loss to pests & disease | **~30%** (Govt. estimate) |
| Monetary value, insect pests, major crops | **~US$8.6 bn/year** |
| Farmers reached by public extension services | **6.8%** |
| Extension officer : operational holdings | **1 : 1,162** (recommended 1:750) |
| Households accessing extension worker/ATMA support | **6.2% (2012-13) → 3.1% (2018-19)** — *declining* |
| KVKs nationwide | ~731 |

This gap is **not closing on its own — it is widening.** This is the strongest
part of the BhoomiX thesis and it survives scrutiny.

### 2.2 The middleman gap is real — but misread

| Crop | Farmer's share of consumer price |
|---|---|
| Tomato | 33% |
| Onion | 36% |
| Potato | 37% |
| Banana | 31% |
| Grapes | 35% |
| Mango | 43% |

But note what the arhtiya actually provides:

- Credit at **18–24%** — expensive, but *available same-day, unsecured, to tenant
  farmers with no title*. Institutional credit at 6–11% is cheaper and largely
  **inaccessible** to exactly this segment.
- **39% of agricultural households still use non-institutional credit.**
- A running passbook, input supply, price-risk absorption, and transport.

**A platform that offers a better price but not same-day cash is not competing
with the arhtiya. It is competing with the arhtiya's *worst* feature while
ignoring his *load-bearing* one.**

### 2.3 The graveyard — what happened to everyone who tried this

| Company | Outcome |
|---|---|
| **BharatAgri** | **Shut down.** Founder: positive unit economics, but high overhead + heavy marketing + low repeat orders. Failed to raise $6–8M. |
| **Ninjacart** | FY25 revenue **fell** ₹2,007cr → ₹1,634cr. Loss ₹256cr. Exited low-margin lines; profitability target pushed to FY27. |
| **WayCool** | **Pivoted away** from agri supply chain into SaaS + CPG. |
| **Greenikk** | Shut after 4 years — no product-market fit. |

**Sector funding collapse:**

```
All agritech:        $802M (2022) → $178M (2023) → $96M (H1 2025)
Agri marketplaces:   $490M (2021) → $26M (2024)      ← the specific model
                                                        BhoomiX currently is
```

The marketplace category didn't cool. **It was abandoned — a 95% decline.**

### 2.4 What is actually profitable

| Company | Model | Result |
|---|---|---|
| **Arya.ag** | Warehousing (5M tonnes, 5,500 warehouses) + **NBFC commodity financing (₹2,000cr book)** | **Only fully profitable agritech at scale.** Raised ₹725cr Series D, Jan 2026. |
| **DeHaat** | Input distribution + advisory + market linkage, via a **franchise/micro-entrepreneur network** | ₹3,000cr+ revenue, **₹369cr net profit** FY25 |

**Read this carefully.** The two winners monetise **finance, storage, and inputs.**
Neither makes its money on marketplace commission. Arya.ag's entire business *is*
"give the farmer the ability to wait" — sold as a financial product.

**This is the single most important finding in this document.**

### 2.5 The technology risk nobody in the pitch deck mentions

| Setting | Accuracy |
|---|---|
| PlantVillage-trained CNN, lab images | 99% |
| **Same model, real field photos** | **31%** |
| State-of-the-art, lab | 95–99% |
| State-of-the-art, field deployment | 70–85% |

Models trained on clean lab datasets learn the *background*, not the lesion.
BhoomiX uses a multimodal foundation model rather than a PlantVillage CNN, which
is a genuinely better starting position — but **the "94% accuracy" claim has not
been validated on a representative sample of real Indian smallholder field photos
taken on low-end phones in bad light.** Until it is, treat it as unproven.

> **Action:** this is the highest-priority technical risk. See §7.1.

### 2.6 The rails that already exist (and are underused)

This is the opportunity most competitors missed because they built in 2020–21,
before these matured:

| Rail | Status (2025–26) | Why it matters to BhoomiX |
|---|---|---|
| **AgriStack / Farmer Registry** | **6 crore Farmer IDs**, 17 states; **22 states** with land-record APIs; open modular architecture | Identity + land verification **for free**. Solves "cannot prove", half of it. |
| **e-NWR (electronic warehouse receipt)** | 44.8 Mt regulated capacity; ~54 Mt e-NWRs issued | Legal instrument to **pledge stored grain for a loan** |
| **CGS-NPF** | ₹1,000cr credit-guarantee corpus, explicitly *to reduce distress sales* | De-risks the lender. Government is paying for the exact outcome BhoomiX wants. |
| **FPO scheme** | **10,000 FPOs achieved Feb 2025**; **30 lakh farmers**, 40% women; ₹6,865cr outlay; ₹254cr equity grants; ₹453cr credit guarantees | **Pre-aggregated, pre-funded customers.** |
| **KCC expansion** | Collateral-free limit ₹1.6L → **₹2L** (Jan 2025); crop loan cap ₹3L → **₹5L**; effective rate **4%** | Cheap capital exists; the missing piece is *underwriting data* |

**Strategic read:** The State has built the roads. Almost nobody is driving on
them. BhoomiX does not need to build financial infrastructure — it needs to be
the **application layer** that makes existing infrastructure reachable by a farmer
with a ₹7,000 phone.

---

## 3. Why the obvious solution fails — stated plainly

> **"We connect farmers directly to buyers and remove the middleman."**

Four independent reasons this does not work:

1. **Liquidity.** The farmer needs cash on harvest day. Your buyer pays in 7–30
   days. The arhtiya paid *before* the harvest. You lose on timing regardless of
   price.

2. **Debt lock-in.** The crop is already collateral against an existing arhtiya
   loan. The farmer is not legally or socially free to sell it to you. You are
   not competing for a sale; you are asking him to default on his lender —
   who is also his neighbour, his input supplier, and his emergency fund.

3. **Aggregation economics.** One smallholder produces sub-truckload volumes.
   Someone must collect, grade, and consolidate. That someone has a cost. If it's
   you, you have just become a middleman with worse local knowledge and a higher
   cost base — which is precisely what Ninjacart's shrinking revenue shows.

4. **CAC vs. LTV.** Acquiring farmers one-by-one costs marketing money; each
   transacts a few times a year at thin margin. This killed BharatAgri *despite
   positive unit economics on each order.* The overhead of reaching the farmer
   exceeded the lifetime value of the farmer.

**None of these are solved by a better app.** They are solved by changing *who
the customer is* and *what is being sold*.

---

## 4. The reframe

### 4.1 Repositioning

| | Current framing | Proposed framing |
|---|---|---|
| **Problem** | Farmers get bad prices; crops get sick | Farmers cannot **wait** and cannot **prove** |
| **Product** | Marketplace + diagnosis app | **A farmer's verifiable production record**, which unlocks credit, storage, and premium buyers |
| **Customer** | Individual farmers | **FPOs** (10,000 exist, avg. 300 farmers each) |
| **Payer** | Farmers (no cash) | **Lenders, input companies, buyers, insurers** |
| **Moat** | Better UI | **Longitudinal plot-level data no bank can otherwise obtain** |
| **Competes with** | Ninjacart, DeHaat, mandi | *Nobody directly* — it's the missing data layer under existing rails |

### 4.2 The mechanism — how the two existing features become one system

The disease scanner is currently a free utility. **It is actually a data-capture
device.** Reframe it:

```
Farmer scans a diseased leaf
        │
        ├──► [immediate value to farmer]
        │    Diagnosis + treatment in his own language.  ← the hook. FREE, forever.
        │
        └──► [accumulating value to BhoomiX]
             timestamp + GPS plot + crop + growth stage
             + disease incidence + whether he acted on advice
                     │
        ┌────────────┴────────────┬──────────────────┐
        ▼                         ▼                  ▼
  Season history          Yield prediction      Practice quality
  per plot                (loss modelling)       (did he follow up?)
        │                         │                  │
        └────────────┬────────────┴──────────────────┘
                     ▼
        ┌────────────────────────────┐
        │  FARMER PRODUCTION RECORD  │  ← the actual product
        └────────────────────────────┘
             │        │        │        │
             ▼        ▼        ▼        ▼
          Lender  Insurer  Input co.  Buyer
        (under-   (claims  (targeted  (traceable,
        writing)  verif.)  demand)    graded supply)
```

**Every free scan makes the paid product more valuable.** That is a compounding
loop; a marketplace listing is not.

### 4.3 Why this breaks the debt cycle where a marketplace cannot

```
BEFORE                              AFTER
──────                              ─────
Harvest day.                        Harvest day.
Needs cash now.                     Deposits crop in a WDRA warehouse.
        │                                   │
        ▼                                   ▼
Sells to arhtiya at                 Receives e-NWR (digital receipt).
harvest-floor price.                        │
        │                                   ▼
        ▼                           Pledges e-NWR → loan @ ~7%,
Gets ~33% of consumer price.        de-risked by CGS-NPF guarantee.
        │                                   │
        ▼                                   ▼
Repays 18–24% interest.             Has cash. Does not need to sell.
        │                                   │
        ▼                                   ▼
No surplus. Borrows again.          Sells 2–4 months later,
                                    off-peak, at a higher price.
                                            │
                                            ▼
                                    Repays loan @7%. Keeps the spread.
```

The farmer's income rises **without anyone being disintermediated.** The arhtiya
can even remain in the chain as a buyer — he just loses his monopoly on *timing*.

This matters commercially: **you are not asking anyone to switch loyalties, break
a relationship, or trust a stranger with their only asset.** That is why this can
actually be adopted, and the marketplace pitch cannot.

---

## 5. The stack — ground level to enterprise

The brief asked for ground-to-enterprise. Each layer has a distinct problem, a
distinct BhoomiX role, and — critically — a **distinct payer.**

### Layer 0 — The plot
- **Problem:** disease unidentified; no record of what happened here.
- **BhoomiX:** photo scan → diagnosis → treatment, offline-capable, voice-first.
- **Payer:** nobody. This layer is free forever. It is the acquisition engine.
- **Success metric:** scans per plot per season (not downloads).

### Layer 1 — The farmer
- **Problem:** invisible to every formal institution. No provable history.
- **BhoomiX:** Farmer ID linked to AgriStack; cumulative production record;
  treatment adherence; plot boundary.
- **Payer:** nobody directly. This is the asset being built.
- **Success metric:** % of farmers with ≥1 complete season record.

### Layer 2 — The FPO / village cluster  ← **the wedge**
- **Problem:** 10,000 FPOs exist, most run on WhatsApp and paper. They cannot
  aggregate credibly, so they cannot bargain or borrow.
- **BhoomiX:** FPO dashboard — member roster, aggregate volume forecast by crop
  and week, disease-pressure heatmap, storage/collection coordination.
- **Payer:** FPO (small SaaS fee), or the FPO's promoting institution — **and note
  the ₹6,865cr scheme already funds these organisations.**
- **Why this is the wedge:** onboarding one FPO onboards 300–1,000 farmers with a
  trusted local intermediary doing the training. **This is a 300–1000× reduction
  in CAC — the exact failure that killed BharatAgri.**
- **Success metric:** FPOs onboarded; % of member farmers active.

### Layer 3 — Financial institutions
- **Problem:** banks/NBFCs want agri exposure (priority-sector obligations) but
  cannot underwrite smallholders — no data, high cost to assess, no collateral.
- **BhoomiX:** underwriting API — plot history, verified yield estimate, disease
  risk score, e-NWR position. Originate storage-backed loans.
- **Payer:** **lender.** Origination fee + risk-data subscription. This is the
  primary revenue line. *(Arya.ag's ₹2,000cr book proves demand.)*
- **Success metric:** ₹ credit facilitated; portfolio delinquency vs. control.

### Layer 4 — Enterprise / corporate
- **Problem:** processors, exporters, and retail chains need **traceable,
  consistent, compliance-ready** supply. EU deforestation rules, residue limits,
  and private standards make provenance a hard requirement, not a nice-to-have.
- **BhoomiX:** verified sourcing — which plots, what was sprayed, when harvested;
  contract-farming management; forward volume visibility.
- **Payer:** **enterprise buyer** (per-tonne traceability fee) and **input majors**
  (verified last-mile distribution + demand signal — this is where DeHaat's ₹369cr
  profit comes from).
- **Success metric:** tonnes under traceability; repeat contracts.

### Layer 5 — The State
- **Problem:** scheme delivery is leaky; crop-loss assessment for PMFBY insurance
  is slow, expensive, and litigated.
- **BhoomiX:** AgriStack-native; timestamped geotagged loss evidence for claims;
  district-level disease surveillance (an early-warning system for outbreaks).
- **Payer:** government contracts / insurers. Slow, large, defensible.
- **Success metric:** states integrated; claim cycle-time reduction.

**Note the shape:** value flows *up* the stack, money flows *down*. The farmer
never pays. Layers 3–5 pay for what Layers 0–2 generate.

---

## 6. Revenue model

| Line | Payer | Basis | Timing |
|---|---|---|---|
| **Diagnosis & advisory** | — | Free forever | Now |
| **FPO SaaS** | FPO / promoter | ₹ per member per year | Phase 1 |
| **Credit origination** | NBFC / bank | % of disbursed value | Phase 2 ← *primary* |
| **Risk-data API** | Lender / insurer | Subscription + per-query | Phase 2 |
| **Input distribution** | Input companies | Margin / placement | Phase 2 |
| **Traceability** | Processors, exporters, retail | Per tonne | Phase 3 |
| **Marketplace commission** | Buyer | % of GMV | **Phase 3, deliberately last** |

**On the marketplace:** keep it, but demote it. It is a *feature of the FPO
dashboard* (help a collective sell aggregated stock), not the business. Attempting
to monetise it early is what the funding data says destroys companies.

**Rule of thumb from the evidence:** never build a revenue line that requires the
farmer to pay cash. He doesn't have any — that is the founding premise of the
whole analysis.

---

## 7. Sequencing

### Phase 0 — Validate the technology honestly (0–3 months)
The entire thesis rests on the scan being trustworthy. Right now that is unproven.

1. **Build a real field-test set.** 500–1,000 photos from actual smallholder
   plots — low-end phones, harsh midday light, cluttered backgrounds, wet leaves,
   partial occlusion. Not lab images. Not Google Images.
2. **Have a plant pathologist label them.** Ground truth, blind to model output.
3. **Publish the real number.** If field accuracy is 72%, say 72%. A defensible
   72% beats an unfalsifiable 94% — with judges, and with lenders who will
   diligence it.
4. **Add calibrated abstention.** The model must be able to say *"I'm not sure —
   here's your nearest KVK."* A confident wrong diagnosis that costs a farmer his
   crop is worse than no product. This is a genuine liability question.
5. Track **treatment-outcome feedback** ("did this work?") from day one. It is
   both the accuracy flywheel and the credit-behaviour signal.

**Kill criterion:** if field accuracy on the honest test set is below ~65% after
tuning, the diagnosis feature cannot anchor the product and the plan must change.

### Phase 1 — Win one FPO completely (3–9 months)
- Pick **one** FPO in one district. Target ~300–500 farmers. Preferably a crop
  with high disease pressure and high price volatility (tomato, onion, chilli).
- Ship the FPO dashboard. Get the manager using it daily.
- Instrument everything: scans/farmer/season, adherence, yield vs. district mean.
- **Goal:** one complete season of verified production records for 300+ farmers.
- **This dataset is the company.** Nothing else in Phase 1 matters.

### Phase 2 — Convert the record into credit (9–24 months)
- Partner with **one** NBFC. Do not build an NBFC.
- Pilot e-NWR pledge financing under **CGS-NPF** with that FPO's members.
- Prove the two numbers that decide everything:
  - **Realised price uplift** from selling off-peak vs. harvest-day.
  - **Delinquency** vs. the lender's existing agri book.
- If BhoomiX-underwritten loans default *less*, the business is established. Every
  lender in India becomes a customer, and the model becomes very hard to copy —
  a competitor would need years of longitudinal data to match it.

### Phase 3 — Enterprise and scale (24 months+)
- Traceability contracts with processors/exporters.
- Input-company distribution partnerships.
- Multi-state via AgriStack APIs (already live in 22 states).
- Marketplace switched on last, as a *service to FPOs*, not the core.

---

## 8. Risks, honestly stated

| Risk | Severity | Mitigation |
|---|---|---|
| **Field accuracy collapse** (§2.5) | **Critical** | Phase 0 is entirely this. Calibrated abstention. Human escalation to KVK. |
| **Wrong advice harms a crop** | **High — legal & ethical** | Abstention thresholds; never recommend restricted chemicals; log every recommendation; explicit "confirm with your KVK" for high-severity calls. |
| Farmer won't change behaviour | High | That's why we route through FPOs — a trusted local intermediary, not a cold app install. |
| FPOs are weak/dormant | Medium-High | Many of the 10,000 exist on paper. Screen hard for active ones with real turnover. Quality over count. |
| Lender won't partner without a track record | Medium | Chicken-and-egg. CGS-NPF guarantee absorbs the lender's downside — that's exactly what it's for. Start with a co-operative bank or a small NBFC. |
| Arhtiya opposition | Medium | Genuinely mitigated by design: we don't remove him, we remove his timing monopoly. He can still buy. Do not market this as anti-trader — it makes local enemies you need as partners. |
| Data privacy / farmer consent | Medium | Farmer data used for underwriting **must** be explicitly consented, revocable, and portable. Get this right early — DPDP Act applies, and an extractive-data reputation would be fatal in a trust business. |
| Funding winter | High | Sector funding is down 95% for marketplaces. **This plan is deliberately capital-light** — no warehouses, no fleet, no balance sheet. Partner for all of it. |
| Government dependency | Medium | AgriStack/CGS-NPF are policy-dependent. Design so the production record retains value even if a scheme lapses. |

**The largest risk is organisational, not technical:** this plan is slower and
less glamorous than "AI marketplace for farmers." It requires spending a year
getting 300 farmers in one district exactly right. Every failed competitor
optimised for scale before the loop closed.

---

## 9. Sources

- Agritech funding & shutdowns: [Inc42 — 25 startups that shut down in 2025](https://inc42.com/features/25-indian-startups-shut-down-in-2025/); [Entrepreneur India — agritech funding reset](https://www.entrepreneur.com/en-in/news-and-trends/from-boom-to-slowdown-agritech-faces-harsh-reset-as/501268)
- BharatAgri closure: [Inc42](https://inc42.com/buzz/agritech-startup-bharatagri-shuts-operations-due-to-funding-crunch/); [People Matters](https://www.peoplematters.in/news/business/bharatagri-shuts-shop-after-failing-to-secure-new-funding-round-47212)
- Ninjacart FY25: [Business Standard](https://www.business-standard.com/companies/news/ninjacart-posts-rs-256-cr-loss-in-fy25-revenue-drops-to-rs-1-634-cr-125122600743_1.html); [Agro Spectrum](https://agrospectrumindia.com/2025/12/29/ninjacarts-pivot-mirrors-broader-shake-up-in-indian-agritech.html)
- Marketplace vs. traditional markets: [The CapTable](https://the-captable.com/2024/12/india-agritech-marketplace-struggles/)
- Profitable models (DeHaat, Arya.ag): [Inc42 Agritech Landscape 2025](https://inc42.com/reports/indian-agritech-market-landscape-report-2025/)
- Arhtiya role & interest rates: [ThePrint](https://theprint.in/theprint-essential/modi-govt-insists-its-bills-will-free-farmers-from-shackles-of-arhatiyas-who-are-they/509829/); [Ideas for India — agrarian market interlinkages](https://www.ideasforindia.in/topics/agriculture/addressing-the-economic-trade-offs-of-interlinkages-in-contemporary-agrarian-markets)
- Crop losses: [SciDev — climate, pests and pollution](https://www.scidev.net/global/supported-content/climate-pests-and-pollution-fuel-crop-losses-across-india/); [DES Agri — pre/post harvest loss assessment](https://desagri.gov.in/wp-content/uploads/2024/03/2014-15-ASSESSMENT-OF-PRE-AND-POST-HARVEST-LOSSES-OF-IMPORTANT-CROPS-IN-INDIA.pdf)
- Extension gap: [ICRISAT — Agriculture Extension System in India](https://oar.icrisat.org/11401/1/Agriculture-Extension-System-in-India-A-Meta-analysis.pdf); [Foundation for Agrarian Studies](https://fas.org.in/access-to-information-and-agriculture-extension-services-for-farmer-households-evidence-from-the-situation-assessment-surveys/)
- AI field-accuracy gap: [Recent advances in plant disease detection (Plant Methods, 2025)](https://link.springer.com/article/10.1186/s13007-025-01450-0); [AI-driven plant disease detection review (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC13066816/)
- Farmer's share of consumer price: [Newsreel Asia](https://www.newsreel.asia/articles/whats-the-farmers-share-when-vegetables-reach-your-table); [Rural Voice](https://eng.ruralvoice.in/opinion/farmers-get-third-of-veggies-retail-price-middlemen-and-retailers-gain-from-price-spikes.html)
- e-NWR & CGS-NPF: [PIB — Credit Guarantee Scheme for e-NWR pledge financing](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2085018); [Drishti IAS — Warehousing Development](https://www.drishtiias.com/daily-updates/daily-news-analysis/warehousing-development)
- FPO scheme: [PIB — 10,000 FPOs achieved](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2106913)
- AgriStack: [ICRISAT ISSCA — DPI for Agriculture](https://issca.icrisat.org/scalable-solutions/digital-public-infrastructure-for-agriculture-agristack)
- KCC & credit gap: [PIB — Kisan Credit Card](https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=157771&ModuleId=3&reg=3&lang=1); [EY — Budget 2026 agri finance](https://www.ey.com/en_in/insights/tax/expectations-from-union-budget-2026-agri-sector-s-access-to-finance)

---

## 10. What changes in the codebase

Most of what exists is reusable. The changes are additive, not a rewrite.

**Keep as-is:**
- Crop/disease vision pipeline — becomes the acquisition hook *and* data capture
- 23-language layer — this is a genuine differentiator for FPO-led rural rollout
- Address/GPS — becomes **plot geotagging**, which is the spine of the record
- Auth, orders, realtime — reusable for FPO workflows

**Add (in priority order):**

1. **Scan history persistence** — every scan already produces a diagnosis; it must
   also write `{farmer_id, plot_geo, crop, stage, disease, severity, confidence, ts}`
   to a durable table. *Without this there is no product.* Highest priority.
2. **Confidence + abstention** in the vision response — surface uncertainty in the
   UI instead of always asserting an answer.
3. **Treatment follow-up prompt** — 7 days after a scan: *"Did it improve?"*
   Trains the model and generates the behavioural signal lenders need.
4. **Plot entity** — farmers have plots; plots have seasons; scans attach to plots.
   Currently scans attach to nothing.
5. **FPO role + dashboard** — an org layer above farmers, with aggregate views.
6. **Farmer production record view** — the season summary. This is the artefact
   shown to a lender.

**Deprioritise:** marketplace polish, additional storefront features. They are not
where the value is, and the funding data suggests they are actively a trap.

---

## 11. Closing judgement

The BhoomiX team correctly identified two real problems. The disease-detection gap
is severe, worsening, and under-served — that finding survives every check in this
document. The middleman problem is real too, but the *proposed solution to it* is
the one that has bankrupted better-funded teams, because it treats a financing
problem as a distribution problem.

The strongest version of BhoomiX is not "an app that removes the middleman." It is:

> **The record that makes a smallholder farmer legible to the formal economy —
> built by giving away the best crop-diagnosis tool in India, in every language a
> farmer speaks.**

That version has: a free hook with genuine standalone utility, a compounding data
moat, payers who actually have money, government rails already built underneath it,
and — unlike a marketplace — no need to convince anyone to betray their existing
lender.

It is also, usefully, a much better pitch. Judges have seen "AI for farmers" many
times. Almost nobody walks in and says: *here is why the last six companies that
tried this died, and here is the specific structural reason we don't.*
