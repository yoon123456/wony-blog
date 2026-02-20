import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개",
  description: "Wony Blog 소개 페이지",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return (
    <section className="fade-up">
      <div className="soft-card p-6 md:p-8">
        <h1 className="brand-title text-4xl text-slate-800 md:text-5xl">소개</h1>
        <p className="mt-4 soft-muted">
          Wony Blog는 임신, 육아, 출산, 재테크, 개발처럼 삶에 밀접한 주제를 실전 경험 중심으로 기록하는 블로그입니다.
        </p>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <p>주요 주제: 임신, 육아, 출산, 재테크, 개발</p>
          <p>운영 목적: 생활과 커리어에 모두 도움이 되는 신뢰 가능한 아카이브 구축</p>
        </div>
      </div>
    </section>
  );
}
