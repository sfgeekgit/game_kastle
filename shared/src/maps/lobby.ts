import type { MapDef } from '../mapTypes.js';

const f   = { type: 'floor' as const, variant: 'stone' };
const w   = { type: 'wall' as const };
const cE  = { type: 'wall' as const, variant: 'couch_e' };
const eC  = { type: 'exit' as const, exitTarget: 'courtyard' };
const eHG = { type: 'exit' as const, exitTarget: 'hall_greenroom' };
const eSt = { type: 'exit' as const, exitTarget: 'stairs1' };
const eFP = { type: 'exit' as const, exitTarget: 'fireplace' };

const ir = (): typeof f[] => [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w];

// Lobby — 18×13
// North wall: exits to courtyard (col 5) and hall_greenroom (col 14)
// West wall:  exit to stairs1 (row 6)
// East wall:  exit to fireplace (row 6)
// Texture: reception desk row 2 (cols 7-10), seating clusters row 9 (cols 3-4 and 13-14)
//          couch against east wall rows 3-5 (col 16)
export const lobby: MapDef = {
  id: 'lobby',
  name: 'Lobby',
  width: 18,
  height: 13,
  spawnX: 9,
  spawnY: 6,
  tiles: [
    // row 0 — north wall
    [w, w, w, w, w, eC, w, w, w, w, w, w, w, w, eHG, w, w, w],
    ir(),
    // row 2 — reception desk (cols 7-10)
    [w, f, f, f, f, f, f, w, w, w, w, f, f, f, f, f, f, w],
    // rows 3-5 — couch against east wall (col 16)
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, cE, w],
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, cE, w],
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, cE, w],
    // row 6 — side exits
    [eSt, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, eFP],
    ir(), ir(),
    // row 9 — seating (cols 3-4 and 13-14)
    [w, f, f, w, w, f, f, f, f, f, f, f, f, w, w, f, f, w],
    ir(), ir(),
    // row 12 — south wall
    [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
  ],
  npcs: [
    { id: 'phil',    name: 'Phil',    x: 3,  y: 3, dialogueFile: 'phil' },
    { id: 'adriana', name: 'Adriana', x: 14, y: 3, dialogueFile: 'adriana' },
    { id: 'ryan',    name: 'Ryan',    x: 9,  y: 8, dialogueFile: 'ryan' },
  ],
};
