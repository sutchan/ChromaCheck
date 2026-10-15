// components/result/DimScenes.tsx — 三轴互动科普（点维度展开日常生活影响）
// chromacheck v1.9.0
'use client';

import React, { useState } from 'react';
import type { AxisKey } from '@/lib/types';
import { DIM_SCENES, loc } from '@/lib/fun';
import { t, type DictKey } from '@/lib/i18n';
import { useLang } from '@/components/layout/LangProvider';

const AXES: { key: AxisKey; labelKey: DictKey; color: string }[] = [
  { key: 'protan', labelKey: 'analysis.axisProtan', color: 'var(--axis-protan, #c9543a)' },
  { key: 'deutan', labelKey: 'analysis.axisDeutan', color: 'var(--axis-deutan, #4f7c46)' },
  { key: 'tritan', labelKey: 'analysis.axisTritan', color: 'var(--axis-tritan, #3d6fb4)' },
];

export function DimScenes() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<AxisKey | null>(null);

  return (
    <div className="card stack" id="dim-scenes" style={{ gap: 'var(--s-2)' }}>
      <h3 style={{ margin: 0, fontSize: '1rem' }}>{t('result.dimTitle')}</h3>
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
                  <span style={{ fontSize: '0.9rem' }}>{t(a.labelKey)}</span>
                </span>
                <span aria-hidden style={{ fontSize: '0.8rem' }}>{expanded ? t('result.dimCollapse') : t('result.dimExpand')}</span>
              </button>
              {expanded ? (
                <div id={`dim-panel-${a.key}`} role="region" aria-label={loc(scene.title, lang)} className="stack" style={{ gap: 6, padding: '4px 6px 8px' }}>
                  <strong style={{ fontSize: '0.88rem' }}>{loc(scene.title, lang)}</strong>
                  <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 4 }}>
                    {scene.items.map((it, i) => (
                      <li key={i} className="muted" style={{ fontSize: '0.86rem' }}>{loc(it, lang)}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>
        {t('result.dimHint')}
      </p>
    </div>
  );
}
