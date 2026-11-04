#!/usr/bin/env node
// 홈페이지 정적 점검. 사용: node tools/check-site.mjs [distDir] [srcDir] [--base /Homepage]
// --base: 하위 경로 배포 빌드를 점검할 때. 루트 상대 링크가 모두 이 경로로 시작해야 한다.
// 오류가 하나라도 있으면 종료 코드 1. 경고는 통과에 영향 없음.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, extname, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const bi = args.indexOf('--base');
const BASE = bi >= 0 ? args.splice(bi, 2)[1].replace(/\/$/, '') : '';
const dist = resolve(args[0] ?? join(root, 'site', 'dist'));
const src = resolve(args[1] ?? join(root, 'site', 'src'));

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where} — ${msg}`);
const warn = (where, msg) => warnings.push(`${where} — ${msg}`);

function walk(dir, exts) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p, exts));
    else if (!exts || exts.includes(extname(name))) out.push(p);
  }
  return out;
}
const rel = (p) => relative(root, p).replaceAll('\\', '/');

// ---------- 1. 빌드 결과(HTML) ----------
if (!existsSync(dist)) {
  err(rel(dist), '빌드 결과 폴더가 없음 (먼저 build)');
} else {
  const htmlFiles = walk(dist, ['.html']);
  if (htmlFiles.length === 0) err(rel(dist), 'HTML 파일이 없음');

  const resolveTarget = (fromFile, href) => {
    let clean = decodeURI(href.split('#')[0].split('?')[0]);
    if (!clean) return true; // 같은 페이지 앵커
    if (clean.startsWith('/') && BASE) {
      if (clean !== BASE && !clean.startsWith(BASE + '/')) return false; // base 경로 누락
      clean = clean.slice(BASE.length) || '/';
    }
    const base = clean.startsWith('/') ? join(dist, clean) : join(dirname(fromFile), clean);
    return [base, join(base, 'index.html'), base + '.html'].some((p) => existsSync(p) && statSync(p).isFile());
  };

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    const where = rel(file);

    if (!/<html[^>]*\slang="[^"]+"/i.test(html)) err(where, '<html lang> 없음');
    const title = html.match(/<title>([\s\S]*?)<\/title>/i);
    if (!title || !title[1].trim()) err(where, '<title> 비어 있음');
    if (!/<meta[^>]+name="description"[^>]+content="[^"]+"/i.test(html)) warn(where, 'meta description 없음');
    if (!/<meta[^>]+name="viewport"/i.test(html)) err(where, 'viewport meta 없음');
    if ((html.match(/<h1[\s>]/gi) || []).length !== 1) warn(where, `h1 개수 ${(html.match(/<h1[\s>]/gi) || []).length}개 (1개 권장)`);

    for (const img of html.match(/<img\b[^>]*>/gi) || []) {
      if (!/\salt=/i.test(img)) err(where, `이미지 alt 없음: ${img.slice(0, 80)}`);
      const s = img.match(/\ssrc="([^"]+)"/i)?.[1];
      if (s && !/^(https?:|data:)/.test(s) && !resolveTarget(file, s)) err(where, `이미지 파일 없음: ${s}`);
    }
    for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]*)"/gi)) {
      const href = m[1];
      if (/^(https?:|mailto:|tel:|javascript:|#)/i.test(href)) {
        if (/^javascript:/i.test(href)) warn(where, `javascript: 링크: ${href}`);
        if (/^tel:$|^mailto:$/i.test(href)) err(where, `빈 연락처 링크: ${href}`);
        continue;
      }
      if (!resolveTarget(file, href)) err(where, `깨진 내부 링크: ${href}`);
    }
    for (const m of html.matchAll(/<link\b[^>]*\srel="(?:icon|apple-touch-icon|stylesheet|sitemap)"[^>]*>/gi)) {
      const href = m[0].match(/\shref="([^"]+)"/i)?.[1];
      if (href && !/^https?:/i.test(href) && !resolveTarget(file, href)) err(where, `<link> 대상 파일 없음: ${href}`);
    }
    if (/TODO:/.test(html.replace(/<!--[\s\S]*?-->/g, ''))) warn(where, '페이지에 TODO: 문구가 보임');
  }
}

// ---------- 2. 소스 규칙 (토큰만 사용) ----------
const exempt = new Set(['styles/tokens.css', 'styles/fonts.css'].map((p) => join(src, p)));
const hexRe = /(?<![\w&/"'=#-])#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/gi;
const fnColorRe = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/gi;
const fontRe = /font-family\s*:\s*(?!\s*var\()(?!\s*inherit)[^;]+/gi;

for (const file of walk(src, ['.astro', '.css', '.scss', '.ts', '.js', '.mjs', '.tsx', '.jsx'])) {
  if (exempt.has(file)) continue;
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const where = `${rel(file)}:${i + 1}`;
    if (/check-site-ignore/.test(line)) return;
    for (const m of line.matchAll(hexRe)) err(where, `하드코딩 색 ${m[0]} → var(--bi-*) 사용`);
    for (const m of line.matchAll(fnColorRe)) {
      if (!/color-mix|var\(/.test(line)) err(where, `하드코딩 색 함수 ${m[0]}… → var(--bi-*) 사용`);
    }
    for (const m of line.matchAll(fontRe)) err(where, `하드코딩 폰트 "${m[0].trim()}" → var(--font-display|--font-text)`);
  });
}

// ---------- 2b. 공개 소식 글마다 페이지가 만들어졌는지 ----------
// (예: 두 언어 글이 같은 id 로 충돌해 한쪽이 사라지는 경우를 잡는다)
if (existsSync(dist)) {
  const newsDir = join(src, 'content', 'news');
  for (const file of walk(newsDir, ['.md', '.mdx'])) {
    const fm = (readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/) || [])[1] || '';
    const field = (k) => fm.match(new RegExp(`^${k}:\\s*["']?([^"'\\r\\n]+?)["']?\\s*$`, 'm'))?.[1];
    if (field('draft') === 'true') continue;
    const lang = field('lang') || 'en';
    const name = field('key') || file.replace(/\\/g, '/').split('/').pop().replace(/\.mdx?$/, '');
    const page = join(dist, ...(lang === 'en' ? [] : [lang]), 'news', name, 'index.html');
    if (!existsSync(page)) err(rel(file), `공개 글인데 페이지가 없음: ${rel(page)} (key/파일 이름 충돌?)`);
  }
}

// ---------- 3. 콘텐츠 TODO ----------
for (const file of walk(join(src, 'data'), ['.json']).concat(walk(join(src, 'content'), ['.md', '.mdx']))) {
  readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, i) => {
    if (line.includes('TODO:')) warn(`${rel(file)}:${i + 1}`, `채울 내용: ${line.trim().slice(0, 90)}`);
  });
}

// ---------- 보고 ----------
const show = (label, list) => {
  console.log(`\n${label} (${list.length})`);
  for (const x of list) console.log(`  - ${x}`);
};
show('오류', errors);
show('경고', warnings);
if (BASE) console.log(`\n(base 경로 ${BASE} 기준으로 점검)`);
console.log(`\n결과: ${errors.length ? '실패' : '통과'} — 오류 ${errors.length}, 경고 ${warnings.length}`);
process.exit(errors.length ? 1 : 0);
