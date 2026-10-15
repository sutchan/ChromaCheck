// components/offline/OfflineContent.tsx — 离线兜底内容（客户端，双语）
// chromacheck v1.9.0
'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';

export function OfflineContent() {
  const { t } = useLang();

  return (
    <div id="offline-page" className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-4)', maxWidth: 640 }}>
      <span className="chip">{t('offline.title')}</span>
      <h1 style={{ margin: 0 }}>{t('offline.heading')}</h1>
      <p className="muted" style={{ margin: 0 }}>
        {t('offline.desc1')} {t('offline.desc2')}
      </p>
      <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap' }}>
        <Link href="/" className="btn btn-primary">
          {t('offline.home')}
        </Link>
        <Link href="/test" className="btn">
          <Icon name="arrowRight" size={18} />
          {t('offline.continue')}
        </Link>
      </div>
      <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>
        {t('offline.hint')}
      </p>
    </div>
  );
}
