const { test } = require('node:test');
const assert = require('node:assert/strict');
const core = require('../core.js');
test('a new pilot starts with the starter gun and no earned credits', () => {
  const save = core.normalizeSave(null);
  assert.equal(save.gun, 'pulse'); assert.equal(save.credits, 0); assert.equal(save.level, 1);
});
test('corrupted saves cannot grant invalid weapons or negative money', () => {
  const save = core.normalizeSave({ gun: 'missing', credits: -20, xp: 'broken', upgrades: { pulse: 90 } });
  assert.equal(save.gun, 'pulse'); assert.equal(save.credits, 0); assert.equal(save.xp, 0); assert.equal(save.upgrades.pulse, 5);
});
test('upgrading requires enough credits and does not spend on failure', () => {
  const save = core.normalizeSave(null);
  assert.equal(core.upgrade(save, 'pulse'), false); assert.equal(save.credits, 0);
  save.credits = 100;
  assert.equal(core.upgrade(save, 'pulse'), true); assert.equal(save.upgrades.pulse, 1); assert.equal(save.credits, 40);
});
test('guns unlock at their required pilot level', () => {
  const save = core.normalizeSave(null);
  assert.equal(core.canEquip(save, 'nova'), false);
  core.reward(save, 0, 600);
  assert.equal(save.level, 4); assert.equal(core.canEquip(save, 'nova'), true);
});
test('boss waves arrive every fifth wave', () => {
  assert.equal(core.waveSpec(4).boss, false); assert.equal(core.waveSpec(5).boss, true);
  assert.ok(core.waveSpec(6).count > core.waveSpec(1).count);
});
test('the campaign starts on the Moon with later worlds locked', () => {
  const save = core.normalizeSave(null);
  assert.equal(core.canPlayPlanet(save, 'moon'), true);
  for (const id of ['mars', 'venus', 'acid', 'missing']) assert.equal(core.canPlayPlanet(save, id), false);
});
test('clearing a planet unlocks only the next planet, and replays stay available', () => {
  const save = core.normalizeSave(null);
  assert.equal(core.completePlanet(save, 'venus'), false);
  for (const id of ['moon', 'mars', 'venus', 'acid']) {
    assert.equal(core.canPlayPlanet(save, id), true);
    assert.equal(core.completePlanet(save, id), true);
    assert.equal(core.canPlayPlanet(save, id), true);
  }
  core.completePlanet(save, 'moon');
  assert.deepEqual(save.completedPlanets, ['moon', 'mars', 'venus', 'acid']);
  assert.deepEqual(core.normalizeSave(JSON.parse(JSON.stringify(save))).completedPlanets, save.completedPlanets);
});
test('old saves retain earned progress but do not skip the Moon', () => {
  const save = core.normalizeSave({ xp: 500, credits: 200, gun: 'nova', completedPlanets: ['acid', 'mars'] });
  assert.equal(save.gun, 'nova'); assert.equal(save.credits, 200);
  assert.deepEqual(save.completedPlanets, []);
  assert.equal(core.canPlayPlanet(save, 'mars'), false);
});
test('A W D aim and arrow keys move independently', () => {
  assert.equal(core.aimForKey('a'), 'left'); assert.equal(core.aimForKey('w'), 'up'); assert.equal(core.aimForKey('d'), 'right');
  assert.equal(core.aimForKey('ArrowLeft'), null);
  assert.equal(core.movement(new Set(['a', 'w', 'd'])), 0);
  assert.equal(core.movement(new Set(['ArrowLeft'])), -1);
  assert.equal(core.movement(new Set(['ArrowRight'])), 1);
  assert.equal(core.movement(new Set(['ArrowLeft', 'ArrowRight'])), 0);
});
