// components/home/CvdSimulator.tsx — 色觉模拟交互
// chromacheck v1.0.0
'use client';

import React, { useState } from 'react';
import { IshiharaPlate } from '@/components/test/IshiharaPlate';
import { QUESTIONS } from '@/lib/questions';

const OPTIONS = [
  { value: 'none', label: '正常色觉' },
  { value: 'protanopia', label: '红色觉异常' },
  { value: 'deuteranopia', label: '绿色觉异常' },
  { value: 'tritanopia', label: '蓝色觉异常' },
];

export function CvdSimulator() {
  const [cvd, setCvd] = useState('none');
  const sample = QUESTIONS[3]; // 转换题，差异最明显
  return (
    <div className="card stack" style={{ gap: 'var(--s-4)', alignItems: 'center' }}>
      <div className="stack" style={{ gap: 4, alignItems: 'center', textAlign: 'center' }}>
        <h3 style={{ margin: 0 }}>看看不同色觉看到的世界</h3>
        <span className="muted" style={{ fontSize: '0.9rem' }}>
          同一张检测图，切换不同色觉类型，观察数字是否“消失”或“变形”。
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
            {o.label}
          </button>
        ))}
      </div>
      <span className="muted" style={{ fontSize: '0.78rem' }}>
        基于 Viénot–Brettel 模型的近似模拟，仅供直观理解。
      </span>
    </div>
  );
}
