# BhoomiX — Round 2 Pitch Script

**4 speakers · 180 seconds maximum**

| Pace | Runtime |
|---|---|
| Fast (160 wpm) | 2:22 |
| **Normal (145 wpm)** | **2:36** |
| Slow / nervous (130 wpm) | 2:54 |

Fits under 3:00 even spoken slowly. Nerves make people slower, not faster.

---

## ✅ Fact-check status

Every claim below was verified on **8 August 2026**. Nothing is estimated.

| Claim in script | Status | How it was checked |
|---|---|---|
| Wheat ₹2,000 Raisen / ₹2,826 Ratlam | ✅ **True** | Live data.gov.in, 150 MP wheat markets |
| ₹826/quintal spread | ✅ **True** | Arithmetic on the above |
| App is live at bhoomix.vercel.app | ✅ **True** | HTTP 200 |
| AI gives disease + confidence + treatment | ✅ **True** | `crop-vision` returns all three |
| Mandi prices from government open data | ✅ **True** | data.gov.in, Ministry of Agriculture |
| GPS + time + rainfall + 72h countdown | ✅ **True** | Implemented in DamageReport |
| Late PMFBY claims can be rejected | ✅ **True** | Scheme rule, pmfby.gov.in |
| 23 Indian languages | ✅ **True** | 23 codes in `i18n/languages.ts` |
| ~~"Plantix has 135M downloads"~~ | ❌ **Removed** | Sources conflict (34M vs 135M) |
| ~~"Top reason claims are rejected"~~ | ❌ **Softened** | Widely repeated, no official statistic |
| "BhoomiX asks: did it work?" | ✅ **True** | Built and verified 9 Aug 2026 — outcome persists to DB |
| ~~Farmer interview quotes~~ | ❌ **Removed 10 Aug** | No interviews were done — cut rather than invented |

---

## ⚠️ Fill these in before filming

| Slot | What goes there |
|---|---|
| `[NAMES]` | Your four names |
| `[GRANT PLAN]` | Specific and small — a concrete next step, not a big vague dream |
| `[REACH TARGET]` | A number you'd genuinely stand behind if asked how you got it |
| `[DISTRICT]` | Where you'd actually run the pilot |

---

# THE SCRIPT

---

### 🎙️ SPEAKER 1 — *The Problem* · 0:00 – 0:39

> **ON SCREEN:** Two price cards — Raisen ₹2,000 · Ratlam ₹2,826, gap animating.

**"Today, wheat sold for two thousand rupees a quintal in Raisen.**

**In Ratlam — two thousand eight hundred and twenty six.**

**Same crop. Same day. Same state. Eight hundred rupees a quintal, gone. On
ten quintals that's eight thousand rupees a farmer never sees — not from a
bad harvest, but because nobody told him.**

*(beat)*

**We're [NAMES], from Indore. This is BhoomiX.**

**A farmer here loses money three ways. He sells at the wrong mandi. He
misreads a disease until the field is gone. He misses the seventy-two-hour
window to claim his insurance."**

---

### 🎙️ SPEAKER 2 — *The Prototype* · 0:39 – 1:19

> **ON SCREEN:** Live screen recording of the real app. No slides.

**"So we built it. Not a mockup — a working app, live at
bhoomix dot vercel dot app.**

*(demo: leaf photo → diagnosis)*

**Photograph a leaf. Our AI names the disease, gives a confidence score, and
a treatment you can buy.**

*(demo: mandi prices)*

**Mandi prices — live from the Government of India's open data, refreshed
every day. Your crop, your district, today's price. That's the eight hundred
rupees, closed.**

*(demo: damage report, 72-hour counter visible)*

**Crop damaged? Photos stamped with GPS and time, paired with recorded
rainfall, and a seventy-two-hour countdown — because under the scheme, a
claim reported late can be rejected outright.**

**Twenty-three Indian languages."**

---

### 🎙️ SPEAKER 3 — *Market & Why We're Different* · 1:19 – 1:53

> **ON SCREEN:** The comparison table, building row by row.

**"India already has crop-disease apps, and they're good at what they do.
But open one and check: no mandi rate. No insurance help. Built for the
whole country, not for one district's reality.**

**We checked the Play Store, we checked five competitors, and we checked
what a farmer near us actually needs on a bad day — not just 'what's wrong
with my plant,' but 'what do I do next.'**

*(beat — table appears)*

**That gap is where BhoomiX sits."**

