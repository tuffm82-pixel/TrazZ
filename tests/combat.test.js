const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const D=require('../data.js'),C=require('../core.js');
function harness(){
 const events=new Map(),elements=new Map(),noop=()=>{},classes={toggle:noop,add:noop,remove:noop};
 const element=selector=>{if(!elements.has(selector))elements.set(selector,{style:{setProperty(k,v){this[k]=v}},classList:classes,dataset:{},addEventListener:noop,close(){this.open=false},showModal(){this.open=true},focus:noop,getContext:()=>({}),textContent:'',hidden:false});return elements.get(selector);};
 const all=D.planets.flatMap(p=>[1,2,3,4,5].map(l=>p.id+'-'+l));
 const raw={version:3,sound:false,clearedLevels:all};
 const context={window:{TrazZData:D,TrazZCore:C},document:{querySelector:element,querySelectorAll:()=>[],body:{classList:classes},addEventListener:noop},localStorage:{getItem:()=>JSON.stringify(raw),setItem:noop},navigator:{maxTouchPoints:0},matchMedia:()=>({matches:false}),innerWidth:1200,innerHeight:720,addEventListener:(name,fn)=>events.set(name,fn),requestAnimationFrame:noop,setTimeout:()=>0,clearTimeout:noop,console};
 let source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
 const marker='updateStatus();requestAnimationFrame(loop);';
 assert.ok(source.includes(marker),'app boot marker exists for test-only exposure');
 source=source.replace(marker,'window.combatTest={startGame,update,spawnEnemy,enemyAttack,updateEnemies,damage,shoot,nextWave,goHome,save,uiText(selector){return $(selector).textContent},uiStyle(selector,key){return $(selector).style[key]},get selection(){return {planet:selectedPlanet,level:selectedLevel}},get run(){return run},select(planet,level){selectedPlanet=planet;selectedLevel=level}};'+marker);
 vm.runInNewContext(source,context,{filename:'app.js'});
 return Object.assign(context.window.combatTest,{key(key,repeat=false){events.get('keydown')({key,code:key,repeat,preventDefault:noop})},click(selector){element(selector).onclick()},panelOpen(){return element('#panel').open}});
}
function start(h,index=0,level=1){h.select(D.planets[index].id,level);h.startGame();h.run.crystals=[];h.run.toSpawn=0;return h.run;}
test('horizontal starter shots hit full-size ground enemies at barrel height',()=>{
 const h=harness(),r=start(h);h.spawnEnemy(false);const e=r.enemies[0];e.x=800;e.freeze=100;
 const barrelY=r.player.y-28;assert.ok(Math.abs(e.y-barrelY)<e.r+4,'ground hitbox intersects shot line');
 const hp=e.hp;h.shoot();h.update(.25);assert.ok(e.hp<hp,'actual combat bullet collision damages ground enemy');
});
test('six planet bosses have different attack patterns and final phase adds a beam hazard',()=>{
 const signatures=new Set();
 for(let i=0;i<6;i++){const h=harness(),r=start(h,i,5);h.spawnEnemy(true);const e=r.enemies[0];e.x=900;e.attackTarget={x:600,y:465};h.enemyAttack(e);
  if(i===0){assert.equal(e.charge,.8);assert.equal(r.hostiles.length,3);}
  if(i===1){assert.equal(e.charge,1.1);assert.equal(r.hazards[0].kind,'impact');}
  if(i===2)assert.ok(r.hostiles.every(b=>b.kind==='trident'));
  if(i===3){assert.equal(r.enemies.length,2);assert.ok(r.hostiles.every(b=>b.kind==='rock'));}
  if(i===4){assert.equal(r.hostiles.length,4);assert.equal(r.hazards[0].kind,'fire');assert.ok(r.hostiles.every(b=>b.gravity===420&&b.y>e.y&&b.vy<0));}
  if(i===5){assert.equal(r.hostiles.length,5);assert.equal(r.hazards.length,0);e.hp=e.maxHp*.4;h.enemyAttack(e);assert.equal(r.hazards[0].kind,'beam');assert.equal(r.hostiles.at(-1).damage,20);assert.ok(Math.hypot(r.hostiles.at(-1).vx,r.hostiles.at(-1).vy)>299);}
  signatures.add(JSON.stringify([e.charge,r.hostiles.length,r.hostiles[0]?.kind||'',r.hazards[0]?.kind||'']));
 }
 assert.equal(signatures.size,6);
});
test('boss warnings give time before the attack fires',()=>{
 const h=harness(),r=start(h,2,5);h.spawnEnemy(true);const e=r.enemies[0];e.x=900;e.attackTimer=0;
 h.updateEnemies(.1);assert.ok(e.attackWindup>.8);assert.ok(e.attackTarget);assert.equal(r.hostiles.length,0);
 h.updateEnemies(1);assert.equal(r.hostiles.length,3);assert.ok(r.hostiles.every(b=>b.kind==='trident'));
});
test('Twin Asteroids cannot clear until both bosses are defeated',()=>{
 const h=harness(),r=start(h,3,5);r.wave=3;r.spec=C.levelSpec(3,5,3);r.bossSpawned=true;h.spawnEnemy(true);
 const [a,b]=r.enemies;h.damage(a,a.hp+1);h.update(.01);assert.equal(r.over,false);assert.equal(r.enemies.length,1);assert.equal(r.enemies[0].id,b.id);assert.equal(r.waveWait,0);
 h.damage(b,b.hp+1);h.update(2.1);assert.equal(r.over,true);assert.equal(r.enemies.length,0);
});
test('clearing a wave does not refill lost health',()=>{
 const h=harness(),r=start(h);r.player.hp=37;r.waveWait=1.99;h.update(.02);
 assert.equal(r.wave,2);assert.equal(r.player.hp,37);assert.ok(r.toSpawn>0);
});

