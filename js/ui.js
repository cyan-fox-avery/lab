/* Berry Delightful — grey-box prototype: UI rendering + wiring. */
"use strict";

const UI = {
  scene: "field",
  sellSel: null,
  expPick: [],

  init() {
    if (!Game.load()) Game.reset();
    document.querySelectorAll("#scene-nav button").forEach(b =>
      b.addEventListener("click", () => this.go(b.dataset.scene)));
    document.getElementById("btn-journal").addEventListener("click", () => this.journalOverlay("days"));
    document.getElementById("btn-shop").addEventListener("click", () => this.shopOverlay());
    document.getElementById("btn-cookbook").addEventListener("click", () => this.cookbookOverlay());
    document.getElementById("btn-newgame").addEventListener("click", () => {
      if (confirm("Start over? The current farm will be lost.")) { Game.reset(); this.go("field"); }
    });
    // intro dialogue on brand-new game
    if (Game.state.day === 1 && Game.state.tutorialStep === 0 && !Game.state.flags.introShown) {
      Game.state.flags.introShown = true;
      Game.save();
      this.dialogue(DIALOGUE.intro);
    }
    this.refresh();
  },

  go(scene) {
    this.scene = scene;
    document.querySelectorAll("#scene-nav button").forEach(b =>
      b.classList.toggle("active", b.dataset.scene === scene));
    this.refresh();
  },

  refresh() {
    const s = Game.state;
    // HUD
    document.getElementById("hud-day").textContent = `☀️ Day ${s.day}`;
    document.getElementById("hud-weather").textContent =
      `${Game.weatherEmoji(s.weatherToday)}→${Game.weatherEmoji(s.weatherTomorrow)}`;
    document.getElementById("hud-weather").title =
      `Today: ${s.weatherToday}. Tomorrow: ${s.weatherTomorrow}. Rain waters every bed.`;
    document.getElementById("hud-coins").textContent = `🪙 ${s.coins}`;
    document.getElementById("hud-actions").textContent =
      DAY_ICONS.map((ic, i) => i < s.actionsLeft ? ic : "▫️").join("");
    document.getElementById("hud-actions").title =
      `${s.actionsLeft} of ${s.actionsMax} actions left today — a rhythm, not a timer.`;
    // tutorial banner
    const banner = document.getElementById("tutorial-banner");
    if (!s.tutorialDone) {
      const st = TUT.current();
      banner.classList.remove("hidden");
      document.getElementById("tutorial-text").innerHTML =
        `<strong>${st.title}</strong> — ${st.text}<br>👉 ${st.hint}<span class="draft-note">${DRAFT}</span>`;
    } else banner.classList.add("hidden");
    // scene
    const el = document.getElementById("scene");
    if (this.scene === "field") el.innerHTML = this.renderField();
    else if (this.scene === "farmhouse") el.innerHTML = this.renderFarmhouse();
    else if (this.scene === "kitchen") el.innerHTML = this.renderKitchen();
    else el.innerHTML = this.renderFarmyard();
    this.wireScene(el);
    // tutorial wayfinding: warm highlight on the current beat's target action.
    // Functional colour, not decoration — the grey box still isn't answering "is it pretty?"
    if (!s.tutorialDone) {
      const target = { 0: '[data-act="clear-patch"]', 1: '[data-act="water"]', 2: '[data-act="harvest"]',
                       3: '[data-act="bake"]', 4: '[data-act="sell-open"]', 5: '[data-act="feed-berry"]',
                       6: '[data-act="bundle"]', 7: '#btn-shop' }[s.tutorialStep];
      if (target) {
        const t = el.querySelector(target) || document.querySelector(target);
        if (t) t.classList.add("beat-target");
      }
    }
  },

  /* ---------------- scenes ---------------- */
  bedEmoji(b) {
    if (!b.cultivar) return "⬜";
    const stage = b.ready ? 3
      : !b.growth || b.growth <= 0 ? 0
      : (b.growth / b.matureAt) >= 0.66 ? 2 : 1;
    return SPRITES.plant(stage, !!b.watered);
  },
  bedStatus(b) {
    if (!b.cultivar) return "Empty bed";
    const c = CULTIVARS[b.cultivar];
    if (b.ready) return `${c.name} — ready! ${b.harvestsLeft} harvest${b.harvestsLeft > 1 ? "s" : ""} left`;
    return `${c.name} — growing (${b.growth || 0}/${b.matureAt} days)${b.watered ? ", watered" : ", thirsty"}`;
  },

  renderField() {
    const s = Game.state;
    let h = `<div class="scene-title">🌾 Strawberry fields <span class="sub">(grey box)</span></div>`;
    if (TUT.at(0) && !s.flags.patchCleared)
      h += `<div class="card"><h3>🌾 The old Earliglow patch</h3><div class="sub">A tangle. Underneath: good soil, waiting.</div><div class="row"><button class="btn primary" data-act="clear-patch">🌾 Clear patch</button></div></div>`;
    if (TUT.at(6) && !s.flags.freePlant)
      h += `<div class="card"><h3>📦 The reopening bundle</h3><div class="sub">Annapolis crowns + a raised planter box, on the house.</div><div class="row"><button class="btn primary" data-act="bundle">📦 Accept bundle</button></div></div>`;
    const tangled = TUT.at(0) && !s.flags.patchCleared;
    s.beds.forEach(b => {
      h += `<div class="card"><div class="row"><span class="bed-emoji">${tangled ? "🌾" : this.bedEmoji(b)}</span>
        <div class="info" style="flex:1"><h3>Bed ${b.id + 1}${b.patch ? " (old patch)" : ""}</h3>
        <div class="sub">${tangled ? "A tangle. Clear it first." : this.bedStatus(b)}</div></div></div>`;
      if (!tangled) {
        h += `<div class="row" style="margin-top:8px">`;
        if (b.cultivar && !b.watered)
          h += `<button class="btn small" data-act="water" data-bed="${b.id}">💧<span>Water</span></button>`;
        if (b.ready && b.harvestsLeft > 0)
          h += `<button class="btn small primary" data-act="harvest" data-bed="${b.id}">${SPRITES.basket()}<span>Harvest</span></button>`;
        if (!b.cultivar) h += `<span class="sub">Empty — plant via the 🛒 Shop.</span>`;
        h += `</div>`;
      }
      h += `</div>`;
    });
    return h;
  },

  renderFarmhouse() {
    return `<div class="scene-title">🏠 Farmhouse <span class="sub">(grey box)</span></div>
    <div class="card"><h3>🚪 Kitchen door</h3><div class="sub">Cooking and visible upgrades.</div>
      <div class="row"><button class="btn" data-act="nav" data-to="kitchen">🍳<span>Enter kitchen</span></button></div></div>
    <div class="card"><h3>📦 Farmgate box</h3><div class="sub">The honesty box at the lane. Sell harvests and bakes.</div>
      <div class="row"><button class="btn" data-act="sell-open">💰<span>Sell</span></button></div></div>
    <div class="card"><h3>🛏️ Bedroom door</h3><div class="sub">The bedroom is never shown. Interacting ends the day — the journal autosaves.</div>
      <div class="row"><button class="btn primary" data-act="endday">🛏️<span>End day</span></button></div></div>
    <div class="card locked"><h3>🛋️ Living room</h3><div class="sub">Memories and keepsakes live here — not in this prototype.</div></div>`;
  },

  renderKitchen() {
    const s = Game.state;
    let h = `<div class="scene-title">🍳 Kitchen <span class="sub">(grey box)</span></div>`;
    h += `<div class="card"><h3>Appliances</h3><div class="row">`;
    h += `<span class="btn small" style="cursor:default">🔪 Old saucepan ${s.kitchen.pot ? "" : "(compote only)"}</span>`;
    for (const [k, label] of [["mixer", "🎛️ Mixer"], ["mixer2", "🎛️ Mixer+"], ["blender", "🥤 Blender"], ["pot", "🍲 Big pot"]]) {
      h += `<span class="btn small" style="cursor:default;${s.kitchen[k] ? "" : "opacity:.4"}">${label} ${s.kitchen[k] ? "✓" : "—"}</span>`;
    }
    h += `</div><div class="sub" style="margin-top:6px">Each appliance is an independent layer in a reserved spot — buy in any order.</div></div>`;
    h += `<div class="card"><h3>🧪 Experimenting</h3><div class="sub">Two ingredients. Discovery feels earned; failure is funny — the pig judges.</div>
      <div class="row"><button class="btn" data-act="experiment-open">🧪<span>Experiment</span></button></div></div>`;
    h += `<div class="card"><h3>Recipes</h3>`;
    for (const [rid, r] of Object.entries(RECIPES)) {
      const known = s.recipesKnown.includes(rid);
      const locked = r.tier === 2 && !s.t2unlocked;
      if (!known || locked) continue;
      const canAppliance = Game.applianceFor(rid);
      const ingOk = Object.entries(r.ingredients || {}).every(([c, n]) => (s.inv.berries[c] || 0) >= n)
        && (!r.needsHoney || s.inv.honey >= r.needsHoney)
        && (!r.needsJam || s.inv.jam >= r.needsJam)
        && s.coins >= r.pantry;
      const why = !canAppliance ? `needs ${APPLIANCE_NAMES[r.appliance]}` : !ingOk ? "missing ingredients/coins" : "";
      h += `<div class="row" style="margin:6px 0"><span style="font-size:28px">${r.emoji}</span>
        <div class="info" style="flex:1"><strong>${r.name}</strong><div class="sub">${r.desc} Sells ${r.sell} · pantry ${r.pantry}</div></div>
        <button class="btn small ${canAppliance && ingOk ? "primary" : ""}" data-act="bake" data-recipe="${rid}" ${canAppliance && ingOk ? "" : "disabled"}>🍳<span>Bake${why ? " (" + why + ")" : ""}</span></button></div>`;
    }
    h += `<div class="sub">Unknown recipes: ${Object.keys(RECIPES).length - s.recipesKnown.length} — discover by experimenting.</div></div>`;
    return h;
  },

  renderFarmyard() {
    const s = Game.state;
    let h = `<div class="scene-title">🐖 Farmyard <span class="sub">(grey box)</span></div>`;
    h += `<div class="card"><div class="row"><span class="bed-emoji">${SPRITES.pig()}</span>
      <div class="info" style="flex:1"><h3>${s.pig.suggested ? "The pig (unnamed)" : s.pig.name}</h3>
      <div class="sub">${PIG_IDLE_LINES[s.day % PIG_IDLE_LINES.length]}</div>
      <div class="sub">Failed bakes eaten: ${s.pig.fedCount} — every one an excellent outcome.</div></div></div>`;
    if (s.pig.suggested) {
      h += `<div class="sub" style="margin:8px 0">Suggestion: <strong>Buddy</strong> — after your aunt's potbelly. The pig doesn't know its name yet; keep it or change it.</div>
      <div class="row"><input type="text" id="pig-name" value="Buddy" maxlength="24" aria-label="Pig name"></div>
      <div class="row"><button class="btn primary" data-act="name-pig">✏️<span>Name the pig</span></button></div>`;
    }
    h += `<div class="row" style="margin-top:8px"><button class="btn small" data-act="feed-berry">🍓<span>Share a berry</span></button></div></div>`;
    h += `<div class="card locked"><h3>🚧 The Obstruction</h3><div class="sub">Asleep precisely where you'll need to pass. Coming to a doorway near you.</div></div>`;
    return h;
  },

  wireScene(el) {
    el.querySelectorAll("[data-act]").forEach(b => b.addEventListener("click", () => this.handle(b)));
  },

  handle(b) {
    const act = b.dataset.act, s = Game.state;
    let r;
    if (act === "nav") return this.go(b.dataset.to);
    if (act === "clear-patch") { r = Game.clearPatch(); this.toast(r.msg); TUT.hook("clear-patch"); }
    else if (act === "bundle") { TUT.hook("bundle"); this.toast("📦 Bundle accepted."); }
    else if (act === "water") { r = Game.waterBed(+b.dataset.bed); this.toast(r.msg); TUT.hook("water"); }
    else if (act === "harvest") { r = Game.harvestBed(+b.dataset.bed); this.toast(r.msg); TUT.hook("harvest"); }
    else if (act === "endday") { Game.endDay(); this.toast(`🌙 Day ${s.day} begins. ${Game.weatherEmoji(s.weatherToday)} ${s.weatherToday}.`); }
    else if (act === "sell-open") return this.sellOverlay();
    else if (act === "experiment-open") return this.experimentOverlay();
    else if (act === "bake") {
      r = Game.bake(b.dataset.recipe);
      this.toast(r.msg);
      if (b.dataset.recipe === "compote") TUT.hook("bake-compote");
    }
    else if (act === "name-pig") {
      const name = document.getElementById("pig-name").value;
      r = Game.namePig(name);
      s.flags.pigNamed = true; Game.save();
      this.toast(r.msg);
      if (s.flags.pigFed) TUT.hook("pig-named-fed");
    }
    else if (act === "feed-berry") {
      r = Game.feedPigBerry();
      this.toast(r.msg);
      if (r.ok) { s.flags.pigFed = true; Game.save(); UI.dialogue(DIALOGUE.pig_fed_berry); }
      if (s.flags.pigNamed) TUT.hook("pig-named-fed");
    }
    this.refresh();
  },

  /* ---------------- overlays ---------------- */
  openOverlay(html) {
    const root = document.getElementById("overlay-root");
    root.innerHTML = `<div class="overlay-back"><div class="overlay">${html}
      <div class="row" style="margin-top:12px"><button class="btn" id="overlay-close">✖️<span>Close</span></button></div></div></div>`;
    document.getElementById("overlay-close").addEventListener("click", () => { root.innerHTML = ""; });
    root.querySelector(".overlay-back").addEventListener("click", e => {
      if (e.target.classList.contains("overlay-back")) root.innerHTML = "";
    });
  },

  dialogue(lines) {
    let i = 0;
    const show = () => {
      const l = lines[i];
      this.openOverlay(`<h2>💬</h2><div class="card"><strong>${l.who}</strong><p>${l.text}</p>
        <span class="draft-note">${DRAFT}</span></div>
        <div class="row"><button class="btn primary" id="dlg-next">${i < lines.length - 1 ? "➡️<span>Continue</span>" : "✔️<span>Done</span>"}</button></div>`);
      document.getElementById("dlg-next").addEventListener("click", () => {
        i++;
        if (i < lines.length) show();
        else document.getElementById("overlay-root").innerHTML = "";
      });
    };
    show();
  },

  toast(msg) {
    const root = document.getElementById("toast-root");
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    root.appendChild(t);
    setTimeout(() => t.remove(), 2600);
    this.refresh();
  },

  journalOverlay(tab) {
    const s = Game.state;
    const tabs = { days: "📓 Days", experiments: "🧪 Experiments", guide: "🌱 Field guide" };
    let h = `<h2>📓 Farm journal</h2><div class="tabs">`;
    for (const [k, label] of Object.entries(tabs))
      h += `<button class="btn small ${k === tab ? "primary" : ""}" data-jtab="${k}">${label}</button>`;
    h += `</div>`;
    if (tab === "days") {
      const entries = [...s.journal].reverse().slice(0, 60);
      h += entries.map(e => `<div class="journal-entry"><span class="journal-day">Day ${e.day}</span> — <strong>${e.title}</strong>${e.body ? `<br><span class="marginalia">${e.body}</span>` : ""}</div>`).join("") || "<p>Empty pages, waiting.</p>";
    } else if (tab === "experiments") {
      h += s.experiments.length ? [...s.experiments].reverse().map(e =>
        `<div class="journal-entry"><span class="journal-day">Day ${e.day}</span> — ${e.combo.join(" + ")}<br><span class="marginalia">${e.result}</span></div>`).join("")
        : "<p>No experiments yet. The journal never reveals untested combinations.</p>";
    } else {
      // field guide: cultivars the player has actually harvested get their tasting note
      const harvested = new Set();
      s.journal.forEach(e => {
        if (e.kind === "harvest") {
          const m = e.title.match(/^Harvested \d+ (.+)$/);
          if (m) harvested.add(m[1]);
        }
      });
      h += Object.entries(CULTIVARS).map(([c, d]) =>
        `<div class="journal-entry">${d.emoji} <strong>${d.name}</strong><br><span class="marginalia">${harvested.has(d.name) ? d.blurb + " — tasted. (tasting note recorded)" : "Not tasted yet."}</span></div>`).join("");
    }
    h += `<span class="draft-note">${DRAFT} — journal prose is placeholder.</span>`;
    this.openOverlay(h);
    this.wireTabs("data-jtab", (k) => this.journalOverlay(k));
  },

  wireTabs(attr, fn) {
    document.querySelectorAll(`[${attr}]`).forEach(b =>
      b.addEventListener("click", () => fn(b.getAttribute(attr))));
  },

  cookbookOverlay() {
    const s = Game.state;
    let h = `<h2>📖 Cookbook</h2><div class="sub">Every recipe gets a one-line origin. Provenance is flavour, never stats.</div>`;
    for (const [rid, r] of Object.entries(RECIPES)) {
      if (!s.recipesKnown.includes(rid)) {
        h += `<div class="card"><h3>${r.emoji} ???</h3><div class="sub">Undiscovered — the journal never spoils untested combinations.</div></div>`;
        continue;
      }
      h += `<div class="card"><h3>${r.emoji} ${r.name}</h3><div class="sub">${r.desc}</div>
        <div class="marginalia">Your version — first discovered at the farmhouse counter, day ${(s.recipeDays || {})[rid] || "?"}.</div></div>`;
    }
    h += `<span class="draft-note">${DRAFT}</span>`;
    this.openOverlay(h);
  },

  shopOverlay(pickBedFor) {
    const s = Game.state;
    let h = `<h2>🛒 Farm supplier</h2>`;
    if (!s.tutorialDone) h += `<div class="card locked"><div class="sub">The shop opens when the tutorial is complete.</div></div>`;
    if (s.flags.freePlant) {
      h += `<div class="card"><h3>🌱 Reopening bundle</h3><div class="sub">Free ${CULTIVARS[s.flags.freePlant].name} crowns — pick an empty bed.</div>
        <div class="row">${this.bedPicker("freeplant")}</div></div>`;
    }
    for (const item of SHOP) {
      if (item.tier === 2 && !s.t2unlocked) continue;
      const owned = item.appliance ? s.kitchen[item.appliance] : item.id === "beehive" ? s.farm.beehive : false;
      const afford = s.coins >= item.cost;
      const tutLock = !s.tutorialDone; // shop unlocks with the tutorial; the free bundle planting is separate
      h += `<div class="card"><div class="shop-item"><span style="font-size:30px">${item.emoji}</span>
        <div class="info"><strong>${item.name}</strong> ${item.tier === 2 ? "<em>(T2)</em>" : ""}
        <div class="sub">${item.desc}</div></div>
        <span class="cost">🪙${item.cost}</span></div>
        <div class="row" style="margin-top:8px">`;
      if (owned) h += `<span class="sub">Owned ✓</span>`;
      else if (item.plant) h += `<button class="btn small ${afford && !tutLock ? "primary" : ""}" data-shopbuy="${item.id}" ${afford && !tutLock ? "" : "disabled"}>🌱<span>Buy & plant${tutLock ? " (after tutorial)" : ""}</span></button>`;
      else h += `<button class="btn small ${afford && !tutLock ? "primary" : ""}" data-shopbuy="${item.id}" ${afford && !tutLock ? "" : "disabled"}>🛒<span>Buy${tutLock ? " (after tutorial)" : ""}</span></button>`;
      h += `</div>${pickBedFor === item.id ? `<div class="row" style="margin-top:8px"><span class="sub">Pick a bed:</span>${this.bedPicker(item.id)}</div>` : ""}</div>`;
    }
    if (!s.t2unlocked) h += `<div class="card locked"><div class="sub">🔒 Tier 2 unlocks at ${T2_UNLOCK_EARNINGS} lifetime earnings (now: ${s.lifetimeEarned}).</div></div>`;
    this.openOverlay(h);
    document.querySelectorAll("[data-shopbuy]").forEach(b => b.addEventListener("click", () => {
      const item = SHOP.find(i => i.id === b.dataset.shopbuy);
      if (item.plant) return this.shopOverlay(item.id); // need bed choice
      const r = Game.buy(item.id);
      this.toast(r.msg);
      this.shopOverlay();
    }));
    document.querySelectorAll("[data-plantbed]").forEach(b => b.addEventListener("click", () => {
      const [itemId, bedId] = b.dataset.plantbed.split(":");
      let r;
      if (itemId === "freeplant") { r = Game.plantFree(s.flags.freePlant, +bedId); TUT.hook("plant-annapolis"); }
      else r = Game.buy(itemId, +bedId);
      this.toast(r.msg);
      document.getElementById("overlay-root").innerHTML = "";
      this.refresh();
    }));
  },

  bedPicker(itemId) {
    const s = Game.state;
    const empty = s.beds.filter(b => !b.cultivar);
    if (!empty.length) return `<span class="sub">No empty beds — buy a planter box.</span>`;
    return empty.map(b => `<button class="btn small" data-plantbed="${itemId}:${b.id}">Bed ${b.id + 1}</button>`).join("");
  },

  sellOverlay() {
    const s = Game.state;
    let h = `<h2>📦 Farmgate box</h2><div class="sub">Honesty box at the lane. Selling costs 1 action — everything selected goes at once.</div>`;
    const lines = [];
    for (const [c, n] of Object.entries(s.inv.berries)) if (n > 0)
      lines.push({ key: "b:" + c, label: `${CULTIVARS[c].emoji} ${CULTIVARS[c].name} ×${n}`, price: CULTIVARS[c].basketPrice });
    for (const [rid, n] of Object.entries(s.inv.bakes)) if (n > 0)
      lines.push({ key: "k:" + rid, label: `${RECIPES[rid].emoji} ${RECIPES[rid].name} ×${n}`, price: RECIPES[rid].sell });
    if (s.inv.honey > 0) lines.push({ key: "h", label: `🍯 Honey ×${s.inv.honey}`, price: 12 });
    if (s.inv.jam > 0) lines.push({ key: "j", label: `🫙 Jam ×${s.inv.jam}`, price: 30 });
    if (!lines.length) h += `<div class="card"><div class="sub">Nothing to sell. The box waits.</div></div>`;
    lines.forEach((l, i) => {
      h += `<div class="row" style="margin:6px 0"><input type="checkbox" id="sell-${i}" data-sellkey="${l.key}" checked style="width:28px;height:28px">
        <label for="sell-${i}" style="flex:1">${l.label} <span class="sub">(${l.price} each)</span></label></div>`;
    });
    if (lines.length) h += `<div class="row" style="margin-top:10px"><button class="btn primary" id="do-sell">💰<span>Sell selected (1 action)</span></button></div>`;
    h += `<span class="draft-note">${DRAFT}</span>`;
    this.openOverlay(h);
    const btn = document.getElementById("do-sell");
    if (btn) btn.addEventListener("click", () => {
      const sel = { berries: {}, bakes: {}, honey: 0, jam: 0 };
      document.querySelectorAll("[data-sellkey]:checked").forEach(cb => {
        const k = cb.dataset.sellkey;
        if (k.startsWith("b:")) sel.berries[k.slice(2)] = 999;
        else if (k.startsWith("k:")) sel.bakes[k.slice(2)] = 999;
        else if (k === "h") sel.honey = 999;
        else if (k === "j") sel.jam = 999;
      });
      const r = Game.sellSelection(sel);
      this.toast(r.msg);
      document.getElementById("overlay-root").innerHTML = "";
      TUT.hook("sell");
      this.refresh();
    });
  },

  experimentOverlay() {
    this.expPick = [];
    const render = () => {
      let h = `<h2>🧪 Experiment</h2><div class="sub">Pick one or two ingredients. The journal records the combination and the result — never untested ones.</div>
      <div class="experiment-pick">`;
      for (const ing of EXPERIMENT_INGREDIENTS) {
        const have = ing.id === "honey" ? Game.state.inv.honey : ing.id === "jam" ? Game.state.inv.jam : (Game.state.inv.berries[ing.id] || 0);
        const picked = this.expPick.filter(x => x === ing.id).length;
        h += `<button class="btn small ${picked ? "chosen" : ""}" data-ing="${ing.id}">${ing.emoji}<span>${ing.name}${picked ? ` ×${picked}` : ""}${have > 0 ? ` (${have} in pantry)` : ""}</span></button>`;
      }
      h += `</div><div class="row" style="margin-top:10px"><button class="btn primary" id="do-exp" ${this.expPick.length >= 1 ? "" : "disabled"}>🧪<span>Experiment (1 action)</span></button></div>
      <span class="draft-note">${DRAFT} — experimenting costs 1 action and consumes no ingredients in this prototype (generous tuning); the pig gets the failed bake either way.</span>`;
      this.openOverlay(h);
      document.querySelectorAll("[data-ing]").forEach(b => b.addEventListener("click", () => {
        const id = b.dataset.ing;
        const idx = this.expPick.indexOf(id);
        if (idx >= 0) this.expPick.splice(idx, 1); // remove one instance
        else if (this.expPick.length < 2) this.expPick.push(id); // up to two, duplicates allowed
        render();
      }));
      const btn = document.getElementById("do-exp");
      if (btn) btn.addEventListener("click", () => {
        const r = Game.experiment(this.expPick[0], this.expPick[1]);
        document.getElementById("overlay-root").innerHTML = "";
        this.toast(r.msg);
        this.refresh();
      });
    };
    render();
  },
};

document.addEventListener("DOMContentLoaded", () => UI.init());
