// lib/path-field.test.ts v1.11.2
import { describe, it, expect } from 'vitest';
import { standardPath, buildPathField } from './path-field';

describe('standardPath', () => {
  it('三种路径均返回 41 点且落在 0–1', () => {
    for (const k of [0, 1, 2] as const) {
      const p = standardPath(k);
      expect(p.length).toBe(41);
      p.forEach((pt) => {
        expect(pt.x).toBeGreaterThanOrEqual(0);
        expect(pt.x).toBeLessThanOrEqual(1);
        expect(pt.y).toBeGreaterThanOrEqual(0);
        expect(pt.y).toBeLessThanOrEqual(1);
      });
    }
  });
});

describe('buildPathField', () => {
  it('生成点阵且存在路径点', () => {
    const f = buildPathField({
      seed: 7,
      kind: 0,
      width: 520,
      height: 320,
      pathColor: '#d64550',
      bgColors: ['#39445a', '#2f6fb0'],
      radiusRange: [2, 4],
    });
    expect(f.dots.length).toBeGreaterThan(0);
    expect(f.path.length).toBe(41);
    expect(f.dots.some((d) => d.isPath)).toBe(true);
    expect(f.dots.every((d) => d.color.length > 0)).toBe(true);
  });
});
