# Wony Blog

Next.js App Router + Tailwind CSS + Markdown 기반 라이프 블로그 템플릿입니다.
임신, 육아, 출산, 재테크, 개발 콘텐츠 운영과 애드센스 수익화를 고려한 기본 설정이 포함되어 있습니다.

## 포함 기능

- Markdown 포스트 (`content/posts/*.md`)
- 블로그 목록/상세/카테고리 페이지 (`/blog`, `/blog/[slug]`, `/blog/category/[category]`)
- 필수 정책 페이지 (`/about`, `/contact`, `/privacy`)
- SEO 메타데이터 (title/description/canonical/OG/Twitter)
- 구조화 데이터 (JSON-LD BlogPosting)
- `sitemap.xml`, `robots.txt`, `rss.xml`
- Google AdSense 스크립트 연동
- Supabase 기반 좋아요

## 시작하기

```bash
npm install
npm run dev
```

## 환경변수

`.env.local` 파일 생성:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT=1234567890
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Supabase 설정

1. Supabase 프로젝트 생성
2. `SQL Editor`에서 `supabase/schema.sql` 실행
3. Project Settings > API에서 URL, service role key를 `.env.local`에 설정

## 글 작성

`content/posts` 폴더에 `.md` 파일 추가:

```md
---
title: "포스트 제목"
description: "포스트 설명"
date: "2026-02-20"
published: true
category: "SEO"
coverImage: "/posts/example-cover.jpg"
tags: ["nextjs", "seo"]
---

# 본문

마크다운 내용
```

`published: false`로 설정하면 블로그 목록/상세에서 숨길 수 있습니다.

### AI 자동 글 작성

주제만 입력하면 Gemini 기반 웹 리서치/초안 생성을 자동화합니다.

1. `.env.local`에 `GEMINI_API_KEY` 설정
2. 실행:

```bash
npm run generate:post -- --topic "임신 초기 영양제 가이드" --category "임신" --tags "임신,영양제,산전관리"
```

생성 결과:
- `content/posts/<slug>.md` 파일 생성
- frontmatter + 본문 + 참고 자료 링크 포함

### 템플릿 자동 생성 (무과금 반자동)

ChatGPT 웹에서 본문을 만든 뒤, 로컬에서 템플릿 파일만 자동 생성해서 붙여넣는 방식입니다.

```bash
npm run new:post -- --title "임신 초기 영양제 가이드" --category "임신" --tags "임신,영양제,산전관리" --coverImage "/posts/pregnancy-checklist.svg"
```

생성 결과:
- `content/posts/<slug>.md` 템플릿 파일 생성
- frontmatter 자동 입력
- 본문 위치(`# 본문`)에 ChatGPT 결과 붙여넣기만 하면 완료

## 애드센스 적용 팁

- 애드센스 승인 후 광고 단위 코드를 글 본문 하단 또는 사이드 영역에 삽입
- 콘텐츠 품질(경험 기반 글, 충분한 분량, 내부 링크)을 먼저 확보
- Google Search Console과 함께 운영해 색인 상태를 확인
