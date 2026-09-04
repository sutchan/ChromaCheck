// components/test/TestProgress.tsx — 检测进度
// chromacheck v1.0.0
'use client';

import React from 'react';
import { TYPE_LABEL } from '@/lib/questions';
import type { Question } from '@/lib/types';

export interface TestProgressProps {
  index: number;
  total: number;
  current: Question;
}

export function TestProgress({ index, total, current }: TestProgressProps) {
  const pct = Math.round((index / total) * 100);
  return (
    <div className="stack" style={{ gap: 'var(--s-2)' }}>
      <div className="row between">
        <span className="chip">{TYPE_LABEL[current.type]}</span>
        <span className="muted" style={{ fontSize: '0.9rem' }}>
          第 {index + 1} / {total} 题
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={index}
        aria-valuemin={0}
        aria-valuemax={total}
        style={{ height: 8, background: 'var(--bg-sunken)', borderRadius: 999, overflow: 'hidden' }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'var(--brand)',
            transition: 'width var(--d-3) var(--ease)',
          }}
        />
      </div>
    </div>
  );
}
