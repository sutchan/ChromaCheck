// lib/i18n/en-ui.ts — English UI dictionary (mirrors zh-ui keys)
// chromacheck v1.11.1
import { EN_UI_TEST } from './en-ui.test';
import { EN_UI_RESULT } from './en-ui.result';
import { EN_UI_GUIDE } from './en-ui.guide';

type UiKey = keyof typeof import('./zh-ui').ZH_UI;

export const EN_UI: Record<UiKey, string> = {
  ...EN_UI_TEST,
  ...EN_UI_RESULT,
  ...EN_UI_GUIDE,
};
