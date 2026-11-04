---
name: site-build
description: 회사 홈페이지를 처음 구축하거나, 브랜드(로고·색·폰트)가 확정·변경된 뒤 사이트에 반영하거나, 새 페이지 유형(섹션/레이아웃)을 추가할 때 사용. "홈페이지 만들어줘", "브랜드 적용해줘", "채용 페이지 추가" 등.
---

# site-build — 구축과 브랜드 반영

`CLAUDE.md`의 절대 규칙을 먼저 따른다. 작업 대상은 `site/` (Astro 정적 사이트).

## A. 브랜드 반영 (brand-identity 키트 → 사이트)

brand-identity 스킬에서 사용자가 세트를 고르고 `kit`까지 만든 뒤 실행한다.

1. 키트 위치 확인: `brand-work/<WORK>/kit/<SET>/` (tokens/, logo/, fonts.md, PDF).
2. `brand/` 갱신 (이전 것은 `brand/_archive/YYYY-MM-DD/`로 옮김):
   - `brand/tokens/` ← `kit/<SET>/tokens/` 전체
   - `brand/logo/` ← `kit/<SET>/logo/` 전체
   - `brand/fonts.md` ← `kit/<SET>/fonts.md`
   - `brand/brand.md` 작성: 세트 이름, 메커니즘 한 문장, 테스트된 색 조합(fill→text, 대비비), 로고 최소 크기·여백, do/don't.
3. 사이트에 연결:
   - `brand/tokens/tokens.css` → `site/src/styles/tokens.css` 로 **복사**(수정 금지).
   - `fonts.md`의 임베드 방식대로 `site/src/styles/fonts.css`의 `--font-display`, `--font-text` 와 `@import`/`<link>` 갱신.
     가변 폰트 축 고정값(`font-variation-settings`)도 옮긴다.
   - 로고: `brand/logo/`의 가로형 SVG → `site/public/logo.svg`, 반전형 → `logo-reversed.svg`,
     favicon/app icon → `site/public/favicon.svg`, `apple-touch-icon.png`.
   - 컴포넌트가 쓰는 `--bi-*` 역할 이름이 새 tokens.css에 모두 있는지 grep으로 대조. 없는 이름은 가장 가까운 역할로 교체.
4. `npm --prefix site run verify` → 통과할 때까지 수정. 브라우저 미리보기(`npm --prefix site run dev`)로
   라이트/다크, 모바일 폭(375px)에서 헤더·히어로·푸터를 눈으로 확인.
5. `CLAUDE.md` "현재 상태"의 브랜드 줄 갱신, `docs/maintenance-log.md` 기록.

## B. 최초 구축 / 새 페이지 유형

1. 필요한 정보가 `site/src/data/site.json`에 있는지 확인. 없는 사실은 지어내지 말고 한 번에 모아서 묻는다
   (회사명, 한 줄 소개, 메뉴, 서비스 항목, 연락처, 주소, 사업자 정보, CTA).
2. 구조 원칙:
   - 페이지 = `src/pages/*.astro` 는 섹션 컴포넌트를 조립만 한다. 문구는 `site.json`/Markdown에서 읽는다.
   - 섹션 컴포넌트 = `src/components/sections/*.astro`. props로 데이터를 받고, 스타일은 `<style>` 안에서 토큰만 사용.
   - 공통 레이아웃 = `src/layouts/Base.astro` (메타태그, OG, lang, 헤더/푸터, 다크모드).
   - 반복 콘텐츠(소식, 사례, 채용)는 `src/content/<이름>/` 컬렉션 + `src/content.config.ts` 스키마.
3. 접근성 기본: 시맨틱 태그, 이미지 alt, 키보드 포커스 표시(`--bi-focus`), 링크는 밑줄 또는 본문과 3:1 이상 구분,
   본문 대비는 brand.md의 테스트된 조합만 사용.
4. 새 섹션을 만들면 `site/src/components/sections/README.md` 표에 한 줄 추가(이름, 받는 데이터, 쓰는 페이지).
5. `verify` 통과 → 미리보기 확인 → 로그 기록.

## 하지 말 것
- tokens.css 직접 편집, 컴포넌트에 hex/폰트명 하드코딩.
- 사용자 확인 없이 외부 라이브러리·UI 프레임워크 추가(필요하면 이유와 함께 제안).
- 배포.
