// components/test/HueArrangementRunner.tsx — 色相排列检测流程编排
// chromacheck v1.9.0
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { HueArrangementResult, TestMode } from '@/lib/types';
import { getHueQuestions } from '@/lib/questions/hue-arrangement';
import { computeHueResult, scoreHueQuestion } from '@/lib/hue-scoring';
import { saveResult, saveProgress, loadProgress, clearProgress } from '@/lib/storage';
import { detectDevice } from '@/lib/format';
import { HueArrangementGrid } from './HueArrangementGrid';
import { Callout } from '@/components/common/Callout';
import { useLang } from '@/components/layout/LangProvider';

export function HueArrangementRunner({ mode }: { mode: TestMode }) {
  const router = useRouter();
  const { t, lang } = useLang();
  const question = getHueQuestions(mode)[0];
  const [submitted, setSubmitted] = useState(false);
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    const p = loadProgress();
    if (p && p.mode === mode) {
      startedAtRef.current = p.startedAt ?? Date.now();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(order: number[]) {
    if (submitted) return;
    setSubmitted(true);
    const hueResult: HueArrangementResult = scoreHueQuestion(question, order);
    const result = computeHueResult(hueResult, {
      testMode: mode,
      startedAt: startedAtRef.current,
      endedAt: Date.now(),
      device: detectDevice(),
      lang,
    });
    saveResult(result);
    clearProgress();
    router.push(`/result/${result.id}`);
  }

  return (
    <section id="hue-runner" className="wrap stack" style={{ maxWidth: 860, paddingBlock: 'var(--s-6)', gap: 'var(--s-4)' }}>
      <div className="row between">
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{t('test.titleHue')}</h1>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ height: 38, fontSize: '0.85rem' }}
          onClick={() => window.location.reload()}
        >
          {t('test.restart')}
        </button>
      </div>

      <div className="card stack" style={{ gap: 'var(--s-4)' }}>
        <HueArrangementGrid question={question} onSubmit={onSubmit} />
      </div>

      <Callout icon="info">{t('test.calloutHue')}</Callout>
    </section>
  );
}
