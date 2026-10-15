/* Berry Delightful — "A day at Starvale" slice: game engine.
   DOM-independent on purpose, so the logic can be tested headless.
   Storage: localStorage key 'berry-slice-v3' (fresh schema; earlier keys are
   never read or migrated — clean break between prototype versions, Avery 2026-10-13).
   Scope: arrival -> harvest -> cook -> sell, day loop, plus the Nursery's
   first stock: plant Annapolis / Honeoye crowns into new beds, sell fresh baskets.
   No action cap, no weather, no penalties. Cozy: ripe berries wait. */
"use strict";

const SLICE_VERSION = "v0.3.0-nursery";
const SAVE_KEY = "berry-slice-v3";

const ECONOMY = {
  compotePantryCost: 2,  // coins of pantry staples; sugar is already in the inherited pantry
  compoteSell: 20,
  startCoins: 20,
  ripeAtStart: 3,        // a few berries already ripe on the old patch
  regrowYield: 3,        // provisional: regrown crops match the starter patch
  growDays: 3,           // DESIGN.md: new planting takes 3 days to first fruit
  bedYield: 3,           // provisional: new beds yield like the starter patch
  plantCost: { annapolis: 60, honeoye: 60 },  // Annapolis 60 per DESIGN.md; Honeoye 60 provisional
  basketSell: { earliglow: 5, annapolis: 8, honeoye: 8 },  // DESIGN.md fresh-basket prices
};

// Nursery stock (T1 varieties). Honeoye is mechanically identical to Annapolis
// for now — its heat-fussy contrast waits for weather, which is out of scope.
const VARIETIES = {
  annapolis: { name: "Annapolis", blurb: "Early, reliable, medium-large berries that hold size pick after pick." },
  honeoye: { name: "Honeoye", blurb: "Early and vigorous — a little heat-fussy, but generous when happy." },
};

const DRAFT = "[DRAFT DIALOGUE — placeholder, review & rewrite before any official release]";

const INTRO_LINES = [
  { who: "📓", text: "Starvale Farm. You bought it back — the farm you visited as a child, berry-stained fingers and all." },
  { who: "📓", text: "The old Earliglow patch is a tangle, the farmhouse is dusty, and the giant strawberry at the end of the driveway is still standing. It's yours." },
];

const JUNE_FIRST_SALE = [
  { who: "📓", text: "An older woman with a warm smile approaches the stall." },
  { who: "June", text: "Well now — Starvale's first jar. I'll take it, dear." },
  { who: "June", text: "This farm used to feed half the concession road, you know." },
];

