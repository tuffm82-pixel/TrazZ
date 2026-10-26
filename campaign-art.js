/* Original vector sprites following the player's paper enemy and boss designs. */
(function (root) {
  'use strict';
  const palettes = [
    ['#b7a598', '#6d7d95', '#a7e0f4'],
    ['#b96e59', '#bd8e67', '#e9a764'],
    ['#b3a0d8', '#718cbd', '#6fdfdf'],
    ['#998078', '#a796bb', '#dfb27c'],
    ['#b97055', '#88576b', '#ffb760'],
    ['#98ab60', '#638c71', '#c4e777']
  ];
  function path(c, points, fill, stroke = '#25323d', width = .045) {
    c.beginPath();
    points.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.closePath(); c.fillStyle = fill; c.fill();
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function line(c, points, color = '#25323d', width = .045) {
    c.beginPath(); points.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.strokeStyle = color; c.lineWidth = width; c.stroke();
  }
  function oval(c, x, y, rx, ry, fill, stroke = '#25323d', width = .035) {
    c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    c.fillStyle = fill; c.fill();
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function box(c, x, y, w, h, color, border = '#25323d') {
    c.fillStyle = color; c.fillRect(x, y, w, h);
    if (border) { c.strokeStyle = border; c.lineWidth = .04; c.strokeRect(x, y, w, h); }
  }
  function eyes(c, y = -.31, width = .5, angry = true) {
    if (angry) {
      path(c, [[-width, y-.08], [-.13, y+.03], [-.17, y+.14], [-width+.07, y+.1]], '#e4e9d1');
      path(c, [[width, y-.08], [.13, y+.03], [.17, y+.14], [width-.07, y+.1]], '#e4e9d1');
      line(c, [[-.28,y+.02],[-.28,y+.11]], '#26313a', .055);
      line(c, [[.28,y+.02],[.28,y+.11]], '#26313a', .055);
    } else {
      oval(c,-.26,y,.09,.13,'#d4d2bb'); oval(c,.26,y,.09,.13,'#d4d2bb');
    }
  }
  function nose(c, y = -.1) { line(c, [[0,y-.14],[-.08,y+.1],[.1,y+.1]], '#3c3c3b', .03); }
  function stitches(c, y, width = .42) {
    line(c,[[-width,y],[width,y]],'#32353a',.03);
    for (let x = -width+.05; x < width; x += .12) line(c,[[x,y-.07],[x,y+.07]],'#32353a',.025);
  }
  function crown(c, y = -.7, color = '#ecd269') {
    path(c,[[-.58,y+.17],[-.62,y-.24],[-.34,y-.02],[-.14,y-.3],[.04,y-.04],[.29,y-.28],[.39,y-.01],[.61,y-.24],[.56,y+.17]],color);
    box(c,-.56,y+.07,1.12,.13,color);
    for (let x = -.36; x < .5; x += .36) oval(c,x,y+.12,.035,.04,x<0?'#bd5c75':'#69a7a3',null);
  }
  function feet(c, walk, color) {
    for (const s of [-1,1]) {
      const lift = Math.sin(walk + (s>0?Math.PI:0))*.05;
      line(c,[[s*.29,.53],[s*.31,.83+lift]],'#35424c',.07);
      path(c,[[s*.31-.1,.8+lift],[s*.31+.17,.83+lift],[s*.31+.22,.91],[s*.31-.14,.91]],color);
    }
  }
  function walker(c, t, palette, e) {
    feet(c,t*8,palette[1]);
    const sway=Math.sin(t*6+e.phase||0)*.08;
    line(c,[[-.56,-.1],[-.83,.12+sway],[-.75,.43+sway]],palette[1],.055);
    line(c,[[.56,-.1],[.82,-.32-sway],[.92,-.16-sway]],palette[1],.055);
    oval(c,-.75,.43+sway,.06,.07,palette[2]); oval(c,.92,-.16-sway,.06,.07,palette[2]);
    path(c,[[-.59,-.8],[.52,-.87],[.6,.57],[-.54,.6]],palette[0]);
    box(c,-.51,-.7,.12,1.16,'#ffffff12',null);
    eyes(c,-.38,.5,false); nose(c,-.15); stitches(c,.28,.43);
    if((e.planetIndex||0)>2) line(c,[[-.02,-.8],[.1,-.57],[-.03,-.3]],'#66565a',.025);
  }
  function horn(c,t,palette,e) {
    feet(c,t*6,palette[1]);
    line(c,[[-.48,-.05],[-.76,.4]],'#465368',.045); line(c,[[.48,-.05],[.75,.4]],'#465368',.045);
    c.beginPath(); c.moveTo(-.48,.6); c.lineTo(-.5,-.2);
    c.bezierCurveTo(-.85,-.4,-.7,-.83,-.4,-.81);
    c.bezierCurveTo(-.1,-.96,.04,-.76,.19,-.83);
    c.bezierCurveTo(.53,-1.04,.81,-.6,.5,-.25); c.lineTo(.48,.6); c.closePath();
    c.fillStyle=palette[1]; c.fill(); c.strokeStyle='#293744'; c.lineWidth=.045; c.stroke();
    path(c,[[-.11,-.79],[.04,-1.2],[.23,-.79]],palette[2]);
    line(c,[[-.36,-.1],[-.31,.48]],'#ffffff24',.08);
    eyes(c,-.48,.42); nose(c,-.2); line(c,[[-.17,.19],[.18,.19]],'#273442',.04);
    if((e.planetIndex||0)===5) { oval(c,-.28,.34,.07,.04,'#b9e46d',null); oval(c,.3,.4,.06,.06,'#b9e46d',null); }
  }
  function skull(c,t,palette,e) {
    const flap=Math.sin(t*13+e.phase||0)*.2, wing=palette[2];
    for(const s of [-1,1]) {
      path(c,[[s*.45,-.15],[s*.77,-.44-flap],[s*.89,-.21-flap],[s*1.12,-.48-flap],[s*1.25,-.1],[s*.99,.02],[s*.91,.2],[s*.7,.06],[s*.54,.18]],wing);
      line(c,[[s*.65,-.04],[s*.96,-.16-flap]],'#51634b',.025);
    }
    c.beginPath(); c.moveTo(-.58,-.36); c.bezierCurveTo(-.76,-.86,.72,-.86,.59,-.37);
    c.lineTo(.35,.01); c.lineTo(.22,.03); c.lineTo(.2,.39); c.lineTo(-.2,.39); c.lineTo(-.23,.03); c.lineTo(-.37,.01); c.closePath();
    c.fillStyle=(e.planetIndex||0)===2?'#bc9bd2':'#d98577'; c.fill(); c.strokeStyle='#343748'; c.lineWidth=.045; c.stroke();
    eyes(c,-.36,.42); nose(c,-.12); stitches(c,.22,.14);
    if((e.planetIndex||0)>2)path(c,[[-.1,-.68],[.03,-1],[.17,-.68]],wing);
  }
  function flyer(c,t,palette,e) {
    const flap=Math.sin(t*14)*.15;
    path(c,[[-.72,-.36],[.43,-.44],[.72,-.2],[.65,.24],[-.49,.3],[-.8,.07]],palette[2]);
    path(c,[[-.72,-.36],[-.42,-.1],[.7,-.2],[.43,-.44]],'#c9e8df');
    path(c,[[-.79,.02],[-1.13,.19+flap],[-.8,.35+flap],[-.43,.18]],palette[1]);
    path(c,[[.66,-.06],[1.03,.11+flap],[.85,.35+flap],[.48,.2]],palette[1]);
    eyes(c,-.08,.45); line(c,[[-.28,.2],[.2,.2]],'#38534d',.025);
    line(c,[[-.4,.3],[-.43,.53],[-.23,.53]],'#475d61',.05); line(c,[[.32,.3],[.33,.51],[.53,.51]],'#475d61',.05);
    if((e.planetIndex||0)===4)path(c,[[-.53,.25],[-.4,.64],[-.25,.28]],'#f79c54',null);
  }
  function king(c,t,palette,e) {
    for(const s of [-1,1]) { box(c,s*.25-.1,.34,.22,.49,'#68667b'); path(c,[[s*.25-.12,.8],[s*.25+.24,.8],[s*.25+.27,.94],[s*.25-.14,.94]],'#a4938a'); }
    path(c,[[-.43,-.42],[-.74,-.34],[-.69,.7],[-.22,.64],[0,.76],[.23,.64],[.69,.7],[.74,-.34],[.43,-.42]],'#9d7469');
    path(c,[[-.34,-.33],[0,-.06],[.35,-.33],[.34,.56],[-.34,.56]],'#5b535d');
    for(let y=.1;y<.6;y+=.13)line(c,[[-.33,y],[.33,y]],'#aa9290',.025);
    for(const s of [-1,1]) path(c,[[s*.37,-.4],[s*.73,-.43],[s*.82,-.24],[s*.39,-.23]],'#4c555d');
    oval(c,0,-.57,.45,.4,'#aaa598'); eyes(c,-.62,.32); nose(c,-.41); line(c,[[-.12,-.25],[.16,-.25]],'#323641',.03); crown(c,-.92);
    const tilt=e.attackWindup>0?.35:Math.sin(t)*.05;
    c.save(); c.translate(.72,.07); c.rotate(tilt);
    line(c,[[0,-.04],[0,.35]],'#725141',.1);
    path(c,[[.06,-.14],[.85,-.14],[1.09,-.05],[.85,.04],[.06,.04]],'#f0d875');
    line(c,[[.15,-.25],[.15,.16]],'#d3bc63',.07); c.restore();
  }
  function mars(c,t,palette,e) {
    const walk=Math.sin(t*3)*.04;
    for(const s of [-1,1]) { box(c,s*.34-.15,.4,.3,.39,'#74535c'); box(c,s*.34-.21,.78+walk,.44,.16,'#c68c70'); }
    path(c,[[-.62,-.51],[.62,-.51],[.58,.44],[.28,.63],[-.28,.63],[-.58,.44]],'#ae6d59');
    path(c,[[-.47,-.44],[0,-.22],[.47,-.44],[.31,.2],[-.31,.2]],'#d2a171');
    for(const s of [-1,1]) { path(c,[[s*.5,-.47],[s*.88,-.4],[s*.84,.4],[s*.58,.46]],'#8c6260'); box(c,s*.75-.18,.28,.36,.28,'#c59076'); }
    path(c,[[-.36,-1],[.32,-1.04],[.43,-.6],[.24,-.39],[-.3,-.4],[-.44,-.64]],'#bf8e70');
    eyes(c,-.8,.3); nose(c,-.62); stitches(c,-.48,.23);
    path(c,[[-.27,-1.03],[-.12,-1.21],[.06,-1.03]],'#e7c18b');
  }
  function neptune(c,t,palette,e) {
    feet(c,t*3,'#8584ad');
    c.beginPath(); c.moveTo(0,-.85); c.bezierCurveTo(-.8,-.9,-.87,-.31,-.59,.13); c.lineTo(0,.72); c.lineTo(.61,.1); c.bezierCurveTo(.87,-.42,.64,-.85,0,-.85); c.closePath(); c.fillStyle='#a58bcc'; c.fill(); c.strokeStyle='#303249'; c.lineWidth=.045;c.stroke();
    line(c,[[-.48,-.55],[-.42,-.01],[0,.5]],'#c8b3e9',.06); eyes(c,-.4,.43); nose(c,-.18); line(c,[[-.15,.17],[.18,.17]],'#3b3650',.035);
    crown(c,-.9,'#80c7d2');
    line(c,[[.56,-.1],[.98,-.19]],'#8173ac',.12);
    line(c,[[1.02,.83],[1.02,-1.06]],'#5a677e',.09);
    line(c,[[.74,-.99],[.78,-.67],[1.02,-.5],[1.26,-.67],[1.3,-.99]],'#9bdce4',.07);
    for(const x of [.74,1.02,1.3])path(c,[[x-.08,-.97],[x,-1.18],[x+.08,-.97]],'#afe6e8');
  }
  function twins(c,t,palette,e) {
    const variant=e.twinIndex??e.id%2, bob=Math.sin(t*2+variant*Math.PI)*.06;
    c.translate(0,bob);
    path(c,[[-.7,-.5],[-.45,-.83],[.27,-.8],[.66,-.57],[.81,-.07],[.62,.48],[.27,.63],[-.43,.53],[-.76,.16]],variant?'#aa9a88':'#9b8175');
    line(c,[[-.38,-.79],[-.31,-.58],[-.48,-.4]],'#625653',.035);line(c,[[.65,.29],[.4,.2],[.38,.43]],'#625653',.035);
    eyes(c,-.33,.49);nose(c,-.13);line(c,[[-.2,.2],[.25,.2]],'#353740',.04);
    for(const s of [-1,1]) { const sway=Math.sin(t*4+s)*.09; line(c,[[s*.67,-.05],[s*.93,-.43+sway],[s*.94,-.83+sway]],'#827d74',.045); oval(c,s*.94,-.89+sway,.1,.13,'#b3aa96'); }
    path(c,[[-.3,.55],[0,.76],[.18,.91],[-.08,.79],[-.23,1.01]],'#ac9b85');
  }
  function fire(c,t,palette,e) {
    path(c,[[-.62,-.48],[.63,-.48],[.18,.84],[-.16,.84]],'#68505a');
    c.save();c.beginPath();c.moveTo(-.62,-.48);c.lineTo(.63,-.48);c.lineTo(.18,.84);c.lineTo(-.16,.84);c.clip();
    for(let q=-1;q<1.2;q+=.18){line(c,[[q,-.5],[q+1.3,.85]],'#b99783',.022);line(c,[[q,-.5],[q-1.3,.85]],'#b99783',.022);}c.restore();
    box(c,-.64,-.5,1.29,.12,'#b19885');
    const p=[[-.55,-.5],[-.7,-.85],[-.63,-1.2],[-.42,-.86],[-.28,-1.36],[-.14,-.99],[.05,-1.43],[.12,-.97],[.43,-1.35],[.39,-.89],[.66,-1.18],[.57,-.5]];
    path(c,p,'#f3b34e','#7e5145',.035);
    path(c,[[-.37,-.5],[-.4,-.88],[-.2,-.72],[-.08,-1.11],[.11,-.69],[.31,-.98],[.35,-.5]],'#ffdd73',null);
    eyes(c,-.64,.33);line(c,[[-.12,-.39],[.14,-.39]],'#473a46',.04);
    for(const s of [-1,1]){line(c,[[s*.61,-.4],[s*.92,-.12],[s*.97,.15]],'#7d5d59',.055);oval(c,s*.97,.16,.12,.15,'#bf7969');}
    if(e.attackWindup>0)for(const s of [-1,1])oval(c,s*.97,-.1,.12+.025*Math.sin(t*17),.15,'#ffc96b','#f09053');
  }
  function finalBoss(c,t,palette,e) {
    for(const s of [-1,1]){box(c,s*.28-.14,.32,.28,.5,'#665f72');box(c,s*.28-.19,.8,.42,.17,'#a8a2ae');}
    path(c,[[-.65,-.48],[-.31,-.54],[0,-.36],[.3,-.54],[.66,-.48],[.61,.39],[.26,.6],[-.26,.6],[-.61,.39]],'#858592');
    path(c,[[-.43,-.43],[0,-.22],[.43,-.43],[.19,.24],[-.2,.24]],'#b3abb1');
    path(c,[[-.13,-.21],[.13,-.21],[.23,.29],[0,.44],[-.23,.29]],'#6b596c');
    oval(c,0,.08,.07,.1,e.attackWindup>0?'#fff2af':'#ce8fa5','#e9bdd0');
    for(const s of [-1,1]){path(c,[[s*.58,-.5],[s*.9,-.42],[s*.85,.38],[s*.61,.43]],'#767684');box(c,s*.79-.17,.29,.34,.25,'#b1a1a5');for(let y=.34;y<.53;y+=.065)line(c,[[s*.79-.14,y],[s*.79+.14,y]],'#5d5e72',.025);}
    box(c,-.38,-1.11,.76,.65,'#a1a0aa');path(c,[[-.38,-1.11],[0,-1.21],[.38,-1.11],[.13,-1.04]],'#cac2bb');
    eyes(c,-.88,.31);nose(c,-.71);line(c,[[-.15,-.52],[.16,-.52]],'#353642',.035);
    for(const s of [-1,1])path(c,[[s*.26,-1.12],[s*.35,-1.34],[s*.42,-1.1]],'#b6b5c1');
    if(e.attackWindup>0) { c.strokeStyle='#edb7d2'; c.lineWidth=.025;c.strokeRect(-.46,-1.19,.92,.83); }
  }
  function worldDetails(c,e,t,palette) {
    const index=e.planetIndex||0;
    if(index===0 && e.kind==='walker') {
      box(c,-.76,-.3,.16,.57,'#6d7d95');
      line(c,[[.41,-.84],[.43,-1.11]],'#91b9d8',.035);
      oval(c,.43,-1.11,.045,.05,'#b8f1dc',null);
    } else if(index===1 && (e.kind==='walker'||e.kind==='horn')) {
      for(const s of [-1,1])path(c,[[s*.42,-.23],[s*.68,-.43],[s*.81,-.17],[s*.55,-.06]],'#c9906a');
    } else if(index===2) {
      for(const s of [-1,1])path(c,[[s*.51,-.15],[s*.83,-.32],[s*.74,.05],[s*.52,.18]],'#71c5cd');
      line(c,[[-.34,.34],[.31,.34]],'#9de4df',.025);
    } else if(index===3) {
      path(c,[[-.41,-.75],[-.5,-1.02],[-.27,-.83]],'#c0afa0');
      path(c,[[.39,-.68],[.67,-.84],[.55,-.47]],'#a08f85');
      line(c,[[.22,-.63],[.1,-.43],[.23,-.24]],'#544d50',.035);
    } else if(index===4) {
      for(const s of [-1,1]) {
        const flicker=Math.sin(t*11+s)*.06;
        path(c,[[s*.42,-.58],[s*.48,-1.02+flicker],[s*.67,-.67]],'#f2ab59','#81504c',.025);
      }
    } else if(index===5) {
      for(const s of [-1,1])line(c,[[s*.44,.28],[s*.7,.42],[s*.81,.12],[s*.95,.23]],'#9cc863',.055);
      oval(c,-.23,.37,.075,.05,'#c9e980',null);
      oval(c,.25,.44,.045,.04,'#c9e980',null);
    }
  }
  const normal={walker,horn,skull,flyer}, bosses={king,mars,neptune,twins,fire,final:finalBoss};
  function drawEnemy(c,e,time) {
    c.save();c.translate(e.x,e.y);c.scale(e.r,e.r);c.lineJoin='round';c.lineCap='round';
    const palette=palettes[Math.max(0,Math.min(5,e.planetIndex||0))];
    if(e.attackWindup>0){c.shadowColor='#ff986b';c.shadowBlur=14;}
    const animationTime=e.freeze>0?0:time;
    if(e.boss)(bosses[e.bossKind]||mars)(c,animationTime,palette,e);
    else { (normal[e.kind]||walker)(c,animationTime,palette,e); worldDetails(c,e,animationTime,palette); }
    c.shadowBlur=0;
    if(e.freeze>0){c.globalAlpha=.28;box(c,-.8,-1.15,1.6,2.08,'#8cddff','#b9f0ff');c.globalAlpha=1;}
    if(e.burn>0||e.poison>0){const color=e.burn>0?'#faad66':'#bee676';for(let i=0;i<3;i++)oval(c,(i-1)*.45,.55-Math.sin(time*4+i)*.15,.05,.08,color,null);}
    c.restore();
    const barY=e.y-e.r*(e.boss?1.55:1.33),width=e.r*1.8;
    c.save();c.fillStyle='#07101bc9';c.fillRect(e.x-width/2,barY,width,e.boss?6:4);c.fillStyle=e.boss?'#ffb68f':'#c5e8ac';c.fillRect(e.x-width/2,barY,width*Math.max(0,e.hp/e.maxHp),e.boss?6:4);c.restore();
  }
  root.TrazZArt={drawEnemy};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.TrazZArt;
})(typeof globalThis!=='undefined'?globalThis:this);
