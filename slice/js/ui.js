/* Berry Delightful — First Strawberry Day slice: UI rendering + wiring.
   Four scenes (home, field, kitchen, stall) + journal overlay.
   Hints are gentle and never seize control. All dialogue is DRAFT placeholder. */
"use strict";

const SUI = {
  scene: "home",

  init() {
    if (!Slice.load()) Slice.reset();
    document.querySelectorAll("#scene-nav button").forEach(b =>
      b.addEventListener("click", () => this.go(b.dataset.scene)));
    document.getElementById("btn-journal").addEventListener("click", () => this.journalOverlay());
    document.getElementById("btn-newgame").addEventListener("click", () => {
      if (confirm("Start over? The current run will be lost.")) { Slice.reset(); this.go("home"); }
    });
    if (!Slice.state.introShown) {
      Slice.state.introShown = true;
      Slice.save();
      this.dialogue(INTRO_LINES);
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
    const s = Slice.state;
    document.querySelectorAll("#scene-nav button").forEach(b =>
      b.classList.toggle("active", b.dataset.scene === this.scene));
    document.getElementById("hud-coins").textContent = `🪙 ${s.coins}`;
    document.getElementById("hud-inv").textContent =
      `🧺 ${s.inv.earliglow} · 🫙 ${s.inv.compote}`;
    document.getElementById("hint-text").textContent = Slice.hint();
    const el = document.getElementById("scene");
    if (this.scene === "home") el.innerHTML = this.renderHome();
    else if (this.scene === "field") el.innerHTML = this.renderField();
    else if (this.scene === "kitchen") el.innerHTML = this.renderKitchen();
    else el.innerHTML = this.renderStall();
    this.wireScene(el);
  },

  /* ---------------- scenes ---------------- */
  renderHome() {
    const s = Slice.state;
    let h = `<div class="scene-title">🏠 Starvale Farm <span class="sub">(first strawberry day)</span></div>`;
    h += `<div class="card"><div class="row"><span class="bed-emoji">🍓</span>
      <div class="info" style="flex:1"><h3>The giant strawberry</h3>
      <div class="sub">At the end of the driveway — just wood and paint, big enough to sit in. The sign that you're here. <em>(placeholder)</em></div></div></div></div>`;
    h += `<div class="card"><h3>📓 Arrival</h3>
      <div class="sub">You bought Starvale back — the farm you visited as a child. The old Earliglow patch is a tangle and the farmhouse is dusty… but it's yours.</div>
      <span class="draft-note">${DRAFT}</span></div>`;
    if (s.firstSaleDone)
      h += `<div class="card"><h3>🎉 Starvale's first sale</h3>
        <div class="sub">One jar of compote, sold at the stall. The farm's awake. Look around — or start over and run the day again.</div></div>`;
    h += `<div class="card"><h3>🧭 Where to</h3><div class="row">
      <button class="btn" data-act="nav" data-to="field">🌾<span>Field</span></button>
      <button class="btn" data-act="nav" data-to="kitchen">🍳<span>Kitchen</span></button>
      <button class="btn" data-act="nav" data-to="stall">🏪<span>Stall</span></button>
      </div></div>`;
    return h;
  },

  renderField() {
    const s = Slice.state;
    let h = `<div class="scene-title">🌾 Strawberry field <span class="sub">(first strawberry day)</span></div>`;
    h += `<div class="card"><div class="row"><span class="bed-emoji">${s.ripe > 0 ? "🍓" : "🌱"}</span>
      <div class="info" style="flex:1"><h3>The old Earliglow patch</h3>
      <div class="sub">${s.ripe > 0 ? `${s.ripe} basket${s.ripe > 1 ? "s" : ""} still ripe on the patch.` : "Picked clean. It started everything."}</div></div></div>
      <div class="row" style="margin-top:8px">
        <button class="btn primary" data-act="harvest">🧺<span>Harvest a basket</span></button>
      </div></div>`;
    h += `<div class="card"><div class="sub">Baskets in hand: <strong>${s.inv.earliglow}</strong> Earliglow.</div></div>`;
    return h;
  },

  renderKitchen() {
    const s = Slice.state;
    const canCook = s.inv.earliglow >= 1 && s.coins >= ECONOMY.compotePantryCost;
    let h = `<div class="scene-title">🍳 Kitchen <span class="sub">(first strawberry day)</span></div>`;
    h += `<div class="card"><h3>🔪 The old saucepan</h3>
      <div class="sub">It came with the farmhouse. Good for exactly one thing today.</div></div>`;
    h += `<div class="card"><div class="row"><span style="font-size:34px">🫙</span>
      <div class="info" style="flex:1"><h3>Strawberry Compote</h3>
      <div class="sub">Needs: 1 Earliglow basket (have ${s.inv.earliglow}) + ${ECONOMY.compotePantryCost} coins pantry staples (have ${s.coins}). Sugar's already in the pantry. Sells for ${ECONOMY.compoteSell}.</div></div></div>
      <div class="row" style="margin-top:8px">
        <button class="btn primary" data-act="cook">🍳<span>Cook compote</span></button>
      </div>${canCook ? "" : `<div class="sub" style="margin-top:6px">The saucepan waits — it needs a basket of berries and a couple of coins.</div>`}</div>`;
    return h;
  },

  renderStall() {
    const s = Slice.state;
    let h = `<div class="scene-title">🏪 Roadside stall <span class="sub">(first strawberry day)</span></div>`;
    h += `<div class="card"><div class="row"><span style="font-size:34px">🫙</span>
      <div class="info" style="flex:1"><h3>Strawberry Compote</h3>
      <div class="sub">In stock: <strong>${s.inv.compote}</strong> · sells for <strong>${ECONOMY.compoteSell} coins</strong>, paid immediately.</div></div></div>
      <div class="row" style="margin-top:8px">
        <button class="btn primary" data-act="sell-ask">💰<span>Sell a jar</span></button>
      </div>
      <div class="sub" style="margin-top:6px">Everything the farm sells goes through this stall. No sale happens until you confirm it.</div></div>`;
    if (s.firstSaleDone)
      h += `<div class="card"><h3>🎉 Starvale's first sale</h3>
        <div class="sub">June took the first jar. ${s.sold} sold so far, ${s.coins} coins in the jar.</div></div>`;
    return h;
  },

  wireScene(el) {
    el.querySelectorAll("[data-act]").forEach(b => b.addEventListener("click", () => this.handle(b)));
  },

  handle(b) {
    const act = b.dataset.act;
    let r;
    if (act === "nav") return this.go(b.dataset.to);
    if (act === "harvest") { r = Slice.harvest(); this.toast(r.msg); }
    else if (act === "cook") { r = Slice.cook(); this.toast(r.msg); }
    else if (act === "sell-ask") return this.sellConfirm();
    this.refresh();
  },

  /* ---------------- stall: explicit Sell -> Confirm ---------------- */
  sellConfirm() {
    const s = Slice.state;
    if ((s.inv.compote || 0) < 1) {
      this.toast("Nothing to sell yet — the compote comes first.");
      return;
    }
    this.openOverlay(`<h2>🏪 Stall</h2>
      <div class="card"><h3>Sell 1 Strawberry Compote?</h3>
      <div class="sub">June gets the jar. You get <strong>${ECONOMY.compoteSell} coins</strong>, right away.</div></div>
      <div class="row"><button class="btn primary" id="sell-yes">💰<span>Confirm sale</span></button>
      <button class="btn" id="sell-no">↩️<span>Not yet</span></button></div>`);
    document.getElementById("sell-yes").addEventListener("click", () => {
      const r = Slice.sell();
      document.getElementById("overlay-root").innerHTML = "";
      this.toast(r.msg);
      if (r.first) this.dialogue(JUNE_FIRST_SALE);
      this.refresh();
    });
    document.getElementById("sell-no").addEventListener("click", () => {
      document.getElementById("overlay-root").innerHTML = "";
    });
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

  journalOverlay() {
    const s = Slice.state;
    let h = `<h2>📓 Farm journal</h2><div class="sub">Hints follow your progress — they never boss you around.</div>`;
    const entries = [...s.journal].reverse();
    h += entries.map(e => `<div class="journal-entry"><strong>${e.title}</strong>${e.body ? `<br><span class="marginalia">${e.body}</span>` : ""}</div>`).join("") || "<p>Empty pages, waiting.</p>";
    h += `<span class="draft-note">${DRAFT} — journal prose is placeholder.</span>`;
    this.openOverlay(h);
  },
};

document.addEventListener("DOMContentLoaded", () => SUI.init());
