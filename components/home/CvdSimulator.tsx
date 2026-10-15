// components/home/CvdSimulator.tsx — 色觉模拟交互
// chromacheck v1.9.0
'use client';

import React, { useState } from 'react';
import { IshiharaPlate } from '@/components/test/IshiharaPlate';
import { QUESTIONS } from '@/lib/questions';
import { useLang } from '@/components/layout/LangProvider';
import type { DictKey } from '@/lib/i18n';

const OPTIONS: Array<{ value: string; labelKey: DictKey }> = [
  { value: 'none', labelKey: 'cvd.none' },
  { value: 'protanopia', labelKey: 'cvd.protanopia' },
  { value: 'deuteranopia', labelKey: 'cvd.deuteranopia' },
  { value: 'tritanopia', labelKey: 'cvd.tritanopia' },
];

export function CvdSimulator() {
  const { t } = useLang();
  const [cvd, setCvd] = useState('none');
  const sample = QUESTIONS[3]; // 转换题，差异最明显
  return (
    <div className="card stack" style={{ gap: 'var(--s-4)', alignItems: 'center' }}>
      <div className="stack" style={{ gap: 4, alignItems: 'center', textAlign: 'center' }}>
        <h3 style={{ margin: 0 }}>{t('cvd.title')}</h3>
        <span className="muted" style={{ fontSize: '0.9rem' }}>
          {t('cvd.desc')}
        </span>
      </div>
      <IshiharaPlate type={sample.type} text={sample.answer} seed={sample.plate} cvd={cvd} maxWidth={320} />
      <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap', justifyContent: 'center' }}>
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`btn ${cvd === o.value ? 'btn-primary' : 'btn-ghost'}`}
            style={{ height: 38, fontSize: '0.85rem' }}
            onClick={() => setCvd(o.value)}
          >
            {t(o.labelKey)}
          </button>
        ))}
      </div>
      <span className="muted" style={{ fontSize: '0.78rem' }}>
        {t('cvd.note')}
      </span>
    </div>
  );
}
