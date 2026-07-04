import { getAllCompetitions } from "@/lib/data";
import { formatDate } from "@/lib/stats";
import Calendar, { type CalendarEvent } from "@/components/Calendar";
import { SectionHeader, Badge, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tävlingar – Emilia Falk",
};

export default async function TavlingarPage() {
  const competitions = await getAllCompetitions();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming = competitions
    .filter((c) => new Date(c.date) >= now && !c.isCompleted)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = competitions
    .filter((c) => new Date(c.date) < now || c.isCompleted)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const events: CalendarEvent[] = competitions.map((c) => ({
    id: c.id,
    name: c.name,
    date: c.date.toISOString(),
    location: c.location,
    isCompleted: c.isCompleted,
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">Tävlingar</h1>
        <p className="mt-2 text-ink-soft">
          Kalender över kommande och genomförda tävlingar.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Calendar events={events} />
        </div>

        <div>
          <SectionHeader title="Kommande" />
          {upcoming.length === 0 ? (
            <EmptyState>Inga kommande tävlingar inlagda.</EmptyState>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((c) => (
                <CompItem
                  key={c.id}
                  name={c.name}
                  date={c.date}
                  location={c.location}
                  description={c.description}
                />
              ))}
            </ul>
          )}

          <div className="mt-8">
            <SectionHeader title="Genomförda" />
            {past.length === 0 ? (
              <EmptyState>Inga genomförda tävlingar ännu.</EmptyState>
            ) : (
              <ul className="space-y-3">
                {past.map((c) => (
                  <CompItem
                    key={c.id}
                    name={c.name}
                    date={c.date}
                    location={c.location}
                    description={c.description}
                    done
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompItem({
  name,
  date,
  location,
  description,
  done,
}: {
  name: string;
  date: Date;
  location: string | null;
  description: string | null;
  done?: boolean;
}) {
  return (
    <li className="rounded-xl2 border border-pink-100 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-ink">{name}</p>
          <p className="mt-0.5 text-sm text-ink-muted">
            {formatDate(date)}
            {location ? ` · ${location}` : ""}
          </p>
          {description && (
            <p className="mt-2 text-sm text-ink-soft">{description}</p>
          )}
        </div>
        {done && <Badge tone="gray">Genomförd</Badge>}
      </div>
    </li>
  );
}
