// components/layout/Navbar.tsx — 顶部导航
// chromacheck v1.0.0
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/common/Icon';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { href: '/', label: '首页', exact: true },
  { href: '/test', label: '开始检测', exact: false },
  { href: '/history', label: '历史', exact: false },
  { href: '/learn', label: '科普', exact: false },
  { href: '/privacy', label: '隐私', exact: false },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header
      id="app-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'color-mix(in srgb, var(--bg-elev) 85%, transparent)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <nav className="wrap row between" style={{ height: 60 }}>
        <Link href="/" className="row" style={{ gap: 'var(--s-2)', color: 'var(--fg)', fontWeight: 800, fontSize: '1.05rem' }}>
          <span
            style={{
              display: 'inline-flex',
              width: 32,
              height: 32,
              borderRadius: 9,
              background: 'var(--brand)',
              color: 'var(--on-brand)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="eye" size={19} />
          </span>
          色辨 ChromaCheck
        </Link>
        <div className="row" style={{ gap: 'var(--s-1)' }}>
          {LINKS.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href) && l.href !== '/';
            return (
              <Link key={l.href} href={l.href} className={`nav-link ${active ? 'nav-link-active' : ''}`}>
                {l.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
