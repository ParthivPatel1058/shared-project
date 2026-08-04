# Young Social Innovators Hunt — Idea Proposal

> Brief: *"Spot a real problem in your community and build something that fixes it."*
>
> Researched August 2026. Sources at §10.

---

## 1. The problem — and it happened in your city

Between **29 December 2025 and February 2026**, in **Bhagirathpura, Indore**, sewage
leaked into a municipal drinking-water pipeline.

| | |
|---|---|
| Deaths | **32** (as of 20 Feb 2026) |
| Non-fatal injuries | **~1,400** |
| People screened | 4,800+ |
| Cause | Sewage entering the drinking water pipeline through a leak |
| Neighbourhood | A lower-income colony |

Now read the single most important sentence in this entire document:

> **Residents had been warning authorities for months that the tap water smelled
> foul. Their complaints went unheeded.**

A ₹2.4 crore tender to replace that pipeline was issued in **2022**. No
substantial work started. One PHE official was later dismissed, two suspended,
and the Madhya Pradesh High Court set up a commission of inquiry headed by a
former judge.

Separately, the High Court asked the Indore Municipal Corporation why its own
citizen app **has no option to upload a photograph** of a problem.

### 1.1 Where exactly the system failed

This is the part that matters, because it tells you what to build.

```
Families notice foul water           ← the information EXISTED
        │
        ▼
They complain, individually, verbally, to different officials
        │
        ▼
No photo. No timestamp. No location pin. No record.
        │
        ▼
Each complaint is one family — easy to dismiss as "just them"
        │
        ▼
Nobody ever sees the 200 complaints TOGETHER, in one place, on one map
        │
        ▼
No proof anything was reported → no accountability → no urgency
        │
        ▼
                        32 people die
```

**The community was not short of information. It was short of a way to make that
information visible, countable, and impossible to ignore.**

That is a software problem. It is exactly the kind of thing a small team can fix,
and it is exactly the kind of thing that no large company will build.

---

## 2. The idea

**A community water-safety early-warning system.**

Working names: *JalRakshak*, *NalCheck*, *PaniLog*. Pick later.

Five parts, in order of importance:

### Part 1 — Report in 20 seconds (the foundation)
A resident opens the app (or sends a WhatsApp message) and taps:
- What's wrong? **Smell / Colour / Taste / Illness in the house**
- Photo of the water in a glass
- Location captured automatically

No typing. No login for a first report. No literacy requirement.

### Part 2 — Cluster detection (this is the whole point)
One report is an anecdote. Twenty reports in one colony inside seven days is an
**outbreak signal.**

The system watches for that automatically:

> *"14 households in Bhagirathpura have reported foul-smelling water in the last
> 6 days. This is 14× the normal rate for this area."*

**This alert would have fired in mid-December 2025.**

### Part 3 — The accountability clock
Every confirmed cluster gets a public counter:

> **Reported 23 days ago · Status: no response**

Public, permanent, and shareable. This is the part that creates pressure. A
complaint that can be ignored quietly gets ignored. A number on a public
dashboard that goes up every day does not.

### Part 4 — AI test-strip reading
A colorimetric test strip costs a few rupees. The problem is that reading the
colour by eye is subjective, and photographing it gives different results in
different light.

The app photographs the strip **next to a printed reference card**, and a vision
model corrects for lighting and reads the result — chlorine, pH, nitrate,
turbidity. Research shows smartphone colorimetry reaches near-100% accuracy where
the colour difference is clear, and confirms **lighting variability is the main
open challenge** — which is precisely the part worth solving and demonstrating.

### Part 5 — Automatic escalation
When a cluster is confirmed, the app generates a single formal complaint with
every report, photo, timestamp and GPS pin attached, addressed to IMC / PHE — and
logs that it was sent. Now there is a paper trail that did not exist in December.

---

## 3. Why this fits your competition better than anything else

| Judging criterion | How this scores |
|---|---|
| **Real problem in your community** | 32 people died in your city, this year. Not hypothetical. |
| **You can reach real users** | Indore residents, RWAs, and your own school. You can walk there. |
| **Feedback is fast** | Every household has an opinion about their tap water. |
| **Uses AI meaningfully** | Strip colour reading under variable light + outbreak cluster detection. Not AI bolted on for show. |
| **Robotics path later** | Low-cost inline sensors at community taps and borewells. |
| **Passive business potential** | §5 — small recurring revenue, tiny running costs. |
| **Maintainable part-time** | No inventory, no logistics, no delivery fleet. |
| **Nobody else is doing it** | Civic apps are one-way complaint boxes. None of them aggregate, cluster, or hold a public clock. |

