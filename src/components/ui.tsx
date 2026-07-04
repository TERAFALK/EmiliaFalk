import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl2 border border-pink-100 bg-white p-6 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-heading text-3xl text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({
  children,
  tone = "pink",
}: {
  children: ReactNode;
  tone?: "pink" | "gray" | "green";
}) {
  const tones = {
    pink: "bg-pink-50 text-pink-700 border-pink-200",
    gray: "bg-gray-50 text-ink-soft border-gray-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl2 border border-dashed border-pink-200 bg-pink-50/20 px-6 py-10 text-center text-sm text-ink-muted">
      {children}
    </div>
  );
}