test('shots do not skip enemies close to the gun or directly overhead',()=>{
 for(const aim of ['right','left','up']){
  const h=harness(),r=start(h);h.spawnEnemy(false);const e=r.enemies[0];e.freeze=100;e.r=30;
  r.player.aim=aim;e.x=r.player.x+(aim==='right'?70:aim==='left'?-70:0);e.y=r.player.y-28+(aim==='up'?-70:0);
  const hp=e.hp;h.shoot();h.update(.08);assert.ok(e.hp<hp,'close '+aim+' enemy must be hit');
 }
});

test('waiting with a frozen enemy cannot generate infinite gem crystals',()=>{
 const h=harness(),r=start(h);h.spawnEnemy(false);const e=r.enemies[0];e.x=1100;e.freeze=1000;r.player.invincible=1000;r.crystalTimer=0;
 let spawned=0;
 for(let n=0;n<80;n++){r.crystals=[];h.update(1);spawned+=r.crystals.length}
 assert.equal(spawned,3);assert.equal(r.crystalBudget,0);
});

test('boss HUD keeps total twin health and target count as one boss falls',()=>{
 const h=harness(),r=start(h,3,5);h.spawnEnemy(true);const total=r.enemies.reduce((n,e)=>n+e.maxHp,0);h.update(.01);
 assert.match(h.uiText('#boss-status'),/2 TARGETS/);
 h.damage(r.enemies[0],r.enemies[0].hp+1);h.update(.01);
 assert.match(h.uiText('#boss-status'),/1 TARGET/);assert.match(h.uiText('#boss-status'),new RegExp('/ '+Math.ceil(total)));
 assert.equal(h.uiStyle('#boss-status','--boss-health'),'50%');
});
test('returning to the menu recommends the next uncleared mission',()=>{
 const h=harness();h.save.clearedLevels=['moon-1','moon-2'];h.save.completedPlanets=[];h.goHome();
 assert.equal(h.selection.planet,'moon');assert.equal(h.selection.level,3);
 h.save.clearedLevels=D.planets.flatMap(p=>[1,2,3,4,5].map(l=>p.id+'-'+l));h.goHome();
 assert.equal(h.selection.planet,'acid');assert.equal(h.selection.level,5);
});

