import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="fade-up">
      <div className="soft-card p-8 text-center">
        <p className="mb-2 text-xs font-semibold text-slate-400">404</p>
        <h1 className="brand-title text-4xl text-slate-800">페이지를 찾을 수 없어요</h1>
        <p className="mt-3 soft-muted">요청하신 글이 삭제되었거나 경로가 바뀌었습니다.</p>
        <Link href="/" className="pill-btn mt-6 inline-flex text-sm font-semibold text-rose-500">
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  );
}
