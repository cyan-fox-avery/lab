/* Tag, You're It — prototype v1
   Research -> plan (region/depth/bait) -> dive -> tag -> collection book.
   For sarah. Cute sea puppies with lots of teeth. */

"use strict";

/* ---------- SVG art: simplified, real proportions, few colours ---------- */

const ART = {
  thresher: `
  <svg viewBox="0 0 220 110" role="img" aria-label="Thresher shark">
    <polygon points="150,50 210,6 172,56" fill="#5d7f9e"/>
    <polygon points="152,62 176,92 160,62" fill="#5d7f9e"/>
    <ellipse cx="96" cy="56" rx="60" ry="17" fill="#6f93b8"/>
    <ellipse cx="96" cy="63" rx="52" ry="10" fill="#dfe9f2" opacity="0.85"/>
    <polygon points="38,56 56,47 56,65" fill="#6f93b8"/>
    <polygon points="96,40 108,20 118,40" fill="#5d7f9e"/>
    <polygon points="82,70 70,90 94,71" fill="#5d7f9e"/>
    <circle cx="54" cy="52" r="3.6" fill="#1c2733"/>
    <circle cx="55.2" cy="50.8" r="1.1" fill="#ffffff"/>
    <g stroke="#4a6a86" stroke-width="1.6" stroke-linecap="round">
      <line x1="72" y1="48" x2="70" y2="62"/>
      <line x1="78" y1="47" x2="76" y2="63"/>
      <line x1="84" y1="47" x2="82" y2="63"/>
    </g>
  </svg>`,
  whale: `
  <svg viewBox="0 0 220 110" role="img" aria-label="Whale shark">
    <polygon points="168,48 208,22 206,88" fill="#54687a"/>
    <ellipse cx="100" cy="55" rx="72" ry="25" fill="#5f7484"/>
    <ellipse cx="100" cy="66" rx="62" ry="14" fill="#cfd9e2" opacity="0.7"/>
    <polygon points="104,31 118,12 128,31" fill="#54687a"/>
    <polygon points="84,76 70,100 102,78" fill="#54687a"/>
    <circle cx="44" cy="50" r="3.2" fill="#1c2733"/>
    <path d="M28,62 Q40,70 54,68" stroke="#3c4c5c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <g fill="#ffffff" opacity="0.9">
      <circle cx="80" cy="44" r="2.6"/><circle cx="98" cy="40" r="2.6"/><circle cx="116" cy="43" r="2.6"/>
      <circle cx="134" cy="47" r="2.6"/><circle cx="70" cy="54" r="2.4"/><circle cx="90" cy="54" r="2.4"/>
      <circle cx="110" cy="56" r="2.4"/><circle cx="130" cy="58" r="2.4"/><circle cx="148" cy="56" r="2.2"/>
      <circle cx="82" cy="64" r="2.2"/><circle cx="104" cy="66" r="2.2"/><circle cx="126" cy="66" r="2.2"/>
    </g>
  </svg>`,
  nurse: `
  <svg viewBox="0 0 220 110" role="img" aria-label="Nurse shark">
    <polygon points="160,54 200,36 198,84" fill="#7a6242"/>
    <ellipse cx="100" cy="60" rx="64" ry="19" fill="#8a6f4d"/>
    <ellipse cx="100" cy="68" rx="56" ry="11" fill="#d8c6a6" opacity="0.8"/>
    <polygon points="112,42 122,26 130,42" fill="#7a6242"/>
    <polygon points="142,43 150,30 156,43" fill="#7a6242"/>
    <polygon points="88,76 78,96 100,77" fill="#7a6242"/>
    <circle cx="52" cy="55" r="3.2" fill="#1c2733"/>
    <g stroke="#5e4a30" stroke-width="2" stroke-linecap="round">
      <line x1="40" y1="64" x2="33" y2="71"/>
      <line x1="40" y1="67" x2="33" y2="74"/>
    </g>
    <g stroke="#6e5739" stroke-width="1.6" stroke-linecap="round">
      <line x1="72" y1="52" x2="70" y2="66"/>
      <line x1="78" y1="51" x2="76" y2="67"/>
    </g>
  </svg>`,
  goblin: `
  <svg viewBox="0 0 220 110" role="img" aria-label="Goblin shark">
    <polygon points="158,50 198,28 196,82" fill="#c08484"/>
    <ellipse cx="106" cy="55" rx="56" ry="15" fill="#d99a9a"/>
    <ellipse cx="106" cy="61" rx="48" ry="9" fill="#f2d9d9" opacity="0.8"/>
    <polygon points="52,55 10,46 10,62" fill="#d99a9a"/>
    <polygon points="106,41 116,28 122,41" fill="#c08484"/>
    <polygon points="92,68 82,86 102,69" fill="#c08484"/>
    <circle cx="48" cy="50" r="3.2" fill="#1c2733"/>
    <path d="M30,60 Q44,66 56,64" stroke="#a86a6a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <g stroke="#a86a6a" stroke-width="1.4" stroke-linecap="round">
      <line x1="76" y1="48" x2="74" y2="60"/>
      <line x1="82" y1="47" x2="80" y2="61"/>
    </g>
  </svg>`
};

