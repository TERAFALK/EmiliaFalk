import { getNews } from "@/lib/data";
import NewsCard from "@/components/NewsCard";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nyheter – Emilia Falk",
};

export default async function NyheterPage() {
  const news = await getNews();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">Nyheter</h1>
        <p className="mt-2 text-ink-soft">Uppdateringar från Emilias skytte.</p>
      </div>

      {news.length === 0 ? (
        <EmptyState>Inga nyheter publicerade ännu.</EmptyState>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((post) => (
            <NewsCard
              key={post.id}
              post={{ ...post, publishedAt: post.publishedAt.toISOString() }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
