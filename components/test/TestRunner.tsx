// components/test/TestRunner.tsx — 石原氏检测流程编排
// chromacheck v1.0.1
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getQuestions } from '@/lib/questions';
import type { AnswerRecord, Question, TestMode } from '@/lib/types';
import { computeResult } from '@/lib/scoring';
import { saveResult, saveProgress, loadProgress, clearProgress } from '@/lib/storage';
import { detectDevice } from '@/lib/format';
import { IshiharaPlate } from './IshiharaPlate';
import { TestProgress } from './TestProgress';
import { Numpad } from './Numpad';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';

function figureText(q: Question): string {
  // 隐藏题对正常视觉应呈现为“空白图版”，不绘制数字，避免误判
  return q.type === 'hidden' ? '' : q.answer;
}

export function TestRunner({ mode }: { mode: TestMode }) {
  const router = useRouter();
  const questions = useMemo(() => getQuestions(mode), [mode]);
  const total = questions.length;
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [reveal, setReveal] = useState<null | { correct: boolean; expected: string }>(null);
  const [finished, setFinished] = useState(false);
  const qStartRef = useRef<number>(Date.now());
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    const p = loadProgress();
    if (p && p.mode === mode && p.answers.length > 0 && p.index < total) {
      setAnswers(p.answers);
      setIdx(p.index);
      startedAtRef.current = p.startedAt ?? Date.now();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    qStartRef.current = Date.now();
    setInput('');
    setReveal(null);
  }, [idx]);

  useEffect(() => {
    if (finished || answers.length === 0) return;
    saveProgress({ mode, index: idx, answers, startedAt: startedAtRef.current });
  }, [idx, answers, finished, mode]);

  const q = questions[idx];
  if (!q) return null;

  function appendDigit(d: string) {
    setInput((prev) => (prev + d).slice(0, 3));
  }

  function record(userAnswer: string): AnswerRecord {
    return { questionId: q.id, userAnswer, durationMs: Date.now() - qStartRef.current };
  }

  function submit() {
    if (finished || input.trim() === '') return;
    const rec = record(input.trim());
    const isDemo = q.type === 'demonstration';
    const correct = q.type === 'hidden' ? rec.userAnswer === '' : rec.userAnswer === q.answer;
    const next = [...answers, rec];
    setAnswers(next);
    if (isDemo) {
      setReveal({ correct, expected: q.answer });
      return;
    }
    advance(next);
  }

  function markUnclear() {
    const rec = record('');
    const next = [...answers, rec];
    setAnswers(next);
    if (q.type === 'demonstration') {
      setReveal({ correct: false, expected: q.answer });
      return;
    }
    advance(next);
  }

  function advance(next: AnswerRecord[]) {
    if (idx + 1 >= total) {
      const endedAt = Date.now();
      const result = computeResult(next, questions, {
        testMode: mode,
        startedAt: startedAtRef.current,
        endedAt,
        device: detectDevice(),
      });
      saveResult(result);
      clearProgress();
      setFinished(true);
      router.push(`/result/${result.id}`);
      return;
    }
    setIdx(idx + 1);
  }

  function restart() {
    clearProgress();
    setAnswers([]);
    setIdx(0);
    setReveal(null);
    setFinished(false);
    qStartRef.current = Date.now();
    startedAtRef.current = Date.now();
  }

  return (
    <section id="test-runner" className="wrap stack" style={{ maxWidth: 760, paddingBlock: 'var(--s-6)' }}>
      <div className="row between">
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>石原氏色觉检测</h1>
        <button type="button" className="btn btn-ghost" style={{ height: 38, fontSize: '0.85rem' }} onClick={restart}>
          重新开始
        </button>
      </div>

      <TestProgress index={idx} total={total} current={q} />

      <div className="card stack" style={{ alignItems: 'center', gap: 'var(--s-4)' }}>
        <IshiharaPlate type={q.type} text={figureText(q)} seed={q.plate} maxWidth={400} />
        <p className="muted" style={{ margin: 0, fontSize: '0.9rem', textAlign: 'center' }}>
          请说出图中您看到的数字（最多 3 位）。若看不清任何数字，点“看不清 / 无数字”。
        </p>
      </div>

      {reveal ? (
        <div className="card stack" style={{ borderColor: reveal.correct ? 'var(--ok)' : 'var(--warn)' }}>
          <div className="row" style={{ gap: 'var(--s-2)' }}>
            <Icon name={reveal.correct ? 'check' : 'info'} size={20} style={{ color: reveal.correct ? 'var(--ok)' : 'var(--warn)' }} />
            <strong>{reveal.correct ? '正确' : '演示题'}</strong>
          </div>
          <p style={{ margin: 0 }}>
            图上的数字是 <b style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>{reveal.expected || '（无数字）'}</b>
            。演示题用于校准，不计入判读结果。
          </p>
          <button type="button" className="btn btn-primary btn-block" onClick={() => advance(answers)}>
            继续 <Icon name="arrowRight" size={18} />
          </button>
        </div>
      ) : (
        <div className="stack" style={{ gap: 'var(--s-3)' }}>
          <input
            id="answer"
            className="field"
            value={input}
            inputMode="numeric"
            placeholder="输入数字"
            aria-label="你看到的数字"
            onChange={(e) => setInput(e.target.value.replace(/\D/g, '').slice(0, 3))}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <Numpad onDigit={appendDigit} onBackspace={() => setInput((p) => p.slice(0, -1))} onClear={() => setInput('')} />
          <div className="row" style={{ gap: 'var(--s-3)' }}>
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={submit} disabled={input.trim() === ''}>
              提交
            </button>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={markUnclear}>
              看不清 / 无数字
            </button>
          </div>
        </div>
      )}

      <Callout icon="info">保持环境光线充足，眼睛与屏幕约 40–50cm。每题凭第一直觉作答，不要反复猜测。</Callout>
    </section>
  );
}
