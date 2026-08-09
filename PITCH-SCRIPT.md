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
