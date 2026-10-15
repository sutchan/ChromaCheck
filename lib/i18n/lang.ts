// lib/i18n/lang.ts — 语言常量（zh / en）
// chromacheck v1.9.0

export type Lang = 'zh' | 'en';

export const LANGS: Lang[] = ['zh', 'en'];
export const DEFAULT_LANG: Lang = 'zh';
export const LANG_STORAGE_KEY = 'cc.lang.v1';

export const LANG_LABEL: Record<Lang, string> = { zh: '中文', en: 'EN' };
