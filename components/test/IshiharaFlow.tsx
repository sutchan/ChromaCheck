// components/test/IshiharaFlow.tsx — 石原氏答题流程（独立组件，供标准/进阶模式复用）
// chromacheck v1.3.0
'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { AnswerRecord, Question } from '@/lib/types';
import { IshiharaPlate } from './IshiharaPlate';
import { TestProgress } from './TestProgress';
import { Numpad } from './Numpad';
import { Icon } from '@/components/common/Icon';

function figureText(q: Question): string {
  // 隐藏题对正常视觉应呈现为“空白图版”，不绘制数字，避免误判
  return q.type === 'hidden' ? '' : q.answer;
}

export function IshiharaFlow({
  questions,
  initial,
  onProgress,
  onDone,
}: {
  questions: Question[];
  /** 恢复进行中的进度（index 为下一题索引） */
  initial?: { index: number; answers: AnswerRecord[] };
  /** 每次作答后回调（index 为下一题索引），由外层决定是否持久化 */
  onProgress?: (index: number, answers: AnswerRecord[]) => void;
  /** 全部作答完成 */
  onDone: (answers: AnswerRecord[]) => void;
}) {
  const total = questions.length;
  const [idx, setIdx] = useState(initial?.index ?? 0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<AnswerRecord[]>(initial?.answers ?? []);
  const [reveal, setReveal] = useState<null | { correct: boolean; expected: string }>(null);
  const qStartRef = useRef<number>(Date.now());

  useEffect(() => {
    qStartRef.current = Date.now();
    setInput('');
    setReveal(null);
  }, [idx]);

  const q = questions[idx];
  if (!q) return null;

  function appendDigit(d: string) {
    setInput((prev) => (prev + d).slice(0, 3));
  }

  function record(userAnswer: string): AnswerRecord {
    return { questionId: q.id, userAnswer, durationMs: Date.now() - qStartRef.current };
  }

  function advance(next: AnswerRecord[]) {
    if (idx + 1 >= total) {
      onDone(next);
      return;
    }
    setIdx(idx + 1);
  }

  function submit() {
    if (input.trim() === '') return;
    const rec = record(input.trim());
    const isDemo = q.type === 'demonstration';
    const correct = q.type === 'hidden' ? rec.userAnswer === '' : rec.userAnswer === q.answer;
    const next = [...answers, rec];
    setAnswers(next);
    onProgress?.(isDemo ? idx : idx + 1, next);
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
    onProgress?.(q.type === 'demonstration' ? idx : idx + 1, next);
    if (q.type === 'demonstration') {
      setReveal({ correct: false, expected: q.answer });
      return;
    }
    advance(next);
  }

  return (
    <div className="stack" id="ishihara-flow" style={{ gap: 'var(--s-4)' }}>
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
    </div>
  );
}
