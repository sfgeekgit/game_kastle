#!/usr/bin/env bash
# Restore recent player characters to the prod map after a server restart.
# Queries the DB for up to 6 most-recently-active PCs not in the lobby,
# and places each one at a random valid floor tile in their last known room.

set -euo pipefail

SECRET=$(sudo systemctl cat game_kastle | grep 'SESSION_SECRET=' | sed 's/.*SESSION_SECRET=//;s/"//g')

if [[ -z "$SECRET" ]]; then
  echo "ERROR: Could not read SESSION_SECRET from game_kastle.service" >&2
  exit 1
fi

echo "Calling restore-pcs endpoint on prod server (port 3006)..."
curl -s -X POST http://localhost:3006/api/admin/restore-pcs \
  -H "x-admin-secret: $SECRET" \
  -H "Content-Type: application/json" \
  | python3 -m json.tool 2>/dev/null || cat
