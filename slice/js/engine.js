/* Berry Delightful — First Strawberry Day slice: game engine.
   DOM-independent on purpose, so the logic can be tested headless.
   Storage: localStorage key 'berry-slice-v1' (separate from the grey-box saves).
   Scope: arrival -> harvest Earliglows -> cook compote -> sell at stall.
   No action cap, no day loop, no weather. See FIRST_STRAWBERRY_DAY_BUILD_BRIEF.md. */
"use strict";

const SLICE_VERSION = "v0.1.1-first-strawberry-day";
const SAVE_KEY = "berry-slice-v1";

const ECONOMY = {
  compotePantryCost: 2,  // coins of pantry staples; sugar is already in the inherited pantry
  compoteSell: 20,
  startCoins: 20,
  ripeAtStart: 3,        // a few berries already ripe on the old patch
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
      v: 1,
      coins: ECONOMY.startCoins,
      ripe: ECONOMY.ripeAtStart,
      harvested: 0,
      cooked: 0,
      sold: 0,
      inv: { earliglow: 0, compote: 0 },
      firstSaleDone: false,
      introShown: false,
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

  // Gentle, progress-based hint. Never blocks, never seizes control.
  hint() {
    const s = this.state;
    if (s.firstSaleDone) return "Starvale's first sale. The farm's awake — look around, or start over and run it again.";
    if (s.inv.compote > 0) return "The stall by the lane is ready. June's usually first in line.";
    if (s.harvested > 0) return "Those berries won't cook themselves — the old saucepan is waiting in the kitchen.";
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
    this.journal("harvest", "Harvested an Earliglow basket",
      s.ripe > 0 ? `${s.ripe} still ripe on the patch.` : "The old patch is picked clean. It started everything.");
    this.save();
    return { ok: true, msg: "🧺 +1 Earliglow basket." };
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
  sell() {
    const s = this.state;
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
  },
};

// Export for headless testing (node); harmless in the browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Slice, ECONOMY, SLICE_VERSION };
}