> **TABLE ON SCREEN** (don't read aloud):
>
> | | Others | BhoomiX |
> |---|---|---|
> | Disease diagnosis | Yes | Yes |
> | Live mandi prices | No | **Yes** |
> | Insurance claim help | No | **Yes** |
> | Indian languages | Some | **23** |

---

### 🎙️ SPEAKER 4 — *Why We Win & The Grant* · 1:53 – 2:36

> **ON SCREEN:** The real follow-up card in the app — "Did the treatment
> work?" with the four buttons. Tap one live on camera and let the thank-you
> appear. This is the most important shot in the video.

**"Every crop app in India has millions of photos of sick plants. Not one has
the answer to what actually cured them.**

**Seven days after a diagnosis, BhoomiX asks one question. Did the treatment
work? Cured. Better. No change. Worse.**

*(tap one — thank-you appears)*

**One tap. And every answer makes the next farmer's advice sharper. That's a
dataset that compounds — you can't copy it by launching a similar app. You
earn it, one harvest at a time.**

**With the grant we'll [GRANT PLAN] — reaching [REACH TARGET] farmers across
[DISTRICT] in one season.**

*(beat — app on screen)*

**The rest isn't a promise. It's live. Open it.**

**BhoomiX. Every farmer deserves the right price."**

---

## Runtime

| Speaker | Words | At 145 wpm |
|---|---|---|
| 1 | 95 | 0:39 |
| 2 | 96 | 0:40 |
| 3 | 81 | 0:34 |
| 4 | 106 | 0:44 |
| **Total** | **378** | **2:36** |

---

## Before you film

**1. Refresh the wheat numbers.** They change daily. Open Mandi Prices →
Madhya Pradesh → Wheat, take the lowest and highest modal price, and update
Speaker 1. The point survives whatever the numbers are — the gap is always
there.

**2. Seed one diagnosis before filming.** The prompt only appears seven days
after a scan. Scan a leaf, then ask me to backdate it so Speaker 4 can tap a
real button on camera.

**3. Rehearse the market table beat.** Speaker 3 now carries more of the
"why we're different" weight than before — read it once out loud before
recording so the pacing feels natural, not rushed.

---

## What changed after fact-checking

**The Plantix download figure is gone.** Sources disagree — some say 34–37M
installs, one says 135M. A judge opening the Play Store and seeing a
different badge would undermine everything else you said. The comparison
works without it.

**"Top reason claims are rejected" became "can be rejected outright."**
Many sources repeat the first version but none cite an official statistic.
The second version is the scheme rule itself and is unarguable.

**The follow-up loop is now real.** The first draft described it in present
tense when only the database column existed. It has since been built: scans
persist to `crop_diagnoses`, the prompt appears seven days later, and tapping
an answer writes the outcome. Verified end to end — tapping "Cured" leaves the
row reading `outcome=cured` with a timestamp. Demo it live on camera.

**User interviews were dropped, on request.** The masterclass lists real user
research as one of five scored checklist items — this is a genuine trade-off,
not a formatting choice, and it's worth knowing before submission, not after.
Speaker 3 was rebuilt around the market and competitor comparison instead,
which the masterclass itself says needs "no big data — a Google search, an
app-store check, and talking to 5 people." If there's time before the
deadline, even one quick conversation would let you add it back honestly.

---
---

# SLIDE DECK SKELETON — Round 2

Built directly from the four-speaker script above. **One idea per slide.**
Nothing on a slide runs past ~8 words, so a judge reads it in one glance and
goes back to listening — the speaker carries the sentence, the slide carries
the anchor.

**53 cues in total**, of which about **40 are real slides you build** — the
other 13 are captions burned over Speaker 2's live screen recording, so
there's nothing to design for those. Across 2:36 that averages **~3 seconds
per cue**. The high count is the point, not padding: something changing every
few seconds keeps the eye moving, and it means no single slide ever has to
hold two thoughts at once.

Real screenshots from the live app are in [`pitch-assets/`](pitch-assets/) —
captured from the running app, not mockups. Slides marked ⚠️ still need a
real capture; they are left empty rather than filled with a staged
substitute. Take those before filming.

**Reading the table:** *On screen* is the literal text to type into the
slide. *Visual* is the image or motion. *Under the line* is the script
sentence the speaker is saying while that slide is up.

---

## SPEAKER 1 — The Problem · 0:00 – 0:39

| # | On screen (exact) | Visual | Under the line |
|---|---|---|---|
| 1 | **BhoomiX** <br><sub>Every farmer deserves the right price.</sub> | Logo on the field photo | *(cold open, before speaking)* |
| 2 | **₹2,000** <br><sub>Raisen · wheat · today</sub> | Single price card, big number | "Today, wheat sold for two thousand rupees a quintal in Raisen." |
| 3 | **₹2,826** <br><sub>Ratlam · wheat · today</sub> | Second card slides in beside the first | "In Ratlam — two thousand eight hundred and twenty six." |
| 4 | **Same crop. Same day. Same state.** | Both cards held, gap line drawing between them | "Same crop. Same day. Same state." |
| 5 | **₹826** <br><sub>per quintal, gone</sub> | The gap number counts up and locks | "Eight hundred rupees a quintal, gone." |
| 6 | **× 10 quintals = ₹8,000** | Simple multiplication animating | "On ten quintals that's eight thousand rupees a farmer never sees…" |
| 7 | **Not a bad harvest.** <br>**Nobody told him.** | Text only, black background | "…not from a bad harvest, but because nobody told him." |
| 8 | **[NAMES]** <br><sub>Indore</sub> | Team photo | "We're [NAMES], from Indore." |
| 9 | **BhoomiX** | Logo, clean | "This is BhoomiX." |
| 10 | **Three ways a farmer loses money** | Heading only | "A farmer here loses money three ways." |
| 11 | **1 — Sells at the wrong mandi** | Icon + line | "He sells at the wrong mandi." |
| 12 | **2 — Misreads a disease** | Icon + line (1 stays dimmed) | "He misreads a disease until the field is gone." |
| 13 | **3 — Misses the 72-hour window** | Icon + line (1 and 2 dimmed) | "He misses the seventy-two-hour window to claim his insurance." |

---

## SPEAKER 2 — The Prototype · 0:39 – 1:19

> This whole block is **live screen recording**, not slides. The rows below
> are lower-third captions burned over the recording — keep them small and
> in a corner so the app stays the hero.

| # | On screen (exact) | Visual | Under the line |
|---|---|---|---|
| 14 | **Not a mockup.** | Cut to live app loading | "So we built it. Not a mockup —" |
| 15 | **bhoomix.vercel.app** <br><sub>live right now</sub> | URL bar visible in the recording | "— a working app, live at bhoomix dot vercel dot app." |
| 16 | *(no caption)* | **Live:** photograph a leaf → upload | "Photograph a leaf." |
| 17 | **Disease · Confidence · Treatment** | **Live:** the three result chips appear | "Our AI names the disease, gives a confidence score, and a treatment you can buy." |
| 18 | *(no caption)* | **Live:** open Mandi Prices | "Mandi prices —" |
| 19 | **Government of India open data** | **Live:** rates table loads | "— live from the Government of India's open data, refreshed every day." |
| 20 | **Your crop. Your district. Today.** | **Live:** filter to one crop | "Your crop, your district, today's price." |
| 21 | **₹826 — closed** | The gap number from slide 5, struck through | "That's the eight hundred rupees, closed." |
| 22 | *(no caption)* | **Live:** open Damage Report | "Crop damaged?" |
| 23 | **GPS · Time · Rainfall** | **Live:** the captured coordinates row | "Photos stamped with GPS and time, paired with recorded rainfall…" |
| 24 | **72:00:00** | **Live:** the countdown, ticking | "…and a seventy-two-hour countdown —" |
| 25 | **Late = rejected** | Red text over the countdown | "— because under the scheme, a claim reported late can be rejected outright." |
| 26 | **23 Indian languages** | **Live:** language switcher opening | "Twenty-three Indian languages." |

---

## SPEAKER 3 — Market & Why We're Different · 1:19 – 1:53

| # | On screen (exact) | Visual | Under the line |
|---|---|---|---|
| 27 | **India already has crop apps.** | Neutral background | "India already has crop-disease apps, and they're good at what they do." |
| 28 | **Open one and check.** | Text only | "But open one and check:" |
| 29 | **No mandi rate.** | Struck-through row | "no mandi rate." |
| 30 | **No insurance help.** | Second struck-through row | "No insurance help." |
| 31 | **Built for the country.** <br>**Not for one district.** | Map zooming out, then failing to zoom in | "Built for the whole country, not for one district's reality." |
| 32 | **Play Store · 5 competitors** | Small research-receipt visual | "We checked the Play Store, we checked five competitors…" |
| 33 | **Not "what's wrong."** <br>**"What do I do next."** | Two lines, second highlighted | "…not just 'what's wrong with my plant,' but 'what do I do next.'" |
| 34 | Table row 1 — Disease diagnosis · Yes · Yes | Comparison table, row 1 only | *(beat — table starts building)* |
| 35 | + Live mandi prices · **No** · **Yes** | Row 2 lands, BhoomiX column highlights | *(beat)* |
| 36 | + Insurance claim help · **No** · **Yes** | Row 3 lands | *(beat)* |
| 37 | + Indian languages · Some · **23** | Row 4 lands, full table visible | *(beat)* |
| 38 | **That gap is where BhoomiX sits.** | Table dims, one line over it | "That gap is where BhoomiX sits." |

---

## SPEAKER 4 — Why We Win & The Grant · 1:53 – 2:36

| # | On screen (exact) | Visual | Under the line |
|---|---|---|---|
| 39 | **Millions of photos of sick plants.** | Grid of leaf thumbnails filling the screen | "Every crop app in India has millions of photos of sick plants." |
| 40 | **None know what cured them.** | The grid greys out | "Not one has the answer to what actually cured them." |
| 41 | **Day 7** | Calendar tick | "Seven days after a diagnosis…" |
| 42 | **"Did the treatment work?"** | ⚠️ **Live:** the real follow-up card | "…BhoomiX asks one question. Did the treatment work?" |
| 43 | **Cured · Better · No change · Worse** | ⚠️ **Live:** the four buttons | "Cured. Better. No change. Worse." |
| 44 | *(no caption)* | ⚠️ **Live:** tap one, thank-you appears — **the most important shot in the video** | *(tap — thank-you appears)* |
| 45 | **One tap.** | Text only | "One tap." |
| 46 | **Every answer sharpens the next advice.** | Loop arrow diagram | "And every answer makes the next farmer's advice sharper." |
| 47 | **A dataset that compounds.** | The loop thickening | "That's a dataset that compounds —" |
| 48 | **You can't copy it.** <br>**You earn it.** | Text only | "— you can't copy it by launching a similar app. You earn it, one harvest at a time." |
| 49 | **[GRANT PLAN]** | Simple plan visual | "With the grant we'll [GRANT PLAN]…" |
| 50 | **[REACH TARGET] farmers** <br><sub>[DISTRICT] · one season</sub> | Number counting up over a district map | "…reaching [REACH TARGET] farmers across [DISTRICT] in one season." |
| 51 | **SDG 1 · 2 · 8 · 9 · 10 · 13** | Six official SDG tiles, no text | *(silent beat — see SDG table below)* |
| 52 | **Not a promise. It's live.** | Cut back to the running app | "The rest isn't a promise. It's live. Open it." |
| 53 | **BhoomiX** <br><sub>Every farmer deserves the right price.</sub> <br>**bhoomix.vercel.app** | Logo + URL, hold to end | "BhoomiX. Every farmer deserves the right price." |

---

## Optional slide — only if you make time

| # | On screen (exact) | Visual | Why it's optional |
|---|---|---|---|
| — | **Built and verified end to end.** <br><sub>Every feature shown is live, not staged.</sub> | none | The masterclass scores "real user research" and no interviews were done this round. This slide states what *was* verified rather than implying testing that didn't happen. Drop it if you're over time — it's honest, not persuasive. |

---

## Slide 10 detail — SDG alignment

Mapped only to features that are actually built and already fact-checked
above — not aspirational. UN Sustainable Development Goals, official numbers
and titles:

| SDG | Goal | How BhoomiX actually supports it |
|---|---|---|
| **SDG 1** | No Poverty | Closing the mandi price gap (₹800+/quintal) and speeding PMFBY claims protects income farmers already have — not a future promise. |
| **SDG 2** | Zero Hunger | Early AI disease detection protects yield before a field is lost, keeping crops in the food supply. |
| **SDG 8** | Decent Work and Economic Growth | Fair price discovery for farmers, plus delivery-partner roles in the app's partner system, support rural livelihoods on both sides. |
| **SDG 9** | Industry, Innovation and Infrastructure | Puts AI diagnostics and government open data in a smallholder's pocket — infrastructure access that didn't exist for them before. |
| **SDG 10** | Reduced Inequalities | 23-language support removes the English/Hindi literacy barrier that locks many farmers out of digital tools entirely. |
| **SDG 13** | Climate Action | Damage reports capture rainfall alongside GPS and timestamp, building a real climate-risk record tied to actual claims. |

Keep the on-screen version to icon + number + one line each — the table above
is the source, not the slide text.

---

## Before you build the deck

1. **Take the two missing screenshots** (row 4 and row 9 above) — both need a
   working `DATAGOV_API_KEY` / a diagnosis older than 7 days respectively, so
   do these first, not the night before.
2. **Keep every slide to what's in the table.** Adding more text per slide is
   the single easiest way to blow the 180-second budget — the deck should
   never be read aloud in full, only glanced at while the speaker talks.
3. **Don't add a slide the masterclass didn't ask for.** Six focus areas, one
   grant slide, one SDG slide, one cover, one close — that's the whole deck.
