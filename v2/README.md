# Grey Box 2 — stripped baseline

A stripped-down mechanics prototype of *Berry Delightful*, built for **cohesion
testing**: does the bare core loop (tend → harvest → bake → sell) hold together
before any further systems are layered back on?

Avery playtested Grey Box 1 (v1, preserved untouched at the repo root for
comparison) and felt overwhelmed — scope creep from added systems, and too many
buttons/tabs visible at once. Grey Box 2 strips it back to the original core
design. Systems will be re-added **one by one** afterward, based on playtesting.

## What's removed vs v1

- **Weather** — no forecast, no rain auto-watering, no heat effects. Watering is
  always manual; beds grow overnight only if watered by hand.
- **Action budget** — no daily action limit, no "dusk nudge." Days end only via
  the 🛏️ bedroom door (Farmhouse). Crops still grow overnight on endDay.
- **Journal UI** — the 📓 journal button and journal screen are gone.
  Autosave to localStorage continues invisibly (separate key:
  `berry-greybox-v2`, so v1 saves are untouched).

## What's new vs v1

- **Progressive tab introduction** (Avery's playtest feedback, Mira-endorsed):
  only 🌾 Field is visible at first. Tabs unlock inside the tutorial the moment
  they become relevant, each with a one-line intro toast:
  - 🏠 Farmhouse at beat 3 (bedroom door to end the day)
  - 🍳 Kitchen + 📖 Cookbook at beat 4 (first bake)
  - 🐖 Farmyard at beat 6 (the pig)
  - 🛒 Shop at beat 7 (reopening bundle)
  - 🔄 New (reset) stays visible throughout
  - 📓 Journal never appears (removed)

## What's kept

Everything else: 8 tutorial beats (minimal rewording only where they referenced
removed systems), coins, T1/T2 shop + 8 recipes, experimenting (including the
single directional hint for out-of-reach tier-2 combos), pig naming (default
"Buddy"), 4 scenes, emoji-differentiated buttons, `[DRAFT DIALOGUE]` flags,
day advancement via bedtime.

Version string: `v0.2.0-greybox-v2` (top corner).

## Running it

Vanilla HTML/CSS/JS — no build step. Open `v2/index.html` in a browser
(mobile-sized is the target).

Disposable, like v1. Do not build on it without checking with Avery first.
