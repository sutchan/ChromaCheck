// lib/signal-scoring.test.ts v1.7.6
import { describe, it, expect } from 'vitest';
import { scoreSignal } from './signal-scoring';
import { getSignalTasks } from './questions/signal';

/** 全部正确作答 */
const ALL_CORRECT: Record<string, string> = {
  s1: 'red', s2: 'green', s3: 'yellow', s4: 'red', s5: 'yellow', s6: 'green',
  s7: 'stop', s8: 'caution', s9: 'brake',
};

describe('scoreSignal', () => {
  it('全部正确 → pass，辨色任务全部正确', () => {
    const r = scoreSignal(getSignalTasks(), ALL_CORRECT);
    expect(r.overall).toBe('pass');
    expect(r.correct).toBe(9);
    expect(r.total).toBe(9);
    expect(r.colorOk).toBe(true);
    expect(r.note).toContain('符合');
  });

  it('辨色任务错一题（琥珀误判为红）→ fail', () => {
    const r = scoreSignal(getSignalTasks(), { ...ALL_CORRECT, s5: 'red' });
    expect(r.overall).toBe('fail');
    expect(r.correct).toBe(8);
    expect(r.colorOk).toBe(false);
    expect(r.note).toContain('建议前往正规医院');
  });

  it('仅含义题错误不影响通过（辨色全对）', () => {
    const r = scoreSignal(getSignalTasks(), { ...ALL_CORRECT, s8: 'stop' });
    expect(r.overall).toBe('pass');
    expect(r.correct).toBe(8);
    expect(r.colorOk).toBe(true);
  });

  it('空作答 → fail，correct 0', () => {
    const r = scoreSignal(getSignalTasks(), {});
    expect(r.overall).toBe('fail');
    expect(r.correct).toBe(0);
    expect(r.colorOk).toBe(false);
    expect(r.tasks.every((t) => t.userAnswer === '')).toBe(true);
  });
});
