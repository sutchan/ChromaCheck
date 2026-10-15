// lib/hue-scoring.ts — 色相排列（D15）判读（v1.2）
// chromacheck v1.9.0
import type {
  DeficiencyType,
  HueArrangementQuestion,
  HueArrangementResult,
  Overall,
  Severity,
  TestMode,
  TestResult,
} from './types';
import { t, type Lang } from './i18n';

/**
 * TES 判读阈值（借自 Kinnear 经验值，适配本项目的 sRGB 15 卡模拟）：
 * < 20 正常；20–40 轻度偏差；> 40 明显偏差。
 * 注意：该阈值尚未用本地样本标定，仅作筛查参考，不作临床分型依据。
 */
const TES_NORMAL = 20;
export const TES_MILD = 40;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** 由用户排列（可移动卡索引序列）计算相邻位置误差 */
function capErrors(order: number[]): number[] {
  const seq = [0, ...order, 14];
  const errs: number[] = [];
  for (let i = 0; i < seq.length - 1; i++) {
    const d = Math.abs(seq[i] - seq[i + 1]);
    // 首末相邻（与固定参考卡相接）权重 1，中间相邻权重 2
    const e = i === 0 || i === seq.length - 2 ? Math.max(0, d - 1) : Math.max(0, d - 1) * 2;
    errs.push(e);
  }
  return errs;
}

/**
 * 偏差方向启发式（仅红绿向 / 蓝黄向两级）：
 * 蓝黄向（tritan）混淆压缩蓝-青-绿弧（卡号 ≤ 5），红绿向压缩绿-红弧。
 * D-15 排列无法稳定区分 protan / deutan，红绿向偏差统一归为 deutan（最常见），
 * 本函数不输出 protan；若需红绿向细分，应结合石原氏与路径追踪交叉判读
 * （见 advanced-scoring.ts 的 typeFromAdvanced）。结果不作为临床分型依据。
 */
function deviationAxis(order: number[], errs: number[]): 'deutan' | 'tritan' {
  const seq = [0, ...order, 14];
  let redGreen = 0;
  let blueYellow = 0;
  for (let i = 0; i < seq.length - 1; i++) {
    if (Math.min(seq[i], seq[i + 1]) <= 5) blueYellow += errs[i];
    else redGreen += errs[i];
  }
  return redGreen >= blueYellow ? 'deutan' : 'tritan';
}

/** 对一次排列评分（不含 questionId） */
function scoreHueArrangement(order: number[]): Omit<HueArrangementResult, 'questionId'> {
  const cardErrors = capErrors(order);
  const totalErrorScore = cardErrors.reduce((s, e) => s + e, 0);
  const normal = totalErrorScore < TES_NORMAL;
  return {
    order,
    totalErrorScore,
    cardErrors,
    deviationDirection: normal ? 'none' : deviationAxis(order, cardErrors),
    normal,
  };
}

export function scoreHueQuestion(q: HueArrangementQuestion, order: number[]): HueArrangementResult {
  return { questionId: q.id, ...scoreHueArrangement(order) };
}

/** 由色相排列结果汇总为完整 TestResult（ishihara / pathTracking 字段留空） */
export function computeHueResult(
  hueResult: HueArrangementResult,
  opts: { testMode: TestMode; startedAt: number; endedAt: number; device: string; lang?: Lang },
): TestResult {
  const tes = hueResult.totalErrorScore;
  const overall: Overall = tes < TES_NORMAL ? 'normal' : 'suspected_deficiency';

  let type: DeficiencyType = null;
  let severity: Severity = null;
  if (overall !== 'normal') {
    if (hueResult.deviationDirection === 'tritan') type = 'tritanomaly';
    else type = tes >= TES_MILD ? 'deuteranopia' : 'deuteranomaly';
    severity = tes >= TES_MILD ? 'moderate' : 'mild';
  }

  // confidence 为内部质量估计（基于 TES 的线性映射），并非统计置信度；UI 已标注“判读稳定性（内部估计）”。
  const confidence = tes < TES_NORMAL ? 88 : clamp(Math.round(90 - tes * 0.6), 55, 85);
  const lang = opts.lang ?? 'zh';
  const dir = t(lang, hueResult.deviationDirection === 'tritan' ? 'analysis.dirTritan' : 'analysis.dirDeutan');
  const analysis =
    overall === 'normal'
      ? t(lang, 'analysis.hueNormal')
      : t(lang, 'analysis.hueAbnormal', { tes, dir });
  const confidenceNote = t(lang, 'analysis.hueNote', { tes, n: TES_NORMAL, m: TES_MILD });

  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `cc-${Date.now()}`,
    schema: 'cc.result/v1',
    version: '1.9.0', // 结果结构版本；解析方应对未知字段保持兼容（向后兼容）
    createdAt: new Date(opts.endedAt).toISOString(),
    testMode: opts.testMode,
    overall,
    type,
    severity,
    confidence,
    durationMs: Math.max(0, opts.endedAt - opts.startedAt),
    answers: [],
    ishihara: undefined,
    pathTracking: undefined,
    hueArrangement: hueResult,
    analysis,
    confidenceNote,
    device: opts.device,
  };
}
