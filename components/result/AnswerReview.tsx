// components/result/AnswerReview.tsx — 逐题明细
// chromacheck v1.9.0
'use client';

import React from 'react';
import { getQuestion } from '@/lib/questions';
import type { AnswerRecord, PlateType } from '@/lib/types';
import { Icon } from '@/components/common/Icon';
import { type DictKey } from '@/lib/i18n';
import { useLang } from '@/components/layout/LangProvider';

type Status = 'ok' | 'wrong' | 'none' | 'flag';

const TYPE_LABEL_KEY: Record<PlateType, DictKey> = {
  demonstration: 'test.typeLabel.demonstration',
  normal: 'test.typeLabel.normal',
  transformation: 'test.typeLabel.transformation',
  vanishing: 'test.typeLabel.vanishing',
  hidden: 'test.typeLabel.hidden',
  classification: 'test.typeLabel.classification',
};

function classify(a: AnswerRecord, t: (key: DictKey, vars?: Record<string, string | number>) => string): { status: Status; expected: string } {
  const q = getQuestion(a.questionId);
  if (!q) return { status: 'none', expected: '' };
  if (q.type === 'hidden') {
    if (a.userAnswer === '') return { status: 'ok', expected: t('result.reviewNone') };
    if (a.userAnswer === q.protan) return { status: 'flag', expected: q.protan };
    return { status: 'wrong', expected: q.protan };
  }
  if (a.userAnswer === '') return { status: 'none', expected: q.answer };
  if (a.userAnswer === q.answer) return { status: 'ok', expected: q.answer };
  return { status: 'wrong', expected: q.answer };
}

const STATUS_META: Record<Status, { color: string; icon: string }> = {
  ok: { color: 'var(--ok)', icon: 'check' },
  wrong: { color: 'var(--risk)', icon: 'x' },
  none: { color: 'var(--fg-mute)', icon: 'eye' },
  flag: { color: 'var(--warn)', icon: 'alert' },
};

const STATUS_KEY: Record<Status, DictKey> = {
  ok: 'result.reviewCorrect',
  wrong: 'result.reviewAbnormal',
  none: 'result.reviewUnclear',
  flag: 'result.reviewHidden',
};

export function AnswerReview({ answers }: { answers: AnswerRecord[] }) {
  const { t } = useLang();
  return (
    <div className="card" id="answer-review">
      <h3 style={{ marginBottom: 'var(--s-3)', fontSize: '1rem' }}>{t('result.reviewTitle', { n: answers.length })}</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--fg-mute)' }}>
              <th style={th}>{t('result.reviewPlate')}</th>
              <th style={th}>{t('result.reviewType')}</th>
              <th style={th}>{t('result.reviewYour')}</th>
              <th style={th}>{t('result.reviewStandard')}</th>
              <th style={th}>{t('result.reviewVerdict')}</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((a, i) => {
              const q = getQuestion(a.questionId);
              const { status, expected } = classify(a, t);
              const m = STATUS_META[status];
              return (
                <tr key={a.questionId} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={td}>#{q?.plate ?? i + 1}</td>
                  <td style={td}>{q ? t(TYPE_LABEL_KEY[q.type]) : ''}</td>
                  <td style={{ ...td, fontFamily: 'var(--font-mono)' }}>{a.userAnswer || t('result.reviewNa')}</td>
                  <td style={{ ...td, fontFamily: 'var(--font-mono)' }}>{expected}</td>
                  <td style={{ ...td, color: m.color }}>
                    <span className="row" style={{ gap: 4, justifyContent: 'flex-start' }}>
                      <Icon name={m.icon} size={15} /> {t(STATUS_KEY[status])}
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
