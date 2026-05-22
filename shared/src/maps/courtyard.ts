import type { MapDef, Tile } from '../mapTypes.js';

const g  = { type: 'floor' as const, variant: 'grass' };
const g1 = { type: 'floor' as const, variant: 'grass1' };
const g2 = { type: 'floor' as const, variant: 'grass2' };
const g3 = { type: 'floor' as const, variant: 'grass3' };
const w  = { type: 'wall' as const };
const eHDB = { type: 'exit' as const, exitTarget: 'hall_down_back' };
const eSL  = { type: 'exit' as const, exitTarget: 'study_lab' };
const eHG  = { type: 'exit' as const, exitTarget: 'hall_greenroom' };
const eSt  = { type: 'exit' as const, exitTarget: 'stairs1' };
const eL   = { type: 'exit' as const, exitTarget: 'lobby' };

const gr = (): Tile[] => [w, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, w];

// Courtyard — 19×21 (grass floor, outdoor feel)
// North wall: exit to hall_down_back (col 9)
// West wall:  exit to study_lab (row 10)
// East wall:  exit to hall_greenroom (row 10)
// South wall: exit to stairs1 (col 4), exit to lobby (col 13)
// Texture: stone pillars at corners (2,2) (16,2) (2,18) (16,18)
export const courtyard: MapDef = {
  id: 'courtyard',
  name: 'Courtyard',
  width: 19,
  height: 21,
  spawnX: 9,
  spawnY: 10,
  tiles: [
    // row 0 — north wall
    [w, w, w, w, w, w, w, w, w, eHDB, w, w, w, w, w, w, w, w, w],
    gr(),
    // row 2 — pillars at cols 2 and 16
    [w, g, w, g, g, g, g1, g, g, g, g, g, g2, g, g, g, w, g, w],
    [w, g, g, g2, g, g, g, g, g, g, g, g, g, g1, g, g, g, g, w],
    gr(),
    gr(),
    [w, g, g, g, g, g3, g, g, g, g, g, g, g, g, g, g2, g, g, w],
    gr(),
    [w, g1, g, g, g, g, g, g, g2, g, g, g, g, g, g, g, g, g, w],
    gr(),
    // row 10 — west exit to study_lab, east exit to hall_greenroom
    [eSL, g, g, g, g, g, g2, g, g, g, g, g, g1, g, g, g, g, g, eHG],
    gr(),
    [w, g, g, g, g2, g, g, g, g, g, g, g, g, g, g, g1, g, g, w],
    gr(),
    [w, g, g, g, g, g, g, g, g, g3, g, g, g, g, g, g, g, g, w],
    gr(),
    [w, g, g1, g, g, g, g, g, g, g, g, g, g2, g, g, g, g, g, w],
    gr(),
    // row 18 — pillars at cols 2 and 16
    [w, g, w, g, g, g2, g, g, g, g, g, g, g, g, g1, g, w, g, w],
    gr(),
    // row 20 — south wall
    [w, w, w, w, eSt, w, w, w, w, w, w, w, w, eL, w, w, w, w, w],
  ],
  npcs: [
    { id: 'kaarel', name: 'Kaarel', x: 5,  y: 5,  dialogueFile: 'kaarel' },
    { id: 'ryan',   name: 'Ryan',   x: 9,  y: 7,  dialogueFile: 'ryan' },
    { id: 'sean',   name: 'Sean',   x: 4,  y: 14, dialogueFile: 'sean' },
    { id: 'victor', name: 'Victor', x: 14, y: 16, dialogueFile: 'victor' },
    { id: 'forgot_name', name: 'Guy Whose Name You Forgot', x: 12, y: 10, dialogueFile: 'forgot_name' },
  ],
};