const Slice = {
  state: null,

  newState() {
    return {
      v: 3,
      day: 1,
      coins: ECONOMY.startCoins,
      ripe: ECONOMY.ripeAtStart,
      harvested: 0,
      cooked: 0,
      sold: 0,
      // patch: "ready" (berries up) | "regrowing" (picked clean, resting)
      patch: "ready",
      watered: false,      // one optional watering per regrowth cycle
      regrowNights: 0,     // nights rested while regrowing
      // new beds from the Nursery. phase: "growing" | "ready" | "regrowing"
      beds: [],
      nextBedId: 1,
      inv: { earliglow: 0, compote: 0, annapolis: 0, honeoye: 0 },
      firstSaleDone: false,  // June's first jar (first compote sale)
      introShown: false,
      freshNoticeSeen: false,  // one-time "new season build" notice
      journal: [],
    };
  },

  /* ---------- persistence ---------- */
  save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.state)); } catch (e) {}
  },
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) { this.state = JSON.parse(raw); return true; }
    } catch (e) {}
    return false;
  },
  reset() {
    this.state = this.newState();
    this.journal("day", "First strawberry day", "Arrived at Starvale. The old Earliglow patch might still have a few berries.");
    this.save();
  },

  /* ---------- journal + hints ---------- */
  journal(kind, title, body) {
    this.state.journal.push({ kind, title, body });
    this.save();
  },

  // Gentle, progress-based hint. Never blocks, never seizes control, never nags.
  hint() {
    const s = this.state;
    const resting = s.patch === "regrowing"
      ? (s.watered
        ? "The patch is drinking. Tomorrow morning should bring berries."
        : "The old patch is resting. A drink would wake it sooner — or let it take its time.")
      : null;
    const growing = s.beds.some(b => b.phase === "growing");
    if (s.firstSaleDone && resting) return resting;
    if (s.firstSaleDone && growing) return "The new beds are growing in — first fruit in a few mornings.";
    if (s.firstSaleDone) return `Day ${s.day} at Starvale. The farm's awake — look around, or start over and run it again.`;
    if (s.inv.compote > 0) return "The stall by the lane is ready. June's usually first in line.";
    if (s.harvested > 0) return "Those berries won't cook themselves — the old saucepan is waiting in the kitchen.";
    if (resting) return resting;
    return "The old Earliglow patch might still have a few berries.";
  },

  /* ---------- the loop: harvest -> cook -> sell ---------- */
  harvest() {
    const s = this.state;
    if (s.ripe <= 0)
      return { ok: false, msg: "The old patch is picked clean — every ripe berry is already in your basket." };
    s.ripe--;
    s.harvested++;
    s.inv.earliglow++;
    if (s.ripe <= 0) {
      // Picked clean: the patch rests. Watering is optional and only helps.
      s.patch = "regrowing";
      s.watered = false;
      s.regrowNights = 0;
      this.journal("harvest", "Harvested an Earliglow basket",
        "The old patch is picked clean. It started everything — now it rests.");
    } else {
      this.journal("harvest", "Harvested an Earliglow basket",
        `${s.ripe} still ripe on the patch.`);
    }
    this.save();
    return { ok: true, msg: "🧺 +1 Earliglow basket." };
  },

  // Optional watering: helpful, never mandatory. One watering per regrowth
  // cycle; extra taps are a no-op. Never punishes.
  water() {
    const s = this.state;
    if (s.patch !== "regrowing")
      return { ok: false, msg: "The patch doesn't need water right now." };
    if (s.watered)
      return { ok: false, msg: "Already watered — the patch is drinking." };
    s.watered = true;
    this.journal("tend", "Watered the old patch", "A good drink. It should wake by tomorrow morning.");
    this.save();
    return { ok: true, msg: "💧 Watered. The patch will wake up sooner." };
  },

  // Advance one day. Saved BEFORE returning so a background-killed tab
  // can never lose the night. Cancel is handled in the UI: this is only
  // called from the confirmed gesture.
  endDay() {
    const s = this.state;
    const fromDay = s.day;
    s.day++;
    let woke = false;
    if (s.patch === "regrowing") {
      s.regrowNights++;
      if (s.watered || s.regrowNights >= 2) {
        s.ripe = ECONOMY.regrowYield;
        s.patch = "ready";
        s.watered = false;
        s.regrowNights = 0;
        woke = true;
      }
    }
    // new beds: first fruit after 3 mornings, then the same regrowth rhythm
    const wokeBeds = [];
    for (const bed of s.beds) {
      if (bed.phase === "growing") {
        bed.growNights++;
        if (bed.growNights >= ECONOMY.growDays) {
          bed.phase = "ready";
          bed.ripe = ECONOMY.bedYield;
          wokeBeds.push(VARIETIES[bed.variety].name);
        }
      } else if (bed.phase === "regrowing") {
        bed.regrowNights++;
        if (bed.watered || bed.regrowNights >= 2) {
          bed.phase = "ready";
          bed.ripe = ECONOMY.bedYield;
          bed.watered = false;
          bed.regrowNights = 0;
          wokeBeds.push(VARIETIES[bed.variety].name);
        }
      }
    }
    const lines = [];
    if (woke) lines.push("The old patch woke up — ripe berries again.");
    if (wokeBeds.length) lines.push(`New beds woke up: ${wokeBeds.join(", ")} — ripe.`);
    if (!lines.length)
      lines.push(s.patch === "regrowing" ? "The old patch is still resting." : "Morning at Starvale.");
    this.journal("day", `Day ${s.day}`, "Morning. " + lines.join(" "));
    this.save();
    return { ok: true, fromDay, toDay: s.day, woke };
  },

  cook() {
    const s = this.state;
    if ((s.inv.earliglow || 0) < 1)
      return { ok: false, msg: "Need an Earliglow basket first — check the old patch, out in the field." };
    if (s.coins < ECONOMY.compotePantryCost)
      return { ok: false, msg: `Need ${ECONOMY.compotePantryCost} coins for pantry staples (have ${s.coins}).` };
    // atomic: all preconditions checked above; mutate together
    s.inv.earliglow--;
    s.coins -= ECONOMY.compotePantryCost;
    s.inv.compote++;
    s.cooked++;
    this.journal("bake", "Cooked: Strawberry Compote", "The old saucepan. Scruffy Earliglows + sugar. Cooking transforms.");
    this.save();
    return { ok: true, msg: `🫙 Strawberry Compote! (sells for ${ECONOMY.compoteSell})` };
  },

  // Called only from an explicit Sell -> Confirm gesture in the UI.
  // kind: "compote" (June's first jar) or a fresh-basket variety.
  sell(kind = "compote") {
    const s = this.state;
    if (kind === "compote") {
      if ((s.inv.compote || 0) < 1)
        return { ok: false, msg: "Nothing to sell yet — the compote comes first." };
      // atomic: mutate together
      s.inv.compote--;
      s.coins += ECONOMY.compoteSell;
      s.sold++;
      const first = !s.firstSaleDone;
      s.firstSaleDone = true;
      this.journal("coins", `+${ECONOMY.compoteSell} coins`,
        first ? "Starvale's first sale — June took the first jar." : "Sold at the stall.");
      this.save();
      return { ok: true, msg: `💰 Sold for ${ECONOMY.compoteSell} coins.`, first };
    }
    // fresh baskets: plain stall sales, never June's beat
    const v = VARIETIES[kind] || (kind === "earliglow" ? { name: "Earliglow" } : null);
    if (!v) return { ok: false, msg: "Nothing like that to sell." };
    if ((s.inv[kind] || 0) < 1)
      return { ok: false, msg: `No ${v.name} baskets in hand.` };
    const price = ECONOMY.basketSell[kind];
    s.inv[kind]--;
    s.coins += price;
    s.sold++;
    this.journal("coins", `+${price} coins`, `Sold a fresh basket of ${v.name} at the stall.`);
    this.save();
    return { ok: true, msg: `💰 Sold for ${price} coins.`, first: false };
  },

  /* ---------- Nursery: planting + new beds ---------- */
  plant(variety) {
    const s = this.state;
    const v = VARIETIES[variety];
    if (!v) return { ok: false, msg: "The Nursery doesn't carry that one." };
    const cost = ECONOMY.plantCost[variety];
    if (s.coins < cost)
      return { ok: false, msg: `Need ${cost} coins for ${v.name} crowns (have ${s.coins}).` };
    s.coins -= cost;
    const bed = {
      id: s.nextBedId++,
      variety,
      phase: "growing",   // 3 days to first fruit
      ripe: 0,
      watered: false,
      regrowNights: 0,
      growNights: 0,
    };
    s.beds.push(bed);
    this.journal("plant", `Planted ${v.name}`, "A new bed in the field. First fruit in three mornings.");
    this.save();
    return { ok: true, msg: `🌱 ${v.name} planted — a new bed in the field.`, bed };
  },

  harvestBed(id) {
    const s = this.state;
    const bed = s.beds.find(b => b.id === id);
    if (!bed) return { ok: false, msg: "No such bed." };
    if (bed.phase !== "ready" || bed.ripe <= 0)
      return { ok: false, msg: "Nothing ripe on that bed right now." };
    bed.ripe--;
    s.harvested++;
    s.inv[bed.variety] = (s.inv[bed.variety] || 0) + 1;
    if (bed.ripe <= 0) {
      bed.phase = "regrowing";
      bed.watered = false;
      bed.regrowNights = 0;
      this.journal("harvest", `Harvested a ${VARIETIES[bed.variety].name} basket`,
        "That bed is picked clean — now it rests.");
    } else {
      this.journal("harvest", `Harvested a ${VARIETIES[bed.variety].name} basket`,
        `${bed.ripe} still ripe on that bed.`);
    }
    this.save();
    return { ok: true, msg: `🧺 +1 ${VARIETIES[bed.variety].name} basket.` };
  },

  // Same watering rules as the old patch: only while regrowing, once per cycle.
  waterBed(id) {
    const s = this.state;
    const bed = s.beds.find(b => b.id === id);
    if (!bed) return { ok: false, msg: "No such bed." };
    if (bed.phase !== "regrowing")
      return { ok: false, msg: "That bed doesn't need water right now." };
    if (bed.watered)
      return { ok: false, msg: "Already watered — that bed is drinking." };
    bed.watered = true;
    this.journal("tend", `Watered the ${VARIETIES[bed.variety].name} bed`, "A good drink. It should wake by tomorrow morning.");
    this.save();
    return { ok: true, msg: "💧 Watered. That bed will wake up sooner." };
  },
};

// Export for headless testing (node); harmless in the browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Slice, ECONOMY, SLICE_VERSION };
}
