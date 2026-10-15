// lib/i18n/dict.ts — 字典合并、键集合与查表
// chromacheck v1.9.0
import type { Lang } from './lang';
import { ZH_CORE } from './zh-core';
import { ZH_UI } from './zh-ui';
import { ZH_RESULT } from './zh-result';
import { EN_CORE } from './en-core';
import { EN_UI } from './en-ui';
import { EN_RESULT } from './en-result';

/** 中文为基准语言：键集合由中文字典派生，新增文案只需改中文字典 */
export const ZH = { ...ZH_CORE, ...ZH_UI, ...ZH_RESULT } as const;

export type DictKey = keyof typeof ZH;
export type Dict = Record<DictKey, string>;

export const DICTS: Record<Lang, Dict> = {
  zh: ZH,
  en: { ...EN_CORE, ...EN_UI, ...EN_RESULT },
};
