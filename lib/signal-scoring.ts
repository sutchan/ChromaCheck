// lib/signal-scoring.ts — 信号灯辨识判读
// chromacheck v1.7.0
import type { SignalTask } from './questions/signal';

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
export function scoreSignal(tasks: SignalTask[], answers: Record<string, string>): SignalTestResult {
  const lightIds = tasks.filter((t) => t.kind === 'light').map((t) => t.id);
  const results: SignalTaskResult[] = tasks.map((t) => {
    const ua = answers[t.id] ?? '';
    return { id: t.id, userAnswer: ua, correct: ua === t.answer };
  });
  const correct = results.filter((r) => r.correct).length;
  const colorResults = results.filter((r) => lightIds.includes(r.id));
  const colorOk = colorResults.length > 0 && colorResults.every((r) => r.correct);

  let note: string;
  if (colorOk) {
    note = '你能稳定辨识红、绿、黄三色交通信号，符合安全驾驶对信号辨色的基本要求。';
  } else {
    note = '你在红 / 绿信号辨色上存在不确定，建议前往正规医院眼科进一步确认，并以体检机构结论为准。';
  }

  return {
    overall: colorOk ? 'pass' : 'fail',
    correct,
    total: tasks.length,
    colorOk,
    tasks: results,
    note,
  };
}
