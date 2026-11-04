# 유지관리 기록

새 항목은 맨 위에 추가한다. 형식:

```
## YYYY-MM-DD — 종류(구축|수정|점검|보수|브랜드) — 한 줄 요약
- 무엇을: 바뀐 파일/페이지
- 왜: 요청 또는 원인
- 검증: `npm --prefix site run verify` 결과 (통과/실패 + 남은 경고)
```

---

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
