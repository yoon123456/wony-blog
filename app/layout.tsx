import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Gaegu, IBM_Plex_Sans_KR } from "next/font/google";
import "./globals.css";

const headingFont = Gaegu({
	weight: ["400", "700"],
	preload: false,
	variable: "--font-heading",
});

const bodyFont = IBM_Plex_Sans_KR({
	weight: ["400", "500", "700"],
	preload: false,
	variable: "--font-body",
});

const siteName = "Wony Blog";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteDescription =
	"임신, 육아, 출산, 재테크, 개발을 함께 다루는 라이프 블로그";
const defaultOgImage = "/og-default.svg";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: `${siteName} | 라이프 & 실전 블로그`,
		template: `%s | ${siteName}`,
	},
	description: siteDescription,
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		url: siteUrl,
		title: `${siteName} | 라이프 & 실전 블로그`,
		description: siteDescription,
		siteName,
		images: [
			{
				url: defaultOgImage,
				width: 1200,
				height: 630,
				alt: "Wony Blog 대표 이미지",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `${siteName} | 라이프 & 실전 블로그`,
		description: siteDescription,
		images: [defaultOgImage],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const adsenseClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

	return (
		<html lang="ko">
			<body className={`${headingFont.variable} ${bodyFont.variable}`}>
				<div aria-hidden className="page-glow page-glow-left" />
				<div aria-hidden className="page-glow page-glow-right" />

				<header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur">
					<div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4">
						<Link href="/" className="brand-title text-3xl text-rose-500">
							Wony Blog
						</Link>
						<nav className="flex items-center gap-2 text-sm font-semibold text-slate-600">
							<Link href="/blog" className="pill-btn">
								Blog
							</Link>
							<Link href="/about" className="pill-btn">
								소개
							</Link>
							<Link href="/rss.xml" className="pill-btn">
								RSS
							</Link>
						</nav>
					</div>
				</header>

				<main className="mx-auto min-h-[calc(100vh-150px)] w-full max-w-4xl px-4 py-8 md:py-12">
					{children}
				</main>

				<footer className="border-t border-white/80 bg-white/70 backdrop-blur">
					<div className="mx-auto max-w-4xl px-4 py-6 text-sm text-slate-600">
						<p>© {new Date().getFullYear()} Wony Blog</p>
						<p className="mt-1 text-xs text-slate-500">
							작고 꾸준한 글이 모여 큰 신뢰를 만듭니다.
						</p>
						<div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
							<Link href="/about" className="hover:text-slate-700">
								소개
							</Link>
							<Link href="/contact" className="hover:text-slate-700">
								문의
							</Link>
							<Link href="/privacy" className="hover:text-slate-700">
								개인정보처리방침
							</Link>
						</div>
					</div>
				</footer>

				{adsenseClient ? (
					<Script
						id="adsense-script"
						async
						strategy="afterInteractive"
						src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
						crossOrigin="anonymous"
					/>
				) : null}
			</body>
		</html>
	);
}
