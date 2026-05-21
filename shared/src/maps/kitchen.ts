import type { MapDef } from '../mapTypes.js';

const f  = { type: 'floor' as const, variant: 'stone' };
const w  = { type: 'wall' as const };
const st = { type: 'wall' as const, variant: 'stove' };
const sk = { type: 'wall' as const, variant: 'sink' };
const sh = { type: 'wall' as const, variant: 'shelf' };
const eSL = { type: 'exit' as const, exitTarget: 'study_lab' };
const eSt = { type: 'exit' as const, exitTarget: 'stairs1' };

// Kitchen — 18×13
// North wall: exit to study_lab (col 9)
// East wall:  exit to stairs1 (row 6)
// Shelves: row 1 (cols 3-5, 12-14), row 11 (cols 3-5, 12-14)
// Sinks: col 2 rows 3-4, col 15 rows 3-4
// Stove islands: rows 6-7 cols 5-6 and 11-12; rows 9-10 cols 4-5 and 12-13
export const kitchen: MapDef = {
  id: 'kitchen',
  name: 'Kitchen',
  width: 18,
  height: 13,
  spawnX: 9,
  spawnY: 2,
  npcs: [
    { id: 'gurkenglas', name: 'Gurkenglas', x: 8, y: 8, dialogueFile: 'gurkenglas' },
  ],
  tiles: [
    // row 0 — north wall
    [w, w, w, w, w, w, w, w, w, eSL, w, w, w, w, w, w, w, w],
    // row 1 — shelves along north wall
    [w, f, f, sh, sh, sh, f, f, f, f, f, f, sh, sh, sh, f, f, w],
    // row 2
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
    // rows 3-4 — sinks on sides
    [w, f, sk, f, f, f, f, f, f, f, f, f, f, f, f, sk, f, w],
    [w, f, sk, f, f, f, f, f, f, f, f, f, f, f, f, sk, f, w],
    // row 5
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
    // rows 6-7 — first pair of stove islands (cols 5-6 and 11-12)
    [w, f, f, f, f, st, st, f, f, f, f, st, st, f, f, f, f, eSt],
    [w, f, f, f, f, st, st, f, f, f, f, st, st, f, f, f, f, w],
    // row 8
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
    // rows 9-10 — second pair of stove islands, offset (cols 4-5 and 12-13)
    [w, f, f, f, st, st, f, f, f, f, f, f, st, st, f, f, f, w],
    [w, f, f, f, st, st, f, f, f, f, f, f, st, st, f, f, f, w],
    // row 11 — shelves along south wall
    [w, f, f, sh, sh, sh, f, f, f, f, f, f, sh, sh, sh, f, f, w],
    // row 12 — south wall
    [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
  ],
};
