// components/home/HomeFaq.tsx — 首页常见问题（含 FAQPage 结构化数据）
// chromacheck v1.11.0
'use client';

import React from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';
import type { DictKey } from '@/lib/i18n';

const QA_KEYS: Array<{ q: DictKey; a: DictKey }> = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
];

export function HomeFaq() {
  const { t } = useLang();
  const faqs = QA_KEYS.map((k) => ({ q: t(k.q), a: t(k.a) }));

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section id="home-faq" className="wrap stack" style={{ gap: 'var(--s-4)', paddingBlock: 'var(--s-6)' }}>
      <div className="stack" style={{ gap: 'var(--s-2)', maxWidth: 640 }}>
        <span className="chip">{t('faq.chip')}</span>
        <h2 style={{ margin: 0 }}>{t('faq.title')}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {t('faq.note')}
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((f, i) => (
          <details key={f.q} className="faq-item" open={i === 0}>
            <summary className="faq-q">
              <span>{f.q}</span>
              <Icon name="chevron" size={18} className="faq-marker" />
            </summary>
            <p className="faq-a" style={{ margin: 0 }}>{f.a}</p>
          </details>
        ))}
      </div>

      <JsonLd data={faqLd} />
    </section>
  );
}