**And the honest emotional truth:** you can stand in front of judges and say
*"this happened 20 minutes from our school, the warnings existed for months, and
nobody could see them together. We built the thing that would have seen them."*

That is a fundamentally stronger pitch than another marketplace app.

---

## 4. Why this succeeds where a normal complaint app fails

Existing civic apps — including IMC's own — are **one-way**: you report into a
void and hear nothing. That is why people stop using them, and why they didn't
help in December.

Three design decisions change the outcome:

| Normal complaint app | This |
|---|---|
| Your complaint goes to an official inbox | Your report goes onto a **public map** immediately |
| One citizen vs. one department | **Clustering** turns 20 individuals into one undeniable signal |
| No consequence for silence | A **public timer** counts the days of silence |
| Text form, needs literacy | Icons, photo, voice — works for everyone |
| No evidence | Photo + GPS + timestamp + strip reading = evidence |

The insight is simple: **you are not building a channel to the government. You
are building a mirror the community can hold up to itself, that the government
happens to be able to see.**

---

## 5. The business — small, boring, sustainable

Your costs are the same as BhoomiX: roughly **₹3,000–6,000/month** for hosting,
database, and AI calls. So the bar is low.

| Revenue line | Who pays | Realistic |
|---|---|---|
| **RWA / colony dashboard** | Resident Welfare Associations | ₹300–800/month each. Indore has hundreds. |
| **School water-safety programme** | Schools | ₹5,000–15,000/year. Students test their own school's water — and this is also your growth engine. |
| **Test strip kits** | Households, schools | Small margin, mostly a service not a profit line |
| **Municipal / CSR dashboard** | IMC, water utilities, CSR funds | Lumpy but large; water safety is a top CSR category |
| **Anonymised ward-level reports** | Researchers, NGOs, press | Later |

**Break-even: roughly 10 RWAs at ₹500/month.** That is one afternoon of
door-knocking in your own neighbourhood.

The school programme is the important one: every school that joins gives you
hundreds of student testers, real data, parent awareness, and a reference for the
next school. It compounds without you spending money.

---

## 6. The first 90 days (how you get real user feedback)

| Weeks | Do this | Proof you succeeded |
|---|---|---|
| 1–2 | **Talk to 20 households** in an affected or nearby colony. Ask only: *"When your water looked wrong, what did you do?"* Write down the answers. | You can quote real people in your pitch |
| 3–4 | Build the 20-second report flow. Nothing else. | A neighbour can file a report without help |
| 5–6 | Build the map + cluster alert | 10 seeded reports trigger a visible alert |
| 7–8 | **Your own school**: test the water, publish the result | First real dataset, first institutional user |
| 9–10 | Add AI strip reading with a reference card | Reading matches a lab/known sample within tolerance |
| 11–12 | Onboard 3 RWAs free; add the accountability clock | Real reports from people you don't know |

**Do the week 1–2 interviews before writing any code.** Twenty conversations will
change the product more than twenty features will.

---

## 7. Risks — read this section twice

| Risk | Severity | What you must do |
|---|---|---|
| **A false "safe" reading gets someone killed** | **CRITICAL** | Never display the word "safe". Ever. Show *"no problem detected in this test"* plus, always: *"if the water looks, smells or tastes wrong, do not drink it — boil it."* Your test is a screening aid, never a clearance. |
| Test strips don't detect sewage bacteria | **High** | Strips read chemistry, not E. coli. **Say so plainly.** The smell/colour/illness reports are what actually catch sewage — the strip is supporting evidence, not the detector. Do not overclaim this in your pitch; a judge who knows water testing will catch it. |
| False alarms cause panic | Medium | Require a minimum cluster size and moderator review before a public alert. Show report counts, not conclusions. |
| Political pushback | Medium | Frame as *civic partnership*, not accusation. Publish facts and dates, never blame. Offer IMC a free dashboard from day one — bring them in rather than attacking them. |
| Nobody reports when water is fine | Medium — expected | That's correct behaviour. Success is not daily usage; it's being there on the day it matters. Keep costs near zero so quiet months don't hurt. |
| Privacy of complainants | Medium | Public map shows **areas**, never house-level addresses or names. |
| You're students; exams exist | Medium | Ship the report flow and the map. Those two alone would have helped in December. Everything else is optional. |

