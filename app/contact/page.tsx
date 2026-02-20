import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의",
  description: "Wony Blog 문의 페이지",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  return (
    <section className="fade-up">
      <div className="soft-card p-6 md:p-8">
        <h1 className="brand-title text-4xl text-slate-800 md:text-5xl">문의</h1>
        <p className="mt-4 soft-muted">광고/협업/콘텐츠 관련 문의는 아래 이메일로 보내주세요.</p>
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-700">Email</p>
          <a href="mailto:contact@example.com" className="mt-1 inline-block text-sm text-rose-500 underline">
            contact@example.com
          </a>
        </div>
        <p className="mt-4 text-xs text-slate-500">응답까지 1-3일 정도 소요될 수 있습니다.</p>
      </div>
    </section>
  );
}
