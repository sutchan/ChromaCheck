// lib/scoring.ts — 判读引擎（移植自 prototype/scoring.js，纯函数）
// chromacheck v1.3.0
import type {
  AnswerRecord,
  DeficiencyType,
  IshiharaResult,
  Question,
  Overall,
  Severity,
  TestMode,
  TestResult,
} from './types';

const RULES = {
  confidence: { base: 100, demoWrong: -25, tooFast: -2, contradiction: -15, lowCoverage: -20, min: 0 },
  vanishing: { mild: 2, blind: 4 },
};

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

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function isCorrect(q: Question, userAnswer: string): boolean {
  const ua = (userAnswer || '').trim();
  if (q.type === 'hidden') return ua === '';
  if (ua === '') return false;
  return ua === q.answer;
}

function matches(q: Question, ua: string, axis: 'protan' | 'deutan'): boolean {
  const alt = axis === 'protan' ? q.protan : q.deutan;
  if (!alt) return false;
  return (ua || '').trim() === alt;
}

export function scoreIshihara(answers: AnswerRecord[], questions: Question[]): IshiharaResult {
  const map: Record<string, AnswerRecord> = {};
  answers.forEach((a) => (map[a.questionId] = a));

  const total = questions.length;
  let correct = 0;
  let vanishWrong = 0;
  let vanishTotal = 0;
  let hiddenRight = 0;
  let hiddenTotal = 0;
  let protanHit = 0;
  let deutanHit = 0;
  let fastCount = 0;
  let demoWrong = 0;
  let answered = 0;

  questions.forEach((q) => {
    const rec = map[q.id];
    if (!rec) return;
    answered++;
    const ua = rec.userAnswer || '';
    const ok = isCorrect(q, ua);
    if (ok) correct++;

    if (rec.durationMs > 0 && rec.durationMs < 1000) fastCount++;
    if (q.type === 'demonstration' && !ok) demoWrong++;
    if (q.type === 'vanishing') {
      vanishTotal++;
      if (!ok) vanishWrong++;
    }
    if (q.type === 'hidden') {
      hiddenTotal++;
      if (ua.trim() !== '') hiddenRight++;
    }
    if (q.type === 'transformation' || q.type === 'classification') {
      if (matches(q, ua, 'protan')) protanHit++;
      if (matches(q, ua, 'deutan')) deutanHit++;
    }
  });

  const wrong = Math.max(total - correct, 0);
  const base = Math.round(Math.min(100, (wrong / Math.max(total, 1)) * 130));
  const dimensions = {
    protan: clamp(base + protanHit * 8 - deutanHit * 3, 0, 100),
    deutan: clamp(base + deutanHit * 8 - protanHit * 3, 0, 100),
    tritan: clamp(Math.round(base * 0.35), 0, 100),
  };

  let overall: Overall = 'normal';
  if (answered < total * 0.5) overall = 'inconclusive';
  else if (vanishWrong >= 4 || wrong >= 8) overall = 'suspected_blindness';
  else if (vanishWrong >= 2 || wrong >= 4 || hiddenRight >= Math.ceil(hiddenTotal / 2))
    overall = 'suspected_deficiency';
  if (demoWrong > 0 && protanHit === 0 && deutanHit === 0 && wrong < 4) overall = 'inconclusive';

  let type: DeficiencyType = null;
  let severity: Severity = null;
  if (overall === 'suspected_deficiency' || overall === 'suspected_blindness') {
    if (deutanHit >= protanHit) type = overall === 'suspected_blindness' ? 'deuteranopia' : 'deuteranomaly';
    else type = overall === 'suspected_blindness' ? 'protanopia' : 'protanomaly';
    const rate = wrong / Math.max(total, 1);
    severity = rate >= 0.7 ? 'severe' : rate >= 0.4 ? 'moderate' : 'mild';
  }

  const R = RULES.confidence;
  let confidence = R.base + demoWrong * R.demoWrong + fastCount * R.tooFast;
  if (protanHit > 0 && deutanHit > 0) confidence += R.contradiction;
  if (answered < total * 0.5) confidence += R.lowCoverage;
  confidence = clamp(confidence, R.min, 100);

  const patterns: IshiharaResult['details']['errorPatterns'] = [];
  if (deutanHit)
    patterns.push({ type: 'deutan', questionCount: deutanHit, description: `转换/分类题中 ${deutanHit} 题答案符合绿色觉异常典型表现` });
  if (protanHit)
    patterns.push({ type: 'protan', questionCount: protanHit, description: `转换/分类题中 ${protanHit} 题答案符合红色觉异常典型表现` });
  if (vanishWrong)
    patterns.push({ type: 'mixed', questionCount: vanishWrong, description: `消失题中有 ${vanishWrong} 题未能读出数字` });
  if (!patterns.length)
    patterns.push({ type: 'random', questionCount: 0, description: '未发现稳定的错误模式' });

  return {
    overall,
    type,
    severity,
    confidence,
    dimensions,
    details: { correctCount: correct, totalCount: total, errorPatterns: patterns },
  };
}

function buildAnalysis(result: IshiharaResult, mode: TestMode): { analysis: string; confidenceNote: string } {
  const { overall, type, severity, confidence, details } = result;
  const note = `基于 ${details.correctCount}/${details.totalCount} 题作答，综合置信度 ${confidence}%。`;
  let analysis = '';
  if (overall === 'normal') {
    analysis = '本次筛查未检出明显色觉异常。在线筛查不能替代专业眼科检查，如在日常生活中仍感辨色困难，建议就医复查。';
  } else if (overall === 'inconclusive') {
    analysis = '本次作答样本不足，或演示题出现明显误读，结果暂不确定。建议调整环境光线后重新检测，确保每题都看清再作答。';
  } else {
    const t = type ? TYPE_TEXT[type] : '色觉异常';
    const s = severity ? SEVERITY_TEXT[severity] : '';
    const isBlindness = type && type.endsWith('opia');
    const clarify = isBlindness
      ? '需注意：色盲与色弱性质不同，本次属「色盲」范畴。'
      : '需注意：色弱（异常三色视觉）与色盲（二色视觉）不同，法规通常仅限制色盲，色弱一般不影响驾驶资格，但以体检机构结论为准。';
    analysis = `你的结果提示${t}${s ? `（${s}）` : ''}。在转换题与分类题中，部分答案与${t}的典型表现一致；消失题中也有数字难以辨认的情况。这可能影响对红/绿相关色彩的区分，建议在职业选择与日常安全场景中多加留意。${clarify}`;
  }
  return { analysis: `${uiText.mode(mode)} · ${analysis}`, confidenceNote: note };
}

export function computeResult(
  answers: AnswerRecord[],
  questions: Question[],
  opts: { testMode: TestMode; startedAt: number; endedAt: number; device: string; scene?: import('./types').Scene },
): TestResult {
  const ishihara = scoreIshihara(answers, questions);
  const { analysis, confidenceNote } = buildAnalysis(ishihara, opts.testMode);
  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `cc-${Date.now()}`,
    schema: 'cc.result/v1',
    version: '1.0.0',
    createdAt: new Date(opts.endedAt).toISOString(),
    testMode: opts.testMode,
    overall: ishihara.overall,
    type: ishihara.type,
    severity: ishihara.severity,
    confidence: ishihara.confidence,
    durationMs: Math.max(0, opts.endedAt - opts.startedAt),
    answers,
    ishihara,
    analysis,
    confidenceNote,
    device: opts.device,
    scene: opts.scene ?? 'general',
  };
}
