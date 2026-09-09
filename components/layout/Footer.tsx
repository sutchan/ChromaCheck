// components/layout/Footer.tsx — 页脚
// chromacheck v1.7.7
import React from 'react';
import Link from 'next/link';
import pkg from '../../package.json';

export function Footer() {
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
              在线色觉筛查工具，基于石原氏检测原理。结果仅供参考，不能替代专业眼科诊断。
            </span>
          </div>
          <div className="row" style={{ gap: 'var(--s-5)', flexWrap: 'wrap' }}>
            <Link href="/test" className="muted" style={{ fontSize: '0.9rem' }}>开始检测</Link>
            <Link href="/learn" className="muted" style={{ fontSize: '0.9rem' }}>科普文章</Link>
            <Link href="/privacy" className="muted" style={{ fontSize: '0.9rem' }}>隐私政策</Link>
            <a href="https://github.com/sutchan/ChromaCheck" target="_blank" rel="noreferrer" className="muted" style={{ fontSize: '0.9rem' }} aria-label="ChromaCheck GitHub 仓库">GitHub</a>
          </div>
        </div>
        <div className="muted" style={{ fontSize: '0.82rem', borderTop: '1px solid var(--border)', paddingTop: 'var(--s-4)' }}>
          {/* 版本号直读 package.json，避免展示版本与实际发布版本脱节 */}
          © {new Date().getFullYear()} ChromaCheck · v{pkg.version} · 仅供教育与筛查用途
        </div>
      </div>
    </footer>
  );
}