/* ---------- Data ---------- */

const REGIONS = {
  "caribbean":    { name: "Caribbean Sea",        note: "A green sea turtle glides past the reef." },
  "baja":         { name: "Baja California",      note: "A school of sardines shimmers below." },
  "philippines":  { name: "Philippines",          note: "A manta ray loops lazily overhead." },
  "maldives":     { name: "Maldives",             note: "Dolphins click and whistle in the distance." },
  "japan":        { name: "Sagami Bay, Japan",    note: "A lanternfish flickers in the dark." },
  "mediterranean":{ name: "Mediterranean Sea",    note: "A pod of dolphins crosses the bow." },
  "open-atlantic":{ name: "Open Atlantic",        note: "Shearwaters wheel above the swells." }
};

const DEPTHS = {
  "shallow":  { name: "Shallow reef (0–30 m)",   scene: "depth-shallow" },
  "surface":  { name: "Open surface (0–50 m)",   scene: "depth-surface" },
  "midwater": { name: "Mid-water (100–300 m)",   scene: "depth-midwater" },
  "deep":     { name: "Deep slope (300–1000 m)", scene: "depth-deep" }
};

const BAITS = {
  "crustaceans":   "Crabs & lobster",
  "squid":         "Squid",
  "schooling-fish":"Schooling fish (mackerel)",
  "plankton":      "Plankton bloom — no bait, follow the bloom"
};

const SHARKS = [
  {
    id: "nurse",
    name: "Nurse Shark", latin: "Ginglymostoma cirratum", status: "Vulnerable",
    combo: { region: "caribbean", depth: "shallow", bait: "crustaceans" },
    sizeRange: [2.0, 3.0],
    research: "A bottom-dweller of the warm, shallow tropical Atlantic — the Caribbean, Florida, the Bahamas. By day it piles up with others under reef ledges; by night it hunts alone, vacuuming crabs, lobster and squid off the sand with the little barbels on its snout.",
    hook: "By day they nap in cuddly heaps of up to 40 on the seafloor. Peak sea puppy.",
    nameIdeas: ["Puddles", "Biscuit", "Sandy", "Nugget"]
  },
  {
    id: "thresher",
    name: "Thresher Shark", latin: "Alopias vulpinus", status: "Vulnerable",
    combo: { region: "open-atlantic", depth: "midwater", bait: "schooling-fish" },
    sizeRange: [3.0, 4.6],
    research: "Follows warm water through tropical and temperate oceans worldwide, often over the open Atlantic. Spends the day deep below the sunlit layer and rises toward the surface at night. Hunts schooling fish — anchovies, herring, mackerel — stunning them with a whip of its enormous tail, half its body length.",
    hook: "That tail looks perpetually nervous, but it's actually a sword. Threshers hunt by tail-whipping.",
    nameIdeas: ["Whip", "Nervous Nigel", "Swoosh", "Comet"]
  },
  {
    id: "whale",
    name: "Whale Shark", latin: "Rhincodon typus", status: "Endangered",
    combo: { region: "philippines", depth: "surface", bait: "plankton" },
    sizeRange: [5.5, 12.0],
    research: "Roams all tropical and warm-temperate seas — the Philippines, the Maldives, the Yucatan. A filter feeder: it doesn't chase prey, it finds seasonal plankton blooms and swims through them with its enormous mouth open. Each shark's spot pattern is unique, like a fingerprint.",
    hook: "The biggest fish in the ocean, and it eats some of the smallest food. Gentle polka-dotted bus.",
    nameIdeas: ["Dot", "Bus", "Domino", "Galaxy"]
  },
  {
    id: "goblin",
    name: "Goblin Shark", latin: "Mitsukurina owstoni", status: "Least Concern",
    combo: { region: "japan", depth: "deep", bait: "squid" },
    sizeRange: [2.5, 4.0],
    research: "A living fossil from deep continental slopes — most records come from Japan's Sagami Bay. Lives in darkness between 270 and 960 metres, hunting deep-sea fish and squid. Its jaws shoot forward like a slingshot, and it finds prey by sensing electricity.",
    hook: "The only living member of a 125-million-year-old lineage. Pink, pointy-nosed, and deeply weird.",
    nameIdeas: ["Nosey", "Fossil", "Blush", "Slingshot"]
  }
];

