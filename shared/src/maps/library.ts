import type { MapDef } from '../mapTypes.js';

const f = { type: 'floor' as const, variant: 'stone' };
const w = { type: 'wall' as const };
const eMH = { type: 'exit' as const, exitTarget: 'main_hall' };

const ir = (): typeof f[] => [w, f, f, f, f, f, f, f, f, f, w];
// bookshelf row: wall at col 1 and col 9 (hug walls)
const bk = (): typeof f[] => [w, w, f, f, f, f, f, f, f, w, w];

// Library — 11×13
// North wall: exit to main_hall (col 5)
// Texture: bookshelves cols 1 and 9 rows 2-6 and 8-11
export const library: MapDef = {
  id: 'library',
  name: 'Library',
  width: 11,
  height: 13,
  spawnX: 5,
  spawnY: 6,
  tiles: [
    // row 0 — north wall, exit to main_hall at col 5
    [w, w, w, w, w, eMH, w, w, w, w, w],
    ir(),
    bk(), bk(), bk(), bk(), bk(),
    ir(),
    bk(), bk(), bk(), bk(),
    // row 12 — south wall
    [w, w, w, w, w, w, w, w, w, w, w],
  ],
};
