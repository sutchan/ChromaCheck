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

/** 文章的展示字段按当前语言取值；英文字段缺失时回退中文。 */
export function localizeArticle(a: Article, lang: Lang): LocalizedArticle {
  const en = lang === 'en';
  return {
    title: en ? a.titleEn : a.title,
    cat: en ? a.catEn : a.cat,
    read: en ? a.readEn : a.read,
    excerpt: en ? a.excerptEn : a.excerpt,
  };
}

/** 正文章节按当前语言取值；小标题缺失英文时回退中文。 */
export function localizeSection(s: LearnSection, lang: Lang): { h?: string; p: string } {
  const en = lang === 'en';
  return {
    h: s.h ? (en ? s.hEn ?? s.h : s.h) : undefined,
    p: en ? s.pEn : s.p,
  };
}
