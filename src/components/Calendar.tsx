"use client";

import { useMemo, useState } from "react";

export type CalendarEvent = {
  id: string;
  name: string;
  date: string; // ISO
  location?: string | null;
  isCompleted: boolean;
};

const WEEKDAYS = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"];
const MONTHS = [
  "Januari", "Februari", "Mars", "April", "Maj", "Juni",
  "Juli", "Augusti", "September", "Oktober", "November", "December",
];

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function Calendar({ events }: { events: CalendarEvent[] }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const today = new Date();

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    // Måndag = 0
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const eventsFor = (day: Date) =>
    events.filter((e) => sameDay(new Date(e.date), day));

  return (
    <div className="rounded-xl2 border border-pink-100 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          className="rounded-lg p-1.5 text-ink-soft hover:bg-pink-50 hover:text-pink-700"
          aria-label="Föregående månad"
        >
          <Chevron dir="left" />
        </button>
        <h3 className="font-heading text-xl text-ink">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </h3>
        <button
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          className="rounded-lg p-1.5 text-ink-soft hover:bg-pink-50 hover:text-pink-700"
          aria-label="Nästa månad"
        >
          <Chevron dir="right" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-1 text-[11px] font-semibold uppercase text-ink-muted">
            {w}
          </div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const dayEvents = eventsFor(day);
          const has = dayEvents.length > 0;
          const isToday = sameDay(day, today);
          return (
            <div
              key={i}
              title={dayEvents.map((e) => e.name).join(", ")}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm ${
                has
                  ? "bg-pink-50 font-semibold text-pink-700"
                  : "text-ink-soft"
              } ${isToday ? "ring-1 ring-pink-300" : ""}`}
            >
              {day.getDate()}
              {has && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-pink-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {dir === "left" ? (
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
