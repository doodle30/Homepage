# 섹션 컴포넌트 목록

새 섹션을 만들면 여기에 한 줄 추가한다. 스타일은 `var(--bi-*)`, `var(--font-*)` 만, 링크는 `url()`/`asset()` 만, 모든 섹션은 `locale` prop 을 받는다.

| 컴포넌트 | 받는 데이터 | 쓰는 페이지 |
|---|---|---|
| `Hero` | `site.hero` (title, body, cta) | `/` |
| `Games` | `site.games` (title, empty, items[{title, body, status, href, image, imageAlt}]) — 이름 없는 게임은 렌더하지 않음 | `/` |
| `CallToAction` | `site.cta` | `/`, `/about` (+ `/ko/…`) |
| `NewsList` | news 컬렉션 (언어별 `lib/news.getPosts`) | `/`(최근 3개), `/news` (+ `/ko/…`) |
