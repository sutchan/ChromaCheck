// components/layout/ThemeToggle.tsx — 主题 / 色觉安全 / 趣味体验切换
// chromacheck v1.9.0
'use client';

import React from 'react';
import { useSettings } from './ThemeProvider';
import { Icon } from '@/components/common/Icon';
import { useLang } from './LangProvider';

export function ThemeToggle() {
  const { settings, toggleTheme, toggleCvdSafe, toggleFun } = useSettings();
  const { t } = useLang();
  return (
    <div className="row" style={{ gap: 'var(--s-2)' }}>
      <button
        type="button"
        id="cvdSafeBtn"
        className="btn btn-ghost"
        style={{ height: 38, padding: '0 10px' }}
        aria-pressed={settings.cvdSafe}
        title={t('theme.cvdSafeTitle')}
        onClick={toggleCvdSafe}
      >
        <Icon name="eye" size={18} />
        <span style={{ fontSize: '0.85rem' }}>{t('theme.cvdSafe')}</span>
      </button>
      <button
        type="button"
        id="funModeBtn"
        className="btn btn-ghost"
        style={{ height: 38, padding: '0 10px' }}
        aria-pressed={settings.funMode}
        title={t('theme.funTitle')}
        onClick={toggleFun}
      >
        <span style={{ fontSize: '0.85rem' }}>{settings.funMode ? t('theme.funOn') : t('theme.funOff')}</span>
      </button>
      <button
        type="button"
        id="themeToggleBtn"
        className="btn btn-ghost"
        style={{ height: 38, width: 38, padding: 0 }}
        aria-label={settings.theme === 'light' ? t('theme.toDark') : t('theme.toLight')}
        title={t('theme.toggleTitle')}
        onClick={toggleTheme}
      >
        <Icon name={settings.theme === 'light' ? 'moon' : 'sun'} size={18} />
      </button>
    </div>
  );
}
