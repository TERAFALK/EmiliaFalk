// Statistik- och beräkningshjälpare för skytteresultat.
// Skott lagras som JSON-array (0.0–10.9 per skott). En "serie" = 10 skott.

export const SHOTS_PER_SERIES = 10;

export type EntryMode = "shots" | "series";

export type ResultLike = {
  id: string;
  date: Date | string;
  matchType: number;
  entryMode: string;
  shots: string; // JSON-serialiserad number[] (skott eller serietotaler)
  total: number;
  shotCount: number;
  average: number;
  note?: string | null;
  competition?: { id: string; name: string } | null;
};

/** Parsar den lagrade shots-strängen till en talarray. */
export function parseShots(shots: string): number[] {
  try {
    const arr = JSON.parse(shots);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));
  } catch {
    return [];
  }
}

/** Beräknar aggregat (total, antal, snitt) från en skottarray. */
export function computeAggregates(shots: number[]): {
  total: number;
  shotCount: number;
  average: number;
} {
  const shotCount = shots.length;
  const total = shots.reduce((sum, v) => sum + v, 0);
  const average = shotCount > 0 ? total / shotCount : 0;
  return {
    total: round1(total),
    shotCount,
    average: round2(average),
  };
}

/** Delar upp skotten i serier om 10 och returnerar serietotaler. */
export function seriesTotals(shots: number[]): number[] {
  const series: number[] = [];
  for (let i = 0; i < shots.length; i += SHOTS_PER_SERIES) {
    const chunk = shots.slice(i, i + SHOTS_PER_SERIES);
    series.push(round1(chunk.reduce((s, v) => s + v, 0)));
  }
  return series;
}

/**
 * Beräknar aggregat oavsett inmatningssätt.
 * - "shots": ett värde per skott (0.0–10.9).
 * - "series": ett värde per serie om 10 skott; snitt/skott = total / matchType.
 */
export function computeResultAggregates(
  entryMode: string,
  values: number[],
  matchType: number
): { total: number; shotCount: number; average: number } {
  const total = round1(values.reduce((s, v) => s + v, 0));
  if (entryMode === "series") {
    const shotCount = matchType > 0 ? matchType : values.length * SHOTS_PER_SERIES;
    return {
      total,
      shotCount,
      average: shotCount > 0 ? round2(total / shotCount) : 0,
    };
  }
  const shotCount = values.length;
  return {
    total,
    shotCount,
    average: shotCount > 0 ? round2(total / shotCount) : 0,
  };
}

/** Returnerar serietotaler för visning, oavsett inmatningssätt. */
export function resultSeries(entryMode: string, values: number[]): number[] {
  if (entryMode === "series") return values.map((v) => round1(v));
  return seriesTotals(values);
}

/** Validerar ett enskilt skottvärde (0.0–10.9). */
export function isValidShot(v: number): boolean {
  return Number.isFinite(v) && v >= 0 && v <= 10.9;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Datum X månader tillbaka från nu. */
export function monthsAgo(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

export type DashboardStats = {
  totalCompetitions: number;
  bestResult: { total: number; matchType: number; date: string } | null;
  avgPerShotLast6m: number | null;
  latestResult: { total: number; matchType: number; date: string } | null;
};

/** Sammanställer nyckeltal för dashboardens stat-kort. */
export function buildDashboardStats(results: ResultLike[]): DashboardStats {
  if (results.length === 0) {
    return {
      totalCompetitions: 0,
      bestResult: null,
      avgPerShotLast6m: null,
      latestResult: null,
    };
  }

  const sorted = [...results].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const best = [...results].sort((a, b) => b.total - a.total)[0];
  const latest = sorted[0];

  const cutoff = monthsAgo(6);
  const recent = results.filter((r) => new Date(r.date) >= cutoff);
  let avgPerShot: number | null = null;
  if (recent.length > 0) {
    const totalShots = recent.reduce((s, r) => s + r.shotCount, 0);
    const totalPoints = recent.reduce((s, r) => s + r.total, 0);
    avgPerShot = totalShots > 0 ? round2(totalPoints / totalShots) : null;
  }

  return {
    totalCompetitions: results.length,
    bestResult: {
      total: round1(best.total),
      matchType: best.matchType,
      date: new Date(best.date).toISOString(),
    },
    avgPerShotLast6m: avgPerShot,
    latestResult: {
      total: round1(latest.total),
      matchType: latest.matchType,
      date: new Date(latest.date).toISOString(),
    },
  };
}

/** Data för resultat-över-tid-grafen. */
export function resultTrend(
  results: ResultLike[]
): { date: string; label: string; total: number; average: number; matchType: number }[] {
  return [...results]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: new Date(r.date).toISOString(),
      label: formatDateShort(r.date),
      total: round1(r.total),
      average: round2(r.average),
      matchType: r.matchType,
    }));
}

export function formatDateShort(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Returnerar YYYY-MM-DD för <input type="date"> (lokal tid). */
export function toDateInputValue(date: Date | string): string {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Formaterar poäng med en decimal och svensk komma (t.ex. 623,4). */
export function formatScore(n: number, decimals = 1): string {
  return n.toLocaleString("sv-SE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
