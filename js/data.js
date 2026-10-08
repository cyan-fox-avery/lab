/* Berry Delightful — grey-box prototype: static data.
   Economy numbers: first-pass from DESIGN.md ("the prototype validates").
   Costs marked PROVISIONAL were invented for the prototype. */
"use strict";

const VERSION = "v0.1.0-greybox";
const ACTIONS_PER_DAY = 4; // tunable per design doc
const DAY_ICONS = ["🌅", "🌞", "🌇", "🌙"]; // rhythm display, never a timer

const DRAFT = "[DRAFT DIALOGUE — placeholder, review & rewrite before any official release]";

const CULTIVARS = {
  earliglow: {
    name: "Earliglow", emoji: "🍓",
    blurb: "The early flavour benchmark. These old berries shrink fast, but the taste is the yardstick everything's judged against.",
    basketPrice: 5, tier: 0,
  },
  annapolis: {
    name: "Annapolis", emoji: "🍓",
    blurb: "Medium-large berries that hold their size pick after pick. Productive and hardy — an excellent Ontario fit.",
    basketPrice: 8, tier: 1, plantCost: 60,
  },
  honeoye: {
    name: "Honeoye", emoji: "🍓",
    blurb: "Perfume-like flavour, best in cool weather — heat is its enemy. Very productive.",
    basketPrice: 8, tier: 1, plantCost: 60,
    heatSensitive: true,
  },
  cavendish: {
    name: "Cavendish", emoji: "🍓",
    blurb: "Large fruit, very productive — the most broadly successful mid-season berry in recent Canadian trials.",
    basketPrice: 10, tier: 2, plantCost: 100, // PROVISIONAL price
  },
};

// Appliance keys: null = old saucepan (always available), 'pot', 'mixer', 'mixer2', 'blender'
const RECIPES = {
  compote: {
    name: "Strawberry Compote", emoji: "🫙", tier: 1, appliance: null,
    ingredients: { earliglow: 1 }, pantry: 2, sell: 20,
    desc: "Scruffy Earliglows + sugar. Cooking transforms.",
  },
  shortcake: {
    name: "Strawberry Shortcake", emoji: "🍰", tier: 1, appliance: "mixer",
    ingredients: { annapolis: 1 }, pantry: 5, sell: 40,
    desc: "The iconic first real bake. Almond-flour, GF by default.",
  },
  smoothie: {
    name: "Fresh Berry Smoothie", emoji: "🥤", tier: 1, appliance: "blender",
    ingredients: { honeoye: 1 }, pantry: 3, sell: 25,
    desc: "Honeoye, bright and cold.",
  },
  jam: {
    name: "Basic Strawberry Jam", emoji: "🍯", tier: 1, appliance: "pot",
    ingredients: { annapolis: 2 }, pantry: 3, sell: 30,
    desc: "The iconic preserve. The big pot makes it real jam.",
  },
  thumbprints: {
    name: "Jam Thumbprints", emoji: "🍪", tier: 2, appliance: "mixer2",
    ingredients: {}, needsJam: 1, pantry: 6, sell: 55, // PROVISIONAL price
    desc: "Cookie dough + T1 jam. Recipes that eat other recipes.",
  },
  honeycake: {
    name: "Honey Strawberry Cake", emoji: "🍰", tier: 2, appliance: "mixer2",
    ingredients: { cavendish: 1 }, needsHoney: 1, pantry: 7, sell: 65, // PROVISIONAL
    desc: "Hive honey + Cavendish. The cross-column showcase.",
  },
  custardtart: {
    name: "Strawberry Custard Tart", emoji: "🥧", tier: 2, appliance: "mixer2",
    ingredients: { annapolis: 2 }, pantry: 9, sell: 80, // PROVISIONAL
    desc: "Tart shell, vanilla custard, glazed Annapolis. The pretty one.",
  },
  pie: {
    name: "Strawberry Pie", emoji: "🥧", tier: 2, appliance: null,
    ingredients: { cavendish: 2 }, pantry: 6, sell: 60, // PROVISIONAL
    desc: "Simple crumb-top. The original.",
  },
};

const APPLIANCE_NAMES = {
  mixer: "Stand mixer", mixer2: "High-end stand mixer",
  blender: "Blender", pot: "Big preserving pot",
};

