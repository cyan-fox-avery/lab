# Rock Go Crunch — v3.0

A mobile-first static browser prototype about mining, prospecting, processing, collecting, and building a geology museum.

## Install on GitHub Pages

Replace the repository root with these four files:

- `index.html`
- `style.css`
- `script.js`
- `README.md`

No build step, package manager, backend, or external asset folder is required.

The game stores progress in browser `localStorage`. v3.0 deliberately keeps the same save key as v2/v2.1 so existing prototype progress can migrate forward.

## v3.0 highlights

### Three mine depths

**Depth 1 — Upper Seam**
- Quartz
- Amethyst
- Hematite → Iron
- Chalcopyrite → Copper
- rare Trilobite / Mining Tag finds

**Depth 2 — Lower Works**
- earlier finds continue at different rates
- Garnet
- Topaz
- Pyrite

**Depth 3 — Deep Gallery**
- earlier finds continue at different rates
- Citrine
- Calcite
- Fluorite
- Aquamarine
- Sapphire
- Cassiterite → Tin
- Ammonite fossil
- Old Mining Lamp artifact

Depth 3 is not a replacement for earlier depths. Earlier materials continue to matter and remain collectible.

### Mining

- 10×10 fixed mine face
- isolated finds, small veins, and occasional large veins
- 1–3 subtle natural prospecting tells on a fresh face
- fixed tile geometry: reveals do not resize the grid
- pick durability is always visible on mobile
- no real-time energy or recharge timer

### Scanner v3

The scanner is spatial rather than a list of everything hidden on the board.

- each scan covers a 3×3 area
- scanned tiles stay visibly marked for the entire rock face
- overlapping scans accumulate instead of replacing previous scans
- scan a hidden occupied tile at least twice and it gains a very faint generic density outline
- the outline contains no colour and does not identify what is hidden
- lower scanner levels report chemistry, not exact gem identity
- later levels add deposit-pattern information and eventually exact mineral / anomaly identification
- scanner-use upgrades increase scans per face from 1 up to 6
- scanner charges reset immediately on a fresh face

This means a player can choose broad coverage or spend multiple scans narrowing down one promising area.

### Museum v3

Each material is displayed as a compact row of specimen columns.

- Raw / Tumbled / Cut stay three-across for gemstones and minerals
- ores use Ore / Refined columns
- each specimen has its own always-visible fact card directly beneath it
- uncollected specimen facts remain hidden
- no tapping is required to read collected facts
- completing an entire material set adds a mastery panel beneath the whole row
- the mastery panel contains an extra bonus fact

### Mastery and auto-processing

Auto-processing is no longer a global upgrade.

It unlocks separately for each processable material when that material's museum set is complete.

Examples:
- Quartz 3/3 → Quartz auto-process unlocked
- Amethyst 3/3 → Amethyst auto-process unlocked
- Hematite 2/2 → Hematite → Iron auto-refining unlocked

Each mastered material has its own ON/OFF toggle in its Workbench card. Because automation only unlocks after the museum set is complete, it never needs to hold a specimen back for donation.

Materials without a processing step can still earn a mastery badge and bonus fact.

### Workbench

- individual material accordions
- lifetime Found / Sold / Donated / Processed / Earned stats
- free manual processing
- Sell button for one item
- Sell All / Sell All Extras button
- Sell All protects one copy for an unfilled museum slot
- inventory sparkle appears on the specific material card that currently has stock
- no global Workbench notification badge

### Equipment progression

Upgrade tracks currently include:

- mine depth
- pick durability
- scanner analysis quality
- scanner uses per face
- workshop equipment

Workshop tiers:
- Basic Workshop
- Precision Workshop
- Advanced Lapidary

Aquamarine and sapphire require the Advanced Lapidary to process.

### Currency

Money is stored internally as integer cents.

Display rule:
- under 100 cents: `47¢`
- 100 cents and above: `$1.00`, `$1.01`, `$12.47`, etc.

There is one currency only. No premium currency or real-money purchases.

## Prototype geology note

The mine is intentionally a fictional composite mine. Mineral names, chemistry, processing relationships, and museum facts are grounded in real geology and gemology, but the game does not pretend that every included mineral would naturally occur together in one real deposit.
