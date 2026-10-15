// components/result/AxisChart.tsx — 异常维度条形图
// chromacheck v1.9.0
'use client';

import React from 'react';
import type { DiagnosisDimension } from '@/lib/types';
import { t, type DictKey } from '@/lib/i18n';
import { useLang } from '@/components/layout/LangProvider';

const AXES: { key: keyof DiagnosisDimension; labelKey: DictKey; color: string }[] = [
  { key: 'protan', labelKey: 'result.axisProtan', color: 'var(--axis-protan)' },
  { key: 'deutan', labelKey: 'result.axisDeutan', color: 'var(--axis-deutan)' },
  { key: 'tritan', labelKey: 'result.axisTritan', color: 'var(--axis-tritan)' },
];

export function AxisChart({ dimensions }: { dimensions: DiagnosisDimension }) {
  const { t } = useLang();
  const W = 320;
  const H = 200;
  const padX = 28;
  const padTop = 24;
  const padBottom = 40;
  const bw = 56;
  const gap = (W - padX * 2 - bw * 3) / 2;
  const maxH = H - padTop - padBottom;

  return (
    <div className="card" id="axis-chart" style={{ boxShadow: 'var(--sh-1)' }}>
      <h3 style={{ marginBottom: 'var(--s-3)', fontSize: '1rem' }}>{t('result.axisTitle')}</h3>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={t('result.axisAria')}>
        {[0, 25, 50, 75, 100].map((g) => {
          const y = padTop + maxH - (g / 100) * maxH;
          return (
            <g key={g}>
              <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="var(--border)" strokeWidth={1} />
              <text x={4} y={y + 4} fontSize={10} fill="var(--fg-mute)">{g}</text>
            </g>
          );
        })}
        {AXES.map((a, i) => {
          const v = dimensions[a.key];
          const x = padX + i * (bw + gap);
          const h = (v / 100) * maxH;
          const y = padTop + maxH - h;
          return (
            <g key={a.key}>
              <rect x={x} y={y} width={bw} height={h} rx={6} fill={a.color} />
              <text x={x + bw / 2} y={y - 6} fontSize={13} fontWeight={700} textAnchor="middle" fill="var(--fg)">{v}</text>
              <text x={x + bw / 2} y={H - 14} fontSize={11} textAnchor="middle" fill="var(--fg-soft)">{t(a.labelKey)}</text>
            </g>
          );
        })}
      </svg>
      <p className="muted" style={{ fontSize: '0.8rem', margin: 'var(--s-2) 0 0' }}>
        {t('result.axisHint')}
      </p>
    </div>
  );
}
