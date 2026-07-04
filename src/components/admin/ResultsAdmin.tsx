"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminResult, CompetitionOption } from "@/lib/adminTypes";
import { formatScore, toDateInputValue } from "@/lib/stats";
import ShotGrid from "@/components/admin/ShotGrid";
import {
  Field,
  TextInput,
  TextArea,
  PrimaryButton,
  GhostButton,
  DangerButton,
  FeedbackBar,
} from "@/components/admin/ui";

type FormState = {
  id: string | null;
  date: string;
  matchType: number;
  competitionId: string;
  note: string;
  shots: number[];
};

function emptyForm(): FormState {
  return {
    id: null,
    date: toDateInputValue(new Date()),
    matchType: 60,
    competitionId: "",
    note: "",
    shots: [],
  };
}

export default function ResultsAdmin({
  results,
  competitions,
}: {
  results: AdminResult[];
  competitions: CompetitionOption[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startNew() {
    setError(null);
    setForm(emptyForm());
  }

  function startEdit(r: AdminResult) {
    setError(null);
    setForm({
      id: r.id,
      date: r.date,
      matchType: r.matchType,
      competitionId: r.competitionId ?? "",
      note: r.note ?? "",
      shots: r.shots,
    });
  }

  async function save() {
    if (!form) return;
    if (form.shots.length === 0) {
      setError("Fyll i minst ett skott.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        date: form.date,
        matchType: form.matchType,
        shots: form.shots,
        competitionId: form.competitionId || null,
        note: form.note || null,
      };
      const res = await fetch(
        form.id ? `/api/results/${form.id}` : "/api/results",
        {
          method: form.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Kunde inte spara");
        return;
      }
      setForm(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    await fetch(`/api/results/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {!form && (
        <div className="flex justify-between">
          <p className="text-sm text-ink-muted">
            {results.length} registrerade resultat
          </p>
          <PrimaryButton onClick={startNew}>+ Nytt resultat</PrimaryButton>
        </div>
      )}

      {form && (
        <div className="rounded-xl2 border border-pink-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 font-heading text-2xl text-ink">
            {form.id ? "Redigera resultat" : "Nytt resultat"}
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Datum">
              <TextInput
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            <Field label="Antal skott (serie)">
              <div className="flex gap-2">
                {[40, 60].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, matchType: n })}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                      form.matchType === n
                        ? "border-pink-400 bg-pink-50 text-pink-700"
                        : "border-pink-200 text-ink-soft"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <TextInput
                  type="number"
                  min={1}
                  max={120}
                  value={form.matchType}
                  onChange={(e) =>
                    setForm({ ...form, matchType: Number(e.target.value) || 0 })
                  }
                  className="w-24"
                />
              </div>
            </Field>
            <Field label="Tävling (valfritt)">
              <select
                value={form.competitionId}
                onChange={(e) =>
                  setForm({ ...form, competitionId: e.target.value })
                }
                className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              >
                <option value="">— Ingen —</option>
                {competitions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-5">
            <span className="mb-2 block text-sm font-medium text-ink-soft">
              Skott (0,0–10,9)
            </span>
            <ShotGrid
              matchType={form.matchType}
              value={form.shots}
              onChange={(shots) => setForm({ ...form, shots })}
            />
          </div>

          <div className="mt-4">
            <Field label="Anteckning (valfritt)">
              <TextArea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="T.ex. förhållanden, känsla, teknik…"
              />
            </Field>
          </div>

          {error && (
            <div className="mt-4">
              <FeedbackBar message={error} tone="error" />
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <PrimaryButton onClick={save} disabled={saving}>
              {saving ? "Sparar…" : "Spara resultat"}
            </PrimaryButton>
            <GhostButton onClick={() => setForm(null)}>Avbryt</GhostButton>
          </div>
        </div>
      )}

      {!form && (
        <ul className="space-y-2">
          {results.map((r) => (
            <li
              key={r.id}
              className="flex items-center gap-4 rounded-xl2 border border-pink-100 bg-white p-4 shadow-card"
            >
              <div className="flex h-12 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-pink-50">
                <span className="font-heading text-lg leading-none text-pink-700">
                  {formatScore(r.total)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">
                  {r.date} · {r.matchType} skott
                </p>
                <p className="text-xs text-ink-muted">
                  snitt {formatScore(r.average, 2)} / skott
                  {r.note ? ` · ${r.note}` : ""}
                </p>
              </div>
              <GhostButton onClick={() => startEdit(r)}>Redigera</GhostButton>
              <DangerButton onConfirm={() => remove(r.id)}>Ta bort</DangerButton>
            </li>
          ))}
          {results.length === 0 && (
            <p className="rounded-xl2 border border-dashed border-pink-200 bg-pink-50/20 px-6 py-8 text-center text-sm text-ink-muted">
              Inga resultat inlagda. Klicka på “Nytt resultat”.
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
