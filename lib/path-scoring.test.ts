// lib/path-scoring.test.ts v1.7.6
import { describe, it, expect } from 'vitest';
import { scorePathTracking, computePathResult } from './path-scoring';
import type { PathTrackingQuestion, PathTrackingResult } from './types';

/** 构造横向直线轨迹（y 固定，x 从 0 到 1） */
function line(y: number, n = 20): { x: number; y: number }[] {
  return Array.from({ length: n }, (_, i) => ({ x: i / (n - 1), y }));
}

function pathQ(overrides: Partial<PathTrackingQuestion> = {}): PathTrackingQuestion {
  return {
    id: 'p1',
    width: 100,
    height: 100,
    standardPath: line(0.5),
    backgroundDots: { color: '#39445a', radiusRange: [1, 2], density: 1 },
    pathDotColor: '#d64550',
    targets: ['protan'],
    kind: 0,
    seed: 42,
    ...overrides,
  };
}

describe('scorePathTracking（pathOverlap）', () => {
  it('完全重合 → 100 分，passed', () => {
    const r = scorePathTracking(pathQ(), line(0.5));
    expect(r.overlapScore).toBe(100);
    expect(r.passed).toBe(true);
  });

  it('整体偏离超容差 → 0 分，未通过', () => {
    const r = scorePathTracking(pathQ(), line(0));
    expect(r.overlapScore).toBe(0);
    expect(r.passed).toBe(false);
  });

  it('一半轨迹在路径上、一半完全偏离 → 部分重合，未通过', () => {
    const partial = [...line(0.5, 10), ...line(0, 10)];
    const r = scorePathTracking(pathQ(), partial);
    expect(r.overlapScore).toBeGreaterThan(0);
    expect(r.overlapScore).toBeLessThan(70);
    expect(r.passed).toBe(false);
  });

  it('空轨迹 / 单点轨迹 → 0 分（除零保护）', () => {
    expect(scorePathTracking(pathQ(), []).overlapScore).toBe(0);
    expect(scorePathTracking(pathQ(), [{ x: 0.5, y: 0.5 }]).overlapScore).toBe(0);
  });
});

describe('computePathResult（多题汇总）', () => {
  it('平均重合度 ≥ 70 → normal，无类型与程度', () => {
    const results: PathTrackingResult[] = [
      { questionId: 'p1', overlapScore: 80, userPath: [], passed: true },
    ];
    const r = computePathResult(results, [pathQ()], {
      testMode: 'standard', startedAt: 0, endedAt: 1000, device: 'test',
    });
    expect(r.overall).toBe('normal');
    expect(r.type).toBeNull();
    expect(r.severity).toBeNull();
    expect(r.confidence).toBe(80); // 单题不加 8
    expect(r.confidenceNote).toContain('1/1');
  });

  it('平均 30–69 → suspected_deficiency；失败轴 protan=deutan 时默认 protanomaly + mild', () => {
    const results: PathTrackingResult[] = [
      { questionId: 'p1', overlapScore: 50, userPath: [], passed: false },
      { questionId: 'p2', overlapScore: 50, userPath: [], passed: false },
    ];
    const questions = [pathQ({ id: 'p1', targets: ['protan'] }), pathQ({ id: 'p2', targets: ['deutan'] })];
    const r = computePathResult(results, questions, {
      testMode: 'standard', startedAt: 0, endedAt: 0, device: 'test',
    });
    expect(r.overall).toBe('suspected_deficiency');
    expect(r.type).toBe('protanomaly');
    expect(r.severity).toBe('mild');
    expect(r.confidence).toBe(58); // 50 + 8（多题）
  });

  it('平均 < 30 → suspected_blindness + moderate', () => {
    const results: PathTrackingResult[] = [
      { questionId: 'p1', overlapScore: 20, userPath: [], passed: false },
    ];
    const r = computePathResult(results, [pathQ({ targets: ['deutan'] })], {
      testMode: 'standard', startedAt: 0, endedAt: 0, device: 'test',
    });
    expect(r.overall).toBe('suspected_blindness');
    expect(r.type).toBe('deuteranopia'); // deutanFail=1 > protanFail=0
    expect(r.severity).toBe('moderate');
    expect(r.confidence).toBe(20);
    expect(r.analysis).toContain('绿色觉');
  });
});
