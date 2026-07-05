# ---- Emilia Falk skyttedashboard ----
# En enkel enstegs-image: behåller node_modules så att Prisma-CLI:t finns
# tillgängligt för `db push` + seed vid containerstart.
FROM node:20-slim

WORKDIR /app

# Prisma på Debian-slim behöver openssl.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NEXT_TELEMETRY_DISABLED=1

# Installera beroenden (inkl. dev, som behövs för build + prisma CLI).
COPY package.json package-lock.json* .npmrc ./
COPY prisma ./prisma
RUN npm install

# Kopiera resten och bygg.
COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
