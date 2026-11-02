// lib/i18n/zh-ui.ts — 中文界面字典（合并子模块：检测流程 / 结果·报告·历史 / 指引·科普·离线·画布）
// chromacheck v1.11.1
import { ZH_UI_TEST } from './zh-ui.flow';
import { ZH_UI_RESULT } from './zh-ui.result';
import { ZH_UI_GUIDE } from './zh-ui.guide';

export const ZH_UI = {
  ...ZH_UI_TEST,
  ...ZH_UI_RESULT,
  ...ZH_UI_GUIDE,
} as const;
