import { Router } from 'express';
import type { Request, Response } from 'express';
import type { RowDataPacket } from 'mysql2';
import { query } from '../db/query.js';
import { getOrCreateRoom, getRoomDef, findMapIdForAreaId } from '../area/manager.js';
import { withAreaLock, readAreaState } from '../area/store.js';

const router = Router();

function adminAuth(req: Request, res: Response): boolean {
  const secret = process.env.SESSION_SECRET;
  if (!secret || req.headers['x-admin-secret'] !== secret) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

interface PlayerRestoreRow extends RowDataPacket {
  user_id: number;
  last_area_id: number;
  discord_id: string | null;
  discord_avatar: string | null;
  display_name: string | null;
  map_id: string;
}

/**
 * POST /api/admin/restore-pcs
 * Injects the most recent up to 6 players (not in lobby) back into their last area
 * at a random valid floor tile. Used after a server restart to repopulate the map.
 */
router.post('/restore-pcs', async (req: Request, res: Response) => {
  if (!adminAuth(req, res)) return;

  const rows = await query<PlayerRestoreRow[]>(
    `SELECT p.user_id, p.last_area_id, p.display_name, u.discord_id, u.discord_avatar, ad.map_id
     FROM players p
     JOIN user_login u ON p.user_id = u.user_id
     JOIN areas a ON p.last_area_id = a.area_id
     JOIN area_defs ad ON a.area_def_id = ad.area_def_id
     WHERE p.last_area_id IS NOT NULL
       AND p.last_x IS NOT NULL
       AND p.last_y IS NOT NULL
       AND ad.map_id != 'lobby'
     ORDER BY p.last_active DESC
     LIMIT 6`,
  );

  const results: Array<{ userId: number; mapId: string; x: number; y: number; status: string }> = [];

  for (const row of rows) {
    const mapId = row.map_id ?? await findMapIdForAreaId(row.last_area_id);
    if (!mapId || mapId === 'lobby') {
      results.push({ userId: row.user_id, mapId: mapId ?? '?', x: -1, y: -1, status: 'skipped (lobby)' });
      continue;
    }

    let areaId: number;
    try {
      areaId = await getOrCreateRoom(mapId);
    } catch (e) {
      results.push({ userId: row.user_id, mapId, x: -1, y: -1, status: `error loading room: ${e}` });
      continue;
    }

    const roomDef = getRoomDef(mapId);
    const areaState = readAreaState(areaId);
    if (!areaState) {
      results.push({ userId: row.user_id, mapId, x: -1, y: -1, status: 'area state not found after load' });
      continue;
    }

    // Collect all valid floor tiles (not walls, not exits) not occupied by an NPC.
    const npcPositions = new Set(
      areaState.entities.filter((e) => e.type === 'npc').map((e) => `${e.x},${e.y}`),
    );
    const candidates: Array<{ x: number; y: number }> = [];
    for (let row2 = 0; row2 < roomDef.height; row2++) {
      for (let col = 0; col < roomDef.width; col++) {
        const tile = roomDef.tiles[row2][col];
        if (tile.type === 'floor' && !npcPositions.has(`${col},${row2}`)) {
          candidates.push({ x: col, y: row2 });
        }
      }
    }

    if (candidates.length === 0) {
      results.push({ userId: row.user_id, mapId, x: -1, y: -1, status: 'no valid floor tile found' });
      continue;
    }

    // Shuffle and pick one.
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const avatarImage =
      row.discord_id && row.discord_avatar ? `avatar_${row.discord_id}.png` : undefined;
    const displayName = row.display_name ?? undefined;
    const now = Date.now();

    await withAreaLock(areaId, (state) => {
      // Skip if player is already present in the area.
      const alreadyHere = state.entities.some(
        (e) => e.type === 'player' && e.id === String(row.user_id),
      );
      if (alreadyHere) return;
      state.entities.push({
        id: String(row.user_id),
        type: 'player',
        x: pick.x,
        y: pick.y,
        facing: 'south',
        lastMoveAt: now,
        dirty: false,
        image: avatarImage,
        name: displayName,
      });
    });

    results.push({ userId: row.user_id, mapId, x: pick.x, y: pick.y, status: 'ok' });
  }

  res.json({ restored: results.length, results });
});

export default router;
