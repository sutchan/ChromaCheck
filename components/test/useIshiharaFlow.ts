// components/test/useIshiharaFlow.ts — 石原氏答题流程状态与逻辑（供标准/进阶模式复用）
// chromacheck v1.7.3
'use client';

import { useEffect, useRef, useState } from 'react';
import type { AnswerRecord, Question } from '@/lib/types';
import { chapterOf } from '@/lib/fun';

export interface IshiharaFlowApi {
  idx: number;
  q: Question;
  total: number;
  input: string;
  reveal: { correct: boolean; expected: string } | null;
  recorded: boolean;
  milestone: string | null;
  pulse: boolean;
  pausedChapter: number | null;
  setInput: (v: string) => void;
  appendDigit: (d: string) => void;
  backspace: () => void;
  clearInput: () => void;
  submit: () => void;
  markUnclear: () => void;
  continueChapter: () => void;
  advanceFromReveal: () => void;
}

export function useIshiharaFlow(opts: {
  questions: Question[];
  /** 恢复进行中的进度（index 为下一题索引） */
  initial?: { index: number; answers: AnswerRecord[] };
  /** 趣味体验开关（控制章末过渡与里程碑仪式感；中性反馈恒开） */
  funMode?: boolean;
  /** 每次作答后回调（index 为下一题索引），由外层决定是否持久化 */
  onProgress?: (index: number, answers: AnswerRecord[]) => void;
  /** 全部作答完成 */
  onDone: (answers: AnswerRecord[]) => void;
}): IshiharaFlowApi {
  const { questions, initial, funMode = false, onProgress, onDone } = opts;
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
  if (!q) return emptyApi(total);

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

  function advanceFromReveal() {
    if (idx + 1 >= total) {
      onDone(answers);
      return;
    }
    setIdx(idx + 1);
  }

  return {
    idx,
    q,
    total,
    input,
    reveal,
    recorded,
    milestone,
    pulse,
    pausedChapter,
    setInput,
    appendDigit,
    backspace: () => setInput((p) => p.slice(0, -1)),
    clearInput: () => setInput(''),
    submit,
    markUnclear,
    continueChapter: () => setPausedChapter(null),
    advanceFromReveal,
  };
}

function emptyApi(total: number): IshiharaFlowApi {
  return {
    idx: 0,
    q: undefined as unknown as Question,
    total,
    input: '',
    reveal: null,
    recorded: false,
    milestone: null,
    pulse: false,
    pausedChapter: null,
    setInput: () => {},
    appendDigit: () => {},
    backspace: () => {},
    clearInput: () => {},
    submit: () => {},
    markUnclear: () => {},
    continueChapter: () => {},
    advanceFromReveal: () => {},
  };
}
