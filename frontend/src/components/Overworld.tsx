import { useEffect, useState } from 'react';
import {
  OVERWORLD_LAYOUT,
  OVERWORLD_CANVAS_WIDTH,
  OVERWORLD_CANVAS_HEIGHT,
} from '@game_kastle/shared';
import { api } from '../api.js';

interface RoomPresence {
  mapId: string;
  players: string[];
}

interface OverworldResponse {
  rooms: RoomPresence[];
}

const POLL_MS = 3000;

interface OverworldProps {
  onExit: () => void;
}

export function Overworld({ onExit }: OverworldProps) {
  const [presence, setPresence] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchPresence = async () => {
      try {
        const res = await api.get<OverworldResponse>('/area/overworld');
        if (cancelled) return;
        const map: Record<string, string[]> = {};
        for (const room of res.rooms) map[room.mapId] = room.players;
        setPresence(map);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch overworld');
      }
    };
    void fetchPresence();
    const id = setInterval(fetchPresence, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const totalPlayers = Object.values(presence).reduce((sum, p) => sum + p.length, 0);

  return (
    <div
      style={{
        backgroundColor: '#1a1a2e',
        color: '#eee',
        minHeight: '100vh',
        padding: 24,
        fontFamily: "'Courier New', monospace",
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>Overworld</h2>
          <p style={{ margin: '4px 0', color: '#888', fontSize: 13 }}>
            {totalPlayers} player{totalPlayers === 1 ? '' : 's'} online · refreshes every {POLL_MS / 1000}s
          </p>
        </div>
        <button
          onClick={onExit}
          style={{
            padding: '8px 16px',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Back
        </button>
      </div>

      {error && (
        <p style={{ color: '#c0392b', marginBottom: 12 }}>Error: {error}</p>
      )}

      {(() => {
        const floorMap = new Map<number, typeof OVERWORLD_LAYOUT>();
        for (const room of OVERWORLD_LAYOUT) {
          if (!floorMap.has(room.floor)) floorMap.set(room.floor, []);
          floorMap.get(room.floor)!.push(room);
        }
        const floors = Array.from(floorMap.entries()).sort(([a], [b]) => a - b);
        const multiFloor = floors.length > 1;
        return floors.map(([floorNum, rooms]) => (
          <div key={floorNum} style={{ marginBottom: 16 }}>
            {multiFloor && (
              <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Floor {floorNum}</div>
            )}
            <div
              style={{
                position: 'relative',
                width: OVERWORLD_CANVAS_WIDTH,
                height: OVERWORLD_CANVAS_HEIGHT,
                backgroundColor: '#0f0f1e',
                border: '1px solid #333',
                borderRadius: 4,
                maxWidth: '100%',
                overflow: 'auto',
              }}
            >
              {rooms.map((room) => {
                const players = presence[room.mapId] ?? [];
                const occupied = players.length > 0;
                return (
                  <div
                    key={room.mapId}
                    style={{
                      position: 'absolute',
                      left: room.x,
                      top: room.y,
                      width: room.w,
                      height: room.h,
                      border: `2px solid ${occupied ? '#f1c40f' : '#555'}`,
                      backgroundColor: occupied ? '#2c2c54' : '#1f1f3a',
                      borderRadius: 6,
                      padding: 8,
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 'bold', color: '#fff' }}>{room.label}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {players.map((pid) => (
                        <span
                          key={pid}
                          title={`Player ${pid}`}
                          style={{
                            backgroundColor: '#f1c40f',
                            color: '#1a1a2e',
                            padding: '2px 6px',
                            borderRadius: 10,
                            fontSize: 11,
                            fontWeight: 'bold',
                          }}
                        >
                          #{pid}
                        </span>
                      ))}
                      {!occupied && (
                        <span style={{ fontSize: 11, color: '#666', fontStyle: 'italic' }}>empty</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ));
      })()}
    </div>
  );
}
