# lab — Berry Delightful grey-box prototype

This repo currently holds a **disposable grey-box prototype** of *Berry Delightful*
(Avery's cozy strawberry-farm game for Fiona), covering the **tutorial + Act I
(through tier 2)**. It replaced the repo's previous redundant contents; the old
files remain in git history.

Vanilla HTML/CSS/JS — no build step. Open `index.html` in a browser (mobile-sized
is the target), or use the GitHub Pages site.

## What it is

A mechanics prototype. Grey boxes, emoji buttons, placeholder dialogue. It exists
to answer: does the 4-action day budget feel right? Does the day loop flow? Is
experimenting fun? Is the economy sane?

**In scope:** 8 tutorial beats · day loop with tunable action budget (morning →
dusk rhythm, never a timer) · weather forecast (rain auto-waters) · coins ·
T1/T2 shop + 8 recipes · experimenting (failed bakes → the pig) · journal with
autosave (localStorage) · pig naming (default suggestion "Buddy") · 4 grey-box
scenes (field, farmhouse, kitchen, farmyard).

**Out of scope:** souvenirs/keepsakes · festival + countdown · tiers 3–7 ·
postgame · hint ladders · visual polish · every parked design-thread pitch.

## Status

`v0.1.1-greybox` in the top corner. All dialogue is placeholder, flagged
`[DRAFT DIALOGUE]` for review and rewrite before any official release. Economy
numbers are first-pass from the design doc ("the prototype validates"); costs
marked PROVISIONAL in `js/data.js` were invented for the prototype. Tuned
generously per the "easy to finish, gentle to fail" pillar.

Design thread: `cyan-fox-avery/berry-delightful` PR #3 (`design-lab-part-2`).
