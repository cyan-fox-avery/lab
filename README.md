# Rock Go Crunch — v3.1

A mobile-first static browser prototype about mining, prospecting, processing, collecting, and building a geology museum.

## Install on GitHub Pages

Replace the repository root with these four files:

- `index.html`
- `style.css`
- `script.js`
- `README.md`

No build step, package manager, backend, or external asset folder is required.

The game stores progress in browser `localStorage`. v3.1 keeps the same save key as v2, v2.1, and v3.0 so existing prototype progress can migrate forward.

## v3.1 focus

v3.1 is a polish pass on the v3.0 systems rather than another content expansion.

### Workbench readability

- inventory notifications now sit at the far left of the specific material card
- the notification disappears immediately when that material's inventory reaches zero
- mastered material cards use a subtle gilded frame instead of repeatedly displaying `MASTERED`
- the old global Workbench notification remains removed

### Mastery-gated Sell All

A new **Sell All** control appears at the top of the Workbench.

It only sells inventory belonging to **mastered minerals and ores**.

That means:
- unmastered materials are never bulk-sold
- fossils and historical artifacts are never touched by the global Sell All button
- completing a museum set gradually expands how much of the selling loop can be automated
- manual single-item selling is still available inside each material card

The Workbench shows the current value and number of items eligible for bulk selling.

### Museum cleanup

The museum keeps the compact v3 layout:

- Raw / Tumbled / Cut stay three-across where applicable
- each specimen keeps its own always-visible fact card underneath
- empty specimens still say `Not collected`
- completed specimens no longer redundantly say `Collected`
- completed material sets use a gilded frame as the visual mastery indicator
- the repeated `MASTERED` labels have been removed
- the completion panel now focuses on genuinely new information: a **Bonus discovery** fact
- processable materials also show that auto-processing has been unlocked

### Mastery and auto-processing

Auto-processing remains per-material.

Examples:
- Quartz 3/3 → Quartz auto-process unlocks
- Amethyst 3/3 → Amethyst auto-process unlocks
- Hematite 2/2 → Hematite-to-Iron auto-refining unlocks

Because automation only unlocks after a material's museum set is complete, the game never has to hold a specimen back for that material.

### Visual readability pass

v3.1 improves the placeholder item art without attempting the full custom-sprite overhaul planned for a future major version.

- Quartz, Amethyst, and Citrine now deliberately share the same base crystal silhouette because they are all quartz varieties
- Garnet, Topaz, Pyrite, Calcite, Fluorite, Aquamarine, and Sapphire use more distinct silhouettes
- ores have more visibly different shapes and palettes
- Topaz, Citrine, Pyrite, and Chalcopyrite are separated more clearly instead of occupying nearly the same yellow-gold visual space
- refined Iron, Copper, and Tin remain visually metallic and distinct

## Current content

### Depth 1 — Upper Seam
- Quartz
- Amethyst
- Hematite → Iron
- Chalcopyrite → Copper
- rare Trilobite / Mining Tag finds

### Depth 2 — Lower Works
- earlier finds continue at different rates
- Garnet
- Topaz
- Pyrite

### Depth 3 — Deep Gallery
- earlier finds continue at different rates
- Citrine
- Calcite
- Fluorite
- Aquamarine
- Sapphire
- Cassiterite → Tin
- Ammonite fossil
- Old Mining Lamp artifact

## Scanner

The v3 scanner design is preserved:

- each scan covers a 3×3 area
- scanned tiles stay marked for the whole rock face
- overlapping scans accumulate
- a hidden occupied tile scanned at least twice gets a very faint generic density outline
- the outline does not reveal identity or colour
- lower scanner levels report chemistry before exact mineral identity
- later upgrades improve analysis
- scan-use upgrades increase the number of scans per face
- scanner uses and pick durability reset on a fresh face without real-time waiting

## Currency

Money is stored internally as integer cents.

Display rule:
- under 100 cents: `47¢`
- 100 cents and above: `$1.00`, `$1.01`, `$12.47`, etc.

There is one currency only. No premium currency or real-money purchases.

## Prototype geology note

The mine is intentionally a fictional composite mine. Mineral names, chemistry, processing relationships, and museum facts are grounded in real geology and gemology, but the game does not pretend that every included mineral would naturally occur together in one real deposit.
