import type { MapDef } from '../mapTypes.js';

const f = { type: 'floor' as const, variant: 'stone' };
const w = { type: 'wall' as const };
const eSt  = { type: 'exit' as const, exitTarget: 'stairs1' };
const eLib = { type: 'exit' as const, exitTarget: 'library' };
const eCR  = { type: 'exit' as const, exitTarget: 'common_room' };
const eHUS = { type: 'exit' as const, exitTarget: 'hall_upstairs_side_chat' };

const ir = (): typeof f[] => [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w];

// Main Hall — 39×8 (wide horizontal hall, floor 2 center)
// South wall: exit to stairs1 (col 1), exit to library (col 5), exit to common_room (col 25)
// East wall:  exit to hall_upstairs_side_chat (row 4)
// Texture: pillars at row 2 cols 10 and 28, row 5 cols 10 and 28
export const mainHall: MapDef = {
  id: 'main_hall',
  name: 'Main Hall',
  width: 39,
  height: 8,
  spawnX: 3,
  spawnY: 4,
  tiles: [
    // row 0 — north wall
    [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
    ir(),
    // row 2 — pillars at cols 10 and 28
    [w, f, f, f, f, f, f, f, f, f, w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w, f, f, f, f, f, f, f, f, f, w],
    ir(),
    // row 4 — east exit to hall_upstairs_side_chat
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, eHUS],
    // row 5 — pillars at cols 10 and 28
    [w, f, f, f, f, f, f, f, f, f, w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w, f, f, f, f, f, f, f, f, f, w],
    ir(),
    // row 7 — south wall: stairs1 (col 1), library (col 5), common_room (col 25)
    [w, eSt, w, w, w, eLib, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, eCR, w, w, w, w, w, w, w, w, w, w, w, w, w],
  ],
};
