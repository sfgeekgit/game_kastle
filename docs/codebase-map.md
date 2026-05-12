# Codebase Map

Quick index of where things live. For architecture principles, see `frontend-backend-architecture.md`.

## Key files

| What | Path |
|------|------|
| Map definitions (one file per area) | `shared/src/maps/*.ts` |
| Movement logic (runs on both sides) | `shared/src/movement.ts` |
| Overworld display layout (room positions, sizes) | `shared/src/overworldLayout.ts` |
| NPC dialogue | `text_content/npcs/*.yaml` |
| Area manager (server-side in-memory state) | `backend/src/area/manager.ts` |
| Frontend game view | `frontend/src/components/GameView.tsx` |
| Overworld sidebar (shown inside GameView on wide screens) | `frontend/src/components/OverworldSidebar.tsx` |
| Full-page overworld view | `frontend/src/components/Overworld.tsx` |

## Vite config notes

`vite.config.ts` uses:
- `VITE_BASE` env var for the base path (defaults to `/game_kastle_dev/`)
- `VITE_PORT` for dev server port (main dev runs on `5174`)
