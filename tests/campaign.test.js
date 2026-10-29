const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../core.js'),D=require('../data.js');
test('sixty levels unlock in order and five clears open the next planet',()=>{
 const s=C.normalizeSave(null);assert.equal(C.canPlayLevel(s,'moon',1),true);assert.equal(C.canPlayLevel(s,'moon',2),false);assert.equal(C.canPlayLevel(s,'acid',5),false);
 for(let i=0;i<60;i++){const p=D.planets[Math.floor(i/5)].id,l=i%5+1;assert.equal(C.levelsCleared(s),i);assert.equal(C.canPlayLevel(s,p,l),true);assert.equal(C.completeLevel(s,p,l),true);assert.equal(C.completeLevel(s,p,l),false);assert.equal(s.completedPlanets.length,Math.floor((i+1)/5));}
 assert.equal(C.levelsCleared(C.normalizeSave(s)),60);assert.equal(C.canPlayLevel(s,'moon',0),false);assert.equal(C.canPlayLevel(s,'moon',6),false);assert.equal(C.canPlayLevel(s,'moon',1.5),false);
});
test('v2 completed worlds migrate once without losing currency or purchases',()=>{
 const s=C.normalizeSave({version:2,coins:1290,gems:73,xp:980,completedPlanets:['moon','mars'],ownedGuns:['pulse','wrath'],gun:'wrath',upgrades:{pulse:4}});
 assert.equal(s.version,3);assert.equal(s.clearedLevels.length,10);assert.equal(s.coins,1290);assert.equal(s.gems,73);assert.equal(s.gun,'wrath');assert.equal(C.isGunUnlocked(s,'wrath'),true);
 const reloaded=C.normalizeSave(s);assert.equal(reloaded.coins,1290);assert.equal(reloaded.clearedLevels.length,10);assert.deepEqual(reloaded.ownedGuns,s.ownedGuns);
});
test('invalid v3 level gaps cannot skip ahead',()=>{
 const s=C.normalizeSave({version:3,clearedLevels:['moon-1','moon-3','acid-5']});
 assert.deepEqual(s.clearedLevels,['moon-1']);assert.equal(C.canPlayLevel(s,'moon',3),false);
});
test('campaign milestones grant guns directly without spending coins or gems',()=>{
 const s=C.normalizeSave({version:3,coins:123,gems:45});
 for(const [id,n] of [['longshot',5],['raygun',10],['flamegun',15],['spikegun',20],['crossgun',25],['rocket',30]])assert.equal(C.gunUnlockLevel(id),n);
 for(let i=0;i<60;i++){const before=new Set(s.ownedGuns);C.completeLevel(s,D.planets[Math.floor(i/5)].id,i%5+1);for(const g of D.guns){assert.equal(C.canEquip(s,g.id),g.unlockLevel<=i+1);if(!before.has(g.id)&&g.unlockLevel===i+1)assert.ok(s.ownedGuns.includes(g.id));}assert.equal(s.coins,123);assert.equal(s.gems,45);}
 assert.equal(s.ownedGuns.length,38);assert.equal(C.buyGun(s,'rocket'),false);
});
test('existing campaign saves receive earned guns without losing purchases or currencies',()=>{
 const s=C.normalizeSave({version:3,coins:48,gems:9,clearedLevels:['moon-1','moon-2','moon-3','moon-4','moon-5'],ownedGuns:['pulse','rocket'],gun:'rocket'});
 assert.ok(s.ownedGuns.includes('longshot'));assert.ok(s.ownedGuns.includes('rocket'));assert.equal(s.gun,'rocket');assert.equal(s.coins,48);assert.equal(s.gems,9);assert.deepEqual(C.normalizeSave(s).ownedGuns,s.ownedGuns);
});
test('replays pay less and wave composition escalates without adding bosses to ordinary levels',()=>{
 const s=C.normalizeSave(null);assert.equal(C.levelReward(s,'moon',1),68);C.completeLevel(s,'moon',1);assert.equal(C.levelReward(s,'moon',1),20);
 for(let p=0;p<D.planets.length;p++)for(let l=1;l<=5;l++)for(let w=1;w<=3;w++){const spec=C.levelSpec(p,l,w);assert.equal(spec.boss,l===5&&w===3);assert.equal(spec.waves,3);assert.ok(spec.count>=6);assert.ok(spec.healthScale>=1);assert.ok(spec.spawnInterval>=.5);}
 assert.ok(C.levelSpec(5,5,3).healthScale>C.levelSpec(0,1,1).healthScale);
 assert.ok(D.guns.every(g=>g.cost===0));
});

test('completed original campaign opens expansion and retains old rewards',()=>{const old=D.planets.slice(0,6).flatMap(p=>[1,2,3,4,5].map(l=>p.id+'-'+l));const s=C.normalizeSave({version:3,clearedLevels:old,coins:1000,gems:90,gun:'rocket',ownedGuns:['pulse','rocket']});assert.equal(s.clearedLevels.length,30);assert.equal(C.canPlayLevel(s,'crystal',1),true);assert.equal(C.canPlayLevel(s,'storm',1),false);assert.equal(s.gun,'rocket');assert.equal(s.coins,1000);assert.equal(C.canEquip(s,'shard'),false);});
test('new upgrade types change critical, healing, shield and fire rate without spending coins',()=>{const s=C.normalizeSave({coins:100,gems:1000});const before=C.stats(s);for(const id of ['critical','leech','shield','fireRate'])assert.equal(C.buyGlobal(s,id),true);const after=C.stats(s);assert.equal(after.effects.crit,.03);assert.equal(after.effects.lifesteal,.01);assert.equal(after.effects.shield,12);assert.ok(after.interval<before.interval);assert.equal(s.coins,100);});

test('45-level saves continue into Verdant without losing upgrades or earned guns',()=>{const old=D.planets.slice(0,9).flatMap(p=>[1,2,3,4,5].map(l=>p.id+'-'+l));const s=C.normalizeSave({version:3,clearedLevels:old,gun:'eclipse',ownedGuns:['pulse','eclipse'],coins:444,gems:111,global:{critical:3}});assert.equal(s.clearedLevels.length,45);assert.equal(C.canPlayLevel(s,'verdant',1),true);assert.equal(C.canPlayLevel(s,'foundry',1),false);assert.equal(s.gun,'eclipse');assert.equal(s.global.critical,3);assert.equal(s.coins,444);assert.equal(s.gems,111);assert.equal(C.canEquip(s,'thorn'),false);});
test('new permanent upgrades increase repair, movement, blast radius and projectile velocity',()=>{const s=C.normalizeSave({gems:2000,coins:100});const before=C.stats(s);for(const id of ['regen','mobility','blast','velocity'])assert.equal(C.buyGlobal(s,id),true);const after=C.stats(s);assert.equal(after.effects.regen,.4);assert.equal(after.effects.moveSpeed,.04);assert.equal(after.effects.blastRadius,.08);assert.equal(after.projectileSpeed,before.projectileSpeed+100);assert.equal(s.coins,100);});
