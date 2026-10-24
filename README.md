# TrazZ

A playable 2D space shooter with TrazZ, your green duck defender, 20 directly purchasable guns, six campaign worlds, bosses, armour and permanent upgrades. Artwork is redrawn from the supplied paper references with transparent SVG backgrounds.

## Play

[Play TrazZ online](https://tuffm82-pixel.github.io/TrazZ/) · [Download TrazZ.html](https://github.com/tuffm82-pixel/TrazZ/raw/refs/heads/main/TrazZ.html)

Open **TrazZ.html** for a complete offline game. For development run `npm start` and open http://127.0.0.1:4173. GitHub Pages serves `index.html`.

Keyboard: arrow keys move, A/W/D aim left/up/right, Space fires, E activates the equipped gun ability, Escape pauses. iPad supports simultaneous touch movement, aim, fire and ability buttons. Landscape gives the widest view. Safari's Share → Add to Home Screen provides an app-like launch. Settings can show or hide touch controls.

## Progression

Moon Base → Mars Mountains → Neptune Hills → Asteroid Maze → Volcanic Voyage → Acid Planet. Each world has five waves, ending in a boss. Clear a world to unlock the next, or replay cleared worlds to earn more currency.

Defeating monsters earns **coins** for direct gun and armour purchases. Shoot glowing purple crystals to collect **gems** for permanent health, damage, cooldown and weapon upgrades. There is no random gun rolling.

Each gun has nine upgrades in a 3 × 3 square, progressing left to right: buy all three first-column nodes, select two of three middle-column nodes, then buy the final node assigned to that pair. Six nodes can be installed. Resetting a weapon tree refunds every gem spent. The six rarity levels are common, uncommon, rare, epic, legendary and mythic. The eight paper guns are mythic.

Progress is saved locally in this browser. Existing saves retain XP, coins and valid campaign progress; older paid weapon ranks refund their coin cost once during migration. Saves on different devices/browsers or the offline file do not sync.

## Development

- `npm test`: migration, progression, economy and all 60 possible weapon upgrade paths.
- `npm run check`: JavaScript syntax checks.
- `npm run build`: validate the 20 independent upgrade trees and generate the embedded offline HTML.

Base gun stats, ability metadata, armour and worlds live in `data.js`; upgrade content is in `content/upgrades/<gun-id>.json`, aggregated into `upgrade-catalog.js`. Combat and UI are in `app.js`, economy/progression rules in `core.js`. Gun/bullet SVGs are in `assets/guns` and `assets/bullets`, character in `assets/characters/duck.svg` and `duck-body.svg`. No photographs of the paper are displayed in the game.

