/* Berry Delightful — grey-box prototype: game engine.
   DOM-independent on purpose, so the logic can be tested headless.
   Storage: localStorage key 'berry-greybox-v1'. */
"use strict";

const SAVE_KEY = "berry-greybox-v1";

const Game = {
  state: null,

  newState() {
    return {
      v: 1,
      day: 1,
      coins: 20,
      lifetimeEarned: 0,
      actionsMax: ACTIONS_PER_DAY,
      actionsLeft: ACTIONS_PER_DAY,
      weatherToday: "sun",
      weatherTomorrow: this.rollWeather(),
      beds: [
        // the old Earliglow patch: tutorial bed, 2 baskets/day for 6 days, then done
        // (starts unwatered so tutorial beat 2 — watering — has something to do)
        { id: 0, patch: true, cultivar: "earliglow", harvestsLeft: 6, perHarvest: 2, watered: false, ready: true, spent: false },
      ],
      nextBedId: 1,
      inv: {
        berries: { earliglow: 0, annapolis: 0, honeoye: 0, cavendish: 0 },
        honey: 0, jam: 0, bakes: {},
      },
      kitchen: { mixer: false, mixer2: false, blender: false, pot: false },
      farm: { beehive: false, daysSinceHoney: 0 },
      recipesKnown: ["compote"],
      recipeDays: { compote: 1 },
      journal: [],
      experiments: [],
      pig: { name: "Buddy", suggested: true, fedCount: 0 },
      tutorialStep: 0,
      tutorialDone: false,
      t2unlocked: false,
      junePaid: false,
      flags: {},
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
    this.journal("day", "Day 1 — arrived at Starvale.", "The old Earliglow patch is a tangle. Somewhere, a pig is asleep.");
    this.save();
  },

  /* ---------- helpers ---------- */
  rollWeather() {
    const r = Math.random();
    if (r < 0.60) return "sun";
    if (r < 0.85) return "rain";
    return "heat";
  },
  weatherEmoji(w) { return w === "rain" ? "🌧️" : w === "heat" ? "🥵" : "☀️"; },

  spendAction() {
    if (this.state.actionsLeft <= 0) return false;
    this.state.actionsLeft--;
    return true;
  },

  journal(kind, title, body) {
    this.state.journal.push({ day: this.state.day, kind, title, body });
    this.save();
  },

  earn(n, why) {
    this.state.coins += n;
    this.state.lifetimeEarned += n;
    if (why) this.journal("coins", `+${n} coins`, why);
    this.checkT2();
    this.save();
  },
  spend(n) {
    if (this.state.coins < n) return false;
    this.state.coins -= n;
    this.save();
    return true;
  },

  checkT2() {
    const s = this.state;
    if (!s.t2unlocked && s.lifetimeEarned >= T2_UNLOCK_EARNINGS) {
      s.t2unlocked = true;
      this.journal("unlock", "Tier 2 unlocked", "The supplier's catalogue grows: high-end mixer, beehive, Cavendish crowns.");
    }
  },

  getBed(id) { return this.state.beds.find(b => b.id === id); },

  /* ---------- field actions (1 action each) ---------- */
  waterBed(id) {
    const s = this.state, b = this.getBed(id);
    if (!b || b.spent || b.watered) return { ok: false, msg: "Nothing to water." };
    if (!this.spendAction()) return { ok: false, msg: "The light's getting low — time to wind down?" };
    b.watered = true;
    this.save();
    return { ok: true, msg: `💧 Watered the ${CULTIVARS[b.cultivar].name} bed.` };
  },

  harvestBed(id) {
    const s = this.state, b = this.getBed(id);
    if (!b || b.spent || !b.ready || b.harvestsLeft <= 0)
      return { ok: false, msg: "Nothing ripe right now." };
    if (!this.spendAction()) return { ok: false, msg: "The light's getting low — time to wind down?" };
    let n = b.perHarvest;
    if (s.weatherToday === "heat" && CULTIVARS[b.cultivar].heatSensitive) n = Math.max(1, n - 1);
    const cname = CULTIVARS[b.cultivar].name;
    s.inv.berries[b.cultivar] += n;
    b.harvestsLeft--;
    if (b.harvestsLeft <= 0) {
      b.spent = true; b.ready = false;
      this.journal("field", `${cname} bed spent`, b.patch ? "The old patch gave all it had. It started everything." : "That bed is done — clear for replanting (free).");
      b.cultivar = null; b.patch = false; b.spent = false; // bed becomes empty
    }
    this.journal("harvest", `Harvested ${n} ${cname}`, "");
    this.save();
    return { ok: true, msg: `🧺 +${n} ${cname} basket${n > 1 ? "s" : ""}.` };
  },

  clearPatch() {
    // tutorial beat 1: clear the old Earliglow patch (free action, teaches tending)
    const s = this.state, b = this.getBed(0);
    if (!b || s.flags.patchCleared) return { ok: false };
    s.flags.patchCleared = true;
    this.journal("day", "Cleared the old patch", "The restoration fantasy, stated: scruffy → neat → alive.");
    this.save();
    return { ok: true, msg: "🌾 Cleared the old Earliglow patch. Underneath: good soil, waiting." };
  },

  /* ---------- shop ---------- */
  buy(itemId, bedId) {
    const s = this.state;
    const item = SHOP.find(i => i.id === itemId);
    if (!item) return { ok: false, msg: "Unknown item." };
    if (item.tier === 2 && !s.t2unlocked) return { ok: false, msg: "Tier 2 isn't unlocked yet." };
    if (item.reqAppliance && !s.kitchen[item.reqAppliance])
      return { ok: false, msg: `Needs the ${APPLIANCE_NAMES[item.reqAppliance]} first.` };
    if (!this.spend(item.cost)) return { ok: false, msg: "Not enough coins." };

    if (item.plant) {
      const bed = bedId != null ? this.getBed(bedId) : s.beds.find(b => !b.cultivar);
      if (!bed || bed.cultivar) { s.coins += item.cost; this.save(); return { ok: false, msg: "No empty bed — buy a planter box first." }; }
      bed.cultivar = item.plant;
      bed.patch = false;
      bed.growth = 0; bed.matureAt = 3;
      bed.harvestsLeft = 8; bed.perHarvest = 2;
      bed.watered = false; bed.ready = false; bed.spent = false;
      this.journal("shop", `Planted ${CULTIVARS[item.plant].name}`, `Into bed ${bed.id + 1}. About 3 days to first fruit.`);
    } else if (item.id === "boxes") {
      s.beds.push({ id: s.nextBedId++, cultivar: null, watered: false, ready: false, spent: false });
      this.journal("shop", "Raised planter box", "The farm literally grows: a new empty bed.");
    } else if (item.appliance) {
      s.kitchen[item.appliance] = true;
      this.journal("shop", APPLIANCE_NAMES[item.appliance], item.id === "mixer" ? "A big pink statement piece. (In the real game.)" : "The kitchen fills in, one reserved spot at a time.");
    } else if (item.id === "beehive") {
      s.farm.beehive = true;
      this.journal("shop", "Beehive + pollinator garden", "Flowers and bees. Tier 1's volume becomes tier 2's quality.");
    }
    this.save();
    return { ok: true, msg: `🛒 Bought: ${item.name}.` };
  },

  /* ---------- kitchen ---------- */
  applianceFor(recipeId) {
    const r = RECIPES[recipeId];
    if (!r.appliance) return true;
    return !!this.state.kitchen[r.appliance];
  },

  bake(recipeId) {
    const s = this.state, r = RECIPES[recipeId];
    if (!r) return { ok: false, msg: "Unknown recipe." };
    if (!s.recipesKnown.includes(recipeId)) return { ok: false, msg: "You haven't learned that recipe yet — try experimenting." };
    if (r.tier === 2 && !s.t2unlocked) return { ok: false, msg: "Tier 2 isn't unlocked yet." };
    if (!this.applianceFor(recipeId))
      return { ok: false, msg: `Needs the ${APPLIANCE_NAMES[r.appliance]}.` };
    // ingredients
    for (const [c, n] of Object.entries(r.ingredients || {})) {
      if ((s.inv.berries[c] || 0) < n) return { ok: false, msg: `Need ${n} ${CULTIVARS[c].name} (have ${s.inv.berries[c] || 0}).` };
    }
    if (r.needsHoney && s.inv.honey < r.needsHoney) return { ok: false, msg: "Need honey from the hive." };
    if (r.needsJam && s.inv.jam < r.needsJam) return { ok: false, msg: "Need a jar of jam." };
    if (s.coins < r.pantry) return { ok: false, msg: `Need ${r.pantry} coins for pantry staples.` };
    if (!this.spendAction()) return { ok: false, msg: "The light's getting low — time to wind down?" };

    for (const [c, n] of Object.entries(r.ingredients || {})) s.inv.berries[c] -= n;
    if (r.needsHoney) s.inv.honey -= r.needsHoney;
    if (r.needsJam) s.inv.jam -= r.needsJam;
    s.coins -= r.pantry;
    s.inv.bakes[recipeId] = (s.inv.bakes[recipeId] || 0) + 1;
    if (recipeId === "jam") s.inv.jam += 1;
    this.journal("bake", `Baked: ${r.name}`, r.id === "compote" ? "Cooking transforms." : "");
    this.save();
    return { ok: true, msg: `${r.emoji} Baked ${r.name}! (sells for ${r.sell})` };
  },

  experiment(ingA, ingB) {
    const s = this.state;
    const picks = [ingA, ingB].filter(Boolean);
    if (picks.length < 1 || picks.length > 2) return { ok: false, msg: "Pick one or two ingredients." };
    if (!this.spendAction()) return { ok: false, msg: "The light's getting low — time to wind down?" };
    const pair = [...picks].sort().join("+");

    // match against recipe signatures (non-pantry ingredients only)
    let matched = null;
    for (const [rid, r] of Object.entries(RECIPES)) {
      const sig = [];
      for (const [c, n] of Object.entries(r.ingredients || {})) for (let i = 0; i < n; i++) sig.push(c);
      if (r.needsHoney) sig.push("honey");
      if (r.needsJam) sig.push("jam");
      if (sig.length === picks.length && sig.sort().join("+") === pair) { matched = rid; break; }
    }

    const entry = { day: s.day, combo: picks, result: null };
    if (matched) {
      const r = RECIPES[matched];
      if (s.recipesKnown.includes(matched)) {
        entry.result = `Already know ${r.name} — baked it instead.`;
        s.experiments.push(entry);
        this.save();
        return this.bake(matched);
      }
      if (r.tier === 2 && !s.t2unlocked) {
        entry.result = `Something's there… but it's beyond what the kitchen can do yet. (directional hint, not an answer)`;
        s.experiments.push(entry);
        this.journal("experiment", `Experiment: ${picks.join(" + ")}`, entry.result);
        this.save();
        return { ok: true, msg: `🧪 ${entry.result}` };
      }
      if (!this.applianceFor(matched)) {
        entry.result = `Promising… it needs the ${APPLIANCE_NAMES[r.appliance]}.`;
        s.experiments.push(entry);
        this.journal("experiment", `Experiment: ${picks.join(" + ")}`, entry.result);
        this.save();
        return { ok: true, msg: `🧪 ${entry.result}` };
      }
      s.recipesKnown.push(matched);
      s.recipeDays = s.recipeDays || {};
      s.recipeDays[matched] = s.day;
      entry.result = `DISCOVERED: ${r.name}! "Your version — first discovered at the farmhouse counter, day ${s.day}."`;
      s.experiments.push(entry);
      this.journal("experiment", `Experiment: ${picks.join(" + ")}`, entry.result);
      this.save();
      return { ok: true, msg: `🧪✨ ${entry.result}` };
    }

    // failed bake → the pig
    const verdict = PIG_VERDICTS[Math.floor(Math.random() * PIG_VERDICTS.length)];
    s.pig.fedCount++;
    entry.result = `Failed bake → pig. Verdict: "${verdict}"`;
    s.experiments.push(entry);
    this.journal("experiment", `Experiment: ${picks.join(" + ")}`, entry.result);
    this.save();
    return { ok: true, msg: `🧪💥 Failed bake! It goes to the pig. 🐖 ${verdict}` };
  },

  /* ---------- selling ---------- */
  sellSelection(sel) {
    // sel: { berries: {c: n}, bakes: {rid: n}, honey: n, jam: n }
    const s = this.state;
    if (!this.spendAction()) return { ok: false, msg: "The light's getting low — time to wind down?" };
    let total = 0;
    const parts = [];
    for (const [c, n] of Object.entries(sel.berries || {})) {
      const have = s.inv.berries[c] || 0, k = Math.min(have, n);
      if (k > 0) { s.inv.berries[c] -= k; total += k * CULTIVARS[c].basketPrice; parts.push(`${k} ${CULTIVARS[c].name}`); }
    }
    for (const [rid, n] of Object.entries(sel.bakes || {})) {
      const have = s.inv.bakes[rid] || 0, k = Math.min(have, n);
      if (k > 0) { s.inv.bakes[rid] -= k; total += k * RECIPES[rid].sell; parts.push(`${k} ${RECIPES[rid].name}`); }
    }
    if (sel.honey > 0) { const k = Math.min(s.inv.honey, sel.honey); s.inv.honey -= k; total += k * 12; if (k) parts.push(`${k} honey`); }
    if (sel.jam > 0) { const k = Math.min(s.inv.jam, sel.jam); s.inv.jam -= k; total += k * 30; if (k) parts.push(`${k} jam`); }
    if (total <= 0) { s.actionsLeft++; this.save(); return { ok: false, msg: "Nothing to sell." }; }
    this.earn(total, `Sold at the farmgate box: ${parts.join(", ")}.`);
    return { ok: true, msg: `💰 Sold for ${total} coins: ${parts.join(", ")}.` };
  },

  /* ---------- pig ---------- */
  plantFree(cultivar, bedId) {
    // tutorial bundle planting: no cost, no action
    const s = this.state, b = this.getBed(bedId);
    if (!b || b.cultivar) return { ok: false, msg: "That bed isn't empty." };
    b.cultivar = cultivar; b.patch = false;
    b.growth = 0; b.matureAt = 3;
    b.harvestsLeft = 8; b.perHarvest = 2;
    b.watered = false; b.ready = false; b.spent = false;
    s.flags.freePlant = null;
    this.journal("field", `Planted ${CULTIVARS[cultivar].name}`, "Tutorial complete — the shop opens, and the season is yours.");
    this.save();
    return { ok: true, msg: `🌱 Planted ${CULTIVARS[cultivar].name} into bed ${b.id + 1}.` };
  },

  namePig(name) {
    const s = this.state;
    name = (name || "").trim().slice(0, 24) || "Buddy";
    const wasSuggested = s.pig.suggested;
    s.pig.name = name;
    s.pig.suggested = false;
    this.journal("pig", `The pig is named ${name}`, wasSuggested && name === "Buddy"
      ? "Kept the suggestion — after your aunt's potbelly. It answers to anything."
      : "It answers to anything. The rename moment stays the player's.");
    this.save();
    return { ok: true, msg: `🐖 The pig is named ${name}.` };
  },

  feedPigBerry() {
    const s = this.state;
    if ((s.inv.berries.earliglow || 0) < 1) return { ok: false, msg: "No berries to share." };
    s.inv.berries.earliglow -= 1;
    s.pig.fedCount++;
    this.journal("pig", `${s.pig.name} investigates`, "Got underfoot, then flopped dramatically in the fresh straw. The optimist with no standards.");
    this.save();
    return { ok: true, msg: `🐖 ${s.pig.name} investigates the berry, gets underfoot, and flops dramatically. ★` };
  },

  /* ---------- day loop ---------- */
  endDay() {
    const s = this.state;
    // overnight growth
    for (const b of s.beds) {
      if (b.cultivar && !b.ready && !b.spent) {
        if (b.watered || s.weatherToday === "rain") {
          b.growth++;
          if (b.growth >= b.matureAt) { b.ready = true; }
        }
      }
      b.watered = false;
    }
    // beehive honey: a jar fills every few days — a gift, not a job
    if (s.farm.beehive) {
      s.farm.daysSinceHoney++;
      if (s.farm.daysSinceHoney >= HONEY_EVERY_DAYS) {
        s.farm.daysSinceHoney = 0;
        s.inv.honey++;
        this.journal("gift", "The hive gave", "A jar of honey, filled while you weren't looking. A gift, not a job.");
      }
    }
    s.day++;
    s.actionsLeft = s.actionsMax;
    s.weatherToday = s.weatherTomorrow;
    s.weatherTomorrow = this.rollWeather();
    if (s.weatherToday === "rain") for (const b of s.beds) b.watered = true;
    this.journal("day", `Day ${s.day}`, `${this.weatherEmoji(s.weatherToday)} Today: ${s.weatherToday}. Tomorrow: ${s.weatherTomorrow}.`);
    this.save();
    return { ok: true };
  },
};
