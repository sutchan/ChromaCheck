// components/learn/ArticleContent.tsx — 科普详情正文（客户端，双语）
// chromacheck v1.9.0
'use client';

import React from 'react';
import Link from 'next/link';
import { ARTICLES, type Article } from '@/lib/learn-data';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';
import { localizeArticle, localizeSection } from './learn-locale';

export function ArticleContent({ article }: { article: Article }) {
  const { t, lang } = useLang();
  const cur = localizeArticle(article, lang);

  const idx = ARTICLES.findIndex((a) => a.slug === article.slug);
  const nextRaw = ARTICLES[(idx + 1) % ARTICLES.length];
  const next = localizeArticle(nextRaw, lang);

  return (
    <article id="learn-article-page" className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-4)', maxWidth: 760 }}>
      <Link href="/learn" className="muted row" style={{ gap: 6, fontSize: '0.88rem', width: 'fit-content' }}>
        <Icon name="arrowRight" size={16} style={{ transform: 'rotate(180deg)' }} /> {t('learn.back')}
      </Link>

      <div className="stack" style={{ gap: 'var(--s-2)' }}>
        <div className="row" style={{ gap: 'var(--s-2)' }}>
          <span className="chip" style={{ background: article.hue, color: '#fff', borderColor: 'transparent' }}>{cur.cat}</span>
          <span className="muted" style={{ fontSize: '0.85rem' }}><Icon name="clock" size={14} /> {cur.read}</span>
        </div>
        <h1 style={{ margin: 0 }}>{cur.title}</h1>
        <p className="muted" style={{ margin: 0 }}>{cur.excerpt}</p>
      </div>

      <div className="stack" style={{ gap: 'var(--s-4)' }}>
        {article.body.map((s, i) => {
          const sec = localizeSection(s, lang);
          return (
            <section key={i} className="stack" style={{ gap: 'var(--s-2)' }}>
              {sec.h && <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{sec.h}</h2>}
              <p style={{ margin: 0, color: 'var(--fg-soft)' }}>{sec.p}</p>
            </section>
          );
        })}
      </div>

      <div className="card row between" style={{ gap: 'var(--s-3)', flexWrap: 'wrap' }}>
        <span className="muted" style={{ fontSize: '0.9rem' }}>{t('learn.next')}</span>
        <Link href={`/learn/${nextRaw.slug}`} className="row" style={{ gap: 6, fontWeight: 600 }}>
          {next.title} <Icon name="arrowRight" size={16} />
        </Link>
      </div>

      <Link href="/test" className="btn btn-primary btn-block" style={{ maxWidth: 320, marginInline: 'auto' }}>
        {t('learn.cta')} <Icon name="arrowRight" size={18} />
      </Link>
    </article>
  );
}
