# Emilia Falk – Skyttedashboard

En stilren dashboard-sida för Emilia Falks luftgevärsskytte (stående). Publik för alla
besökare, med ett skyddat adminläge där pappa kan mata in resultat, tävlingar, nyheter,
sponsorer och meriter.

- **Publikt:** statistik, resultatgrafer (totalpoäng + snitt/skott, senaste 6 mån),
  tävlingskalender, nyhetsflöde, meriter och en subtil sponsorsektion.
- **Admin:** inloggning + CRUD. Resultat matas in per enskilt skott (0,0–10,9), grupperat
  i serier om 10; total och snitt räknas ut automatiskt.
- **Design:** vit bakgrund, rosa accent `#FF69B4`. Rubriker i *Vogue*, brödtext i *Roboto*.

## Teknik
Next.js 15 (App Router) · TypeScript · Tailwind CSS · Prisma + SQLite · Recharts ·
egen JWT-sessionsinloggning (jose + bcryptjs). Allt körs i en Docker-container med SQLite
på en volym.

---

## Kom igång (Docker Compose)

1. **Fonten Vogue** (rubriker) måste laddas ner manuellt (gratis för privat bruk):
   se [`public/fonts/README.md`](public/fonts/README.md). Utan den visas serif-fallback.

2. **Skapa `.env`** från mallen och fyll i:
   ```bash
   cp .env.example .env
   # Generera en secret:
   openssl rand -base64 32
   ```
   Sätt minst `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_URL` och `NPM_NETWORK`.

3. **Starta:**
   ```bash
   docker compose up --build -d
   ```
   Vid start körs automatiskt databasschema-synk (`prisma db push`) och admin seedas.

4. **Peka NPM mot appen.** Appen ligger på samma Docker-nätverk som Nginx Proxy Manager
   (namnet i `NPM_NETWORK`). Skapa en Proxy Host i NPM med:
   - Forward Hostname: `emilia-web`
   - Forward Port: `3000`
   - (Aktivera SSL som vanligt.)

> Vill du köra utan NPM, avkommentera `ports:` i `docker-compose.yml` så nås appen på
> `http://<host>:3000`.

## Administrera
- Gå till `https://din-domän/admin` och logga in med `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Flikar: **Resultat**, **Tävlingar**, **Nyheter**, **Sponsorer**, **Meriter**.
- Byter du `ADMIN_PASSWORD` i `.env` och startar om, uppdateras lösenordet automatiskt.

## Data & backup
- Databasen är en SQLite-fil på volymen `emilia_data` (`/app/data/emilia.db`).
- Uppladdade bilder ligger på volymen `emilia_uploads` (`/app/uploads`).
- Backup: kopiera dessa volymer, t.ex.
  ```bash
  docker run --rm -v emiliafalk_emilia_data:/d -v "$PWD":/b alpine \
    tar czf /b/emilia-data-backup.tgz -C /d .
  ```

## Utveckling (valfritt, kräver Node 20)
```bash
npm install
echo 'DATABASE_URL="file:./dev.db"' > .env
echo 'AUTH_SECRET="dev-secret"' >> .env
echo 'ADMIN_EMAIL="admin@test.se"' >> .env
echo 'ADMIN_PASSWORD="admin"' >> .env
npx prisma db push
npm run db:seed
npm run dev
```

## Resultatmodell i korthet
- Ett resultat = en serie på t.ex. 40 eller 60 skott.
- Varje skott är 0,0–10,9. Serietotaler (10 skott) och matchtotal beräknas automatiskt.
- Grafer: totalpoäng och snitt/skott över tid, samt seriefördelning per resultat.
