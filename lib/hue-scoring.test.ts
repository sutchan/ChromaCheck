// lib/hue-scoring.test.ts v1.7.6
import { describe, it, expect } from 'vitest';
import { scoreHueQuestion, computeHueResult, TES_MILD } from './hue-scoring';
import type { HueArrangementQuestion, HueArrangementResult } from './types';

/** 构造 D15 题目（判读只依赖 id，不读取色值） */
function hueQ(id = 'h1'): HueArrangementQuestion {
  return { id, cardCount: 17, cards: Array.from({ length: 15 }, (_, i) => `#${i}`), fixedColors: ['#aaa', '#bbb'] };
}

/** 完美排列 */
const PERFECT = Array.from({ length: 15 }, (_, i) => i);

describe('scoreHueQuestion（capErrors / TES）', () => {
  it('完美排列 → TES 0，normal，偏差方向 none', () => {
    const r = scoreHueQuestion(hueQ(), PERFECT);
    expect(r.totalErrorScore).toBe(0);
    expect(r.cardErrors.every((e) => e === 0)).toBe(true);
    expect(r.normal).toBe(true);
    expect(r.deviationDirection).toBe('none');
  });

  it('相邻两张交换 → TES 3，仍 normal', () => {
    // order = [2,1,3,...,14]：首边界 0→2 贡献 1，1→3 跳变贡献 2
    const swapped = [2, 1, ...Array.from({ length: 12 }, (_, i) => i + 3)];
    const r = scoreHueQuestion(hueQ(), swapped);
    expect(r.totalErrorScore).toBe(3);
    expect(r.normal).toBe(true);
  });

  it('中段逆序（红绿弧）→ TES 24，偏差方向 deutan', () => {
    // seq = [0, 0..6, 13..7, 14]，边界跳 6→13 与 7→14 各贡献 12，均落在红绿弧
    const order = [0, 1, 2, 3, 4, 5, 6, 13, 12, 11, 10, 9, 8, 7, 14];
    const r = scoreHueQuestion(hueQ(), order);
    expect(r.totalErrorScore).toBe(24);
    expect(r.normal).toBe(false);
    expect(r.deviationDirection).toBe('deutan');
  });

  it('首段逆序（蓝黄弧）→ TES 38，偏差方向 tritan', () => {
    // seq = [0, 13..0, 14, 14]：首边界 12（蓝黄弧）+ 中部 0→14 跳变 26（蓝黄弧）
    const order = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 14];
    const r = scoreHueQuestion(hueQ(), order);
    expect(r.totalErrorScore).toBe(38);
    expect(r.deviationDirection).toBe('tritan');
  });

  it('完全逆序 → TES 26，偏差方向 tritan', () => {
    const order = [...PERFECT].reverse();
    const r = scoreHueQuestion(hueQ(), order);
    expect(r.totalErrorScore).toBe(26);
    expect(r.deviationDirection).toBe('tritan');
  });

  it('TES_MILD 阈值常量为 40', () => {
    expect(TES_MILD).toBe(40);
  });
});

describe('computeHueResult', () => {
  it('normal → overall normal，type/severity 为空，置信度 88', () => {
    const hue: HueArrangementResult = {
      questionId: 'h1', order: PERFECT, totalErrorScore: 0, cardErrors: [], deviationDirection: 'none', normal: true,
    };
    const r = computeHueResult(hue, { testMode: 'standard', startedAt: 0, endedAt: 1000, device: 'test' });
    expect(r.overall).toBe('normal');
    expect(r.type).toBeNull();
    expect(r.severity).toBeNull();
    expect(r.confidence).toBe(88);
    expect(r.testMode).toBe('standard');
    expect(r.durationMs).toBe(1000);
  });

  it('deutan 偏差且 TES ≥ 40 → deuteranopia + moderate', () => {
    const hue: HueArrangementResult = {
      questionId: 'h1', order: [], totalErrorScore: 55, cardErrors: [], deviationDirection: 'deutan', normal: false,
    };
    const r = computeHueResult(hue, { testMode: 'standard', startedAt: 0, endedAt: 0, device: 'test' });
    expect(r.overall).toBe('suspected_deficiency');
    expect(r.type).toBe('deuteranopia');
    expect(r.severity).toBe('moderate');
    expect(r.confidence).toBe(57); // clamp(round(90 - 55*0.6), 55, 85)
    expect(r.analysis).toContain('红绿向');
  });

  it('tritan 偏差 → tritanomaly（优先于 TES 分级）', () => {
    const hue: HueArrangementResult = {
      questionId: 'h1', order: [], totalErrorScore: 45, cardErrors: [], deviationDirection: 'tritan', normal: false,
    };
    const r = computeHueResult(hue, { testMode: 'standard', startedAt: 0, endedAt: 0, device: 'test' });
    expect(r.type).toBe('tritanomaly');
    expect(r.severity).toBe('moderate');
    expect(r.analysis).toContain('蓝黄向');
  });

  it('deutan 偏差且 TES < 40 → deuteranomaly + mild', () => {
    const hue: HueArrangementResult = {
      questionId: 'h1', order: [], totalErrorScore: 24, cardErrors: [], deviationDirection: 'deutan', normal: false,
    };
    const r = computeHueResult(hue, { testMode: 'standard', startedAt: 0, endedAt: 0, device: 'test' });
    expect(r.type).toBe('deuteranomaly');
    expect(r.severity).toBe('mild');
    expect(r.confidence).toBe(76); // round(90 - 24*0.6)
  });
});
