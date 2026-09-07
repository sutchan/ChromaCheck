// components/test/AdvancedRunner.tsx — 进阶版联合检测编排（石原氏 + 路径追踪 + 色相排列）
// chromacheck v1.7.3
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AnswerRecord, PathTrackingResult, Scene } from '@/lib/types';
import { getQuestions } from '@/lib/questions';
import { getPathQuestions } from '@/lib/questions/path-tracking';
import { getHueQuestions } from '@/lib/questions/hue-arrangement';
import { scoreIshihara } from '@/lib/scoring';
import { scorePathTracking } from '@/lib/path-scoring';
import { scoreHueQuestion } from '@/lib/hue-scoring';
import { computeAdvancedResult } from '@/lib/advanced-scoring';
import { saveResult, loadProgress, saveProgress, clearProgress } from '@/lib/storage';
import { detectDevice } from '@/lib/format';
import { IshiharaFlow } from './IshiharaFlow';
import { PathTrackingCanvas } from './PathTrackingCanvas';
import { HueArrangementGrid } from './HueArrangementGrid';
import { useSettings } from '@/components/layout/ThemeProvider';
import { Callout } from '@/components/common/Callout';

const PHASES = ['石原氏检测（38 题）', '路径追踪（3 题）', '色相排列（D15）'] as const;

export function AdvancedRunner({ scene = 'general' }: { scene?: Scene }) {
  const router = useRouter();
  const { settings } = useSettings();
  const ishiharaQuestions = useMemo(() => getQuestions('standard'), []);
  const pathQuestions = useMemo(() => getPathQuestions('standard'), []);
  const hueQuestion = useMemo(() => getHueQuestions('standard')[0], []);
  const [phase, setPhase] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [ishiharaAnswers, setIshiharaAnswers] = useState<AnswerRecord[] | null>(null);
  const [ishiharaInitial, setIshiharaInitial] = useState<{ index: number; answers: AnswerRecord[] } | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [pathResults, setPathResults] = useState<PathTrackingResult[]>([]);
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    const p = loadProgress();
    if (p && p.mode === 'advanced' && p.index < ishiharaQuestions.length) {
      startedAtRef.current = p.startedAt ?? Date.now();
      setIshiharaInitial({ index: p.index, answers: p.answers });
    }
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onIshiharaDone(answers: AnswerRecord[]) {
    clearProgress();
    setIshiharaInitial(undefined);
    setIshiharaAnswers(answers);
    setPhase(1);
  }

  function onPathResult(userPath: { x: number; y: number }[]) {
    const q = pathQuestions[pathResults.length];
    if (!q) return;
    const next = [...pathResults, scorePathTracking(q, userPath)];
    setPathResults(next);
    if (next.length >= pathQuestions.length) setPhase(2);
  }

  function onHueSubmit(order: number[]) {
    if (!ishiharaAnswers) return;
    const result = computeAdvancedResult({
      ishihara: scoreIshihara(ishiharaAnswers, ishiharaQuestions),
      answers: ishiharaAnswers,
      pathResults,
      pathQuestions,
      hueResult: scoreHueQuestion(hueQuestion, order),
      opts: { startedAt: startedAtRef.current, endedAt: Date.now(), device: detectDevice(), scene },
    });
    saveResult(result);
    clearProgress();
    router.push(`/result/${result.id}`);
  }

  function restart() {
    clearProgress();
    setPhase(0);
    setIshiharaAnswers(null);
    setIshiharaInitial(undefined);
    setPathResults([]);
    setRunKey((k) => k + 1);
    startedAtRef.current = Date.now();
  }

  const currentPathQ = phase === 1 ? pathQuestions[pathResults.length] : undefined;

  return (
    <section id="advanced-runner" className="wrap stack" style={{ maxWidth: 760, paddingBlock: 'var(--s-6)', gap: 'var(--s-4)' }}>
      <div className="row between">
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>进阶联合检测</h1>
        <button type="button" className="btn btn-ghost" style={{ height: 38, fontSize: '0.85rem' }} onClick={restart}>
          重新开始
        </button>
      </div>

      <div className="row" id="advanced-phases" style={{ gap: 'var(--s-2)', flexWrap: 'wrap' }}>
        {PHASES.map((label, i) => (
          <span key={label} className={`chip ${i === phase ? 'chip-ok' : ''}`} style={{ opacity: i <= phase ? 1 : 0.55 }}>
            模块 {i + 1}/3 · {label}
            {i < phase ? ' ✓' : ''}
          </span>
        ))}
      </div>

      {phase === 0 ? (
        mounted ? (
          <IshiharaFlow
            key={`ishihara-${runKey}`}
            questions={ishiharaQuestions}
            initial={ishiharaInitial}
            funMode={settings.funMode}
            onProgress={(index, answers) => saveProgress({ mode: 'advanced', index, answers, startedAt: startedAtRef.current })}
            onDone={onIshiharaDone}
          />
        ) : (
          <div className="card stack" style={{ alignItems: 'center', gap: 'var(--s-4)', minHeight: 320 }} aria-hidden>
            <p className="muted" style={{ margin: 0 }}>正在恢复进度…</p>
          </div>
        )
      ) : null}

      {phase === 1 && currentPathQ ? (
        <div className="card stack" style={{ alignItems: 'center', gap: 'var(--s-4)' }}>
          <PathTrackingCanvas key={currentPathQ.id} question={currentPathQ} onResult={onPathResult} />
        </div>
      ) : null}

      {phase === 2 ? (
        <div className="card stack" style={{ gap: 'var(--s-4)' }}>
          <HueArrangementGrid question={hueQuestion} onSubmit={onHueSubmit} />
        </div>
      ) : null}

      <Callout icon="info">
        进阶检测依次完成三个模块，全程约 15 分钟，请保持光线充足、屏幕未开启护眼滤镜；中途重新开始将清空全部作答。
      </Callout>
    </section>
  );
}
