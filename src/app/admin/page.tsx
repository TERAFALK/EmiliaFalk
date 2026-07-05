import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { parseShots, toDateInputValue } from "@/lib/stats";
import AdminApp from "@/components/admin/AdminApp";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin – Emilia Falk",
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [results, competitions, news, sponsors, merits] = await Promise.all([
    prisma.result.findMany({ orderBy: { date: "desc" } }),
    prisma.competition.findMany({ orderBy: { date: "desc" } }),
    prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" } }),
    prisma.sponsor.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.merit.findMany({ orderBy: { date: "desc" } }),
  ]);

  return (
    <AdminApp
      userName={session.name || session.email}
      results={results.map((r) => ({
        id: r.id,
        date: toDateInputValue(r.date),
        matchType: r.matchType,
        entryMode: r.entryMode === "series" ? "series" : "shots",
        shots: parseShots(r.shots),
        total: r.total,
        average: r.average,
        note: r.note,
        competitionId: r.competitionId,
      }))}
      competitions={competitions.map((c) => ({
        id: c.id,
        name: c.name,
        date: toDateInputValue(c.date),
        location: c.location,
        discipline: c.discipline,
        description: c.description,
        isCompleted: c.isCompleted,
      }))}
      competitionOptions={competitions.map((c) => ({ id: c.id, name: c.name }))}
      news={news.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        imagePath: n.imagePath,
        publishedAt: toDateInputValue(n.publishedAt),
      }))}
      sponsors={sponsors.map((s) => ({
        id: s.id,
        name: s.name,
        logoPath: s.logoPath,
        url: s.url,
        sortOrder: s.sortOrder,
        active: s.active,
      }))}
      merits={merits.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        date: toDateInputValue(m.date),
        placement: m.placement,
      }))}
    />
  );
}
