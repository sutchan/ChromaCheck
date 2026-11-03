// lib/sharecard.test.ts v1.11.2
import { describe, it, expect } from 'vitest';
import { computeRadar } from './sharecard';
import type { IshiharaResult } from './types';

const ish = {
  dimensions: { protan: 12, deutan: 34, tritan: 5 },
  overall: 'normal',
} as unknown as IshiharaResult;

describe('computeRadar', () => {
  it('返回 6 维数值与标签', () => {
    const r = computeRadar(ish, [], 'zh');
    expect(r.values.length).toBe(6);
    expect(r.labels.length).toBe(6);
    expect(r.values.every((v) => v >= 0 && v <= 100)).toBe(true);
    expect(r.values[0]).toBe(12);
    expect(r.values[1]).toBe(34);
    expect(r.values[2]).toBe(5);
    expect(r.values[5]).toBe(34);
  });
  it('英文标签与中文不同', () => {
    const zh = computeRadar(ish, [], 'zh').labels;
    const en = computeRadar(ish, [], 'en').labels;
    expect(zh[0]).not.toBe(en[0]);
  });
});
