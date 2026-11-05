// components/home/HomeFaq.tsx — 首页常见问题（双栏布局 + 可访问手风琴 + FAQPage 结构化数据）
// chromacheck v1.13.2
'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';
import type { DictKey } from '@/lib/i18n';

/** FAQ 问答键对：文案在 lib/i18n/zh-faq.ts 与 en-faq.ts */
const QA_KEYS: Array<{ q: DictKey; a: DictKey }> = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
  { q: 'faq.q6', a: 'faq.a6' },
  { q: 'faq.q7', a: 'faq.a7' },
  { q: 'faq.q8', a: 'faq.a8' },
  { q: 'faq.q9', a: 'faq.a9' },
  { q: 'faq.q10', a: 'faq.a10' },
  { q: 'faq.q11', a: 'faq.a11' },
  { q: 'faq.q12', a: 'faq.a12' },
];

export function HomeFaq() {
  const { t } = useLang();
  // 默认展开第一条；允许同时展开多条，便于对照阅读
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const faqs = useMemo(() => QA_KEYS.map((k) => ({ q: t(k.q), a: t(k.a) })), [t]);

  const faqLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }),
    [faqs],
  );

  const toggle = useCallback((index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }, []);

  return (
    <section id="home-faq" className="wrap faq-section">
      <div id="faq-layout" className="faq-layout">
        {/* 左侧简介：桌面端吸附滚动，移动端置顶 */}
        <aside id="faq-intro" className="faq-intro">
          <span className="chip">{t('faq.chip')}</span>
          <h2 id="faq-title" style={{ margin: 0 }}>
            {t('faq.title')}
          </h2>
          <p className="muted" style={{ margin: 0, fontSize: '0.95rem' }}>
            {t('faq.note')}
          </p>
          <span className="faq-count">{t('faq.count', { n: faqs.length })}</span>
          <div id="faq-links" className="faq-links">
            <span className="faq-links-title">{t('faq.linksTitle')}</span>
            <Link href="/learn" className="faq-link">
              {t('footer.learn')}
              <Icon name="arrowRight" size={15} />
            </Link>
            <Link href="/privacy" className="faq-link">
              {t('footer.privacy')}
              <Icon name="arrowRight" size={15} />
            </Link>
          </div>
        </aside>

        {/* 右侧问答：单卡片分隔式手风琴 */}
        <div id="faq-list" className="faq-list" role="list" aria-labelledby="faq-title">
          {faqs.map((f, i) => {
            const open = openIndexes.includes(i);
            const qid = `faq-q-${i + 1}`;
            const aid = `faq-a-${i + 1}`;
            return (
              <div key={f.q} className="faq-item" data-open={open ? 'true' : 'false'} role="listitem">
                <h3 className="faq-heading">
                  <button
                    type="button"
                    id={qid}
                    className="faq-q"
                    aria-expanded={open}
                    aria-controls={aid}
                    onClick={() => toggle(i)}
                  >
                    <span className="faq-num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="faq-q-text">{f.q}</span>
                    <Icon name="chevron" size={18} className="faq-marker" />
                  </button>
                </h3>
                <div id={aid} className="faq-a" role="region" aria-labelledby={qid} hidden={!open}>
                  <p>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <JsonLd data={faqLd} />
    </section>
  );
}
