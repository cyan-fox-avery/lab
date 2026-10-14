# First Strawberry Day — playable slice

`v0.2.0-day-loop` in the top corner.

The first playable vertical slice of **Berry Delightful**, per
`FIRST_STRAWBERRY_DAY_BUILD_BRIEF.md` (on the `design-lab-part-2` branch of
`cyan-fox-avery/berry-delightful`): arrive at Starvale → harvest surviving
Earliglows → cook strawberry compote → sell it at the roadside stall.

## What's in

- 4 scenes: Farm (arrival), Field, Kitchen, Stall — plus a lightweight journal.
- Gentle journal hints that follow progress; free navigation, no tutorial railroading.
- Immediate confirmed stall sales (nothing sells without an explicit Confirm).
- No daily action cap. No day loop, no weather — "First Strawberry Day" names the
  play session, not a calendar day.
- Atomic transactions with specific, gentle error messages.
- Visible version; restart via "Start over"; autosaves to localStorage
  (key `berry-slice-v1`, separate from the grey-box saves).

## What's deliberately out (deferred, not rejected)

Festival, Christmas, 7-tier progression, cow prop, crop catalog, weather/storms,
the 8-beat tutorial, shop, experiments, Buddy systems, achievements, field guide.
See the build brief for the full list.

## Run it

Any static server from the repo root, then open `/slice/`:

    python3 -m http.server 8000
    # → http://localhost:8000/slice/

Or open `slice/index.html` directly (localStorage may be limited under `file://`
in some browsers — the game still plays; progress just won't persist).

## Test notes (v0.1.0)

- Engine logic headless-tested with node: full loop (harvest ×3 → cook → sell),
  insufficient-stock/coin error paths, no-duplicate/no-negative atomicity.
- Browser/device testing: **not yet performed** — needs iPad Safari hands-on.
- All dialogue is placeholder, flagged `[DRAFT DIALOGUE]`.
