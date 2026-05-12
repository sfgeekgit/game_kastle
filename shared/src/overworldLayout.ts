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
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

export const OVERWORLD_LAYOUT: OverworldRoom[] = [
  { mapId: 'graveyard',        x: 230, y:   0, w: 200, h: 150, label: 'Graveyard' },
  { mapId: 'tavern',           x: 460, y:   0, w: 200, h: 150, label: 'The Rusty Flagon' },
  { mapId: 'castle_gates',     x: 690, y:   0, w: 200, h: 150, label: 'Castle Gates' },
  { mapId: 'temple',           x: 1150, y:  0, w: 200, h: 150, label: 'Temple' },
  { mapId: 'herbalist_garden', x:   0, y: 180, w: 200, h: 150, label: "Herbalist's Garden" },
  { mapId: 'forest_path',      x: 230, y: 180, w: 200, h: 150, label: 'Forest Path' },
  { mapId: 'town_square',      x: 460, y: 180, w: 200, h: 150, label: 'Town Square' },
  { mapId: 'marketplace',      x: 690, y: 180, w: 200, h: 150, label: 'Marketplace' },
  { mapId: 'docks',            x: 920, y: 180, w: 200, h: 150, label: 'Docks' },
  { mapId: 'dungeon_entrance', x: 1150, y: 180, w: 200, h: 150, label: 'Dungeon Entrance' },
];

export const OVERWORLD_CANVAS_WIDTH = 1350;
export const OVERWORLD_CANVAS_HEIGHT = 330;
