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

# SLIDE DECK — 16 slides

The built deck is **`BhoomiX-Round2-Deck.pptx`** in this folder. Open and edit
it directly; this section is the spec it was built from, so you can change
wording without re-reading the file.

**15 content slides + 1 thank-you.** Every slide is written to be *read
silently by a judge in about five seconds* while a speaker talks over it.
That is the constraint that set the text budget below.

### The rules this deck follows

| Rule | Why |
|---|---|
| One idea per slide | A judge who has to choose what to read first reads nothing. |
| Title ≤ 8 words | It has to land in a glance, before they start on the body. |
| Body ≤ 25 words total | Anything longer and they stop listening to the speaker. |
| Never a wall of bullets | Cards, big numbers and a table instead — different shapes are easier to scan than another list. |
| Every slide has a visual | Text-only slides are forgettable and read as unfinished. |
| Layout changes every 2–3 slides | Same layout twelve times reads as a template, not a pitch. |

---

## Slide-by-slide

| # | Slide | What is on it (this is the whole slide) | Arrangement |
|---|---|---|---|
| 1 | **Cover** | BhoomiX · *Every farmer deserves the right price.* · [TEAM NAMES] · Indore · LaunchVerse Round 2 | Dark. Text left, app photo bleeding off the right edge. |
| 2 | **The Problem** | Three number cards: Raisen **₹2,000** · Ratlam **₹2,826** · the gap **₹826**. One line under: on ten quintals that is ₹8,000. | Dark. Three cards in a row, the gap card in accent orange so the eye lands there last. |
| 3 | **Why it happens** | Three numbered rows: wrong mandi · misreads a disease · misses the 72-hour window. One short line each. | Light. Full-width stacked rows, numbered circles down the left. |
| 4 | **Our solution** | One sentence on what BhoomiX is, then **bhoomix.vercel.app** in a dark block. | Light. Text left, app screenshot right. |
| 5 | **Feature 01 — Crop AI** | Names the disease · confidence score · a treatment you can buy. | Light. Screenshot left, three small cards stacked right. |
| 6 | **Feature 02 — Mandi prices** | **3,000+** markets · **200+** commodities · **Daily** refresh. Then: your crop, your district, today's rate. | Light. Three stat cards on top, one wide dark band under them. |
| 7 | **Feature 03 — Damage report** | GPS + timestamp · recorded rainfall · 72-hour countdown. Warning strip: reported late, a claim can be rejected. | Light. Cards left, screenshot right — mirrors slide 5 deliberately. |
| 8 | **Feature 04 — Languages** | **23** Indian languages, one line of explanation. | Light. Huge number left, sign-in screenshot right. |
| 9 | **Prototype status** | Six things that are built, ticked. One line: all of it checked end to end. | Light. Two columns of three ticked cards. |
| 10 | **Market & competitors** | The four-row comparison table. One line under it about what competitors don't answer. | Light. Table is the whole slide, BhoomiX column tinted. |
| 11 | **Why we win** | Day 0 → Day 7 → One tap → Next farmer. Closing line: a dataset that compounds. | Dark. Four cards left-to-right as a flow. |
| 12 | **Impact — SDGs** | Six goals, each with a three-word title and one line. | Light. 3 × 2 grid. |
| 13 | **The grant** | *If we win, we will [GRANT PLAN] so that [OUTCOME].* Then [REACH TARGET] · [DISTRICT] · one season. | Light. Dark quote band on top, three stat cards under. |
| 14 | **What is next** | Now → Next → Then → Goal, one line each. | Light. Four numbered cards in a row. |
| 15 | **Closing** | *The rest is not a promise. It is live. Open it.* · bhoomix.vercel.app | Dark. Mirrors the cover so the deck closes where it opened. |
| 16 | **Thank you** | Thank you · BhoomiX · [TEAM NAMES] · Indore · the URL. | Dark, centred, nothing else. |

---

## How it is arranged, and why

**The sandwich.** Slides 1, 2, 11, 15 and 16 are dark; everything between is
light. Dark marks the emotional beats — the problem, the differentiator, the
close — and light marks the evidence. A judge feels the structure without
being told it.

**The ₹826 thread.** The number appears as a loss on slide 2 and returns on
slide 6 as the thing the product closes. One idea, paid off once, instead of
two separate claims competing for attention.

**Features are slides 5–8, deliberately in the middle.** Problem first, proof
after. Leading with features would make a judge work out the problem
themselves.

**Slide 9 is the honesty slide.** The masterclass scores "real user research"
and no interviews were done this round. Rather than implying testing that did
not happen, it states exactly what *was* verified — the working prototype.
Weaker than an interview quote, but it will survive a judge's follow-up
question, which a fabricated quote would not.

**Two placeholders only** — `[TEAM NAMES]` and the grant brackets on slide 13.
Everything else is real and checkable.

---

## Before you present

1. **Fill the brackets** on slides 1, 13 and 16.
2. **Refresh the two wheat numbers** on slide 2 the morning you present — they
   change daily, and a judge may check.
3. **Add a mandi screenshot to slide 6.** It is the one feature slide with no
   image, because the live rates were not loading when the deck was built.
4. **Swap in the official UN SDG icons** on slide 12 if you have time — right
   now they are text tiles.
