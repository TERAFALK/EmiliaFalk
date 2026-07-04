import { getResults } from "@/lib/data";
import {
  parseShots,
  seriesTotals,
  resultTrend,
  formatDate,
} from "@/lib/stats";
import ResultChart from "@/components/charts/ResultChart";
import ResultCard, { type ResultView } from "@/components/ResultCard";
import { Card, SectionHeader, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Resultat – Emilia Falk",
};

export default async function ResultatPage() {
  const results = await getResults();
  const trend = resultTrend(results);

  const views: ResultView[] = [...results]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((r) => {
      const shots = parseShots(r.shots);
      return {
        id: r.id,
        dateLabel: formatDate(r.date),
        matchType: r.matchType,
        total: r.total,
        average: r.average,
        shots,
        series: seriesTotals(shots),
        competitionName: r.competition?.name ?? null,
        note: r.note ?? null,
      };
    });

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">Resultat</h1>
        <p className="mt-2 text-ink-soft">
          Alla registrerade serier och resultat. Klicka på ett resultat för att se
          alla skott och seriefördelning.
        </p>
      </div>

      {results.length === 0 ? (
        <EmptyState>Inga resultat inlagda ännu.</EmptyState>
      ) : (
        <>
          <Card className="mb-8">
            <SectionHeader
              title="Utveckling"
              subtitle="Totalpoäng och snitt per skott över tid"
            />
            <ResultChart data={trend} />
          </Card>

          <div className="space-y-3">
            {views.map((v) => (
              <ResultCard key={v.id} result={v} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
