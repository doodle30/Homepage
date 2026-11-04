# Mowgli Games — 브랜드 요약

확정일: 2026-11-05 · 원본 작업: `brand-work/logo-round2/mowgli-games` 세트 B **Bounce O**
(색·서체는 1차 시안 B *Bagel Letters*, 로고는 2차 시안 *Bounce O*)

이 폴더가 사이트 디자인의 유일한 출처다. 바꿀 때는 brand-identity에서 `palette.json`/`sets.json`을 고치고 키트를 다시 만든 뒤 `site-build`의 "브랜드 반영"을 실행한다. 여기 파일을 직접 고치지 않는다.

## 아이디어
이름이 계속 튄다: "mowgli"의 o는 바닥선에서 살짝 떠오른 노른자색 공이고, 그 공 하나가 앱 아이콘이다.
노란색은 로고에서 공 하나뿐이다.

## 파일
| 무엇 | 경로 |
|---|---|
| 가이드 PDF (8쪽) | `mowgli-games-guidelines.pdf`, 쪽 이미지 `pages/` |
| 색 토큰 | `tokens/tokens.css` (사이트는 `site/src/styles/tokens.css` 로 복사해 씀) |
| 폰트 변수 | `tokens/fonts.css`, 출처·라이선스 `fonts.md` |
| 로고 | `logo/` — 어두운 배경 `full-color-dark.svg`, 밝은 배경 `full-color.svg`, 한 색 `one-color-*.svg`, 파비콘 `favicon-*.svg`, 앱 아이콘 `app-icon-512.*` |

## 색
| 이름 | hex | 쓰임 |
|---|---|---|
| Cocoa | `#2a1d17` | 기본 배경(다크 우선), 어두운 면 |
| Yolk | `#ffaa0a` | 로고의 공, 버튼, 링크(다크), 한 화면에 한두 곳 |

사이트는 **다크 테마가 기본**이다(`<html data-theme="dark">`). 밝은 테마는 토큰에 있으나 지금은 쓰지 않는다.

### 테스트된 조합 (다크, WCAG 2 대비) — 이 조합만 쓴다
| 글자/전경 | 배경 | 대비 |
|---|---|---|
| text `#f5f2f1` | background `#2a1d17` | 14.65:1 |
| text-muted `#d8d3d0` | background `#2a1d17` | 11.00:1 |
| text `#f5f2f1` | surface `#342823` | 12.79:1 |
| text-muted `#d8d3d0` | surface `#342823` | 9.60:1 |
| text-muted `#d8d3d0` | surface-alt `#4b3e37` | 6.92:1 |
| primary(Yolk) `#ffaa0a` | background `#2a1d17` | 8.55:1 |
| link `#ffaa0a` | surface `#342823` | 7.47:1 |
| on-primary `#160d09` | primary `#ffaa0a` | 10.05:1 |
| on-accent `#160d09` | accent `#c29455` | 6.99:1 |

**주의:** Yolk는 흰/밝은 배경에서 1.91:1 — 밝은 배경에 노란 글자·노란 버튼 금지.

## 서체
| 역할 | 서체 | 굵기 | 비고 |
|---|---|---|---|
| 제목(display) | Bagel Fat One | 400 | 소문자 위주, 자간 -0.01em. 큰 제목에만(본문·작은 글자 금지) |
| 본문(text) | IBM Plex Sans KR | 400, 600 | 영어·한국어 모두 |
둘 다 Google Fonts, OFL-1.1. CSS 변수 `--font-display`, `--font-text`.

## 로고 규칙
- 최소 크기 24 px(글자 로고). 16–48 px에서는 코코아 타일 위 공 아이콘(파비콘)을 쓴다.
- 여백: 글자 높이(cap height) 1배 — 사용 후 조정 가능한 추정값.
- 어두운 배경: 크림 글자 + 노른자 공 (`full-color-dark.svg`). 밝은 배경: 코코아 글자 + 노른자 공 (`full-color.svg`).
- 금지: 늘리기, 돌리기, 낮은 대비, 그림자 등 효과, **공을 바닥선에 내려놓기**, **노란 공 추가하기**(예: i 점).

## Do / Don't (사이트)
- 컴포넌트는 역할 토큰(`--bi-background`, `--bi-text`, `--bi-primary` …)만. 단계 토큰(`--bi-primary-600`)·hex 금지.
- 채움색은 짝(`--bi-on-*`)과만 쓴다. 상태는 색만으로 표시하지 않는다(글자 라벨 함께).
- 링크는 밑줄. 포커스 링은 `--bi-focus`.
