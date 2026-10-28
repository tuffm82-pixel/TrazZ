const {test}=require('node:test'),assert=require('node:assert/strict');
const Music=require('../music.js');
function setup(){
 let created=0,resumed=0,suspended=0,ticks=0,callback,voices=0;
 const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},cancelScheduledValues(){}});
 class Context{
  constructor(){created++;this.currentTime=0;this.state='suspended';this.destination={};}
  createGain(){return{gain:param(),connect(){},disconnect(){}}}
  createOscillator(){voices++;return{frequency:param(),connect(){},disconnect(){},start(){},stop(){}}}
  resume(){resumed++;this.state='running';return Promise.resolve()}
  suspend(){suspended++;this.state='suspended';return Promise.resolve()}
 }
 const music=Music.create({AudioContext:Context,setInterval(fn){callback=fn;ticks++;return ticks},clearInterval(){ticks--}});
 return{music,get state(){return{created,resumed,suspended,ticks,voices}},tick(){callback()}};
}
test('soundtrack waits for interaction and repeated play calls never stack loops',()=>{
 const h=setup();assert.equal(h.state.created,0);h.music.play('menu');assert.equal(h.state.created,1);assert.equal(h.state.ticks,1);assert.ok(h.state.voices>0);h.music.play('game',2);h.music.play('game',2);assert.equal(h.state.ticks,1);assert.equal(h.state.created,1);
});
test('music mute and pause silence playback and re-enable reuses one context',()=>{
 const h=setup();h.music.play();h.music.setEnabled(false);assert.equal(h.music.playing,false);assert.equal(h.state.ticks,0);assert.equal(h.state.suspended,1);h.music.play();assert.equal(h.state.ticks,0);h.music.setEnabled(true);h.music.play('game');assert.equal(h.state.created,1);assert.equal(h.music.playing,true);h.music.stop();assert.equal(h.state.ticks,0);
});
test('music preference survives save normalization separately from sound effects',()=>{
 const C=require('../core.js');assert.equal(C.normalizeSave(null).music,true);const s=C.normalizeSave({music:false,sound:true});assert.equal(s.music,false);assert.equal(s.sound,true);assert.equal(C.normalizeSave(s).music,false);
});
