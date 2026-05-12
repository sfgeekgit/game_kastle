# game_kastle — Claude Agent Instructions

## Project Overview
Medieval fantasy multiplayer web game (Ultima 4 inspired).
- **Stack**: TypeScript monorepo — `shared/` + `backend/` (Express) + `frontend/` (React/Vite)
- **Two main gameplay sections**: "area explore" and "combat"
- **Prod URL**: https://documentbrain.com/game_kastle/
- **Dev URL**: https://documentbrain.com/game_kastle_dev/

## Dev Workflow

**NEVER run `npm run build` or `sudo systemctl restart game_kastle`.** All dev/testing uses the live dev servers. The human deploys to production when ready.

### Main dev servers
Both run as systemd services (auto-start on boot, restart on failure). You should NOT need to touch them — code edits hot-reload automatically.

- **Backend** (Express, tsx watch) — port **3016** — service `game_kastle_dev.service` — logs `/var/log/game_kastle_dev.log`
- **Frontend** (Vite HMR) — port **5174** — service `game_kastle_dev_vite.service` — logs `/var/log/game_kastle_dev_vite.log`

Service controls:
```bash
sudo systemctl status   game_kastle_dev game_kastle_dev_vite
sudo systemctl restart  game_kastle_dev          # backend
sudo systemctl restart  game_kastle_dev_vite     # frontend
```

If you ever need to run the backend manually (debugging a startup crash):
```bash
SESSION_SECRET="K6iBttoa/a1YohzKKhoQKvYM7KSS3o57xKRK12gYHy9uP1UeG7KJ15531gl61nqr" DB_PASSWORD="5h7FhUQaUiDOZckn+p3KpV0EAu9AHqMcxqRZje28qu4=" CORS_ORIGIN="https://documentbrain.com" PORT=3016 npx tsx watch backend/src/server.ts
```

Backend changes hot-reload via `tsx watch`. Frontend changes appear instantly via Vite HMR.

### When a feature is complete, remind the user to deploy:
```bash
cd /home/game_kastle && npm run build -w backend && npm run build -w frontend && sudo systemctl restart game_kastle
```

---

## Worktree Dev Slots

Three permanent slots for parallel agent work. Caddy is already configured. Create a worktree at the path, `npm install`, then **immediately start both servers in the background** using the commands below with the slot's ports.

| Slot | URL | Path | Vite port | Express port |
|------|-----|------|-----------|--------------|
| wt1 | https://documentbrain.com/game_kastle_wt/  | /home/game_kastle_wt  | 5178 | 3013 |
| wt2 | https://documentbrain.com/game_kastle_wt2/ | /home/game_kastle_wt2 | 5176 | 3014 |
| wt3 | https://documentbrain.com/game_kastle_wt3/ | /home/game_kastle_wt3 | 5177 | 3015 |

```bash
# Backend (replace PORT with slot's Express port, run from worktree root):
SESSION_SECRET="K6iBttoa/a1YohzKKhoQKvYM7KSS3o57xKRK12gYHy9uP1UeG7KJ15531gl61nqr" DB_PASSWORD="5h7FhUQaUiDOZckn+p3KpV0EAu9AHqMcxqRZje28qu4=" CORS_ORIGIN="https://documentbrain.com" PORT=3013 npx tsx watch backend/src/server.ts

# Frontend (replace VITE_BASE and VITE_PORT with slot's values, run from worktree root):
VITE_BASE=/game_kastle_wt/ VITE_PORT=5178 npm run dev -w frontend
```

---

## Architecture Rules

### Trust model
**The backend is always the source of truth. Never trust the frontend.** Users can and will tamper with the browser. Nothing arriving from the frontend should be trusted — validate everything server-side. Frontend mode exists for UX (snappy single-player exploration with no per-move network calls), not as a trusted execution environment. Security-sensitive logic (combat outcomes, item grants, progression) must always be validated by the backend.

### Shared code
**If logic runs on both frontend and backend, it must live in `/shared` and be the exact same code on both sides.** Do not write two versions — divergence is a bug. `shared/src/movement.ts` is the primary example: imported directly by both `GameView.tsx` and the backend move API. See `docs/frontend-backend-architecture.md` for full details.

### SQL
All SQL must go through `backend/src/db/query.ts`. Direct mysql2 imports outside `backend/src/db/` are blocked by ESLint.

### Key files
See `docs/codebase-map.md`.
