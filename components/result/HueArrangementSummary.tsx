// components/result/HueArrangementSummary.tsx — 色相排列结果摘要
// chromacheck v1.9.0
'use client';

import React from 'react';
import type { HueArrangementResult } from '@/lib/types';
import { D15_CAPS, D15_FIXED } from '@/lib/questions/hue-arrangement';
import { type DictKey } from '@/lib/i18n';
import { useLang } from '@/components/layout/LangProvider';

/** 与 lib/hue-scoring.ts 阈值一致（< 20 正常，20–40 轻度，> 40 明显） */
function verdict(tes: number, t: (key: DictKey, vars?: Record<string, string | number>) => string): { chip: string; label: string } {
  if (tes < 20) return { chip: 'chip-ok', label: t('result.verdictNormal') };
  if (tes <= 40) return { chip: 'chip-warn', label: t('result.verdictMild') };
  return { chip: 'chip-risk', label: t('result.verdictObvious') };
}

export function HueArrangementSummary({ result }: { result: HueArrangementResult }) {
  const { t } = useLang();
  const v = verdict(result.totalErrorScore, t);
  // 展示用户最终排列：左参考 + 15 张 + 右参考
  const strip = [D15_FIXED[0], ...result.order.map((i) => D15_CAPS[i]), D15_FIXED[1]];
  return (
    <div className="card stack" id="hue-summary" style={{ gap: 'var(--s-3)' }}>
      <div className="row between" style={{ flexWrap: 'wrap', gap: 'var(--s-2)' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>{t('result.hueTitle')}</h3>
        <span className={`chip ${v.chip}`}>{v.label}</span>
      </div>

      <div className="row" style={{ gap: 'var(--s-4)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="stat">
          <span className="stat-k">{t('result.tesTotal')}</span>
          <span className="stat-v" style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)' }}>
            {result.totalErrorScore}
          </span>
        </div>
        <div className="stat">
          <span className="stat-k">{t('result.deviation')}</span>
          <span className="stat-v" style={{ fontSize: '0.95rem' }}>
            {result.deviationDirection === 'none'
              ? t('result.devNone')
              : result.deviationDirection === 'tritan'
                ? t('result.devTritan')
                : t('result.devDeutan')}
          </span>
        </div>
      </div>

      <div>
        <div className="stat-k" style={{ marginBottom: 6 }}>{t('result.yourOrder')}</div>
        <div className="row" id="hue-strip" style={{ gap: 4, flexWrap: 'wrap' }}>
          {strip.map((c, i) => (
            <span
              key={i}
              aria-hidden
              title={i === 0 || i === strip.length - 1 ? t('result.refCard') : t('result.cardN', { n: i })}
              style={{ width: 30, height: 30, borderRadius: 8, background: c, boxShadow: 'var(--sh-1)' }}
            />
          ))}
        </div>
      </div>

      <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
        {t('result.hueHint')}
      </p>
    </div>
  );
}
