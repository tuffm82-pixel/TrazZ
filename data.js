(function(root){
if(typeof module!=='undefined'&&module.exports&&!root.TrazZUpgradeTrees){try{require('./upgrade-catalog.js')}catch{}}
const specs=[
['pulse','Pulse Pistol','common',0,25,.28,720,1,0,0,'#90ddff','single','Overdrive','rapid',16,4,1.6],
['scatter','Scrap Scatter','common',180,12,.68,640,5,0,0,'#d7ad7e','shotgun','Wide Sweep','nova',18,1,2],
['burst','Burst Carbine','common',250,15,.43,780,3,0,0,'#c8e6b4','burst','Focused Burst','rapid',17,4,1.8],
['ricochet','Copper Ricochet','uncommon',360,28,.42,700,1,0,3,'#f4a774','bounce','Pinball','bounce',19,5,3],
['ember','Ember SMG','uncommon',430,11,.11,770,1,0,0,'#ff8c5f','burn','Firestorm','burn',20,4,2],
['frost','Frostbite','uncommon',500,24,.36,680,1,0,0,'#9deaff','slow','Cold Snap','freeze',19,3,2],
['arc','Arc Coil','rare',650,27,.42,730,1,0,0,'#c7afff','chain','Thunder Ring','chain',22,1,3],
['venom','Venom Spitter','rare',700,18,.24,600,1,0,0,'#c0f56d','poison','Toxic Cloud','poison',21,5,2],
['rail','Rail Needle','rare',820,65,.78,1200,1,4,0,'#edc4ff','pierce','Rail Surge','pierce',23,5,3],
['gravity','Gravity Well','epic',1000,38,.52,560,1,0,0,'#b78aff','pull','Singularity','pull',24,4,2],
['solar','Solar Flare','epic',1100,43,.63,670,1,0,0,'#ffcd69','explosive','Solar Nova','nova',24,1,3],
['meteor','Meteor Cannon','legendary',1450,95,1.05,510,1,0,0,'#ff986c','heavy','Meteor Shower','meteor',26,3,3],
['wrath','Wrath Gun','mythic',2400,13,.075,2100,1,0,0,'#73caff','rapid','Wrath Unleashed','rapid',22,5,2],
['freezepistol','Freeze Pistol','mythic',1350,28,.34,780,1,0,0,'#b0f4ff','freeze','Absolute Zero','freeze',23,4,3],
['laze','Laze','mythic',1200,17,.16,1100,1,1,0,'#ff7eb6','burn','Laser Lock','burn',21,5,3],
['triangulox','Triangulox','mythic',1750,110,.92,850,1,1,0,'#c7a9ff','heavy','Triangle Collapse','nova',25,1,4],
['vstruk','V-Struk','mythic',2000,25,.46,1050,3,0,0,'#78e9ff','triple','Triple Strike','triple',22,5,2],
['curver','Curver','mythic',1900,32,.31,760,1,0,5,'#9af5d0','curve','Orbital Swarm','bounce',23,6,3],
['glockbow','Glockbow','mythic',1650,46,.38,950,1,1,0,'#67e6f1','bow','Prism Arrow','pierce',22,5,3],
['glacierar','Glacier AR','mythic',2200,20,.13,1000,1,0,0,'#9cdbff','ice','Glacier Barrage','freeze',24,4,2]
];
const guns=specs.map(s=>{const[id,name,rarity,cost,damage,interval,projectileSpeed,pellets,pierce,bounce,color,mechanic,an,at,ac,ad,ap]=s;return{id,name,rarity,cost,damage,interval,projectileSpeed,pellets,pierce,bounce,color,mechanic,image:`assets/guns/${id}.svg`,description:({single:'Reliable precision shots.',shotgun:'Five pellets punish close targets.',burst:'Three rounds in a tight burst.',bounce:'Bullets rebound off arena walls.',burn:'Shots ignite enemies over time.',slow:'Chilling rounds slow monsters.',chain:'Lightning jumps between nearby targets.',poison:'Venom eats away at enemy health.',pierce:'High velocity shots pass through enemies.',pull:'Impact bends nearby enemies toward it.',explosive:'Each hit explodes across a small area.',heavy:'Slow, devastating blasts with splash damage.',rapid:'Paper design: blue rotary barrels, bullets at three times normal speed.',freeze:'Ice rounds stop enemies in their tracks.',triple:'Three linked projectiles per trigger pull.',curve:'Shots curve toward enemies and bounce around.',bow:'Cyan angled sidearm fires piercing prism bolts.',ice:'Icy blue assault rifle stacks cold with rapid shots.'})[mechanic],ability:{name:an,type:at,cooldown:ac,duration:ad,power:ap,description:`Activate ${an} for a ${at==='rapid'?'burst of firing speed':at==='freeze'?'screen-wide freeze':at==='nova'?'powerful area blast':at==='pull'?'monster-pulling singularity':'powered '+at+' attack'}.`},upgradeTree:root.TrazZUpgradeTrees?.[id]||{nodes:[]}}});
const planets=[['moon','Moon Base','#b7c9e2','#101b32','#63738d','Defend the lunar outpost.'],['mars','Mars Mountains','#f3956c','#2c182a','#925143','Battle beneath the red mountain range.'],['neptune','Neptune Hills','#83ddff','#301c57','#416a94','Purple skies, crystal hills and deep blue seas.'],['asteroid','Asteroid Maze','#c9b7a6','#181c2d','#685e64','Survive a broken field of ancient rock.'],['volcanic','Volcanic Voyage','#ff805b','#311a27','#6b3540','A burning world threaded with lava.'],['acid','Acid Planet','#c8f473','#142c30','#466846','The final toxic frontier.']].map(([id,name,color,sky,ground,description])=>({id,name,color,sky,ground,description}));
const data={guns,planets,wavesPerPlanet:5,armours:[{id:'basic',name:'Explorer Suit',cost:0,health:0,reduction:0,color:'#b7d8dc'},{id:'plated',name:'Lunar Plating',cost:350,health:25,reduction:.08,color:'#c2d1ee'},{id:'crystal',name:'Crystal Guard',cost:850,health:55,reduction:.14,color:'#b0a1ed'},{id:'titan',name:'Titan Shell',cost:1600,health:90,reduction:.22,color:'#ffbd75'}],globalUpgrades:[{id:'health',name:'Suit integrity',description:'+15 maximum health per rank',max:8,base:18},{id:'damage',name:'Gun damage',description:'+8% damage per rank',max:8,base:22},{id:'cooldown',name:'Ability recovery',description:'6% shorter ability cooldown per rank',max:7,base:24}],characters:[{id:'duck',name:'TrazZ',image:'assets/characters/trazz-v5.svg'}]};
root.TrazZData=data;if(typeof module!=='undefined')module.exports=data;
})(typeof globalThis!=='undefined'?globalThis:this);