/* Cousin texts: genuine conversation, never a "hint" UI */
const COUSIN_CHATS = [
  { them: "did you see any sharks today?? tell me EVERYTHING", me: "Working on it! The ocean is big, the sharks are sneaky." },
  { them: "i drew a thresher shark at school today. the tail took up the WHOLE page lol", me: "As it should. That tail is half the shark." },
  { them: "mom says i know more about sharks than my teacher. she's probably right", me: "She's definitely right." },
  { them: "do whale sharks have belly buttons? asking for science", me: "Asking the important questions. I'll look into it." },
  { them: "ranking sharks by cuddliness: nurse shark is winning by a lot", me: "Strong ranking. Hard to argue with a shark that naps in piles." },
  { them: "if i was a shark i would be a goblin shark because nobody would bother me down there", me: "Honestly? Valid strategy." }
];

const COUSIN_NUDGES = {
  nurse:   "nurse sharks sleep on the BOTTOM in the SHALLOW parts!! like where you could stand up. and they eat crabs off the sand!! try the caribbean reefs",
  thresher:"threshers go DEEP during the day!! below where the sunlight reaches. and they hunt schools of little fish. deeper water + fish bait??",
  whale:   "whale sharks don't eat bait!! they eat PLANKTON!! you have to find the bloom. they're usually right at the surface where the water looks green",
  goblin:  "goblin sharks live SO deep. deeper than any scuba diver can go. there's a really deep bay in japan where scientists find them!!"
};

/* ---------- State ---------- */

const store = {
  load() {
    try { return JSON.parse(localStorage.getItem("tyi-collection") || "{}"); }
    catch { return {}; }
  },
  save(data) { localStorage.setItem("tyi-collection", JSON.stringify(data)); }
};

const state = {
  tagged: store.load(),   // id -> {name, length, sex, location, date}
  failures: 0,
  chatIdx: 0,
  pendingTag: null        // species object awaiting naming
};

const $ = (id) => document.getElementById(id);
const sharkById = (id) => SHARKS.find(s => s.id === id);
const untagged = () => SHARKS.filter(s => !state.tagged[s.id]);

/* ---------- Tabs ---------- */

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    $("tab-" + btn.dataset.tab).classList.add("active");
  });
});
function goTab(name) {
  document.querySelector(`.tab[data-tab="${name}"]`).click();
}

/* ---------- Research ---------- */

function renderResearch() {
  const list = $("researchList");
  list.innerHTML = "";
  SHARKS.forEach(s => {
    const done = !!state.tagged[s.id];
    const card = document.createElement("div");
    card.className = "species-card";
    card.innerHTML = `
      <div class="shark-art">${ART[s.id]}</div>
      <h3>${s.name} ${done ? "✅" : ""}</h3>
      <p class="latin">${s.latin}</p>
      <span class="status-pill">IUCN: ${s.status}</span>
      <p class="research-text">${s.research}</p>
      <p class="hook">💡 ${s.hook}</p>
      ${done
        ? `<p class="hook">Tagged: <strong>${state.tagged[s.id].name}</strong> 🎉</p>`
        : `<button class="secondary-button" data-plan="${s.id}" type="button">Plan an expedition for this shark</button>`}
    `;
    list.appendChild(card);
  });
  list.querySelectorAll("[data-plan]").forEach(b =>
    b.addEventListener("click", () => {
      $("targetSelect").value = b.dataset.plan;
      goTab("expedition");
    })
  );
}

/* ---------- Planner ---------- */

