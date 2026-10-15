// app/history/error.tsx — 历史记录段级错误边界（客户端，双语）
// chromacheck v1.9.0
'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';

export default function HistoryError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLang();

  return (
    <div id="history-error" className="wrap stack" style={{ paddingBlock: 'var(--s-8)', alignItems: 'center', textAlign: 'center', gap: 'var(--s-3)' }}>
      <Icon name="alert" size={40} />
      <h1 style={{ margin: 0 }}>{t('history.errTitle')}</h1>
      <p className="muted">{t('history.errDesc')}</p>
      <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button type="button" className="btn btn-primary" onClick={reset}>{t('error.retry')}</button>
        <Link href="/" className="btn btn-ghost">{t('error.home')}</Link>
      </div>
    </div>
  );
}
