// components/layout/SettingsButton.tsx — 右上角设置按钮与设置弹窗入口（v1.10.0）
// chromacheck v1.10.0
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/components/common/Icon';
import { useLang } from './LangProvider';
import { SettingsDialog } from './SettingsDialog';

export function SettingsButton() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // Esc 关闭弹窗
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        id="settings-button"
        className="btn btn-ghost"
        style={{ height: 38, width: 38, padding: 0 }}
        aria-label={t('settings.open')}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={t('settings.open')}
        onClick={() => setOpen(true)}
      >
        <Icon name="settings" size={18} />
      </button>
      {open && <SettingsDialog onClose={close} />}
    </>
  );
}
