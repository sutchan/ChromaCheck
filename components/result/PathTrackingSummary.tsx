// components/result/PathTrackingSummary.tsx — 路径追踪结果摘要
// chromacheck v1.1.0
'use client';

import React from 'react';
import type { PathTrackingResult } from '@/lib/types';
import { Icon } from '@/components/common/Icon';

const KIND_LABEL: Record<string, string> = {
  'path-1': 'S 形路径',
  'path-2': '螺旋路径',
  'path-3': '之字形路径',
};

export function PathTrackingSummary({ results }: { results: PathTrackingResult[] }) {
  const passed = results.filter((r) => r.passed).length;
  return (
    <div className="card stack" id="path-summary" style={{ gap: 'var(--s-3)' }}>
      <div className="row between">
        <h3 style={{ margin: 0, fontSize: '1rem' }}>路径追踪结果</h3>
        <span className={`chip ${passed === results.length ? 'chip-ok' : 'chip-risk'}`}>
          {passed}/{results.length} 通过
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--fg-mute)' }}>
              <th style={th}>题目</th>
              <th style={th}>重合度</th>
              <th style={th}>判读</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.questionId} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={td}>{KIND_LABEL[r.questionId] ?? r.questionId}</td>
                <td style={{ ...td, fontFamily: 'var(--font-mono)' }}>{r.overlapScore}%</td>
                <td style={{ ...td, color: r.passed ? 'var(--ok)' : 'var(--risk)' }}>
                  <span className="row" style={{ gap: 4, justifyContent: 'flex-start' }}>
                    <Icon name={r.passed ? 'check' : 'x'} size={15} /> {r.passed ? '正常' : '异常'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
        重合度 ≥ 70% 视为描线准确（正常）；低于阈值提示对红/绿色点的区分存在困难。
      </p>
    </div>
  );
}

const th: React.CSSProperties = { padding: '8px 10px', fontWeight: 600, whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '8px 10px', whiteSpace: 'nowrap' };
