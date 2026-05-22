import { useState, useEffect, useRef } from 'react';
import { resolveKeyword, POWERUPS } from '@game_kastle/shared';
import type { NpcDialogueData, DialogueFallbacks } from '@game_kastle/shared';
import { api } from '../api.js';

interface DialogueWindowProps {
  npcId: string;
  npcName: string;
  onClose: () => void;
  onSkillGained?: (skills: Record<string, number>) => void;
  img?: string;
}

interface DialogueEntry {
  speaker: 'player' | 'npc';
  text: string;
  isFallback?: boolean;
}

export function DialogueWindow({ npcId, npcName, onClose, onSkillGained, img = undefined }: DialogueWindowProps) {
  const [npcData, setNpcData] = useState<NpcDialogueData | null>(null);
  const [fallbacks, setFallbacks] = useState<DialogueFallbacks | undefined>();
  const [entries, setEntries] = useState<DialogueEntry[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [floatLabel, setFloatLabel] = useState<string | null>(null);
  const [floatKey, setFloatKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Load dialogue data on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get<{ npcData: NpcDialogueData; fallbacks: DialogueFallbacks }>(
          `/area/npc/${npcId}/dialogue`,
        );
        if (cancelled) return;
        setNpcData(res.npcData);
        setFallbacks(res.fallbacks);
        // Show initial greeting — the NPC's "look" description
        const look = res.npcData.dialogue.look;
        if (look) {
          setEntries([{ speaker: 'npc', text: look }]);
        }
      } catch {
        if (!cancelled) setError('Failed to load dialogue.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [npcId]);

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [entries]);

  // Focus input and pre-fill "hello" when loaded
  useEffect(() => {
    if (!loading && inputRef.current) {
      setInput('Hello');
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSubmit = () => {
    const keyword = input.trim();
    if (!keyword || !npcData) return;
    setInput('');

    // Check for bye
    if (keyword.toLowerCase() === 'bye') {
      const bye = npcData.dialogue.bye;
      if (bye) {
        setEntries((prev) => [
          ...prev,
          { speaker: 'player', text: keyword },
          { speaker: 'npc', text: bye },
        ]);
        // Close after a short delay so player can read the farewell
        setTimeout(onClose, 1200);
      } else {
        onClose();
      }
      return;
    }

    const { text, isFallback, matchedKey } = resolveKeyword(keyword, npcData, fallbacks);
    setEntries((prev) => [
      ...prev,
      { speaker: 'player', text: keyword },
      { speaker: 'npc', text, isFallback },
    ]);

    if (matchedKey && POWERUPS.some((p) => p.npcId === npcId && p.keyword === matchedKey)) {
      api.post<{ gained: { label: string } | null; skills: Record<string, number> }>(
        '/player/dialogue', { npcId, resolvedKey: matchedKey },
      ).then((res) => {
        if (res.gained) {
          setFloatLabel(res.gained.label);
          setFloatKey((k) => k + 1);
          onSkillGained?.(res.skills);
          setTimeout(() => setFloatLabel(null), 1900);
        }
      }).catch(() => {});
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
    // Stop game controls from firing while typing
    e.stopPropagation();
  };

  return (
    <div
      className="dialogue-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 60,
        zIndex: 100,
      }}
    >
      <div
        className="dialogue-window"
        style={{
          backgroundColor: '#1a1a2e',
          border: '2px solid #c8a96e',
          borderRadius: 8,
          width: '90%',
          maxWidth: 420,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          color: '#e0d6c2',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid #c8a96e',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 8,
              right: 12,
              background: 'none',
              border: '1px solid #c8a96e',
              color: '#c8a96e',
              cursor: 'pointer',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: '0.9em',
            }}
          >
            Close
          </button>
          <span style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#c8a96e' }}>
            {npcName}
          </span>
          {img && (
            <img
              src={img}
              alt={npcName}
              style={{ width: 144, height: 144, borderRadius: 6, objectFit: 'cover' }}
            />
          )}
        </div>
        {/* Dialogue log */}
        <div
          ref={logRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px 12px',
            minHeight: 120,
            maxHeight: '50vh',
          }}
        >
          {loading && <div style={{ color: '#888' }}>Loading...</div>}
          {error && <div style={{ color: '#e63946' }}>{error}</div>}
          {entries.map((entry, i) => (
            <div key={i} style={{ marginBottom: 6, fontSize: '1.4em' }}>
              {entry.speaker === 'player' ? (
                <span style={{ color: '#88c0d0' }}>&gt; {entry.text}</span>
              ) : (
                <span style={{ color: entry.isFallback ? '#8a8070' : '#e0d6c2' }}>{entry.text}</span>
              )}
            </div>
          ))}
        </div>

        {/* Skill gain float bubble */}
        {floatLabel && (
          <div
            key={floatKey}
            style={{
              position: 'absolute',
              bottom: -16,
              left: '50%',
              backgroundColor: 'rgba(15, 15, 30, 0.95)',
              border: '1px solid #c8a96e',
              borderRadius: 6,
              padding: '4px 14px',
              color: '#7ec8e3',
              fontWeight: 'bold',
              fontSize: '0.95em',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              animation: 'skill-gain-float 1.8s ease-out forwards',
              zIndex: 110,
            }}
          >
            +1 {floatLabel}
          </div>
        )}

        {/* Input */}
        {!loading && !error && (
          <div
            style={{
              padding: '8px 12px',
              borderTop: '1px solid #c8a96e',
              display: 'flex',
              gap: 8,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder=""
              style={{
                flex: 1,
                backgroundColor: '#0f0f23',
                border: '1px solid #c8a96e',
                color: '#e0d6c2',
                padding: '6px 8px',
                borderRadius: 4,
                fontFamily: 'monospace',
                fontSize: '1em',
              }}
            />
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: '#c8a96e',
                color: '#1a1a2e',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: 'monospace',
              }}
            >
              Ask
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
