"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminSponsor } from "@/lib/adminTypes";
import {
  Field,
  TextInput,
  PrimaryButton,
  GhostButton,
  DangerButton,
  ImageUpload,
  FeedbackBar,
} from "@/components/admin/ui";

type FormState = {
  id: string | null;
  name: string;
  logoPath: string | null;
  url: string;
  sortOrder: number;
  active: boolean;
};

function emptyForm(): FormState {
  return {
    id: null,
    name: "",
    logoPath: null,
    url: "",
    sortOrder: 0,
    active: true,
  };
}

export default function SponsorsAdmin({
  sponsors,
}: {
  sponsors: AdminSponsor[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(s: AdminSponsor) {
    setError(null);
    setForm({
      id: s.id,
      name: s.name,
      logoPath: s.logoPath,
      url: s.url ?? "",
      sortOrder: s.sortOrder,
      active: s.active,
    });
  }

  async function save() {
    if (!form) return;
    if (!form.name.trim()) {
      setError("Namn krävs.");
      return;
    }
    if (!form.logoPath) {
      setError("Ladda upp en logga.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        logoPath: form.logoPath,
        url: form.url || null,
        sortOrder: form.sortOrder,
        active: form.active,
      };
      const res = await fetch(
        form.id ? `/api/sponsors/${form.id}` : "/api/sponsors",
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
    await fetch(`/api/sponsors/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {!form && (
        <div className="flex justify-between">
          <p className="text-sm text-ink-muted">{sponsors.length} sponsorer</p>
          <PrimaryButton onClick={() => setForm(emptyForm())}>
            + Ny sponsor
          </PrimaryButton>
        </div>
      )}

      {form && (
        <div className="rounded-xl2 border border-pink-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 font-heading text-2xl text-ink">
            {form.id ? "Redigera sponsor" : "Ny sponsor"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Namn">
              <TextInput
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Länk (valfritt)">
              <TextInput
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://…"
              />
            </Field>
            <Field label="Sorteringsordning" hint="Lägre nummer visas först">
              <TextInput
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: Number(e.target.value) || 0 })
                }
              />
            </Field>
            <Field label="Synlig">
              <label className="flex h-10 items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  className="h-4 w-4 accent-pink-500"
                />
                Visa på sidan
              </label>
            </Field>
          </div>
          <div className="mt-4">
            <ImageUpload
              label="Logga"
              value={form.logoPath}
              onChange={(path) => setForm({ ...form, logoPath: path })}
            />
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
        <ul className="grid gap-2 sm:grid-cols-2">
          {sponsors.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-4 rounded-xl2 border border-pink-100 bg-white p-4 shadow-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.logoPath}
                alt=""
                className="h-10 w-10 shrink-0 rounded object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{s.name}</p>
                <p className="text-xs text-ink-muted">
                  {s.active ? "Synlig" : "Dold"} · ordning {s.sortOrder}
                </p>
              </div>
              <GhostButton onClick={() => startEdit(s)}>Redigera</GhostButton>
              <DangerButton onConfirm={() => remove(s.id)}>Ta bort</DangerButton>
            </li>
          ))}
          {sponsors.length === 0 && (
            <p className="rounded-xl2 border border-dashed border-pink-200 bg-pink-50/20 px-6 py-8 text-center text-sm text-ink-muted sm:col-span-2">
              Inga sponsorer inlagda ännu.
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
