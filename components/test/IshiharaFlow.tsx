// components/test/IshiharaFlow.tsx — 石原氏答题流程（独立组件，供标准/进阶模式复用）
// chromacheck v1.9.0
'use client';

import React from 'react';
import type { AnswerRecord, Question } from '@/lib/types';
import { CHAPTERS } from '@/lib/fun';
import { loc } from '@/lib/fun';
import { IshiharaPlate } from './IshiharaPlate';
import { TestProgress } from './TestProgress';
import { Numpad } from './Numpad';
import { ProgressDots, ChapterCard } from './FunBits';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';

function figureText(q: Question): string {
  // 隐藏题对正常视觉应呈现为“空白图版”，不绘制数字，避免误判
  return q.type === 'hidden' ? '' : q.answer;
}

export function IshiharaFlow({
  questions,
  initial,
  funMode = false,
  onProgress,
  onDone,
}: {
  questions: Question[];
  /** 恢复进行中的进度（index 为下一题索引） */
  initial?: { index: number; answers: AnswerRecord[] };
  /** 趣味体验开关（控制章末过渡与里程碑仪式感；中性反馈恒开） */
  funMode?: boolean;
  /** 每次作答后回调（index 为下一题索引），由外层决定是否持久化 */
  onProgress?: (index: number, answers: AnswerRecord[]) => void;
  /** 全部作答完成 */
  onDone: (answers: AnswerRecord[]) => void;
}) {
  const { t, lang } = useLang();
  const f = useIshiharaFlow({ questions, initial, funMode, onProgress, onDone, lang });
  const { q, total, input, reveal, recorded, milestone, pulse, pausedChapter, idx } = f;

  if (pausedChapter !== null) {
    return (
      <ChapterCard
        chapter={CHAPTERS[pausedChapter]}
        chapterNo={pausedChapter}
        total={total}
        index={idx}
        onContinue={f.continueChapter}
      />
    );
  }

  return (
    <div className="stack" id="ishihara-flow" style={{ gap: 'var(--s-4)' }}>
      <TestProgress index={idx} total={total} current={q} />

      <div className="row between" style={{ flexWrap: 'wrap', gap: 'var(--s-2)' }}>
        <ProgressDots total={total} index={idx} pulse={pulse} id="progress-dots" />
        {milestone ? (
          <span className="chip chip-ok" role="status" style={{ fontSize: '0.8rem' }}>{milestone}</span>
        ) : null}
      </div>

      <div className="card stack" style={{ alignItems: 'center', gap: 'var(--s-4)' }}>
        <IshiharaPlate type={q.type} text={figureText(q)} seed={q.plate} maxWidth={400} />
        <p className="muted" style={{ margin: 0, fontSize: '0.9rem', textAlign: 'center' }}>
          {t('test.ishiharaPrompt')}
        </p>
      </div>

      {reveal ? (
        <div className="card stack" style={{ borderColor: reveal.correct ? 'var(--ok)' : 'var(--warn)' }}>
          <div className="row" style={{ gap: 'var(--s-2)' }}>
            <Icon name={reveal.correct ? 'check' : 'info'} size={20} style={{ color: reveal.correct ? 'var(--ok)' : 'var(--warn)' }} />
            <strong>{reveal.correct ? t('test.revealCorrect') : t('test.revealDemo')}</strong>
          </div>
          <p style={{ margin: 0 }}>
            {t('test.revealExpected', { d: reveal.expected || t('test.revealNone') })}
            {t('test.revealDemoNote')}
          </p>
          <button type="button" className="btn btn-primary btn-block" onClick={f.advanceFromReveal}>
            {idx + 1 < total ? (
              <>
                {t('test.continue')} <Icon name="arrowRight" size={18} />
              </>
            ) : (
              t('test.finish')
            )}
          </button>
        </div>
      ) : (
        <div className="stack" style={{ gap: 'var(--s-3)' }}>
          <input
            id="answer"
            className="field"
            value={recorded ? t('test.recorded') : input}
            inputMode="numeric"
            placeholder={t('test.answerPlaceholder')}
            aria-label={t('test.answerAria')}
            disabled={recorded}
            onChange={(e) => f.setInput(e.target.value.replace(/\D/g, '').slice(0, 3))}
            onKeyDown={(e) => e.key === 'Enter' && f.submit()}
          />
          <Numpad onDigit={f.appendDigit} onBackspace={f.backspace} onClear={f.clearInput} />
          <div className="row" style={{ gap: 'var(--s-3)' }}>
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={f.submit} disabled={input.trim() === '' || recorded}>
              {t('test.submit')}
            </button>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={f.markUnclear} disabled={recorded}>
              {t('test.unclear')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
