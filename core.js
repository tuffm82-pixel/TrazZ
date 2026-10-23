(function (root) {
  const data = typeof module !== 'undefined' && module.exports ? require('./data.js') : root.TrazZData;
  const number = (value, fallback, max = Number.MAX_SAFE_INTEGER) => Number.isFinite(value) ? Math.min(max, Math.max(0, Math.floor(value))) : fallback;
  function normalizeSave(raw) {
    raw = raw && typeof raw === 'object' ? raw : {};
    const xp = number(raw.xp, 0);
    const save = { xp, level: 1 + Math.floor(xp / 200), credits: number(raw.credits, 0), character: data.characters.some(c => c.id === raw.character) ? raw.character : 'scout', gun: 'pulse', upgrades: {}, sound: raw.sound !== false, motion: raw.motion !== false, bestWave: number(raw.bestWave, 0) };
    for (const gun of data.guns) save.upgrades[gun.id] = number(raw.upgrades?.[gun.id], 0, 5);
    save.completedPlanets = [];
    for (const planet of data.planets) {
      if (!Array.isArray(raw.completedPlanets) || !raw.completedPlanets.includes(planet.id)) break;
      save.completedPlanets.push(planet.id);
    }
    if (canEquip(save, raw.gun)) save.gun = raw.gun;
    return save;
  }
  function canEquip(save, id) { const gun = data.guns.find(g => g.id === id); return !!gun && save.level >= gun.level; }
  function upgradeCost(save, id) { return 60 * ((save.upgrades[id] || 0) + 1); }
  function upgrade(save, id) {
    if (!canEquip(save, id) || save.upgrades[id] >= 5 || save.credits < upgradeCost(save, id)) return false;
    save.credits -= upgradeCost(save, id); save.upgrades[id]++; return true;
  }
  function reward(save, credits, xp) { save.credits += number(credits, 0); save.xp += number(xp, 0); save.level = 1 + Math.floor(save.xp / 200); }
  function waveSpec(wave) { return { count: 4 + wave * 2, boss: wave % 5 === 0, healthScale: 1 + (wave - 1) * 0.12 }; }
  function canPlayPlanet(save, id) { const index = data.planets.findIndex(p => p.id === id); return index >= 0 && index <= save.completedPlanets.length; }
  function completePlanet(save, id) {
    if (!canPlayPlanet(save, id)) return false;
    if (!save.completedPlanets.includes(id)) save.completedPlanets.push(id);
    return true;
  }
  function aimForKey(key) { return ({ a: 'left', w: 'up', d: 'right' })[key] || null; }
  function movement(keys) { return (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0); }
  const api = { normalizeSave, canEquip, upgradeCost, upgrade, reward, waveSpec, canPlayPlanet, completePlanet, aimForKey, movement };
  root.TrazZCore = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
