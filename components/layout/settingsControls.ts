// components/layout/settingsControls.ts — 设置弹窗分段选择器样式与工厂
// chromacheck v1.11.1
import type { CSSProperties } from 'react';

/** 分段选择器容器样式（语言 / 主题共用） */
export const SEGMENT_WRAP: CSSProperties = {
  gap: 2,
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: 3,
};

export function segmentBtn(active: boolean): CSSProperties {
  return {
    flex: 1,
    height: 34,
    fontSize: '0.9rem',
    background: active ? 'var(--brand)' : 'transparent',
    color: active ? 'var(--on-brand)' : 'var(--fg)',
    border: 'none',
  };
}
