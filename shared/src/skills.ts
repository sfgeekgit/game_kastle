export const SKILL_DEFS = [
  { key: 'mechInterp',     label: 'Mech Interp' },
  { key: 'cev',            label: 'C.E.V.' },
  { key: 'decisionTheory', label: 'Decision Theory' },
  { key: 'containment',    label: 'Containment' },
] as const;

export type SkillKey = typeof SKILL_DEFS[number]['key'];
