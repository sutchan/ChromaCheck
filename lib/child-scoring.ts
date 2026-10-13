// lib/child-scoring.ts — 儿童模式判读（图形识别，结论保守，仅作初筛参考）
// chromacheck v1.7.9
import type { ChildResult, Overall } from './types';
import { CHILD_QUESTIONS, type ChildAnswerValue } from './questions/child';

export interface ChildAnswer {
  questionId: string;
  value: ChildAnswerValue;
  durationMs: number;
}

/** 儿童配合度波动大，阈值比成人更保守：错 1–2 题仅提示复查，错 3 题以上才提示疑似色盲 */
export function scoreChild(answers: ChildAnswer[]): ChildResult {
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
    `本次 ${details.length} 道图形题中答对 ${correct} 题。` +
    (wrong === 0
      ? '辨色表现与同龄常模一致。'
      : wrong <= 2
        ? '少数图形辨认有偏差，可能受注意力、屏幕色彩或环境光影响。'
        : '多道图形辨认存在偏差，建议安排一次专业检查确认。');

  const note =
    wrong <= 2
      ? '儿童版为初筛体验，结果受配合度与屏幕影响较大；可在不同时间复测一次，若仍有偏差再就诊。'
      : '儿童版不能作为诊断依据，请前往正规医院眼科或儿童保健科做进一步检查。';

  return { total: details.length, correct, details, overall, analysis, note };
}
