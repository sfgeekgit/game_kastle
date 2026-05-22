import { Router } from 'express';
import type { Request, Response } from 'express';
import { getPlayerById, updatePlayer, getPlayerSkills, incrementPlayerSkill, grantPlayerPowerup } from '../db/helpers.js';
import { calculateLevel, SKILL_DEFS, POWERUPS } from '@game_kastle/shared';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const player = await getPlayerById(userId);
    if (!player) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    const rawSkills = await getPlayerSkills(userId);
    const skills = Object.fromEntries(SKILL_DEFS.map((s) => [s.key, rawSkills[s.key] ?? 0]));

    res.json({
      userId: player.user_id,
      displayName: player.display_name,
      points: Number(player.points),
      level: player.level,
      lastActive: player.last_active,
      skills,
    });
  } catch (err) {
    console.error('Get player error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/points', async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { amount } = req.body;
    if (typeof amount !== 'number' || !Number.isFinite(amount) || !Number.isInteger(amount)) {
      res.status(400).json({ error: 'Amount must be an integer' });
      return;
    }
    if (Math.abs(amount) > 10000) {
      res.status(400).json({ error: 'Amount out of range' });
      return;
    }

    const player = await getPlayerById(userId);
    if (!player) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    const newPoints = Number(player.points) + amount;
    if (newPoints < 0) {
      res.status(400).json({ error: 'Insufficient points' });
      return;
    }

    const newLevel = calculateLevel(newPoints);
    await updatePlayer(userId, newPoints, newLevel);

    res.json({ points: newPoints, level: newLevel });
  } catch (err) {
    console.error('Update points error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/dialogue', async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) { res.json({ gained: null }); return; }

    const { npcId, resolvedKey } = req.body;
    if (typeof npcId !== 'string' || typeof resolvedKey !== 'string') {
      res.json({ gained: null }); return;
    }

    const powerup = POWERUPS.find((p) => p.npcId === npcId && p.keyword === resolvedKey);
    if (!powerup) { res.json({ gained: null }); return; }

    const isNew = await grantPlayerPowerup(userId, powerup.id);
    if (!isNew) { res.json({ gained: null }); return; }

    await incrementPlayerSkill(userId, powerup.skillKey);
    const rawSkills = await getPlayerSkills(userId);
    const skills = Object.fromEntries(SKILL_DEFS.map((s) => [s.key, rawSkills[s.key] ?? 0]));
    const skillDef = SKILL_DEFS.find((s) => s.key === powerup.skillKey)!;

    res.json({ gained: { label: skillDef.label }, skills });
  } catch (err) {
    console.error('Dialogue powerup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/skill', async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) { res.status(401).json({ error: 'Not authenticated' }); return; }

    const { skillKey } = req.body;
    if (!SKILL_DEFS.find((s) => s.key === skillKey)) {
      res.status(400).json({ error: 'Invalid skill key' });
      return;
    }

    await incrementPlayerSkill(userId, skillKey);
    const rawSkills = await getPlayerSkills(userId);
    const skills = Object.fromEntries(SKILL_DEFS.map((s) => [s.key, rawSkills[s.key] ?? 0]));
    res.json({ skills });
  } catch (err) {
    console.error('Skill increment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
