# Rock Go Crunch — v2.1

A mobile-first static browser prototype for gemstone / geology collecting, museum completion, and incremental upgrades.

## v2.1 focus

This is a playability / UX update. It does **not** add a new depth or new minerals.

### Mining improvements
- 10×10 fixed rock face remains unchanged in size.
- Every fresh face now receives **1–3 faint prospecting tells**.
- These marks are intentionally subtle and are usually near a real geological deposit, but they are not guarantees.
- Pick durability is shown in a **sticky mobile mining HUD** above the bottom navigation, so it stays visible while scrolling.

### Area scanner
Surveying is now spatial instead of listing the entire hidden board.

- Tap **Scan area**, then tap a tile.
- The scanner analyzes the surrounding **3×3 area**.
- Scanning does not use pick durability.
- Scan charges reset on every fresh rock face. There is no real-time recharge.
- A separate **Scanner Charges** upgrade adds more scans per face.

Scanner analysis progression:
1. **Field Scanner** — chemical signatures and signal strength.
2. **Spectral Scanner** — chemistry plus likely deposit pattern and anomaly detection.
3. **Mineral Analyzer** — exact mineral identification and fossil / historical-object distinction.

Early scanners deliberately report chemistry rather than magically naming a gem. For example, quartz and amethyst can both appear as a silicon dioxide (`SiO₂`) signature.

### Workbench quality-of-life
- Materials with anything currently in inventory get a visible **sparkle badge / glow**.
- The Workbench tab itself gets a sparkle notification when inventory is waiting.
- Each stage now has **Sell All**.
- Sell All automatically reserves one specimen when that museum slot is still empty.
- The ordinary single-item Sell button remains available if the player explicitly wants to sell that last museum copy.

### Auto-process
A new upgrade unlocks an **Auto-process ON/OFF toggle**.

When enabled:
- newly mined processable finds move through the highest processing stage the current workshop can handle;
- processing remains free;
- one undonated museum specimen is reserved at each stage so automation does not quietly sabotage museum completion.

Example: early quartz finds naturally build a reserved Raw copy, then a reserved Tumbled copy, then begin reaching Cut once those museum reserves exist.

### Museum layout
- Multi-stage materials return to a compact **three-across specimen layout** on mobile.
- Facts are no longer crammed under tiny specimen icons.
- Tap a collected specimen to show its fact in a readable full-width panel beneath the row.

### Mineral Mastery
Completing all Raw / Tumbled / Cut museum slots for supported gemstone minerals awards:
- a permanent **Mastered** badge;
- a one-time cash collection reward;
- an additional completion-only geology / gemology fact.

Current mastery rewards:
- Quartz: 25¢
- Amethyst: 40¢
- Garnet: 65¢
- Topaz: 80¢

Larger permanent stat bonuses are intentionally saved for future collection milestones rather than being added to every mineral completion.

## Existing v2 saves

v2.1 intentionally continues using the existing localStorage key:

`rock-go-crunch-v2`

Existing v2 inventory, money, upgrades, museum donations, and current mine progress should carry forward. New v2.1 fields are filled in safely when an older save is loaded.

If an older save already completed a mastery-eligible mineral, its one-time mastery cash reward is granted automatically on first v2.1 load.

## Files

Replace the repository root with these files:

- `index.html`
- `style.css`
- `script.js`
- `README.md`

No build process, external libraries, or asset folders are required.
