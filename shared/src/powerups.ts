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
  { id: 1003, npcId: 'isac',   keyword: 'cev',         skillKey: 'cev' },
  { id: 1004, npcId: 'london', keyword: 'cev',         skillKey: 'cev' },
  { id: 1005, npcId: 'nick',   keyword: 'mechinterp',  skillKey: 'mechInterp' },
  { id: 1006, npcId: 'nico',   keyword: 'mechinterp',  skillKey: 'mechInterp' },
  { id: 1007, npcId: 'david',  keyword: 'cev',         skillKey: 'cev' },
  { id: 1008, npcId: 'victor', keyword: 'cev',         skillKey: 'cev' },
  { id: 1009, npcId: 'mark',   keyword: 'rationality', skillKey: 'decisionTheory' },
  { id: 1010, npcId: 'bena',   keyword: 'infinite',    skillKey: 'decisionTheory' },
  { id: 1011, npcId: 'phil',   keyword: 'forecasting', skillKey: 'decisionTheory' },
  { id: 1012, npcId: 'jonas',  keyword: 'containment', skillKey: 'containment' },
  { id: 1013, npcId: 'kaarel', keyword: 'containment', skillKey: 'containment' },
  { id: 1014, npcId: 'okko',    keyword: 'xrisk',        skillKey: 'containment' },
  { id: 1015, npcId: 'mikhail', keyword: 'benchmarking', skillKey: 'containment' },
];
