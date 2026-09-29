(() => {
  'use strict';

  const SAVE_KEY = 'rock-go-crunch-v2';
  const GRID_SIZE = 10;

  const MATERIALS = {
    quartz: {
      name: 'Quartz', subtitle: 'Silicon dioxide · SiO₂', family: 'mineral', wing: 'minerals', iconClass: 'gem quartz',
      signature: { id: 'silicon-dioxide', label: 'Silicon dioxide', formula: 'SiO₂' },
      stages: ['raw','tumbled','cut'], stageLabels: {raw:'Raw',tumbled:'Tumbled',cut:'Cut'}, prices: {raw:4,tumbled:7,cut:12},
      process: {raw:'tumbled',tumbled:'cut'}, processLabels: {raw:'Tumble 1',tumbled:'Cut 1'},
      facts: {
        raw: 'Quartz commonly forms six-sided crystals and is one of Earth’s most abundant minerals.',
        tumbled: 'Tumbling rounds rough edges through repeated abrasion with grit and water.',
        cut: 'Clear quartz can be faceted even though it is much softer than diamond.'
      },
      mastery: { reward: 25, fact: 'Quartz is piezoelectric: squeezing or vibrating it can create an electrical charge, which is why quartz is useful in clocks, watches, and electronics.' }
    },
    amethyst: {
      name: 'Amethyst', subtitle: 'Purple quartz · SiO₂', family: 'mineral', wing: 'minerals', iconClass: 'gem amethyst',
      signature: { id: 'silicon-dioxide', label: 'Silicon dioxide', formula: 'SiO₂' },
      stages: ['raw','tumbled','cut'], stageLabels: {raw:'Raw',tumbled:'Tumbled',cut:'Cut'}, prices: {raw:8,tumbled:14,cut:24},
      process: {raw:'tumbled',tumbled:'cut'}, processLabels: {raw:'Tumble 1',tumbled:'Cut 1'},
      facts: {
        raw: 'Amethyst is a purple variety of quartz. Its colour is linked to trace iron and natural irradiation.',
        tumbled: 'Polishing can make amethyst’s colour zoning and internal patterns easier to see.',
        cut: 'Amethyst is commonly faceted to emphasize colour and brilliance.'
      },
      mastery: { reward: 40, fact: 'Heating can change amethyst’s colour. Some commercial citrine is produced by carefully heat-treating amethyst.' }
    },
    garnet: {
      name: 'Garnet', subtitle: 'A family of silicate minerals', family: 'mineral', wing: 'minerals', iconClass: 'gem garnet',
      signature: { id: 'garnet-silicate', label: 'Silicate-group chemistry', formula: 'variable' },
      stages: ['raw','tumbled','cut'], stageLabels: {raw:'Raw',tumbled:'Tumbled',cut:'Cut'}, prices: {raw:14,tumbled:26,cut:46},
      process: {raw:'tumbled',tumbled:'cut'}, processLabels: {raw:'Tumble 1',tumbled:'Cut 1'}, workshopRequired: 1,
      facts: {
        raw: 'Garnet is not one single mineral but a group of related minerals with similar crystal structures.',
        tumbled: 'Garnets occur in several colours; deep red is familiar, but green, orange, and other varieties exist.',
        cut: 'Gem-quality garnet can be faceted, while more opaque material is often polished instead.'
      },
      mastery: { reward: 65, fact: 'Garnet is useful outside jewellery too. Its hardness makes crushed garnet a practical industrial abrasive, including in some waterjet-cutting systems.' }
    },
    topaz: {
      name: 'Topaz', subtitle: 'Aluminium fluorosilicate', family: 'mineral', wing: 'minerals', iconClass: 'gem topaz',
      signature: { id: 'topaz-chemistry', label: 'Aluminium fluorosilicate', formula: 'Al₂SiO₄(F,OH)₂' },
      stages: ['raw','tumbled','cut'], stageLabels: {raw:'Raw',tumbled:'Tumbled',cut:'Cut'}, prices: {raw:18,tumbled:34,cut:60},
      process: {raw:'tumbled',tumbled:'cut'}, processLabels: {raw:'Tumble 1',tumbled:'Cut 1'}, workshopRequired: 1,
      facts: {
        raw: 'Topaz can occur in several colours. Natural crystals are often colourless, pale, or lightly coloured.',
        tumbled: 'Topaz is hard but has perfect cleavage, so careless blows can split a crystal along flat planes.',
        cut: 'Cutters orient topaz carefully because its cleavage affects how safely a stone can be shaped.'
      },
      mastery: { reward: 80, fact: 'Much of the bright blue topaz sold in jewellery starts as pale or colourless topaz and is treated with irradiation and heat to create stable blue colour.' }
    },
    pyrite: {
      name: 'Pyrite', subtitle: 'Iron sulfide · FeS₂', family: 'mineral', wing: 'minerals', iconClass: 'gem pyrite',
      signature: { id: 'iron-sulfide', label: 'Iron sulfide', formula: 'FeS₂' },
      stages: ['raw'], stageLabels: {raw:'Natural specimen'}, prices: {raw:11}, process: {},
      facts: { raw: 'Pyrite is an iron sulfide mineral famous for its metallic lustre and nickname: fool’s gold.' }
    },
    hematite: {
      name: 'Hematite', subtitle: 'Iron ore → Iron', family: 'ore', wing: 'ores', iconClass: 'ore hematite',
      signature: { id: 'iron-oxide', label: 'Iron oxide', formula: 'Fe₂O₃' },
      stages: ['ore','refined'], stageLabels: {ore:'Hematite ore',refined:'Iron'}, prices: {ore:6,refined:12},
      process: {ore:'refined'}, processLabels: {ore:'Refine to iron'},
      facts: {
        ore: 'Hematite is iron oxide and one of the world’s most important ores of iron.',
        refined: 'Iron extracted from ore became one of the most important metals in tools, structures, and machines.'
      }
    },
    chalcopyrite: {
      name: 'Chalcopyrite', subtitle: 'Copper ore → Copper', family: 'ore', wing: 'ores', iconClass: 'ore chalcopyrite',
      signature: { id: 'copper-iron-sulfide', label: 'Copper iron sulfide', formula: 'CuFeS₂' },
      stages: ['ore','refined'], stageLabels: {ore:'Chalcopyrite ore',refined:'Copper'}, prices: {ore:7,refined:15},
      process: {ore:'refined'}, processLabels: {ore:'Refine to copper'},
      facts: {
        ore: 'Chalcopyrite is a copper iron sulfide and one of the most widespread copper-bearing minerals.',
        refined: 'Copper is valued for conductivity, corrosion resistance, and its ability to be worked into useful shapes.'
      }
    },
    trilobite: {
      name: 'Trilobite', subtitle: 'Fossil arthropod', family: 'fossil', wing: 'fossils', iconClass: 'round trilobite', iconText: '≋',
      stages: ['found'], stageLabels: {found:'Fossil specimen'}, prices: {found:40}, process: {},
      facts: { found: 'Trilobites were marine arthropods that lived for hundreds of millions of years and disappeared in the end-Permian mass extinction.' }
    },
    miningTag: {
      name: 'Mining Tag', subtitle: 'Historical mine check', family: 'artifact', wing: 'history', iconClass: 'tag mining-tag', iconText: '#',
      stages: ['found'], stageLabels: {found:'Historical artifact'}, prices: {found:50}, process: {},
      facts: { found: 'Some mines used numbered tags or checks to help track who was underground. Systems varied from one operation to another.' }
    }
  };

  const WINGS = [
    {id:'minerals',name:'Mineral Hall'},
    {id:'ores',name:'Ores & Metals'},
    {id:'fossils',name:'Fossil Wing'},
    {id:'history',name:'History Wing'}
  ];

  const DEPTHS = {
    1:{name:'Upper Seam',materials:{quartz:42,amethyst:22,hematite:20,chalcopyrite:16},sideFinds:[{key:'miningTag',weight:75},{key:'trilobite',weight:25}]},
    2:{name:'Lower Works',materials:{quartz:20,amethyst:14,hematite:14,chalcopyrite:14,garnet:14,topaz:11,pyrite:13},sideFinds:[{key:'trilobite',weight:72},{key:'miningTag',weight:28}]}
  };

  const DURABILITY_LEVELS = [
    {swings:28,cost:60,label:'Basic pick'},
    {swings:34,cost:140,label:'Reinforced handle'},
    {swings:40,cost:320,label:'Steel pick'},
    {swings:48,cost:null,label:'Geologist’s pick'}
  ];

  const SURVEY_LEVELS = [
    {name:'None',cost:75,next:'Field Scanner',description:'Unlocks a 3×3 area scanner. Early scans report chemical signatures rather than exact gem names.'},
    {name:'Field Scanner',cost:160,next:'Spectral Scanner',description:'Reports chemical signatures and signal strength inside the selected 3×3 area.'},
    {name:'Spectral Scanner',cost:360,next:'Mineral Analyzer',description:'Adds deposit-pattern information and notices unusual non-mineral signatures.'},
    {name:'Mineral Analyzer',cost:null,next:null,description:'Identifies exact minerals and distinguishes fossil signatures from historical objects.'}
  ];

  const SCAN_CHARGE_LEVELS = [
    {uses:1,cost:80,label:'1 scan per face'},
    {uses:2,cost:170,label:'2 scans per face'},
    {uses:3,cost:340,label:'3 scans per face'},
    {uses:4,cost:null,label:'4 scans per face'}
  ];

  const WORKSHOP_LEVELS = [
    {name:'Basic Workshop',cost:180,next:'Precision Workshop',description:'Handles quartz, amethyst, iron ore, and copper ore.'},
    {name:'Precision Workshop',cost:null,next:null,description:'Can also process garnet and topaz. Processing remains free.'}
  ];

  const DEPTH_UPGRADE = {cost:225,description:'Unlocks Depth 2: the Lower Works, adding garnet, topaz, and pyrite.'};
  const AUTOMATION_UPGRADE = {cost:160,description:'Unlocks Auto-process. New finds are processed as far as your equipment allows while reserving undonated museum specimens.'};

  const emptyInventory = () => Object.fromEntries(Object.entries(MATERIALS).map(([k,m]) => [k,Object.fromEntries(m.stages.map(s => [s,0]))]));
  const emptyCollection = () => Object.fromEntries(Object.entries(MATERIALS).map(([k,m]) => [k,Object.fromEntries(m.stages.map(s => [s,false]))]));
  const emptyStats = () => Object.fromEntries(Object.keys(MATERIALS).map(k => [k,{found:0,sold:0,donated:0,processed:0,earned:0}]));
  const emptyMastery = () => Object.fromEntries(Object.entries(MATERIALS).filter(([,m]) => m.mastery).map(([k]) => [k,false]));

  const defaultState = () => ({
    credits:0,
    sound:true,
    unlockedDepth:1,
    currentDepth:1,
    upgrades:{durability:0,surveying:0,workshop:0,scannerUses:0,automation:0},
    settings:{autoProcess:false},
    inventory:emptyInventory(),
    collection:emptyCollection(),
    stats:emptyStats(),
    masteryClaimed:emptyMastery(),
    face:null
  });

  let state = loadState();
  let openWorkbenchKey = null;
  let toastTimer = null;
  let audioContext = null;
  let scanMode = false;
  let activePanel = 'mine';
  const museumSelection = {};

  const $ = id => document.getElementById(id);
  const els = {
    depthName:$('depthName'), depthNumber:$('depthNumber'), durability:$('durability'), maxDurability:$('maxDurability'), durabilityMeter:$('durabilityMeter'),
    surveyLevel:$('surveyLevel'), scanUseSummary:$('scanUseSummary'), mineBalance:$('mineBalance'), depthSelector:$('depthSelector'), surveyTitle:$('surveyTitle'), surveyReport:$('surveyReport'), scanButton:$('scanButton'),
    mineBoard:$('mineBoard'), faceFinds:$('faceFinds'), newFaceButton:$('newFaceButton'), surfaceButton:$('surfaceButton'), mineMessage:$('mineMessage'),
    automationPanel:$('automationPanel'), workbenchList:$('workbenchList'), workbenchBadge:$('workbenchBadge'),
    museumWings:$('museumWings'), museumCount:$('museumCount'), museumMeter:$('museumMeter'),
    shopBalance:$('shopBalance'), upgradeList:$('upgradeList'), soundToggle:$('soundToggle'), resetButton:$('resetButton'), toast:$('toast'),
    mobileMineHud:$('mobileMineHud'), mobileDurability:$('mobileDurability'), mobileScans:$('mobileScans')
  };

  init();

  function init(){
    if(!state.face || state.face.depth !== state.currentDepth){
      state.face = generateFace(state.currentDepth);
    } else {
      normalizeFace(state.face);
    }

    const retroReward = applyRetroMasteryRewards();
    saveState();

    document.querySelectorAll('.nav-button').forEach(btn => btn.addEventListener('click',() => switchPanel(btn)));
    els.newFaceButton.addEventListener('click',startNewFace);
    els.surfaceButton.addEventListener('click',startNewFace);
    els.scanButton.addEventListener('click',toggleScanMode);
    els.soundToggle.addEventListener('click',() => {state.sound=!state.sound;saveState();renderSoundButton();if(state.sound)playTone('soft');});
    els.resetButton.addEventListener('click',resetGame);

    renderAll();
    if(retroReward > 0) showToast(`Museum mastery rewards added: ${formatMoney(retroReward)} ✦`);
  }

  function loadState(){
    try{
      const raw = localStorage.getItem(SAVE_KEY);
      if(!raw) return defaultState();

      const parsed = JSON.parse(raw);
      const fresh = defaultState();
      const merged = {
        ...fresh,
        ...parsed,
        upgrades:{...fresh.upgrades,...(parsed.upgrades||{})},
        settings:{...fresh.settings,...(parsed.settings||{})},
        inventory:fresh.inventory,
        collection:fresh.collection,
        stats:fresh.stats,
        masteryClaimed:{...fresh.masteryClaimed,...(parsed.masteryClaimed||{})}
      };

      Object.entries(MATERIALS).forEach(([k,m]) => {
        m.stages.forEach(stage => {
          merged.inventory[k][stage] = parsed.inventory?.[k]?.[stage] ?? 0;
          merged.collection[k][stage] = parsed.collection?.[k]?.[stage] ?? false;
        });
        merged.stats[k] = {...fresh.stats[k],...(parsed.stats?.[k]||{})};
      });

      return merged;
    }catch{
      return defaultState();
    }
  }

  function saveState(){ localStorage.setItem(SAVE_KEY,JSON.stringify(state)); }
  function formatMoney(cents){ const v=Math.max(0,Math.round(cents||0)); return v<100?`${v}¢`:`$${(v/100).toFixed(2)}`; }
  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
  function totalInventory(k){ return Object.values(state.inventory[k]||{}).reduce((a,n)=>a+n,0); }
  function totalInventoryAll(){ return Object.keys(MATERIALS).reduce((a,k)=>a+totalInventory(k),0); }

  function weightedChoice(source){
    const entries=Array.isArray(source)?source.map(x=>[x.key,x.weight]):Object.entries(source);
    let total=entries.reduce((a,[,w])=>a+w,0),r=Math.random()*total;
    for(const [k,w] of entries){r-=w;if(r<=0)return k;}
    return entries[entries.length-1][0];
  }

  function neighbors(index){
    const r=Math.floor(index/GRID_SIZE),c=index%GRID_SIZE,out=[];
    [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([rr,cc])=>{if(rr>=0&&rr<GRID_SIZE&&cc>=0&&cc<GRID_SIZE)out.push(rr*GRID_SIZE+cc);});
    return out;
  }

  function scanAreaIndices(index){
    const r=Math.floor(index/GRID_SIZE),c=index%GRID_SIZE,out=[];
    for(let rr=r-1;rr<=r+1;rr++){
      for(let cc=c-1;cc<=c+1;cc++){
        if(rr>=0&&rr<GRID_SIZE&&cc>=0&&cc<GRID_SIZE) out.push(rr*GRID_SIZE+cc);
      }
    }
    return out;
  }

  function currentMaxScans(){ return SCAN_CHARGE_LEVELS[state.upgrades.scannerUses].uses; }

  function normalizeFace(face){
    if(!Array.isArray(face.hints)) face.hints = generateProspectHints(face);
    if(!Array.isArray(face.scanHistory)) face.scanHistory = [];
    if(face.lastScan === undefined) face.lastScan = null;
    if(face.scanUsesRemaining === undefined || face.scanUsesRemaining === null){
      face.scanUsesRemaining = state.upgrades.surveying > 0 ? currentMaxScans() : 0;
    }
    if(!face.finds) face.finds = {};
  }

  function generateProspectHints(face){
    const count = randInt(1,3);
    const chosen = new Set();
    const geologicalTiles = face.tiles.filter(t => t.material && MATERIALS[t.material] && !['fossil','artifact'].includes(MATERIALS[t.material].family));

    for(let i=0;i<count;i++){
      let candidate = null;
      const shouldBeUseful = geologicalTiles.length && Math.random() < .82;

      if(shouldBeUseful){
        const target = geologicalTiles[randInt(0,geologicalTiles.length-1)].index;
        const nearby = [target,...neighbors(target)];
        candidate = nearby[randInt(0,nearby.length-1)];
      }else{
        candidate = randInt(0,face.tiles.length-1);
      }

      let guard = 0;
      while(chosen.has(candidate) && guard < 30){
        candidate = randInt(0,face.tiles.length-1);
        guard++;
      }
      chosen.add(candidate);
    }

    return [...chosen];
  }

  function generateFace(depth){
    const tiles=Array.from({length:GRID_SIZE*GRID_SIZE},(_,i)=>({index:i,revealed:false,material:null,depositId:null,depositType:null}));
    const deposits=[];
    let nextId=0;

    function placeDeposit(material,size,type){
      for(let attempt=0;attempt<80;attempt++){
        const empty=tiles.filter(t=>!t.material);
        if(!empty.length)return false;
        const chosen=[empty[randInt(0,empty.length-1)].index],set=new Set(chosen);

        while(chosen.length<size){
          const frontier=[];
          chosen.forEach(i=>neighbors(i).forEach(n=>{if(!set.has(n)&&!tiles[n].material&&!frontier.includes(n))frontier.push(n);}));
          if(!frontier.length)break;
          const n=frontier[randInt(0,frontier.length-1)];
          chosen.push(n);set.add(n);
        }

        if(chosen.length!==size)continue;
        const id=`d${nextId++}`;
        chosen.forEach(i=>Object.assign(tiles[i],{material,depositId:id,depositType:type}));
        deposits.push({id,material,type,size,announced:false});
        return true;
      }
      return false;
    }

    const cfg=DEPTHS[depth];
    placeDeposit(weightedChoice(cfg.materials),randInt(5,8),'large');
    for(let i=0;i<randInt(3,4);i++)placeDeposit(weightedChoice(cfg.materials),randInt(2,4),'small');
    for(let i=0;i<randInt(3,5);i++)placeDeposit(weightedChoice(cfg.materials),1,'isolated');
    if(Math.random()<.24)placeDeposit(weightedChoice(cfg.sideFinds),1,'side');
    if(Math.random()<.045)placeDeposit(weightedChoice(cfg.sideFinds),1,'side');

    const face={
      depth,
      size:GRID_SIZE,
      durability:DURABILITY_LEVELS[state.upgrades.durability].swings,
      finds:{},
      tiles,
      deposits,
      hints:[],
      scanUsesRemaining:state.upgrades.surveying>0?currentMaxScans():0,
      scanHistory:[],
      lastScan:null
    };
    face.hints=generateProspectHints(face);
    return face;
  }

  function switchPanel(btn){
    const target=btn.dataset.target;
    activePanel=target;
    scanMode=false;
    document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b===btn));
    document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===target));
    if(target==='workbench')renderWorkbench();
    if(target==='museum')renderMuseum();
    if(target==='upgrades')renderUpgrades();
    renderMobileHud();
  }

  function startNewFace(){
    scanMode=false;
    state.face=generateFace(state.currentDepth);
    saveState();
    setMineMessage('⛏️','Fresh rock face.','Look for faint geological tells, spend your scans where they matter, then start crunching.');
    playTone('soft');
    renderMine();
    showToast('Fresh rock face.');
  }

  function setDepth(d){
    if(d>state.unlockedDepth||d===state.currentDepth)return;
    scanMode=false;
    state.currentDepth=d;
    state.face=generateFace(d);
    saveState();
    renderMine();
    showToast(`${DEPTHS[d].name} selected.`);
  }

  function toggleScanMode(){
    if(state.upgrades.surveying===0){ showToast('Unlock the Field Scanner first.'); return; }
    if(state.face.scanUsesRemaining<=0){ showToast('No scans left on this rock face.'); return; }
    scanMode=!scanMode;
    if(scanMode){
      setMineMessage('⌁','Scanner ready.','Tap any tile to analyze the 3×3 area around it. Scanning does not use pick durability.');
    }else{
      setMineMessage('⛏️','Scanner cancelled.','Back to mining.');
    }
    renderMine();
  }

  function handleTile(index){
    if(scanMode){ scanAt(index); return; }
    mineTile(index);
  }

  function scanAt(index){
    if(state.upgrades.surveying===0 || state.face.scanUsesRemaining<=0)return;
    const indices=scanAreaIndices(index);
    const results=analyzeScan(indices,state.upgrades.surveying);
    state.face.scanUsesRemaining--;
    state.face.scanHistory.push(index);
    state.face.lastScan={center:index,indices,results};
    scanMode=false;
    saveState();
    playTone('soft');
    setMineMessage('⌁','Scan complete.',results.length?results[0].plain:'No significant signature detected.');
    renderMine();
  }

  function signalStrength(count){
    if(count>=4)return 'Strong';
    if(count>=2)return 'Moderate';
    return 'Trace';
  }

  function depositPattern(types){
    if(types.has('large'))return 'large connected deposit pattern';
    if(types.has('small'))return 'small connected deposit pattern';
    if(types.has('isolated'))return 'isolated signature';
    return 'localized signature';
  }

  function analyzeScan(indices,level){
    const tiles=indices.map(i=>state.face.tiles[i]).filter(t=>t&&t.material);
    if(!tiles.length) return [{html:'No significant mineral signature detected.',plain:'No significant mineral signature detected.'}];

    const results=[];
    const sideTiles=tiles.filter(t=>['fossil','artifact'].includes(MATERIALS[t.material].family));
    const geoTiles=tiles.filter(t=>!['fossil','artifact'].includes(MATERIALS[t.material].family));

    if(level<3){
      const groups=new Map();
      geoTiles.forEach(tile=>{
        const m=MATERIALS[tile.material],sig=m.signature;
        if(!groups.has(sig.id))groups.set(sig.id,{sig,count:0,types:new Set()});
        const g=groups.get(sig.id);g.count++;g.types.add(tile.depositType);
      });

      [...groups.values()].sort((a,b)=>b.count-a.count).forEach(g=>{
        const strength=signalStrength(g.count);
        const chemistry=`${g.sig.label}${g.sig.formula&&g.sig.formula!=='variable'?` · ${g.sig.formula}`:''}`;
        const extra=level>=2?` · ${depositPattern(g.types)}`:'';
        results.push({html:`<strong>${strength}</strong> ${chemistry} signature${extra}`,plain:`${strength} ${chemistry} signature${extra}`});
      });

      if(sideTiles.length){
        const msg=level===1?'Unclassified anomaly detected.':'Unusual non-mineral signature detected.';
        results.push({html:`<strong>${msg}</strong>`,plain:msg});
      }
    }else{
      const groups=new Map();
      geoTiles.forEach(tile=>{
        if(!groups.has(tile.material))groups.set(tile.material,{count:0,types:new Set()});
        const g=groups.get(tile.material);g.count++;g.types.add(tile.depositType);
      });

      [...groups.entries()].sort((a,b)=>b[1].count-a[1].count).forEach(([key,g])=>{
        const strength=signalStrength(g.count);
        const pattern=depositPattern(g.types);
        results.push({html:`<strong>${strength} ${MATERIALS[key].name}</strong> signal · ${pattern}`,plain:`${strength} ${MATERIALS[key].name} signal · ${pattern}`});
      });

      const fossilCount=sideTiles.filter(t=>MATERIALS[t.material].family==='fossil').length;
      const artifactCount=sideTiles.filter(t=>MATERIALS[t.material].family==='artifact').length;
      if(fossilCount)results.push({html:'<strong>Fossil signature detected.</strong>',plain:'Fossil signature detected.'});
      if(artifactCount)results.push({html:'<strong>Historical-object signature detected.</strong>',plain:'Historical-object signature detected.'});
    }

    return results.length?results:[{html:'No significant mineral signature detected.',plain:'No significant mineral signature detected.'}];
  }

  function mineTile(index){
    const face=state.face,tile=face.tiles[index];
    if(!tile||tile.revealed||face.durability<=0)return;

    tile.revealed=true;
    face.durability--;

    if(tile.material){
      collectFind(tile.material);
      face.finds[tile.material]=(face.finds[tile.material]||0)+1;
      const m=MATERIALS[tile.material];
      playTone('gem',tile.material);
      setMineMessage('✦',`${m.name}!`,findMessage(tile.material));
      showToast(`Found ${m.name}!`);
      maybeAnnounceDeposit(tile.depositId);
    }else{
      playTone('crunch');
      setMineMessage('🪨','Crunch.','Nothing in that tile. Pick another spot.');
    }

    if(face.durability<=0){
      setMineMessage('⛏️','Pick worn out.','That face is finished. Return to the surface for a fresh one; there is no recharge timer.');
      showToast('Face finished. No waiting required.');
    }

    saveState();
    renderMine();
    renderWorkbench();
  }

  function collectFind(k){
    const m=MATERIALS[k],stage=m.stages[0];
    state.inventory[k][stage]++;
    state.stats[k].found++;
    if(state.upgrades.automation>0 && state.settings.autoProcess) autoProcessOne(k);
  }

  function museumReserve(k,stage){ return state.collection[k][stage]?0:1; }

  function canProcessMaterial(k){ return state.upgrades.workshop >= (MATERIALS[k].workshopRequired||0); }

  function autoProcessOne(k){
    const m=MATERIALS[k];
    if(!canProcessMaterial(k))return;
    let current=m.stages[0];
    let guard=0;

    while(m.process?.[current] && guard<6){
      const next=m.process[current];
      const available=state.inventory[k][current]-museumReserve(k,current);
      if(available<=0)break;
      state.inventory[k][current]--;
      state.inventory[k][next]++;
      state.stats[k].processed++;
      current=next;
      guard++;
    }
  }

  function maybeAnnounceDeposit(id){
    const d=state.face.deposits.find(x=>x.id===id);
    if(!d||d.announced||['isolated','side'].includes(d.type))return;
    const count=state.face.tiles.filter(t=>t.depositId===id&&t.revealed).length;
    const threshold=d.type==='large'?3:2;
    if(count>=threshold){
      d.announced=true;
      showToast(`${d.type==='large'?'Rich vein':'Vein'} discovered: ${MATERIALS[d.material].name}`);
    }
  }

  function findMessage(k){
    return ({
      quartz:'A quartz specimen. Common does not mean useless.',
      amethyst:'Purple quartz. There may be more nearby.',
      hematite:'Hematite: an iron ore. Refine it or keep the natural specimen.',
      chalcopyrite:'Chalcopyrite: a copper-bearing ore.',
      garnet:'A garnet specimen from the Lower Works.',
      topaz:'Topaz. Hard, bright, and worth handling carefully.',
      pyrite:'Pyrite. Metallic, brassy, and absolutely not failed gold.',
      trilobite:'A fossil! The Fossil Wing would like a word.',
      miningTag:'A historical mining tag. Someone worked this ground before you.'
    })[k]||'Something interesting came out of the rock.';
  }

  function setMineMessage(icon,title,body){
    els.mineMessage.innerHTML=`<span class="message-icon">${icon}</span><div><strong>${title}</strong><p>${body}</p></div>`;
  }

  function renderAll(){
    renderMine();
    renderWorkbench();
    renderMuseum();
    renderUpgrades();
    renderSoundButton();
    renderWorkbenchBadge();
    renderMobileHud();
  }

  function renderMine(){
    const f=state.face,max=DURABILITY_LEVELS[state.upgrades.durability].swings;
    els.depthName.textContent=DEPTHS[state.currentDepth].name;
    els.depthNumber.textContent=`Depth ${state.currentDepth}`;
    els.durability.textContent=f.durability;
    els.maxDurability.textContent=max;
    els.durabilityMeter.style.width=`${Math.max(0,f.durability/max*100)}%`;
    els.surveyLevel.textContent=SURVEY_LEVELS[state.upgrades.surveying].name;
    els.mineBalance.textContent=formatMoney(state.credits);

    if(state.upgrades.surveying>0){
      els.scanUseSummary.textContent=`${f.scanUsesRemaining}/${currentMaxScans()} scans left`;
    }else{
      els.scanUseSummary.textContent='locked';
    }

    renderDepthSelector();
    renderSurvey();
    renderBoard();
    renderFaceFinds();
    renderMobileHud();
  }

  function renderDepthSelector(){
    els.depthSelector.innerHTML='';
    Object.keys(DEPTHS).forEach(x=>{
      const d=Number(x),b=document.createElement('button');
      b.type='button';
      b.className=`depth-chip ${d===state.currentDepth?'active':''}`;
      b.disabled=d>state.unlockedDepth;
      b.textContent=d<=state.unlockedDepth?`Depth ${d} · ${DEPTHS[d].name}`:`Depth ${d} · Locked`;
      b.addEventListener('click',()=>setDepth(d));
      els.depthSelector.appendChild(b);
    });
  }

  function renderSurvey(){
    const level=state.upgrades.surveying,f=state.face;
    els.surveyReport.innerHTML='';
    els.scanButton.classList.toggle('active',scanMode);

    if(level===0){
      els.surveyTitle.textContent='No scanner equipment';
      els.scanButton.textContent='Locked';
      els.scanButton.disabled=true;
      els.surveyReport.innerHTML='<span class="survey-pill">The mine still gives you a few faint visual tells. Upgrade Surveying to analyze a 3×3 area.</span>';
      return;
    }

    els.scanButton.disabled=f.scanUsesRemaining<=0;
    els.scanButton.textContent=scanMode?'Cancel scan':(f.scanUsesRemaining>0?'Scan area':'No scans left');

    if(scanMode){
      els.surveyTitle.textContent=`Tap a tile · ${f.scanUsesRemaining} scan${f.scanUsesRemaining===1?'':'s'} left`;
      els.surveyReport.innerHTML='<span class="survey-pill">The scanner will analyze that tile and its neighbours in a 3×3 area.</span>';
      return;
    }

    els.surveyTitle.textContent=`${SURVEY_LEVELS[level].name} · ${f.scanUsesRemaining}/${currentMaxScans()} scans left`;

    if(!f.lastScan){
      const msg=level<3
        ? 'No area scanned yet. Early scanner levels report chemistry, not exact gem names.'
        : 'No area scanned yet. This analyzer can identify exact minerals and unusual signatures.';
      els.surveyReport.innerHTML=`<span class="survey-pill">${msg}</span>`;
      return;
    }

    f.lastScan.results.forEach(result=>{
      const line=document.createElement('div');
      line.className='scan-result-line';
      line.innerHTML=result.html;
      els.surveyReport.appendChild(line);
    });
  }

  function buildIcon(key,forTile=false,stage=null){
    const m=MATERIALS[key],span=document.createElement('span');
    if(!forTile)span.classList.add('material-icon');
    m.iconClass.split(' ').forEach(c=>span.classList.add(c));
    if(!forTile&&stage==='refined'&&key==='hematite'){span.classList.remove('hematite');span.classList.add('iron');}
    if(!forTile&&stage==='refined'&&key==='chalcopyrite'){span.classList.remove('chalcopyrite');span.classList.add('copper');}
    if(forTile&&m.family==='mineral')span.classList.add('gem');
    if(forTile&&m.family==='ore')span.classList.add('ore');
    if(m.iconText)span.textContent=m.iconText;
    return span;
  }

  function renderBoard(){
    els.mineBoard.innerHTML='';
    const lastScan=new Set(state.face.lastScan?.indices||[]);
    const hints=new Set(state.face.hints||[]);

    state.face.tiles.forEach(t=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='rock';
      b.setAttribute('aria-label',`Mine tile ${t.index+1}`);

      if(lastScan.has(t.index))b.classList.add('scan-area');
      if(scanMode)b.classList.add('scan-selectable');

      if(t.revealed){
        b.classList.add('revealed');
        if(t.material){
          b.classList.add('find');
          const i=buildIcon(t.material,true);i.classList.remove('material-icon');i.classList.add('tile-find');b.appendChild(i);
          b.setAttribute('aria-label',`Revealed ${MATERIALS[t.material].name}`);
        }else{
          b.classList.add('empty');
          b.setAttribute('aria-label','Revealed empty rock');
        }
        if(!scanMode)b.disabled=true;
      }else{
        if(hints.has(t.index)){
          const mark=document.createElement('span');mark.className='prospect-mark';mark.setAttribute('aria-hidden','true');b.appendChild(mark);
        }
        b.disabled=!scanMode && state.face.durability<=0;
      }

      if(!b.disabled)b.addEventListener('click',()=>handleTile(t.index));
      els.mineBoard.appendChild(b);
    });
  }

  function renderFaceFinds(){
    const list=Object.entries(state.face.finds).filter(([,n])=>n>0).map(([k,n])=>`${n} ${MATERIALS[k].name}`);
    els.faceFinds.textContent=list.length?list.join(' · '):'Nothing yet';
  }

  function renderMobileHud(){
    if(!els.mobileMineHud)return;
    els.mobileMineHud.classList.toggle('hidden',activePanel!=='mine');
    const max=DURABILITY_LEVELS[state.upgrades.durability].swings;
    els.mobileDurability.textContent=`⛏️ ${state.face.durability} / ${max}`;
    els.mobileScans.textContent=state.upgrades.surveying>0?`⌁ ${state.face.scanUsesRemaining} / ${currentMaxScans()}`:'⌁ locked';
  }

  function renderWorkbench(){
    renderAutomationPanel();
    els.workbenchList.innerHTML='';

    Object.entries(MATERIALS).forEach(([k,m])=>{
      const stock=totalInventory(k);
      const card=document.createElement('article');
      card.className=`workbench-card ${openWorkbenchKey===k?'open':''} ${stock>0?'has-stock':''}`;

      const toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='accordion-toggle';
      toggle.setAttribute('aria-expanded',openWorkbenchKey===k?'true':'false');
      toggle.appendChild(buildIcon(k));

      const main=document.createElement('div');
      main.className='accordion-main';
      const sparkle=stock>0?`<span class="inventory-sparkle">✦ ${stock} in inventory</span>`:'';
      main.innerHTML=`<h3>${m.name}${sparkle}</h3><div class="summary-chips">${m.stages.map(s=>`<span class="summary-chip">${m.stageLabels[s]} ${state.inventory[k][s]} · ${formatMoney(m.prices[s])}</span>`).join('')}</div>`;
      toggle.appendChild(main);

      const chev=document.createElement('span');
      chev.className='chevron';chev.textContent='⌄';toggle.appendChild(chev);
      toggle.addEventListener('click',()=>{openWorkbenchKey=openWorkbenchKey===k?null:k;renderWorkbench();});
      card.appendChild(toggle);

      const details=document.createElement('div');
      details.className='workbench-details';
      details.innerHTML=workbenchDetails(k);
      card.appendChild(details);
      els.workbenchList.appendChild(card);
    });

    els.workbenchList.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',workbenchAction));
    renderWorkbenchBadge();
  }

  function renderAutomationPanel(){
    if(state.upgrades.automation>0){
      els.automationPanel.innerHTML=`<div class="automation-card"><div><span class="status-label">Automation</span><strong>Auto-process</strong><p>New finds move through the highest processing stage your equipment can handle. One undonated museum specimen is always reserved at each stage.</p></div><button id="autoProcessToggle" class="toggle-switch ${state.settings.autoProcess?'on':''}" type="button" aria-label="Toggle auto-process" aria-pressed="${state.settings.autoProcess?'true':'false'}"></button></div>`;
      $('autoProcessToggle').addEventListener('click',()=>{
        state.settings.autoProcess=!state.settings.autoProcess;
        saveState();
        renderWorkbench();
        showToast(`Auto-process ${state.settings.autoProcess?'on':'off'}.`);
      });
    }else{
      els.automationPanel.innerHTML='<div class="automation-card locked"><div><span class="status-label">Automation</span><strong>Auto-process locked</strong><p>Available as an upgrade. Manual processing stays free.</p></div><span>🔒</span></div>';
    }
  }

  function workbenchDetails(k){
    const m=MATERIALS[k],s=state.stats[k];
    const rows=m.stages.map(stage=>{
      const count=state.inventory[k][stage],next=m.process?.[stage],can=canProcessMaterial(k),donated=state.collection[k][stage];
      const reserve=donated?0:1;
      const safeSell=Math.max(0,count-reserve);
      const sellAllLabel=donated?`Sell all (${count})`:`Sell all extras (${safeSell})`;
      return `<div class="stage-row"><div class="stage-copy"><strong>${m.stageLabels[stage]} · ${count} owned</strong><span>${formatMoney(m.prices[stage])} each</span>${next&&!can?'<span class="process-lock">Needs Precision Workshop</span>':''}${!donated&&count>0?'<span class="sell-all-note">Sell All reserves one copy for the empty museum slot. The single Sell button can still sell that last copy if you choose.</span>':''}</div><div class="stage-actions">${next?`<button class="mini-button accent" data-action="process" data-material="${k}" data-stage="${stage}" ${count<1||!can?'disabled':''}>${m.processLabels[stage]}</button>`:''}<button class="mini-button donate" data-action="donate" data-material="${k}" data-stage="${stage}" ${count<1||donated?'disabled':''}>${donated?'In museum':'Donate'}</button><button class="mini-button" data-action="sell" data-material="${k}" data-stage="${stage}" ${count<1?'disabled':''}>Sell ${formatMoney(m.prices[stage])}</button><button class="mini-button" data-action="sell-all" data-material="${k}" data-stage="${stage}" ${safeSell<1?'disabled':''}>${sellAllLabel}</button></div></div>`;
    }).join('');

    return `<p class="material-subtitle">${m.subtitle}</p><div class="stats-grid"><div class="stat-box"><span>Found</span><strong>${s.found}</strong></div><div class="stat-box"><span>Sold</span><strong>${s.sold}</strong></div><div class="stat-box"><span>Donated</span><strong>${s.donated}</strong></div><div class="stat-box"><span>Processed</span><strong>${s.processed}</strong></div><div class="stat-box"><span>Earned</span><strong>${formatMoney(s.earned)}</strong></div></div>${rows}`;
  }

  function workbenchAction(e){
    const b=e.currentTarget,k=b.dataset.material,stage=b.dataset.stage;
    if(b.dataset.action==='process')processOne(k,stage);
    if(b.dataset.action==='donate')donateOne(k,stage);
    if(b.dataset.action==='sell')sellOne(k,stage);
    if(b.dataset.action==='sell-all')sellAllSafe(k,stage);
  }

  function processOne(k,stage){
    const m=MATERIALS[k],next=m.process?.[stage];
    if(!next||!canProcessMaterial(k)||state.inventory[k][stage]<1)return;
    state.inventory[k][stage]--;
    state.inventory[k][next]++;
    state.stats[k].processed++;
    saveState();
    playTone('process');
    renderWorkbench();
    showToast(`${m.name}: ${m.stageLabels[stage]} → ${m.stageLabels[next]}`);
  }

  function donateOne(k,stage){
    if(state.collection[k][stage]||state.inventory[k][stage]<1)return;
    state.inventory[k][stage]--;
    state.collection[k][stage]=true;
    state.stats[k].donated++;
    museumSelection[k]=stage;
    const mastery=awardMastery(k);
    saveState();
    playTone('collection',k);
    renderAll();
    if(mastery){
      showToast(`${MATERIALS[k].name} mastered! +${formatMoney(mastery)} ✦`);
    }else{
      showToast(`${MATERIALS[k].name} added to the museum ✦`);
    }
  }

  function sellOne(k,stage){
    if(state.inventory[k][stage]<1)return;
    const value=MATERIALS[k].prices[stage];
    state.inventory[k][stage]--;
    state.credits+=value;
    state.stats[k].sold++;
    state.stats[k].earned+=value;
    saveState();
    playTone('coin');
    renderAll();
    showToast(`Sold for ${formatMoney(value)}.`);
  }

  function sellAllSafe(k,stage){
    const count=state.inventory[k][stage];
    const reserve=state.collection[k][stage]?0:1;
    const qty=Math.max(0,count-reserve);
    if(qty<1)return;
    const value=qty*MATERIALS[k].prices[stage];
    state.inventory[k][stage]-=qty;
    state.credits+=value;
    state.stats[k].sold+=qty;
    state.stats[k].earned+=value;
    saveState();
    playTone('coin');
    renderAll();
    showToast(`Sold ${qty} for ${formatMoney(value)}.`);
  }

  function renderWorkbenchBadge(){
    const hasAnything=totalInventoryAll()>0;
    els.workbenchBadge.hidden=!hasAnything;
  }

  function isMastered(k){
    const m=MATERIALS[k];
    return !!m.mastery && m.stages.every(stage=>state.collection[k][stage]);
  }

  function awardMastery(k){
    const m=MATERIALS[k];
    if(!m.mastery || !isMastered(k) || state.masteryClaimed[k])return 0;
    state.masteryClaimed[k]=true;
    state.credits+=m.mastery.reward;
    return m.mastery.reward;
  }

  function applyRetroMasteryRewards(){
    let total=0;
    Object.entries(MATERIALS).forEach(([k,m])=>{
      if(m.mastery && isMastered(k) && !state.masteryClaimed[k]){
        state.masteryClaimed[k]=true;
        state.credits+=m.mastery.reward;
        total+=m.mastery.reward;
      }
    });
    return total;
  }

  function renderMuseum(highlightK=null,highlightStage=null){
    if(highlightK&&highlightStage)museumSelection[highlightK]=highlightStage;
    els.museumWings.innerHTML='';
    let filledTotal=0;
    const total=Object.values(MATERIALS).reduce((a,m)=>a+m.stages.length,0);

    WINGS.forEach(w=>{
      const pairs=Object.entries(MATERIALS).filter(([,m])=>m.wing===w.id);
      let wf=0,wt=0;
      pairs.forEach(([k,m])=>{wt+=m.stages.length;wf+=m.stages.filter(s=>state.collection[k][s]).length;});
      filledTotal+=wf;

      const wing=document.createElement('section');
      wing.className='museum-wing';
      wing.innerHTML=`<div class="wing-heading"><h3>${w.name}</h3><span>${wf} / ${wt} filled</span></div>`;

      pairs.forEach(([k,m])=>{
        const group=document.createElement('div');
        group.className='museum-group';
        const gf=m.stages.filter(s=>state.collection[k][s]).length;
        const mastered=isMastered(k);
        group.innerHTML=`<div class="museum-group-title"><strong>${m.name}${mastered?'<span class="mastery-badge">✦ Mastered</span>':''}</strong><span>${gf} / ${m.stages.length}</span></div>`;

        const slots=document.createElement('div');
        slots.className=`museum-slots ${m.stages.length>=3?'compact-three':m.stages.length===2?'compact-two':'compact-one'}`;

        m.stages.forEach(stage=>{
          const filled=state.collection[k][stage];
          const slot=document.createElement('button');
          slot.type='button';
          slot.className=`museum-slot compact ${filled?'filled':''} ${filled&&museumSelection[k]===stage?'selected':''} ${filled&&k===highlightK&&stage===highlightStage?'new-fill':''}`;
          slot.disabled=!filled;
          const visual=document.createElement('div');
          visual.className='slot-visual';
          visual.appendChild(buildIcon(k,false,stage));
          slot.appendChild(visual);
          slot.insertAdjacentHTML('beforeend',`<strong class="slot-stage">${m.stageLabels[stage]}</strong><span class="slot-state">${filled?'Collected':'Not collected'}</span>`);
          if(filled)slot.addEventListener('click',()=>{museumSelection[k]=stage;renderMuseum();});
          slots.appendChild(slot);
        });

        group.appendChild(slots);

        const selected=museumSelection[k];
        const selectedValid=selected&&state.collection[k][selected];
        const fact=document.createElement('div');
        fact.className='museum-fact-panel';
        if(selectedValid){
          fact.innerHTML=`<strong>${m.stageLabels[selected]}</strong><p>${m.facts[selected]}</p>`;
        }else if(gf>0){
          fact.innerHTML='<strong>Specimen facts</strong><p>Tap a collected specimen above to read its fact.</p>';
        }else{
          fact.innerHTML='<strong>Empty display</strong><p>Donate a specimen to unlock its fact.</p>';
        }
        group.appendChild(fact);

        if(mastered&&m.mastery){
          const mastery=document.createElement('div');
          mastery.className='mastery-panel';
          mastery.innerHTML=`<strong>✦ Mineral Mastery · ${formatMoney(m.mastery.reward)} collection reward</strong><p>${m.mastery.fact}</p>`;
          group.appendChild(mastery);
        }

        wing.appendChild(group);
      });

      els.museumWings.appendChild(wing);
    });

    els.museumCount.textContent=`${filledTotal} / ${total}`;
    els.museumMeter.style.width=`${filledTotal/total*100}%`;
  }

  function renderUpgrades(){
    els.shopBalance.textContent=formatMoney(state.credits);
    els.upgradeList.innerHTML='';
    [depthCard(),durabilityCard(),surveyCard(),scannerUsesCard(),workshopCard(),automationCard()].forEach(c=>els.upgradeList.appendChild(c));
  }

  function upgradeCard({icon,eyebrow,title,description,current,cost,label,disabled,onClick}){
    const card=document.createElement('article');
    card.className='upgrade-card';
    card.innerHTML=`<div class="upgrade-icon">${icon}</div><div class="upgrade-copy"><span class="status-label">${eyebrow}</span><h3>${title}</h3><p>${description}</p><span class="upgrade-current">${current}</span></div><div class="upgrade-action"><span class="price-tag">${cost===null?'MAX':formatMoney(cost)}</span><button class="primary-button" type="button" ${disabled?'disabled':''}>${label}</button></div>`;
    const b=card.querySelector('button');
    if(!disabled&&onClick)b.addEventListener('click',onClick);
    return card;
  }

  function depthCard(){
    const max=state.unlockedDepth>=2;
    return upgradeCard({icon:'🪜',eyebrow:'Mine depth',title:max?'Lower Works unlocked':'Unlock Depth 2',description:max?'Both prototype depths are available.':DEPTH_UPGRADE.description,current:max?'Depths 1–2 available':'Current: Depth 1 only',cost:max?null:DEPTH_UPGRADE.cost,label:max?'Prototype max':'Go deeper',disabled:max||state.credits<DEPTH_UPGRADE.cost,onClick:buyDepth});
  }

  function durabilityCard(){
    const i=state.upgrades.durability,cur=DURABILITY_LEVELS[i],max=cur.cost===null,next=max?null:DURABILITY_LEVELS[i+1];
    return upgradeCard({icon:'⛏️',eyebrow:'Pick durability',title:max?cur.label:`${cur.swings} → ${next.swings} swings`,description:max?'The strongest pick in this prototype.':'More swings per rock face. No energy or recharge timer.',current:`Current: ${cur.label} · ${cur.swings} swings`,cost:cur.cost,label:max?'Prototype max':'Upgrade pick',disabled:max||state.credits<cur.cost,onClick:buyDurability});
  }

  function surveyCard(){
    const cur=SURVEY_LEVELS[state.upgrades.surveying],max=cur.cost===null;
    return upgradeCard({icon:'⌁',eyebrow:'Scanner analysis',title:max?cur.name:`Unlock ${cur.next}`,description:cur.description,current:`Current: ${cur.name}`,cost:cur.cost,label:max?'Prototype max':'Upgrade scanner',disabled:max||state.credits<cur.cost,onClick:buySurvey});
  }

  function scannerUsesCard(){
    const cur=SCAN_CHARGE_LEVELS[state.upgrades.scannerUses],max=cur.cost===null,next=max?null:SCAN_CHARGE_LEVELS[state.upgrades.scannerUses+1];
    const scannerLocked=state.upgrades.surveying===0;
    return upgradeCard({
      icon:'📡',
      eyebrow:'Scanner charges',
      title:max?cur.label:`${cur.uses} → ${next.uses} scans per face`,
      description:scannerLocked?'Unlock the Field Scanner first. Scanner charges reset on every fresh rock face.':'Buy more scanner uses per rock face. They reset instantly when you start a fresh face.',
      current:`Current: ${cur.uses} scan${cur.uses===1?'':'s'} per face`,
      cost:max?null:cur.cost,
      label:max?'Prototype max':(scannerLocked?'Scanner locked':'Add scan'),
      disabled:max||scannerLocked||state.credits<cur.cost,
      onClick:buyScannerUse
    });
  }

  function workshopCard(){
    const cur=WORKSHOP_LEVELS[state.upgrades.workshop],max=cur.cost===null;
    return upgradeCard({icon:'🛠️',eyebrow:'Workshop equipment',title:max?cur.name:`Unlock ${cur.next}`,description:cur.description,current:`Current: ${cur.name}`,cost:cur.cost,label:max?'Prototype max':'Upgrade workshop',disabled:max||state.credits<cur.cost,onClick:buyWorkshop});
  }

  function automationCard(){
    const unlocked=state.upgrades.automation>0;
    return upgradeCard({icon:'⚙️',eyebrow:'Automation',title:unlocked?'Auto-process unlocked':'Unlock Auto-process',description:unlocked?'Toggle it from the Workbench. Museum reserves are protected automatically.':AUTOMATION_UPGRADE.description,current:unlocked?`Current: ${state.settings.autoProcess?'ON':'OFF'}`:'Current: manual processing',cost:unlocked?null:AUTOMATION_UPGRADE.cost,label:unlocked?'Unlocked':'Unlock automation',disabled:unlocked||state.credits<AUTOMATION_UPGRADE.cost,onClick:buyAutomation});
  }

  function buyDepth(){
    if(state.unlockedDepth>=2||state.credits<DEPTH_UPGRADE.cost)return;
    state.credits-=DEPTH_UPGRADE.cost;
    state.unlockedDepth=2;
    state.currentDepth=2;
    state.face=generateFace(2);
    saveState();playTone('upgrade');renderAll();showToast('Depth 2 unlocked: Lower Works.');
  }

  function buyDurability(){
    const i=state.upgrades.durability,cur=DURABILITY_LEVELS[i];
    if(cur.cost===null||state.credits<cur.cost)return;
    state.credits-=cur.cost;
    const old=cur.swings;
    state.upgrades.durability++;
    const newer=DURABILITY_LEVELS[state.upgrades.durability].swings;
    state.face.durability=Math.min(newer,state.face.durability+(newer-old));
    saveState();playTone('upgrade');renderAll();showToast(`Pick durability increased to ${newer} swings.`);
  }

  function buySurvey(){
    const cur=SURVEY_LEVELS[state.upgrades.surveying];
    if(cur.cost===null||state.credits<cur.cost)return;
    state.credits-=cur.cost;
    state.upgrades.surveying++;
    if(state.upgrades.surveying===1 && state.face.scanUsesRemaining===0)state.face.scanUsesRemaining=currentMaxScans();
    saveState();playTone('upgrade');renderAll();showToast(`${SURVEY_LEVELS[state.upgrades.surveying].name} unlocked.`);
  }

  function buyScannerUse(){
    const i=state.upgrades.scannerUses,cur=SCAN_CHARGE_LEVELS[i];
    if(state.upgrades.surveying===0||cur.cost===null||state.credits<cur.cost)return;
    state.credits-=cur.cost;
    const oldUses=cur.uses;
    state.upgrades.scannerUses++;
    const newUses=SCAN_CHARGE_LEVELS[state.upgrades.scannerUses].uses;
    state.face.scanUsesRemaining+=newUses-oldUses;
    saveState();playTone('upgrade');renderAll();showToast(`${newUses} scans per rock face unlocked.`);
  }

  function buyWorkshop(){
    const cur=WORKSHOP_LEVELS[state.upgrades.workshop];
    if(cur.cost===null||state.credits<cur.cost)return;
    state.credits-=cur.cost;
    state.upgrades.workshop++;
    saveState();playTone('upgrade');renderAll();showToast('Precision Workshop unlocked.');
  }

  function buyAutomation(){
    if(state.upgrades.automation>0||state.credits<AUTOMATION_UPGRADE.cost)return;
    state.credits-=AUTOMATION_UPGRADE.cost;
    state.upgrades.automation=1;
    state.settings.autoProcess=true;
    saveState();playTone('upgrade');renderAll();showToast('Auto-process unlocked and switched on.');
  }

  function resetGame(){
    if(!window.confirm('Reset all Rock Go Crunch v2.1 progress?'))return;
    localStorage.removeItem(SAVE_KEY);
    state=defaultState();
    state.face=generateFace(1);
    openWorkbenchKey=null;
    scanMode=false;
    Object.keys(museumSelection).forEach(k=>delete museumSelection[k]);
    saveState();renderAll();showToast('v2.1 save reset.');
  }

  function renderSoundButton(){
    els.soundToggle.textContent=state.sound?'🔊':'🔇';
    els.soundToggle.setAttribute('aria-label',state.sound?'Mute sound':'Enable sound');
  }

  function showToast(msg){
    clearTimeout(toastTimer);
    els.toast.textContent=msg;
    els.toast.classList.add('show');
    toastTimer=setTimeout(()=>els.toast.classList.remove('show'),1900);
  }

  function getAudioContext(){
    if(!state.sound)return null;
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)return null;
    if(!audioContext)audioContext=new Ctx();
    if(audioContext.state==='suspended')audioContext.resume();
    return audioContext;
  }

  function playTone(type,key='quartz'){
    const ctx=getAudioContext();if(!ctx)return;const now=ctx.currentTime;
    if(type==='crunch'){
      const len=Math.floor(ctx.sampleRate*.05),buffer=ctx.createBuffer(1,len,ctx.sampleRate),data=buffer.getChannelData(0);
      for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(1-i/len);
      const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
      src.buffer=buffer;filter.type='lowpass';filter.frequency.value=520;gain.gain.setValueAtTime(.13,now);gain.gain.exponentialRampToValueAtTime(.001,now+.055);
      src.connect(filter).connect(gain).connect(ctx.destination);src.start(now);src.stop(now+.06);return;
    }
    const base={quartz:440,amethyst:392,garnet:349,topaz:494,pyrite:554,hematite:294,chalcopyrite:330,trilobite:262,miningTag:247}[key]||440;
    const sets={gem:[base,base*1.25,base*1.5],process:[260,330],collection:[523,659,784],coin:[660,880],upgrade:[330,440,554,659],soft:[300]},freqs=sets[type]||sets.soft;
    freqs.forEach((freq,i)=>{
      const osc=ctx.createOscillator(),gain=ctx.createGain(),start=now+i*.05,duration=['upgrade','collection'].includes(type)?.17:.105;
      osc.type=type==='soft'?'sine':'triangle';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.05,start+.015);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
      osc.connect(gain).connect(ctx.destination);osc.start(start);osc.stop(start+duration+.02);
    });
  }
})();
