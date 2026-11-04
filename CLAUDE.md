# CompanySite 하네스

회사 홈페이지를 **브랜드 정립 → 구축 → 유지관리 → 보수**까지 Claude Code로 운영하는 프로젝트다.
사용자와의 대화·보고는 한국어로 한다.

## 폴더 구조

| 경로 | 내용 | 누가 고치나 |
|---|---|---|
| `brand/` | 확정된 브랜드(토큰·로고·폰트·가이드). **사이트 디자인의 유일한 출처** | `site-build`의 "브랜드 반영" 단계만 |
| `docs/brief/` | 질문지(`questionnaire.md`)와 정리본(`brief.json`) — 회사 사실의 출처 | `brand-intake` |
| `brand-work/` | brand-identity 스킬 작업 폴더(시안·보드) | brand-identity 스킬 |
| `site/` | Astro 정적 사이트 | 모든 site-* 스킬 |
| `site/src/data/site.json` | 회사명·메뉴·연락처·CTA 등 공통 정보 | `site-edit` |
| `site/src/content/news/` | 소식/공지 글(Markdown) | `site-edit` |
| `site/src/styles/tokens.css` | `brand/tokens/tokens.css`의 복사본. **직접 수정 금지** | `site-build`만 |
| `tools/check-site.mjs` | 빌드 결과물 정적 점검 스크립트 | — |
| `docs/maintenance-log.md` | 모든 변경·점검·보수 기록 | 모든 site-* 스킬 |
| `vendor/` | 외부 저장소 원본(참고용, git 제외) | 손대지 않음 |

## 워크플로 → 스킬

| 상황 | 스킬 |
|---|---|
| 브랜드 작업 시작, 회사 정보 받기, 질문지 작성·접수 (**항상 첫 단계**) | `brand-intake` |
| 로고·폰트·색 정하기, 브랜드 리뉴얼, 브랜드 평가 (질문지 정리본 `docs/brief/brief.json` 기반) | `brand-identity` |
| 사이트 최초 구축, 브랜드 바뀐 뒤 사이트에 반영, 새 페이지 유형 추가 | `site-build` |
| 문구·메뉴·연락처 수정, 소식 글 올리기, 이미지 교체 | `site-edit` |
| 정기 점검("사이트 점검해줘") | `site-check` (읽기 전용 `site-auditor` 에이전트 사용) |
| 깨짐·오류·"이상해요" 신고, 점검에서 나온 문제 고치기 | `site-fix` |

## 절대 규칙

1. **색·폰트는 토큰으로만.** 컴포넌트/페이지에 hex·rgb 값이나 폰트 이름을 직접 쓰지 않는다.
   `var(--bi-*)`(색) 와 `var(--font-display)`, `var(--font-text)`(폰트)만 쓴다. 점검 스크립트가 잡아낸다.
2. **콘텐츠와 코드 분리.** 문구는 `site.json`·Markdown에 둔다. `.astro` 파일에 회사 문구를 하드코딩하지 않는다.
3. **모든 변경 후 검증:** `npm --prefix site run verify` (빌드 + 점검)가 통과해야 완료다. 실패를 숨기지 않는다.
4. **기록:** 변경·점검·보수를 할 때마다 `docs/maintenance-log.md` 맨 위에 한 항목을 추가한다(날짜, 무엇을, 왜, 검증 결과).
5. **사실 지어내지 않기.** 회사 연혁·수치·고객사·인증 등은 사용자가 준 것만 쓴다. 모르면 `TODO:` 로 남기고 사용자에게 묻는다.
6. **배포·외부 전송은 사용자 확인 후.** 커밋은 요청이 있을 때만, 배포(push/업로드)는 매번 확인받는다.
7. `brand/`, `tokens.css`, `vendor/` 는 각 담당 스킬 외에는 수정하지 않는다.

## 명령

```bash
npm --prefix site install      # 최초 1회
npm --prefix site run dev      # 로컬 미리보기 http://localhost:4321
npm --prefix site run verify   # 빌드 + 점검 (완료 조건)
```

## 현재 상태

- 브랜드: **확정 (2026-11-05)** — Mowgli Games "Bounce O" (Cocoa + Yolk, Bagel Fat One / IBM Plex Sans KR). 요약·규칙 `brand/brand.md`. 다크 테마 기본.
- 회사 정보: 접수 완료 — `docs/brief/brief.json`. 게임 목록·SNS는 나중에 추가 예정.
- 언어: 영어 사이트만 있음. 한국어 페이지는 아직 없음(브랜드 서체는 한글 지원 확인됨).
- 배포 대상: **미정**.
