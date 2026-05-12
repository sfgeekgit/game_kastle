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
const SCALE = 0.22;

interface OverworldSidebarProps {
  currentMapId: string;
}

export function OverworldSidebar({ currentMapId }: OverworldSidebarProps) {
  const [presence, setPresence] = useState<Record<string, string[]>>({});

  useEffect(() => {
    let cancelled = false;
    const fetchPresence = async () => {
      try {
        const res = await api.get<OverworldResponse>('/area/overworld');
        if (cancelled) return;
        const map: Record<string, string[]> = {};
        for (const room of res.rooms) map[room.mapId] = room.players;
        setPresence(map);
      } catch {
        // swallow — sidebar shouldn't disrupt gameplay
      }
    };
    void fetchPresence();
    const id = setInterval(fetchPresence, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 60,
        right: 12,
        width: OVERWORLD_CANVAS_WIDTH * SCALE + 16,
        backgroundColor: 'rgba(15, 15, 30, 0.95)',
        border: '1px solid #333',
        borderRadius: 6,
        padding: 8,
        fontFamily: "'Courier New', monospace",
        color: '#eee',
        zIndex: 50,
      }}
    >
      <div style={{ fontSize: 11, color: '#888', marginBottom: 6, textAlign: 'center' }}>
        Overworld
      </div>
      {(() => {
        const floorMap = new Map<number, typeof OVERWORLD_LAYOUT>();
        for (const room of OVERWORLD_LAYOUT) {
          if (!floorMap.has(room.floor)) floorMap.set(room.floor, []);
          floorMap.get(room.floor)!.push(room);
        }
        const floors = Array.from(floorMap.entries()).sort(([a], [b]) => a - b);
        const multiFloor = floors.length > 1;
        return floors.map(([floorNum, rooms]) => (
          <div key={floorNum} style={{ marginBottom: multiFloor ? 6 : 0 }}>
            {multiFloor && (
              <div style={{ fontSize: 9, color: '#666', marginBottom: 2, textAlign: 'center' }}>
                Floor {floorNum}
              </div>
            )}
            <div
              style={{
                position: 'relative',
                width: OVERWORLD_CANVAS_WIDTH * SCALE,
                height: OVERWORLD_CANVAS_HEIGHT * SCALE,
              }}
            >
              {rooms.map((room) => {
                const players = presence[room.mapId] ?? [];
                const count = players.length;
                const isCurrent = room.mapId === currentMapId;
                const occupied = count > 0;
                const borderColor = isCurrent ? '#3498db' : occupied ? '#f1c40f' : '#444';
                const bgColor = isCurrent ? '#1f3a54' : occupied ? '#2c2c54' : '#1a1a2a';
                return (
                  <div
                    key={room.mapId}
                    title={`${room.label} — ${count} player${count === 1 ? '' : 's'}`}
                    style={{
                      position: 'absolute',
                      left: room.x * SCALE,
                      top: room.y * SCALE,
                      width: room.w * SCALE,
                      height: room.h * SCALE,
                      border: `1px solid ${borderColor}`,
                      backgroundColor: bgColor,
                      borderRadius: 3,
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 'bold',
                      color: occupied ? '#f1c40f' : '#666',
                    }}
                  >
                    {count > 0 ? count : ''}
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
