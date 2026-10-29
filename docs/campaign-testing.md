# Campaign verification
- Browser playthrough: Moon Base / level 1, all three waves, unupgraded Pulse Pistol and Explorer Suit.
- Cleared 21 enemies; earned 152 coins and 13 gems in this run (crystal drops vary).
- Used touch aiming left/right, held FIRE, activated Overdrive, paused between inspection steps.
- Level 2 unlocked; level 3 and later planets stayed locked.
- Reload retained 1/30 completed levels, 152 coins, 13 gems and next-level selection.
- Shop displayed 600-coin cheapest replacement; rarity and paper-weapon milestone locks visible.
- Browser console returned no warnings or errors.
- Found and corrected a collision-height issue: ground enemies now intersect the pistol's horizontal fire line.
- Automated tests cover all30 unlocks, old-save migration, purchase gates,78 upgrade paths, all6boss attack signatures, telegraphs, twins requiring both targets, and no wave healing.
- Later levels and all bosses have automated behavior tests; they have not all been manually completed.

## Replay improvements
- Replayed and completed Moon Base level 2 with the unupgraded starter pistol: all3waves,24enemies,14health remaining,172coins and17gems earned. Paused between inspections.
- Verified touch aiming, held fire, moving while firing, abilities, and level3 recommendation on returning to the menu. Browser console returned no warnings/errors.
- Regression reproduced bullets skipping nearby targets, then fixed it for left/right/up fire.
- Added incoming-side arrows, a persistent boss health/phase display, and outlined/countdown floor warnings.
- Gem spawns now have a per-run budget; freezing the last enemy cannot create unlimited crystals.
- Added regression checks for close targets, finite gem spawning, total Twin Asteroid health, and recommended next mission.

## Red flying enemies
- Browser tested Moon Base level3: red skulls visible airborne with yellow-green flapping wings; tested movement, upward fire, warning and swoop encounters. No console errors/warnings. This test did not complete the level.
- Automated checks confirm red skulls appear on every planet, scale into larger variants, wind up before swooping, recover airborne and stop flight/animation under freeze.

## Bug recheck — 27 October 2026
- Reproduced and fixed expired enemy projectiles still colliding on their final update.
- Reproduced and fixed repeated Escape keydown events toggling pause, and Escape failing to dismiss mission results.
- All 30 automated checks pass; JavaScript syntax checks and standalone build pass.
- Browser checked level locks, gun shop artwork, held Escape, keyboard fire, touch aim/fire/ability, and return from defeat with Escape. No console warnings or errors. This pass did not complete a full level or run on physical iPad hardware.

## Drawing alignment — 27 October 2026
- Re-read all four Game Concept Summary drawings. Paper gun milestones are 5/10/15/20/25/30 campaign clears, not pilot XP. All guns now arrive automatically at their required milestones; coins remain for armour and gems for upgrades. Existing purchases and balances are retained.
- Fire boss now requires 45 seconds of survival; final sentinel has an armour-break appearance. Added enemy colour/growth variations and the purple planetary escape scene.
- Automated checks cover all 26 level grants, six paper milestones, old saves, free rewards, survival countdown/reward-once and final phase. Browser checked migrated early gun unlocks, equip without payment, locked later rewards and gameplay. Physical iPad and complete late-game playthrough remain untested.

- Two independent subagents audited drawing fidelity and progression/combat. Corrected friendly Berg being used as an enemy, changed fireballs to hand-origin throws, and reproduced/fixed a ground hazard spawning after the survival countdown. All 35 tests pass.

## Music and walking — 28 October 2026
- All 39 automated checks pass, including walk/idle/upward aim/edge transitions, audio waiting for interaction, a single scheduler, mute/pause and saved music preferences.
- Browser checked Music toggling and persistence after reload, movement with the walking frames and pause. No console warnings/errors. Audio scheduling is tested; no physical iPad listening test was performed.
- Both walking views and the original synthesized soundtrack are embedded in the standalone game.

## Expanded frontier and boss fixes — 29 October 2026
- Independently reproduced fire damage immunity and Mars charging outside the playable area. Added actual bullet-hit checks for all nine bosses from both sides and an offscreen-charge regression. Fire can now be defeated early or survived.
- All 45 checks pass, covering 45 ordered levels, old 30-level saves, 32 guns/96 upgrade paths, seven permanent upgrade types and all new weapon abilities/attack signatures.
- Browser tested fire health decreasing from 3360 to 3110 after firing, and actual bullet damage against Crystal Monarch, Storm Leviathan and Void Sovereign. New environments rendered without console errors. These were isolated local boss sessions with extra test health and disabled persistence; not a full campaign playthrough. Temporary sessions were removed and are not published.

## Living worlds / Debug pass — 29 October 2026
- Reproduced continuous Freeze Pistol and Glacier AR shots preventing all boss attacks. Centralized freeze application, added a half-second boss cap and two-second recovery window; sustained-fire regression now permits retaliation.
- All52 tests pass:60 ordered levels,38 guns/114 tree paths, save migration from45 clears, repair delay/max-health bounds, movement/blast/velocity upgrades, new gun abilities and all12 hittable bosses.

- Browser tested the three new environments and bosses using isolated local sessions with extra test health and no save writes. Thornheart, Furnace Colossus and Chrono Keeper all took real projectile damage; new weapon abilities activated and the11 permanent upgrade cards rendered. No console warnings/errors. Full60-level and physical-iPad playthroughs remain untested. Test session pages were removed and are not published.
