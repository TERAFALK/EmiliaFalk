import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-pink-100 bg-pink-50/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-ink-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} Emilia Falk · Luftgevär stående
        </p>
        <div className="flex items-center gap-5">
          <Link href="/resultat" className="hover:text-pink-700">
            Resultat
          </Link>
          <Link href="/tavlingar" className="hover:text-pink-700">
            Tävlingar
          </Link>
          <Link href="/admin" className="hover:text-pink-700">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
