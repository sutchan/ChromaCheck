// lib/advanced-scoring.ts — 进阶版三模块联合判读（v1.3）
// chromacheck v1.3.0
import type {
  AnswerRecord,
  DeficiencyType,
  HueArrangementResult,
  IshiharaResult,
  Overall,
  PathTrackingQuestion,
  PathTrackingResult,
  Severity,
  TestResult,
} from './types';
import { TES_MILD } from './hue-scoring';

/** 路径追踪单题通过阈值（与 lib/path-scoring.ts 一致） */
const PATH_PASS = 70;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** 进阶模块单独异常时的类型推断（色相排列优先，其次路径追踪 targets） */
function typeFromAdvanced(
  hue: HueArrangementResult,
  pathResults: PathTrackingResult[],
  pathQuestions: PathTrackingQuestion[],
): DeficiencyType {
  if (!hue.normal) {
    return hue.deviationDirection === 'tritan'
      ? 'tritanomaly'
      : hue.totalErrorScore >= TES_MILD
        ? 'deuteranopia'
        : 'deuteranomaly';
  }
  let protanFail = 0;
  let deutanFail = 0;
  pathResults.forEach((r, i) => {
    if (!r.passed) {
      const t = pathQuestions[i]?.targets ?? [];
      if (t.includes('protan')) protanFail++;
      if (t.includes('deutan')) deutanFail++;
    }
  });
  return protanFail > deutanFail ? 'protanomaly' : 'deuteranomaly';
}

function advAbnormalText(hueAbnormal: boolean, pathAbnormal: boolean, hue: HueArrangementResult, pathAvg: number): string {
  const parts: string[] = [];
  if (pathAbnormal) parts.push(`路径追踪（平均重合度 ${pathAvg}%）`);
  if (hueAbnormal) parts.push(`色相排列（TES ${hue.totalErrorScore}）`);
  return parts.join('与');
}

/** 由三模块结果汇总为完整 TestResult（联合判读） */
export function computeAdvancedResult(inputs: {
  ishihara: IshiharaResult;
  answers: AnswerRecord[];
  pathResults: PathTrackingResult[];
  pathQuestions: PathTrackingQuestion[];
  hueResult: HueArrangementResult;
  opts: { startedAt: number; endedAt: number; device: string };
}): TestResult {
  const { ishihara, answers, pathResults, pathQuestions, hueResult, opts } = inputs;
  const pathAvg = pathResults.length
    ? Math.round(pathResults.reduce((s, r) => s + r.overlapScore, 0) / pathResults.length)
    : 0;
  const pathAbnormal = pathResults.some((r) => !r.passed);
  const hueAbnormal = !hueResult.normal;
  const advAbnormal = pathAbnormal || hueAbnormal;

  let overall: Overall = ishihara.overall;
  let type: DeficiencyType = ishihara.type;
  let severity: Severity = ishihara.severity;
  let confidence = ishihara.confidence;
  let crossNote = '';

  if (overall === 'normal') {
    if (advAbnormal) {
      // 石原氏未见异常，进阶模块提示偏差 → 降级为疑似色弱
      overall = 'suspected_deficiency';
      type = typeFromAdvanced(hueResult, pathResults, pathQuestions);
      severity = 'mild';
      confidence = 70;
      crossNote = `石原氏图版未见异常，但${advAbnormalText(hueAbnormal, pathAbnormal, hueResult, pathAvg)}提示辨色偏差，综合判读倾向疑似色弱。`;
    } else {
      confidence = clamp(confidence + 4, 0, 98);
      crossNote = '三模块结果交叉验证一致，未见明显色觉异常。';
    }
  } else if (overall === 'inconclusive') {
    if (advAbnormal) {
      overall = 'suspected_deficiency';
      type = typeFromAdvanced(hueResult, pathResults, pathQuestions);
      severity = 'mild';
      confidence = 65;
      crossNote = `石原氏作答样本不足，${advAbnormalText(hueAbnormal, pathAbnormal, hueResult, pathAvg)}提示辨色偏差，结果倾向疑似色弱。`;
    }
  } else if (advAbnormal) {
    // 石原氏异常且进阶模块方向一致 → 置信度上调
    confidence = clamp(confidence + 8, 0, 98);
    crossNote = `路径追踪与色相排列的偏差与石原氏结果方向一致（平均重合度 ${pathAvg}%，TES ${hueResult.totalErrorScore}），置信度上调。`;
  } else {
    crossNote = '进阶模块（路径追踪 / 色相排列）未见明显偏差，与石原氏结果存在分歧，建议间隔一段时间后复查确认。';
  }

  const t = type ? `${type.includes('protan') ? '红色觉' : type.includes('deutan') ? '绿色觉' : '蓝色觉'}异常` : '';
  const s = severity === 'mild' ? '（轻度）' : severity === 'moderate' ? '（中度）' : severity === 'severe' ? '（重度）' : '';
  const analysis =
    overall === 'normal'
      ? `进阶联合检测（石原氏 24 题 + 路径追踪 + 色相排列）${crossNote}在线筛查不能替代专业眼科检查，如仍有疑虑请就医复查。`
      : overall === 'inconclusive'
        ? `进阶联合检测${crossNote}建议调整环境光线后重新检测。`
        : `三模块联合判读提示${t}${s}。${crossNote}这可能影响相关色彩的日常辨色表现，建议在职业选择与安全场景中多加留意，必要时前往正规医院眼科复查。`;
  const confidenceNote = `联合判读：石原氏置信度 ${ishihara.confidence}%，路径追踪平均重合度 ${pathAvg}%，色相排列 TES ${hueResult.totalErrorScore}。`;

  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `cc-${Date.now()}`,
    schema: 'cc.result/v1',
    version: '1.0.0',
    createdAt: new Date(opts.endedAt).toISOString(),
    testMode: 'advanced',
    overall,
    type,
    severity,
    confidence,
    durationMs: Math.max(0, opts.endedAt - opts.startedAt),
    answers,
    ishihara,
    pathTracking: pathResults,
    hueArrangement: hueResult,
    analysis,
    confidenceNote,
    device: opts.device,
  };
}
