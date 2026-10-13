'use client';
// components/layout/LangToggle.tsx — 中英切换按钮
// chromacheck v1.7.9
import React from 'react';
import { LANG_LABEL, LANGS, type Lang } from '@/lib/i18n';
import { useLang } from './LangProvider';

export function LangToggle() {
  const { lang, setLang, t } = useLang();

  return (
    <div id="lang-switch" className="row" style={{ gap: 2 }} aria-label={t('nav.lang')}>
      {LANGS.map((code: Lang) => {
        const active = code === lang;
        return (
          <button
            key={code}
            id={`lang-btn-${code}`}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={`nav-link ${active ? 'nav-link-active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', padding: '4px 6px' }}
          >
            {LANG_LABEL[code]}
          </button>
        );
      })}
    </div>
  );
}
