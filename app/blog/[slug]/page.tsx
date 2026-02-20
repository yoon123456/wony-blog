import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import AdsenseUnit from "@/components/adsense-unit";
import PostEngagement from "@/components/post-engagement";
import { getAllSlugs, getPostBySlug, toCategorySlug } from "@/lib/posts";

type Params = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return getAllSlugs();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "글을 찾을 수 없음"
    };
  }

  const ogImage = post.coverImage || "/og-default.svg";

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage]
    }
  };
}

export default async function BlogPostPage({ params }: Params) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const adsClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || "";
  const adsSlot = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT || "";
  const showAdUnit = Boolean(adsClient && adsSlot);
  const ogImageUrl = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${siteUrl}${post.coverImage}`
    : `${siteUrl}/og-default.svg`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Wony"
    },
    publisher: {
      "@type": "Organization",
      name: "Wony Blog"
    },
    image: ogImageUrl
  };

  return (
    <article className="fade-up">
      <div className="soft-card p-6 md:p-8">
        <header className="mb-8 border-b border-slate-100 pb-6">
          <h1 className="brand-title text-4xl text-slate-800 md:text-5xl">{post.title}</h1>
          <p className="mt-3 text-xs font-semibold text-slate-400">{post.date}</p>
          <p className="mt-4 soft-muted text-base md:text-lg">{post.description}</p>
        </header>
        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-8 border-t border-slate-100 pt-5">
          <p className="mb-3 text-xs font-semibold text-slate-400">분류</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/blog?category=${toCategorySlug(post.category)}`}
              className="inline-flex rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700"
            >
              {post.category}
            </Link>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <PostEngagement slug={post.slug} />

      {showAdUnit ? (
        <div className="soft-card mt-6 p-4 md:p-5">
          <AdsenseUnit slot={adsSlot} />
        </div>
      ) : null}

      <Script
        id={`jsonld-${post.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </article>
  );
}
