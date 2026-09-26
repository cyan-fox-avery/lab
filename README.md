# Rock Go Crunch — Prototype 0.1

A tiny browser prototype for a gemstone mining / collecting game.

## What this prototype tests

The point of v0.1 is not to prove the whole game design. It tests three things:

1. Is choosing where to mine actually fun?
2. Does uncovering a gem feel satisfying?
3. Does a simple museum-style collection make you want to keep going?

## Included

- One fictional mine level
- 8×8 tappable rock face
- Quartz and amethyst
- Mineral-trace clues around hidden gems
- Limited tool durability per run, with **no waiting / energy timer**
- Raw → tumbled → cut processing
- Six permanent collection slots
- Selling duplicate specimens
- Three pick tiers
- Local save data using `localStorage`
- Simple generated sound effects with a mute button
- Mobile-first layout
- No external libraries or assets

## GitHub Pages setup

Replace the contents of the repository with:

- `index.html`
- `style.css`
- `script.js`
- `README.md`

Then make sure GitHub Pages is publishing from the repository's default branch / root directory.

No build step is required.

## Prototype balance

These values are intentionally temporary:

- 7 quartz + 3 amethyst hidden in each rock face
- Basic Pick: 26 swings
- Steel Pick: 34 swings, costs ¢80
- Geologist's Pick: 44 swings, costs ¢220
- Raw quartz sells for ¢4
- Raw amethyst sells for ¢10
- Processed specimens sell for more

The balance should be changed based on how the loop *feels*, not protected because it happened to be coded first.

## Save data

Progress is stored only in the browser on the current device. Use the **Reset prototype save** button in the Upgrades screen to start over.

## Design note

The mine is deliberately a fictional composite mine. The final game can use real gemology and geology facts without pretending that every featured gemstone naturally occurs together in one deposit.
