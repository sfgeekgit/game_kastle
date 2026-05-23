import type { MapDef } from '../mapTypes.js';

const f  = { type: 'floor' as const, variant: 'stone' };
const s1 = { type: 'floor' as const, variant: 'stone1' };
const s2 = { type: 'floor' as const, variant: 'stone2' };
const w  = { type: 'wall' as const };
const ch = { type: 'wall' as const, variant: 'chair' };
const cE = { type: 'wall' as const, variant: 'couch_e' };
const eHDB = { type: 'exit' as const, exitTarget: 'hall_down_back' };
const eC   = { type: 'exit' as const, exitTarget: 'courtyard' };
const eGR  = { type: 'exit' as const, exitTarget: 'greenroom' };
const eL   = { type: 'exit' as const, exitTarget: 'lobby' };

// Greenroom Hallway — 8×28 (narrow tall corridor on the east side)
// West wall: exit to hall_down_back (row 3), exit to courtyard (row 18) — courtyard-facing, no furniture
// East wall: exit to greenroom (row 10) — NOT courtyard-facing, add couches/chairs in col 6
// South wall: exit to lobby (col 4)
// Texture: notice boards at row 7 (col 3) and row 20 (col 4)
export const hallGreenroom: MapDef = {
  id: 'hall_greenroom',
  name: 'Hallway',
  width: 8,
  height: 28,
  spawnX: 4,
  spawnY: 14,
  tiles: [
    // row 0 — north wall
    [w, w, w, w, w, w, w, w],
    // row 1
    [w, f, f, s2, f, f, f, w],
    // row 2
    [w, s1, f, f, f, f, f, w],
    // row 3 — west exit to hall_down_back
    [eHDB, f, f, f, f, f, f, w],
    // rows 4-5 — couch against east wall
    [w, f, f, f, f, f, cE, w],
    [w, f, f, f, f, f, cE, w],
    // row 6
    [w, f, f, f, s1, f, f, w],
    // row 7
    [w, f, f, f, f, f, f, w],
    // row 8 — chair against east wall
    [w, f, f, f, f, f, ch, w],
    // row 9
    [w, s2, f, f, f, f, f, w],
    // row 10 — east exit to greenroom
    [w, f, f, f, f, f, f, eGR],
    // row 11
    [w, f, f, f, f, s2, f, w],
    // rows 12-13 — couch against east wall
    [w, f, f, f, f, f, cE, w],
    [w, f, f, f, f, f, cE, w],
    // row 14
    [w, f, s1, f, f, f, f, w],
    // rows 15-16
    [w, f, f, f, f, f, f, w],
    [w, f, f, f, f, f, f, w],
    // row 17 — chair against east wall
    [w, f, f, f, f, f, ch, w],
    // row 18 — west exit to courtyard (keep west side clear)
    [eC, f, f, f, f, f, f, w],
    // row 19
    [w, f, s1, f, f, f, f, w],
    // row 20
    [w, f, f, f, f, f, f, w],
    // rows 21-22 — couch against east wall
    [w, f, f, f, f, f, cE, w],
    [w, f, f, f, f, f, cE, w],
    // row 23
    [w, s2, f, f, f, f, f, w],
    // row 24
    [w, f, f, f, f, f, f, w],
    // row 25 — chair against east wall
    [w, f, f, f, f, f, ch, w],
    // row 26
    [w, f, f, s1, f, f, f, w],
    // row 27 — south wall, exit to lobby at col 4
    [w, w, w, w, eL, w, w, w],
  ],
  npcs: [
    { id: 'ouro',    name: 'Ouro',    x: 3, y: 6,  dialogueFile: 'ouro' },
    { id: 'michele', name: 'Michele', x: 3, y: 20, dialogueFile: 'michele' },
  ],
};
