// components/test/TestRunner.tsx — 标准/快速版石原氏测试运行器
// chromacheck v1.9.0
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AnswerRecord } from '@/lib/types';
import { getQuestions } from '@/lib/questions';
import { computeResult } from '@/lib/scoring';
import { saveResult, loadProgress, saveProgress, clearProgress } from '@/lib/storage';
import { detectDevice } from '@/lib/format';
import { CHAPTERS } from '@/lib/fun';
import { useIshiharaFlow } from './useIshiharaFlow';
import { IshiharaPlate } from './IshiharaPlate';
import { TestProgress } from './TestProgress';
import { Numpad } from './Numpad';
import { ProgressDots, ChapterCard } from './FunBits';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';
import { useSettings } from '@/components/layout/ThemeProvider';
import { useLang } from '@/components/layout/LangProvider';

function figureText(q: { type: string; answer: string }): string {
  return q.type === 'hidden' ? '' : q.answer;
}

export function TestRunner({ mode }: { mode: 'standard' | 'quick' }) {
  const router = useRouter();
  const { t, lang } = useLang();
  const { settings } = useSettings();
  const ishiharaQuestions = useMemo(() => getQuestions(mode), [mode]);
  const [initial, setInitial] = useState<{ index: number; answers: AnswerRecord[] } | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    const p = loadProgress();
    if (p && p.mode === mode && p.index < ishiharaQuestions.length) {
      startedAtRef.current = p.startedAt ?? Date.now();
      setInitial({ index: p.index, answers: p.answers });
    }
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function onDone(answers: AnswerRecord[]) {
    clearProgress();
    const result = computeResult({
      answers,
      questions: ishiharaQuestions,
      opts: { startedAt: startedAtRef.current, endedAt: Date.now(), device: detectDevice(), lang },
    });
    saveResult(result);
    router.push(`/result/${result.id}`);
  }

  function restart() {
    clearProgress();
    setInitial(undefined);
    setRunKey((k) => k + 1);
    startedAtRef.current = Date.now();
  }

  const [runKey, setRunKey] = useState(0);
  const f = useIshiharaFlow({ questions: ishiharaQuestions, initial, funMode: settings.funMode, onProgress: (index, answers) => saveProgress({ mode, index, answers, startedAt: startedAtRef.current }), onDone, lang });
  const { q, total, idx, input, recorded, reveal, milestone, pulse, pausedChapter } = f;

  return (
    <section id="test-runner" className="wrap stack" style={{ maxWidth: 600, paddingBlock: 'var(--s-6)', gap: 'var(--s-4)' }}>
      <div className="row between">
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{t('test.titleIshihara')}</h1>
        <button type="button" className="btn btn-ghost" style={{ height: 38, fontSize: '0.85rem' }} onClick={restart}>
          {t('test.restart')}
        </button>
      </div>

      {mounted ? (
        pausedChapter !== null ? (
          <ChapterCard chapter={CHAPTERS[pausedChapter]} chapterNo={pausedChapter} total={total} index={idx} onContinue={f.continueChapter} />
        ) : (
          <div className="stack" style={{ gap: 'var(--s-4)' }} id={`ishihara-flow-${runKey}`}>
            <TestProgress index={idx} total={total} current={q} />
            <div className="row between" style={{ flexWrap: 'wrap', gap: 'var(--s-2)' }}>
              <ProgressDots total={total} index={idx} pulse={pulse} id="progress-dots" />
              {milestone ? <span className="chip chip-ok" role="status" style={{ fontSize: '0.8rem' }}>{milestone}</span> : null}
            </div>
            <div className="card stack" style={{ alignItems: 'center', gap: 'var(--s-4)' }}>
              <IshiharaPlate type={q.type} text={figureText(q)} seed={q.plate} maxWidth={400} />
              <p className="muted" style={{ margin: 0, fontSize: '0.9rem', textAlign: 'center' }}>{t('test.ishiharaPrompt')}</p>
            </div>
            {reveal ? (
              <div className="card stack" style={{ borderColor: reveal.correct ? 'var(--ok)' : 'var(--warn)' }}>
                <div className="row" style={{ gap: 'var(--s-2)' }}>
                  <Icon name={reveal.correct ? 'check' : 'info'} size={20} style={{ color: reveal.correct ? 'var(--ok)' : 'var(--warn)' }} />
                  <strong>{reveal.correct ? t('test.revealCorrect') : t('test.revealDemo')}</strong>
                </div>
                <p style={{ margin: 0 }}>{t('test.revealExpected', { d: reveal.expected || t('test.revealNone') })}{t('test.revealDemoNote')}</p>
                <button type="button" className="btn btn-primary btn-block" onClick={f.advanceFromReveal}>
                  {idx + 1 < total ? (<>{t('test.continue')} <Icon name="arrowRight" size={18} /></>) : t('test.finish')}
                </button>
              </div>
            ) : (
              <div className="stack" style={{ gap: 'var(--s-3)' }}>
                <input id="answer" className="field" value={recorded ? t('test.recorded') : input} inputMode="numeric" placeholder={t('test.answerPlaceholder')} aria-label={t('test.answerAria')} disabled={recorded} onChange={(e) => f.setInput(e.target.value.replace(/\D/g, '').slice(0, 3))} onKeyDown={(e) => e.key === 'Enter' && f.submit()} />
                <Numpad onDigit={f.appendDigit} onBackspace={f.backspace} onClear={f.clearInput} />
                <div className="row" style={{ gap: 'var(--s-3)' }}>
                  <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={f.submit} disabled={input.trim() === '' || recorded}>{t('test.submit')}</button>
                  <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={f.markUnclear} disabled={recorded}>{t('test.unclear')}</button>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="card stack" style={{ alignItems: 'center', gap: 'var(--s-4)', minHeight: 320 }} aria-hidden>
          <p className="muted" style={{ margin: 0 }}>{t('test.restoring')}</p>
        </div>
      )}

      <Callout icon="info">{t('test.calloutIshihara')}</Callout>
    </section>
  );
}
