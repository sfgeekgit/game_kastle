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

export const OVERWORLD_LAYOUT: OverworldRoom[] = [
  { mapId: 'castle_gates',     floor: 1, x: 490, y:   0, w: 200, h: 150, label: 'Castle Gates' },
  { mapId: 'temple',           floor: 1, x: 950, y:  0, w: 100, h: 150, label: 'Temple' },
  { mapId: 'herbalist_garden', floor: 1, x: 30, y: 100, w: 400, h: 190, label: "Herbalist's Garden" },
  { mapId: 'marketplace',      floor: 1, x: 490, y: 180, w: 200, h: 150, label: 'Marketplace' },
  { mapId: 'docks',            floor: 1, x: 720, y: 180, w: 200, h: 150, label: 'Docks' },
  { mapId: 'dungeon_entrance', floor: 1, x: 950, y: 180, w: 100, h: 150, label: 'Dungeon Entrance' },

  { mapId: 'graveyard',        floor: 2, x: 30, y:   0, w: 200, h: 150, label: 'Graveyard' },
  { mapId: 'tavern',           floor: 2, x: 260, y:   0, w: 200, h: 150, label: 'The Rusty Flagon' },
  { mapId: 'forest_path',      floor: 2, x: 30, y: 180, w: 200, h: 150, label: 'Forest Path' },
  { mapId: 'town_square',      floor: 2, x: 260, y: 180, w: 200, h: 150, label: 'Town Square' },
];

export const OVERWORLD_CANVAS_WIDTH = 1100;
export const OVERWORLD_CANVAS_HEIGHT = 330;
