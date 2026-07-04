"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminNews } from "@/lib/adminTypes";
import { toDateInputValue } from "@/lib/stats";
import {
  Field,
  TextInput,
  TextArea,
  PrimaryButton,
  GhostButton,
  DangerButton,
  ImageUpload,
  FeedbackBar,
} from "@/components/admin/ui";

type FormState = {
  id: string | null;
  title: string;
  body: string;
  imagePath: string | null;
  publishedAt: string;
};

function emptyForm(): FormState {
  return {
    id: null,
    title: "",
    body: "",
    imagePath: null,
    publishedAt: toDateInputValue(new Date()),
  };
}

export default function NewsAdmin({ news }: { news: AdminNews[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(n: AdminNews) {
    setError(null);
    setForm({
      id: n.id,
      title: n.title,
      body: n.body,
      imagePath: n.imagePath,
      publishedAt: n.publishedAt,
    });
  }

  async function save() {
    if (!form) return;
    if (!form.title.trim() || !form.body.trim()) {
      setError("Rubrik och text krävs.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title,
        body: form.body,
        imagePath: form.imagePath,
        publishedAt: form.publishedAt,
      };
      const res = await fetch(form.id ? `/api/news/${form.id}` : "/api/news", {
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
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {!form && (
        <div className="flex justify-between">
          <p className="text-sm text-ink-muted">{news.length} nyheter</p>
          <PrimaryButton onClick={() => setForm(emptyForm())}>
            + Ny nyhet
          </PrimaryButton>
        </div>
      )}

      {form && (
        <div className="rounded-xl2 border border-pink-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 font-heading text-2xl text-ink">
            {form.id ? "Redigera nyhet" : "Ny nyhet"}
          </h3>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
              <Field label="Rubrik">
                <TextInput
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </Field>
              <Field label="Datum">
                <TextInput
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) =>
                    setForm({ ...form, publishedAt: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Text">
              <TextArea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="min-h-40"
              />
            </Field>
            <ImageUpload
              label="Bild (valfritt)"
              value={form.imagePath}
              onChange={(path) => setForm({ ...form, imagePath: path })}
            />
          </div>

          {error && (
            <div className="mt-4">
              <FeedbackBar message={error} tone="error" />
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <PrimaryButton onClick={save} disabled={saving}>
              {saving ? "Sparar…" : "Publicera"}
            </PrimaryButton>
            <GhostButton onClick={() => setForm(null)}>Avbryt</GhostButton>
          </div>
        </div>
      )}

      {!form && (
        <ul className="space-y-2">
          {news.map((n) => (
            <li
              key={n.id}
              className="flex items-center gap-4 rounded-xl2 border border-pink-100 bg-white p-4 shadow-card"
            >
              {n.imagePath && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={n.imagePath}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{n.title}</p>
                <p className="text-xs text-ink-muted">{n.publishedAt}</p>
              </div>
              <GhostButton onClick={() => startEdit(n)}>Redigera</GhostButton>
              <DangerButton onConfirm={() => remove(n.id)}>Ta bort</DangerButton>
            </li>
          ))}
          {news.length === 0 && (
            <p className="rounded-xl2 border border-dashed border-pink-200 bg-pink-50/20 px-6 py-8 text-center text-sm text-ink-muted">
              Inga nyheter publicerade ännu.
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
