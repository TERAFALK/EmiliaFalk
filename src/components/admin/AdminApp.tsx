"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type {
  AdminResult,
  AdminCompetition,
  AdminNews,
  AdminSponsor,
  AdminMerit,
  CompetitionOption,
} from "@/lib/adminTypes";
import ResultsAdmin from "@/components/admin/ResultsAdmin";
import CompetitionsAdmin from "@/components/admin/CompetitionsAdmin";
import NewsAdmin from "@/components/admin/NewsAdmin";
import SponsorsAdmin from "@/components/admin/SponsorsAdmin";
import MeritsAdmin from "@/components/admin/MeritsAdmin";

type Tab = "results" | "competitions" | "news" | "sponsors" | "merits";

const TABS: { key: Tab; label: string }[] = [
  { key: "results", label: "Resultat" },
  { key: "competitions", label: "Tävlingar" },
  { key: "news", label: "Nyheter" },
  { key: "sponsors", label: "Sponsorer" },
  { key: "merits", label: "Meriter" },
];

export default function AdminApp({
  userName,
  results,
  competitions,
  competitionOptions,
  news,
  sponsors,
  merits,
}: {
  userName: string;
  results: AdminResult[];
  competitions: AdminCompetition[];
  competitionOptions: CompetitionOption[];
  news: AdminNews[];
  sponsors: AdminSponsor[];
  merits: AdminMerit[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("results");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-pink-50/20">
      <header className="border-b border-pink-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-heading text-2xl text-ink">
              Emilia Falk
            </Link>
            <span className="rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-medium text-pink-700">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink-muted sm:inline">
              {userName}
            </span>
            <Link
              href="/"
              className="text-sm text-ink-soft hover:text-pink-700"
            >
              Visa sidan
            </Link>
            <button
              onClick={logout}
              className="rounded-lg border border-pink-200 px-3 py-1.5 text-sm font-medium text-pink-700 hover:bg-pink-50"
            >
              Logga ut
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-wrap gap-2 border-b border-pink-100">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "border-pink-500 text-pink-700"
                  : "border-transparent text-ink-muted hover:text-ink-soft"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "results" && (
          <ResultsAdmin results={results} competitions={competitionOptions} />
        )}
        {tab === "competitions" && (
          <CompetitionsAdmin competitions={competitions} />
        )}
        {tab === "news" && <NewsAdmin news={news} />}
        {tab === "sponsors" && <SponsorsAdmin sponsors={sponsors} />}
        {tab === "merits" && <MeritsAdmin merits={merits} />}
      </div>
    </div>
  );
}
