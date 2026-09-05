// components/test/TestRunner.tsx — 石原氏检测流程编排（基于可复用 IshiharaFlow）
// chromacheck v1.3.0
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getQuestions } from '@/lib/questions';
import type { AnswerRecord, TestMode } from '@/lib/types';
import { computeResult } from '@/lib/scoring';
import { saveResult, saveProgress, loadProgress, clearProgress } from '@/lib/storage';
import { detectDevice } from '@/lib/format';
import { IshiharaFlow } from './IshiharaFlow';
import { Callout } from '@/components/common/Callout';

export function TestRunner({ mode }: { mode: TestMode }) {
  const router = useRouter();
  const questions = useMemo(() => getQuestions(mode), [mode]);
  const [runKey, setRunKey] = useState(0);
  const [initial, setInitial] = useState<{ index: number; answers: AnswerRecord[] } | undefined>(undefined);
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    const p = loadProgress();
    if (p && p.mode === mode && p.answers.length > 0 && p.index < questions.length) {
      setInitial({ index: p.index, answers: p.answers });
      startedAtRef.current = p.startedAt ?? Date.now();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDone(answers: AnswerRecord[]) {
    const endedAt = Date.now();
    const result = computeResult(answers, questions, {
      testMode: mode,
      startedAt: startedAtRef.current,
      endedAt,
      device: detectDevice(),
    });
    saveResult(result);
    clearProgress();
    router.push(`/result/${result.id}`);
  }

  function restart() {
    clearProgress();
    setInitial(undefined);
    setRunKey((k) => k + 1);
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

      <IshiharaFlow
        key={runKey}
        questions={questions}
        initial={initial}
        onProgress={(index, answers) => saveProgress({ mode, index, answers, startedAt: startedAtRef.current })}
        onDone={handleDone}
      />

      <Callout icon="info">保持环境光线充足，眼睛与屏幕约 40–50cm。每题凭第一直觉作答，不要反复猜测。</Callout>
    </section>
  );
}
