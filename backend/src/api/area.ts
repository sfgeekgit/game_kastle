import { Router } from 'express';
import type { Request, Response } from 'express';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { applyMove, findEntrySpawn } from '@game_kastle/shared';
import type { Direction, MapDef } from '@game_kastle/shared';
import { getOrCreateRoom, getRoomDef, enrichWithImages, findAreaId, findMapIdForAreaId } from '../area/manager.js';
import { checkpointPlayer, getPlayerById, getUserById } from '../db/helpers.js';
import { withAreaLock, readAreaState, findPlayerEntity, getAllAreaSnapshots } from '../area/store.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NPC_DIR = join(__dirname, '../../../text_content/npcs');
const FALLBACKS_PATH = join(__dirname, '../../../text_content/dialogue_fallbacks.yaml');

// Read once at startup; fallbacks never change at runtime.
const fallbacksPromise = readFile(FALLBACKS_PATH, 'utf-8').then((c) => yaml.load(c));

const router = Router();

const VALID_DIRECTIONS = new Set<string>(['north', 'south', 'east', 'west']);

/**
 * GET /api/area/map?mapId=town_square
 * Returns the map definition for the given map ID (default: town_square).
 * Used by the frontend for client-side mode.
 */
router.get('/map', async (req: Request, res: Response) => {
  const mapId = (req.query.mapId as string) || 'lobby';
  try {
    res.json(await enrichWithImages(getRoomDef(mapId)));
  } catch {
    res.status(404).json({ error: `Map not found: ${mapId}` });
  }
});

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

/**
 * POST /api/area/join
 * Join a persistent area instance.
 * Body: { mapId?: string } — defaults to 'town_square'
 */
