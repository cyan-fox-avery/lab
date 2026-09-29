(() => {
  'use strict';

  const SAVE_KEY = 'rock-go-crunch-v2';
  const GRID_SIZE = 10;

  const MATERIALS = {
    quartz:{name:'Quartz',subtitle:'Silicon dioxide · SiO₂',family:'mineral',wing:'minerals',iconClass:'gem quartz',stages:['raw','tumbled','cut'],stageLabels:{raw:'Raw',tumbled:'Tumbled',cut:'Cut'},prices:{raw:4,tumbled:7,cut:12},process:{raw:'tumbled',tumbled:'cut'},processLabels:{raw:'Tumble 1',tumbled:'Cut 1'},facts:{raw:'Quartz commonly forms six-sided crystals and is one of Earth’s most abundant minerals.',tumbled:'Tumbling rounds rough edges through repeated abrasion with grit and water.',cut:'Clear quartz can be faceted even though it is much softer than diamond.'}},
    amethyst:{name:'Amethyst',subtitle:'Purple quartz · SiO₂',family:'mineral',wing:'minerals',iconClass:'gem amethyst',stages:['raw','tumbled','cut'],stageLabels:{raw:'Raw',tumbled:'Tumbled',cut:'Cut'},prices:{raw:8,tumbled:14,cut:24},process:{raw:'tumbled',tumbled:'cut'},processLabels:{raw:'Tumble 1',tumbled:'Cut 1'},facts:{raw:'Amethyst is a purple variety of quartz. Its colour is linked to trace iron and natural irradiation.',tumbled:'Polishing can make amethyst’s colour zoning and internal patterns easier to see.',cut:'Amethyst is commonly faceted to emphasize colour and brilliance.'}},
    garnet:{name:'Garnet',subtitle:'A family of silicate minerals',family:'mineral',wing:'minerals',iconClass:'gem garnet',stages:['raw','tumbled','cut'],stageLabels:{raw:'Raw',tumbled:'Tumbled',cut:'Cut'},prices:{raw:14,tumbled:26,cut:46},process:{raw:'tumbled',tumbled:'cut'},processLabels:{raw:'Tumble 1',tumbled:'Cut 1'},workshopRequired:1,facts:{raw:'Garnet is not one single mineral but a group of related minerals with similar crystal structures.',tumbled:'Garnets occur in several colours; deep red is familiar, but green, orange, and other varieties exist.',cut:'Gem-quality garnet can be faceted, while more opaque material is often polished instead.'}},
    topaz:{name:'Topaz',subtitle:'Aluminium fluorosilicate',family:'mineral',wing:'minerals',iconClass:'gem topaz',stages:['raw','tumbled','cut'],stageLabels:{raw:'Raw',tumbled:'Tumbled',cut:'Cut'},prices:{raw:18,tumbled:34,cut:60},process:{raw:'tumbled',tumbled:'cut'},processLabels:{raw:'Tumble 1',tumbled:'Cut 1'},workshopRequired:1,facts:{raw:'Topaz can occur in several colours. Natural crystals are often colourless, pale, or lightly coloured.',tumbled:'Topaz is hard but has perfect cleavage, so careless blows can split a crystal along flat planes.',cut:'Cutters orient topaz carefully because its cleavage affects how safely a stone can be shaped.'}},
    pyrite:{name:'Pyrite',subtitle:'Iron sulfide · FeS₂',family:'mineral',wing:'minerals',iconClass:'gem pyrite',stages:['raw'],stageLabels:{raw:'Natural specimen'},prices:{raw:11},process:{},facts:{raw:'Pyrite is an iron sulfide mineral famous for its metallic lustre and nickname: fool’s gold.'}},
    hematite:{name:'Hematite',subtitle:'Iron ore → Iron',family:'ore',wing:'ores',iconClass:'ore hematite',stages:['ore','refined'],stageLabels:{ore:'Hematite ore',refined:'Iron'},prices:{ore:6,refined:12},process:{ore:'refined'},processLabels:{ore:'Refine to iron'},facts:{ore:'Hematite is iron oxide and one of the world’s most important ores of iron.',refined:'Iron extracted from ore became one of the most important metals in tools, structures, and machines.'}},
    chalcopyrite:{name:'Chalcopyrite',subtitle:'Copper ore → Copper',family:'ore',wing:'ores',iconClass:'ore chalcopyrite',stages:['ore','refined'],stageLabels:{ore:'Chalcopyrite ore',refined:'Copper'},prices:{ore:7,refined:15},process:{ore:'refined'},processLabels:{ore:'Refine to copper'},facts:{ore:'Chalcopyrite is a copper iron sulfide and one of the most widespread copper-bearing minerals.',refined:'Copper is valued for conductivity, corrosion resistance, and its ability to be worked into useful shapes.'}},
    trilobite:{name:'Trilobite',subtitle:'Fossil arthropod',family:'fossil',wing:'fossils',iconClass:'round trilobite',iconText:'≋',stages:['found'],stageLabels:{found:'Fossil specimen'},prices:{found:40},process:{},facts:{found:'Trilobites were marine arthropods that lived for hundreds of millions of years and disappeared in the end-Permian mass extinction.'}},
    miningTag:{name:'Mining Tag',subtitle:'Historical mine check',family:'artifact',wing:'history',iconClass:'tag mining-tag',iconText:'#',stages:['found'],stageLabels:{found:'Historical artifact'},prices:{found:50},process:{},facts:{found:'Some mines used numbered tags or checks to help track who was underground. Systems varied from one operation to another.'}}
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
    {name:'None',cost:75,next:'Vein Scanner',description:'No advance information about a fresh rock face.'},
    {name:'Vein Scanner',cost:160,next:'Detailed Survey',description:'Identifies large veins and tells you what they contain.'},
    {name:'Detailed Survey',cost:360,next:'Anomaly Scanner',description:'Identifies small and large veins by material and notices unusual signatures.'},
    {name:'Anomaly Scanner',cost:null,next:null,description:'Also distinguishes fossil signatures from historical-object signatures.'}
  ];

  const WORKSHOP_LEVELS = [
    {name:'Basic Workshop',cost:180,next:'Precision Workshop',description:'Handles quartz, amethyst, iron ore, and copper ore.'},
    {name:'Precision Workshop',cost:null,next:null,description:'Can also process garnet and topaz. Processing remains free.'}
  ];

  const DEPTH_UPGRADE = {cost:225,description:'Unlocks Depth 2: the Lower Works, adding garnet, topaz, and pyrite.'};

  const emptyInventory = () => Object.fromEntries(Object.entries(MATERIALS).map(([k,m]) => [k,Object.fromEntries(m.stages.map(s => [s,0]))]));
  const emptyCollection = () => Object.fromEntries(Object.entries(MATERIALS).map(([k,m]) => [k,Object.fromEntries(m.stages.map(s => [s,false]))]));
  const emptyStats = () => Object.fromEntries(Object.keys(MATERIALS).map(k => [k,{found:0,sold:0,donated:0,processed:0,earned:0}]));

  const defaultState = () => ({credits:0,sound:true,unlockedDepth:1,currentDepth:1,upgrades:{durability:0,surveying:0,workshop:0},inventory:emptyInventory(),collection:emptyCollection(),stats:emptyStats(),face:null});

  let state = loadState();
  let openWorkbenchKey = null;
  let toastTimer = null;
  let audioContext = null;

  const $ = id => document.getElementById(id);
  const els = {depthName:$('depthName'),depthNumber:$('depthNumber'),durability:$('durability'),maxDurability:$('maxDurability'),durabilityMeter:$('durabilityMeter'),surveyLevel:$('surveyLevel'),mineBalance:$('mineBalance'),depthSelector:$('depthSelector'),surveyTitle:$('surveyTitle'),surveyReport:$('surveyReport'),mineBoard:$('mineBoard'),faceFinds:$('faceFinds'),newFaceButton:$('newFaceButton'),surfaceButton:$('surfaceButton'),mineMessage:$('mineMessage'),workbenchList:$('workbenchList'),museumWings:$('museumWings'),museumCount:$('museumCount'),museumMeter:$('museumMeter'),shopBalance:$('shopBalance'),upgradeList:$('upgradeList'),soundToggle:$('soundToggle'),resetButton:$('resetButton'),toast:$('toast')};

  init();

  function init(){
    if(!state.face || state.face.depth !== state.currentDepth){ state.face = generateFace(state.currentDepth); saveState(); }
    document.querySelectorAll('.nav-button').forEach(btn => btn.addEventListener('click',() => switchPanel(btn)));
    els.newFaceButton.addEventListener('click',startNewFace);
    els.surfaceButton.addEventListener('click',startNewFace);
    els.soundToggle.addEventListener('click',() => {state.sound=!state.sound;saveState();renderSoundButton();if(state.sound)playTone('soft');});
    els.resetButton.addEventListener('click',resetGame);
    renderAll();
  }

  function loadState(){
    try{
      const raw = localStorage.getItem(SAVE_KEY); if(!raw) return defaultState();
      const parsed = JSON.parse(raw), fresh = defaultState();
      const merged = {...fresh,...parsed,upgrades:{...fresh.upgrades,...(parsed.upgrades||{})},inventory:fresh.inventory,collection:fresh.collection,stats:fresh.stats};
      Object.entries(MATERIALS).forEach(([k,m]) => {
        m.stages.forEach(s => {merged.inventory[k][s]=parsed.inventory?.[k]?.[s]??0;merged.collection[k][s]=parsed.collection?.[k]?.[s]??false;});
        merged.stats[k]={...fresh.stats[k],...(parsed.stats?.[k]||{})};
      });
      return merged;
    }catch{return defaultState();}
  }

  function saveState(){ localStorage.setItem(SAVE_KEY,JSON.stringify(state)); }
  function formatMoney(cents){ const v=Math.max(0,Math.round(cents||0)); return v<100?`${v}¢`:`$${(v/100).toFixed(2)}`; }
  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

  function weightedChoice(source){
    const entries=Array.isArray(source)?source.map(x=>[x.key,x.weight]):Object.entries(source); let total=entries.reduce((a,[,w])=>a+w,0),r=Math.random()*total;
    for(const [k,w] of entries){r-=w;if(r<=0)return k;} return entries.at(-1)[0];
  }

  function neighbors(index){
    const r=Math.floor(index/GRID_SIZE),c=index%GRID_SIZE,out=[];
    [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([rr,cc])=>{if(rr>=0&&rr<GRID_SIZE&&cc>=0&&cc<GRID_SIZE)out.push(rr*GRID_SIZE+cc);});
    return out;
  }

  function generateFace(depth){
    const tiles=Array.from({length:GRID_SIZE*GRID_SIZE},(_,i)=>({index:i,revealed:false,material:null,depositId:null,depositType:null}));
    const deposits=[]; let nextId=0;

    function placeDeposit(material,size,type){
      for(let attempt=0;attempt<80;attempt++){
        const empty=tiles.filter(t=>!t.material); if(!empty.length)return false;
        const chosen=[empty[randInt(0,empty.length-1)].index],set=new Set(chosen);
        while(chosen.length<size){
          const frontier=[];
          chosen.forEach(i=>neighbors(i).forEach(n=>{if(!set.has(n)&&!tiles[n].material&&!frontier.includes(n))frontier.push(n);}));
          if(!frontier.length)break;
          const n=frontier[randInt(0,frontier.length-1)]; chosen.push(n); set.add(n);
        }
        if(chosen.length!==size)continue;
        const id=`d${nextId++}`;
        chosen.forEach(i=>Object.assign(tiles[i],{material,depositId:id,depositType:type}));
        deposits.push({id,material,type,size,announced:false}); return true;
      }
      return false;
    }

    const cfg=DEPTHS[depth];
    placeDeposit(weightedChoice(cfg.materials),randInt(5,8),'large');
    for(let i=0;i<randInt(3,4);i++)placeDeposit(weightedChoice(cfg.materials),randInt(2,4),'small');
    for(let i=0;i<randInt(3,5);i++)placeDeposit(weightedChoice(cfg.materials),1,'isolated');
    if(Math.random()<.24)placeDeposit(weightedChoice(cfg.sideFinds),1,'side');
    if(Math.random()<.045)placeDeposit(weightedChoice(cfg.sideFinds),1,'side');

    return {depth,size:GRID_SIZE,durability:DURABILITY_LEVELS[state.upgrades.durability].swings,finds:{},tiles,deposits};
  }

  function switchPanel(btn){
    const target=btn.dataset.target;
    document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b===btn));
    document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===target));
    if(target==='workbench')renderWorkbench(); if(target==='museum')renderMuseum(); if(target==='upgrades')renderUpgrades();
  }

  function startNewFace(){ state.face=generateFace(state.currentDepth);saveState();setMineMessage('⛏️','Fresh rock face.','The deposits have moved. Survey it if you can, then start crunching.');playTone('soft');renderMine();showToast('Fresh rock face.'); }
  function setDepth(d){ if(d>state.unlockedDepth||d===state.currentDepth)return;state.currentDepth=d;state.face=generateFace(d);saveState();renderMine();showToast(`${DEPTHS[d].name} selected.`); }

  function mineTile(index){
    const face=state.face,tile=face.tiles[index]; if(!tile||tile.revealed||face.durability<=0)return;
    tile.revealed=true; face.durability--;
    if(tile.material){
      const m=MATERIALS[tile.material],stage=m.stages[0]; state.inventory[tile.material][stage]++; state.stats[tile.material].found++; face.finds[tile.material]=(face.finds[tile.material]||0)+1;
      playTone('gem',tile.material); setMineMessage('✦',`${m.name}!`,findMessage(tile.material)); showToast(`Found ${m.name}!`); maybeAnnounceDeposit(tile.depositId);
    }else{ playTone('crunch'); setMineMessage('🪨','Crunch.','Nothing in that tile. Pick another spot.'); }
    if(face.durability<=0){setMineMessage('⛏️','Pick worn out.','That face is finished. Return to the surface for a fresh one; there is no recharge timer.');showToast('Face finished. No waiting required.');}
    saveState();renderMine();renderWorkbench();
  }

  function maybeAnnounceDeposit(id){
    const d=state.face.deposits.find(x=>x.id===id); if(!d||d.announced||['isolated','side'].includes(d.type))return;
    const count=state.face.tiles.filter(t=>t.depositId===id&&t.revealed).length,threshold=d.type==='large'?3:2;
    if(count>=threshold){d.announced=true;showToast(`${d.type==='large'?'Rich vein':'Vein'} discovered: ${MATERIALS[d.material].name}`);}
  }

  function findMessage(k){return({quartz:'A quartz specimen. Common does not mean useless.',amethyst:'Purple quartz. There may be more nearby.',hematite:'Hematite: an iron ore. Refine it or keep the natural specimen.',chalcopyrite:'Chalcopyrite: a copper-bearing ore.',garnet:'A garnet specimen from the Lower Works.',topaz:'Topaz. Hard, bright, and worth handling carefully.',pyrite:'Pyrite. Metallic, brassy, and absolutely not failed gold.',trilobite:'A fossil! The Fossil Wing would like a word.',miningTag:'A historical mining tag. Someone worked this ground before you.'})[k]||'Something interesting came out of the rock.';}
  function setMineMessage(icon,title,body){els.mineMessage.innerHTML=`<span class="message-icon">${icon}</span><div><strong>${title}</strong><p>${body}</p></div>`;}

  function renderAll(){renderMine();renderWorkbench();renderMuseum();renderUpgrades();renderSoundButton();}
  function renderMine(){
    const f=state.face,max=DURABILITY_LEVELS[state.upgrades.durability].swings;
    els.depthName.textContent=DEPTHS[state.currentDepth].name;els.depthNumber.textContent=`Depth ${state.currentDepth}`;els.durability.textContent=f.durability;els.maxDurability.textContent=max;els.durabilityMeter.style.width=`${Math.max(0,f.durability/max*100)}%`;els.surveyLevel.textContent=SURVEY_LEVELS[state.upgrades.surveying].name;els.mineBalance.textContent=formatMoney(state.credits);
    renderDepthSelector();renderSurvey();renderBoard();renderFaceFinds();
  }

  function renderDepthSelector(){els.depthSelector.innerHTML='';Object.keys(DEPTHS).forEach(x=>{const d=Number(x),b=document.createElement('button');b.type='button';b.className=`depth-chip ${d===state.currentDepth?'active':''}`;b.disabled=d>state.unlockedDepth;b.textContent=d<=state.unlockedDepth?`Depth ${d} · ${DEPTHS[d].name}`:`Depth ${d} · Locked`;b.addEventListener('click',()=>setDepth(d));els.depthSelector.appendChild(b);});}

  function renderSurvey(){
    const level=state.upgrades.surveying,f=state.face;els.surveyReport.innerHTML='';
    if(level===0){els.surveyTitle.textContent='No survey equipment';els.surveyReport.innerHTML='<span class="survey-pill">Upgrade Surveying to read the rock face before digging.</span>';return;}
    const found=[];
    if(level===1){f.deposits.filter(d=>d.type==='large').forEach(d=>found.push({text:`Large vein of ${MATERIALS[d.material].name} detected`}));els.surveyTitle.textContent='Large-vein scan';}
    if(level>=2){
      f.deposits.filter(d=>['large','small'].includes(d.type)).forEach(d=>found.push({text:`${capitalize(d.type)} vein of ${MATERIALS[d.material].name} detected`}));
      const sides=f.deposits.filter(d=>d.type==='side');
      if(sides.length){
        if(level===2)found.push({text:`${sides.length>1?'Multiple unusual signatures':'Unusual signature'} detected`,anomaly:true});
        else{
          const fossils=sides.filter(d=>MATERIALS[d.material].family==='fossil').length,artifacts=sides.filter(d=>MATERIALS[d.material].family==='artifact').length;
          if(fossils)found.push({text:`${fossils>1?'Multiple fossil signatures':'Fossil signature'} detected`,anomaly:true});
          if(artifacts)found.push({text:`${artifacts>1?'Multiple historical-object signatures':'Historical-object signature'} detected`,anomaly:true});
        }
      }
      els.surveyTitle.textContent=level===2?'Detailed survey':'Anomaly survey';
    }
    found.forEach(x=>{const s=document.createElement('span');s.className=`survey-pill ${x.anomaly?'anomaly':''}`;s.textContent=x.text;els.surveyReport.appendChild(s);});
  }

  function buildIcon(key,forTile=false,stage=null){
    const m=MATERIALS[key],span=document.createElement('span'); if(!forTile)span.classList.add('material-icon');m.iconClass.split(' ').forEach(c=>span.classList.add(c));
    if(!forTile&&stage==='refined'&&key==='hematite'){span.classList.remove('hematite');span.classList.add('iron');}
    if(!forTile&&stage==='refined'&&key==='chalcopyrite'){span.classList.remove('chalcopyrite');span.classList.add('copper');}
    if(forTile&&m.family==='mineral')span.classList.add('gem');if(forTile&&m.family==='ore')span.classList.add('ore');if(m.iconText)span.textContent=m.iconText;return span;
  }

  function renderBoard(){
    els.mineBoard.innerHTML='';state.face.tiles.forEach(t=>{const b=document.createElement('button');b.type='button';b.className='rock';b.setAttribute('aria-label',`Mine tile ${t.index+1}`);
      if(t.revealed){b.classList.add('revealed');b.disabled=true;if(t.material){b.classList.add('find');const i=buildIcon(t.material,true);i.classList.remove('material-icon');i.classList.add('tile-find');b.appendChild(i);b.setAttribute('aria-label',`Revealed ${MATERIALS[t.material].name}`);}else b.classList.add('empty');}
      else{b.disabled=state.face.durability<=0;b.addEventListener('click',()=>mineTile(t.index));}els.mineBoard.appendChild(b);
    });
  }
  function renderFaceFinds(){const list=Object.entries(state.face.finds).filter(([,n])=>n>0).map(([k,n])=>`${n} ${MATERIALS[k].name}`);els.faceFinds.textContent=list.length?list.join(' · '):'Nothing yet';}

  function renderWorkbench(){
    els.workbenchList.innerHTML='';Object.entries(MATERIALS).forEach(([k,m])=>{
      const card=document.createElement('article');card.className=`workbench-card ${openWorkbenchKey===k?'open':''}`;
      const toggle=document.createElement('button');toggle.type='button';toggle.className='accordion-toggle';toggle.setAttribute('aria-expanded',openWorkbenchKey===k?'true':'false');toggle.appendChild(buildIcon(k));
      const main=document.createElement('div');main.className='accordion-main';main.innerHTML=`<h3>${m.name}</h3><div class="summary-chips">${m.stages.map(s=>`<span class="summary-chip">${m.stageLabels[s]} ${state.inventory[k][s]} · ${formatMoney(m.prices[s])}</span>`).join('')}</div>`;toggle.appendChild(main);const chev=document.createElement('span');chev.className='chevron';chev.textContent='⌄';toggle.appendChild(chev);toggle.addEventListener('click',()=>{openWorkbenchKey=openWorkbenchKey===k?null:k;renderWorkbench();});card.appendChild(toggle);
      const details=document.createElement('div');details.className='workbench-details';details.innerHTML=workbenchDetails(k);card.appendChild(details);els.workbenchList.appendChild(card);
    });
    els.workbenchList.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',workbenchAction));
  }

  function workbenchDetails(k){
    const m=MATERIALS[k],s=state.stats[k];
    const rows=m.stages.map(stage=>{const count=state.inventory[k][stage],next=m.process?.[stage],req=m.workshopRequired||0,can=state.upgrades.workshop>=req,donated=state.collection[k][stage];return `<div class="stage-row"><div class="stage-copy"><strong>${m.stageLabels[stage]} · ${count} owned</strong><span>${formatMoney(m.prices[stage])} each</span>${next&&!can?'<span class="process-lock">Needs Precision Workshop</span>':''}</div><div class="stage-actions">${next?`<button class="mini-button accent" data-action="process" data-material="${k}" data-stage="${stage}" ${count<1||!can?'disabled':''}>${m.processLabels[stage]}</button>`:''}<button class="mini-button donate" data-action="donate" data-material="${k}" data-stage="${stage}" ${count<1||donated?'disabled':''}>${donated?'In museum':'Donate'}</button><button class="mini-button" data-action="sell" data-material="${k}" data-stage="${stage}" ${count<1?'disabled':''}>Sell ${formatMoney(m.prices[stage])}</button></div></div>`;}).join('');
    return `<p class="material-subtitle">${m.subtitle}</p><div class="stats-grid"><div class="stat-box"><span>Found</span><strong>${s.found}</strong></div><div class="stat-box"><span>Sold</span><strong>${s.sold}</strong></div><div class="stat-box"><span>Donated</span><strong>${s.donated}</strong></div><div class="stat-box"><span>Processed</span><strong>${s.processed}</strong></div><div class="stat-box"><span>Earned</span><strong>${formatMoney(s.earned)}</strong></div></div>${rows}`;
  }

  function workbenchAction(e){const b=e.currentTarget,k=b.dataset.material,stage=b.dataset.stage;if(b.dataset.action==='process')processOne(k,stage);if(b.dataset.action==='donate')donateOne(k,stage);if(b.dataset.action==='sell')sellOne(k,stage);}
  function processOne(k,stage){const m=MATERIALS[k],next=m.process?.[stage],req=m.workshopRequired||0;if(!next||state.upgrades.workshop<req||state.inventory[k][stage]<1)return;state.inventory[k][stage]--;state.inventory[k][next]++;state.stats[k].processed++;saveState();playTone('process');renderWorkbench();showToast(`${m.name}: ${m.stageLabels[stage]} → ${m.stageLabels[next]}`);}
  function donateOne(k,stage){if(state.collection[k][stage]||state.inventory[k][stage]<1)return;state.inventory[k][stage]--;state.collection[k][stage]=true;state.stats[k].donated++;saveState();playTone('collection',k);renderWorkbench();renderMuseum(k,stage);showToast(`${MATERIALS[k].name} added to the museum ✦`);}
  function sellOne(k,stage){if(state.inventory[k][stage]<1)return;const value=MATERIALS[k].prices[stage];state.inventory[k][stage]--;state.credits+=value;state.stats[k].sold++;state.stats[k].earned+=value;saveState();playTone('coin');renderMine();renderWorkbench();renderUpgrades();showToast(`Sold for ${formatMoney(value)}.`);}

  function renderMuseum(highlightK=null,highlightStage=null){
    els.museumWings.innerHTML='';let filledTotal=0,total=Object.values(MATERIALS).reduce((a,m)=>a+m.stages.length,0);
    WINGS.forEach(w=>{const pairs=Object.entries(MATERIALS).filter(([,m])=>m.wing===w.id);let wf=0,wt=0;pairs.forEach(([k,m])=>{wt+=m.stages.length;wf+=m.stages.filter(s=>state.collection[k][s]).length;});filledTotal+=wf;
      const wing=document.createElement('section');wing.className='museum-wing';wing.innerHTML=`<div class="wing-heading"><h3>${w.name}</h3><span>${wf} / ${wt} filled</span></div>`;
      pairs.forEach(([k,m])=>{const group=document.createElement('div');group.className='museum-group';const gf=m.stages.filter(s=>state.collection[k][s]).length;group.innerHTML=`<div class="museum-group-title"><strong>${m.name}</strong><span>${gf} / ${m.stages.length}</span></div>`;const slots=document.createElement('div');slots.className='museum-slots';m.stages.forEach(stage=>{const filled=state.collection[k][stage],slot=document.createElement('article');slot.className=`museum-slot ${filled?'filled':''} ${filled&&k===highlightK&&stage===highlightStage?'new-fill':''}`;const visual=document.createElement('div');visual.className='slot-visual';visual.appendChild(buildIcon(k,false,stage));slot.appendChild(visual);slot.insertAdjacentHTML('beforeend',`<strong class="slot-stage">${m.stageLabels[stage]}</strong><p class="slot-fact">${filled?m.facts[stage]:'Not yet collected.'}</p>`);slots.appendChild(slot);});group.appendChild(slots);wing.appendChild(group);});els.museumWings.appendChild(wing);
    });
    els.museumCount.textContent=`${filledTotal} / ${total}`;els.museumMeter.style.width=`${filledTotal/total*100}%`;
  }

  function renderUpgrades(){els.shopBalance.textContent=formatMoney(state.credits);els.upgradeList.innerHTML='';[depthCard(),durabilityCard(),surveyCard(),workshopCard()].forEach(c=>els.upgradeList.appendChild(c));}
  function upgradeCard({icon,eyebrow,title,description,current,cost,label,disabled,onClick}){const card=document.createElement('article');card.className='upgrade-card';card.innerHTML=`<div class="upgrade-icon">${icon}</div><div class="upgrade-copy"><span class="status-label">${eyebrow}</span><h3>${title}</h3><p>${description}</p><span class="upgrade-current">${current}</span></div><div class="upgrade-action"><span class="price-tag">${cost===null?'MAX':formatMoney(cost)}</span><button class="primary-button" type="button" ${disabled?'disabled':''}>${label}</button></div>`;const b=card.querySelector('button');if(!disabled&&onClick)b.addEventListener('click',onClick);return card;}
  function depthCard(){const max=state.unlockedDepth>=2;return upgradeCard({icon:'🪜',eyebrow:'Mine depth',title:max?'Lower Works unlocked':'Unlock Depth 2',description:max?'Both prototype depths are available.':DEPTH_UPGRADE.description,current:max?'Depths 1–2 available':'Current: Depth 1 only',cost:max?null:DEPTH_UPGRADE.cost,label:max?'Prototype max':'Go deeper',disabled:max||state.credits<DEPTH_UPGRADE.cost,onClick:buyDepth});}
  function durabilityCard(){const i=state.upgrades.durability,cur=DURABILITY_LEVELS[i],max=cur.cost===null,next=max?null:DURABILITY_LEVELS[i+1];return upgradeCard({icon:'⛏️',eyebrow:'Pick durability',title:max?cur.label:`${cur.swings} → ${next.swings} swings`,description:max?'The strongest pick in this prototype.':'More swings per rock face. No energy or recharge timer.',current:`Current: ${cur.label} · ${cur.swings} swings`,cost:cur.cost,label:max?'Prototype max':'Upgrade pick',disabled:max||state.credits<cur.cost,onClick:buyDurability});}
  function surveyCard(){const cur=SURVEY_LEVELS[state.upgrades.surveying],max=cur.cost===null;return upgradeCard({icon:'⌁',eyebrow:'Surveying',title:max?cur.name:`Unlock ${cur.next}`,description:cur.description,current:`Current: ${cur.name}`,cost:cur.cost,label:max?'Prototype max':'Upgrade survey',disabled:max||state.credits<cur.cost,onClick:buySurvey});}
  function workshopCard(){const cur=WORKSHOP_LEVELS[state.upgrades.workshop],max=cur.cost===null;return upgradeCard({icon:'🛠️',eyebrow:'Workshop equipment',title:max?cur.name:`Unlock ${cur.next}`,description:cur.description,current:`Current: ${cur.name}`,cost:cur.cost,label:max?'Prototype max':'Upgrade workshop',disabled:max||state.credits<cur.cost,onClick:buyWorkshop});}

  function buyDepth(){if(state.unlockedDepth>=2||state.credits<DEPTH_UPGRADE.cost)return;state.credits-=DEPTH_UPGRADE.cost;state.unlockedDepth=2;state.currentDepth=2;state.face=generateFace(2);saveState();playTone('upgrade');renderAll();showToast('Depth 2 unlocked: Lower Works.');}
  function buyDurability(){const i=state.upgrades.durability,cur=DURABILITY_LEVELS[i];if(cur.cost===null||state.credits<cur.cost)return;state.credits-=cur.cost;const old=cur.swings;state.upgrades.durability++;const newer=DURABILITY_LEVELS[state.upgrades.durability].swings;state.face.durability=Math.min(newer,state.face.durability+(newer-old));saveState();playTone('upgrade');renderAll();showToast(`Pick durability increased to ${newer} swings.`);}
  function buySurvey(){const cur=SURVEY_LEVELS[state.upgrades.surveying];if(cur.cost===null||state.credits<cur.cost)return;state.credits-=cur.cost;state.upgrades.surveying++;saveState();playTone('upgrade');renderAll();showToast(`${SURVEY_LEVELS[state.upgrades.surveying].name} unlocked.`);}
  function buyWorkshop(){const cur=WORKSHOP_LEVELS[state.upgrades.workshop];if(cur.cost===null||state.credits<cur.cost)return;state.credits-=cur.cost;state.upgrades.workshop++;saveState();playTone('upgrade');renderAll();showToast('Precision Workshop unlocked.');}

  function resetGame(){if(!window.confirm('Reset all Rock Go Crunch v2 progress?'))return;localStorage.removeItem(SAVE_KEY);state=defaultState();state.face=generateFace(1);openWorkbenchKey=null;saveState();renderAll();showToast('v2 save reset.');}
  function renderSoundButton(){els.soundToggle.textContent=state.sound?'🔊':'🔇';els.soundToggle.setAttribute('aria-label',state.sound?'Mute sound':'Enable sound');}
  function showToast(msg){clearTimeout(toastTimer);els.toast.textContent=msg;els.toast.classList.add('show');toastTimer=setTimeout(()=>els.toast.classList.remove('show'),1800);}

  function getAudioContext(){if(!state.sound)return null;const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return null;if(!audioContext)audioContext=new Ctx();if(audioContext.state==='suspended')audioContext.resume();return audioContext;}
  function playTone(type,key='quartz'){
    const ctx=getAudioContext();if(!ctx)return;const now=ctx.currentTime;
    if(type==='crunch'){const len=Math.floor(ctx.sampleRate*.05),buffer=ctx.createBuffer(1,len,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(1-i/len);const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=buffer;filter.type='lowpass';filter.frequency.value=520;gain.gain.setValueAtTime(.13,now);gain.gain.exponentialRampToValueAtTime(.001,now+.055);src.connect(filter).connect(gain).connect(ctx.destination);src.start(now);src.stop(now+.06);return;}
    const base={quartz:440,amethyst:392,garnet:349,topaz:494,pyrite:554,hematite:294,chalcopyrite:330,trilobite:262,miningTag:247}[key]||440;
    const sets={gem:[base,base*1.25,base*1.5],process:[260,330],collection:[523,659,784],coin:[660,880],upgrade:[330,440,554,659],soft:[300]},freqs=sets[type]||sets.soft;
    freqs.forEach((freq,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain(),start=now+i*.05,duration=['upgrade','collection'].includes(type)?.17:.105;osc.type=type==='soft'?'sine':'triangle';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.05,start+.015);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(gain).connect(ctx.destination);osc.start(start);osc.stop(start+duration+.02);});
  }
})();
