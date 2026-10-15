// lib/signal-scoring.ts — 信号灯辨识判读
// chromacheck v1.9.0
import type { SignalTask } from './questions/signal';
import { t, type Lang } from './i18n';

export interface SignalTaskResult {
  id: string;
  userAnswer: string;
  correct: boolean;
}

export interface SignalTestResult {
  overall: 'pass' | 'fail';
  correct: number;
  total: number;
  /** 是否在辨色（light 类）任务上全部正确 */
  colorOk: boolean;
  tasks: SignalTaskResult[];
  note: string;
}

/**
 * 信号灯辨识判读：light 类（辨色）任务须全部正确才算通过；
 * meaning 类（含义）错误反映认知而非辨色，单独提示但不直接判不合格。
 */
export function scoreSignal(
  tasks: SignalTask[],
  answers: Record<string, string>,
  lang: Lang = 'zh',
): SignalTestResult {
  const lightIds = tasks.filter((t) => t.kind === 'light').map((t) => t.id);
  const results: SignalTaskResult[] = tasks.map((t) => {
    const ua = answers[t.id] ?? '';
    return { id: t.id, userAnswer: ua, correct: ua === t.answer };
  });
  const correct = results.filter((r) => r.correct).length;
  const colorResults = results.filter((r) => lightIds.includes(r.id));
  const colorOk = colorResults.length > 0 && colorResults.every((r) => r.correct);

  const note = colorOk ? t(lang, 'analysis.signalPass') : t(lang, 'analysis.signalFail');

  return {
    overall: colorOk ? 'pass' : 'fail',
    correct,
    total: tasks.length,
    colorOk,
    tasks: results,
    note,
  };
}
