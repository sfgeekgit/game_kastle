import type { MapDef } from '../mapTypes.js';

const f  = { type: 'floor' as const, variant: 'stone' };
const s1 = { type: 'floor' as const, variant: 'stone1' };
const s2 = { type: 'floor' as const, variant: 'stone2' };
const w  = { type: 'wall' as const };
const ch = { type: 'wall' as const, variant: 'chair' };
const cN = { type: 'wall' as const, variant: 'couch_n' };
const eSL  = { type: 'exit' as const, exitTarget: 'study_lab' };
const eC   = { type: 'exit' as const, exitTarget: 'courtyard' };
const eHG  = { type: 'exit' as const, exitTarget: 'hall_greenroom' };
const eHUB = { type: 'exit' as const, exitTarget: 'hall_upstairs_back' };

// Back Hallway — 19×6 (wide, short horizontal corridor)
// West wall:  exit to study_lab (row 3)
// East wall:  exit to hall_greenroom (row 3)
// North wall: exit to hall_upstairs_back (col 9) — NOT courtyard-facing
// South wall: exit to courtyard (col 9) — courtyard-facing, no furniture
// Furniture: couches + chairs along north wall (row 1)
export const hallDownBack: MapDef = {
  id: 'hall_down_back',
  name: 'Hallway',
  width: 19,
  height: 6,
  spawnX: 9,
  spawnY: 2,
  tiles: [
    // row 0 — north wall, exit to hall_upstairs_back at col 9
    [w, w, w, w, w, w, w, w, w, eHUB, w, w, w, w, w, w, w, w, w],
    // row 1 — couches and chairs against north wall
    [w, cN, cN, f, ch, f, f, f, cN, cN, f, f, f, cN, cN, f, ch, f, w],
    // row 2 — floor texture
    [w, f, s1, f, f, f, f, f, f, s2, f, f, f, f, f, f, s1, f, w],
    // row 3 — west exit to study_lab, east exit to hall_greenroom
    [eSL, f, s2, f, f, f, f, f, f, f, f, f, s1, f, f, f, f, f, eHG],
    // row 4 — clear (south side / courtyard-facing)
    [w, f, f, f, s2, f, s1, f, f, f, f, f, s2, f, s1, f, f, f, w],
    // row 5 — south wall, exit to courtyard at col 9
    [w, w, w, w, w, w, w, w, w, eC, w, w, w, w, w, w, w, w, w],
  ],
  npcs: [
    { id: 'bena', name: 'Ben', x: 6, y: 2, dialogueFile: 'bena' },
  ],
};
