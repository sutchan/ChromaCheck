'use client';
// components/test/ChildFlow.tsx — 儿童模式：页面文案 + 答题 → 判读 → 本地保存 → 跳转结果页
// chromacheck v1.9.0
import React, { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChildRunner } from './ChildRunner';
import { scoreChild, type ChildAnswer } from '@/lib/child-scoring';
import { saveResult } from '@/lib/storage';
import { Callout } from '@/components/common/Callout';
import { useLang } from '@/components/layout/LangProvider';
import type { TestResult } from '@/lib/types';

export function ChildFlow() {
  const router = useRouter();
  const startedAt = useRef<number>(Date.now());
  const [saving, setSaving] = useState(false);
  const { t, lang } = useLang();

  const handleDone = useCallback(
    (answers: ChildAnswer[]) => {
      if (saving) return;
      setSaving(true);
      const child = scoreChild(answers, lang);
      const endedAt = Date.now();
      const result: TestResult = {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `cc-${endedAt}`,
        schema: 'cc.result/v1',
        version: '1.9.0', // 结果结构版本；解析方应对未知字段保持兼容（向后兼容）
        createdAt: new Date(endedAt).toISOString(),
        testMode: 'child',
        overall: child.overall,
        type: null,
        severity: null,
        confidence: Math.round((child.correct / Math.max(1, child.total)) * 100),
        durationMs: Math.max(0, endedAt - startedAt.current),
        answers: [],
        child,
        analysis: child.analysis,
        confidenceNote: t('analysis.childCorrect', { c: child.correct, n: child.total }) + child.note,
        device: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 120) : 'unknown',
        scene: 'general',
      };
      saveResult(result);
      router.push(`/result/${result.id}`);
    },
    [router, saving],
  );

  return (
    <div id="child-flow" className="stack" style={{ gap: 'var(--s-5)' }}>
      <div className="stack" style={{ gap: 'var(--s-2)' }}>
        <span className="chip">{t('child.chip')}</span>
        <h1 style={{ margin: 0 }}>{t('child.title')}</h1>
        <p className="muted" style={{ margin: 0 }}>{t('child.desc')}</p>
      </div>

      <ChildRunner onDone={handleDone} />

      {saving ? (
        <p className="muted" style={{ margin: 0, textAlign: 'center' }}>
          {t('child.saving')}
        </p>
      ) : null}

      <Callout icon="info">
        {t('child.callout')}
        <strong>{t('child.calloutScreening')}</strong>
        {t('child.calloutNote')}
        <Link href="/guide">{t('child.calloutGuide')}</Link>
        {t('child.calloutTail')}
      </Callout>
    </div>
  );
}
