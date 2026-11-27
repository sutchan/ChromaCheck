// components/learn/learn-locale.ts — 科普文章字段按语言取值（zh / en）
// chromacheck v1.9.0
import type { Article, LearnSection } from '@/lib/learn-data';
import type { Lang } from '@/lib/i18n';

export interface LocalizedArticle {
  title: string;
  cat: string;
  read: string;
  excerpt: string;
}

/** 文章的展示字段按当前语言取值；缺字段时回退简体中文。 */
export function localizeArticle(a: Article, lang: Lang): LocalizedArticle {
  if (lang === 'en') {
    return { title: a.titleEn, cat: a.catEn, read: a.readEn, excerpt: a.excerptEn };
  }
  if (lang === 'zh-TW') {
    return { title: a.titleTW, cat: a.catTW, read: a.readTW, excerpt: a.excerptTW };
  }
  return { title: a.title, cat: a.cat, read: a.read, excerpt: a.excerpt };
}

/** 正文章节按当前语言取值；缺字段时回退简体中文。 */
export function localizeSection(s: LearnSection, lang: Lang): { h?: string; p: string } {
  if (lang === 'en') return { h: s.h ? s.hEn ?? s.h : undefined, p: s.pEn };
  if (lang === 'zh-TW') return { h: s.h ? s.hTW ?? s.h : undefined, p: s.pTW };
  return { h: s.h, p: s.p };
}
