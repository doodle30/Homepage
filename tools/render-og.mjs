#!/usr/bin/env node
// brand/og/og.html → site/public/og.png (1200x630) 를 설치된 Chrome/Edge 헤드리스로 렌더.
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) { console.error('Chrome/Edge 를 찾지 못함 (CHROME_PATH 로 지정)'); process.exit(1); }
const src = pathToFileURL(join(root, 'brand', 'og', 'og.html')).href;
const out = join(root, 'site', 'public', 'og.png');
const r = spawnSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1200,630', '--virtual-time-budget=5000', `--screenshot=${out}`, src], { stdio: 'inherit' });
if (r.status !== 0 || !existsSync(out)) process.exit(r.status || 1);
console.log('og:', out);
