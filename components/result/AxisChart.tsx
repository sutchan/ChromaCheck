// components/result/AxisChart.tsx — 异常维度条形图
// chromacheck v1.0.0
'use client';

import React from 'react';
import type { DiagnosisDimension } from '@/lib/types';

const AXES: { key: keyof DiagnosisDimension; label: string; color: string }[] = [
  { key: 'protan', label: '红色觉轴', color: 'var(--axis-protan)' },
  { key: 'deutan', label: '绿色觉轴', color: 'var(--axis-deutan)' },
  { key: 'tritan', label: '蓝色觉轴', color: 'var(--axis-tritan)' },
];

export function AxisChart({ dimensions }: { dimensions: DiagnosisDimension }) {
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
      <h3 style={{ marginBottom: 'var(--s-3)', fontSize: '1rem' }}>异常维度分布</h3>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="异常维度分布图">
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
              <text x={x + bw / 2} y={H - 14} fontSize={11} textAnchor="middle" fill="var(--fg-soft)">{a.label}</text>
            </g>
          );
        })}
      </svg>
      <p className="muted" style={{ fontSize: '0.8rem', margin: 'var(--s-2) 0 0' }}>
        数值越高表示该轴异常倾向越明显，仅供参考。
      </p>
    </div>
  );
}