const SHOP = [
  { id: "boxes", name: "Raised planter box", emoji: "🪴", cost: 80, tier: 1,
    desc: "+1 bed. The farm literally grows." },
  { id: "plant-annapolis", name: "Annapolis crowns", emoji: "🌱", cost: 60, tier: 1, plant: "annapolis",
    desc: "Plant into an empty bed. 3 days to first fruit." },
  { id: "plant-honeoye", name: "Honeoye crowns", emoji: "🌱", cost: 60, tier: 1, plant: "honeoye",
    desc: "Plant into an empty bed. Perfume in cool weather." },
  { id: "mixer", name: "Stand mixer", emoji: "🎛️", cost: 80, tier: 1, appliance: "mixer", // PROVISIONAL cost
    desc: "Unlocks shortcake. Big pink statement piece (in the real game)." },
  { id: "blender", name: "Blender", emoji: "🥤", cost: 80, tier: 1, appliance: "blender", // PROVISIONAL cost
    desc: "Unlocks smoothies." },
  { id: "pot", name: "Big preserving pot", emoji: "🍲", cost: 80, tier: 1, appliance: "pot", // PROVISIONAL cost
    desc: "Unlocks real jam. Old saucepan era: over." },
  { id: "mixer2", name: "High-end stand mixer", emoji: "🎛️", cost: 170, tier: 2, appliance: "mixer2", reqAppliance: "mixer", // PROVISIONAL
    desc: "Tier-2 cakes and tarts require it." },
  { id: "beehive", name: "Beehive + pollinator garden", emoji: "🐝", cost: 170, tier: 2, // PROVISIONAL
    desc: "Flowers and bees. A jar of honey fills every few days — a gift, not a job." },
  { id: "plant-cavendish", name: "Cavendish crowns", emoji: "🌱", cost: 100, tier: 2, plant: "cavendish", // PROVISIONAL
    desc: "Plant into an empty bed. The reliable producer." },
];

const T2_UNLOCK_EARNINGS = 150; // PROVISIONAL: lifetime earnings to unlock tier 2
const HONEY_EVERY_DAYS = 3;

// Experiment ingredient options (prototype-simple: pick 2)
const EXPERIMENT_INGREDIENTS = [
  { id: "earliglow", name: "Earliglow", emoji: "🍓" },
  { id: "annapolis", name: "Annapolis", emoji: "🍓" },
  { id: "honeoye", name: "Honeoye", emoji: "🍓" },
  { id: "cavendish", name: "Cavendish", emoji: "🍓" },
  { id: "honey", name: "Honey", emoji: "🍯" },
  { id: "jam", name: "Jam", emoji: "🫙" },
];

const PIG_VERDICTS = [
  "*INHALES* …Ten out of ten. Would inhale again.",
  "The pig considers this an excellent outcome. The pig is never wrong about these things.",
  "*happy snorting* A bold choice. A correct choice.",
  "Crumbs: gone. Dignity: intact. Verdict: superb.",
  "The pig has tasted many things. This ranks.",
];

const PIG_IDLE_LINES = [
  "The pig is asleep in a sunbeam. It is not a small sunbeam. Neither is the pig.",
  "The pig investigates a pebble with great seriousness.",
  "Somewhere, a basket is in danger.",
  "The pig twitches its snout at the smell of baking.",
];

/* Placeholder dialogue — all marked DRAFT for review before any official release. */
const DIALOGUE = {
  intro: [
    { who: "📓", text: "Starvale Farm. The old Earliglow patch is a tangle, the farmhouse is dusty, and something large is asleep in the barn." },
    { who: "📓", text: "Let's walk the loop once, the way it will go all season: tend, harvest, bake, sell." },
  ],
  june: [
    { who: "June", text: "Well now. Starvale's farmgate box, open again after all these years." },
    { who: "June", text: "I'll take that first jar, dear — and at my price, not yours. This farm used to feed half the concession road, you know." },
    { who: "📓", text: "June pays 25 coins for the first jar and tells you what this farm used to be." },
  ],
  barbara_secret: [
    { who: "Barbara", text: "Some recipes aren't written down, dear." },
  ],
  supplier: [
    { who: "📦", text: "A crate from the local farm supplier: Annapolis crowns and the first raised planter boxes. 'Heard Starvale was reopening. On the house.'" },
  ],
  pig_first: [
    { who: "📓", text: "Something enormous is asleep in the barn. It has a curly tail." },
    { who: "📓", text: "It is already your pig. It came with the farm. Name it — it answers to anything." },
  ],
  pig_fed_berry: [
    { who: "📓", text: "The pig investigates the berry, gets underfoot, and flops dramatically in the fresh straw." },
  ],
};
