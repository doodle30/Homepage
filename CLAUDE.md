# CompanySite 하네스

회사 홈페이지를 **브랜드 정립 → 구축 → 유지관리 → 보수 → 배포**까지 Claude Code로 운영하는 프로젝트다.
사용자와의 대화·보고는 한국어로 한다.

## 폴더 구조

| 경로 | 내용 | 누가 고치나 |
|---|---|---|
| `brand/` | 확정된 브랜드(토큰·로고·폰트·가이드·공유 이미지 원본 `og/`). **사이트 디자인의 유일한 출처** | `site-build`의 "브랜드 반영" 단계만 |
| `docs/brief/` | 질문지(`questionnaire.md`)와 정리본(`brief.json`) — 회사 사실의 출처 | `brand-intake` |
| `brand-work/` | brand-identity 스킬 작업 폴더(시안·보드) | brand-identity 스킬 |
| `site/` | Astro 정적 사이트 (영어 `/`, 한국어 `/ko`) | 모든 site-* 스킬 |
| `site/src/data/site.json` · `site.ko.json` | 언어별 문구 전부(메뉴·히어로·소개·연락처·UI 라벨 `ui`) | `site-edit` |
| `site/src/content/news/en/` · `ko/` | 소식 글(Markdown). 번역 짝은 frontmatter `slug` 를 같게 | `site-edit` |
| `site/src/views/` | 페이지 본문(언어 공통). `src/pages/` 와 `src/pages/ko/` 는 언어만 넘기는 얇은 파일 | `site-build` |
| `site/src/lib/i18n.ts` | `url()`·`asset()`·`getSite()` — 모든 내부 링크·정적 파일 경로가 거치는 곳 | `site-build` |
| `site/src/styles/tokens.css` | `brand/tokens/tokens.css`의 복사본. **직접 수정 금지** | `site-build`만 |
| `site/deploy.json` | 배포 주소(`url`, `base`) 설정 | `site-deploy` |
| `.github/workflows/deploy.yml` | master push → 점검 → GitHub Pages 배포 | `site-deploy` |
| `tools/check-site.mjs` | 빌드 결과물 정적 점검 (`--base` 로 배포 경로 점검) | — |
| `tools/pages-build.mjs` · `render-og.mjs` | 배포용 빌드 · 공유 이미지 렌더 | — |
| `docs/maintenance-log.md` | 모든 변경·점검·보수·배포 기록 | 모든 site-* 스킬 |
| `docs/reports/` | 점검 보고서 | `site-check` |
| `vendor/` | 외부 저장소 원본(참고용, git 제외) | 손대지 않음 |

## 워크플로 → 스킬

| 상황 | 스킬 |
|---|---|
| 브랜드 작업 시작, 회사 정보 받기, 질문지 작성·접수 (**항상 첫 단계**) | `brand-intake` |
| 로고·폰트·색 정하기, 브랜드 리뉴얼, 브랜드 평가 (질문지 정리본 `docs/brief/brief.json` 기반) | `brand-identity` |
| 사이트 최초 구축, 브랜드 바뀐 뒤 사이트에 반영, 새 페이지 유형 추가 | `site-build` |
| 문구·메뉴·연락처 수정, 소식 글 올리기, 게임 추가, 이미지 교체 (영어·한국어 둘 다) | `site-edit` |
| 정기 점검("사이트 점검해줘", 매월 자동) | `site-check` (읽기 전용 `site-auditor` 에이전트 사용) |
| 깨짐·오류·"이상해요" 신고, 점검에서 나온 문제 고치기 | `site-fix` |
| 배포("올려줘", "반영해줘"), 배포 실패, 도메인 연결 | `site-deploy` |

## 절대 규칙

1. **색·폰트는 토큰으로만.** 컴포넌트/페이지에 hex·rgb 값이나 폰트 이름을 직접 쓰지 않는다.
   `var(--bi-*)`(색) 와 `var(--font-display)`, `var(--font-text)`(폰트)만 쓴다. 점검 스크립트가 잡아낸다.
2. **콘텐츠와 코드 분리.** 문구는 `site.json`/`site.ko.json`·Markdown에 둔다. `.astro` 에 문구를 하드코딩하지 않는다.
3. **두 언어는 함께.** 문구를 바꾸면 영어·한국어 둘 다 바꾼다. 번역은 Claude 초안임을 알리고 확인받는다.
4. **링크·파일 경로는 `url()`/`asset()` 로만.** `href="/about"` 처럼 직접 쓰면 배포(하위 경로)에서 깨진다.
5. **모든 변경 후 검증:** `npm --prefix site run verify` 와 `npm --prefix site run verify:pages` 가 둘 다 통과해야 완료다. 실패를 숨기지 않는다.
6. **기록:** 변경·점검·보수·배포를 할 때마다 `docs/maintenance-log.md` 맨 위에 한 항목(날짜, 무엇을, 왜, 검증 결과).
7. **사실 지어내지 않기.** 회사 연혁·수치·고객사·인증 등은 사용자가 준 것만 쓴다. 모르면 `TODO:` 로 남기고 묻는다.
8. **배포·외부 전송은 사용자 확인 후.** master 에 push = 실제 사이트 배포다. 커밋·push 는 요청이 있을 때만.
9. `brand/`, `tokens.css`, `vendor/` 는 각 담당 스킬 외에는 수정하지 않는다.

## 명령

```bash
npm --prefix site install          # 최초 1회
npm --prefix site run dev          # 로컬 미리보기 http://localhost:4321  (한국어 /ko)
npm --prefix site run verify       # 빌드 + 점검 (로컬 주소)
npm --prefix site run verify:pages # 빌드 + 점검 (배포 주소·base 기준)
node tools/render-og.mjs           # 공유 이미지 다시 만들기 (brand/og/og.html → site/public/og.png)
```

## 현재 상태

- 브랜드: **확정 (2026-11-05)** — Mowgli Games "Bounce O" (Cocoa + Yolk, Bagel Fat One / IBM Plex Sans KR). 요약·규칙 `brand/brand.md`. 다크 테마 기본.
- 회사 정보: 접수 완료 — `docs/brief/brief.json`. 게임 목록·추가 SNS는 나중에.
- 언어: 영어(`/`) + 한국어(`/ko`). 한국어 문구는 Claude 번역 — 사용자 확인 대기.
- 배포: GitHub Pages `https://doodle30.github.io/Homepage/` (master push 시 자동). 도메인 미정.
- 정기 점검: **자동 실행 미설정** — 예약 작업 생성이 권한 확인에서 막힘. 지금은 "사이트 점검해줘"로 수동 실행.
