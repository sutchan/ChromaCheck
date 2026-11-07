// lib/i18n/lang.ts — 语言常量（zh 默认 > zh-TW > en，按 SPEC §9 语言优先级规范）
// chromacheck v1.15.0

export type Lang = 'zh' | 'zh-TW' | 'en';

/** 语言顺序即产品优先级：默认简体中文，第二繁体中文（台湾），第三英语 */
export const LANGS: Lang[] = ['zh', 'zh-TW', 'en'];
export const DEFAULT_LANG: Lang = 'zh';
export const LANG_STORAGE_KEY = 'cc.lang.v1';

/** 各语言以自身文字展示（语言切换按钮用） */
export const LANG_LABEL: Record<Lang, string> = {
  zh: '简体中文',
  'zh-TW': '繁體中文',
  en: 'English',
};

/** Lang → BCP 47 文档语言（html lang 属性用） */
export function htmlLang(lang: Lang): string {
  if (lang === 'en') return 'en';
  if (lang === 'zh-TW') return 'zh-TW';
  return 'zh-CN';
}
