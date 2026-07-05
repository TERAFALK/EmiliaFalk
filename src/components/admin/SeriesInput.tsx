"use client";

import { useEffect, useState } from "react";
import { formatScore, round1, round2 } from "@/lib/stats";

/**
 * Inmatning av hela serietotaler (0,0–109,0) när skott-för-skott inte är känt.
 * Antal serier = matchType / 10. Rapporterar upp serietotaler som number[].
 */
export default function SeriesInput({
  matchType,
  value,
  onChange,
}: {
  matchType: number;
  value: number[];
  onChange: (series: number[]) => void;
}) {
  const seriesCount = Math.max(1, Math.round(matchType / 10));
  const [cells, setCells] = useState<string[]>(() => pad(value, seriesCount));

  useEffect(() => {
    setCells((prev) => resize(prev, seriesCount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesCount]);

  function emit(next: string[]) {
    onChange(filled(next));
  }

  function update(i: number, raw: string) {
    const cleaned = raw.replace(/[^0-9.,]/g, "").replace(",", ".");
    const next = [...cells];
    next[i] = cleaned;
    setCells(next);
    emit(next);
  }

  function clampOnBlur(i: number) {
    if (cells[i].trim() === "") return;
    const clamped = Math.min(Math.max(parseFloat(cells[i]) || 0, 0), 109);
    const next = [...cells];
    next[i] = formatScore(round1(clamped));
    setCells(next);
    emit(next);
  }

  const numbers = filled(cells);
  const total = round1(numbers.reduce((s, v) => s + v, 0));
  const average = matchType > 0 ? round2(total / matchType) : 0;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: seriesCount }).map((_, i) => (
          <label key={i} className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-xs font-medium text-ink-muted">
              Serie {i + 1}
            </span>
            <input
              inputMode="decimal"
              value={cells[i] ?? ""}
              onChange={(e) => update(i, e.target.value)}
              onBlur={() => clampOnBlur(i)}
              placeholder="0,0"
              className="h-10 w-full rounded-md border border-pink-200 text-center text-sm tabular-nums outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-pink-50 px-4 py-3">
        <span className="text-sm text-ink-soft">
          {numbers.length} / {seriesCount} serier ifyllda
        </span>
        <div className="flex gap-6 text-sm">
          <span className="text-ink-soft">
            Snitt:{" "}
            <strong className="font-heading text-base text-ink">
              {formatScore(average, 2)}
            </strong>
          </span>
          <span className="text-ink-soft">
            Total:{" "}
            <strong className="font-heading text-base text-pink-700">
              {formatScore(total)}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}

function filled(cells: string[]): number[] {
  return cells
    .filter((c) => c.trim() !== "")
    .map((c) => Math.min(Math.max(parseFloat(c.replace(",", ".")) || 0, 0), 109));
}

function pad(nums: number[], length: number): string[] {
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
