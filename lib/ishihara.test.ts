// lib/ishihara.test.ts v1.11.2
import { describe, it, expect } from 'vitest';
import { simulate, mulberry32, buildDots, PALETTE } from './ishihara';

describe('simulate', () => {
  it('none 类型原样返回', () => {
    expect(simulate('#ffffff', 'none')).toBe('#ffffff');
  });
  it('异常类型返回 rgb() 表达式', () => {
    const out = simulate('#000000', 'protanopia');
    expect(out.startsWith('rgb(')).toBe(true);
    expect(out.endsWith(')')).toBe(true);
  });
});

describe('mulberry32', () => {
  it('返回 [0,1) 确定性序列', () => {
    const r1 = mulberry32(1);
    const r2 = mulberry32(1);
    const a = r1();
    const b = r2();
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(1);
  });
});

describe('buildDots', () => {
  it('生成点数不超过上限且均在圆内', () => {
    const rng = mulberry32(42);
    const dots = buildDots(rng, 720, 9, 15, 100);
    expect(dots.length).toBeLessThanOrEqual(100);
    const R = 360 - 15 - 3;
    expect(dots.every((d) => (d.x - 360) ** 2 + (d.y - 360) ** 2 <= R * R)).toBe(true);
  });
});

describe('PALETTE', () => {
  it('各题型含图点 / 背景色', () => {
    expect(PALETTE.normal.fig.length).toBeGreaterThan(0);
    expect(PALETTE.transformation.bg.length).toBeGreaterThan(0);
  });
});
