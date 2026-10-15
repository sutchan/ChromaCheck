// lib/scoring.ts — 判读引擎（移植自 prototype/scoring.js，纯函数）
// chromacheck v1.9.0
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
import { uiText } from './scoring-text';
import { t, type Lang } from './i18n';

export { uiText };

const RULES = {
  confidence: { base: 100, demoWrong: -25, tooFast: -2, contradiction: -15, lowCoverage: -20, min: 0 },
  vanishing: { mild: 2, blind: 4 },
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

export function scoreIshihara(answers: AnswerRecord[], questions: Question[], lang: Lang = 'zh'): IshiharaResult {
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
  const wrongRate = wrong / Math.max(answered, 1);
  if (answered < total * 0.5) overall = 'inconclusive';
  else if (vanishWrong >= 4 || wrongRate >= 0.6) overall = 'suspected_blindness';
  else if (
    vanishWrong >= 2 ||
    wrongRate >= 0.3 ||
    (hiddenTotal > 0 && hiddenRight >= Math.ceil(hiddenTotal / 2))
  )
    overall = 'suspected_deficiency';
  if (demoWrong > 0 && protanHit === 0 && deutanHit === 0 && wrongRate < 0.3) overall = 'inconclusive';

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
    patterns.push({ type: 'deutan', questionCount: deutanHit, description: t(lang, 'analysis.patternDeutan', { n: deutanHit }) });
  if (protanHit)
    patterns.push({ type: 'protan', questionCount: protanHit, description: t(lang, 'analysis.patternProtan', { n: protanHit }) });
  if (vanishWrong)
    patterns.push({ type: 'mixed', questionCount: vanishWrong, description: t(lang, 'analysis.patternVanish', { n: vanishWrong }) });
  if (!patterns.length)
    patterns.push({ type: 'random', questionCount: 0, description: t(lang, 'analysis.patternNone') });

  return {
    overall,
    type,
    severity,
    confidence,
    dimensions,
    details: { correctCount: correct, totalCount: total, errorPatterns: patterns },
  };
}

function buildAnalysis(result: IshiharaResult, mode: TestMode, lang: Lang): { analysis: string; confidenceNote: string } {
  const { overall, type, severity, confidence, details } = result;
  const note = t(lang, 'analysis.note', { c: details.correctCount, t: details.totalCount, p: confidence });
  let analysis = '';
  if (overall === 'normal') {
    analysis = t(lang, 'analysis.normal');
  } else if (overall === 'inconclusive') {
    analysis = t(lang, 'analysis.inconclusive');
  } else {
    const tt = type ? uiText.type(type, lang) : t(lang, 'analysis.genericType');
    const s = severity ? uiText.severity(severity, lang) : '';
    const isBlindness = type && type.endsWith('opia');
    const clarify = isBlindness ? t(lang, 'analysis.clarifyBlind') : t(lang, 'analysis.clarifyWeak');
    analysis = t(lang, 'analysis.abnormal', { t: tt, s, clarify });
  }
  return { analysis: `${uiText.mode(mode, lang)} · ${analysis}`, confidenceNote: note };
}

export function computeResult(
  answers: AnswerRecord[],
  questions: Question[],
  opts: { testMode: TestMode; startedAt: number; endedAt: number; device: string; scene?: import('./types').Scene; lang?: Lang },
): TestResult {
  const ishihara = scoreIshihara(answers, questions, opts.lang ?? 'zh');
  const { analysis, confidenceNote } = buildAnalysis(ishihara, opts.testMode, opts.lang ?? 'zh');
  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `cc-${Date.now()}`,
    schema: 'cc.result/v1',
    version: '1.9.0', // 结果结构版本；解析方应对未知字段保持兼容（向后兼容）
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
