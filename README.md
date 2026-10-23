# TrazZ — Shoot to kill

**[Play TrazZ online](https://tuffm82-pixel.github.io/TrazZ/)**

**[Download the single-file game](https://github.com/tuffm82-pixel/TrazZ/raw/refs/heads/main/TrazZ.html)** — save `TrazZ.html` and double-click it to play offline. If your browser opens the HTML as text, right-click the link and choose **Save link as**.

The game includes a space-themed main menu, character selection, a gun armory, and a campaign level picker. Start on the **Moon**, then unlock **Mars → Venus → Acid Planet**. No installation or internet connection is required.

## Open the game

Double-click `index.html` to play in your browser. For local development, run `node server.js` and open http://127.0.0.1:4173.

`TrazZ.html` contains the game, styles, and placeholder artwork in one file. After editing the source files, run `node scripts/build-standalone.js` to rebuild it. To host this project with GitHub Pages, select **Settings → Pages → Deploy from a branch → main → / (root)**.

## Controls

- **A / W / D:** aim left / up / right (the last direction stays selected)
- **Left / Right arrow:** move left / right independently of the gun
- **Space:** hold to shoot
- **Escape:** pause / resume
- Touch devices show movement, aiming, and firing buttons.

Defeat enemies for credits and XP. Every 200 XP increases your pilot level. The Nova Blaster unlocks at pilot level 3 and the Meteor Cannon at pilot level 5. Use credits in **Guns** to upgrade damage. Each planet has five waves, with a boss in the final wave. Beat the boss and clear all enemies to complete the level and unlock the next world. Clearing a wave restores 15 health. Completed levels can be replayed. Progress saves automatically in this browser when storage is available; existing saves keep their credits and XP and start the campaign at the Moon.

## Add your artwork

The reference images were not available in the original chat, so the current art is temporary. Set image paths in **data.js**. The same slots are used by the menus and the shooting demo.

| Artwork | Folder to use | Setting in data.js |
| --- | --- | --- |
| Star background | `assets/backgrounds/` | `background: 'assets/backgrounds/stars.jpg'` |
| Main character | `assets/characters/` | First character's `image` property |
| Guns | `assets/guns/` | Each gun's `image` property |
| Enemies and boss | `assets/enemies/` | Each enemy's `image` property |
| Planet thumbnails | `assets/planets/` | Each planet's `image` property |
| Planet scenery | `assets/planets/` | Each planet's `background` property |

Transparent PNG or WebP images work well for characters, guns, and monsters. Character images should face right. Leave an image as `null` to keep the drawn placeholder. Alternate explorers currently use color variants of the Scout placeholder and share its stats. Planet artwork is temporary until the supplied pictures are added; unique planet enemies and hazards can be added later.

## Development checks

`node --test tests/core.test.js` checks progress normalization, upgrade purchases, weapon unlocks, boss waves, ordered planet unlocks, saved campaign progress, and independent aim/movement controls. `npm test` and `npm run check` are also available where npm is installed. The project uses plain HTML, CSS, JavaScript, and Canvas with no external packages.
