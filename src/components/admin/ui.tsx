"use client";

import { ReactNode, useState } from "react";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-pink-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input {...props} className={`${inputCls} ${props.className || ""}`} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`${inputCls} min-h-24 resize-y ${props.className || ""}`}
    />
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:opacity-60 ${props.className || ""}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-lg border border-pink-200 px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-50 disabled:opacity-60 ${props.className || ""}`}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  onConfirm,
  className = "",
}: {
  children: ReactNode;
  onConfirm: () => void;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  return (
    <button
      onClick={() => {
        if (armed) {
          onConfirm();
          setArmed(false);
        } else {
          setArmed(true);
          setTimeout(() => setArmed(false), 3000);
        }
      }}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        armed
          ? "bg-red-600 text-white"
          : "text-red-600 hover:bg-red-50"
      } ${className}`}
    >
      {armed ? "Bekräfta" : children}
    </button>
  );
}

/** Bilduppladdning – laddar upp till /api/uploads och returnerar publik sökväg. */
export function ImageUpload({
  value,
  onChange,
  label = "Bild",
}: {
  value: string | null;
  onChange: (path: string | null) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    // Tidig kontroll så användaren slipper vänta på ett serverfel.
    if (file.size > 4 * 1024 * 1024) {
      setError("Filen är för stor (max 4 MB). Komprimera eller välj en mindre bild.");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: form });

      if (!res.ok) {
        // 413 kommer ofta från proxyn (NPM) innan appen ens svarar – då är
        // svaret inte JSON, så vi hanterar det separat.
        if (res.status === 413) {
          setError(
            "Filen är för stor och avvisades av servern. Prova en mindre bild, " +
              "eller höj gränsen i proxyn (client_max_body_size)."
          );
        } else {
          let msg = `Uppladdning misslyckades (fel ${res.status})`;
          try {
            const data = await res.json();
            if (data?.error) msg = data.error;
          } catch {
            /* svaret var inte JSON */
          }
          setError(msg);
        }
        return;
      }

      const data = await res.json();
      onChange(data.path);
    } catch {
      setError("Uppladdning misslyckades – kontrollera anslutningen och försök igen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="h-14 w-14 rounded-lg border border-pink-100 object-contain p-1"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-sm text-red-600 hover:underline"
            >
              Ta bort
            </button>
          </div>
        ) : (
          <label className="cursor-pointer rounded-lg border border-dashed border-pink-300 px-4 py-2 text-sm text-pink-700 hover:bg-pink-50">
            {uploading ? "Laddar upp…" : "Välj fil…"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                // Nollställ så att samma fil kan väljas igen efter ett fel.
                e.target.value = "";
                if (f) handleFile(f);
              }}
            />
          </label>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

/** Enkel toast/feedback-rad. */
export function FeedbackBar({
  message,
  tone,
}: {
  message: string | null;
  tone: "error" | "success";
}) {
  if (!message) return null;
  return (
    <div
      className={`rounded-lg px-3 py-2 text-sm ${
        tone === "error"
          ? "bg-red-50 text-red-600"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {message}
    </div>
  );
}