function fillSelect(el, obj, key) {
  el.innerHTML = "";
  Object.entries(obj).forEach(([id, v]) => {
    const o = document.createElement("option");
    o.value = id;
    o.textContent = typeof v === "string" ? v : v.name;
    el.appendChild(o);
  });
}

function renderPlanner() {
  const t = $("targetSelect");
  const current = t.value;
  t.innerHTML = "";
  untagged().forEach(s => {
    const o = document.createElement("option");
    o.value = s.id;
    o.textContent = s.name;
    t.appendChild(o);
  });
  if (untagged().some(s => s.id === current)) t.value = current;
  if (!untagged().length) {
    $("planner").innerHTML = `<p class="research-text" style="text-align:center">All four sharks tagged! Check your collection book. 🎉</p>`;
  }
}

$("launchBtn").addEventListener("click", () => {
  if (!untagged().length) return;
  runExpedition({
    target: $("targetSelect").value,
    region: $("regionSelect").value,
    depth: $("depthSelect").value,
    bait: $("baitSelect").value
  });
});

/* ---------- Expedition ---------- */

function logLine(html, cls) {
  const p = document.createElement("p");
  if (cls) p.className = cls;
  p.innerHTML = html;
  $("diveLog").appendChild(p);
  p.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function runExpedition(plan) {
  const target = sharkById(plan.target);
  $("launchBtn").disabled = true;
  $("diveView").classList.remove("hidden");
  $("diveActions").classList.add("hidden");
  $("diveActions").innerHTML = "";
  $("diveLog").innerHTML = "";
  $("diveShark").classList.add("hidden");

  const scene = $("diveScene");
  scene.className = "dive-scene " + DEPTHS[plan.depth].scene;

  const baitText = plan.bait === "plankton"
    ? "No bait — scanning the water for a plankton bloom…"
    : `Bait deployed: ${BAITS[plan.bait]}.`;

  logLine(`🛥️ <strong>Expedition begun</strong> — the research vessel leaves the harbor.`);
  await wait(1100);
  logLine(`🪝 ${baitText}`);
  await wait(1100);
  logLine(`🐟 First fish appear in the blue…`);
  await wait(1100);
  logLine(`👀 ${REGIONS[plan.region].note}`);
  await wait(1200);
  logLine(`⏳ The hours slip by…`);
  await wait(1200);
  logLine(`🌊 The light changes. Something moves below…`);
  await wait(1400);

  // Who shows up? Any species whose combo matches, target or untagged other.
  const appeared = SHARKS.filter(s =>
    s.combo.region === plan.region &&
    s.combo.depth === plan.depth &&
    s.combo.bait === plan.bait
  );
  const taggable = appeared.filter(s => !state.tagged[s.id]);
  const alreadyTagged = appeared.filter(s => state.tagged[s.id]);

  const actions = $("diveActions");
  actions.classList.remove("hidden");

  if (taggable.length) {
    const s = taggable[0];
    $("diveShark").innerHTML = ART[s.id];
    $("diveShark").classList.remove("hidden");
    logLine(`🦈 <span class="found">SHARKS! A ${s.name}!</span>`, "found");
    state.failures = 0;
    const tagBtn = document.createElement("button");
    tagBtn.className = "primary-button";
    tagBtn.type = "button";
    tagBtn.textContent = `🏷️ Tag the ${s.name}`;
    tagBtn.addEventListener("click", () => openTagging(s));
    actions.appendChild(tagBtn);
  } else if (alreadyTagged.length) {
    const s = alreadyTagged[0];
    const rec = state.tagged[s.id];
    $("diveShark").innerHTML = ART[s.id];
    $("diveShark").classList.remove("hidden");
    logLine(`🦈 <span class="found">Look who it is — ${rec.name} the ${s.name}, already in your book!</span>`, "found");
    state.failures = 0;
  } else {
    logLine(`<span class="miss">The water stays empty. Time to head back.</span>`, "miss");
    state.failures += 1;
  }

  const backBtn = document.createElement("button");
  backBtn.className = "secondary-button";
  backBtn.type = "button";
  backBtn.textContent = "Return to ship";
  backBtn.addEventListener("click", () => {
    $("diveView").classList.add("hidden");
    $("launchBtn").disabled = false;
    renderPlanner();
    renderCollection();
    renderResearch();
    afterExpedition(plan.target);
  });
  actions.appendChild(backBtn);
}

/* ---------- Cousin texts ---------- */

function showCousin(messages) {
  const thread = $("cousinThread");
  thread.innerHTML = "";
  messages.forEach(m => {
    const b = document.createElement("div");
    b.className = "bubble " + m.who;
    b.textContent = m.text;
    thread.appendChild(b);
  });
  $("cousinOverlay").classList.remove("hidden");
}
$("cousinClose").addEventListener("click", () => {
  $("cousinOverlay").classList.add("hidden");
});

function afterExpedition(targetId) {
  if (state.failures >= 3) {
    // gentle nudge, genuine-conversation style
    showCousin([
      { who: "them", text: "how's the shark hunting going??" },
      { who: "me", text: "Honestly? Struck out a few times. This one's tricky." },
      { who: "them", text: COUSIN_NUDGES[targetId] || "you'll get the next one!! i believe in you" },
      { who: "me", text: "Huh. Okay, that's actually really helpful. Thanks, kiddo." }
    ]);
    state.failures = 0;
    return;
  }
  const chat = COUSIN_CHATS[state.chatIdx % COUSIN_CHATS.length];
  state.chatIdx += 1;
  showCousin([
    { who: "them", text: chat.them },
    { who: "me", text: chat.me }
  ]);
}

/* ---------- Tagging ---------- */

const rand = (a, b) => Math.round((a + Math.random() * (b - a)) * 10) / 10;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function openTagging(species) {
  state.pendingTag = species;
  const length = rand(species.sizeRange[0], species.sizeRange[1]);
  const sex = Math.random() < 0.5 ? "female" : "male";
  state.pendingTag._gen = { length, sex };
  $("tagSharkArt").innerHTML = ART[species.id];
  $("tagInfo").innerHTML = `
    <strong>${species.name}</strong> <em>(${species.latin})</em><br>
    📏 ${length} m &nbsp;·&nbsp; ${sex === "female" ? "♀ female" : "♂ male"}<br>
    📍 Tagged at: ${REGIONS[$("regionSelect").value].name}<br>
    📅 ${new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
  `;
  $("sharkName").value = pick(species.nameIdeas);
  $("tagOverlay").classList.remove("hidden");
  setTimeout(() => $("sharkName").select(), 100);
}

$("tagConfirm").addEventListener("click", () => {
  const s = state.pendingTag;
  if (!s) return;
  const name = $("sharkName").value.trim() || pick(s.nameIdeas);
  state.tagged[s.id] = {
    name,
    length: s._gen.length,
    sex: s._gen.sex,
    location: REGIONS[$("regionSelect").value].name,
    date: new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  };
  store.save(state.tagged);
  $("tagOverlay").classList.add("hidden");
  $("diveView").classList.add("hidden");
  const lb = $("launchBtn");
  if (lb) lb.disabled = false;
  state.pendingTag = null;
  renderAll();
  goTab("collection");
});

/* ---------- Collection book ---------- */

function renderCollection() {
  const list = $("collectionList");
  list.innerHTML = "";
  const ids = Object.keys(state.tagged);
  $("collectionCount").textContent = `${ids.length}/4`;
  $("completeBanner").classList.toggle("hidden", ids.length < 4);

  if (!ids.length) {
    list.innerHTML = `<div class="empty-note">No sharks tagged yet.<br>Do your research, then get out there. 🦈</div>`;
    return;
  }
  SHARKS.filter(s => state.tagged[s.id]).forEach(s => {
    const t = state.tagged[s.id];
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <div class="shark-art">${ART[s.id]}</div>
      <div class="given-name">“${t.name}”</div>
      <h3 style="margin:0">${s.name}</h3>
      <p class="latin">${s.latin}</p>
      <span class="status-pill">IUCN: ${s.status}</span>
      <p class="book-stats">
        📏 ${t.length} m · ${t.sex === "female" ? "♀ female" : "♂ male"}<br>
        📍 Tagged at ${t.location}<br>
        📅 ${t.date}
      </p>
      <p class="research-text">${s.research}</p>
      <p class="hook">💡 ${s.hook}</p>
    `;
    list.appendChild(card);
  });
}

/* ---------- Boot ---------- */

function renderAll() {
  renderResearch();
  renderPlanner();
  renderCollection();
}

fillSelect($("regionSelect"), REGIONS);
fillSelect($("depthSelect"), DEPTHS);
fillSelect($("baitSelect"), BAITS);
renderAll();
