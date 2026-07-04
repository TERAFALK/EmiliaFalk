import { ReactNode } from "react";

export default function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl2 border border-pink-100 bg-white p-5 shadow-card transition-shadow hover:shadow-cardHover">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          {label}
        </span>
        {icon && <span className="text-pink-500">{icon}</span>}
      </div>
      <div className="mt-2 font-heading text-4xl leading-none text-ink">
        {value}
      </div>
      {sub && <p className="mt-2 text-xs text-ink-muted">{sub}</p>}
    </div>
  );
}
