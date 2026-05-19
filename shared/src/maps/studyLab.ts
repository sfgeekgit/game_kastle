import type { MapDef } from '../mapTypes.js';

const f  = { type: 'floor' as const, variant: 'stone' };
const w  = { type: 'wall' as const };
const de = { type: 'wall' as const, variant: 'desk' };
const ta = { type: 'wall' as const, variant: 'table' };
const la = { type: 'wall' as const, variant: 'lamp' };
const sk = { type: 'wall' as const, variant: 'sink' };
const ba = { type: 'wall' as const, variant: 'bar' };
const gl = { type: 'wall' as const, variant: 'glass' };
const es = { type: 'wall' as const, variant: 'espresso' };
const su = { type: 'wall' as const, variant: 'supply' };
const eHDB = { type: 'exit' as const, exitTarget: 'hall_down_back' };
const eC   = { type: 'exit' as const, exitTarget: 'courtyard' };
const eK   = { type: 'exit' as const, exitTarget: 'kitchen' };

// Study Lab — 18×28 (tall room on the west side)
// East wall: exit to hall_down_back (row 3), exit to courtyard (row 18)
// South wall: exit to kitchen (col 9)
// Clear path: cols 10-12 throughout
// Bookshelves: west wall col 1 rows 3-7
// Desks/tables scattered on left (cols 1-9) and right (cols 13-16)
// Lamps at (2,6), (2,10), (15,6), (16,17)
// Bar (rows 22-23 cols 1-8), sink (1,25), glassware (cols 2-7 row 26)
// Coffee supplies (cols 13-15 rows 25-26), espresso machine (cols 12-15 row 26)
export const studyLab: MapDef = {
  id: 'study_lab',
  name: 'Study Lab',
  width: 18,
  height: 28,
  spawnX: 11,
  spawnY: 14,
  tiles: [
    // row 0 — north wall
    [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
    // row 1 — desks near north wall
    [w, f, de, de, f, de, de, f, f, f, f, f, f, de, de, f, f, w],
    // row 2
    [w, f, de, de, f, ta, ta, f, f, f, f, f, f, ta, ta, f, f, w],
    // row 3 — bookshelf (col 1) + east exit to hall_down_back
    [w, w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, eHDB],
    // rows 4-5 — bookshelf west + tables east
    [w, w, f, f, f, f, f, f, f, f, f, f, f, ta, ta, f, f, w],
    [w, w, f, f, f, f, f, f, f, f, f, f, f, ta, ta, f, f, w],
    // rows 6-7 — bookshelf west + desks tucked beside it + lamp
    [w, w, de, de, f, f, f, f, f, f, f, f, f, f, f, la, f, w],
    [w, w, de, de, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
    // rows 8-9 — tables on both sides
    [w, f, f, ta, ta, f, f, f, f, f, f, f, f, ta, ta, f, f, w],
    [w, f, f, ta, ta, f, f, f, f, f, f, f, f, ta, ta, f, f, w],
    // row 10 — lamp + desks
    [w, f, la, f, f, f, de, de, f, f, f, f, f, de, de, f, f, w],
    // rows 11-12 — desks on both sides
    [w, f, f, f, f, de, de, f, f, f, f, f, f, de, de, f, f, w],
    [w, f, f, f, f, de, de, f, f, f, f, f, f, de, de, f, f, w],
    // rows 13-14 — tables on both sides
    [w, f, ta, ta, f, f, f, f, f, f, f, f, f, f, ta, ta, f, w],
    [w, f, ta, ta, f, f, f, f, f, f, f, f, f, f, ta, ta, f, w],
    // rows 15-16 — desks on both sides
    [w, f, f, f, f, de, de, f, f, f, f, f, f, de, de, f, f, w],
    [w, f, f, f, f, de, de, f, f, f, f, f, f, de, de, f, f, w],
    // row 17 — lamps on both sides, clear middle
    [w, f, la, f, f, f, f, f, f, f, f, f, f, f, f, f, la, w],
    // row 18 — east exit to courtyard
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, eC],
    // rows 19-20 — tables
    [w, f, f, ta, ta, f, f, f, f, f, f, f, f, ta, ta, f, f, w],
    [w, f, f, ta, ta, f, f, f, f, f, f, f, f, ta, ta, f, f, w],
    // row 21 — desks
    [w, f, f, f, f, de, de, f, f, f, f, f, f, de, de, f, f, w],
    // rows 22-23 — bar counter (cols 1-8)
    [w, ba, ba, ba, ba, ba, ba, ba, ba, f, f, f, f, f, f, f, f, w],
    [w, ba, ba, ba, ba, ba, ba, ba, ba, f, f, f, f, f, f, f, f, w],
    // row 24
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
    // row 25 — sink at col 1, coffee supplies above espresso (cols 13-15)
    [w, sk, f, f, f, f, f, f, f, f, f, f, f, su, su, su, f, w],
    // row 26 — glassware (cols 2-7), supplies + espresso machine (cols 11-16)
    [w, f, gl, gl, gl, gl, gl, gl, f, f, f, su, es, es, es, es, su, w],
    // row 27 — south wall, exit to kitchen at col 9
    [w, w, w, w, w, w, w, w, w, eK, w, w, w, w, w, w, w, w],
  ],
  npcs: [
    { id: 'nick',    name: 'Nick',    x: 11, y: 11, dialogueFile: 'nick' },
    { id: 'mikhail', name: 'Mikhail', x: 9,  y: 11, dialogueFile: 'mikhail' },
    { id: 'david',   name: 'David',   x: 8,  y: 9,  dialogueFile: 'david' },   // moved from (4,9) — table there
    { id: 'linda',   name: 'Linda',   x: 16, y: 19, dialogueFile: 'linda' },   // moved from (13,19) — table there
  ],
};
