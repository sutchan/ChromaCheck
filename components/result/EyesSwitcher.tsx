// components/result/EyesSwitcher.tsx — 换一双眼睛：第 4 版转换图五种色觉视角切换
// chromacheck v1.9.0
'use client';

import React, { useMemo, useState } from 'react';
import { getQuestions } from '@/lib/questions';
import { IshiharaPlate } from '@/components/test/IshiharaPlate';
import { t, type DictKey } from '@/lib/i18n';
import { useLang } from '@/components/layout/LangProvider';

const VIEWS: { key: string; labelKey: DictKey }[] = [
  { key: 'none', labelKey: 'result.eyesNormal' },
  { key: 'protanopia', labelKey: 'result.eyesProtan' },
  { key: 'deuteranopia', labelKey: 'result.eyesDeutan' },
  { key: 'tritanopia', labelKey: 'result.eyesTritan' },
  { key: 'achromatopsia', labelKey: 'result.eyesMono' },
];

export function EyesSwitcher() {
  const { t } = useLang();
  // 第 4 版转换图（标准答案 29）：五种视角下数字可见性差异最直观
  const question = useMemo(() => getQuestions('standard').find((q) => q.answer === '29'), []);
  const [view, setView] = useState('none');

  if (!question) return null;

  return (
    <div className="card stack" id="eyes-switcher" style={{ gap: 'var(--s-3)' }}>
      <div className="row between" style={{ flexWrap: 'wrap', gap: 'var(--s-2)' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>{t('result.eyesTitle')}</h3>
        <span className="chip">{t('result.eyesMeta', { n: question.plate, a: question.answer })}</span>
      </div>
      <div className="row" role="tablist" aria-label={t('result.eyesAria')} style={{ gap: 'var(--s-2)', flexWrap: 'wrap' }}>
        {VIEWS.map((v) => (
          <button
            type="button"
            key={v.key}
            role="tab"
            aria-selected={view === v.key}
            className={`btn ${view === v.key ? 'btn-primary' : 'btn-ghost'}`}
            style={{ height: 34, fontSize: '0.82rem', padding: '0 12px' }}
            onClick={() => setView(v.key)}
          >
            {t(v.labelKey)}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 340, marginInline: 'auto', width: '100%' }}>
        <IshiharaPlate type={question.type} text={question.answer} seed={question.plate} cvd={view} maxWidth={340} />
      </div>
      <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
        {t('result.eyesHint')}
      </p>
    </div>
  );
}
