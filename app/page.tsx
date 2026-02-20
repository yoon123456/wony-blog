import Link from "next/link";
import PostCardImage from "@/components/post-card-image";
import { getAllPostsMeta, getCategoryStats, toCategorySlug } from "@/lib/posts";

export default function HomePage() {
	const posts = getAllPostsMeta().slice(0, 6);
	const categories = getCategoryStats();

	return (
		<section className="fade-up">
			<div className="soft-card p-6 md:p-8">
				<p className="mb-3 inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500">
					WELCOME TO WONY BLOG
				</p>
				<h1 className="brand-title text-xl text-slate-800 md:text-4xl">
					임신, 육아, 재테크, 개발을 함께 담는 블로그
				</h1>
				<p className="mt-4 soft-muted md:text-lg">
					생활과 커리어에 도움이 되는 실전 정보만 골라, 검색 친화적인 글로
					꾸준히 발행합니다.
				</p>

				<div className="mt-6 flex flex-wrap gap-3">
					<Link
						href="/blog"
						className="pill-btn text-sm font-semibold text-rose-500"
					>
						최신 글 보러가기
					</Link>
					<Link
						href="/rss.xml"
						className="pill-btn text-sm font-semibold text-sky-600"
					>
						RSS 구독하기
					</Link>
				</div>
			</div>

			<div className="soft-card mt-6 p-5 md:p-6">
				<h2 className="brand-title text-2xl text-slate-800">카테고리</h2>
				<div className="mt-4 flex flex-wrap gap-2">
					{categories.map((category) => (
						<Link
							key={category.slug}
							href={`/blog?category=${category.slug}`}
							className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:-translate-y-0.5"
						>
							{category.name} ({category.count})
						</Link>
					))}
				</div>
			</div>

			<div className="mt-8">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="brand-title text-3xl text-slate-800">최신 포스트</h2>
					<Link
						href="/blog"
						className="text-sm font-semibold text-rose-500 hover:text-rose-600"
					>
						전체보기
					</Link>
				</div>

				<ul className="grid gap-4 md:grid-cols-2">
					{posts.map((post, index) => (
						<li
							key={post.slug}
							className="soft-card p-5"
							style={{ animationDelay: `${index * 70}ms` }}
						>
							<PostCardImage src={post.coverImage} alt={post.title} />
							<Link
								href={`/blog/${post.slug}`}
								className="text-lg font-bold text-slate-800 hover:text-rose-500"
							>
								{post.title}
							</Link>
							<div className="mt-2">
								<Link
									href={`/blog?category=${toCategorySlug(post.category)}`}
									className="inline-flex rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700"
								>
									{post.category}
								</Link>
							</div>
							<p className="mt-2 text-xs font-semibold text-slate-400">
								{post.date}
							</p>
							<p className="mt-2 soft-muted">{post.description}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
