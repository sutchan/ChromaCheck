// lib/scoring-text.test.ts v1.11.2
import { describe, it, expect } from 'vitest';
import { uiText } from './scoring-text';
import type { DeficiencyType, Overall, Severity, TestMode } from './types';

describe('uiText', () => {
  it('overall 映射非空且中英不同', () => {
    const zh = uiText.overall('normal', 'zh');
    const en = uiText.overall('normal', 'en');
    expect(zh).toBeTruthy();
    expect(en).toBeTruthy();
    expect(zh).not.toBe(en);
  });
  it('overall 含 inconclusive 项', () => {
    expect(uiText.overall('inconclusive' as Overall, 'zh')).toBeTruthy();
  });
  it('type(null) 返回空串', () => {
    expect(uiText.type(null as DeficiencyType, 'zh')).toBe('');
  });
  it('type 正常返回文案', () => {
    expect(uiText.type('protanopia', 'zh')).toBeTruthy();
  });
  it('severity / mode 映射', () => {
    expect(uiText.severity('mild' as Severity, 'en')).toBeTruthy();
    (['quick', 'standard', 'advanced', 'child'] as TestMode[]).forEach((m) =>
      expect(uiText.mode(m, 'zh')).toBeTruthy(),
    );
  });
});
