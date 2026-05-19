import type { MapDef } from '../mapTypes.js';

const f = { type: 'floor' as const, variant: 'stone' };
const w = { type: 'wall' as const };
const eGR = { type: 'exit' as const, exitTarget: 'greenroom' };

// Gym — 8×8
// South wall: exit to greenroom (col 4)
// Texture: equipment benches row 2 (cols 1-2 and 5-6)
export const gym: MapDef = {
  id: 'gym',
  name: 'Gym',
  width: 8,
  height: 8,
  spawnX: 4,
  spawnY: 4,
  tiles: [
    // row 0 — north wall
    [w, w, w, w, w, w, w, w],
    [w, f, f, f, f, f, f, w],
    // row 2 — equipment benches (cols 1-2 and 5-6)
    [w, w, w, f, f, w, w, w],
    [w, f, f, f, f, f, f, w],
    [w, f, f, f, f, f, f, w],
    [w, f, f, f, f, f, f, w],
    [w, f, f, f, f, f, f, w],
    // row 7 — south wall, exit to greenroom at col 4
    [w, w, w, w, eGR, w, w, w],
  ],
  npcs: [
    { id: 'mark',   name: 'Mark',   x: 2, y: 4, dialogueFile: 'mark' },
    { id: 'kabir',  name: 'Kabir',  x: 5, y: 5, dialogueFile: 'kabir' },
    { id: 'pranav', name: 'Pranav', x: 2, y: 6, dialogueFile: 'pranav' },
  ],
};
