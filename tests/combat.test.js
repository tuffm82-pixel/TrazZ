const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const D=require('../data.js'),C=require('../core.js');
function harness(){
 const elements=new Map(),noop=()=>{},classes={toggle:noop,add:noop,remove:noop};
 const element=selector=>{if(!elements.has(selector))elements.set(selector,{style:{setProperty(k,v){this[k]=v}},classList:classes,dataset:{},addEventListener:noop,close(){this.open=false},showModal(){this.open=true},focus:noop,getContext:()=>({}),textContent:'',hidden:false});return elements.get(selector);};
 const all=D.planets.flatMap(p=>[1,2,3,4,5].map(l=>p.id+'-'+l));
 const raw={version:3,sound:false,clearedLevels:all};
 const context={window:{TrazZData:D,TrazZCore:C},document:{querySelector:element,querySelectorAll:()=>[],body:{classList:classes},addEventListener:noop},localStorage:{getItem:()=>JSON.stringify(raw),setItem:noop},navigator:{maxTouchPoints:0},matchMedia:()=>({matches:false}),innerWidth:1200,innerHeight:720,addEventListener:noop,requestAnimationFrame:noop,setTimeout:()=>0,clearTimeout:noop,console};
 let source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
 const marker='updateStatus();requestAnimationFrame(loop);';
 assert.ok(source.includes(marker),'app boot marker exists for test-only exposure');
 source=source.replace(marker,'window.combatTest={startGame,update,spawnEnemy,enemyAttack,updateEnemies,damage,shoot,nextWave,goHome,save,uiText(selector){return $(selector).textContent},uiStyle(selector,key){return $(selector).style[key]},get selection(){return {planet:selectedPlanet,level:selectedLevel}},get run(){return run},select(planet,level){selectedPlanet=planet;selectedLevel=level}};'+marker);
 vm.runInNewContext(source,context,{filename:'app.js'});
 return context.window.combatTest;
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
  if(i===4){assert.equal(r.hostiles.length,4);assert.equal(r.hazards[0].kind,'fire');assert.ok(r.hostiles.every(b=>b.gravity===70));}
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
