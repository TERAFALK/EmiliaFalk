import { formatDate } from "@/lib/stats";

type News = {
  id: string;
  title: string;
  body: string;
  imagePath?: string | null;
  publishedAt: string | Date;
};

export default function NewsCard({ post }: { post: News }) {
  return (
    <article className="overflow-hidden rounded-xl2 border border-pink-100 bg-white shadow-card transition-shadow hover:shadow-cardHover">
      {post.imagePath && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.imagePath}
          alt=""
          className="h-44 w-full object-cover"
        />
      )}
      <div className="p-5">
        <time className="text-xs font-medium uppercase tracking-wide text-pink-600">
          {formatDate(post.publishedAt)}
        </time>
        <h3 className="mt-1.5 font-heading text-2xl text-ink">{post.title}</h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
          {post.body}
        </p>
      </div>
    </article>
  );
}
