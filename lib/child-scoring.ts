// lib/child-scoring.ts — 儿童模式判读（图形识别，结论保守，仅作初筛参考）
// chromacheck v1.9.0
import type { ChildResult, Overall } from './types';
import { CHILD_QUESTIONS, type ChildAnswerValue } from './questions/child';
import { t, type Lang } from './i18n';

export interface ChildAnswer {
  questionId: string;
  value: ChildAnswerValue;
  durationMs: number;
}

/** 儿童配合度波动大，阈值比成人更保守：错 1–2 题仅提示复查，错 3 题以上才提示疑似色盲 */
export function scoreChild(answers: ChildAnswer[], lang: Lang = 'zh'): ChildResult {
  const scored = CHILD_QUESTIONS.filter((q) => !q.demo);
  const details = scored.map((q) => {
    const hit = answers.find((a) => a.questionId === q.id);
    return {
      questionId: q.id,
      value: hit?.value ?? 'none',
      correct: !!hit && hit.value === q.answer,
    };
  });

  const correct = details.filter((d) => d.correct).length;
  const wrong = details.length - correct;
  const overall: Overall =
    wrong === 0 ? 'normal' : wrong <= 2 ? 'suspected_deficiency' : 'suspected_blindness';

  const analysis =
    t(lang, 'analysis.childCorrect', { n: details.length, c: correct }) +
    (wrong === 0
      ? t(lang, 'analysis.childNormal')
      : wrong <= 2
        ? t(lang, 'analysis.childMild')
        : t(lang, 'analysis.childSevere'));

  const note =
    wrong <= 2 ? t(lang, 'analysis.childNoteMild') : t(lang, 'analysis.childNoteSevere');

  return { total: details.length, correct, details, overall, analysis, note };
}
