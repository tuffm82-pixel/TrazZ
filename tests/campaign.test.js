const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../core.js'),D=require('../data.js');
test('thirty levels unlock in order and five clears open the next planet',()=>{
 const s=C.normalizeSave(null);assert.equal(C.canPlayLevel(s,'moon',1),true);assert.equal(C.canPlayLevel(s,'moon',2),false);assert.equal(C.canPlayLevel(s,'acid',5),false);
 for(let i=0;i<30;i++){const p=D.planets[Math.floor(i/5)].id,l=i%5+1;assert.equal(C.levelsCleared(s),i);assert.equal(C.canPlayLevel(s,p,l),true);assert.equal(C.completeLevel(s,p,l),true);assert.equal(C.completeLevel(s,p,l),false);assert.equal(s.completedPlanets.length,Math.floor((i+1)/5));}
 assert.equal(C.levelsCleared(C.normalizeSave(s)),30);assert.equal(C.canPlayLevel(s,'moon',0),false);assert.equal(C.canPlayLevel(s,'moon',6),false);assert.equal(C.canPlayLevel(s,'moon',1.5),false);
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
test('coins cannot bypass campaign gun milestones and milestones do not grant ownership',()=>{
 const s=C.normalizeSave({version:3,coins:100000});
 for(const [id,threshold] of [['longshot',5],['raygun',10],['flamegun',15],['spikegun',20],['crossgun',25],['rocket',30]]){
  assert.equal(C.gunUnlockLevel(id),threshold);assert.equal(C.buyGun(s,id),false);
 }
 for(let i=0;i<30;i++){C.completeLevel(s,D.planets[Math.floor(i/5)].id,i%5+1);if((i+1)%5===0){const id=['longshot','raygun','flamegun','spikegun','crossgun','rocket'][(i+1)/5-1];assert.equal(C.canEquip(s,id),false);assert.equal(C.canBuyGun(s,id),true);const before=s.coins;assert.equal(C.buyGun(s,id),true);assert.equal(s.coins,before-D.guns.find(g=>g.id===id).cost);}}
});
test('replays pay less and wave composition escalates without adding bosses to ordinary levels',()=>{
 const s=C.normalizeSave(null);assert.equal(C.levelReward(s,'moon',1),68);C.completeLevel(s,'moon',1);assert.equal(C.levelReward(s,'moon',1),20);
 for(let p=0;p<6;p++)for(let l=1;l<=5;l++)for(let w=1;w<=3;w++){const spec=C.levelSpec(p,l,w);assert.equal(spec.boss,l===5&&w===3);assert.equal(spec.waves,3);assert.ok(spec.count>=6);assert.ok(spec.healthScale>=1);assert.ok(spec.spawnInterval>=.5);}
 assert.ok(C.levelSpec(5,5,3).healthScale>C.levelSpec(0,1,1).healthScale);
 assert.ok(Math.min(...D.guns.filter(g=>g.cost>0).map(g=>g.cost))>=600);
});
