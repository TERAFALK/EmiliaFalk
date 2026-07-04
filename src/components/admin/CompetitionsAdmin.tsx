"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminCompetition } from "@/lib/adminTypes";
import { toDateInputValue } from "@/lib/stats";
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
  name: string;
  date: string;
  location: string;
  description: string;
  isCompleted: boolean;
};

function emptyForm(): FormState {
  return {
    id: null,
    name: "",
    date: toDateInputValue(new Date()),
    location: "",
    description: "",
    isCompleted: false,
  };
}

export default function CompetitionsAdmin({
  competitions,
}: {
  competitions: AdminCompetition[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(c: AdminCompetition) {
    setError(null);
    setForm({
      id: c.id,
      name: c.name,
      date: c.date,
      location: c.location ?? "",
      description: c.description ?? "",
      isCompleted: c.isCompleted,
    });
  }

  async function save() {
    if (!form) return;
    if (!form.name.trim()) {
      setError("Namn krävs.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        date: form.date,
        location: form.location || null,
        description: form.description || null,
        isCompleted: form.isCompleted,
      };
      const res = await fetch(
        form.id ? `/api/competitions/${form.id}` : "/api/competitions",
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
    await fetch(`/api/competitions/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {!form && (
        <div className="flex justify-between">
          <p className="text-sm text-ink-muted">{competitions.length} tävlingar</p>
          <PrimaryButton onClick={() => setForm(emptyForm())}>
            + Ny tävling
          </PrimaryButton>
        </div>
      )}

      {form && (
        <div className="rounded-xl2 border border-pink-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 font-heading text-2xl text-ink">
            {form.id ? "Redigera tävling" : "Ny tävling"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Namn">
              <TextInput
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="T.ex. Distriktsmästerskap 2026"
              />
            </Field>
            <Field label="Datum">
              <TextInput
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            <Field label="Plats (valfritt)">
              <TextInput
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ort / skyttehall"
              />
            </Field>
            <Field label="Status">
              <label className="flex h-10 items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={form.isCompleted}
                  onChange={(e) =>
                    setForm({ ...form, isCompleted: e.target.checked })
                  }
                  className="h-4 w-4 accent-pink-500"
                />
                Genomförd
              </label>
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Beskrivning (valfritt)">
              <TextArea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
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
              {saving ? "Sparar…" : "Spara"}
            </PrimaryButton>
            <GhostButton onClick={() => setForm(null)}>Avbryt</GhostButton>
          </div>
        </div>
      )}

      {!form && (
        <ul className="space-y-2">
          {competitions.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-4 rounded-xl2 border border-pink-100 bg-white p-4 shadow-card"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{c.name}</p>
                <p className="text-xs text-ink-muted">
                  {c.date}
                  {c.location ? ` · ${c.location}` : ""}
                  {c.isCompleted ? " · Genomförd" : ""}
                </p>
              </div>
              <GhostButton onClick={() => startEdit(c)}>Redigera</GhostButton>
              <DangerButton onConfirm={() => remove(c.id)}>Ta bort</DangerButton>
            </li>
          ))}
          {competitions.length === 0 && (
            <p className="rounded-xl2 border border-dashed border-pink-200 bg-pink-50/20 px-6 py-8 text-center text-sm text-ink-muted">
              Inga tävlingar inlagda ännu.
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
