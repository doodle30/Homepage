# 유지관리 기록

새 항목은 맨 위에 추가한다. 형식:

```
## YYYY-MM-DD — 종류(구축|수정|점검|보수|브랜드) — 한 줄 요약
- 무엇을: 바뀐 파일/페이지
- 왜: 요청 또는 원인
- 검증: `npm --prefix site run verify` 결과 (통과/실패 + 남은 경고)
```

---

## 2026-11-08 — 수정 — 「빨간펜 무쌍」 개인정보처리방침 개정 (앱 0.2.1 결제 제거) + 이전 버전 보관
- 무엇을: `legal/ko/redpen-privacy.md` 에서 결제·구매 내용 8곳 삭제(1절 패스·Google Play·카드 줄, 2절 구매 기록 줄·결제 수단·패스 설명, 3절·5절 구매 기록 줄, 4절 Google Play 결제 줄·"광고와 결제" → "광고"), 10절 "이전 버전: 없음" → 변경 이력 + 이전 버전 링크. 최초 시행본은 `legal/ko/redpen-privacy-2026-11-08.md` → `/ko/games/redpen/privacy/2026-11-08/` 로 그대로 보관. 페이지 파일 `privacy.astro` → `privacy/index.astro`, LegalDoc 에 `routes`(보관본 언어 전환용). 영어 안내 페이지는 결제 문구 없어 그대로
- 왜: 앱 0.2.1(versionCode 3)에서 Google Play 결제("광고 없이 부활" 패스) 제거. 사용자가 "지금 → 바꾼 뒤" 표와 시행일 A안(게시일 즉시 시행 + 변경 이력 + 이전 버전 보관) 승인. 원본 `Redpen-game/hosting/public/privacy/index.html`·`store/privacy-policy.md` 도 같은 본문으로 맞춤(그 저장소는 커밋 안 함)
- 검증: `verify`·`verify:pages` 통과(오류 0, 경고 0). 보관본 본문 = 최초 시행본 원문 확인. 현재본·보관본이 서로 링크(base 포함)

## 2026-11-08 — 구축 — 「빨간펜 무쌍」 개인정보처리방침 페이지 (/ko/games/redpen/privacy)
- 무엇을: `src/content/legal/ko/redpen-privacy.md`(원본 `D:\GooglePlaystore\Idea\Redpen-game\hosting\public\privacy\index.html` 본문 그대로), `legal` 컬렉션(content.config.ts), `src/views/LegalDoc.astro`(표는 좁은 화면에서 가로 스크롤, 토큰만 사용), `src/pages/ko/games/redpen/privacy.astro`. 영어 안내 페이지 `/games/redpen/privacy`(`legal/en/redpen-privacy.md`, Claude 초안 2문장 + 한국어 원문 링크). 메뉴·푸터 미노출(사용자 결정)
- 왜: Google Play Console 앱 콘텐츠 → 개인정보처리방침에 넣을 로그인 없는 공개 URL. 문장·표는 사용자 승인본이라 수정하지 않음
- 검증: `verify`·`verify:pages` 통과(오류 0, 경고 0). 원본과 본문 텍스트 동일(3,474자)·태그 수 동일(151). 375px: 페이지 가로 넘침 없음, 넓은 표 2개(480·720px)만 표 안에서 가로 스크롤. 1280px: 표 6개 모두 넘침 없음. 두 언어 hreflang 짝 연결

## 2026-11-05 — 수정·보수 — 오픈 공지 공개 + 번역 글 충돌 버그 수정
- 무엇을: 오픈 공지 영어·한국어 `draft: false`. 번역 짝 필드 `slug` → `key` (content.config.ts, lib/news.ts, site-edit 스킬, CLAUDE.md). `check-site.mjs` 에 "공개 글마다 페이지 존재" 검사 추가
- 왜: 사용자 요청 "공지 공개해줘". 공개해 보니 영어 글 페이지가 안 만들어짐 — Astro 가 frontmatter `slug` 를 entry id 로 써서 두 언어 글(slug: hello)이 같은 id 로 충돌, 한쪽이 덮어써짐
- 검증: 새 검사가 수정 전 빌드에서 "공개 글인데 페이지가 없음"으로 실패하는 것 확인 → 수정 후 `verify`·`verify:pages` 통과(오류 0, 경고 0), /news/hello ↔ /ko/news/hello 서로 연결

## 2026-11-05 — 배포 — 첫 공개 배포 확인 (https://doodle30.github.io/Homepage/)
- 무엇을: 사용자가 저장소를 공개로 전환하고 Pages Source 를 GitHub Actions 로 설정. 워크플로 실행(d593cc7) 성공
- 왜: GitHub 무료 계정은 비공개 저장소로 Pages 를 쓸 수 없음. 공개 전 점검: 추적 파일 436개에 비밀값 없음, 노출 개인정보는 사이트에 이미 공개된 이메일뿐
- 검증: 실제 주소에서 영어·한국어 8개 페이지, 로고·파비콘·og.png·apple-touch-icon·사이트맵 모두 200, 없는 주소는 404 + 두 언어 안내 페이지. canonical·hreflang·og:image 가 배포 주소로 나옴. 브라우저 화면 확인

