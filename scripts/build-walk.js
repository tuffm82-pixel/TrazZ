// Eight contact/down/passing/up poses, preserving both original aiming heads.
const fs=require('node:fs'),path=require('node:path');
const dir=path.join(__dirname,'..','assets','characters');
for(const [view,version] of [['side',7],['up',6]]){
 const original=fs.readFileSync(path.join(dir,'trazz-body-v'+version+'.svg'),'utf8');
 const paths=[...original.matchAll(/<path d="m(?:123 290|168 294|97 357|177 359)[^\n]+/g)].map(m=>m[0]);
 if(paths.length!==4)throw Error('Character leg paths changed; update walk rig.');
 for(let frame=0;frame<8;frame++){
  const phase=frame/8*Math.PI*2,swing=Math.sin(phase)*19,lift=Math.max(0,Math.cos(phase))*5;
  let svg=original;
  for(const [i,pivot,angle] of [[0,'134 295',swing],[1,'161 295',-swing]]){
   const leg=paths[i],foot=paths[i+2];
   svg=svg.replace(leg,`<g transform="rotate(${angle.toFixed(2)} ${pivot}) translate(0 ${i===0?-lift:-(5-lift)})">${leg}${foot}</g>`).replace('\n'+foot,'');
  }
  const arm=/<path d="M56 245[^\n]+/;
  svg=svg.replace(arm,m=>`<g transform="rotate(${(-swing*.3).toFixed(2)} 66 244)">${m}</g>`);
  fs.writeFileSync(path.join(dir,`trazz-walk-${view}-${frame}.svg`),svg);
 }
}
console.log('Built 16 walking poses for side and upward aiming.');
