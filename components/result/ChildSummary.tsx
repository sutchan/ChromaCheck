// components/result/ChildSummary.tsx — 儿童模式结果区块（图形回顾 + 保守结论）
// chromacheck v1.9.0
import React from 'react';
import type { ChildResult } from '@/lib/types';
import {
  CHILD_QUESTIONS,
  SHAPE_LABEL,
  SHAPE_LABEL_EN,
  type ChildAnswerValue,
  type ChildShape,
} from '@/lib/questions/child';
import { ChildShapeIcon } from '@/components/test/ChildShapeIcon';
import { useLang } from '@/components/layout/LangProvider';

export interface ChildSummaryProps {
  result: ChildResult;
}

export function ChildSummary({ result }: ChildSummaryProps) {
  const { t, lang } = useLang();
  const labels = lang === 'en' ? SHAPE_LABEL_EN : SHAPE_LABEL;
  return (
    <section id="child-summary" className="card stack" style={{ gap: 'var(--s-3)' }}>
      <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{t('result.childTitle')}</h2>
      <p className="muted" style={{ margin: 0 }}>
        {result.analysis}
      </p>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gap: 'var(--s-2)',
          gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
        }}
      >
        {result.details.map((d, i) => (
          <li key={d.questionId} className="row" style={{ gap: 'var(--s-2)', alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: '0.85rem' }}>
              {t('result.childItem', { n: i + 1 })}
            </span>
            {d.value !== 'none' ? (
              <ChildShapeIcon shape={d.value as ChildShape} size={22} />
            ) : (
              <span aria-hidden>∅</span>
            )}
            <span style={{ fontSize: '0.9rem' }}>
              {labels[d.value as ChildAnswerValue] ?? t('result.reviewNa')}
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                color: d.correct ? 'var(--brand)' : 'var(--muted)',
              }}
            >
              {d.correct ? '✓' : t('result.childPending')}
            </span>
          </li>
        ))}
      </ul>

      <span className="muted" style={{ fontSize: '0.85rem' }}>
        {result.note}
      </span>
      <span className="muted" style={{ fontSize: '0.8rem' }}>
        {t('result.childCount', { n: CHILD_QUESTIONS.filter((q) => !q.demo).length })}
      </span>
    </section>
  );
}
