"use client";

import { useState } from "react";
import SeriesChart from "@/components/charts/SeriesChart";
import { formatScore } from "@/lib/stats";
import { Badge } from "@/components/ui";

export type ResultView = {
  id: string;
  dateLabel: string;
  matchType: number;
  total: number;
  average: number;
  shots: number[];
  series: number[];
  competitionName: string | null;
  note: string | null;
};

export default function ResultCard({ result }: { result: ResultView }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl2 border border-pink-100 bg-white shadow-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-pink-50/30"
      >
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-pink-200 bg-pink-50">
          <span className="font-heading text-2xl leading-none text-pink-700">
            {formatScore(result.total)}
          </span>
          <span className="text-[10px] uppercase text-pink-600">poäng</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium text-ink">
              {result.competitionName || `${result.matchType} skott`}
            </p>
            <Badge tone="gray">{result.matchType} skott</Badge>
          </div>
          <p className="mt-0.5 text-sm text-ink-muted">
            {result.dateLabel} · snitt {formatScore(result.average, 2)} / skott
          </p>
        </div>
        <svg
          className={`shrink-0 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-pink-100 p-5">
          {result.note && (
            <p className="mb-4 rounded-lg bg-pink-50/60 px-3 py-2 text-sm text-ink-soft">
              {result.note}
            </p>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Serier ({result.series.length} × 10 skott)
              </h4>
              <SeriesChart series={result.series} />
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Alla skott
              </h4>
              <ShotGridView shots={result.shots} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShotGridView({ shots }: { shots: number[] }) {
  const rows: number[][] = [];
  for (let i = 0; i < shots.length; i += 10) {
    rows.push(shots.slice(i, i + 10));
  }
  return (
    <div className="space-y-1.5">
      {rows.map((row, ri) => (
        <div key={ri} className="flex items-center gap-1.5">
          <span className="w-6 shrink-0 text-right text-[11px] text-ink-muted">
            {ri + 1}.
          </span>
          <div className="flex flex-wrap gap-1.5">
            {row.map((s, si) => (
              <span
                key={si}
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-pink-100 bg-pink-50/50 px-1.5 text-xs font-medium tabular-nums text-ink"
                style={
                  s >= 10.5
                    ? { borderColor: "#FF69B4", background: "#FFE0EF" }
                    : undefined
                }
              >
                {formatScore(s)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
