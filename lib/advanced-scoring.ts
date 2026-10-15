// lib/advanced-scoring.ts — 进阶版三模块联合判读（v1.3）
// chromacheck v1.9.0
import type {
  AnswerRecord,
  DeficiencyType,
  HueArrangementResult,
  IshiharaResult,
  Overall,
  PathTrackingQuestion,
  PathTrackingResult,
  Scene,
  Severity,
  TestResult,
} from './types';
import { TES_MILD } from './hue-scoring';
import { t, type Lang } from './i18n';

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

function advAbnormalText(
  lang: Lang,
  hueAbnormal: boolean,
  pathAbnormal: boolean,
  hue: HueArrangementResult,
  pathAvg: number,
): string {
  const parts: string[] = [];
  if (pathAbnormal) parts.push(t(lang, 'analysis.advModulePath', { avg: pathAvg }));
  if (hueAbnormal) parts.push(t(lang, 'analysis.advModuleHue', { tes: hue.totalErrorScore }));
  return parts.join(t(lang, 'analysis.advJoin'));
}

/** 由三模块结果汇总为完整 TestResult（联合判读） */
export function computeAdvancedResult(inputs: {
  ishihara: IshiharaResult;
  answers: AnswerRecord[];
  pathResults: PathTrackingResult[];
  pathQuestions: PathTrackingQuestion[];
  hueResult: HueArrangementResult;
  opts: { startedAt: number; endedAt: number; device: string; scene?: Scene; lang?: Lang };
}): TestResult {
  const { ishihara, answers, pathResults, pathQuestions, hueResult, opts } = inputs;
  const lang = opts.lang ?? 'zh';
  const pathAvg = pathResults.length
    ? Math.round(pathResults.reduce((s, r) => s + r.overlapScore, 0) / pathResults.length)
    : 0;
  const pathAbnormal = pathResults.some((r) => !r.passed);
  const hueAbnormal = !hueResult.normal;
  const advAbnormal = pathAbnormal || hueAbnormal;

  let overall: Overall = ishihara.overall;
  let type: DeficiencyType = ishihara.type;
  let severity: Severity = ishihara.severity;
  // confidence 为内部质量估计（多模块交叉调权的经验值），并非统计置信度；UI 标注为“判读稳定性（内部估计）”。
  let confidence = ishihara.confidence;
  let crossNote = '';

  if (overall === 'normal') {
    if (advAbnormal) {
      // 石原氏未见异常，进阶模块提示偏差 → 降级为疑似色弱
      overall = 'suspected_deficiency';
      type = typeFromAdvanced(hueResult, pathResults, pathQuestions);
      severity = 'mild';
      confidence = 70;
      crossNote = t(lang, 'analysis.advCross', {
        modules: advAbnormalText(lang, hueAbnormal, pathAbnormal, hueResult, pathAvg),
      });
    } else {
      confidence = clamp(confidence + 4, 0, 98);
      crossNote = t(lang, 'analysis.advNormalConsistent');
    }
  } else if (overall === 'inconclusive') {
    if (advAbnormal) {
      overall = 'suspected_deficiency';
      type = typeFromAdvanced(hueResult, pathResults, pathQuestions);
      severity = 'mild';
      confidence = 65;
      crossNote = t(lang, 'analysis.advInconclusive', {
        modules: advAbnormalText(lang, hueAbnormal, pathAbnormal, hueResult, pathAvg),
      });
    }
  } else if (advAbnormal) {
    // 石原氏异常且进阶模块方向一致 → 置信度上调
    confidence = clamp(confidence + 8, 0, 98);
    crossNote = t(lang, 'analysis.advAligned', { avg: pathAvg, tes: hueResult.totalErrorScore });
  } else {
    crossNote = t(lang, 'analysis.advDivergent');
  }

  const tLabel = type
    ? t(
        lang,
        type.includes('protan')
          ? 'analysis.axisLabelProtan'
          : type.includes('deutan')
            ? 'analysis.axisLabelDeutan'
            : 'analysis.axisLabelTritan',
      )
    : '';
  const s =
    severity === 'mild'
      ? t(lang, 'analysis.sevMild')
      : severity === 'moderate'
        ? t(lang, 'analysis.sevModerate')
        : severity === 'severe'
          ? t(lang, 'analysis.sevSevere')
          : '';
  const analysis =
    overall === 'normal'
      ? `${t(lang, 'analysis.advPrefix')}${crossNote}${t(lang, 'analysis.advSuffix')}`
      : overall === 'inconclusive'
        ? `${t(lang, 'analysis.advPrefix')}${crossNote}${t(lang, 'analysis.advRetry')}`
        : t(lang, 'analysis.advAbnormal', { t: tLabel, s, cross: crossNote });
  const confidenceNote = t(lang, 'analysis.advNote', {
    i: ishihara.confidence,
    a: pathAvg,
    h: hueResult.totalErrorScore,
  });

  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `cc-${Date.now()}`,
    schema: 'cc.result/v1',
    version: '1.9.0', // 结果结构版本；解析方应对未知字段保持兼容（向后兼容）
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
    scene: opts.scene ?? 'general',
  };
}
