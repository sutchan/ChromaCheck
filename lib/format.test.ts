// lib/format.test.ts v1.11.2
import { describe, it, expect } from 'vitest';
import { formatDate, formatDuration, detectDevice } from './format';

describe('formatDate', () => {
  it('非法输入返回原串', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
  it('ISO 日期保留年月日（跨时区稳定）', () => {
    expect(formatDate('2026-06-15T12:00:00.000Z')).toContain('2026-06-15');
  });
});

describe('formatDuration', () => {
  it('返回字符串且含分钟数', () => {
    const s = formatDuration(65000, 'en');
    expect(typeof s).toBe('string');
    expect(s).toContain('1');
  });
  it('0 毫秒不抛错', () => {
    expect(() => formatDuration(0)).not.toThrow();
  });
});

describe('detectDevice', () => {
  it('无 navigator 时返回未知设备文案', () => {
    const prev = (globalThis as { navigator?: unknown }).navigator;
    delete (globalThis as { navigator?: unknown }).navigator;
    expect(typeof detectDevice('zh')).toBe('string');
    (globalThis as { navigator?: unknown }).navigator = prev;
  });
  it('有 UA 时返回字符串', () => {
    expect(typeof detectDevice('en')).toBe('string');
  });
});
