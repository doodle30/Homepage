---
name: site-edit
description: 홈페이지의 내용 수정에 사용. 문구·메뉴·연락처 변경, 소식/공지 글 올리기·수정·삭제, 게임 추가·상태 변경, SNS 링크 추가, 이미지 교체 등 "~ 바꿔줘", "공지 올려줘", "게임 추가해줘" 같은 요청. 영어·한국어 둘 다 고친다. 디자인·구조 변경은 site-build, 오류 수리는 site-fix, 실제 사이트 반영은 site-deploy.
---

# site-edit — 콘텐츠 수정

`CLAUDE.md` 절대 규칙을 따른다. 이 스킬은 **데이터 파일만** 고치는 것이 원칙이다.

## 어디를 고치나

| 요청 | 파일 (항상 두 언어 모두) |
|---|---|
| 회사명, 소개, 메뉴, 히어로, CTA, 연락처, UI 라벨 | `site/src/data/site.json` (영어) · `site.ko.json` (한국어) |
| SNS 링크 | 위 두 파일의 `contact.links` (`{ "label": "YouTube", "href": "https://…" }`) |
| 게임 | 위 두 파일의 `games.items` — 아래 형식 |
| 소식·공지 글 | `site/src/content/news/en/YYYY-MM-DD-slug.md` · `news/ko/…` |
| 이미지 | `site/public/images/` (파일명 영문 소문자-하이픈, 가로 2000px 이하) |

### 게임 항목
```json
{ "title": "게임 이름", "body": "한 줄 설명", "status": "Out now | Coming soon | In development",
  "href": "https://스토어주소 (선택)", "image": "/images/게임.png (선택)", "imageAlt": "이미지 설명" }
```
- 한국어 파일의 status: `출시` · `출시 예정` · `개발 중`.
- **이름이 없는 게임은 넣지 않는다**(사용자 요청). 이름 없으면 추가하지 말고 이름을 묻는다.
- `href`·`image` 는 그대로 적는다. 화면에서 `url()`/`asset()` 이 배포 경로를 붙인다.

### 소식 글 frontmatter
```yaml
title: "제목"
date: 2026-11-05
summary: "목록에 보일 한두 문장"
lang: en            # ko 폴더 글은 ko
slug: hello         # 영어·한국어 짝 글은 같은 slug → /news/hello ↔ /ko/news/hello
draft: false        # true 면 사이트에 안 나옴
```

`.astro` 파일을 고쳐야만 가능한 요청이면 멈추고 `site-build`로 넘긴다고 알린다.

## 절차

1. 요청을 파일·필드 단위로 바꿔 말하고, 애매하면 확인한다.
   이메일·링크·가격처럼 틀리면 곤란한 값은 바꾸기 전 현재값과 새 값을 나란히 보여준다.
2. 수정. 사용자가 주지 않은 사실(수치, 출시일, 수상 등)은 추가하지 않는다.
3. 사용자가 한 언어로만 주면 다른 언어는 Claude가 번역 초안을 넣고 **"번역 초안"이라고 알려 확인받는다.**
4. 글 삭제는 파일을 지우지 말고 `draft: true`로 숨긴다(완전 삭제는 확인 후).
5. `npm --prefix site run verify` 와 `verify:pages` 통과. 바뀐 페이지 경로(영어·한국어)를 알려준다.
6. `docs/maintenance-log.md`에 "수정" 항목. 실제 사이트 반영이 필요하면 `site-deploy`.
