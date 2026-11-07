// lib/i18n/tw-ui.ts — 繁体中文（台湾）字典（由 zh-ui 转换，v1.15.0 新增）
// chromacheck v1.15.0
import { TW_UI_TEST } from './tw-ui.flow';
import { TW_UI_RESULT } from './tw-ui.result';
import { TW_UI_GUIDE } from './tw-ui.guide';

export const TW_UI = {
  ...TW_UI_TEST,
  ...TW_UI_RESULT,
  ...TW_UI_GUIDE,
} as const;
