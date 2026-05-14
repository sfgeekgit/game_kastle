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
  //  row 0
  { mapId: 'herbalist_garden', floor: 1, x:  10, y:  10, w: 180, h: 130, label: "Herbalist's Garden" },
  { mapId: 'castle_gates',     floor: 1, x: 210, y:  10, w: 180, h: 130, label: 'Castle Gates' },
  { mapId: 'temple',           floor: 1, x: 410, y:  10, w: 180, h: 130, label: 'Temple' },
  //  row 1
  { mapId: 'tavern',           floor: 1, x:  10, y: 160, w: 180, h: 130, label: 'The Rusty Flagon' },
  { mapId: 'docks',            floor: 1, x: 210, y: 160, w: 180, h: 130, label: 'Courtyard' },
  { mapId: 'marketplace',      floor: 1, x: 410, y: 160, w: 180, h: 130, label: 'Marketplace' },
  //  row 2
  { mapId: 'graveyard',        floor: 1, x:  10, y: 310, w: 180, h: 130, label: 'Kitchen' },
  { mapId: 'stairs1',        floor: 1, x: 210, y: 310, w:  80, h: 130, label: 'Stairs' },
  { mapId: 'town_square',      floor: 1, x: 290, y: 310, w: 180, h: 130, label: 'Lobby' },
  { mapId: 'dungeon_entrance', floor: 1, x: 490, y: 310, w: 100, h: 130, label: 'Fireplace' },

  // ── Floor 2: 3×3 ring — center slot (210,160) intentionally empty ───────
  //  row 0
  { mapId: 'forest_path',      floor: 2, x:  10, y:  10, w: 180, h: 130, label: 'Forest Path' },
  { mapId: 'north_outpost',    floor: 2, x: 210, y:  10, w: 180, h: 130, label: 'North Outpost' },
  { mapId: 'eastern_hills',    floor: 2, x: 410, y:  10, w: 180, h: 130, label: 'Eastern Hills' },
  //  row 1  (center skipped)
  { mapId: 'western_road',     floor: 2, x:  10, y: 160, w: 180, h: 130, label: 'Western Road' },
  { mapId: 'harbor_watch',     floor: 2, x: 410, y: 160, w: 180, h: 130, label: 'Harbor Watch' },
  //  row 2
  { mapId: 'southern_marsh',   floor: 2, x:  10, y: 310, w: 180, h: 130, label: 'Southern Marsh' },
  { mapId: 'crossroads',       floor: 2, x: 210, y: 310, w: 180, h: 130, label: 'Crossroads' },
  { mapId: 'ruined_keep',      floor: 2, x: 410, y: 310, w: 180, h: 130, label: 'Ruined Keep' },
];

export const OVERWORLD_CANVAS_WIDTH = 600;
export const OVERWORLD_CANVAS_HEIGHT = 450;
