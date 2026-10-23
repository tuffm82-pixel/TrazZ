/* Replace each image: null with a local image path when the final artwork is ready.
   Background example: 'assets/backgrounds/stars.jpg'. Transparent PNGs work best for sprites. */
(function (root) {
  const data = {
    background: null,
    characters: [
      { id: 'scout', name: 'The Scout', role: 'EXPLORER CLASS', color: '#ff8559', image: 'assets/characters/scout.svg', description: 'Small steps. Big firepower. Your first defender of the galaxy.' },
      { id: 'orbit', name: 'Orbit', role: 'EXPLORER CLASS', color: '#82d9df', image: null, description: 'A cool-headed explorer with a taste for the unknown.' },
      { id: 'vex', name: 'Vex', role: 'EXPLORER CLASS', color: '#c2a0f0', image: null, description: 'The galaxy is a big place. Vex is ready for all of it.' }
    ],
    guns: [
      { id: 'pulse', name: 'Pulse Pistol', type: 'SIDEARM', level: 1, damage: 24, interval: 0.25, color: '#ff976d', image: null, description: 'Your trusty first line of defense. Steady, reliable, ready.' },
      { id: 'nova', name: 'Nova Blaster', type: 'ENERGY RIFLE', level: 3, damage: 17, interval: 0.12, color: '#8bdde1', image: null, description: 'A rapid stream of plasma for when things get crowded.' },
      { id: 'meteor', name: 'Meteor Cannon', type: 'HEAVY WEAPON', level: 5, damage: 70, interval: 0.65, color: '#c3a1f0', image: null, description: 'Slow shots. Cosmic impact. Make every hit count.' }
    ],
    enemies: [
      { id: 'crawler', name: 'Space Crawler', health: 40, speed: 32, damage: 12, credits: 10, xp: 16, image: null },
      { id: 'wisp', name: 'Void Wisp', health: 25, speed: 52, damage: 8, credits: 12, xp: 20, image: null },
      { id: 'boss', name: 'The Devourer', health: 600, speed: 17, damage: 28, credits: 100, xp: 150, image: null }
    ],
    wavesPerPlanet: 5,
    // image: planet thumbnail. background: full gameplay scenery. Add your pictures here.
    planets: [
      { id: 'moon', name: 'Moon', label: 'THE FIRST STEP', color: '#c1c7d2', sky: '#202736', ground: '#606979', image: null, background: null, description: 'Your first mission. Defend the Moon and defeat its boss to unlock Mars.' },
      { id: 'mars', name: 'Mars', label: 'THE RED FRONTIER', color: '#e78862', sky: '#211a27', ground: '#795044', image: null, background: null, description: 'Beyond the Moon lies the red frontier. Clear Mars to reach Venus.' },
      { id: 'venus', name: 'Venus', label: 'INTO THE HAZE', color: '#e4bf79', sky: '#292320', ground: '#786444', image: null, background: null, description: 'Fight beneath golden skies. Defeat the boss to unlock the Acid Planet.' },
      { id: 'acid', name: 'Acid Planet', label: 'THE FINAL FRONTIER', color: '#a8d78a', sky: '#152a29', ground: '#416849', image: null, background: null, description: 'Your final destination. Survive the green world and finish the campaign.' }
    ]
  };
  root.TrazZData = data;
  if (typeof module !== 'undefined') module.exports = data;
})(typeof globalThis !== 'undefined' ? globalThis : this);
