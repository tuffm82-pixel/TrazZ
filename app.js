(() => {
  'use strict';
  const D = window.TrazZData, C = window.TrazZCore;
  const $ = selector => document.querySelector(selector);
  let raw;
  try { raw = JSON.parse(localStorage.getItem('trazz-save')); } catch { raw = null; }
  const save = C.normalizeSave(raw);
  const panel = $('#panel'), content = $('#panel-content');
  let storageWarning = false, selectedPlanet = D.planets[Math.min(save.completedPlanets.length, D.planets.length - 1)].id, selectedGun = save.gun, run = null, panelKind = '', toastTimer;
  const keys = new Set();
  const imageCache = new Map();
  function persist() {
    try { localStorage.setItem('trazz-save', JSON.stringify(save)); }
    catch { if (!storageWarning) { storageWarning = true; toast('Browser storage is unavailable. Progress lasts for this visit.'); } }
    updateStatus();
  }
  function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2800); }
  let audio;
  function sound(frequency = 420, duration = 0.065, volume = 0.035) {
    if (!save.sound) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const oscillator = audio.createOscillator(), gain = audio.createGain();
      oscillator.type = 'triangle'; oscillator.frequency.setValueAtTime(frequency, audio.currentTime); oscillator.frequency.exponentialRampToValueAtTime(frequency * .55, audio.currentTime + duration);
      gain.gain.setValueAtTime(volume, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + duration);
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + duration);
    } catch { /* The game remains usable without browser audio. */ }
  }
  document.addEventListener('click', e => { if (e.target.closest('button:not(:disabled)')) sound(560, .045, .018); });
  function character() { return D.characters.find(c => c.id === save.character); }
  function characterPath(c) { return c.image || 'assets/characters/scout.svg'; }
  function characterSprite(c) { return !c.image || c.image === 'assets/characters/scout.svg' ? 'assets/characters/scout-body.svg' : c.image; }
  function characterFilter(c) { return c.id === 'orbit' ? 'hue-rotate(155deg)' : c.id === 'vex' ? 'hue-rotate(245deg)' : ''; }
  function updateStatus() {
    $('#pilot-level').textContent = String(save.level).padStart(2, '0'); $('#credit-count').textContent = save.credits;
    const c = character(), image = $('#hero-character'); image.src = characterPath(c); image.style.filter = characterFilter(c); image.alt = `${c.name}, placeholder explorer artwork`;
    $('#hero-name').textContent = c.name.toUpperCase();
    $('#sound-toggle').setAttribute('aria-pressed', String(save.sound)); $('#sound-toggle').setAttribute('aria-label', save.sound ? 'Turn sound off' : 'Turn sound on');
    $('#sound-toggle').style.opacity = save.sound ? '1' : '.45';
    document.body.classList.toggle('motion-off', !save.motion);
    renderPlanetCards();
  }
  // A missing replacement image automatically falls back to the supplied placeholder.
  document.addEventListener('error', e => { if (e.target instanceof HTMLImageElement && !e.target.dataset.fallback) { e.target.dataset.fallback = 'true'; e.target.src = 'assets/characters/scout.svg'; } }, true);
  function orb(p) { return `<div class="planet-orb ${p.id}" style="--planet-color:${p.color}" aria-hidden="true">${p.image ? `<img src="${p.image}" alt="">` : ''}</div>`; }
  function planetState(p) { return save.completedPlanets.includes(p.id) ? 'CLEARED · REPLAY' : C.canPlayPlanet(save, p.id) ? 'READY TO PLAY' : 'LOCKED'; }
  function renderPlanetCards() {
    $('#planet-cards').innerHTML = D.planets.map((p, i) => `<button class="planet-card ${C.canPlayPlanet(save, p.id) ? '' : 'locked'}" data-planet="${p.id}" ${C.canPlayPlanet(save, p.id) ? '' : 'disabled'} aria-label="Level ${i + 1}: ${p.name}. ${planetState(p)}">${orb(p)}<span class="planet-info"><strong>${p.name}</strong><small>0${i + 1} / ${planetState(p)}</small></span><span class="mini-arrow">${save.completedPlanets.includes(p.id) ? '✓' : C.canPlayPlanet(save, p.id) ? '↗' : '⌁'}</span></button>`).join('');
  }
  function openPanel(kind, html, eyebrow = 'MISSION CONTROL') {
    panelKind = kind; content.innerHTML = html; $('#panel-eyebrow').textContent = eyebrow;
    if (!panel.open) panel.showModal();
  }
  function closePanel() { if (panelKind === 'pause' && run && !run.over) resume(); else panel.close(); }
  $('.close-button').addEventListener('click', closePanel);
  panel.addEventListener('cancel', e => { if (panelKind === 'pause') { e.preventDefault(); resume(); } });
  panel.addEventListener('click', e => { if (e.target === panel) { const b = panel.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) closePanel(); } });
  $('#sound-toggle').addEventListener('click', () => { save.sound = !save.sound; persist(); });
  $('#settings-button').addEventListener('click', showSettings);
  function showSettings() {
    openPanel('settings', `<h2 id="panel-title">Make yourself at home.</h2><p class="panel-description">A few little adjustments before your next adventure.</p><label class="settings-row"><span>Sound effects<small>Menu clicks, blaster shots, and cosmic collisions.</small></span><input id="setting-sound" type="checkbox" ${save.sound ? 'checked' : ''}></label><label class="settings-row"><span>Menu motion<small>Floating explorer and moving stars. Your device’s reduced motion preference is also respected.</small></span><input id="setting-motion" type="checkbox" ${save.motion ? 'checked' : ''}></label><p class="panel-description" style="margin-top:23px">Progress is saved automatically in this browser.</p>`);
    $('#setting-sound').onchange = e => { save.sound = e.target.checked; persist(); };
    $('#setting-motion').onchange = e => { save.motion = e.target.checked; persist(); };
  }
  $('#characters-button').addEventListener('click', showCharacters);
  function showCharacters() {
    openPanel('characters', `<h2 id="panel-title">Pick your little defender.</h2><p class="panel-description">Different personalities. The same fighting spirit. Choose your explorer.</p><div class="selection-grid">${D.characters.map(c => `<button class="selection-card ${save.character === c.id ? 'selected' : ''}" data-character="${c.id}" aria-pressed="${save.character === c.id}"><img src="${characterPath(c)}" style="filter:${characterFilter(c)}" alt="${c.name} placeholder"><small>${c.role}</small><h3>${c.name}</h3><p>${c.description}</p><span class="badge">${save.character === c.id ? 'EQUIPPED' : 'SELECT EXPLORER'}</span></button>`).join('')}</div><div class="dialog-footer"><span>All explorers share the same starting stats.</span><button class="action-button" id="character-done">READY TO GO</button></div>`, 'YOUR CREW');
    content.querySelectorAll('[data-character]').forEach(b => b.onclick = () => { save.character = b.dataset.character; persist(); showCharacters(); });
    $('#character-done').onclick = () => panel.close();
  }
  function gunArt(g) {
    if (g.image) return `<div class="gun-art"><img src="${g.image}" alt="${g.name}"></div>`;
    return `<div class="gun-art" style="--gun-color:${g.color}"><svg viewBox="0 0 150 90" role="img" aria-label="${g.name} placeholder"><g stroke="#101825" stroke-width="4" stroke-linejoin="round"><path d="M24 28h100l8 10-5 20H64L53 82H29l9-28H24Z" fill="#8195a0"/><path d="M16 23h108v24H16Z" fill="#c0c9c7"/><path d="M43 48h20l-9 28H33Z" fill="#4e626e"/><path d="M78 18h30v12H78Z" fill="#738892"/><path d="M122 29h18v15h-18Z" fill="#506573"/><path d="M30 31h53v8H30Z" fill="${g.color}"/><path d="M70 54v12H58" fill="none" stroke="#8195a0"/></g></svg></div>`;
  }
  $('#guns-button').addEventListener('click', () => { selectedGun = save.gun; showGuns(); });
  function showGuns() {
    const g = D.guns.find(g => g.id === selectedGun), unlocked = C.canEquip(save, g.id), rank = save.upgrades[g.id];
    openPanel('guns', `<h2 id="panel-title">A little more firepower.</h2><p class="panel-description">Earn credits in battle. Upgrade your favorites. Give the monsters something to worry about.</p><div class="selection-grid">${D.guns.map(w => `<button class="selection-card ${selectedGun === w.id ? 'selected' : ''}" data-gun="${w.id}" aria-pressed="${selectedGun === w.id}" style="--gun-color:${w.color}">${gunArt(w)}<small>${w.type}</small><h3>${w.name}</h3><div class="stat"><span>DAMAGE</span><span>${w.damage + save.upgrades[w.id] * 6}</span></div><div class="stat-bar"><i style="width:${Math.min(100, w.damage + save.upgrades[w.id] * 6)}%"></i></div><div class="stat"><span>FIRE RATE</span><span>${(1 / w.interval).toFixed(1)}/s</span></div><div class="stat-bar"><i style="width:${Math.min(100, 11 / w.interval)}%"></i></div><p>${w.description}</p><span class="badge">${!C.canEquip(save, w.id) ? `UNLOCKS AT LEVEL ${w.level}` : save.gun === w.id ? 'EQUIPPED' : 'AVAILABLE'} · ${save.upgrades[w.id]}/5</span></button>`).join('')}</div><div class="dialog-footer"><span><b>${save.credits}</b> credits · Level ${save.level}</span><div class="action-row"><button class="action-button outline" id="upgrade-gun" ${!unlocked || rank >= 5 || save.credits < C.upgradeCost(save, g.id) ? 'disabled' : ''}>${rank >= 5 ? 'MAX UPGRADE' : `UPGRADE · ${C.upgradeCost(save, g.id)} CR`}</button><button class="action-button" id="equip-gun" ${!unlocked || save.gun === g.id ? 'disabled' : ''}>${!unlocked ? `LEVEL ${g.level} REQUIRED` : save.gun === g.id ? 'EQUIPPED' : 'EQUIP GUN'}</button></div></div>`, 'THE ARMORY');
    content.querySelectorAll('[data-gun]').forEach(b => b.onclick = () => { selectedGun = b.dataset.gun; showGuns(); });
    $('#equip-gun').onclick = () => { if (C.canEquip(save, g.id)) { save.gun = g.id; persist(); showGuns(); toast(`${g.name} equipped.`); } };
    $('#upgrade-gun').onclick = () => { if (C.upgrade(save, g.id)) { persist(); showGuns(); toast(`${g.name} upgraded. +6 damage!`); } };
  }
  $('#play-button').addEventListener('click', () => showPlanets());
  $('#planet-cards').addEventListener('click', e => { const button = e.target.closest('[data-planet]'); if (button) { selectedPlanet = button.dataset.planet; showPlanets(); } });
  function showPlanets() {
    if (!C.canPlayPlanet(save, selectedPlanet)) selectedPlanet = 'moon';
    openPanel('planets', `<h2 id="panel-title">One planet at a time.</h2><p class="panel-description">Moon → Mars → Venus → Acid Planet. Clear ${D.wavesPerPlanet} waves and defeat the boss to unlock the next world.</p><div class="campaign-progress"><span>${save.completedPlanets.length} / ${D.planets.length} WORLDS CLEARED</span><div><i style="width:${save.completedPlanets.length / D.planets.length * 100}%"></i></div></div><div class="selection-grid level-path">${D.planets.map((p, i) => `<button class="selection-card level-card ${selectedPlanet === p.id ? 'selected' : ''} ${C.canPlayPlanet(save, p.id) ? '' : 'locked'}" data-destination="${p.id}" aria-pressed="${selectedPlanet === p.id}" ${C.canPlayPlanet(save, p.id) ? '' : 'disabled'}><span class="level-number">0${i + 1}</span>${orb(p)}<small>${p.label}</small><h3>${p.name}</h3><p>${C.canPlayPlanet(save, p.id) ? p.description : `Clear ${D.planets[i - 1].name} to unlock this world.`}</p><span class="level-state">${planetState(p)}</span></button>`).join('')}</div><div class="dialog-footer"><span>A / W / D aim · ← / → move · Space shoots</span><button class="action-button" id="launch-button">PLAY LEVEL ${D.planets.findIndex(p => p.id === selectedPlanet) + 1} · ${D.planets.find(p => p.id === selectedPlanet).name.toUpperCase()} ↗</button></div>`, 'YOUR JOURNEY / SELECT A LEVEL');
    content.querySelectorAll('[data-destination]').forEach(b => b.onclick = () => { if (!C.canPlayPlanet(save, b.dataset.destination)) return; selectedPlanet = b.dataset.destination; showPlanets(); content.querySelector(`[data-destination="${selectedPlanet}"]`).focus(); });
    $('#launch-button').onclick = startGame;
  }
  $('#how-button').addEventListener('click', () => openPanel('help', `<h2 id="panel-title">Small hero. Big fight.</h2><p class="panel-description">Start on the Moon. Clear each planet to unlock the next: Mars, Venus, then the Acid Planet.</p><ul class="instructions"><li><strong>01 / Turn your gun</strong><kbd>A</kbd> aims left, <kbd>W</kbd> aims up, and <kbd>D</kbd> aims right. Your gun keeps its last direction.</li><li><strong>02 / Move and shoot</strong>Use <kbd>←</kbd> and <kbd>→</kbd> to move. Hold <kbd>SPACE</kbd> to shoot. Touch devices have matching controls.</li><li><strong>03 / Grow stronger</strong>Defeat enemies for credits and XP. Every 200 XP earns a level. Upgrade guns in the armory; new guns unlock at levels 3 and 5.</li><li><strong>04 / Unlock the next world</strong>Clear ${D.wavesPerPlanet} waves, including the final boss, to complete a planet. Clearing a wave restores 15 health. Press <kbd>ESC</kbd> to pause.</li></ul><p class="panel-description">Artwork slots are ready for your character, planets, guns, and monsters.</p>`, 'FIELD GUIDE'));
  // All runtime sprites use the same image slots as the menu.
  function loadedImage(path) {
    if (!path) return null;
    if (!imageCache.has(path)) { const img = new Image(); img.src = path; imageCache.set(path, img); }
    const img = imageCache.get(path); return img.complete && img.naturalWidth ? img : null;
  }
  if (D.background) {
    const bg = new Image(); bg.onload = () => { $('#stars').style.background = `linear-gradient(#10182555,#10182555),url("${D.background}") center/cover`; }; bg.src = D.background;
  }
  const starCanvas = $('#stars'), sx = starCanvas.getContext('2d');
  let stars = [], screenWidth = 0, screenHeight = 0;
  function resizeStars() {
    screenWidth = innerWidth; screenHeight = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    starCanvas.width = screenWidth * dpr; starCanvas.height = screenHeight * dpr; sx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.min(190, Math.round(screenWidth * screenHeight / 6500)) }, () => ({ x: Math.random() * screenWidth, y: Math.random() * screenHeight, r: Math.random() * 1.05 + .25, a: Math.random() * .38 + .15, phase: Math.random() * 6 }));
  }
  function drawStars(time) {
    sx.clearRect(0, 0, screenWidth, screenHeight);
    const motion = save.motion && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    stars.forEach(s => { sx.globalAlpha = s.a + (motion ? Math.sin(time * .0006 + s.phase) * .12 : 0); sx.fillStyle = '#c6d3dc'; sx.beginPath(); sx.arc(s.x, s.y, s.r, 0, Math.PI * 2); sx.fill(); }); sx.globalAlpha = 1;
  }
  addEventListener('resize', resizeStars); resizeStars();
  const canvas = $('#game'), ctx = canvas.getContext('2d'), W = 1200, H = 720, floor = 590;
  canvas.width = W; canvas.height = H;
  let lastTime = 0, announcementTimer = 0;
  function announce(message, seconds = 2.2) { $('#wave-announcement').textContent = message; $('#wave-announcement').style.opacity = '1'; announcementTimer = seconds; }
  function startGame() {
    if (!C.canPlayPlanet(save, selectedPlanet)) { showPlanets(); return; }
    panel.close(); panelKind = ''; keys.clear(); $('#menu').hidden = true; $('#game-screen').hidden = false;
    run = { planet: D.planets.find(p => p.id === selectedPlanet), player: { x: W / 2, y: floor - 48, hp: 100, invincible: 0, aim: 'right' }, wave: 0, bullets: [], enemies: [], particles: [], toSpawn: 0, spawnTimer: 1, waveWait: 0, cooldown: 0, paused: false, over: false, credits: 0, kills: 0, bossSpawned: false };
    $('#game-location').textContent = `LEVEL ${D.planets.findIndex(p => p.id === selectedPlanet) + 1} / ${run.planet.name.toUpperCase()}`; $('#health-bar').style.width = '100%'; $('#aim-label').textContent = 'AIM RIGHT'; nextWave(); canvas.focus();
  }
  function nextWave() {
    run.wave++; run.spec = C.waveSpec(run.wave); run.toSpawn = run.spec.count; run.spawnTimer = 1.2; run.waveWait = 0; run.bossSpawned = false;
    run.spec.healthScale += D.planets.findIndex(p => p.id === run.planet.id) * .2;
    $('#wave-label').textContent = `WAVE ${run.wave} / ${D.wavesPerPlanet}`; announce(run.spec.boss ? `FINAL WAVE · BOSS INCOMING` : `WAVE ${run.wave} · STAY SHARP`);
  }
  function spawnEnemy(boss = false) {
    const type = boss ? D.enemies[2] : D.enemies[Math.random() < .32 ? 1 : 0], flying = type.id === 'wisp', r = boss ? 60 : flying ? 21 : 25;
    run.enemies.push({ ...type, x: Math.random() < .5 ? -70 : W + 70, y: flying ? 170 + Math.random() * 190 : floor - r, r, maxHp: type.health * run.spec.healthScale, hp: type.health * run.spec.healthScale, phase: Math.random() * 6 });
  }
  function shoot() {
    const p = run.player, gun = D.guns.find(g => g.id === save.gun), dx = p.aim === 'left' ? -1 : p.aim === 'up' ? 0 : 1, dy = p.aim === 'up' ? -1 : 0;
    run.bullets.push({ x: p.x + dx * 36, y: p.y - 8 + dy * 34, vx: dx * 700, vy: dy * 700, life: 2, damage: gun.damage + save.upgrades[gun.id] * 6, color: gun.color });
    run.cooldown = gun.interval; sound(650, .07, .025);
  }
  function burst(x, y, color, count = 8) { for (let i = 0; i < count; i++) { const angle = Math.random() * Math.PI * 2, speed = 35 + Math.random() * 150; run.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: .4 + Math.random() * .3, color }); } }
  function updateGame(dt) {
    const p = run.player;
    p.x = Math.max(35, Math.min(W - 35, p.x + C.movement(keys) * 280 * dt));
    p.invincible = Math.max(0, p.invincible - dt); run.cooldown -= dt;
    if (keys.has('Space') && run.cooldown <= 0) shoot();
    run.spawnTimer -= dt;
    if (run.toSpawn > 0 && run.spawnTimer <= 0) { spawnEnemy(); run.toSpawn--; run.spawnTimer = Math.max(.4, 1.5 - run.wave * .06); }
    if (!run.toSpawn && run.spec.boss && !run.bossSpawned) { spawnEnemy(true); run.bossSpawned = true; announce('THE DEVOURER HAS ARRIVED'); }
    for (const b of run.bullets) { b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt; }
    for (const enemy of run.enemies) {
      enemy.phase += dt * 3;
      const targetY = p.y, targetX = p.x, distance = Math.hypot(targetX - enemy.x, targetY - enemy.y) || 1;
      enemy.x += (targetX - enemy.x) / distance * enemy.speed * dt;
      if (enemy.id === 'wisp') enemy.y += (targetY - enemy.y) / distance * enemy.speed * dt;
      for (const bullet of run.bullets) {
        if (bullet.life > 0 && enemy.hp > 0 && Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < enemy.r + 7) {
          enemy.hp -= bullet.damage; bullet.life = 0; burst(bullet.x, bullet.y, bullet.color, 4);
          if (enemy.hp <= 0) { C.reward(save, enemy.credits, enemy.xp); run.credits += enemy.credits; run.kills++; burst(enemy.x, enemy.y, enemy.id === 'boss' ? '#ff986e' : '#a8d4ae', 16); persist(); sound(130, .15, .04); }
        }
      }
      if (enemy.hp > 0 && p.invincible <= 0 && Math.hypot(enemy.x - p.x, enemy.y - p.y) < enemy.r + 23) {
        p.hp = Math.max(0, p.hp - enemy.damage); p.invincible = 1; enemy.x += enemy.x < p.x ? -40 : 40; burst(p.x, p.y, '#ff986e'); $('#health-bar').style.width = p.hp + '%'; sound(85, .18, .05);
        if (!p.hp) { endGame(); return; }
      }
    }
    run.bullets = run.bullets.filter(b => b.life > 0 && b.x > -30 && b.x < W + 30 && b.y > -30);
    run.enemies = run.enemies.filter(e => e.hp > 0);
    for (const p of run.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }
    run.particles = run.particles.filter(p => p.life > 0);
    if (!run.toSpawn && !run.enemies.length) {
      if (run.wave >= D.wavesPerPlanet) { completeLevel(); return; }
      if (!run.waveWait) { run.waveWait = 3; p.hp = Math.min(100, p.hp + 15); $('#health-bar').style.width = p.hp + '%'; save.bestWave = Math.max(save.bestWave, run.wave); persist(); announce('WAVE CLEAR · +15 HEALTH'); }
      run.waveWait -= dt; if (run.waveWait <= 0) nextWave();
    }
    announcementTimer -= dt; if (announcementTimer <= 0) $('#wave-announcement').style.opacity = '0';
  }
  function drawGame(time) {
    const p = run.player, planet = run.planet;
    const gradient = ctx.createLinearGradient(0, 0, 0, H); gradient.addColorStop(0, '#101825'); gradient.addColorStop(1, planet.sky); ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, H);
    const scenery = loadedImage(planet.background);
    if (scenery) ctx.drawImage(scenery, 0, 0, W, H);
    ctx.fillStyle = '#d7dfdd'; for (let i = 0; i < 90; i++) { ctx.globalAlpha = .2 + (i % 4) * .12; ctx.fillRect((i * 137.5) % W, (i * 77.3) % 520, i % 5 ? 1 : 2, i % 5 ? 1 : 2); } ctx.globalAlpha = 1;
    ctx.fillStyle = planet.color; ctx.globalAlpha = .15; ctx.beginPath(); ctx.arc(960, 175, 95, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = planet.ground + '45'; ctx.beginPath(); ctx.moveTo(0, floor); for (let x = 0; x <= W; x += 60) ctx.lineTo(x, floor - 25 - Math.sin(x * .013) * 22 - Math.cos(x * .021) * 16); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    ctx.fillStyle = planet.ground; ctx.fillRect(0, floor, W, H - floor); ctx.fillStyle = planet.color; ctx.fillRect(0, floor, W, 3);
    ctx.globalAlpha = .2; ctx.fillStyle = '#101825'; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.ellipse((i * 147) % W, floor + 18 + (i * 43) % 100, 9 + (i % 4) * 5, 3, 0, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1;
    for (const enemy of run.enemies) drawEnemy(enemy, time);
    if (p.invincible <= 0 || Math.floor(time / 80) % 2 === 0) {
      const img = loadedImage(characterSprite(character()));
      ctx.save(); ctx.translate(p.x, p.y); if (p.aim === 'left') ctx.scale(-1, 1); ctx.filter = characterFilter(character());
      if (img) ctx.drawImage(img, -43, -55, 86, 103); else { ctx.fillStyle = character().color; ctx.fillRect(-18, -23, 36, 62); ctx.beginPath(); ctx.arc(0, -28, 28, 0, Math.PI * 2); ctx.fill(); }
      ctx.filter = 'none'; ctx.restore();
      const gun = D.guns.find(g => g.id === save.gun), gunImg = loadedImage(gun.image);
      ctx.save(); ctx.translate(p.x, p.y - 8); ctx.rotate(p.aim === 'up' ? -Math.PI / 2 : p.aim === 'left' ? Math.PI : 0);
      if (gunImg) ctx.drawImage(gunImg, 12, -12, 36, 24); else { ctx.fillStyle = '#aabcc4'; ctx.fillRect(12, -7, 29, 14); ctx.fillStyle = gun.color; ctx.fillRect(24, -4, 19, 5); } ctx.restore();
    }
    for (const b of run.bullets) { ctx.strokeStyle = b.color; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * .018, b.y - b.vy * .018); ctx.stroke(); }
    for (const p of run.particles) { ctx.globalAlpha = Math.min(1, p.life * 2); ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 4, 4); } ctx.globalAlpha = 1;
    ctx.fillStyle = '#d0d8d7'; ctx.font = '13px Consolas, monospace'; ctx.fillText(`+${run.credits} CREDITS  /  ${run.kills} DEFEATED`, 40, H - 55);
  }
  function drawEnemy(e, time) {
    const img = loadedImage(e.image), bob = e.id === 'wisp' ? Math.sin(e.phase) * 5 : 0;
    ctx.save(); ctx.translate(e.x, e.y + bob);
    if (img) ctx.drawImage(img, -e.r, -e.r, e.r * 2, e.r * 2);
    else {
      const color = e.id === 'boss' ? '#b78294' : e.id === 'wisp' ? '#99cbd2' : '#a6bc86';
      ctx.fillStyle = color; ctx.strokeStyle = '#172331'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(0, 0, e.r, e.r * .8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (e.id !== 'wisp') { ctx.beginPath(); ctx.moveTo(-e.r * .7, e.r * .4); ctx.lineTo(-e.r, e.r); ctx.moveTo(e.r * .7, e.r * .4); ctx.lineTo(e.r, e.r); ctx.stroke(); }
      ctx.fillStyle = '#172331'; ctx.fillRect(-e.r * .48, -8, e.r * .25, 10); ctx.fillRect(e.r * .23, -8, e.r * .25, 10); ctx.fillStyle = '#ecf3d0'; ctx.fillRect(-e.r * .42, -8, 3, 4); ctx.fillRect(e.r * .29, -8, 3, 4);
      if (e.id === 'boss') { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(-40, -25); ctx.lineTo(-46, -65); ctx.lineTo(-15, -40); ctx.moveTo(40, -25); ctx.lineTo(46, -65); ctx.lineTo(15, -40); ctx.fill(); }
    }
    if (e.hp < e.maxHp || e.id === 'boss') { ctx.fillStyle = '#101825'; ctx.fillRect(-e.r, -e.r - 15, e.r * 2, 4); ctx.fillStyle = '#ff986e'; ctx.fillRect(-e.r, -e.r - 15, e.r * 2 * e.hp / e.maxHp, 4); }
    ctx.restore();
  }
  function pause() {
    if (!run || run.over || run.paused) return;
    run.paused = true; keys.clear();
    openPanel('pause', `<h2 id="panel-title">Take a breath, explorer.</h2><p class="panel-description">Your adventure will be right here.</p><div class="action-row"><button class="action-button" id="resume-button">KEEP FIGHTING</button><button class="action-button outline" id="return-menu">MAIN MENU</button></div>`, 'PAUSED / WAVE ' + run.wave);
    $('#resume-button').onclick = resume; $('#return-menu').onclick = returnToMenu;
  }
  function resume() { panel.close(); panelKind = ''; if (run && !run.over) run.paused = false; keys.clear(); }
  function returnToMenu() { panel.close(); panelKind = ''; run = null; keys.clear(); $('#game-screen').hidden = true; $('#menu').hidden = false; persist(); $('#play-button').focus(); }
  function endGame() {
    run.over = true; keys.clear(); persist();
    openPanel('gameover', `<h2 id="panel-title">Every hero starts somewhere.</h2><p class="panel-description">The galaxy hasn’t seen the last of you. Your earned credits and XP are saved. Beat this planet’s boss to unlock the next world.</p><div class="run-stats"><div><strong>${run.wave}</strong><span>WAVE REACHED</span></div><div><strong>${run.kills}</strong><span>DEFEATED</span></div><div><strong>+${run.credits}</strong><span>CREDITS</span></div></div><div class="action-row"><button class="action-button" id="retry-button">RETRY THIS LEVEL ↗</button><button class="action-button outline" id="return-menu">MAIN MENU</button></div>`, 'MISSION FAILED / PILOT LEVEL ' + save.level);
    $('#retry-button').onclick = startGame; $('#return-menu').onclick = returnToMenu;
  }
  function completeLevel() {
    run.over = true; keys.clear();
    C.completePlanet(save, run.planet.id); save.bestWave = Math.max(save.bestWave, run.wave); persist();
    const next = D.planets[D.planets.findIndex(p => p.id === run.planet.id) + 1];
    openPanel('victory', `<h2 id="panel-title">${run.planet.name} cleared!</h2><p class="panel-description">${next ? `Boss defeated. ${next.name} is now unlocked — your next mission is ready.` : 'Boss defeated. You made it from the Moon to the Acid Planet. Every world is now open to replay.'}</p><div class="run-stats"><div><strong>${run.wave}</strong><span>WAVES CLEARED</span></div><div><strong>${run.kills}</strong><span>DEFEATED</span></div><div><strong>+${run.credits}</strong><span>CREDITS</span></div></div><div class="action-row">${next ? `<button class="action-button" id="next-level">NEXT LEVEL · ${next.name.toUpperCase()} ↗</button>` : ''}<button class="action-button ${next ? 'outline' : ''}" id="level-select">LEVEL SELECT</button><button class="action-button outline" id="return-menu">MAIN MENU</button></div>`, next ? 'LEVEL COMPLETE / NEW WORLD UNLOCKED' : 'CAMPAIGN COMPLETE');
    if (next) $('#next-level').onclick = () => { selectedPlanet = next.id; startGame(); };
    $('#level-select').onclick = () => { selectedPlanet = (next || run.planet).id; returnToMenu(); showPlanets(); };
    $('#return-menu').onclick = () => { selectedPlanet = (next || run.planet).id; returnToMenu(); };
    sound(880, .3, .05);
  }
  // Closing a results dialog returns home; it cannot leave the player in a dead game.
    panel.addEventListener('close', () => { if (run?.over && ['gameover', 'victory'].includes(panelKind)) returnToMenu(); });
  $('#pause-button').onclick = pause;
  function pressControl(key) {
    if (!run || run.over || run.paused || panel.open) return;
    keys.add(key);
    const aim = C.aimForKey(key);
    if (aim) { run.player.aim = aim; $('#aim-label').textContent = `AIM ${aim.toUpperCase()}`; }
  }
  document.addEventListener('keydown', e => {
    const key = e.code === 'Space' ? 'Space' : e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (e.key === 'Escape' && run && !panel.open) { e.preventDefault(); pause(); return; }
    if (!run || panel.open || run.over) return;
    if (['Space', 'ArrowLeft', 'ArrowRight', 'a', 'w', 'd'].includes(key)) { e.preventDefault(); pressControl(key); }
  });
  document.addEventListener('keyup', e => keys.delete(e.code === 'Space' ? 'Space' : e.key.length === 1 ? e.key.toLowerCase() : e.key));
  document.querySelectorAll('[data-control]').forEach(b => {
    b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); pressControl(b.dataset.control); });
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) b.addEventListener(event, () => keys.delete(b.dataset.control));
  });
  addEventListener('blur', () => { keys.clear(); pause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { keys.clear(); pause(); } });
  function frame(time) {
    const dt = Math.min(.04, (time - lastTime) / 1000 || 0); lastTime = time;
    if (run) { if (!run.paused && !run.over) updateGame(dt); if (run) drawGame(time); }
    else drawStars(time);
    requestAnimationFrame(frame);
  }
  updateStatus(); requestAnimationFrame(frame);
})();
