"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

export type TrendPoint = {
  date: string;
  label: string;
  total: number;
  average: number;
  matchType: number;
};

const PINK = "#FF69B4";
const PINK_DARK = "#C43682";

type Mode = "total" | "average";

export default function ResultChart({ data }: { data: TrendPoint[] }) {
  const [mode, setMode] = useState<Mode>("total");
  const [range, setRange] = useState<"6m" | "all">("all");

  const now = Date.now();
  const cutoff = now - 1000 * 60 * 60 * 24 * 183; // ~6 mån
  const filtered =
    range === "6m"
      ? data.filter((d) => new Date(d.date).getTime() >= cutoff)
      : data;

  const key = mode === "total" ? "total" : "average";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-pink-200 p-0.5">
          <ToggleButton active={mode === "total"} onClick={() => setMode("total")}>
            Totalpoäng
          </ToggleButton>
          <ToggleButton
            active={mode === "average"}
            onClick={() => setMode("average")}
          >
            Snitt / skott
          </ToggleButton>
        </div>
        <div className="inline-flex rounded-full border border-pink-200 p-0.5">
          <ToggleButton active={range === "6m"} onClick={() => setRange("6m")}>
            Senaste 6 mån
          </ToggleButton>
          <ToggleButton active={range === "all"} onClick={() => setRange("all")}>
            Allt
          </ToggleButton>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-ink-muted">
          Inga resultat i vald period ännu.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filtered} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="pinkStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={PINK} />
                <stop offset="100%" stopColor={PINK_DARK} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3D9E8" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#8A8A96" }}
              tickLine={false}
              axisLine={{ stroke: "#F3D9E8" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#8A8A96" }}
              tickLine={false}
              axisLine={false}
              domain={
                mode === "average" ? [0, 10.9] : ["dataMin - 5", "dataMax + 5"]
              }
            />
            {mode === "average" && (
              <ReferenceLine y={10.9} stroke="#F3B6D4" strokeDasharray="4 4" />
            )}
            <Tooltip content={<ChartTooltip mode={mode} />} />
            <Line
              type="monotone"
              dataKey={key}
              stroke="url(#pinkStroke)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#fff", stroke: PINK, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: PINK }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-pink-500 text-white" : "text-ink-soft hover:text-pink-700"
      }`}
    >
      {children}
    </button>
  );
}

function ChartTooltip({
  active,
  payload,
  mode,
}: {
  active?: boolean;
  payload?: Array<{ payload: TrendPoint }>;
  mode: Mode;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  const value = mode === "total" ? p.total : p.average;
  const decimals = mode === "total" ? 1 : 2;
  return (
    <div className="rounded-lg border border-pink-100 bg-white px-3 py-2 shadow-card">
      <p className="text-xs text-ink-muted">{p.label}</p>
      <p className="font-heading text-lg text-ink">
        {value.toLocaleString("sv-SE", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        <span className="ml-1 text-xs font-body text-ink-muted">
          {mode === "total" ? `p (${p.matchType} skott)` : "p/skott"}
        </span>
      </p>
    </div>
  );
}
