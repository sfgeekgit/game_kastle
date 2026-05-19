import type { MapDef } from '../mapTypes.js';

const f = { type: 'floor' as const, variant: 'stone' };
const w = { type: 'wall' as const };
const eHUS = { type: 'exit' as const, exitTarget: 'hall_upstairs_side_chat' };
const eCR  = { type: 'exit' as const, exitTarget: 'common_room' };

const ir = (): typeof f[] => [w, f, f, f, f, f, f, f, f, w];
// counter row: wall at col 1 (counter hugs west wall)
const cr = (): typeof f[] => [w, w, f, f, f, f, f, f, f, w];

// Mini Kitchen — 10×13
// North wall: exit to hall_upstairs_side_chat (col 4)
// West wall:  exit to common_room (row 6)
// Texture: counter along west wall (col 1) rows 2-4, small table row 9 cols 3-4
export const miniKitch: MapDef = {
  id: 'mini_kitch',
  name: 'Mini Kitchen',
  width: 10,
  height: 13,
  spawnX: 5,
  spawnY: 6,
  tiles: [
    // row 0 — north wall, exit to hall_upstairs_side_chat at col 4
    [w, w, w, w, eHUS, w, w, w, w, w],
    ir(),
    cr(), cr(), cr(),
    ir(),
    // row 6 — west exit to common_room
    [eCR, f, f, f, f, f, f, f, f, w],
    ir(), ir(),
    // row 9 — small table cols 3-4
    [w, f, f, w, w, f, f, f, f, w],
    ir(), ir(),
    // row 12 — south wall
    [w, w, w, w, w, w, w, w, w, w],
  ],
};
