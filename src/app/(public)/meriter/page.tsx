import { getMerits } from "@/lib/data";
import { formatDate } from "@/lib/stats";
import { Badge, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Meriter – Emilia Falk",
};

export default async function MeriterPage() {
  const merits = await getMerits();

  // Gruppera per år (senaste först).
  const byYear = new Map<number, typeof merits>();
  for (const m of merits) {
    const year = new Date(m.date).getFullYear();
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(m);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">Meriter</h1>
        <p className="mt-2 text-ink-soft">
          Utmärkelser och placeringar genom åren.
        </p>
      </div>

      {merits.length === 0 ? (
        <EmptyState>Inga meriter inlagda ännu.</EmptyState>
      ) : (
        <div className="space-y-10">
          {years.map((year) => (
            <section key={year}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-heading text-2xl text-pink-700">{year}</h2>
                <span className="h-px flex-1 bg-pink-100" />
              </div>
              <ul className="space-y-3">
                {byYear.get(year)!.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-xl2 border border-pink-100 bg-white p-5 shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">{m.title}</p>
                        {m.description && (
                          <p className="mt-1 text-sm text-ink-soft">
                            {m.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-ink-muted">
                          {formatDate(m.date)}
                        </p>
                      </div>
                      {m.placement && <Badge tone="green">{m.placement}</Badge>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
