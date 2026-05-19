import type { MapDef } from '../mapTypes.js';

const f  = { type: 'floor' as const, variant: 'stone' };
const s1 = { type: 'floor' as const, variant: 'stone1' };
const s2 = { type: 'floor' as const, variant: 'stone2' };
const rg = { type: 'floor' as const, variant: 'rug' };
const w  = { type: 'wall' as const };
const ch = { type: 'wall' as const, variant: 'chair' };
const ta = { type: 'wall' as const, variant: 'table' };
const eL = { type: 'exit' as const, exitTarget: 'lobby' };

// Fireplace Room — 10×13
// West wall: exit to lobby (row 6)
// Rug: 2×2 center at rows 6-7 cols 4-5
// Fireplace mantle: row 2 (cols 3-6)
// Chairs by fire: row 4 (cols 2, 7); low table row 5 (cols 4-5)
// Back chairs: row 9 (cols 2, 7); back table row 8 (cols 4-5)
export const fireplace: MapDef = {
  id: 'fireplace',
  name: 'Fireplace Room',
  width: 10,
  height: 13,
  spawnX: 5,
  spawnY: 6,
  tiles: [
    // row 0 — north wall
    [w, w, w, w, w, w, w, w, w, w],
    // row 1 — stone floor with slight texture
    [w, f, s1, f, f, f, s2, f, f, w],
    // row 2 — fireplace mantle (cols 3-6)
    [w, f, s1, w, w, w, w, s2, f, w],
    // row 3
    [w, f, f, f, f, f, f, f, f, w],
    // row 4 — armchairs facing the fire
    [w, s2, ch, f, f, f, f, ch, s1, w],
    // row 5 — low table between chairs
    [w, f, f, f, ta, ta, f, f, f, w],
    // row 6 — west exit to lobby, 2×2 rug center (cols 4-5)
    [eL, f, f, f, rg, rg, f, f, f, w],
    // row 7 — 2×2 rug center (cols 4-5)
    [w, f, f, f, rg, rg, f, f, f, w],
    // row 8 — back table
    [w, f, f, f, ta, ta, f, f, f, w],
    // row 9 — back armchairs
    [w, s1, ch, f, f, f, f, ch, s2, w],
    // row 10
    [w, f, f, f, f, f, f, f, f, w],
    // row 11 — stone floor with texture
    [w, f, f, s2, f, f, f, s1, f, w],
    // row 12 — south wall
    [w, w, w, w, w, w, w, w, w, w],
  ],
  npcs: [
    { id: 'nick', name: 'Nick', x: 5, y: 3,  dialogueFile: 'nick' },
    { id: 'nico', name: 'Nico', x: 3, y: 7,  dialogueFile: 'nico' },
    { id: 'okko', name: 'Okko', x: 6, y: 10, dialogueFile: 'okko' },
  ],
};
