// 언어·주소 도우미. 모든 내부 링크와 정적 파일 경로는 여기를 거친다.
// - base: GitHub Pages 등 하위 경로 배포 (astro.config 의 SITE_BASE)
// - locale: 'en'(기본, 접두어 없음) / 'ko'(/ko 접두어)
import en from '../data/site.json';
import ko from '../data/site.ko.json';

export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const sites = { en, ko } as const;
export type Site = typeof en;

export function getSite(locale: Locale): Site {
  return sites[locale] as Site;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // '' 또는 '/Homepage'

const isExternal = (href: string) => /^(https?:|mailto:|tel:|#)/i.test(href);

/** 정적 파일(public/) 경로: asset('/logo.svg') → '/Homepage/logo.svg' */
export function asset(path: string): string {
  return isExternal(path) ? path : `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

/** 페이지 링크: url('/about', 'ko') → '/Homepage/ko/about' . 외부·mailto·# 는 그대로 */
export function url(path: string, locale: Locale = defaultLocale): string {
  if (isExternal(path)) return path;
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  const p = path.startsWith('/') ? path : `/${path}`;
  const joined = `${prefix}${p}`;
  return asset(joined === `/${locale}/` ? `/${locale}` : joined);
}

/** 현재 주소에서 base·언어 접두어를 뗀 경로: '/Homepage/ko/about/' → '/about' */
export function routeOf(pathname: string): string {
  let p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  for (const l of locales) if (l !== defaultLocale && (p === `/${l}` || p.startsWith(`/${l}/`))) p = p.slice(l.length + 1);
  p = p.replace(/\/$/, '');
  return p || '/';
}
