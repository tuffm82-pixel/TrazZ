const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('../upgrade-catalog.js');
const D = require('../data.js');
const C = require('../core.js');

test('all twenty-six purchasable guns have artwork, projectiles, and complete upgrade trees', () => {
  assert.equal(D.guns.length, 26);
  assert.equal(new Set(D.guns.map(g => g.id)).size, 26);
  for (const gun of D.guns) {
    assert.ok(fs.existsSync(path.join(__dirname, '..', gun.image)), gun.id + ' gun art');
    assert.ok(fs.existsSync(path.join(__dirname, '..', 'assets', 'bullets', gun.id + '.svg')), gun.id + ' bullet art');
    assert.equal(gun.upgradeTree.nodes.length, 9, gun.id + ' complete tree');
    assert.equal(new Set(gun.upgradeTree.nodes.map(n => n.tier + '/' + n.column)).size, 9, gun.id + ' unique grid positions');
  }
  for (const id of ['wrath', 'freezepistol', 'laze', 'triangulox', 'vstruk', 'curver', 'glockbow', 'glacierar']) assert.equal(D.guns.find(g => g.id === id).rarity, 'mythic');
});

test('every gun enforces three first choices, two middle choices, and the matching final choice', () => {
  const pairs = [['left', 'middle', 't3-lm'], ['left', 'right', 't3-lr'], ['middle', 'right', 't3-mr']];
  for (const gun of D.guns) for (const [a, b, final] of pairs) {
    const save = C.normalizeSave({ version: 2, gems: 10000, ownedGuns: ['pulse', gun.id], gun: gun.id });
    assert.equal(C.buyNode(save, gun.id, 't2-' + a), false, gun.id + ' middle locked');
    for (const option of ['left', 'middle', 'right']) assert.equal(C.buyNode(save, gun.id, 't1-' + option), true);
    assert.equal(C.buyNode(save, gun.id, 't2-' + a), true);
    assert.equal(C.buyNode(save, gun.id, final), false, gun.id + ' final requires both choices');
    assert.equal(C.buyNode(save, gun.id, 't2-' + b), true);
    for (const option of ['left', 'middle', 'right'].filter(o => o !== a && o !== b)) assert.equal(C.buyNode(save, gun.id, 't2-' + option), false, gun.id + ' only two middle choices');
    for (const node of gun.upgradeTree.nodes.filter(n => n.tier === 3 && n.id !== final)) assert.equal(C.buyNode(save, gun.id, node.id), false, gun.id + ' wrong pair blocked');
    assert.equal(C.buyNode(save, gun.id, final), true, gun.id + ' correct pair available');
    const balance = save.gems;
    assert.equal(C.buyNode(save, gun.id, final), false, gun.id + ' no double purchase');
    assert.equal(save.gems, balance);
    C.resetTree(save, gun.id);
    assert.equal(save.gems, 10000, gun.id + ' full refund');
    C.resetTree(save, gun.id);
    assert.equal(save.gems, 10000, gun.id + ' no double refund');
  }
});

test('gun purchases use coins while tree upgrades use gems', () => {
  const target = D.guns.find(g => g.cost > 0);
  const save = C.normalizeSave({ version: 2, coins: target.cost, gems: 10000 });
  assert.equal(C.buyGun(save, target.id), true);
  assert.equal(save.coins, 0);
  assert.equal(save.gems, 10000);
  const node = target.upgradeTree.nodes.find(n => n.tier === 1);
  assert.equal(C.buyNode(save, target.id, node.id), true);
  assert.equal(save.gems, 10000 - node.cost);
  assert.equal(save.coins, 0);
});
