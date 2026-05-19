import type { MapDef } from '../mapTypes.js';

const f  = { type: 'floor' as const, variant: 'stone' };
const s1 = { type: 'floor' as const, variant: 'stone1' };
const s2 = { type: 'floor' as const, variant: 'stone2' };
const w  = { type: 'wall' as const };
const ch = { type: 'wall' as const, variant: 'chair' };
const cE = { type: 'wall' as const, variant: 'couch_e' };
const cW = { type: 'wall' as const, variant: 'couch_w' };
const eHUB = { type: 'exit' as const, exitTarget: 'hall_upstairs_back' };
const eMK  = { type: 'exit' as const, exitTarget: 'mini_kitch' };
const eMH  = { type: 'exit' as const, exitTarget: 'main_hall' };

// Upstairs Side Chat Hallway — 8×28 (narrow tall corridor, floor 2 east)
// West wall:  exit to hall_upstairs_back (row 3), exit to main_hall (row 24) — NOT courtyard-facing
// East wall:  no exits — NOT courtyard-facing
// All walls available — couches on both sides, avoiding exit rows
export const hallUpstairsSideChat: MapDef = {
  id: 'hall_upstairs_side_chat',
  name: 'Hallway',
  width: 8,
  height: 28,
  spawnX: 4,
  spawnY: 14,
  tiles: [
    // row 0 — north wall
    [w, w, w, w, w, w, w, w],
    // rows 1-2 — couch against east wall
    [w, f, f, f, f, f, cE, w],
    [w, f, f, f, f, f, cE, w],
    // row 3 — west exit to hall_upstairs_back
    [eHUB, f, f, f, f, f, f, w],
    // row 4
    [w, f, f, s1, f, f, f, w],
    // rows 5-6 — couch east wall + couch west wall
    [w, f, f, f, f, f, cE, w],
    [w, cW, f, f, f, f, cE, w],
    // row 7 — couch west wall
    [w, cW, f, f, f, f, f, w],
    // row 8 — chair east wall
    [w, f, f, f, f, f, ch, w],
    // row 9
    [w, f, s1, f, f, f, f, w],
    // row 10
    [w, f, f, f, s2, f, f, w],
    // row 11
    [w, f, f, f, s2, f, f, w],
    // rows 12
    [w, f, f, f, f, f, f, w],
    // rows 13-14 — couches on both walls
    [w, cW, f, f, f, f, cE, w],
    [w, cW, f, f, f, f, cE, w],
    // row 15
    [w, f, s2, f, f, f, f, w],
    // row 16 — chair east wall
    [w, f, f, f, f, f, ch, w],
    // row 17
    [w, f, f, f, f, f, s1, w],
    // row 18
    [w, f, f, s2, f, f, f, w],
    // rows 19-20 — couches on both walls
    [w, cW, f, f, f, f, cE, w],
    [w, cW, f, f, f, f, cE, w],
    // row 21
    [w, f, f, f, f, f, f, w],
    // row 22
    [w, f, f, f, f, s1, f, w],
    // row 23
    [w, f, f, f, f, f, f, w],
    // row 24 — west exit to main_hall
    [eMH, f, f, f, f, f, f, w],
    // row 25 — chair east wall
    [w, f, f, f, f, f, ch, w],
    // row 26
    [w, f, f, f, f, f, f, w],
    // row 27 — south wall, exit to mini_kitch at col 4
    [w, w, w, w, eMK, w, w, w],
  ],
};
