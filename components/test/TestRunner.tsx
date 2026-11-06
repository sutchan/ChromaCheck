// components/test/TestRunner.tsx — 标准/快速版石原氏测试运行器
// chromacheck v1.13.4
'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AnswerRecord, TestMode } from '@/lib/types';
import { getQuestions } from '@/lib/questions';
import { computeResult } from '@/lib/scoring';
import { saveResult, saveProgress, clearProgress } from '@/lib/storage';
import { detectDevice } from '@/lib/format';
import { useResumeProgress } from './useResumeProgress';
import { IshiharaFlow } from './IshiharaFlow';
import { Callout } from '@/components/common/Callout';
import { useSettings } from '@/components/layout/ThemeProvider';
import { useLang } from '@/components/layout/LangProvider';

export function TestRunner({ mode }: { mode: TestMode }) {
  const router = useRouter();
  const { t, lang } = useLang();
  const { settings } = useSettings();
  const ishiharaQuestions = useMemo(() => getQuestions(mode), [mode]);
  const { mounted, initial, setInitial, startedAtRef } = useResumeProgress(mode, ishiharaQuestions.length);
  const [runKey, setRunKey] = useState(0);

  function onDone(answers: AnswerRecord[]) {
    clearProgress();
    const result = computeResult(answers, ishiharaQuestions, {
      testMode: mode,
      startedAt: startedAtRef.current,
      endedAt: Date.now(),
      device: detectDevice(lang),
      lang,
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

  return (
    <section id="test-runner" className="wrap stack" style={{ maxWidth: 600, paddingBlock: 'var(--s-6)', gap: 'var(--s-4)' }}>
      <div className="row between">
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{t('test.titleIshihara')}</h1>
        <button type="button" className="btn btn-ghost" style={{ height: 38, fontSize: '0.85rem' }} onClick={restart}>
          {t('test.restart')}
        </button>
      </div>

      {mounted ? (
        // key=runKey：重开时重挂载流程，重置内部作答状态（章末卡片/里程碑由 IshiharaFlow 内部处理）
        <IshiharaFlow
          key={runKey}
          id={`ishihara-flow-${runKey}`}
          questions={ishiharaQuestions}
          initial={initial}
          funMode={settings.funMode}
          onProgress={(index, answers) =>
            saveProgress({ mode, index, answers, startedAt: startedAtRef.current })
          }
          onDone={onDone}
        />
      ) : (
        <div className="card stack" style={{ alignItems: 'center', gap: 'var(--s-4)', minHeight: 320 }} aria-hidden>
          <p className="muted" style={{ margin: 0 }}>{t('test.restoring')}</p>
        </div>
      )}

      <Callout icon="info">{t('test.calloutIshihara')}</Callout>
    </section>
  );
}
