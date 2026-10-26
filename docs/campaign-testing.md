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
