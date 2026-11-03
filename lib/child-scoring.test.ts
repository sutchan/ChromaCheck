// lib/child-scoring.test.ts v1.11.2
import { describe, it, expect } from 'vitest';
import { scoreChild } from './child-scoring';
import { CHILD_QUESTIONS } from './questions/child';
import type { ChildAnswer } from './child-scoring';

const scored = CHILD_QUESTIONS.filter((q) => !q.demo);
const toAnswer = (pick: (answer: ChildAnswer['value']) => ChildAnswer['value']): ChildAnswer[] =>
  scored.map((q) => ({ questionId: q.id, value: pick(q.answer), durationMs: 0 }));

describe('scoreChild', () => {
  it('全部答对 → normal', () => {
    const r = scoreChild(toAnswer((a) => a));
    expect(r.overall).toBe('normal');
    expect(r.correct).toBe(scored.length);
    expect(r.total).toBe(scored.length);
  });

  it('错 1–2 题 → suspected_deficiency', () => {
    const ans = toAnswer((a) => a);
    ans[0].value = (ans[0].value === 'circle' ? 'square' : 'circle') as ChildAnswer['value'];
    const r = scoreChild(ans);
    expect(r.overall).toBe('suspected_deficiency');
  });

  it('全部答错（≥3）→ suspected_blindness', () => {
    const r = scoreChild(toAnswer((a) => (a === 'circle' ? 'square' : 'circle')));
    expect(r.overall).toBe('suspected_blindness');
  });

  it('返回中英双语分析文案', () => {
    const zh = scoreChild(toAnswer((a) => a), 'zh');
    const en = scoreChild(toAnswer((a) => a), 'en');
    expect(zh.analysis).toBeTruthy();
    expect(en.analysis).toBeTruthy();
    expect(zh.analysis).not.toBe(en.analysis);
    expect(zh.note).toBeTruthy();
  });
});
