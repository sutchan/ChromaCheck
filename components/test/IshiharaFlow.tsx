// components/test/IshiharaFlow.tsx — 石原氏答题流程（独立组件，供标准/进阶模式复用）
// chromacheck v1.14.0
'use client';

import React, { useEffect, useRef } from 'react';
import type { AnswerRecord, Question } from '@/lib/types';
import { CHAPTERS } from '@/lib/fun';
import { loc } from '@/lib/fun';
import { IshiharaPlate } from './IshiharaPlate';
import { TestProgress } from './TestProgress';
import { Numpad } from './Numpad';
import { useIshiharaFlow } from './useIshiharaFlow';
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
  id = 'ishihara-flow',
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
  /** 根容器语义 id（TestRunner 以 runKey 区分重挂载实例） */
  id?: string;
}) {
  const { t, lang } = useLang();
  const f = useIshiharaFlow({ questions, initial, funMode, onProgress, onDone, lang });
  const { q, total, input, reveal, recorded, milestone, pulse, pausedChapter, idx } = f;

  // 实体键盘输入：输入框未聚焦时，将数字键 / 退格 / 回车路由到作答逻辑，
  // 使「用物理键盘直接输入数字」无需先点输入框。聚焦输入框时交由原生处理。
  const apiRef = useRef(f);
  apiRef.current = f;
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const api = apiRef.current;
      const ae = document.activeElement as HTMLElement | null;
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return;
      if (/^[0-9]$/.test(e.key)) {
        if (api.reveal || api.recorded) return;
        e.preventDefault();
        api.appendDigit(e.key);
      } else if (e.key === 'Backspace') {
        if (api.reveal || api.recorded) return;
        e.preventDefault();
        api.backspace();
      } else if (e.key === 'Enter') {
        if (api.reveal) {
          e.preventDefault();
          api.advanceFromReveal();
        } else if (!api.recorded) {
          e.preventDefault();
          api.submit();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
    <div className="stack" id={id} style={{ gap: 'var(--s-4)' }}>
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
          <p className="muted" style={{ margin: 0, fontSize: '0.8rem', textAlign: 'center' }}>
            {t('test.keyboardHint')}
          </p>
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
