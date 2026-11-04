---
name: site-edit
description: 홈페이지의 내용 수정에 사용. 문구·메뉴·연락처·주소 변경, 소식/공지 글 올리기·수정·삭제, 이미지 교체, 서비스 항목 추가 등 "~ 바꿔줘", "공지 올려줘", "전화번호 수정" 같은 요청. 디자인·구조 변경은 site-build, 오류 수리는 site-fix.
---

# site-edit — 콘텐츠 수정

`CLAUDE.md` 절대 규칙을 따른다. 이 스킬은 **데이터 파일만** 고치는 것이 원칙이다.

## 어디를 고치나

| 요청 | 파일 |
|---|---|
| 회사명, 소개, 메뉴, 연락처, 주소, 사업자정보, CTA, 서비스 목록 | `site/src/data/site.json` |
| 소식·공지 글 | `site/src/content/news/YYYY-MM-DD-slug.md` (frontmatter: title, date, summary, draft) |
| 이미지 | `site/public/images/` (파일명 영문 소문자-하이픈, 가로 2000px 이하, alt 문구는 데이터 쪽에) |

`.astro` 파일을 고쳐야만 가능한 요청이면 멈추고 `site-build`로 넘긴다고 알린다.

## 절차

1. 요청을 파일·필드 단위로 바꿔 말하고, 애매하면 확인한다(예: "대표번호만? 푸터와 문의 페이지 둘 다?").
   전화·주소·사업자번호·가격처럼 틀리면 곤란한 값은 바꾸기 전 현재값과 새 값을 나란히 보여준다.
2. 수정. 사용자가 주지 않은 사실(수치, 고객사, 수상 등)은 추가하지 않는다.
3. 글 삭제는 파일을 지우지 말고 frontmatter `draft: true`로 숨긴다(사용자가 완전 삭제를 원하면 확인 후).
4. `npm --prefix site run verify` 통과 확인. 바뀐 페이지 경로를 사용자에게 알려준다.
5. `docs/maintenance-log.md`에 "수정" 항목 기록.
