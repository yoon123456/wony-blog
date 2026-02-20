import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostCardImage from "@/components/post-card-image";
import { getCategoryStats, getPostsByCategorySlug } from "@/lib/posts";

type Params = {
  params: {
    category: string;
  };
};

export function generateStaticParams() {
  return getCategoryStats().map((category) => ({
    category: category.slug
  }));
}

export function generateMetadata({ params }: Params): Metadata {
  const target = getCategoryStats().find((category) => category.slug === params.category);

  if (!target) {
    return {
      title: "카테고리를 찾을 수 없음"
    };
  }

  return {
    title: `${target.name} 카테고리`,
    description: `${target.name} 카테고리 글 목록`,
    alternates: {
      canonical: `/blog/category/${target.slug}`
    }
  };
}

export default function CategoryPage({ params }: Params) {
  const category = getCategoryStats().find((item) => item.slug === params.category);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategorySlug(params.category);

  return (
    <section className="fade-up">
      <div className="soft-card p-6 md:p-8">
        <p className="mb-2 text-xs font-semibold text-slate-400">CATEGORY</p>
        <h1 className="brand-title text-4xl text-slate-800 md:text-5xl">{category.name}</h1>
        <p className="mt-3 soft-muted">총 {category.count}개의 글</p>
        <Link href="/blog" className="mt-5 inline-flex pill-btn text-sm font-semibold text-rose-500">
          전체 글 보기
        </Link>
      </div>

      <ul className="mt-6 space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="soft-card p-5 md:p-6">
            <Link
              href={`/blog/${post.slug}`}
              aria-label={`${post.title} 상세 보기`}
              className="flex h-full flex-col"
            >
              <PostCardImage src={post.coverImage} alt={post.title} />
              <p className="text-2xl font-bold text-slate-800">{post.title}</p>
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

      <div className="soft-card mt-6 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-500">다른 카테고리</h2>
        <div className="flex flex-wrap gap-2">
          {getCategoryStats().map((item) => (
            <Link
              key={item.slug}
              href={`/blog/category/${item.slug}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                item.slug === params.category
                  ? "border-rose-200 bg-rose-50 text-rose-500"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {item.name} ({item.count})
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