test('red winged skulls appear on all worlds and grow in later levels',()=>{
 for(let p=0;p<6;p++){
  const h=harness(),r=start(h,p,2);for(let i=0;i<5;i++)h.spawnEnemy(false);
  const red=r.enemies.find(e=>e.kind==='skull');assert.ok(red,'red skull on planet '+p);assert.equal(red.flying,true);assert.ok(red.y<580-red.r);
 }
 const h=harness(),r=start(h,0,5);for(let i=0;i<2;i++)h.spawnEnemy(false);const red=r.enemies.find(e=>e.kind==='skull');assert.equal(red.variant,2);assert.equal(red.r,42);
});
test('red skull swoops are warned, freeze pauses them, and recovery stays airborne',()=>{
 const h=harness(),r=start(h,0,2);h.spawnEnemy(false);h.spawnEnemy(false);const e=r.enemies.find(e=>e.kind==='skull');
 e.x=850;e.y=360;e.attackTimer=0;h.updateEnemies(.1);assert.ok(e.attackWindup>.7);assert.equal(e.swoopTime,0);
 h.updateEnemies(.86);assert.ok(e.swoopTime>0);assert.equal(r.hostiles.length,0);
 e.freeze=.5;const x=e.x,y=e.y,phase=e.phase;h.updateEnemies(.1);assert.equal(e.x,x);assert.equal(e.y,y);assert.equal(e.phase,phase);
 e.freeze=0;for(let i=0;i<10;i++)h.updateEnemies(.1);assert.equal(e.swoopTime,0);assert.ok(e.recover>0);assert.ok(e.y>=190&&e.y<=510);
});

 test('expired enemy shots cannot damage TrazZ',()=>{
 const h=harness(),r=start(h);r.hostiles.push({x:r.player.x,y:r.player.y-15,vx:0,vy:0,r:8,damage:20,life:.005});
 h.update(.016);assert.equal(r.player.hp,r.player.maxHp);assert.equal(r.hostiles.length,0);
});

test('holding Escape cannot repeatedly unpause a mission',()=>{
 const h=harness(),r=start(h);h.key('Escape');assert.equal(r.paused,true);
 h.key('Escape',true);assert.equal(r.paused,true);assert.equal(h.panelOpen(),true);
 h.key('Escape');assert.equal(r.paused,false);
});

test('Escape closes the result screen and returns to the menu',()=>{
 const h=harness(),r=start(h);r.wave=3;r.waveWait=2;h.update(.01);assert.equal(r.over,true);assert.equal(h.panelOpen(),true);
 h.key('Escape');assert.equal(h.panelOpen(),false);assert.equal(h.run,null);
});

test('fire boss is a timed survival encounter and pays its reward once',()=>{
 const h=harness(),r=start(h,4,5);r.wave=3;r.spec=C.levelSpec(4,5,3);r.bossSpawned=true;h.spawnEnemy(true);const e=r.enemies[0];e.x=950;const hp=e.hp,coins=h.save.coins;
 h.damage(e,hp*100);assert.equal(e.hp,hp);assert.equal(r.fireSurvival,45);
 r.player.invincible=1000;h.update(.1);assert.match(h.uiText('#boss-status'),/SURVIVE: 45s/);
 for(let i=0;i<448;i++)h.update(.1);assert.equal(e.dead,false);assert.equal(r.over,false);
 h.update(.11);assert.equal(e.dead,true);assert.equal(r.fireSurvival,0);assert.equal(r.hostiles.length,0);assert.equal(r.hazards.length,0);
 assert.equal(h.save.coins,coins+e.coins);h.damage(e,hp*100);assert.equal(h.save.coins,coins+e.coins);
 h.update(2.1);assert.equal(r.over,true);
});
test('final boss changes phase and announces its armour break once',()=>{
 const h=harness(),r=start(h,5,5);h.spawnEnemy(true);const e=r.enemies[0];e.x=950;e.hp=e.maxHp*.49;h.update(.01);assert.equal(e.enraged,true);assert.match(h.uiText('#wave-announcement'),/ARMOUR BREAK/);assert.match(h.uiText('#boss-status'),/ENRAGED/);
});
test('new gun rewards appear on results without charging currency',()=>{
 const h=harness();h.save.clearedLevels=[];h.save.completedPlanets=[];h.save.ownedGuns=['pulse'];const r=start(h);r.wave=3;r.waveWait=2;const coins=h.save.coins;h.update(.01);assert.ok(h.save.ownedGuns.includes('scatter'));assert.equal(h.save.coins,coins+68);assert.equal(r.over,true);
});

test('surviving the fire countdown cannot create a fatal ground hazard during victory delay',()=>{
 const h=harness(),r=start(h,4,5);r.wave=3;r.spec=C.levelSpec(4,5,3);r.bossSpawned=true;h.spawnEnemy(true);r.enemies[0].x=950;r.fireSurvival=.001;r.hazardTimer=.001;r.player.hp=1;
 h.update(.016);assert.equal(r.hazards.length,0);for(let i=0;i<140;i++)h.update(.016);assert.equal(r.over,true);assert.equal(r.player.hp,1);
});
