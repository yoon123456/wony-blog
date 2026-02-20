import Link from "next/link";
import type { Metadata } from "next";
import PostCardImage from "@/components/post-card-image";
import { getAllPostsMeta, getCategoryStats, toCategorySlug } from "@/lib/posts";

export const metadata: Metadata = {
  title: "블로그",
  description: "마크다운으로 작성한 전체 블로그 포스트 목록",
  alternates: {
    canonical: "/blog"
  }
};

type BlogPageProps = {
  searchParams?: {
    category?: string | string[];
  };
};

function getCategoryParam(category?: string | string[]) {
  if (!category) {
    return "all";
  }

  return Array.isArray(category) ? category[0] : category;
}

export default function BlogIndexPage({ searchParams }: BlogPageProps) {
  const posts = getAllPostsMeta();
  const categories = getCategoryStats();
  const activeCategorySlug = getCategoryParam(searchParams?.category);
  const filteredPosts =
    activeCategorySlug === "all"
      ? posts
      : posts.filter((post) => toCategorySlug(post.category) === activeCategorySlug);

  return (
    <section className="fade-up">
      <div className="soft-card p-4 md:p-5">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              activeCategorySlug === "all"
                ? "border-rose-200 bg-rose-50 text-rose-500"
                : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5"
            }`}
          >
            전체 ({posts.length})
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog?category=${category.slug}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                activeCategorySlug === category.slug
                  ? "border-rose-200 bg-rose-50 text-rose-500"
                  : "border-sky-100 bg-sky-50 text-sky-700 hover:-translate-y-0.5"
              }`}
            >
              {category.name} ({category.count})
            </Link>
          ))}
        </div>
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {filteredPosts.map((post, index) => (
          <li
            key={post.slug}
            className="soft-card p-5"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <Link
              href={`/blog/${post.slug}`}
              aria-label={`${post.title} 상세 보기`}
              className="flex h-full flex-col"
            >
              <PostCardImage src={post.coverImage} alt={post.title} />
              <p className="text-2xl font-bold text-slate-800">{post.title}</p>
              <div className="mt-2">
                <div className="inline-flex rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                {post.category}
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-400">{post.date}</p>
              <p className="mt-3 soft-muted">{post.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {filteredPosts.length === 0 ? (
        <div className="soft-card mt-6 p-6 text-center">
          <p className="text-sm font-semibold text-slate-500">아직 이 카테고리 글이 없어요.</p>
        </div>
      ) : null}
    </section>
  );
}
