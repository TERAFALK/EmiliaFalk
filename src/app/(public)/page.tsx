import Link from "next/link";
import {
  getResults,
  getUpcomingCompetitions,
  getNews,
  getMerits,
  getSponsors,
} from "@/lib/data";
import {
  buildDashboardStats,
  resultTrend,
  formatScore,
  formatDate,
} from "@/lib/stats";
import StatCard from "@/components/StatCard";
import ResultChart from "@/components/charts/ResultChart";
import NewsCard from "@/components/NewsCard";
import SponsorStrip from "@/components/SponsorStrip";
import { Card, SectionHeader, Badge, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [results, upcoming, news, merits, sponsors] = await Promise.all([
    getResults(),
    getUpcomingCompetitions(5),
    getNews(3),
    getMerits(),
    getSponsors(),
  ]);

  const stats = buildDashboardStats(results);
  const trend = resultTrend(results);

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient border-b border-pink-100">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="flex flex-col items-center text-center">
            <Badge>Luftgevär · stående</Badge>
            <h1 className="mt-4 font-heading text-5xl leading-tight text-ink sm:text-7xl">
              Emilia Falk
            </h1>
            <p className="mt-4 max-w-xl text-base text-ink-soft sm:text-lg">
              Följ Emilias skytteresa – resultat, statistik, kommande tävlingar
              och nyheter, allt på ett ställe.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/resultat"
                className="rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-pink-600"
              >
                Se alla resultat
              </Link>
              <Link
                href="/tavlingar"
                className="rounded-full border border-pink-200 bg-white px-6 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
              >
                Kommande tävlingar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12">
        {/* Stat-kort */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Bästa resultat"
            value={stats.bestResult ? formatScore(stats.bestResult.total) : "–"}
            sub={
              stats.bestResult
                ? `${stats.bestResult.matchType} skott · ${formatDate(stats.bestResult.date)}`
                : "Inga resultat än"
            }
          />
          <StatCard
            label="Snitt / skott"
            value={
              stats.avgPerShotLast6m !== null
                ? formatScore(stats.avgPerShotLast6m, 2)
                : "–"
            }
            sub="Senaste 6 månaderna"
          />
          <StatCard
            label="Registrerade resultat"
            value={stats.totalCompetitions}
            sub="Totalt inrapporterade"
          />
          <StatCard
            label="Senaste resultat"
            value={
              stats.latestResult ? formatScore(stats.latestResult.total) : "–"
            }
            sub={
              stats.latestResult
                ? `${stats.latestResult.matchType} skott · ${formatDate(stats.latestResult.date)}`
                : "Inga resultat än"
            }
          />
        </div>

        {/* Resultatgraf */}
        <div className="mt-8">
          <Card>
            <SectionHeader
              title="Resultatutveckling"
              subtitle="Totalpoäng och snitt per skott över tid"
            />
            {trend.length === 0 ? (
              <EmptyState>
                När pappa lagt in resultat visas de här som en graf.
              </EmptyState>
            ) : (
              <ResultChart data={trend} />
            )}
          </Card>
        </div>

        {/* Tävlingar + Meriter */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section>
            <SectionHeader
              title="Kommande tävlingar"
              action={
                <Link href="/tavlingar" className="text-sm font-medium text-pink-700 hover:underline">
                  Kalender →
                </Link>
              }
            />
            {upcoming.length === 0 ? (
              <EmptyState>Inga kommande tävlingar inlagda just nu.</EmptyState>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-4 rounded-xl2 border border-pink-100 bg-white p-4 shadow-card"
                  >
                    <DateChip date={c.date} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{c.name}</p>
                      <p className="truncate text-sm text-ink-muted">
                        {c.location || c.discipline}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <SectionHeader title="Meriter" subtitle="Utmärkelser och placeringar" />
            {merits.length === 0 ? (
              <EmptyState>Inga meriter inlagda ännu.</EmptyState>
            ) : (
              <ul className="space-y-3">
                {merits.slice(0, 5).map((m) => (
                  <li
                    key={m.id}
                    className="rounded-xl2 border border-pink-100 bg-white p-4 shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">{m.title}</p>
                        {m.description && (
                          <p className="mt-0.5 text-sm text-ink-soft">
                            {m.description}
                          </p>
                        )}
                      </div>
                      {m.placement && <Badge tone="green">{m.placement}</Badge>}
                    </div>
                    <p className="mt-2 text-xs text-ink-muted">
                      {formatDate(m.date)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Nyheter */}
        <div className="mt-12">
          <SectionHeader
            title="Senaste nytt"
            action={
              <Link href="/nyheter" className="text-sm font-medium text-pink-700 hover:underline">
                Alla nyheter →
              </Link>
            }
          />
          {news.length === 0 ? (
            <EmptyState>Inga nyheter publicerade ännu.</EmptyState>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((post) => (
                <NewsCard
                  key={post.id}
                  post={{ ...post, publishedAt: post.publishedAt.toISOString() }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sponsorer */}
        <SponsorStrip
          sponsors={sponsors.map((s) => ({
            id: s.id,
            name: s.name,
            logoPath: s.logoPath,
            url: s.url,
          }))}
        />
      </div>
    </div>
  );
}

function DateChip({ date }: { date: Date }) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleDateString("sv-SE", { month: "short" });
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-pink-200 bg-pink-50 text-pink-700">
      <span className="font-heading text-xl leading-none">{day}</span>
      <span className="text-[11px] uppercase">{month}</span>
    </div>
  );
}
