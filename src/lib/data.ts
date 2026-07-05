import { prisma } from "@/lib/db";
import type { ResultLike } from "@/lib/stats";

// Serialiserbara typer för klientkomponenter (datum som ISO-strängar).

export async function getResults(): Promise<ResultLike[]> {
  const rows = await prisma.result.findMany({
    orderBy: { date: "asc" },
    include: { competition: { select: { id: true, name: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    date: r.date,
    matchType: r.matchType,
    entryMode: r.entryMode,
    shots: r.shots,
    total: r.total,
    shotCount: r.shotCount,
    average: r.average,
    note: r.note,
    competition: r.competition,
  }));
}

export async function getUpcomingCompetitions(limit?: number) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return prisma.competition.findMany({
    where: { date: { gte: now }, isCompleted: false },
    orderBy: { date: "asc" },
    take: limit,
  });
}

export async function getAllCompetitions() {
  return prisma.competition.findMany({ orderBy: { date: "desc" } });
}

export async function getNews(limit?: number) {
  return prisma.newsPost.findMany({
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getMerits() {
  return prisma.merit.findMany({ orderBy: { date: "desc" } });
}

export async function getSponsors(activeOnly = true) {
  return prisma.sponsor.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}
