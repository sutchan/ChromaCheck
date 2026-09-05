// components/layout/ThemeToggle.tsx — 主题 / 色觉安全 / 趣味体验切换
// chromacheck v1.4.0
'use client';

import React from 'react';
import { useSettings } from './ThemeProvider';
import { Icon } from '@/components/common/Icon';

export function ThemeToggle() {
  const { settings, toggleTheme, toggleCvdSafe, toggleFun } = useSettings();
  return (
    <div className="row" style={{ gap: 'var(--s-2)' }}>
      <button
        type="button"
        id="cvdSafeBtn"
        className="btn btn-ghost"
        style={{ height: 38, padding: '0 10px' }}
        aria-pressed={settings.cvdSafe}
        title="色觉安全模式：弱化色彩依赖，加强对比"
        onClick={toggleCvdSafe}
      >
        <Icon name="eye" size={18} />
        <span style={{ fontSize: '0.85rem' }}>色觉安全</span>
      </button>
      <button
        type="button"
        id="funModeBtn"
        className="btn btn-ghost"
        style={{ height: 38, padding: '0 10px' }}
        aria-pressed={settings.funMode}
        title="趣味体验：称号、章末过渡与里程碑仪式感（不影响判读）"
        onClick={toggleFun}
      >
        <span style={{ fontSize: '0.85rem' }}>趣味{settings.funMode ? '开' : '关'}</span>
      </button>
      <button
        type="button"
        id="themeToggleBtn"
        className="btn btn-ghost"
        style={{ height: 38, width: 38, padding: 0 }}
        aria-label={settings.theme === 'light' ? '切换到深色' : '切换到浅色'}
        title="切换深浅色"
        onClick={toggleTheme}
      >
        <Icon name={settings.theme === 'light' ? 'moon' : 'sun'} size={18} />
      </button>
    </div>
  );
}
