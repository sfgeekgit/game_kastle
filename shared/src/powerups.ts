import type { SkillKey } from './skills.js';

export interface PowerupDef {
  id: number;
  npcId: string;
  keyword: string;
  skillKey: SkillKey;
}

export const POWERUPS: PowerupDef[] = [
  { id: 1001, npcId: 'linda', keyword: 'mechinterp', skillKey: 'mechInterp' },
  { id: 1002, npcId: 'linda', keyword: 'circuits',   skillKey: 'mechInterp' },
];
