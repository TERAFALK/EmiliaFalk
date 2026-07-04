type Sponsor = {
  id: string;
  name: string;
  logoPath: string;
  url?: string | null;
};

/** Subtil sponsorsektion – små, diskreta loggor. */
export default function SponsorStrip({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null;

  return (
    <section className="mt-16">
      <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
        Emilias sponsorer
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {sponsors.map((s) => {
          const logo = (
            <img
              src={s.logoPath}
              alt={s.name}
              title={s.name}
              className="h-9 w-auto max-w-[130px] object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
            />
          );
          return s.url ? (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              {logo}
            </a>
          ) : (
            <span key={s.id} className="shrink-0">
              {logo}
            </span>
          );
        })}
      </div>
    </section>
  );
}
