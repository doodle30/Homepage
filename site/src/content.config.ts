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

export const collections = { news };
