// components/layout/SettingsDialog.tsx — 设置弹窗（语言 / 主题 / 色觉安全 / 趣味体验，v1.10.0）
// chromacheck v1.10.0
'use client';

import React, { useEffect, useRef } from 'react';
import { Icon } from '@/components/common/Icon';
import { useLang } from './LangProvider';
import { useSettings } from './ThemeProvider';
import { LANGS, LANG_LABEL, type Lang } from '@/lib/i18n';

interface Props {
  onClose: () => void;
}

/** 分段选择器容器样式（语言 / 主题共用） */
const SEGMENT_WRAP: React.CSSProperties = {
  gap: 2,
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: 3,
};

function segmentBtn(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    height: 34,
    fontSize: '0.9rem',
    background: active ? 'var(--brand)' : 'transparent',
    color: active ? 'var(--on-brand)' : 'var(--fg)',
    border: 'none',
  };
}

/** 开关行（色觉安全 / 趣味共用） */
function SwitchRow({
  id,
  label,
  desc,
  checked,
  onToggle,
  t,
}: {
  id: string;
  label: string;
  desc: string;
  checked: boolean;
  onToggle: () => void;
  t: (key: 'settings.cvdSafe' | 'settings.funMode') => string;
}) {
  return (
    <div className="row between" style={{ gap: 'var(--s-3)' }}>
      <div className="stack" style={{ gap: 2, flex: 1 }}>
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{label}</span>
        <span className="muted" style={{ fontSize: '0.82rem' }}>{desc}</span>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className="btn btn-ghost"
        style={{ height: 38, width: 48, padding: 0 }}
        onClick={onToggle}
      >
        <span
          style={{
            width: 40,
            height: 22,
            borderRadius: 999,
            background: checked ? 'var(--brand)' : 'var(--border)',
            position: 'relative',
            display: 'inline-block',
            transition: 'background .15s',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: checked ? 20 : 2,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left .15s',
            }}
          />
        </span>
      </button>
    </div>
  );
}

export function SettingsDialog({ onClose }: Props) {
  const { t, lang, setLang } = useLang();
  const { settings, toggleTheme, toggleCvdSafe, toggleFun } = useSettings();
  const panelRef = useRef<HTMLDivElement>(null);

  // 打开时聚焦面板，便于键盘操作与读屏
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <div
      id="settings-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '10vh var(--s-4) var(--s-4)',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="settings-dialog"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
        tabIndex={-1}
        className="card stack"
        style={{ gap: 'var(--s-5)', width: 'min(420px, 100%)', padding: 'var(--s-5)', outline: 'none' }}
      >
        <div className="row between">
          <h2 id="settings-dialog-title" style={{ margin: 0, fontSize: '1.15rem' }}>
            {t('settings.title')}
          </h2>
          <button
            type="button"
            id="settings-close-btn"
            className="btn btn-ghost"
            style={{ height: 36, width: 36, padding: 0 }}
            aria-label={t('settings.close')}
            onClick={onClose}
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <section className="stack" style={{ gap: 'var(--s-2)' }}>
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            {t('settings.language')}
          </span>
          <div className="row" style={SEGMENT_WRAP}>
            {LANGS.map((code: Lang) => {
              const active = code === lang;
              return (
                <button
                  key={code}
                  type="button"
                  id={`settings-lang-${code}`}
                  className="btn"
                  aria-pressed={active}
                  style={segmentBtn(active)}
                  onClick={() => setLang(code)}
                >
                  {active && <Icon name="check" size={15} />}
                  {LANG_LABEL[code]}
                </button>
              );
            })}
          </div>
        </section>

        <section className="stack" style={{ gap: 'var(--s-2)' }}>
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            {t('settings.appearance')}
          </span>
          <div className="row" style={SEGMENT_WRAP}>
            {(['light', 'dark'] as const).map((th) => {
              const active = settings.theme === th;
              return (
                <button
                  key={th}
                  type="button"
                  id={`settings-theme-${th}`}
                  className="btn"
                  aria-pressed={active}
                  style={segmentBtn(active)}
                  onClick={() => {
                    if (!active) toggleTheme();
                  }}
                >
                  <Icon name={th === 'light' ? 'sun' : 'moon'} size={15} />
                  {t(th === 'light' ? 'settings.light' : 'settings.dark')}
                </button>
              );
            })}
          </div>
        </section>

        <SwitchRow
          id="settings-cvd-safe"
          label={t('settings.cvdSafe')}
          desc={t('settings.cvdSafeDesc')}
          checked={settings.cvdSafe}
          onToggle={toggleCvdSafe}
          t={t}
        />

        <SwitchRow
          id="settings-fun-mode"
          label={t('settings.funMode')}
          desc={t('settings.funModeDesc')}
          checked={settings.funMode}
          onToggle={toggleFun}
          t={t}
        />
      </div>
    </div>
  );
}
