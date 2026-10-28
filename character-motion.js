(function(root){
 'use strict';
 function advance(player,distance){
  if(Math.abs(distance)<.001){player.walkPhase=0;player.walking=false;return;}
  player.walking=true;player.walkPhase=((player.walkPhase||0)+Math.abs(distance)/150*Math.PI*2)%(Math.PI*2);
 }
 function pose(player){
  const up=player.aim==='up';
  if(!player.walking)return{path:'assets/characters/trazz-body-v'+(up?'6':'7')+'.svg',bob:0};
  const phase=player.walkPhase||0,frame=Math.floor(phase/(Math.PI*2)*8)%8;
  return{path:'assets/characters/trazz-walk-'+(up?'up':'side')+'-'+frame+'.svg',bob:-Math.abs(Math.sin(phase))*3};
 }
 const api={advance,pose};root.TrazZMotion=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
