#!/bin/sh
set -e

# Se till att volym-mapparna finns.
mkdir -p /app/data /app/uploads

echo "[start] Synkar databasschema (prisma db push)…"
npx prisma db push --skip-generate

echo "[start] Seedar admin-användare…"
node prisma/seed.mjs || echo "[start] Seed misslyckades (fortsätter ändå)."

echo "[start] Startar applikationen…"
exec "$@"
