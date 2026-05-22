import { SKILL_DEFS } from '@game_kastle/shared';

interface SkillsPanelProps {
  skills: Record<string, number>;
}

export function SkillsPanel({ skills }: SkillsPanelProps) {
  const visible = SKILL_DEFS.filter((s) => (skills[s.key] ?? 0) > 0);
  if (visible.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 330,
        right: 12,
        fontFamily: "'Courier New', monospace",
        padding: '8px 10px',
        zIndex: 50,
      }}
    >
      <div style={{ fontSize: 11, color: '#888', marginBottom: 6, textAlign: 'center' }}>Skills</div>
      {visible.map((skill) => (
        <div
          key={skill.key}
          style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 11, marginBottom: 3 }}
        >
          <span style={{ color: '#c8a96e' }}>{skill.label}</span>
          <span style={{ color: '#7ec8e3', fontWeight: 'bold' }}>{skills[skill.key]}</span>
        </div>
      ))}
    </div>
  );
}
