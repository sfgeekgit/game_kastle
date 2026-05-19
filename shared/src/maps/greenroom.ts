import type { MapDef } from '../mapTypes.js';

const f = { type: 'floor' as const, variant: 'stone' };
const w = { type: 'wall' as const };
const eGym = { type: 'exit' as const, exitTarget: 'gym' };
const eHG  = { type: 'exit' as const, exitTarget: 'hall_greenroom' };

// Greenroom — 10×15
// North wall: exit to gym (col 5)
// West wall:  exit to hall_greenroom (row 7)
// Texture: sofas cols 2 and 7 rows 4-5, chairs cols 2 and 7 row 11
export const greenroom: MapDef = {
  id: 'greenroom',
  name: 'Greenroom',
  width: 10,
  height: 15,
  spawnX: 5,
  spawnY: 7,
  tiles: [
    // row 0 — north wall, exit to gym at col 5
    [w, w, w, w, w, eGym, w, w, w, w],
    [w, f, f, f, f, f, f, f, f, w],
    [w, f, f, f, f, f, f, f, f, w],
    [w, f, f, f, f, f, f, f, f, w],
    // row 4 — sofas (cols 2 and 7)
    [w, f, w, f, f, f, f, w, f, w],
    // row 5 — sofas continued
    [w, f, w, f, f, f, f, w, f, w],
    [w, f, f, f, f, f, f, f, f, w],
    // row 7 — west exit to hall_greenroom
    [eHG, f, f, f, f, f, f, f, f, w],
    [w, f, f, f, f, f, f, f, f, w],
    [w, f, f, f, f, f, f, f, f, w],
    [w, f, f, f, f, f, f, f, f, w],
    // row 11 — chairs (cols 2 and 7)
    [w, f, w, f, f, f, f, w, f, w],
    [w, f, f, f, f, f, f, f, f, w],
    [w, f, f, f, f, f, f, f, f, w],
    // row 14 — south wall
    [w, w, w, w, w, w, w, w, w, w],
  ],
  npcs: [
    { id: 'xylix', name: 'Xylix', x: 4, y: 3,  dialogueFile: 'xylix' },
    { id: 'jonas', name: 'Jonas', x: 6, y: 9,  dialogueFile: 'jonas' },
    { id: 'isac',  name: 'Isac',  x: 3, y: 12, dialogueFile: 'isac' },
  ],
};
