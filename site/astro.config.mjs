import { defineConfig } from 'astro/config';

// TODO: 도메인이 정해지면 site: 'https://example.co.kr' 를 넣고 @astrojs/sitemap 을 추가한다.
export default defineConfig({
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
