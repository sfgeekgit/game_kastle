import type { MapDef } from '../mapTypes.js';

const f  = { type: 'floor' as const, variant: 'stone' };
const s1 = { type: 'floor' as const, variant: 'stone1' };
const s2 = { type: 'floor' as const, variant: 'stone2' };
const w  = { type: 'wall' as const };
const ch = { type: 'wall' as const, variant: 'chair' };
const cN = { type: 'wall' as const, variant: 'couch_n' };
const eHDB = { type: 'exit' as const, exitTarget: 'hall_down_back' };
const eHUS = { type: 'exit' as const, exitTarget: 'hall_upstairs_side_chat' };

// Upstairs Back Hallway — 26×6 (wide short corridor, floor 2 north)
// South wall: exit to hall_down_back (col 9) — not courtyard-facing
// East wall:  exit to hall_upstairs_side_chat (row 3)
// All walls are non-courtyard — couches on north wall (row 1), chairs on south (row 4)
export const hallUpstairsBack: MapDef = {
  id: 'hall_upstairs_back',
  name: 'Hallway',
  width: 26,
  height: 6,
  spawnX: 12,
  spawnY: 2,
  tiles: [
    // row 0 — north wall
    [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
    // row 1 — couches and chairs against north wall
    [w, cN, cN, f, ch, f, f, f, f, f, cN, cN, f, f, f, cN, cN, f, f, f, ch, f, f, f, f, w],
    // row 2 — floor texture
    [w, f, f, f, f, f, f, f, f, f, s1, f, f, f, f, f, f, f, f, f, f, s2, f, f, f, w],
    // row 3 — east exit to hall_upstairs_side_chat
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, eHUS],
    // row 4 — chairs against south wall, texture in gaps
    [w, f, ch, f, s1, f, f, f, f, f, f, ch, f, f, s2, f, f, f, f, f, ch, f, f, s1, f, w],
    // row 5 — south wall, exit to hall_down_back at col 9
    [w, w, w, w, w, w, w, w, w, eHDB, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
  ],
};
