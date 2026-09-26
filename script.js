(() => {
  "use strict";

  const SAVE_KEY = "rock-go-crunch-v01";

  const MINERALS = {
    quartz: {
      name: "Quartz",
      subtitle: "Silicon dioxide · SiO₂",
      facts: {
        raw: "Quartz commonly forms six-sided crystals and is one of Earth’s most abundant minerals.",
        tumbled: "Tumbling rounds rough edges through repeated abrasion with grit and water.",
        cut: "Clear quartz can be faceted, even though it is much softer than diamond."
      },
      sell: { raw: 4, tumbled: 8, cut: 16 }
    },
    amethyst: {
      name: "Amethyst",
      subtitle: "Purple quartz · SiO₂",
      facts: {
        raw: "Amethyst is quartz whose purple colour is linked to trace iron and natural irradiation.",
        tumbled: "Polishing can make amethyst’s colour and internal patterns easier to see.",
        cut: "Amethyst is often faceted to emphasize colour rather than rarity."
      },
      sell: { raw: 10, tumbled: 20, cut: 40 }
    }
  };

  const STAGES = ["raw", "tumbled", "cut"];

  const PICK_TIERS = [
    {
      name: "Basic Pick",
      tier: "Tier I",
      durability: 26,
      cost: 80,
      description: "A little clumsy, but it gets through rock."
    },
    {
      name: "Steel Pick",
      tier: "Tier II",
      durability: 34,
      cost: 220,
      description: "More swings per run, which means more chances to follow a promising trace."
    },
    {
      name: "Geologist’s Pick",
      tier: "Tier III",
      durability: 44,
      cost: null,
      description: "The prototype’s best tool. Plenty of room to chase a vein."
    }
  ];

  const defaultState = () => ({
    credits: 0,
    pickTier: 0,
    sound: true,
    inventory: {
      quartz: { raw: 0, tumbled: 0, cut: 0 },
      amethyst: { raw: 0, tumbled: 0, cut: 0 }
    },
    collection: {
      quartz: { raw: false, tumbled: false, cut: false },
      amethyst: { raw: false, tumbled: false, cut: false }
    },
    run: null
  });

  let state = loadState();
  let toastTimer = null;
  let audioContext = null;

  const els = {
    mineBoard: document.getElementById("mineBoard"),
    durability: document.getElementById("durability"),
    maxDurability: document.getElementById("maxDurability"),
    durabilityMeter: document.getElementById("durabilityMeter"),
    credits: document.getElementById("credits"),
    pickName: document.getElementById("pickName"),
    pickTierText: document.getElementById("pickTierText"),
    newRunButton: document.getElementById("newRunButton"),
    returnButton: document.getElementById("returnButton"),
    runFinds: document.getElementById("runFinds"),
    mineMessage: document.getElementById("mineMessage"),
    workbenchList: document.getElementById("workbenchList"),
    collectionGrid: document.getElementById("collectionGrid"),
    collectionCount: document.getElementById("collectionCount"),
    collectionMeter: document.getElementById("collectionMeter"),
    upgradePickName: document.getElementById("upgradePickName"),
    upgradeDescription: document.getElementById("upgradeDescription"),
    upgradeCost: document.getElementById("upgradeCost"),
    upgradeButton: document.getElementById("upgradeButton"),
    resetButton: document.getElementById("resetButton"),
    soundToggle: document.getElementById("soundToggle"),
    toast: document.getElementById("toast")
  };

  init();

  function init() {
    if (!state.run) {
      state.run = generateRun();
      saveState();
    }

    wireNavigation();
    wireStaticButtons();
    renderAll();
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (!saved) return defaultState();

      const parsed = JSON.parse(saved);
      const fresh = defaultState();

      return {
        ...fresh,
        ...parsed,
        inventory: {
          quartz: { ...fresh.inventory.quartz, ...(parsed.inventory?.quartz || {}) },
          amethyst: { ...fresh.inventory.amethyst, ...(parsed.inventory?.amethyst || {}) }
        },
        collection: {
          quartz: { ...fresh.collection.quartz, ...(parsed.collection?.quartz || {}) },
          amethyst: { ...fresh.collection.amethyst, ...(parsed.collection?.amethyst || {}) }
        }
      };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }

  function generateRun() {
    const size = 8;
    const total = size * size;
    const gemPlan = [
      ...Array(7).fill("quartz"),
      ...Array(3).fill("amethyst")
    ];

    const tiles = Array.from({ length: total }, (_, index) => ({
      index,
      gem: null,
      revealed: false,
      trace: null
    }));

    const candidates = Array.from({ length: total }, (_, i) => i);

    shuffle(candidates);

    gemPlan.forEach((gem, i) => {
      tiles[candidates[i]].gem = gem;
    });

    tiles.forEach(tile => {
      if (tile.gem) return;

      const nearby = getNeighbors(tile.index, size)
        .map(i => tiles[i].gem)
        .filter(Boolean);

      const hasQuartz = nearby.includes("quartz");
      const hasAmethyst = nearby.includes("amethyst");

      if (hasQuartz && hasAmethyst) tile.trace = "mixed";
      else if (hasAmethyst) tile.trace = "amethyst";
      else if (hasQuartz) tile.trace = "quartz";
    });

    const maxDurability = PICK_TIERS[state.pickTier]?.durability || PICK_TIERS[0].durability;

    return {
      size,
      durability: maxDurability,
      finds: { quartz: 0, amethyst: 0 },
      tiles
    };
  }

  function getNeighbors(index, size) {
    const row = Math.floor(index / size);
    const col = index % size;
    const neighbors = [];

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < size && c >= 0 && c < size) {
          neighbors.push(r * size + c);
        }
      }
    }

    return neighbors;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function wireNavigation() {
    document.querySelectorAll(".nav-button").forEach(button => {
      button.addEventListener("click", () => {
        const target = button.dataset.target;

        document.querySelectorAll(".nav-button").forEach(b =>
          b.classList.toggle("active", b === button)
        );

        document.querySelectorAll(".panel").forEach(panel =>
          panel.classList.toggle("active", panel.dataset.panel === target)
        );

        if (target === "workbench") renderWorkbench();
        if (target === "collection") renderCollection();
        if (target === "upgrades") renderUpgrades();
      });
    });
  }

  function wireStaticButtons() {
    els.newRunButton.addEventListener("click", startNewRun);
    els.returnButton.addEventListener("click", startNewRun);

    els.upgradeButton.addEventListener("click", upgradePick);

    els.soundToggle.addEventListener("click", () => {
      state.sound = !state.sound;
      saveState();
      renderSoundButton();
      if (state.sound) playTone("soft");
    });

    els.resetButton.addEventListener("click", () => {
      const okay = window.confirm("Reset all Rock Go Crunch prototype progress?");
      if (!okay) return;
      localStorage.removeItem(SAVE_KEY);
      state = defaultState();
      state.run = generateRun();
      saveState();
      renderAll();
      showToast("Prototype save reset.");
    });
  }

  function startNewRun() {
    state.run = generateRun();
    saveState();
    playTone("soft");
    renderMine();
    showToast("Fresh rock face. Pick a trace and start crunching.");
  }

  function mineTile(index) {
    const run = state.run;
    const tile = run.tiles[index];

    if (!tile || tile.revealed || run.durability <= 0) return;

    tile.revealed = true;
    run.durability -= 1;

    if (tile.gem) {
      const mineral = tile.gem;
      state.inventory[mineral].raw += 1;
      run.finds[mineral] += 1;
      playTone("gem", mineral);
      showToast(`Found raw ${MINERALS[mineral].name}!`);
      setMineMessage(
        "✦",
        `${MINERALS[mineral].name}!`,
        mineral === "amethyst"
          ? "A purple quartz specimen. Keep it, process it, donate it, or sell it."
          : "A fresh quartz specimen. Common does not mean useless."
      );
    } else {
      playTone("crunch");
      setMineMessage("🪨", "Crunch.", "Nothing in that tile. Follow the traces and try another spot.");
    }

    if (run.durability <= 0) {
      setMineMessage("⛏️", "Pick worn out.", "That run is finished. Return to the surface for a fresh rock face.");
      showToast("Run finished. No waiting required.");
    }

    saveState();
    renderMine();
    renderWorkbench();
  }

  function setMineMessage(icon, title, body) {
    els.mineMessage.innerHTML = `
      <span class="message-icon">${icon}</span>
      <div>
        <strong>${title}</strong>
        <p>${body}</p>
      </div>
    `;
  }

  function renderAll() {
    renderMine();
    renderWorkbench();
    renderCollection();
    renderUpgrades();
    renderSoundButton();
  }

  function renderMine() {
    const run = state.run;
    const pick = PICK_TIERS[state.pickTier];

    els.credits.textContent = state.credits;
    els.pickName.textContent = pick.name;
    els.pickTierText.textContent = pick.tier;
    els.durability.textContent = run.durability;
    els.maxDurability.textContent = pick.durability;
    els.durabilityMeter.style.width = `${Math.max(0, (run.durability / pick.durability) * 100)}%`;

    const finds = [];
    if (run.finds.quartz) finds.push(`${run.finds.quartz} quartz`);
    if (run.finds.amethyst) finds.push(`${run.finds.amethyst} amethyst`);
    els.runFinds.textContent = finds.length ? finds.join(" · ") : "Nothing yet";

    els.mineBoard.innerHTML = "";

    run.tiles.forEach(tile => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "rock";
      button.setAttribute("aria-label", `Mine tile ${tile.index + 1}`);

      if (tile.revealed) {
        button.classList.add("revealed");
        if (tile.gem) {
          button.classList.add("gem", `gem-${tile.gem}`);
          button.setAttribute("aria-label", `Revealed ${MINERALS[tile.gem].name}`);
        } else {
          button.classList.add("empty");
          button.setAttribute("aria-label", "Revealed empty rock");
        }
        button.disabled = true;
      } else {
        if (tile.trace) button.classList.add(`trace-${tile.trace}`);
        button.disabled = run.durability <= 0;
        button.addEventListener("click", () => mineTile(tile.index));
      }

      els.mineBoard.appendChild(button);
    });
  }

  function renderWorkbench() {
    els.workbenchList.innerHTML = "";

    Object.entries(MINERALS).forEach(([key, mineral]) => {
      const card = document.createElement("article");
      card.className = "mineral-card";

      const rows = STAGES.map(stage => {
        const count = state.inventory[key][stage];
        const donated = state.collection[key][stage];

        let transformButton = "";

        if (stage === "raw") {
          transformButton = `
            <button class="mini-button accent" data-action="process" data-mineral="${key}" data-stage="raw" ${count < 1 ? "disabled" : ""}>
              Tumble 1
            </button>`;
        } else if (stage === "tumbled") {
          transformButton = `
            <button class="mini-button accent" data-action="process" data-mineral="${key}" data-stage="tumbled" ${count < 1 ? "disabled" : ""}>
              Cut 1
            </button>`;
        }

        return `
          <div class="stage-row">
            <div class="stage-count">
              <strong>${count}</strong>
              <span>${capitalize(stage)}</span>
            </div>
            <div class="stage-actions">
              ${transformButton}
              <button class="mini-button donate" data-action="donate" data-mineral="${key}" data-stage="${stage}" ${count < 1 || donated ? "disabled" : ""}>
                ${donated ? "In cabinet" : "Donate"}
              </button>
              <button class="mini-button" data-action="sell" data-mineral="${key}" data-stage="${stage}" ${count < 1 ? "disabled" : ""}>
                Sell ¢${mineral.sell[stage]}
              </button>
            </div>
          </div>
        `;
      }).join("");

      card.innerHTML = `
        <div class="mineral-card-header">
          <div class="mineral-swatch ${key}"></div>
          <div>
            <h3>${mineral.name}</h3>
            <p>${mineral.subtitle}</p>
          </div>
        </div>
        ${rows}
      `;

      els.workbenchList.appendChild(card);
    });

    els.workbenchList.querySelectorAll("[data-action]").forEach(button => {
      button.addEventListener("click", handleWorkbenchAction);
    });
  }

  function handleWorkbenchAction(event) {
    const button = event.currentTarget;
    const action = button.dataset.action;
    const mineral = button.dataset.mineral;
    const stage = button.dataset.stage;

    if (action === "process") {
      processSpecimen(mineral, stage);
    } else if (action === "donate") {
      donateSpecimen(mineral, stage);
    } else if (action === "sell") {
      sellSpecimen(mineral, stage);
    }
  }

  function processSpecimen(mineral, fromStage) {
    const nextStage = fromStage === "raw" ? "tumbled" : "cut";

    if (!nextStage || state.inventory[mineral][fromStage] < 1) return;

    state.inventory[mineral][fromStage] -= 1;
    state.inventory[mineral][nextStage] += 1;

    playTone("process");
    saveState();
    renderWorkbench();
    showToast(`${MINERALS[mineral].name}: ${capitalize(fromStage)} → ${capitalize(nextStage)}`);
  }

  function donateSpecimen(mineral, stage) {
    if (state.collection[mineral][stage]) return;
    if (state.inventory[mineral][stage] < 1) return;

    state.inventory[mineral][stage] -= 1;
    state.collection[mineral][stage] = true;

    playTone("collection", mineral);
    saveState();
    renderWorkbench();
    renderCollection(mineral, stage);
    showToast(`${MINERALS[mineral].name} ${stage} added to the cabinet ✦`);
  }

  function sellSpecimen(mineral, stage) {
    if (state.inventory[mineral][stage] < 1) return;

    const value = MINERALS[mineral].sell[stage];
    state.inventory[mineral][stage] -= 1;
    state.credits += value;

    playTone("coin");
    saveState();
    renderMine();
    renderWorkbench();
    renderUpgrades();
    showToast(`Sold ${stage} ${MINERALS[mineral].name} for ¢${value}.`);
  }

  function renderCollection(highlightMineral = null, highlightStage = null) {
    els.collectionGrid.innerHTML = "";

    let filled = 0;

    Object.entries(MINERALS).forEach(([key, mineral]) => {
      const section = document.createElement("article");
      section.className = "collection-mineral";

      const mineralFilled = STAGES.filter(stage => state.collection[key][stage]).length;
      filled += mineralFilled;

      const slots = STAGES.map(stage => {
        const isFilled = state.collection[key][stage];
        const highlight = isFilled && key === highlightMineral && stage === highlightStage;

        return `
          <div class="collection-slot ${isFilled ? `filled ${key}` : ""} ${highlight ? "new-fill" : ""}" data-stage="${stage}">
            <span class="slot-stage">${capitalize(stage)}</span>
            <span class="slot-state">${isFilled ? mineral.facts[stage] : "Empty slot"}</span>
          </div>
        `;
      }).join("");

      section.innerHTML = `
        <div class="collection-title">
          <h3>${mineral.name}</h3>
          <span>${mineralFilled} / 3 collected</span>
        </div>
        <div class="slot-row">${slots}</div>
      `;

      els.collectionGrid.appendChild(section);
    });

    els.collectionCount.textContent = `${filled} / 6`;
    els.collectionMeter.style.width = `${(filled / 6) * 100}%`;
  }

  function renderUpgrades() {
    const pick = PICK_TIERS[state.pickTier];

    els.upgradePickName.textContent = `${pick.name} · ${pick.tier}`;
    els.upgradeDescription.textContent = `${pick.description} ${pick.durability} swings per run.`;

    if (pick.cost === null) {
      els.upgradeCost.textContent = "MAX";
      els.upgradeButton.textContent = "Prototype max";
      els.upgradeButton.disabled = true;
    } else {
      els.upgradeCost.textContent = `¢${pick.cost}`;
      els.upgradeButton.textContent = "Upgrade pick";
      els.upgradeButton.disabled = state.credits < pick.cost;
    }
  }

  function upgradePick() {
    const current = PICK_TIERS[state.pickTier];

    if (current.cost === null || state.credits < current.cost) return;

    state.credits -= current.cost;
    state.pickTier += 1;

    // A new tool begins a fresh run at full durability.
    state.run = generateRun();

    playTone("upgrade");
    saveState();
    renderAll();
    showToast(`${PICK_TIERS[state.pickTier].name} unlocked!`);
  }

  function renderSoundButton() {
    els.soundToggle.textContent = state.sound ? "🔊" : "🔇";
    els.soundToggle.setAttribute("aria-label", state.sound ? "Mute sound" : "Enable sound");
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("show");

    toastTimer = setTimeout(() => {
      els.toast.classList.remove("show");
    }, 1800);
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function getAudioContext() {
    if (!state.sound) return null;

    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;

    if (!audioContext) audioContext = new Ctx();
    if (audioContext.state === "suspended") audioContext.resume();

    return audioContext;
  }

  function playTone(type, mineral = "quartz") {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === "crunch") {
      const bufferSize = Math.floor(ctx.sampleRate * 0.055);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }

      const noise = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      noise.buffer = buffer;
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.06);
      return;
    }

    const toneSets = {
      gem: mineral === "amethyst" ? [392, 523, 659] : [440, 587, 698],
      process: [260, 330],
      collection: mineral === "amethyst" ? [523, 659, 784] : [587, 698, 880],
      coin: [660, 880],
      upgrade: [330, 440, 554, 659],
      soft: [300]
    };

    const freqs = toneSets[type] || toneSets.soft;

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.055;
      const duration = type === "collection" || type === "upgrade" ? 0.18 : 0.11;

      osc.type = type === "soft" ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.055, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    });
  }
})();
