// lib/scoring.test.ts v1.7.6
import { describe, it, expect } from 'vitest';
import { scoreIshihara, computeResult } from './scoring';
import type { AnswerRecord, Question } from './types';

/** 构造石原氏题目（默认消失题，answer '12'） */
function q(id: string, partial: Partial<Question> = {}): Question {
  return {
    plate: 1,
    type: 'vanishing',
    answer: '12',
    protan: '',
    deutan: '',
    difficulty: 1,
    quick: true,
    ...partial,
    id,
  };
}

function a(questionId: string, userAnswer: string, durationMs = 5000): AnswerRecord {
  return { questionId, userAnswer, durationMs };
}

describe('scoreIshihara', () => {
  it('全部答对 → normal，无类型与程度，置信度 100', () => {
    const questions = [q('v1'), q('v2'), q('v3'), q('v4')];
    const answers = questions.map((x) => a(x.id, '12'));
    const r = scoreIshihara(answers, questions);
    expect(r.overall).toBe('normal');
    expect(r.type).toBeNull();
    expect(r.severity).toBeNull();
    expect(r.confidence).toBe(100);
    expect(r.dimensions).toEqual({ protan: 0, deutan: 0, tritan: 0 });
    expect(r.details.correctCount).toBe(4);
    expect(r.details.errorPatterns[0].type).toBe('random');
  });

  it('几乎未作答 → inconclusive 且低覆盖扣 20', () => {
    const questions = [q('v1'), q('v2'), q('v3'), q('v4')];
    const r = scoreIshihara([], questions);
    expect(r.overall).toBe('inconclusive');
    expect(r.confidence).toBe(80);
    expect(r.details.correctCount).toBe(0);
  });

  it('消失题错误 ≥ 4 → suspected_blindness + deuteranopia + severe，维度饱和', () => {
    const questions = [q('v1'), q('v2'), q('v3'), q('v4'), q('v5'), q('v6')];
    const answers = questions.map((x) => a(x.id, '99'));
    const r = scoreIshihara(answers, questions);
    expect(r.overall).toBe('suspected_blindness');
    expect(r.type).toBe('deuteranopia');
    expect(r.severity).toBe('severe');
    expect(r.dimensions.protan).toBe(100);
    expect(r.dimensions.deutan).toBe(100);
    expect(r.dimensions.tritan).toBe(35);
    expect(r.details.errorPatterns).toEqual([
      expect.objectContaining({ type: 'mixed', questionCount: 6 }),
    ]);
  });

  it('转换题 deutan 命中 + 消失题错 1 → suspected_deficiency + deuteranomaly', () => {
    const questions = [
      q('t1', { type: 'transformation', answer: '5', protan: '3', deutan: '8' }),
      q('v1'),
      q('v2'),
      q('v3'),
    ];
    const answers = [a('t1', '8'), a('v1', '99'), a('v2', '12'), a('v3', '12')];
    const r = scoreIshihara(answers, questions);
    expect(r.overall).toBe('suspected_deficiency');
    expect(r.type).toBe('deuteranomaly');
    expect(r.severity).toBe('moderate');
    // base = round(min(100, 2/4*130)) = 65；protan 65-3=62；deutan 65+8=73；tritan round(65*0.35)=23
    expect(r.dimensions).toEqual({ protan: 62, deutan: 73, tritan: 23 });
    expect(r.details.errorPatterns[0]).toEqual(expect.objectContaining({ type: 'deutan', questionCount: 1 }));
  });

  it('protan 与 deutan 同时命中 → 置信度矛盾扣 15', () => {
    const questions = [
      q('t1', { type: 'transformation', answer: '5', protan: '3', deutan: '8' }),
      q('t2', { type: 'transformation', answer: '7', protan: '2', deutan: '9' }),
      ...Array.from({ length: 8 }, (_, i) => q(`v${i}`)),
    ];
    const answers = [a('t1', '8'), a('t2', '2'), ...questions.slice(2).map((x) => a(x.id, '12'))];
    const r = scoreIshihara(answers, questions);
    expect(r.overall).toBe('normal'); // vanishWrong=0，错误率 0.2 < 0.3
    expect(r.confidence).toBe(85);
    expect(r.details.errorPatterns.map((p) => p.type)).toEqual(['deutan', 'protan']);
  });

  it('答题过快（<1s）每题扣 2', () => {
    const questions = [q('v1')];
    const r = scoreIshihara([a('v1', '12', 500)], questions);
    expect(r.overall).toBe('normal');
    expect(r.confidence).toBe(98);
  });

  it('演示题答错且无命中 → 覆盖为 inconclusive，演示题扣 25', () => {
    const questions = [q('d1', { type: 'demonstration' }), q('v1'), q('v2'), q('v3')];
    const answers = [a('d1', '99'), a('v1', '12'), a('v2', '12'), a('v3', '12')];
    const r = scoreIshihara(answers, questions);
    expect(r.overall).toBe('inconclusive');
    expect(r.confidence).toBe(75);
  });

  it('hidden 题看见数字达半数 → suspected_deficiency', () => {
    const questions = [q('h1', { type: 'hidden', answer: '' }), q('h2', { type: 'hidden', answer: '' })];
    const answers = [a('h1', '5'), a('h2', '')];
    const r = scoreIshihara(answers, questions);
    expect(r.overall).toBe('suspected_deficiency');
    expect(r.type).toBe('deuteranomaly'); // 无轴命中时默认 deutan 侧
    expect(r.severity).toBe('moderate');
  });
});

describe('computeResult', () => {
  it('组装完整 TestResult，字段与时长正确', () => {
    const questions = [q('v1'), q('v2')];
    const answers = [a('v1', '12'), a('v2', '12')];
    const r = computeResult(answers, questions, {
      testMode: 'quick',
      startedAt: 1000,
      endedAt: 61000,
      device: 'test-agent',
    });
    expect(r.id.length).toBeGreaterThan(0);
    expect(r.schema).toBe('cc.result/v1');
    expect(r.testMode).toBe('quick');
    expect(r.overall).toBe('normal');
    expect(r.durationMs).toBe(60000);
    expect(r.scene).toBe('general');
    expect(r.confidenceNote).toContain('综合置信度');
    expect(r.answers).toBe(answers);
  });

  it('endedAt 早于 startedAt → durationMs 兜底为 0', () => {
    const r = computeResult([], [q('v1')], {
      testMode: 'standard',
      startedAt: 5000,
      endedAt: 1000,
      device: 'test',
    });
    expect(r.durationMs).toBe(0);
  });
});
