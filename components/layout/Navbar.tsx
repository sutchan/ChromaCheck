// components/layout/Navbar.tsx — 顶部导航
// chromacheck v1.10.0
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/common/Icon';
import { SettingsButton } from './SettingsButton';
import { useLang } from './LangProvider';
import type { DictKey } from '@/lib/i18n';

const LINKS: Array<{ href: string; labelKey: DictKey; exact: boolean }> = [
  { href: '/', labelKey: 'nav.home', exact: true },
  { href: '/test', labelKey: 'nav.test', exact: false },
  { href: '/history', labelKey: 'nav.history', exact: false },
];

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLang();
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
                {t(l.labelKey)}
              </Link>
            );
          })}
          <SettingsButton />
        </div>
      </nav>
    </header>
  );
}