router.post('/join', async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      res.status(401).json({ error: 'No session' });
      return;
    }

    const isRoomTransition = !!req.body.mapId;
    let mapId = (req.body.mapId as string) || 'lobby';
    let dbSpawnOverride: { x: number; y: number } | null = null;
    let sourceMapId: string | null = null;

    if (!isRoomTransition) {
      const playerRecord = await getPlayerById(userId);
      if (playerRecord?.last_area_id != null && playerRecord.last_x != null && playerRecord.last_y != null) {
        const savedMapId = await findMapIdForAreaId(playerRecord.last_area_id);
        if (savedMapId) {
          mapId = savedMapId;
          dbSpawnOverride = { x: playerRecord.last_x, y: playerRecord.last_y };
        }
      }
    } else {
      const playerRecord = await getPlayerById(userId);
      if (playerRecord?.last_area_id != null) {
        sourceMapId = await findMapIdForAreaId(playerRecord.last_area_id);
      }
    }

    let room: MapDef;
    try {
      room = getRoomDef(mapId);
    } catch {
      res.status(400).json({ error: `Unknown map: ${mapId}` });
      return;
    }
    const entrySpawn = sourceMapId ? findEntrySpawn(room, sourceMapId) : null;

    const areaId = await getOrCreateRoom(mapId);
    const now = Date.now();

    const userRecord = await getUserById(userId);
    const avatarImage = userRecord?.discord_id && userRecord?.discord_avatar
      ? `avatar_${userRecord.discord_id}.png`
      : undefined;

    // Read state before lock to find idle players and any ghost entity for this user.
    const currentState = readAreaState(areaId);
    const allEntities = currentState?.entities ?? [];

    const idlePlayers = allEntities.filter(
      (e) => e.type === 'player' && e.id !== String(userId) &&
              (!e.lastMoveAt || e.lastMoveAt < now - IDLE_TIMEOUT_MS),
    );
    const ghostEntity = allEntities.find((e) => e.id === String(userId) && e.type === 'player') ?? null;

    const checkpoints = idlePlayers.map((e) => checkpointPlayer(Number(e.id), areaId, e.x, e.y, e.lastMoveAt ?? now));
    if (ghostEntity && !isRoomTransition) checkpoints.push(checkpointPlayer(userId, areaId, ghostEntity.x, ghostEntity.y, ghostEntity.lastMoveAt ?? now));
    else if (isRoomTransition) checkpoints.push(checkpointPlayer(userId, areaId, entrySpawn?.x ?? room.spawnX, entrySpawn?.y ?? room.spawnY, now));
    await Promise.all(checkpoints);

    // Determine spawn position.
    const spawnX = (ghostEntity && !isRoomTransition) ? ghostEntity.x : (dbSpawnOverride?.x ?? entrySpawn?.x ?? room.spawnX);
    const spawnY = (ghostEntity && !isRoomTransition) ? ghostEntity.y : (dbSpawnOverride?.y ?? entrySpawn?.y ?? room.spawnY);

    const idleIds = new Set(idlePlayers.map((e) => e.id));
    await withAreaLock(areaId, (state) => {
      state.entities = state.entities.filter((e) => !(e.type === 'player' && idleIds.has(e.id)));
      const existing = state.entities.find((e) => e.id === String(userId) && e.type === 'player');
      if (existing) {
        existing.lastMoveAt = now;
        existing.image = avatarImage;
        if (isRoomTransition) { existing.x = spawnX; existing.y = spawnY; existing.facing = entrySpawn?.facing ?? 'south'; }
      } else {
        state.entities.push({ id: String(userId), type: 'player', x: spawnX, y: spawnY, facing: entrySpawn?.facing ?? 'south', lastMoveAt: now, image: avatarImage });
      }
    });

    req.session.currentAreaId = areaId;

    const state = readAreaState(areaId);
    const player = state?.entities.find((e) => e.id === String(userId) && e.type === 'player') ?? null;

    res.json({ areaId, state, player, mapName: room.name });
  } catch (err) {
    console.error('Area join error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/area/move
 * Submit a move in the backend area.
 * Body: { direction: 'north' | 'south' | 'east' | 'west' }
 */
router.post('/move', async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    const areaId = req.session?.currentAreaId;
    if (!userId || !areaId) {
      res.status(400).json({ error: 'Not in an area' });
      return;
    }

    const { direction } = req.body;
    if (!direction || !VALID_DIRECTIONS.has(direction)) {
      res.status(400).json({ error: 'Invalid direction' });
      return;
    }

    const playerBefore = findPlayerEntity(areaId, userId);
    if (!playerBefore) {
      res.status(400).json({ error: 'Player not in area' });
      return;
    }

    const stateBefore = readAreaState(areaId);
    if (!stateBefore) {
      res.status(500).json({ error: 'Area not in memory' });
      return;
    }
    const moveResult = applyMove(stateBefore, playerBefore, direction as Direction);

    await withAreaLock(areaId, (state) => {
      const entity = state.entities.find((e) => e.id === String(userId) && e.type === 'player');
      if (entity) {
        entity.x = moveResult.newX;
        entity.y = moveResult.newY;
        entity.facing = moveResult.newFacing;
        entity.lastMoveAt = Date.now();
      }
    });

    if (moveResult.exitedArea) {
      await withAreaLock(areaId, (state) => {
        const idx = state.entities.findIndex((e) => e.id === String(userId) && e.type === 'player');
        if (idx !== -1) state.entities.splice(idx, 1);
      });
      req.session.currentAreaId = undefined as unknown as number;
    }

    const state = readAreaState(areaId);
    const player = state?.entities.find((e) => e.id === String(userId) && e.type === 'player') ?? null;

    res.json({ moveResult, state, player });
  } catch (err) {
    console.error('Area move error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/area/state
 * Fetch current area state (all entities, including other players).
 */
router.get('/state', (req: Request, res: Response) => {
  const userId = req.session?.userId;
  const areaId = req.session?.currentAreaId;
  if (!userId || !areaId) {
    res.status(400).json({ error: 'Not in an area' });
    return;
  }

  const state = readAreaState(areaId);
  if (!state) {
    res.status(500).json({ error: 'Area not in memory' });
    return;
  }

  const player = state.entities.find((e) => e.id === String(userId) && e.type === 'player') ?? null;
  res.json({ state, player });
});

/**
 * POST /api/area/exit
 * Record final player position (used by frontend-mode on exit tile).
 * Body: { x, y, mapId }
 */
router.post('/exit', async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      res.status(401).json({ error: 'No session' });
      return;
    }

    const { x, y, mapId } = req.body;
    if (
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      !Number.isInteger(x) ||
      !Number.isInteger(y) ||
      typeof mapId !== 'string'
    ) {
      res.status(400).json({ error: 'Invalid position' });
      return;
    }

    let map: MapDef;
    try {
      map = getRoomDef(mapId);
    } catch {
      res.status(400).json({ error: 'Unknown map' });
      return;
    }
    if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
      res.status(400).json({ error: 'Position out of bounds' });
      return;
    }

    const areaId = await findAreaId(mapId);
    if (areaId) await checkpointPlayer(userId, areaId, x, y, Date.now());

    res.json({ success: true });
  } catch (err) {
    console.error('Area exit error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/area/npc/:npcId/dialogue
 * Returns the NPC's dialogue data (parsed YAML) + generic fallbacks.
 */
router.get('/npc/:npcId/dialogue', async (req: Request, res: Response) => {
  try {
    const npcId = String(req.params.npcId);

    if (!/^[a-zA-Z0-9_-]+$/.test(npcId)) {
      res.status(400).json({ error: 'Invalid NPC ID' });
      return;
    }

    // Count NPC interaction as player activity (best-effort, non-blocking).
    const userId = req.session?.userId;
    const areaId = req.session?.currentAreaId;
    if (userId && areaId) {
      withAreaLock(areaId, (state) => {
        const entity = state.entities.find((e) => e.id === String(userId) && e.type === 'player');
        if (entity) entity.lastMoveAt = Date.now();
      }).catch((err) => console.error('NPC activity update failed:', err));
    }

    const npcPath = join(NPC_DIR, `${npcId}.yaml`);
    const [npcData, fallbacks] = await Promise.all([
      readFile(npcPath, 'utf-8').then((c) => yaml.load(c)),
      fallbacksPromise,
    ]);

    res.json({ npcData, fallbacks });
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && (err as NodeJS.ErrnoException).code === 'ENOENT') {
      res.status(404).json({ error: 'NPC dialogue not found' });
      return;
    }
    console.error('NPC dialogue error:', err);
    res.status(500).json({ error: 'Failed to load NPC dialogue' });
  }
});

/**
 * GET /api/area/overworld
 * Aggregate presence across all loaded areas. In-memory only — no DB hits.
 * Returns { rooms: [{ mapId, players: [userId, ...] }, ...] }.
 * Only areas currently loaded in memory are returned; empty areas not yet
 * touched since server start will simply be absent (frontend treats as empty).
 */
router.get('/overworld', (_req: Request, res: Response) => {
  const rooms = getAllAreaSnapshots();
  res.json({ rooms });
});

export default router;
