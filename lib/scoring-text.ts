// lib/scoring-text.ts — 判读文本映射与文案（移植自 prototype/scoring.js）
// chromacheck v1.9.0
import type { DeficiencyType, Overall, Severity, TestMode } from './types';
import { t, type DictKey, type Lang } from './i18n';

/** 判读标签键映射：值取自 lib/i18n 的 result.* 字典（zh / en） */
const TYPE_KEY: Record<Exclude<DeficiencyType, null>, DictKey> = {
  protanopia: 'result.type.protanopia',
  protanomaly: 'result.type.protanomaly',
  deuteranopia: 'result.type.deuteranopia',
  deuteranomaly: 'result.type.deuteranomaly',
  tritanopia: 'result.type.tritanopia',
  tritanomaly: 'result.type.tritanomaly',
  achromatopsia: 'result.type.achromatopsia',
};

const SEVERITY_KEY: Record<Exclude<Severity, null>, DictKey> = {
  mild: 'result.severity.mild',
  moderate: 'result.severity.moderate',
  severe: 'result.severity.severe',
};

const OVERALL_KEY: Record<Overall, DictKey> = {
  normal: 'result.overall.normal',
  suspected_deficiency: 'result.overall.suspected_deficiency',
  suspected_blindness: 'result.overall.suspected_blindness',
  inconclusive: 'result.overall.inconclusive',
};

const MODE_KEY: Record<TestMode, DictKey> = {
  quick: 'result.mode.quick',
  standard: 'result.mode.standard',
  advanced: 'result.mode.advanced',
  child: 'result.mode.child',
};

/**
 * 判读标签取文案。lang 缺省为中文（保持既有存储结果与 CSV 导出稳定）；
 * 界面展示处应传入当前语言（见 ResultSummary / history 等 useLang 调用方）。
 */
export const uiText = {
  type: (v: DeficiencyType, lang: Lang = 'zh') => (v ? t(lang, TYPE_KEY[v]) : ''),
  severity: (v: Severity, lang: Lang = 'zh') => (v ? t(lang, SEVERITY_KEY[v]) : ''),
  overall: (v: Overall, lang: Lang = 'zh') => t(lang, OVERALL_KEY[v]),
  mode: (v: TestMode, lang: Lang = 'zh') => t(lang, MODE_KEY[v]),
};
