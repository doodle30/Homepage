import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 배포 주소는 환경변수로 받는다 (tools/pages-build.mjs 가 deploy.json 을 읽어 넣음).
// 로컬 개발·verify 는 기본값(루트 경로)으로 돈다.
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', ko: 'ko' } },
    }),
  ],
});
