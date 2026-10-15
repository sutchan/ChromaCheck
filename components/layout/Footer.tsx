// components/layout/Footer.tsx — 页脚
// chromacheck v1.9.0
'use client';

import React from 'react';
import Link from 'next/link';
import pkg from '../../package.json';
import { SITE_UPDATED } from '../../lib/site';
import { useLang } from './LangProvider';

export function Footer() {
  const { t } = useLang();

  return (
    <footer
      id="app-footer"
      style={{ borderTop: '1px solid var(--border)', marginTop: 'var(--s-8)', background: 'var(--bg-elev)' }}
    >
      <div className="wrap stack" style={{ paddingBlock: 'var(--s-6)' }}>
        <div className="row between" style={{ flexWrap: 'wrap', gap: 'var(--s-4)' }}>
          <div className="stack" style={{ gap: 'var(--s-2)' }}>
            <strong>色辨 ChromaCheck</strong>
            <span className="muted" style={{ fontSize: '0.9rem', maxWidth: 420 }}>
              {t('footer.desc')}
            </span>
          </div>
          <div className="row" style={{ gap: 'var(--s-5)', flexWrap: 'wrap' }}>
            <Link href="/test" className="muted" style={{ fontSize: '0.9rem' }}>{t('nav.test')}</Link>
            <Link href="/learn" className="muted" style={{ fontSize: '0.9rem' }}>{t('footer.learn')}</Link>
            <Link href="/privacy" className="muted" style={{ fontSize: '0.9rem' }}>{t('footer.privacy')}</Link>
            <a href="https://github.com/sutchan/ChromaCheck" target="_blank" rel="noreferrer" className="muted" style={{ fontSize: '0.9rem' }} aria-label={t('footer.githubAria')}>GitHub</a>
          </div>
        </div>
        <div className="muted" style={{ fontSize: '0.82rem', borderTop: '1px solid var(--border)', paddingTop: 'var(--s-4)' }}>
          {/* 版本号直读 package.json，避免展示版本与实际发布版本脱节；更新日期唯一来源为 lib/site.ts 的 SITE_UPDATED */}
          © {new Date().getFullYear()} ChromaCheck · v{pkg.version} · {t('footer.updated')} {SITE_UPDATED} · {t('footer.purpose')}
        </div>
      </div>
    </footer>
  );
}
