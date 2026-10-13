// components/result/ChildSummary.tsx — 儿童模式结果区块（图形回顾 + 保守结论）
// chromacheck v1.7.9
import React from 'react';
import type { ChildResult } from '@/lib/types';
import {
  CHILD_QUESTIONS,
  SHAPE_LABEL,
  type ChildAnswerValue,
  type ChildShape,
} from '@/lib/questions/child';
import { ChildShapeIcon } from '@/components/test/ChildShapeIcon';

export interface ChildSummaryProps {
  result: ChildResult;
}

export function ChildSummary({ result }: ChildSummaryProps) {
  return (
    <section id="child-summary" className="card stack" style={{ gap: 'var(--s-3)' }}>
      <h2 style={{ margin: 0, fontSize: '1.15rem' }}>儿童模式 · 图形辨色</h2>
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
              第 {i + 1} 题
            </span>
            {d.value !== 'none' ? (
              <ChildShapeIcon shape={d.value as ChildShape} size={22} />
            ) : (
              <span aria-hidden>∅</span>
            )}
            <span style={{ fontSize: '0.9rem' }}>
              {SHAPE_LABEL[d.value as ChildAnswerValue] ?? '—'}
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                color: d.correct ? 'var(--brand)' : 'var(--muted)',
              }}
            >
              {d.correct ? '✓' : '待确认'}
            </span>
          </li>
        ))}
      </ul>

      <span className="muted" style={{ fontSize: '0.85rem' }}>
        {result.note}
      </span>
      <span className="muted" style={{ fontSize: '0.8rem' }}>
        共 {CHILD_QUESTIONS.filter((q) => !q.demo).length} 道判读题（另含演示题，不计分）。
      </span>
    </section>
  );
}
