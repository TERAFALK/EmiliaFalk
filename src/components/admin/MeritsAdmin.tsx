"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminMerit } from "@/lib/adminTypes";
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
  title: string;
  description: string;
  date: string;
  placement: string;
};

function emptyForm(): FormState {
  return {
    id: null,
    title: "",
    description: "",
    date: toDateInputValue(new Date()),
    placement: "",
  };
}

export default function MeritsAdmin({ merits }: { merits: AdminMerit[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(m: AdminMerit) {
    setError(null);
    setForm({
      id: m.id,
      title: m.title,
      description: m.description ?? "",
      date: m.date,
      placement: m.placement ?? "",
    });
  }

  async function save() {
    if (!form) return;
    if (!form.title.trim()) {
      setError("Titel krävs.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        date: form.date,
        placement: form.placement || null,
      };
      const res = await fetch(form.id ? `/api/merits/${form.id}` : "/api/merits", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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
    await fetch(`/api/merits/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {!form && (
        <div className="flex justify-between">
          <p className="text-sm text-ink-muted">{merits.length} meriter</p>
          <PrimaryButton onClick={() => setForm(emptyForm())}>
            + Ny merit
          </PrimaryButton>
        </div>
      )}

      {form && (
        <div className="rounded-xl2 border border-pink-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 font-heading text-2xl text-ink">
            {form.id ? "Redigera merit" : "Ny merit"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-[1fr_180px_180px]">
            <Field label="Titel">
              <TextInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="T.ex. SM-final"
              />
            </Field>
            <Field label="Placering (valfritt)">
              <TextInput
                value={form.placement}
                onChange={(e) => setForm({ ...form, placement: e.target.value })}
                placeholder="T.ex. 1:a"
              />
            </Field>
            <Field label="Datum">
              <TextInput
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
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
          {merits.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-4 rounded-xl2 border border-pink-100 bg-white p-4 shadow-card"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">
                  {m.title}
                  {m.placement ? ` · ${m.placement}` : ""}
                </p>
                <p className="text-xs text-ink-muted">
                  {m.date}
                  {m.description ? ` · ${m.description}` : ""}
                </p>
              </div>
              <GhostButton onClick={() => startEdit(m)}>Redigera</GhostButton>
              <DangerButton onConfirm={() => remove(m.id)}>Ta bort</DangerButton>
            </li>
          ))}
          {merits.length === 0 && (
            <p className="rounded-xl2 border border-dashed border-pink-200 bg-pink-50/20 px-6 py-8 text-center text-sm text-ink-muted">
              Inga meriter inlagda ännu.
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
