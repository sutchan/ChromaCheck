// components/result/ResultSummary.tsx — 判读总览
// chromacheck v1.0.0
'use client';

import React from 'react';
import { uiText } from '@/lib/scoring';
import { formatDate, formatDuration } from '@/lib/format';
import type { Overall, TestResult } from '@/lib/types';
import { Icon } from '@/components/common/Icon';

const OVERALL_TONE: Record<Overall, string> = {
  normal: 'chip-ok',
  suspected_deficiency: 'chip-warn',
  suspected_blindness: 'chip-risk',
  inconclusive: 'chip-warn',
};

export function ResultSummary({ result }: { result: TestResult }) {
  const { ishihara, overall, type, severity, confidence, testMode, createdAt, durationMs, device } = result;
  const title = uiText.overall(overall);
  const sub = type ? `${uiText.type(type)}${severity ? ` · ${uiText.severity(severity)}` : ''}` : overall === 'normal' ? '未见明显异常' : '需进一步确认';
  return (
    <div className="card stack" id="result-summary" style={{ gap: 'var(--s-4)' }}>
      <div className="row between" style={{ flexWrap: 'wrap', gap: 'var(--s-3)' }}>
        <div className="stack" style={{ gap: 'var(--s-2)' }}>
          <span className={`chip ${OVERALL_TONE[overall]}`}>{title}</span>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{sub}</h1>
          <span className="muted" style={{ fontSize: '0.92rem' }}>
            {uiText.mode(testMode)} · {formatDate(createdAt)}
          </span>
        </div>
        <div className="row" style={{ gap: 'var(--s-5)' }}>
          <div className="stat">
            <span className="stat-k">置信度</span>
            <span className="stat-v" style={{ color: 'var(--brand)' }}>{confidence}%</span>
          </div>
        </div>
      </div>

      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))' }}>
        <div className="card" style={{ padding: 'var(--s-4)', boxShadow: 'none', background: 'var(--bg-sunken)' }}>
          <div className="stat-k">正确题数</div>
          <div className="stat-v">{ishihara.details.correctCount}/{ishihara.details.totalCount}</div>
        </div>
        <div className="card" style={{ padding: 'var(--s-4)', boxShadow: 'none', background: 'var(--bg-sunken)' }}>
          <div className="stat-k">用时</div>
          <div className="stat-v" style={{ fontSize: '1.2rem' }}>{formatDuration(durationMs)}</div>
        </div>
        <div className="card" style={{ padding: 'var(--s-4)', boxShadow: 'none', background: 'var(--bg-sunken)' }}>
          <div className="stat-k">设备</div>
          <div className="stat-v" style={{ fontSize: '0.95rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="device" size={16} /> {device || '—'}
          </div>
        </div>
      </div>

      <p style={{ margin: 0 }}>{result.analysis}</p>
      <span className="muted" style={{ fontSize: '0.85rem' }}>{result.confidenceNote}</span>
    </div>
  );
}