## 2026-11-05 — 구축·배포 — GitHub Pages 배포, 한국어 페이지, 공유 이미지, 배포 스킬
- 무엇을:
  - 배포: `.github/workflows/deploy.yml`(master push → `verify:pages` 통과 시 GitHub Pages), `site/deploy.json`(https://doodle30.github.io/Homepage/), `tools/pages-build.mjs`
  - 하위 경로 대응: 모든 링크·파일을 `src/lib/i18n.ts` 의 `url()`/`asset()` 로. `check-site.mjs --base` 추가(누락 시 오류), `<link>` 대상 파일 점검 추가
  - 한국어: `/ko` 전 페이지, `site.ko.json`(Claude 번역 — 확인 필요), 언어 전환 버튼, hreflang, 번역 없는 글은 그 언어 소식 목록으로
  - 구조: `src/views/`(언어 공통 본문) + `src/pages/`·`pages/ko/` 얇은 파일, 소식 글 `news/en|ko/` + `lang`·`slug`
  - 공유: `og.png`(1200x630, 원본 `brand/og/og.html`, `tools/render-og.mjs`), OG·Twitter 메타, canonical, 사이트맵(`@astrojs/sitemap`)
  - 콘텐츠: 오픈 공지 영어·한국어 초안(`draft: true`, 사용자 확인 대기)
  - 하네스: `site-deploy` 스킬 추가, CLAUDE.md·site-edit·site-build·site-check 갱신
- 왜: 사용자 요청 "배포 → 콘텐츠 → 한국어 → 정기 점검 순서대로 진행"
- 검증: `verify`·`verify:pages`(base /Homepage) 통과, 경고 0. 음성 테스트로 base 누락·파일 누락 검출 확인. 브라우저: /ko, /ko/about 화면·언어 전환·전 페이지 200 확인
- 미완료: 월간 자동 점검 예약 — 권한 확인에서 막힘(사용자 허용 필요). GitHub Pages 활성화(Settings → Pages → Source: GitHub Actions)는 사용자가 직접

## 2026-11-05 — 브랜드 — "Bounce O" 확정, 키트 제작, 사이트 반영
- 무엇을: 오용 예시 2종(공을 바닥선에 내려놓기, 노란 공 추가) 추가 · 작은 아이콘을 코코아 타일 위 공으로 변경 · 가이드 키트(PDF 8쪽, 로고 17종, 토큰) → `brand/` 복사 + `brand/brand.md` 작성 · 사이트: tokens.css 교체, fonts.css(Bagel Fat One / IBM Plex Sans KR, Google Fonts 링크), logo.svg(어두운 배경용, 여백 잘라냄)·favicon·apple-touch-icon, `data-theme="dark"` 기본, h3는 본문 서체
- 왜: 사용자가 로고 2번 Bounce O 선택
- 검증: 키트 게이트 전부 통과(폰트 로드·임베드, 넘침 없음, 글자 대비, 로고 크기). site `verify` 통과(경고 1: 오픈 공지 TODO, draft). 브라우저 1280/375px 확인, 폰트 로드 확인, 콘솔 오류 없음

## 2026-11-05 — 브랜드 — B 방향 선택, 로고 재시안 4종 (선택 대기)
- 무엇을: 사용자가 B(Bagel Letters) 방향을 고르고 로고만 재요청 → `brand-work/logo-round2/mowgli-games`에 B의 폰트·색 그대로 로고 4종(Peekaboo 추천 · Bounce O · Tuft · Pebbles). 각 2라운드 검토(1: 눈이 움라우트처럼 보임, 3: 💩 이모지로 읽힘, 4: 사람 아이콘으로 읽힘 → 수정)
- 왜: 첫 B 로고(노란 글자 전체)가 흰 배경에서 1.9:1, 가이드 PDF 검사 5곳 실패 + 사용자 비선호
- 검증: 4종 모두 게이트 통과. 경고: 노란색 흰 배경 대비(로고 파일은 밝은 배경에서 자동으로 진한색), 'gold' 기본값(사용자 요청 색, 사유 기록)

## 2026-11-05 — 브랜드 — 질문지 접수, 시안 3종 제작 (선택 대기)
- 무엇을: `docs/brief/questionnaire.md`·`brief.json` 작성, `site.json`을 Mowgli Games 영어 문구로 채움, Services → Games 섹션(상태 라벨, 이름 없는 게임 숨김), `brand-work/mowgli-games` 시안 A Night Peek(추천) · B Bagel Letters · C Bounce
- 왜: 대화형 질문지 답변 → brand-intake → brand-identity
- 검증: site `verify` 통과(경고 1: 오픈 공지 TODO, 글은 draft). 시안 3종 모두 게이트 통과. 경고: A/B 노란색이 흰 배경에서 3:1 미만(다크 우선 사이트라 라이트 모드에서만 해당), A/B 노란색이 AI 기본값 'gold' 영역(사용자 요청 색이라 사유 기록), C 강조색=배경색

## 2026-11-05 — 브랜드 — 질문지 단계(brand-intake) 추가
- 무엇을: `.claude/skills/brand-intake/`(스킬 + 질문지 원본), `docs/brief/questionnaire.md`(작성용), CLAUDE.md 워크플로 갱신
- 왜: 회사 정보를 질문지로 받아 브랜드·사이트 작업에 재사용하도록
- 검증: brand-identity `check` 통과(Python 패키지·Chrome 정상). 질문지는 사용자 작성 대기

## 2026-11-05 — 구축 — 하네스 초기 구성
- 무엇을: CLAUDE.md, site-* 스킬 4종, site-auditor 에이전트, 점검 스크립트, Astro 사이트 뼈대(임시 토큰)
- 왜: 홈페이지 생성·유지관리·보수 하네스 구축 요청
- 검증: `verify` 통과 — 오류 0, 경고 22(전부 미입력 TODO). 점검 스크립트에 위반 5종을 넣어 모두 잡히는 것 확인.
