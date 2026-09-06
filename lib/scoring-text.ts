// lib/scoring-text.ts — 判读文本映射与文案（移植自 prototype/scoring.js）
// chromacheck v1.7.2
import type { DeficiencyType, Overall, Severity, TestMode } from './types';

const TYPE_TEXT: Record<string, string> = {
  protanopia: '红色盲',
  protanomaly: '红色弱',
  deuteranopia: '绿色盲',
  deuteranomaly: '绿色弱',
  tritanopia: '蓝色盲',
  tritanomaly: '蓝色弱',
  achromatopsia: '全色盲',
};

const SEVERITY_TEXT: Record<string, string> = { mild: '轻度', moderate: '中度', severe: '重度' };

const OVERALL_LABEL: Record<Overall, string> = {
  normal: '色觉正常',
  suspected_deficiency: '疑似色弱',
  suspected_blindness: '疑似色盲',
  inconclusive: '结果不确定',
};

const MODE_TEXT: Record<TestMode, string> = { quick: '快速版', standard: '标准版', advanced: '进阶版' };

export const uiText = {
  type: (t: DeficiencyType) => (t ? TYPE_TEXT[t] : ''),
  severity: (s: Severity) => (s ? SEVERITY_TEXT[s] : ''),
  overall: (o: Overall) => OVERALL_LABEL[o],
  mode: (m: TestMode) => MODE_TEXT[m],
};
