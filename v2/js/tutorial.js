/* Berry Delightful — grey-box prototype: tutorial script (8 beats).
   Beats advance via explicit hooks called from engine/ui actions.
   All dialogue placeholder — flagged DRAFT for review before any official release. */
"use strict";

/* One-line intros shown when a tab unlocks during the tutorial. */
const TAB_INTROS = {
  farmhouse: "🏠 Farmhouse unlocked — the farmgate box and the bedroom door (to end the day) live here.",
  kitchen: "🍳 Kitchen unlocked — bake and experiment here.",
  cookbook: "📖 Cookbook unlocked — your discovered recipes and their stories.",
  farmyard: "🐖 Farmyard unlocked — the pig is here. It came with the farm.",
  shop: "🛒 Shop unlocked — crowns, planter boxes, and equipment.",
};

const TUT = {
  at(n) { const s = Game.state; return !s.tutorialDone && s.tutorialStep === n; },
  done() { return Game.state.tutorialDone; },

  steps: [
    {
      title: "1 · Homecoming",
      text: "The old Earliglow patch is a tangle. Clear it — the restoration fantasy, stated: scruffy → neat → alive.",
      hint: "Tap 🌾 Field, then Clear patch.",
    },
    {
      title: "2 · Water & sky",
      text: "One tap per bed. Water the patch — beds only grow overnight if they were watered by hand.",
      hint: "Tap 💧 Water on the patch bed.",
    },
    {
      title: "3 · First harvest",
      text: "Overnight the patch responds: scruffy past-prime Earliglows. Small and funny-looking — \"Fun Size.\" Harvest them.",
      hint: "🛏️ End the day (Farmhouse), then 🧺 Harvest.",
    },
    {
      title: "4 · The farmhouse pot",
      text: "The old saucepan came with the farm. Scruffy berries + sugar → compote. Cooking transforms.",
      hint: "🍳 Kitchen → bake Strawberry Compote.",
    },
    {
      title: "5 · The farmgate box",
      text: "The honesty box at the lane. Sell the compote and spare baskets — someone's already waiting.",
      hint: "🏠 Farmhouse → Farmgate box → Sell.",
    },
    {
      title: "6 · The pig",
      text: "Something enormous is asleep in the barn. It came with the farm. Name it — it answers to anything — and share a berry.",
      hint: "🐖 Farmyard → name the pig, then feed it a berry.",
    },
    {
      title: "7 · The reopening bundle",
      text: "The local supplier heard Starvale is reopening: Annapolis crowns and raised planter boxes, on the house.",
      hint: "Tap the 📦 bundle (Field) to accept it.",
    },
    {
      title: "8 · Plant T1",
      text: "Annapolis into the new boxes — the free crowns from the bundle. Tutorial complete — the shop opens, and the season is yours.",
      hint: "🛒 Shop → plant the free Annapolis crowns into the empty bed.",
    },
  ],

  current() { return this.steps[Game.state.tutorialStep]; },

  // v2: progressive tab introduction — tabs unlock as the tutorial makes them relevant.
  // Derived from tutorialStep (no separate state), so saves stay consistent.
  // Unlock timing: a tab appears the moment its step becomes current.
  //   step 0: field · step 2: farmhouse (bedroom) · step 3: kitchen + cookbook
  //   step 5: farmyard · step 6: shop · tutorial done: everything
  unlockedTabs() {
    const s = Game.state;
    const all = ["field", "farmhouse", "kitchen", "farmyard", "shop", "cookbook", "new"];
    if (s.tutorialDone) return new Set(all);
    const tabs = new Set(["field", "new"]); // reset stays visible throughout
    const step = s.tutorialStep;
    if (step >= 2) tabs.add("farmhouse");
    if (step >= 3) { tabs.add("kitchen"); tabs.add("cookbook"); }
    if (step >= 5) tabs.add("farmyard");
    if (step >= 6) tabs.add("shop");
    return tabs;
  },

  next() {
    const s = Game.state;
    const before = this.unlockedTabs();
    s.tutorialStep++;
    if (s.tutorialStep >= this.steps.length) {
      s.tutorialDone = true;
      Game.journal("day", "Tutorial complete", "The loop walked once: tend → harvest → bake → sell. The shop is open. The season is yours.");
    }
    Game.save();
    const after = this.unlockedTabs();
    for (const tab of after) {
      if (!before.has(tab) && TAB_INTROS[tab]) UI.toast(TAB_INTROS[tab]);
    }
    UI.refresh();
  },

  // called from UI after specific actions
  hook(action) {
    const s = Game.state;
    if (s.tutorialDone) return;
    const st = s.tutorialStep;
    if (action === "clear-patch" && st === 0) this.next();
    else if (action === "water" && st === 1) this.next();
    else if (action === "harvest" && st === 2) this.next();
    else if (action === "bake-compote" && st === 3) this.next();
    else if (action === "sell" && st === 4) {
      // June buys the first jar: scripted story beat
      if (!s.junePaid) {
        s.junePaid = true;
        Game.earn(25, "June buys the first jar — at her price, not yours. 'This farm used to feed half the concession road.'");
        UI.dialogue(DIALOGUE.june);
      }
      this.next();
    }
    else if (action === "pig-named-fed" && st === 5) this.next();
    else if (action === "bundle" && st === 6) {
      // the reopening bundle: free planter box (empty bed) + Annapolis crowns to plant
      if (!s.flags.freePlant) {
        s.beds.push({ id: s.nextBedId++, cultivar: null, watered: false, ready: false, spent: false });
        s.flags.freePlant = "annapolis";
        UI.dialogue(DIALOGUE.supplier);
        Game.journal("day", "The reopening bundle", "Annapolis crowns and a raised planter box, on the house. The crowns are yours to plant.");
        Game.save();
      }
      this.next();
    }
    else if (action === "plant-annapolis" && st === 7) this.next();
  },
};
