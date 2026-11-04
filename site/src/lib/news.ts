import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';

export type Post = CollectionEntry<'news'>;

/** 공개된(draft 아님) 해당 언어 글, 최신순 */
export async function getPosts(locale: Locale): Promise<Post[]> {
  const all = await getCollection('news', (p) => !p.data.draft && p.data.lang === locale);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 주소에 쓰는 이름: frontmatter key, 없으면 파일 이름(폴더 제외) */
export const slugOf = (p: Post) => p.data.key ?? p.id.split('/').pop()!;
