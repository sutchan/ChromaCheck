// components/layout/Footer.tsx — 页脚
// chromacheck v1.14.0
'use client';

import React from 'react';
import Link from 'next/link';
import pkg from '../../package.json';
import { useLang } from './LangProvider';

export function Footer() {
  const { t } = useLang();
  // 构建号由 next.config.mjs 在构建时注入（yymmddhhmm，10 位），缺失时回退版本号
  const buildId = process.env.NEXT_PUBLIC_BUILD_ID ?? pkg.version;

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
          {/* 版本号直读 package.json；展示格式 V{版本}· build {yymmddhhmm}（10 位构建号由 next.config.mjs 注入 NEXT_PUBLIC_BUILD_ID），缺失时回退版本号 */}
          © {new Date().getFullYear()} ChromaCheck · V{pkg.version}· build {buildId} · {t('footer.purpose')}
        </div>
      </div>
    </footer>
  );
}
