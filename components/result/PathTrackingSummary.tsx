// components/result/PathTrackingSummary.tsx — 路径追踪结果摘要
// chromacheck v1.9.0
'use client';

import React from 'react';
import type { PathTrackingResult } from '@/lib/types';
import { Icon } from '@/components/common/Icon';
import { t, type DictKey, type Lang } from '@/lib/i18n';
import { useLang } from '@/components/layout/LangProvider';

const KIND_KEY: Record<string, DictKey> = {
  'path-1': 'test.kindS',
  'path-2': 'test.kindSpiral',
  'path-3': 'test.kindZigzag',
};

export function PathTrackingSummary({ results }: { results: PathTrackingResult[] }) {
  const { t } = useLang();
  const passed = results.filter((r) => r.passed).length;
  return (
    <div className="card stack" id="path-summary" style={{ gap: 'var(--s-3)' }}>
      <div className="row between">
        <h3 style={{ margin: 0, fontSize: '1rem' }}>{t('result.pathTitle')}</h3>
        <span className={`chip ${passed === results.length ? 'chip-ok' : 'chip-risk'}`}>
          {t('result.pathPassed', { p: passed, t: results.length })}
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--fg-mute)' }}>
              <th style={th}>{t('result.pathQuestion')}</th>
              <th style={th}>{t('result.pathOverlap')}</th>
              <th style={th}>{t('result.pathVerdict')}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.questionId} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={td}>{KIND_KEY[r.questionId] ? t(KIND_KEY[r.questionId]) : r.questionId}</td>
                <td style={{ ...td, fontFamily: 'var(--font-mono)' }}>{r.overlapScore}%</td>
                <td style={{ ...td, color: r.passed ? 'var(--ok)' : 'var(--risk)' }}>
                  <span className="row" style={{ gap: 4, justifyContent: 'flex-start' }}>
                    <Icon name={r.passed ? 'check' : 'x'} size={15} /> {r.passed ? t('result.pathNormal') : t('result.pathAbnormal')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
        {t('result.pathHint')}
      </p>
    </div>
  );
}

const th: React.CSSProperties = { padding: '8px 10px', fontWeight: 600, whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '8px 10px', whiteSpace: 'nowrap' };
