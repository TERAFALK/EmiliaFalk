"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const PINK = "#FF69B4";

/** Stapeldiagram över serietotaler (varje serie = 10 skott, max 109). */
export default function SeriesChart({ series }: { series: number[] }) {
  const data = series.map((total, i) => ({
    name: `Serie ${i + 1}`,
    total,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-ink-muted">
        Inga serier att visa.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3D9E8" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#8A8A96" }}
          tickLine={false}
          axisLine={{ stroke: "#F3D9E8" }}
        />
        <YAxis
          domain={[0, 109]}
          tick={{ fontSize: 11, fill: "#8A8A96" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,105,180,0.06)" }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #FFE0EF",
            fontSize: 13,
          }}
          formatter={(v: number) => [
            v.toLocaleString("sv-SE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
            "Poäng",
          ]}
        />
        <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((_, i) => (
            <Cell key={i} fill={PINK} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
