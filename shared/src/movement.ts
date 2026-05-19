import type { AreaState, Direction, Entity, MapDef, MoveResult, Tile } from './mapTypes.js';

export function isTilePassable(tile: Tile): boolean {
  return tile.type !== 'wall';
}

export function directionDelta(dir: Direction): { dx: number; dy: number } {
  switch (dir) {
    case 'north':
      return { dx: 0, dy: -1 };
    case 'south':
      return { dx: 0, dy: 1 };
    case 'east':
      return { dx: 1, dy: 0 };
    case 'west':
      return { dx: -1, dy: 0 };
  }
}

/**
 * Apply a move to a player entity against the current area state.
 * Facing always updates even if movement is blocked.
 * Returns the result — does NOT mutate state (caller handles that).
 */
export function applyMove(state: AreaState, player: Entity, direction: Direction): MoveResult {
  const { dx, dy } = directionDelta(direction);
  const newX = player.x + dx;
  const newY = player.y + dy;
  const newFacing = direction;

  if (newX < 0 || newX >= state.width || newY < 0 || newY >= state.height) {
    return {
      success: false,
      reason: 'out_of_bounds',
      newX: player.x,
      newY: player.y,
      newFacing,
      exitedArea: false,
    };
  }

  const tile = state.tiles[newY][newX];
  if (!isTilePassable(tile)) {
    return {
      success: false,
      reason: 'impassable',
      newX: player.x,
      newY: player.y,
      newFacing,
      exitedArea: false,
    };
  }

  // Block movement into a tile occupied by a non-passable NPC. Players never block each other.
  const blockedByNpc = state.entities.some(
    (e) => e.type === 'npc' && !e.passable && e.x === newX && e.y === newY,
  );
  if (blockedByNpc) {
    return {
      success: false,
      reason: 'entity_collision',
      newX: player.x,
      newY: player.y,
      newFacing,
      exitedArea: false,
    };
  }

  const exitedArea = tile.type === 'exit';
  return {
    success: true,
    newX,
    newY,
    newFacing,
    exitedArea,
    exitTarget: exitedArea ? (tile.exitTarget ?? 'welcome') : undefined,
  };
}

/**
 * Find the spawn position when entering `room` from `fromMapId`.
 * Locates the exit tile that leads back to the source room and returns
 * a position one step inward with the appropriate inward-facing direction.
 * Returns null if no matching exit is found (caller falls back to room.spawnX/Y).
 */
export function findEntrySpawn(
  room: MapDef,
  fromMapId: string,
): { x: number; y: number; facing: Direction } | null {
  for (let row = 0; row < room.height; row++) {
    for (let col = 0; col < room.width; col++) {
      const tile = room.tiles[row][col];
      if (tile.type === 'exit' && tile.exitTarget === fromMapId) {
        if (row === 0)               return { x: col,            y: 1,          facing: 'south' };
        if (row === room.height - 1) return { x: col,            y: row - 1,    facing: 'north' };
        if (col === 0)               return { x: 1,              y: row,        facing: 'east'  };
        if (col === room.width - 1)  return { x: room.width - 2, y: row,        facing: 'west'  };
      }
    }
  }
  return null;
}
