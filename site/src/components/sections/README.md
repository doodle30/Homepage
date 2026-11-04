# 섹션 컴포넌트 목록

새 섹션을 만들면 여기에 한 줄 추가한다. 스타일은 `var(--bi-*)`, `var(--font-*)` 만 사용.

| 컴포넌트 | 받는 데이터 | 쓰는 페이지 |
|---|---|---|
| `Hero` | `site.hero` (title, body, cta) | `/` |
| `Games` | `site.games` (title, empty, items[{title, body, status, href, image, imageAlt}]) — 이름 없는 게임은 렌더하지 않음 | `/` |
| `CallToAction` | `site.cta` | `/`, `/about` |
| `NewsList` | news 컬렉션 | `/`(최근 3개), `/news` |