**The single most dangerous thing you could build is a product that tells someone
their water is fine when it isn't.** Design against that from the first line of
code, and say so in your pitch — judges will respect it enormously.

---

## 8. Two alternatives I considered, and why they rank lower

**A. School mental-health support.** The data is stark: **25.9% of school
adolescents show depression, 13.7% anxiety**, fewer than **10%** access any
service, and India has **0.75 psychiatrists per 100,000** people. Real, huge, and
you have unfair access as students.
*Why not first:* the liability is severe. A student-built tool responding to a
child in crisis is an ethical minefield, and doing it badly causes real harm.
Worth doing only with a professional partner organisation.

**B. Civic reporting in general** (potholes, garbage, streetlights). The High
Court's criticism of the IMC app shows the gap is real.
*Why not first:* too broad, no life-or-death urgency, and it competes with
several existing municipal apps. Water is the sharp, defensible wedge — and you
can always widen later.

---

## 9. What I'd actually do

Build the water early-warning system. Specifically:

1. **This week:** interview 20 households. No code.
2. **Reuse what you already have.** Your BhoomiX stack — React, Supabase, auth,
   GPS/address handling, image capture, the AI vision pipeline, and the
   23-language layer — covers perhaps 60% of this. You are not starting over.
3. **Ship two things first:** the 20-second report, and the cluster map.
4. **Get your own school tested** in the first month. It's your foothold.

The 23-language work you already did matters more here than it did in BhoomiX:
the people who died were in a lower-income colony, and the people most likely to
be ignored are the least likely to be reading English.

---

## 10. Sources

**Indore water contamination**
- [2025 Indore drinking water contamination — Wikipedia](https://en.wikipedia.org/wiki/2025_Indore_drinking_water_contamination)
- [Outlook India — death toll, official dismissed and suspended](https://www.outlookindia.com/national/indore-water-contamination-official-dismissed-two-suspended-as-death-toll-rises-to-10)
- [Deccan Herald — deaths rise after sewage pipeline contaminates drinking water](https://www.deccanherald.com/amp/story/india%2Fmadhya-pradesh%2Fnumber-of-deaths-rise-to-10-after-sewage-pipeline-contaminates-drinking-water-indore-tragedy-3849851)
- [News on AIR — MP High Court sets up commission of inquiry](https://www.newsonair.gov.in/madhya-pradesh-hc-sets-up-commission-of-inquiry-to-investigate-water-contamination-issue-in-bhagirathpura/)
- [The Probe — how authorities failed citizens](https://theprobe.in/top-stories/indore-water-tragedy-shows-how-authorities-failed-citizens-2107198)
- [India Water Portal — why Indore got safe water wrong](https://www.indiawaterportal.org/water-quality-and-pollution/water-quality-/the-science-of-safe-water-is-clear-why-did-indore-still-get-it-wrong-and-how-can-citizens-stay-safe)
- [Down To Earth — Indore's liquid waste crisis](https://www.downtoearth.org.in/water/indores-clean-image-masks-a-liquid-waste-crisis)
- [Free Press Journal — High Court on the missing photo-upload option in the IMC app](https://www.freepressjournal.in/indore/why-no-waterlogging-complaint-option-in-indore-municipal-corporation-app-high-court-asks)

**Smartphone water testing feasibility**
- [A critical review of smartphone cameras in water quality analysis (2025)](https://www.tandfonline.com/doi/full/10.1080/21622515.2025.2593442)
- [Hybrid human–machine colorimetric water monitoring (Springer, 2025)](https://link.springer.com/article/10.1007/s10661-025-13983-x)
- [Validating smartphone-based water quality monitoring (IWA, 2025)](https://iwaponline.com/wpt/article/20/3/653/107173/Validating-smartphone-based-water-quality)

**Adolescent mental health (alternative A)**
- [Depression and anxiety among school adolescents of Delhi (PMC, 2025)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11922383/)
- [School mental health in India: narrative review (2025)](https://www.tandfonline.com/doi/full/10.1080/17450128.2025.2535359)
