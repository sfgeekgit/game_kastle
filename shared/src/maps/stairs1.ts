import type { MapDef } from '../mapTypes.js';

const f = { type: 'floor' as const, variant: 'stone' };
const w = { type: 'wall' as const };
const eC  = { type: 'exit' as const, exitTarget: 'courtyard' };
const eK  = { type: 'exit' as const, exitTarget: 'kitchen' };
const eL  = { type: 'exit' as const, exitTarget: 'lobby' };
const eMH = { type: 'exit' as const, exitTarget: 'main_hall' };

const ir = (): typeof f[] => [w, f, f, f, f, f, w];

// Stairs — 7×13
// North wall: exit to courtyard (col 3)
// West wall:  exit to kitchen (row 6)
// East wall:  exit to lobby (row 6)
// Texture: baluster posts row 4 (cols 2 and 4)
export const stairs1: MapDef = {
  id: 'stairs1',
  name: 'Stairs',
  width: 7,
  height: 13,
  spawnX: 3,
  spawnY: 6,
  tiles: [
    // row 0 — north wall, exit to courtyard (col 3)
    [w, w, w, eC, w, w, w],
    ir(), ir(), ir(),
    // row 4 — baluster posts (cols 2 and 4), exit to main_hall (col 3)
    [w, f, w, eMH, w, f, w],
    ir(),
    // row 6 — west exit to kitchen, east exit to lobby
    [eK, f, f, f, f, f, eL],
    ir(), ir(), ir(), ir(), ir(),
    // row 12 — south wall
    [w, w, w, w, w, w, w],
  ],
};
