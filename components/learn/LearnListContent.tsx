// components/learn/LearnListContent.tsx — 科普列表内容（客户端，双语）
// chromacheck v1.9.0
'use client';

import React from 'react';
import Link from 'next/link';
import { ARTICLES } from '@/lib/learn-data';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';
import { localizeArticle } from './learn-locale';

export function LearnListContent() {
  const { t, lang } = useLang();

  return (
    <div id="learn-list-page" className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-5)' }}>
      <div className="stack" style={{ gap: 'var(--s-2)', maxWidth: 680 }}>
        <span className="chip">{t('learn.chip')}</span>
        <h1 style={{ margin: 0 }}>{t('learn.heading')}</h1>
        <p className="muted" style={{ margin: 0 }}>{t('learn.sub')}</p>
      </div>

      <div className="grid-cards">
        {ARTICLES.map((a) => {
          const l = localizeArticle(a, lang);
          return (
            <Link
              key={a.slug}
              href={`/learn/${a.slug}`}
              className="card stack"
              style={{ gap: 'var(--s-3)', color: 'var(--fg)', minHeight: 180 }}
            >
              <div className="row between">
                <span style={{ width: 36, height: 36, borderRadius: 10, background: a.hue, display: 'inline-flex' }} />
                <span className="chip">{l.cat}</span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{l.title}</h3>
              <p className="muted" style={{ margin: 0, fontSize: '0.9rem', flex: 1 }}>{l.excerpt}</p>
              <span className="muted row" style={{ gap: 6, fontSize: '0.82rem' }}>
                <Icon name="clock" size={14} /> {l.read}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
