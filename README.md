# TrazZ

A playable 2D space shooter with TrazZ, your green duck defender, 32 guns earned by beating campaign levels, nine campaign worlds, bosses, armour and permanent upgrades. Artwork is redrawn from the supplied paper references with transparent SVG backgrounds.

## Play

[Play TrazZ online](https://tuffm82-pixel.github.io/TrazZ/) · [Download TrazZ.html](https://github.com/tuffm82-pixel/TrazZ/raw/refs/heads/main/TrazZ.html)

Open **TrazZ.html** for a complete offline game. For development run `npm start` and open http://127.0.0.1:4173. GitHub Pages serves `index.html`.

Keyboard: arrow keys move, A/W/D aim left/up/right, Space fires, E activates the equipped gun ability, Escape pauses. iPad supports simultaneous touch movement, aim, fire and ability buttons. Landscape gives the widest view. Safari's Share → Add to Home Screen provides an app-like launch. Settings can show or hide touch controls.

## Progression

Moon Base → Mars Mountains → Neptune Hills → Asteroid Maze → Volcanic Voyage → Acid Planet → Crystal Caverns → Stormreach → Void Frontier. Each world has five separately selectable levels with three waves per level. The fifth level ends in a unique planet boss. Clear levels in order, or replay cleared levels for smaller completion bonuses.

Defeating monsters earns **coins** for armour purchases. Shoot glowing purple crystals to collect **gems** for permanent health, damage, cooldown and weapon upgrades. There is no random gun rolling.

Each gun has nine upgrades in a 3 × 3 square, progressing left to right: buy all three first-column nodes, select two of three middle-column nodes, then buy the final node assigned to that pair. Six nodes can be installed. Resetting a weapon tree refunds every gem spent. The six rarity levels are common, uncommon, rare, epic, legendary and mythic. The original eight paper guns are mythic. Paper weapon rewards are Foul Gun (5), Ray Gun (10), Flame Gun (15), Spike Gun (20), Cross Gun (25), and Rocket Launcher (30). Guns are awarded automatically: no coin purchase or roll. Other weapons unlock at their displayed campaign milestones. Existing owned guns remain usable; old saves automatically receive missing earned guns.

Coins and gems are not spent when a gun unlocks.

Progress is saved locally in this browser. Existing saves retain XP, coins and valid campaign progress; older paid weapon ranks refund their coin cost once during migration. Saves on different devices/browsers or the offline file do not sync.

## Development

- `npm test`: migration, progression, economy and all 96 possible weapon upgrade paths.
- `npm run check`: JavaScript syntax checks.
- `npm run build`: validate the 32 independent upgrade trees and generate the embedded offline HTML.

Base gun stats, ability metadata, armour and worlds live in `data.js`; upgrade content is in `content/upgrades/<gun-id>.json`, aggregated into `upgrade-catalog.js`. Combat and UI are in `app.js`, economy/progression rules in `core.js`. Gun/bullet SVGs are in `assets/guns` and `assets/bullets`, character in `assets/characters/trazz-v7.svg` and `trazz-body-v7.svg`. No photographs of the paper are displayed in the game.



Enemy artwork and bosses are drawn in campaign-art.js from the paper references. Amber lines and floor markers telegraph attacks. Bosses use sword charges, armour slams, trident volleys, twin crossfire, firestorms and a two-phase final sentinel. The fire boss takes normal damage: defeat it early or dodge its fireballs until the 45-second countdown ends. The final sentinel visibly loses armour and gains an energy aura below half health. Levels 3–5 also introduce warned ground hazards. There is no automatic healing between waves.

Combat improvements: shots hit nearby targets in all three directions. Incoming arrows indicate enemy entry sides; the boss display shows remaining health/targets and phase changes. Floor hazards outline their danger area before striking. Bonus crystals have a finite per-level budget, and the menu recommends the next uncleared mission.

Red winged skulls keep their red heads and jagged yellow-green wings across all worlds. They hover, telegraph a dive at the player’s last position, then retreat. Later level variants are larger and horned. Freeze pauses flight and wing animation; successful hits give a brief flash.

Enemy colour variants and growing horned monsters follow the paper progression. Blue and green flying pods flap their wings. The campaign finale sends TrazZ through a purple sky with colourful planets.

Berg, the crowned swordsman marked as friendly in the drawings, now appears in Berg's Guide. The Moon enemy is a separate helmeted Lunar Sentinel inspired by the unlabelled helmet sketch. Fireballs arc from the fire boss's hands.

## Music and walking — 28 October 2026
An original synthesized space theme plays after the first tap or key press, with a faster arrangement during missions. Settings has separate Music and Sound effects switches; the music choice is saved. Music stops on pause, defeat, or leaving the game tab. No external audio service or downloaded soundtrack is required.

TrazZ has eight walking poses for side aim and eight for upward aim, including alternating steps, free-arm swing and subtle body bob. Walking follows actual distance travelled and returns to the original idle pose when stopped or blocked at an arena edge. The same animation supports keyboard and touch movement. Build the poses with `node scripts/build-walk.js` before building the offline HTML.

## Expanded frontier — 29 October 2026
The campaign has 45 levels, nine worlds/boss encounters, and 32 guns with 288 tree nodes. New guns arrive at campaign clears 32 (Shard Repeater), 35 (Prism Lance), 37 (Tempest Caster), 40 (Thunder Drum), 42 (Void Needle), and 45 (Eclipse Cannon). Their abilities add a shield, piercing ray fan, lightning burst, radial salvo, gravity field and healing blast. Four new permanent gem upgrades add critical chance, life-steal, starting shields and fire rate. Existing 30-level saves continue directly into Crystal Caverns.

Boss fixes: fire takes bullet damage while retaining its survival option, and bosses stay inside the shootable arena after charges.
