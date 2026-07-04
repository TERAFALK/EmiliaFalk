"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Inloggningen misslyckades");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-50/30 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <svg width="44" height="44" viewBox="0 0 64 64" aria-hidden>
              <circle cx="32" cy="32" r="30" fill="#fff" stroke="#FF69B4" strokeWidth="3" />
              <circle cx="32" cy="32" r="21" fill="none" stroke="#FF69B4" strokeWidth="2.5" />
              <circle cx="32" cy="32" r="12" fill="none" stroke="#FF69B4" strokeWidth="2.5" />
              <circle cx="32" cy="32" r="5" fill="#FF69B4" />
            </svg>
            <span className="font-heading text-2xl text-ink">Emilia Falk</span>
          </Link>
          <p className="mt-2 text-sm text-ink-muted">Administratörsinloggning</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl2 border border-pink-100 bg-white p-6 shadow-card"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft">
              E-post
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft">
              Lösenord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:opacity-60"
          >
            {loading ? "Loggar in…" : "Logga in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-ink-muted hover:text-pink-700">
            ← Till startsidan
          </Link>
        </p>
      </div>
    </div>
  );
}
