// components/result/EyesSwitcher.tsx — 换一双眼睛：第 4 版转换图五种色觉视角切换
// chromacheck v1.4.0
'use client';

import React, { useMemo, useState } from 'react';
import { getQuestions } from '@/lib/questions';
import { IshiharaPlate } from '@/components/test/IshiharaPlate';

const VIEWS: { key: string; label: string }[] = [
  { key: 'none', label: '正常视觉' },
  { key: 'protanopia', label: '红色盲视角' },
  { key: 'deuteranopia', label: '绿色盲视角' },
  { key: 'tritanopia', label: '蓝色盲视角' },
  { key: 'achromatopsia', label: '全色盲视角' },
];

export function EyesSwitcher() {
  // 第 4 版转换图（标准答案 29）：五种视角下数字可见性差异最直观
  const question = useMemo(() => getQuestions('standard').find((q) => q.answer === '29'), []);
  const [view, setView] = useState('none');

  if (!question) return null;

  return (
    <div className="card stack" id="eyes-switcher" style={{ gap: 'var(--s-3)' }}>
      <div className="row between" style={{ flexWrap: 'wrap', gap: 'var(--s-2)' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>换一双眼睛</h3>
        <span className="chip">第 {question.plate} 版 · 标准答案 {question.answer}</span>
      </div>
      <div className="row" role="tablist" aria-label="色觉视角切换" style={{ gap: 'var(--s-2)', flexWrap: 'wrap' }}>
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
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 340, marginInline: 'auto', width: '100%' }}>
        <IshiharaPlate type={question.type} text={question.answer} seed={question.plate} cvd={view} maxWidth={340} />
      </div>
      <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
        同一张图在不同色觉视角下的样子。切换视角仅供理解色觉差异，不代表你的检测结果。
      </p>
    </div>
  );
}
