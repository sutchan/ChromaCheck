// components/result/AnswerReview.tsx — 逐题明细
// chromacheck v1.0.0
'use client';

import React from 'react';
import { getQuestion, TYPE_LABEL } from '@/lib/questions';
import type { AnswerRecord } from '@/lib/types';
import { Icon } from '@/components/common/Icon';

type Status = 'ok' | 'wrong' | 'none' | 'flag';

function classify(a: AnswerRecord): { status: Status; expected: string } {
  const q = getQuestion(a.questionId);
  if (!q) return { status: 'none', expected: '' };
  if (q.type === 'hidden') {
    if (a.userAnswer === '') return { status: 'ok', expected: '（无数字）' };
    if (a.userAnswer === q.protan) return { status: 'flag', expected: q.protan };
    return { status: 'wrong', expected: q.protan };
  }
  if (a.userAnswer === '') return { status: 'none', expected: q.answer };
  if (a.userAnswer === q.answer) return { status: 'ok', expected: q.answer };
  return { status: 'wrong', expected: q.answer };
}

const STATUS_META: Record<Status, { color: string; label: string; icon: string }> = {
  ok: { color: 'var(--ok)', label: '正确', icon: 'check' },
  wrong: { color: 'var(--risk)', label: '异常', icon: 'x' },
  none: { color: 'var(--fg-mute)', label: '看不清', icon: 'eye' },
  flag: { color: 'var(--warn)', label: '见隐藏数', icon: 'alert' },
};

export function AnswerReview({ answers }: { answers: AnswerRecord[] }) {
  return (
    <div className="card" id="answer-review">
      <h3 style={{ marginBottom: 'var(--s-3)', fontSize: '1rem' }}>逐题明细（{answers.length} 题）</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--fg-mute)' }}>
              <th style={th}>图版</th>
              <th style={th}>题型</th>
              <th style={th}>你的答案</th>
              <th style={th}>标准</th>
              <th style={th}>判读</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((a, i) => {
              const q = getQuestion(a.questionId);
              const { status, expected } = classify(a);
              const m = STATUS_META[status];
              return (
                <tr key={a.questionId} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={td}>#{q?.plate ?? i + 1}</td>
                  <td style={td}>{q ? TYPE_LABEL[q.type] : ''}</td>
                  <td style={{ ...td, fontFamily: 'var(--font-mono)' }}>{a.userAnswer || '—'}</td>
                  <td style={{ ...td, fontFamily: 'var(--font-mono)' }}>{expected}</td>
                  <td style={{ ...td, color: m.color }}>
                    <span className="row" style={{ gap: 4, justifyContent: 'flex-start' }}>
                      <Icon name={m.icon} size={15} /> {m.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding: '8px 10px', fontWeight: 600, whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '8px 10px', whiteSpace: 'nowrap' };
