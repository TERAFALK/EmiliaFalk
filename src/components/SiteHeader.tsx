"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Översikt" },
  { href: "/resultat", label: "Resultat" },
  { href: "/tavlingar", label: "Tävlingar" },
  { href: "/meriter", label: "Meriter" },
  { href: "/nyheter", label: "Nyheter" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <TargetMark />
          <span className="font-heading text-2xl leading-none text-ink">
            Emilia&nbsp;Falk
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-pink-50 text-pink-700"
                  : "text-ink-soft hover:bg-pink-50/60 hover:text-pink-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="ml-2 rounded-full border border-pink-200 px-4 py-2 text-sm font-medium text-pink-700 transition-colors hover:bg-pink-50"
          >
            Logga in
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-ink-soft md:hidden"
          aria-label="Meny"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-pink-100 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive(item.href) ? "text-pink-700" : "text-ink-soft"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg px-3 py-2.5 text-sm font-medium text-pink-700"
            >
              Logga in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function TargetMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#fff" stroke="#FF69B4" strokeWidth="3" />
      <circle cx="32" cy="32" r="21" fill="none" stroke="#FF69B4" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="12" fill="none" stroke="#FF69B4" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="5" fill="#FF69B4" />
    </svg>
  );
}
