---
name: brand-intake
description: 브랜드·홈페이지 작업 전에 회사 정보를 받는 질문지 단계. "브랜드 작업 시작", "질문지 줘", "질문지 다 썼어", "회사 정보 입력", 브랜드 리뉴얼 시작 시 사용. 질문지를 만들거나 읽어서 빠진 것만 묻고, brand-identity init 명령과 site.json을 채운 뒤 brand-identity로 넘긴다.
---

# brand-intake — 질문지로 정보 받기

질문지 원본: `.claude/skills/brand-intake/questionnaire.template.md`
작성본: `docs/brief/questionnaire.md` · 정리본: `docs/brief/brief.json`

## 1. 질문지 준비
- `docs/brief/questionnaire.md`가 없으면 원본을 복사하고, 파일 링크와 함께 "작성 후 '질문지 다 썼어'라고 말해 주세요"라고 안내한 뒤 **멈춘다**.
- 사용자가 파일 대신 대화로 답하고 싶어 하면, 섹션 하나씩(A1~A2 → A3~A6 → A7~A11 → B → C) 묻고
  답을 받는 대로 질문지 파일의 `답:` 칸에 직접 적는다. 선택형(A1, A2, A8, A9)은 AskUserQuestion으로 묻는다.

## 2. 읽고 검사
1. 각 `답:` 값을 읽는다. 예시 주석(`<!-- -->`)은 답이 아니다.
2. **[필수]** 항목(A1, A3, A4, A5, A6, B1, B2)이 비었으면 그것만 한 메시지로 모아 묻는다. 나머지 빈칸은 묻지 않는다.
3. 점검:
   - A1이 `다듬기`/`유지`인데 A1-파일이 없으면 → 파일 요청. 파일이 실제로 있는지 확인.
   - A6에 "신뢰·프리미엄·혁신·따뜻한" 같은 범용어만 있으면 → 한 번만 "다른 회사와 구별되는 말"을 제안하며 확인. 사용자가 그대로 원하면 존중.
   - A7이 비면 → 경쟁사 없이 진행 가능하지만 차별화 근거가 약해진다고 한 줄 알림.
4. 사용자가 적지 않은 사실(수치·연혁·고객사)은 만들지 않는다. 기본값을 쓴 항목은 목록으로 알려준다.

## 3. 정리본 저장 (`docs/brief/brief.json`)
```json
{
  "name": "", "name_latin": "", "slug": "",
  "state": { "logo": "new", "type": "new", "palette": "new" },
  "sources": { "logo": "", "type": "", "palette": "" },
  "sets": 3, "langs": ["ko"], "numbers": false, "site": "",
  "sector": "", "audience": "", "attributes": [], "competitors": [], "likes": "",
  "tagline": "", "sentence": { "ko": "" }, "nav": [], "cta": "",
  "services": [{ "title": "", "body": "" }], "about": [],
  "contact": { "phone": "", "email": "", "address": "", "hours": "" },
  "business": { "ceo": "", "registration": "" },
  "ops": { "domain": "", "hosting": "", "owner": "" }
}
```
매핑: 새로→`new`, 다듬기→`refresh`, 유지→`keep`, 없음→`none`. 한국어→`ko`, 영어→`en`.
`slug`는 영문 소문자-하이픈(영문 표기가 없으면 로마자 표기). 영어를 쓰면 `sentence.en`도 사용자에게 받거나 번역안을 확인받는다.

## 4. 넘기기
1. **site.json 채우기** (site-edit 규칙): name, tagline(B1), description(B2 기반, 사실만), nav(B3, href는 기존 구조 유지),
   hero.title/body, hero.cta·cta.button 라벨(B4), services(B5), about.paragraphs(B6), contact, business.
   비어 있는 값은 `TODO:` 그대로 둔다. `npm --prefix site run verify` 실행.
2. **brand-identity init 명령** 조립 후 실행 (작업 폴더 `brand-work/<slug>`):
```bash
python .claude/skills/brand-identity/scripts/brand.py init "<name>" --root brand-work \
  --sets 3 --langs ko --doc-lang ko [--numbers] [--site URL] \
  --state logo=new --state type=new --state palette=new [--source logo=PATH] \
  --sector "<A4>" --audience "<A5>" --attributes "a,b,c" --competitors "x,y,z" \
  --tagline "<B1>" --sentence ko="<B2>" --nav "회사소개,서비스,소식,문의" --cta "<B4>"
```
   `--root`의 정확한 의미와 생성 폴더는 `init --help`와 출력으로 확인하고, 실제 작업 폴더 경로를 brief.json에 `work`로 기록한다.
   `--doc-lang ko`: 카드·보드의 고정 라벨은 영어로 나올 수 있다(스킬이 en/tr만 번역 제공). 자유 텍스트(시안 이름·설명)는 한국어로 쓴다.
3. `docs/maintenance-log.md`에 "브랜드" 항목(질문지 접수, 기본값 쓴 항목) 기록.
4. brand-identity 스킬의 §2 2단계(참고 문서 읽기)부터 이어서 진행한다. 시안 선택은 반드시 사용자가 한다.

## 재사용
브랜드 리뉴얼·정보 변경 때는 기존 질문지를 고쳐 쓰게 하고, 바뀐 항목만 diff로 보여준 뒤 같은 절차를 반복한다
(init은 `--force`로 brief만 갱신).
