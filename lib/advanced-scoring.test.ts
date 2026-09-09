// lib/advanced-scoring.test.ts v1.7.6
import { describe, it, expect } from 'vitest';
import { computeAdvancedResult } from './advanced-scoring';
import type {
  AnswerRecord,
  HueArrangementResult,
  IshiharaResult,
  Overall,
  PathTrackingQuestion,
  PathTrackingResult,
} from './types';

/** 构造石原氏判读结果（联合判读的输入） */
function ishihara(overall: Overall, confidence = 90): IshiharaResult {
  return {
    overall,
    type: overall === 'suspected_deficiency' ? 'deuteranomaly' : null,
    severity: overall === 'suspected_deficiency' ? 'mild' : null,
    confidence,
    dimensions: { protan: 0, deutan: 0, tritan: 0 },
    details: { correctCount: 0, totalCount: 0, errorPatterns: [] },
  };
}

function hue(normal: boolean, totalErrorScore = 0, deviationDirection: HueArrangementResult['deviationDirection'] = 'none'): HueArrangementResult {
  return { questionId: 'h1', order: [], totalErrorScore, cardErrors: [], deviationDirection, normal };
}

function pathQ(id: string, targets: PathTrackingQuestion['targets']): PathTrackingQuestion {
  return {
    id, width: 100, height: 100, standardPath: [], kind: 0, seed: 1,
    backgroundDots: { color: '#000', radiusRange: [1, 2], density: 1 },
    pathDotColor: '#f00', targets,
  };
}

function pathResult(id: string, overlapScore: number): PathTrackingResult {
  return { questionId: id, overlapScore, userPath: [], passed: overlapScore >= 70 };
}

const OPTS = { startedAt: 0, endedAt: 1000, device: 'test' as const };

describe('computeAdvancedResult（三模块联合判读）', () => {
  it('三模块一致正常 → 置信度 +4，交叉验证通过', () => {
    const r = computeAdvancedResult({
      ishihara: ishihara('normal', 90),
      answers: [],
      pathResults: [],
      pathQuestions: [],
      hueResult: hue(true),
      opts: OPTS,
    });
    expect(r.overall).toBe('normal');
    expect(r.confidence).toBe(94);
    expect(r.analysis).toContain('交叉验证一致');
    expect(r.testMode).toBe('advanced');
  });

  it('石原正常 + 色相异常（deutan TES 25）→ 降级疑似色弱 deuteranomaly，置信度 70', () => {
    const r = computeAdvancedResult({
      ishihara: ishihara('normal'),
      answers: [],
      pathResults: [],
      pathQuestions: [],
      hueResult: hue(false, 25, 'deutan'),
      opts: OPTS,
    });
    expect(r.overall).toBe('suspected_deficiency');
    expect(r.type).toBe('deuteranomaly');
    expect(r.severity).toBe('mild');
    expect(r.confidence).toBe(70);
  });

  it('石原正常 + 路径异常（仅 protan 失败）→ protanomaly', () => {
    const r = computeAdvancedResult({
      ishihara: ishihara('normal'),
      answers: [],
      pathResults: [pathResult('p1', 40)],
      pathQuestions: [pathQ('p1', ['protan'])],
      hueResult: hue(true),
      opts: OPTS,
    });
    expect(r.overall).toBe('suspected_deficiency');
    expect(r.type).toBe('protanomaly');
  });

  it('石原不确定 + 进阶异常 → suspected_deficiency，置信度 65', () => {
    const r = computeAdvancedResult({
      ishihara: ishihara('inconclusive', 60),
      answers: [],
      pathResults: [],
      pathQuestions: [],
      hueResult: hue(false, 30, 'deutan'),
      opts: OPTS,
    });
    expect(r.overall).toBe('suspected_deficiency');
    expect(r.confidence).toBe(65);
  });

  it('石原不确定 + 进阶正常 → 维持 inconclusive', () => {
    const r = computeAdvancedResult({
      ishihara: ishihara('inconclusive', 60),
      answers: [],
      pathResults: [],
      pathQuestions: [],
      hueResult: hue(true),
      opts: OPTS,
    });
    expect(r.overall).toBe('inconclusive');
    expect(r.confidence).toBe(60);
  });

  it('石原异常 + 进阶异常 → 方向一致，置信度 +8', () => {
    const r = computeAdvancedResult({
      ishihara: ishihara('suspected_deficiency', 60),
      answers: [] as AnswerRecord[],
      pathResults: [pathResult('p1', 50)],
      pathQuestions: [pathQ('p1', ['deutan'])],
      hueResult: hue(false, 30, 'deutan'),
      opts: OPTS,
    });
    expect(r.overall).toBe('suspected_deficiency');
    expect(r.type).toBe('deuteranomaly'); // 石原氏结果保持
    expect(r.confidence).toBe(68);
    expect(r.analysis).toContain('方向一致');
  });

  it('石原异常 + 进阶正常 → 分歧提示，结论不变', () => {
    const r = computeAdvancedResult({
      ishihara: ishihara('suspected_deficiency', 80),
      answers: [],
      pathResults: [],
      pathQuestions: [],
      hueResult: hue(true),
      opts: OPTS,
    });
    expect(r.overall).toBe('suspected_deficiency');
    expect(r.type).toBe('deuteranomaly');
    expect(r.confidence).toBe(80);
    expect(r.analysis).toContain('分歧');
  });

  it('色相偏差方向 tritan → tritanomaly', () => {
    const r = computeAdvancedResult({
      ishihara: ishihara('normal'),
      answers: [],
      pathResults: [],
      pathQuestions: [],
      hueResult: hue(false, 30, 'tritan'),
      opts: OPTS,
    });
    expect(r.type).toBe('tritanomaly');
  });
});
