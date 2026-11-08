import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 소식 글: src/content/news/<lang>/YYYY-MM-DD-slug.md
// 같은 글의 영어·한국어 버전은 frontmatter key 를 같게 두면 주소가 짝이 된다 (/news/x ↔ /ko/news/x).
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    lang: z.enum(['en', 'ko']).default('en'),
    key: z.string().optional(), // 번역 짝 키 (slug 라는 이름은 Astro 가 entry id 로 써서 언어끼리 충돌함)
    draft: z.boolean().default(false),
  }),
});

// 법적 고지문(개인정보처리방침 등): src/content/legal/<lang>/<이름>.md
// 본문은 사용자가 승인한 원문 HTML 그대로 둔다(문장·표 수정 금지). 페이지는 src/views/LegalDoc.astro.
const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['en', 'ko']).default('ko'),
    // 본문 아래에 둘 링크(예: 영어 안내 → 한국어 원문). 주소는 url() 로 만든다.
    link: z.object({ label: z.string(), path: z.string(), locale: z.enum(['en', 'ko']) }).optional(),
  }),
});

export const collections = { news, legal };
