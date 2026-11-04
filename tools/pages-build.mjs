#!/usr/bin/env node
// 배포용 빌드: site/deploy.json 의 url·base 로 astro build, --check 면 base 기준 점검까지.
// 사용: node tools/pages-build.mjs [--check]   (GitHub Actions 와 로컬 verify:pages 가 같이 씀)
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const siteDir = join(root, 'site');
const cfg = JSON.parse(readFileSync(join(siteDir, 'deploy.json'), 'utf8'));
const env = { ...process.env, SITE_URL: cfg.url, SITE_BASE: cfg.base };
const run = (cmd, args, cwd) => {
  const r = process.platform === "win32" ? spawnSync([cmd, ...args].map((a) => (/\s/.test(a) ? `"${a}"` : a)).join(" "), { cwd, env, stdio: "inherit", shell: true }) : spawnSync(cmd, args, { cwd, env, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

console.log(`배포 빌드: ${cfg.url}${cfg.base}`);
run('npx', ['astro', 'build'], siteDir);
if (process.argv.includes('--check')) {
  run('node', [join(root, 'tools', 'check-site.mjs'), join(siteDir, 'dist'), join(siteDir, 'src'), '--base', cfg.base], root);
}
