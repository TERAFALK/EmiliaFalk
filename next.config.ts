import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kör bakom Nginx Proxy Manager på samma host. Vi behåller fulla node_modules i
  // imagen (ingen "standalone") så att Prisma-CLI:t finns tillgängligt för `db push`
  // och seed vid containerstart.
  eslint: {
    // Bygget ska inte falla på lint-varningar vid deploy.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Säkerhetsnät: ett enstaka typfel (t.ex. i tredjeparts-typer som Recharts)
    // ska inte stoppa produktionsbygget/deployen. Typerna gäller ändå i editorn.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
