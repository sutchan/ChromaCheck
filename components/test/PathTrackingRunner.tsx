// components/test/PathTrackingRunner.tsx — 路径追踪检测流程编排
// chromacheck v1.9.0
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TestMode } from '@/lib/types';
import { getPathQuestions } from '@/lib/questions/path-tracking';
import { computePathResult, scorePathTracking } from '@/lib/path-scoring';
import { saveResult, saveProgress, loadProgress, clearProgress } from '@/lib/storage';
import { detectDevice } from '@/lib/format';
import { TestProgress } from './TestProgress';
import { PathTrackingCanvas } from './PathTrackingCanvas';
import { Callout } from '@/components/common/Callout';
import { useLang } from '@/components/layout/LangProvider';

export function PathTrackingRunner({ mode }: { mode: TestMode }) {
  const router = useRouter();
  const { t, lang } = useLang();
  const questions = useMemo(() => getPathQuestions(mode), [mode]);
  const total = questions.length;
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<ReturnType<typeof scorePathTracking>[]>([]);
  const [finished, setFinished] = useState(false);
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    const p = loadProgress();
    if (p && p.mode === mode && p.index < total) {
      startedAtRef.current = p.startedAt ?? Date.now();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onResult(userPath: { x: number; y: number }[]) {
    const q = questions[idx];
    const r = scorePathTracking(q, userPath);
    const next = [...results, r];
    setResults(next);
    saveProgress({ mode, index: idx + 1, answers: [], startedAt: startedAtRef.current });
    if (idx + 1 >= total) {
      const endedAt = Date.now();
      const result = computePathResult(next, questions, {
        testMode: mode,
        startedAt: startedAtRef.current,
        endedAt,
        device: detectDevice(),
        lang,
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
    setResults([]);
    setIdx(0);
    setFinished(false);
    startedAtRef.current = Date.now();
  }

  const q = questions[idx];
  if (!q || finished) return null;

  return (
    <section id="path-runner" className="wrap stack" style={{ maxWidth: 760, paddingBlock: 'var(--s-6)', gap: 'var(--s-4)' }}>
      <div className="row between">
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{t('test.titlePath')}</h1>
        <button type="button" className="btn btn-ghost" style={{ height: 38, fontSize: '0.85rem' }} onClick={restart}>
          {t('test.restart')}
        </button>
      </div>

      <TestProgress index={idx} total={total} label={t('test.phasePath')} />

      <div className="card stack" style={{ alignItems: 'center', gap: 'var(--s-4)' }}>
        <PathTrackingCanvas key={q.id} question={q} onResult={onResult} />
      </div>

      <Callout icon="info">{t('test.calloutPath')}</Callout>
    </section>
  );
}
