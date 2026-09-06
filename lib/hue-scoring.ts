// lib/hue-scoring.ts — 色相排列（D15）判读（v1.2）
// chromacheck v1.7.1
import type {
  DeficiencyType,
  HueArrangementQuestion,
  HueArrangementResult,
  Overall,
  Severity,
  TestMode,
  TestResult,
} from './types';

/** TES 判读阈值：< 20 正常；20–40 轻度偏差；> 40 明显偏差 */
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
 * 偏差方向启发式：
 * 蓝黄向（tritan）混淆压缩蓝-青-绿弧（卡号 ≤ 5），红绿向（protan/deutan）压缩绿-红弧。
 * D-15 排列本身难以稳定区分 protan / deutan，红绿向偏差按最常见的 deutan 报告，
 * 不作为临床分型依据。
 */
function deviationAxis(order: number[], errs: number[]): 'protan' | 'deutan' | 'tritan' {
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
  opts: { testMode: TestMode; startedAt: number; endedAt: number; device: string },
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

  const confidence = tes < TES_NORMAL ? 88 : clamp(Math.round(90 - tes * 0.6), 55, 85);
  const analysis =
    overall === 'normal'
      ? '色相排列中你按正确的色彩渐变顺序排好了全部色卡，辨色精度未见明显异常。在线筛查不能替代专业眼科检查，如仍有疑虑请就医复查。'
      : `色相排列 TES 为 ${tes}，部分色卡顺序偏离正确渐变，提示辨色精度可能下降（偏差方向偏向${hueResult.deviationDirection === 'tritan' ? '蓝黄向' : '红绿向'}）。建议留意职业体检要求，必要时前往正规医院眼科复查。`;
  const confidenceNote = `基于单组 D15 排列：TES ${tes}（< ${TES_NORMAL} 正常，${TES_NORMAL}–${TES_MILD} 轻度，> ${TES_MILD} 明显）。`;

  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `cc-${Date.now()}`,
    schema: 'cc.result/v1',
    version: '1.0.0',
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
