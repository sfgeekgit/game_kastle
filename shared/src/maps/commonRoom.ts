import type { MapDef } from '../mapTypes.js';

const f = { type: 'floor' as const, variant: 'stone' };
const w = { type: 'wall' as const };
const eMH = { type: 'exit' as const, exitTarget: 'main_hall' };
const eMK = { type: 'exit' as const, exitTarget: 'mini_kitch' };

const ir = (): typeof f[] => [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w];
// seating row: chairs at cols 3-4 and 22-23
const sr = (): typeof f[] => [w, f, f, w, w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w, w, f, f, w];

// Common Room — 27×13
// North wall: exit to main_hall (col 13)
// East wall:  exit to mini_kitch (row 6)
// Texture: seating clusters rows 4-5 and 8-9 at cols 3-4 and 22-23
export const commonRoom: MapDef = {
  id: 'common_room',
  name: 'Common Room',
  width: 27,
  height: 13,
  spawnX: 13,
  spawnY: 6,
  tiles: [
    // row 0 — north wall, exit to main_hall at col 13
    [w, w, w, w, w, w, w, w, w, w, w, w, w, eMH, w, w, w, w, w, w, w, w, w, w, w, w, w],
    ir(),
    ir(),
    ir(),
    sr(), sr(),
    // row 6 — east exit to mini_kitch
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, eMK],
    ir(),
    sr(), sr(),
    ir(),
    ir(),
    // row 12 — south wall
    [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
  ],
};
