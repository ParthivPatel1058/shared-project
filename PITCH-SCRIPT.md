# BhoomiX — Round 2 Pitch Script

**4 speakers · 180 seconds maximum**

| Pace | Runtime |
|---|---|
| Fast (160 wpm) | 2:20 |
| **Normal (145 wpm)** | **2:34** |
| Slow / nervous (130 wpm) | 2:52 |

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
| ~~"BhoomiX asks: did it work?"~~ | ❌ **Rewritten** | **Not built yet** — now framed as the grant plan |

---

## ⚠️ Fill these in before filming

Five slots marked `[LIKE THIS]` are your real user research. I have **not**
invented them — a made-up farmer quote collapses at the first follow-up
question.

| Slot | What goes there |
|---|---|
| `[NAMES]` | Your four names |
| `[N]` farmers | How many you actually spoke to |
| `[M]` | How many confirmed the problem |
| `[QUOTE]` | One real sentence, their words |
| `[GRANT PLAN]` | Specific and small |

---

# THE SCRIPT

---

### 🎙️ SPEAKER 1 — *The Problem* · 0:00 – 0:36

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

### 🎙️ SPEAKER 2 — *The Prototype* · 0:36 – 1:16

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

### 🎙️ SPEAKER 3 — *Real Users & Market* · 1:16 – 1:50

> **ON SCREEN:** A photo of you talking to farmers, then the table.

**"We didn't guess. We spoke to [N] farmers around Indore. [M] had sold low
simply because they didn't know that morning's rate.**

**One said — [QUOTE]**

*(beat — table appears)*

**India has crop-disease apps, and they're good at what they do. But they
tell you what's wrong and stop. No mandi rate. No insurance help. And none of
them are built for one district's reality."**

> **TABLE ON SCREEN** (don't read aloud):
>
> | | Others | BhoomiX |
> |---|---|---|
> | Disease diagnosis | Yes | Yes |
> | Live mandi prices | No | **Yes** |
> | Insurance claim help | No | **Yes** |
> | Indian languages | Some | **23** |

---

### 🎙️ SPEAKER 4 — *Why We Win & The Grant* · 1:50 – 2:34

> **ON SCREEN:** The diagnosis screen, then a simple mock of the four
> follow-up buttons labelled **"Coming with the grant."** Label it honestly.

**"Every crop app in India has millions of photos of sick plants. Not one has
the answer to what actually cured them.**

**That's what we'll build with this grant.**

**Seven days after a diagnosis, BhoomiX asks one question. Did the treatment
work? Cured. Improved. No change. Worse.**

*(beat)*

**Every answer makes the next farmer's advice sharper. That's a dataset that
compounds — you can't copy it by launching a similar app. You earn it, one
harvest at a time.**

**We'll [GRANT PLAN] — reaching [N] farmers across [DISTRICT] in one season.**

*(beat — app on screen)*

**The rest isn't a promise. It's live. Open it.**

**BhoomiX. Every farmer deserves the right price."**

---

## Runtime

| Speaker | Words | At 145 wpm |
|---|---|---|
| 1 | 92 | 0:38 |
| 2 | 95 | 0:39 |
| 3 | 74 | 0:31 |
| 4 | 111 | 0:46 |
| **Total** | **372** | **2:34** |

---

## Before you film

**1. Refresh the wheat numbers.** They change daily. Open Mandi Prices →
Madhya Pradesh → Wheat, take the lowest and highest modal price, and update
Speaker 1. The point survives whatever the numbers are — the gap is always
there.

**2. Label the follow-up mock honestly.** Speaker 4 now says "that's what
we'll build with this grant," which is true and satisfies the masterclass's
"show what winning unlocks" requirement. Do **not** let the visual imply it
already works.

**3. Do the interviews.** Five farmers, fifteen minutes. It's a scored
requirement and the one thing here you cannot fake.

---

## What changed after fact-checking

**The Plantix download figure is gone.** Sources disagree — some say 34–37M
installs, one says 135M. A judge opening the Play Store and seeing a
different badge would undermine everything else you said. The comparison
works without it.

**"Top reason claims are rejected" became "can be rejected outright."**
Many sources repeat the first version but none cite an official statistic.
The second version is the scheme rule itself and is unarguable.

**The follow-up loop moved from present tense to the grant plan.** The
database column and index exist, but no screen asks the question and
diagnoses aren't saved yet. Claiming a live feature that a judge could ask to
see was the single biggest risk in the first draft.
