'use client';
// components/test/ChildRunner.tsx — 儿童模式答题流程（图形选项，不显示对错）
// chromacheck v1.9.0
import React, { useMemo, useState } from 'react';
import {
  getChildQuestions,
  SHAPE_LABEL,
  SHAPE_LABEL_EN,
  type ChildAnswerValue,
  type ChildShape,
} from '@/lib/questions/child';
import type { ChildAnswer } from '@/lib/child-scoring';
import { useLang } from '@/components/layout/LangProvider';
import { ChildPlate } from './ChildPlate';
import { ChildShapeIcon } from './ChildShapeIcon';

export interface ChildRunnerProps {
  /** 全部作答完成后回调（含每题作答与用时） */
  onDone: (answers: ChildAnswer[]) => void;
}

export function ChildRunner({ onDone }: ChildRunnerProps) {
  const questions = useMemo(() => getChildQuestions(), []);
  const [answers, setAnswers] = useState<ChildAnswer[]>([]);
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const { lang, t } = useLang();
  const labels = lang === 'en' ? SHAPE_LABEL_EN : SHAPE_LABEL;

  const index = answers.length;
  const current = questions[index];

  function choose(value: ChildAnswerValue): void {
    if (!current) return;
    const next: ChildAnswer[] = [
      ...answers,
      { questionId: current.id, value, durationMs: Math.max(0, Date.now() - startedAt) },
    ];
    setAnswers(next);
    setStartedAt(Date.now());
    if (next.length >= questions.length) onDone(next);
  }

  if (!current) {
    return (
      <div id="child-runner" className="stack" style={{ gap: 'var(--s-3)', textAlign: 'center' }}>
        <p className="muted" style={{ margin: 0 }}>{t('child.saving')}</p>
      </div>
    );
  }

  return (
    <div id="child-runner" className="stack" style={{ gap: 'var(--s-4)' }}>
      <div className="row between" style={{ alignItems: 'center' }}>
        <span className="chip">{t('child.progress', { n: index + 1, total: questions.length })}</span>
        <span className="muted" style={{ fontSize: '0.85rem' }}>
          {current.demo ? t('child.demo') : t('child.pickShape')}
        </span>
      </div>

      <div id="child-plate" aria-live="polite">
        <ChildPlate type={current.type} shape={current.shape} seed={current.plate} />
      </div>

      <div
        id="child-options"
        role="group"
        aria-label={t('child.optionsLabel')}
        className="grid-cards"
        style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))' }}
      >
        {current.options.map((shape: ChildShape) => (
          <button
            key={shape}
            type="button"
            className="btn"
            onClick={() => choose(shape)}
            style={{ flexDirection: 'column', gap: 'var(--s-1)', paddingBlock: 'var(--s-3)' }}
          >
            <ChildShapeIcon shape={shape} size={34} />
            <span style={{ fontSize: '0.9rem' }}>{labels[shape]}</span>
          </button>
        ))}
        <button
          type="button"
          className="btn"
          onClick={() => choose('none')}
          style={{ flexDirection: 'column', gap: 'var(--s-1)', paddingBlock: 'var(--s-3)' }}
        >
          <span aria-hidden style={{ fontSize: '1.6rem', lineHeight: 1.4 }}>
            ∅
          </span>
          <span style={{ fontSize: '0.9rem' }}>{labels.none}</span>
        </button>
      </div>
    </div>
  );
}
