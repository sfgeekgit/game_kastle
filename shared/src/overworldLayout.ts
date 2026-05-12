/**
 * Overworld layout — manual, display-only.
 *
 * Each entry positions a map on a 2D canvas (pixel coords, north = top).
 * Rooms do NOT need to be uniform; vary `w`/`h` for wide-over-narrow or
 * tall-beside-short layouts. This data is consumed only by the overworld
 * page — game logic still uses the exit tiles inside each map.
 *
 * If you add a new map, add it here and the overworld page will pick it up.
 * If a registered map is missing from this list, the page will skip it.
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
