// components/test/IshiharaFlow.tsx — 石原氏答题流程（独立组件，供标准/进阶模式复用）
// chromacheck v1.7.0
'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { AnswerRecord, Question } from '@/lib/types';
import { CHAPTERS, chapterOf } from '@/lib/fun';
import { IshiharaPlate } from './IshiharaPlate';
import { TestProgress } from './TestProgress';
import { Numpad } from './Numpad';
import { ProgressDots, ChapterCard } from './FunBits';
import { Icon } from '@/components/common/Icon';

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
  const total = questions.length;
  const [idx, setIdx] = useState(initial?.index ?? 0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<AnswerRecord[]>(initial?.answers ?? []);
  const [reveal, setReveal] = useState<null | { correct: boolean; expected: string }>(null);
  const [recorded, setRecorded] = useState(false);
  const [milestone, setMilestone] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);
  const [pausedChapter, setPausedChapter] = useState<number | null>(null);
  const qStartRef = useRef<number>(Date.now());
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    qStartRef.current = Date.now();
    setInput('');
    setReveal(null);
    setRecorded(false);
  }, [idx]);

  // 卸载时清理待推进定时器
  useEffect(() => () => timersRef.current.forEach((t) => window.clearTimeout(t)), []);

  const q = questions[idx];
  if (!q) return null;

  function appendDigit(d: string) {
    setInput((prev) => (prev + d).slice(0, 3));
  }

  function record(userAnswer: string): AnswerRecord {
    return { questionId: q.id, userAnswer, durationMs: Date.now() - qStartRef.current };
  }

  /** 记录后统一走 420ms 中性反馈缓冲，再推进（章末可能插入过渡卡） */
  function commitAndAdvance(next: AnswerRecord[]) {
    setRecorded(true);
    const answered = next.length;
    if (funMode && answered % 8 === 0 && answered < total) {
      setMilestone(`已完成 ${answered} / ${total} 版`);
      setPulse(true);
      timersRef.current.push(window.setTimeout(() => setMilestone(null), 2200));
    }
    timersRef.current.push(
      window.setTimeout(() => {
        setPulse(false);
        if (idx + 1 >= total) {
          onDone(next);
          return;
        }
        const nextQ = questions[idx + 1];
        if (funMode && chapterOf(q.type) !== chapterOf(nextQ.type)) {
          setIdx(idx + 1);
          setPausedChapter(chapterOf(nextQ.type));
          return;
        }
        setIdx(idx + 1);
      }, 420),
    );
  }

  function submit() {
    if (input.trim() === '' || recorded || pausedChapter !== null) return;
    const rec = record(input.trim());
    const isDemo = q.type === 'demonstration';
    const correct = q.type === 'hidden' ? rec.userAnswer === '' : rec.userAnswer === q.answer;
    const next = [...answers, rec];
    setAnswers(next);
    onProgress?.(idx + 1, next);
    if (isDemo) {
      setReveal({ correct, expected: q.answer });
      return;
    }
    commitAndAdvance(next);
  }

  function markUnclear() {
    if (recorded || pausedChapter !== null) return;
    const rec = record('');
    const next = [...answers, rec];
    setAnswers(next);
    onProgress?.(idx + 1, next);
    if (q.type === 'demonstration') {
      setReveal({ correct: false, expected: q.answer });
      return;
    }
    commitAndAdvance(next);
  }

  if (pausedChapter !== null) {
    return (
      <ChapterCard
        chapter={CHAPTERS[pausedChapter]}
        chapterNo={pausedChapter}
        total={total}
        index={idx}
        onContinue={() => setPausedChapter(null)}
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
          <button type="button" className="btn btn-primary btn-block" onClick={() => setIdx(idx + 1 < total ? idx + 1 : idx)}>
            {idx + 1 < total ? (
              <>
                继续 <Icon name="arrowRight" size={18} />
              </>
            ) : (
              '完成作答'
            )}
          </button>
        </div>
      ) : (
        <div className="stack" style={{ gap: 'var(--s-3)' }}>
          <input
            id="answer"
            className="field"
            value={recorded ? '✓ 已记录' : input}
            inputMode="numeric"
            placeholder="输入数字"
            aria-label="你看到的数字"
            disabled={recorded}
            onChange={(e) => setInput(e.target.value.replace(/\D/g, '').slice(0, 3))}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <Numpad onDigit={appendDigit} onBackspace={() => setInput((p) => p.slice(0, -1))} onClear={() => setInput('')} />
          <div className="row" style={{ gap: 'var(--s-3)' }}>
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={submit} disabled={input.trim() === '' || recorded}>
              提交
            </button>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={markUnclear} disabled={recorded}>
              看不清 / 无数字
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
