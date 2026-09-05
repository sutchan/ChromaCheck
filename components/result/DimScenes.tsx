// components/result/DimScenes.tsx — 三轴互动科普（点维度展开日常生活影响）
// chromacheck v1.4.0
'use client';

import React, { useState } from 'react';
import type { AxisKey } from '@/lib/types';
import { DIM_SCENES } from '@/lib/fun';

const AXES: { key: AxisKey; label: string; color: string }[] = [
  { key: 'protan', label: '红色觉', color: 'var(--axis-protan, #c9543a)' },
  { key: 'deutan', label: '绿色觉', color: 'var(--axis-deutan, #4f7c46)' },
  { key: 'tritan', label: '蓝色觉', color: 'var(--axis-tritan, #3d6fb4)' },
];

export function DimScenes() {
  const [open, setOpen] = useState<AxisKey | null>(null);

  return (
    <div className="card stack" id="dim-scenes" style={{ gap: 'var(--s-2)' }}>
      <h3 style={{ margin: 0, fontSize: '1rem' }}>三轴与日常生活</h3>
      <div className="stack" style={{ gap: 'var(--s-2)' }}>
        {AXES.map((a) => {
          const scene = DIM_SCENES[a.key];
          const expanded = open === a.key;
          return (
            <div key={a.key} className="stack" style={{ gap: 6 }}>
              <button
                type="button"
                id={`dim-toggle-${a.key}`}
                aria-expanded={expanded}
                aria-controls={`dim-panel-${a.key}`}
                className="row between"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--r-md, 10px)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-sunken)',
                  cursor: 'pointer',
                  color: 'var(--fg)',
                }}
                onClick={() => setOpen(expanded ? null : a.key)}
              >
                <span className="row" style={{ gap: 8 }}>
                  <span aria-hidden style={{ width: 10, height: 10, borderRadius: '50%', background: a.color }} />
                  <span style={{ fontSize: '0.9rem' }}>{a.label}</span>
                </span>
                <span aria-hidden style={{ fontSize: '0.8rem' }}>{expanded ? '收起 ▲' : '展开 ▼'}</span>
              </button>
              {expanded ? (
                <div id={`dim-panel-${a.key}`} role="region" aria-label={scene.title} className="stack" style={{ gap: 6, padding: '4px 6px 8px' }}>
                  <strong style={{ fontSize: '0.88rem' }}>{scene.title}</strong>
                  <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 4 }}>
                    {scene.items.map((it, i) => (
                      <li key={i} className="muted" style={{ fontSize: '0.86rem' }}>{it}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>
        科普内容为普遍性描述，仅供参考，不构成对个人结果的解读。
      </p>
    </div>
  );
}
