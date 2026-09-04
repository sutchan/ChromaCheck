// app/learn/page.tsx — 科普列表
// chromacheck v1.0.0
import React from 'react';
import Link from 'next/link';
import { ARTICLES } from '@/lib/learn-data';
import { Icon } from '@/components/common/Icon';

export default function LearnPage() {
  return (
    <div className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-5)' }}>
      <div className="stack" style={{ gap: 'var(--s-2)', maxWidth: 680 }}>
        <span className="chip">科普</span>
        <h1 style={{ margin: 0 }}>关于色觉，你需要知道的事</h1>
        <p className="muted" style={{ margin: 0 }}>从原理到遗传、职业与日常生活，用几分钟建立对色觉异常的基本认识。</p>
      </div>

      <div className="grid-cards">
        {ARTICLES.map((a) => (
          <Link key={a.slug} href={`/learn/${a.slug}`} className="card stack" style={{ gap: 'var(--s-3)', color: 'var(--fg)', minHeight: 180 }}>
            <div className="row between">
              <span style={{ width: 36, height: 36, borderRadius: 10, background: a.hue, display: 'inline-flex' }} />
              <span className="chip">{a.cat}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{a.title}</h3>
            <p className="muted" style={{ margin: 0, fontSize: '0.9rem', flex: 1 }}>{a.excerpt}</p>
            <span className="muted row" style={{ gap: 6, fontSize: '0.82rem' }}>
              <Icon name="clock" size={14} /> {a.read}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
