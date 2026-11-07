// lib/i18n/dict.ts — 字典合并、键集合与查表
// chromacheck v1.15.0
import type { Lang } from './lang';
import { ZH_CORE } from './zh-core';
import { ZH_FAQ } from './zh-faq';
import { ZH_UI } from './zh-ui';
import { ZH_RESULT } from './zh-result';
import { TW_CORE } from './tw-core';
import { TW_FAQ } from './tw-faq';
import { TW_UI } from './tw-ui';
import { TW_RESULT } from './tw-result';
import { EN_CORE } from './en-core';
import { EN_FAQ } from './en-faq';
import { EN_UI } from './en-ui';
import { EN_RESULT } from './en-result';

/** 简体中文为基准语言：键集合由中文字典派生，新增文案只需改中文字典 */
export const ZH = { ...ZH_CORE, ...ZH_FAQ, ...ZH_UI, ...ZH_RESULT } as const;

export type DictKey = keyof typeof ZH;
export type Dict = Record<DictKey, string>;

export const DICTS: Record<Lang, Dict> = {
  zh: ZH,
  'zh-TW': { ...TW_CORE, ...TW_FAQ, ...TW_UI, ...TW_RESULT },
  en: { ...EN_CORE, ...EN_FAQ, ...EN_UI, ...EN_RESULT },
};
