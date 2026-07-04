"use client";

import { useEffect, useState } from "react";
import { computeAggregates, seriesTotals, formatScore } from "@/lib/stats";

/**
 * Rutnät för att mata in enskilda skott (0,0–10,9), grupperade i serier om 10.
 * Rapporterar upp de ifyllda skotten som number[] via onChange (tomma celler hoppas över).
 */
export default function ShotGrid({
  matchType,
  value,
  onChange,
}: {
  matchType: number;
  value: number[];
  onChange: (shots: number[]) => void;
}) {
  // Intern strängrepresentation så att man kan skriva "10," utan att tappa fokus.
  const [cells, setCells] = useState<string[]>(() => padCells(value, matchType));

  // Anpassa antal celler när matchType ändras (behåll redan inmatade värden).
  useEffect(() => {
    setCells((prev) => resize(prev, matchType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchType]);

  function emit(next: string[]) {
    onChange(filledShots(next));
  }

  function update(index: number, raw: string) {
    const cleaned = raw.replace(/[^0-9.,]/g, "").replace(",", ".");
    const next = [...cells];
    next[index] = cleaned;
    setCells(next);
    emit(next);
  }

  function clampOnBlur(index: number) {
    const raw = cells[index];
    if (raw.trim() === "") return;
    const clamped = Math.min(Math.max(parseFloat(raw) || 0, 0), 10.9);
    const next = [...cells];
    next[index] = formatScore(clamped);
    setCells(next);
    emit(next);
  }

  const numbers = filledShots(cells);
  const agg = computeAggregates(numbers);
  const series = seriesTotals(padForSeries(cells));
  const starts: number[] = [];
  for (let i = 0; i < matchType; i += 10) starts.push(i);

  return (
    <div>
      <div className="space-y-2">
        {starts.map((start, ri) => (
          <div key={ri} className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-xs font-medium text-ink-muted">
              Serie {ri + 1}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: Math.min(10, matchType - start) }).map((_, ci) => {
                const index = start + ci;
                return (
                  <input
                    key={index}
                    inputMode="decimal"
                    value={cells[index] ?? ""}
                    onChange={(e) => update(index, e.target.value)}
                    onBlur={() => clampOnBlur(index)}
                    placeholder="–"
                    className="h-10 w-12 rounded-md border border-pink-200 text-center text-sm tabular-nums outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  />
                );
              })}
            </div>
            <span className="ml-auto w-14 shrink-0 text-right text-sm font-medium tabular-nums text-pink-700">
              {series[ri] ? formatScore(series[ri]) : "–"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-pink-50 px-4 py-3">
        <span className="text-sm text-ink-soft">
          {agg.shotCount} / {matchType} skott ifyllda
        </span>
        <div className="flex gap-6 text-sm">
          <span className="text-ink-soft">
            Snitt:{" "}
            <strong className="font-heading text-base text-ink">
              {formatScore(agg.average, 2)}
            </strong>
          </span>
          <span className="text-ink-soft">
            Total:{" "}
            <strong className="font-heading text-base text-pink-700">
              {formatScore(agg.total)}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}

/** Endast ifyllda celler, i ordning, parsade till tal. */
function filledShots(cells: string[]): number[] {
  return cells
    .filter((c) => c.trim() !== "")
    .map((c) => Math.min(Math.max(parseFloat(c.replace(",", ".")) || 0, 0), 10.9));
}

/** För serieberäkning behåller vi positioner (tomma = 0). */
function padForSeries(cells: string[]): number[] {
  return cells.map((c) =>
    c.trim() === "" ? 0 : Math.min(Math.max(parseFloat(c.replace(",", ".")) || 0, 0), 10.9)
  );
}

function padCells(nums: number[], length: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < length; i++) {
    out.push(i < nums.length ? formatScore(nums[i]) : "");
  }
  return out;
}

function resize(cells: string[], length: number): string[] {
  const out = cells.slice(0, length);
  while (out.length < length) out.push("");
  return out;
}
