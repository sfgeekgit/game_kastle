/**
 * Overworld layout — controls what players see on the world map.
 *
 * Each entry positions a room on a 2D canvas (pixel coords, north = top).
 * `floor` groups rooms into separate map views (1 = ground floor, 2 = upper, etc.).
 * Vary `w`/`h` freely — rooms do not need to be uniform size.
 *
 * TO ADD A ROOM TO THE WORLD MAP:
 *   Add an entry here with a mapId matching the room's `id` field and an
 *   area_defs DB row. Pick x/y/w/h/floor to place it visually.
 *   A room not listed here is invisible on the overworld (but can still be
 *   reached if another room has an exitTarget pointing to it).
 *
 * TO REMOVE A ROOM FROM THE WORLD MAP:
 *   Delete its entry here. The room still exists in the registry and DB;
 *   players just won't see it on the map.
 *
 * See backend/src/area/registry.ts for the full add/remove room checklist.
 */

export interface OverworldRoom {
  mapId: string;
  floor: number;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

// Grid constants: 3 cols × 3 rows, uniform cells with gaps
// Cell: 180×130  |  Gap: 20  |  Margin: 10
// Col x: 10, 210, 410   |  Row y: 10, 160, 310

export const OVERWORLD_LAYOUT: OverworldRoom[] = [
  // ── Floor 1: full 3×3 grid ──────────────────────────────────────────────

  { mapId: 'hall_down_back',     floor: 1, x: 200, y:  10, w: 190, h: 60, label: 'Hallway' },
  { mapId: 'gym',     floor: 1, x: 510, y:  20, w: 80, h: 80, label: 'Gym' },

  { mapId: 'study_lab',           floor: 1, x:  10, y:  10, w: 180, h: 280, label: 'Study Lab' },
  { mapId: 'courtyard',            floor: 1, x: 200, y:  80, w: 190, h: 210, label: 'Courtyard' },
  { mapId: 'hall_greenroom',      floor: 1, x: 400, y:  10, w:  80, h: 280, label: 'Hallway' },
  { mapId: 'greenroom',           floor: 1, x: 490, y: 110, w: 100, h: 150, label: 'Greenroom' },

  { mapId: 'kitchen',        floor: 1, x:  10, y: 310, w: 180, h: 130, label: 'Kitchen' },
  { mapId: 'stairs1',          floor: 1, x: 210, y: 310, w:  70, h: 130, label: 'Stairs' },
  { mapId: 'lobby',      floor: 1, x: 290, y: 310, w: 180, h: 130, label: 'Lobby' },
  { mapId: 'fireplace', floor: 1, x: 490, y: 310, w: 100, h: 130, label: 'Fireplace' },



  { mapId: 'hall_upstairs_back',     floor: 2, x: 210, y:  10, w: 260, h: 60, label: 'Hallway' },



  { mapId: 'hall_upstairs_side_chat',      floor: 2, x: 490, y:  25, w:  80, h: 280, label: 'Hallway' },


  { mapId: 'library',          floor: 2, x: 90, y: 310, w: 110, h: 130, label: 'Library' },
  { mapId: 'common_room',          floor: 2, x: 210, y: 310, w: 270, h: 130, label: 'Common Room' },
  { mapId: 'main_hall',      floor: 2, x:  90, y: 230, w: 390, h: 75, label: 'Main Hall' },
  { mapId: 'mini_kitch', floor: 2, x: 490, y: 310, w: 100, h: 130, label: 'Mini Kitchen' },


];

export const OVERWORLD_CANVAS_WIDTH = 600;
export const OVERWORLD_CANVAS_HEIGHT = 450;
