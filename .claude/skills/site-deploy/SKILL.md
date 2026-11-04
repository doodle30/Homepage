---
name: site-deploy
description: 홈페이지를 실제 인터넷에 올리거나(배포), 배포 상태를 확인하거나, 도메인·배포 주소를 바꿀 때 사용. "배포해줘", "사이트 올려줘", "반영해줘", "왜 사이트에 안 바뀌어", "도메인 연결". GitHub Pages(GitHub Actions) 기준.
---

# site-deploy — 배포

배포 = `master` 브랜치에 push. push 되면 `.github/workflows/deploy.yml` 이 `npm run verify:pages`
(배포 주소 기준 빌드 + 점검)를 돌리고, **통과할 때만** GitHub Pages 에 올린다.

설정은 한 곳: `site/deploy.json` (`url`, `base`, `repo`, `branch`).
지금 주소: `https://doodle30.github.io/Homepage/`

## 절차

1. **로컬 점검 (둘 다 통과해야 함)**
   - `npm --prefix site run verify` (로컬 주소 기준)
   - `npm --prefix site run verify:pages` (배포 주소·base 기준 — 하위 경로 링크 누락을 잡는다)
2. **바뀐 것 요약**을 사용자에게 보여준다: `git status`, `git diff --stat`, 바뀐 페이지 목록.
3. **사용자 확인을 받는다.** 배포는 공개 행동이다. "배포해줘"라는 요청이 이번 대화에 있었으면 그것이 확인이다.
   이전 대화의 허락은 이어지지 않는다.
4. 커밋(요청이 있었거나 배포 요청에 포함) → `git push`.
5. 결과 확인: GitHub 저장소 → Actions 탭에서 "Deploy site to GitHub Pages" 실행 결과.
   `gh`가 있으면 `gh run list --workflow deploy.yml -L 1`. 끝나면 배포 주소를 브라우저로 열어 홈·/ko 를 확인.
6. `docs/maintenance-log.md` 에 "배포" 항목.

## 처음 한 번 (사용자가 직접)
GitHub 저장소 → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
이 설정 전에는 워크플로의 deploy 단계가 실패한다(빌드·점검은 성공).

## 도메인 연결 (정해지면)
1. `site/deploy.json`: `url` 을 `https://도메인`, `base` 를 `/` 로.
2. `site/public/CNAME` 파일에 도메인 한 줄.
3. 사용자가 DNS 설정(도메인 업체) + GitHub Settings → Pages → Custom domain. DNS·계정 설정은 사용자가 한다.
4. `verify:pages` → 배포 → https 동작 확인.

## 문제 해결
- 사이트에 안 바뀜: Actions 실행이 실패했는지 확인 → 실패 단계 로그 → 점검 실패면 `site-fix`.
- 링크·이미지가 깨짐(배포에서만): 코드가 `url()`/`asset()`(`src/lib/i18n.ts`)을 안 거치고 `/경로`를 직접 쓴 것. `verify:pages` 가 잡는다.

## 하지 말 것
- 점검 실패 상태로 push, 워크플로에서 점검 단계 빼기.
- force push, 사용자 확인 없는 배포.
