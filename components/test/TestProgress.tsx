// components/test/TestProgress.tsx — 检测进度
// chromacheck v1.9.0
'use client';

import React from 'react';
import type { PlateType } from '@/lib/types';
import { type DictKey } from '@/lib/i18n';
import { useLang } from '@/components/layout/LangProvider';

const TYPE_LABEL_KEY: Record<PlateType, DictKey> = {
  demonstration: 'test.typeLabel.demonstration',
  normal: 'test.typeLabel.normal',
  transformation: 'test.typeLabel.transformation',
  vanishing: 'test.typeLabel.vanishing',
  hidden: 'test.typeLabel.hidden',
  classification: 'test.typeLabel.classification',
};

export interface TestProgressProps {
  index: number;
  total: number;
  current?: { type: PlateType };
  label?: string;
}

export function TestProgress({ index, total, current, label }: TestProgressProps) {
  const { t } = useLang();
  const pct = Math.round((index / total) * 100);
  return (
    <div className="stack" style={{ gap: 'var(--s-2)' }}>
      <div className="row between">
        <span className="chip">{label ?? (current ? t(TYPE_LABEL_KEY[current.type]) : t('test.inProgress'))}</span>
        <span className="muted" style={{ fontSize: '0.9rem' }}>
          {t('test.progress', { i: index + 1, total })}
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
