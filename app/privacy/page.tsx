import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "Wony Blog 개인정보처리방침 및 쿠키 처리 안내",
  alternates: {
    canonical: "/privacy"
  }
};

export default function PrivacyPage() {
  return (
    <section className="fade-up">
      <div className="soft-card p-6 md:p-8">
        <h1 className="brand-title text-4xl text-slate-800 md:text-5xl">개인정보처리방침</h1>
        <p className="mt-4 text-xs text-slate-500">시행일: 2026-02-20</p>

        <div className="mt-6 space-y-6 text-sm text-slate-600">
          <section>
            <h2 className="text-base font-semibold text-slate-800">1. 수집 항목</h2>
            <p className="mt-2">본 블로그는 다음 정보를 처리할 수 있습니다.</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>서비스 이용 기록(접속 로그, 브라우저/기기 정보, 방문 페이지)</li>
              <li>좋아요 기능 제공을 위한 쿠키 식별자(`visitor_id`)</li>
              <li>문의 시 사용자가 직접 제공한 정보(이메일 본문 내용)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800">2. 이용 목적</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>좋아요 기능 제공 및 중복 클릭 방지</li>
              <li>서비스 품질 개선 및 트래픽 분석</li>
              <li>부정 사용 탐지 및 보안 대응</li>
              <li>광고 서비스 운영(애드센스 적용 시)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800">3. 보관 기간 및 파기</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>쿠키 식별자: 생성일로부터 최대 1년</li>
              <li>서비스 로그: 관련 법령 또는 운영 목적 범위 내 보관 후 파기</li>
              <li>보관 목적 달성 시 지체 없이 삭제하거나 비식별 처리</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800">4. 제3자 제공 및 외부 서비스</h2>
            <p className="mt-2">
              본 블로그는 법령상 요구가 있는 경우를 제외하고 이용자 정보를 임의로 제3자에게 제공하지 않습니다.
              다만 아래 외부 서비스를 사용할 수 있습니다.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Supabase: 좋아요 데이터 저장</li>
              <li>Google AdSense(승인/적용 시): 광고 제공 및 성과 측정</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800">5. 쿠키 사용 안내</h2>
            <p className="mt-2">
              본 블로그는 좋아요 기능 제공을 위해 쿠키를 사용할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.
              단, 일부 기능이 정상 동작하지 않을 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800">6. 이용자 권리</h2>
            <p className="mt-2">
              이용자는 관련 법령이 정한 범위 내에서 개인정보 열람, 정정, 삭제, 처리정지 등을 요청할 수 있으며, 요청은 아래 문의처를 통해 접수할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800">7. 문의처</h2>
            <p className="mt-2">개인정보 관련 문의: contact@example.com</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800">8. 고지 및 개정</h2>
            <p className="mt-2">
              본 방침은 관련 법령 및 서비스 변경 사항에 따라 수정될 수 있으며, 변경 시 본 페이지를 통해 공지합니다.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
