// app/not-found.tsx — 404（客户端，双语）
// chromacheck v1.9.0
'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';

export default function NotFound() {
  const { t } = useLang();

  return (
    <div id="not-found-page" className="wrap stack" style={{ paddingBlock: 'var(--s-8)', alignItems: 'center', textAlign: 'center', gap: 'var(--s-3)' }}>
      <Icon name="alert" size={40} />
      <h1 style={{ margin: 0 }}>{t('notFound.title')}</h1>
      <p className="muted">{t('notFound.desc')}</p>
      <Link href="/" className="btn btn-primary">{t('notFound.home')}</Link>
    </div>
  );
}
