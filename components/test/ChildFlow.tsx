'use client';
// components/test/ChildFlow.tsx — 儿童模式：页面文案 + 答题 → 判读 → 本地保存 → 跳转结果页
// chromacheck v1.8.2
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
  const { t } = useLang();

  const handleDone = useCallback(
    (answers: ChildAnswer[]) => {
      if (saving) return;
      setSaving(true);
      const child = scoreChild(answers);
      const endedAt = Date.now();
      const result: TestResult = {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `cc-${endedAt}`,
        schema: 'cc.result/v1',
        version: '1.8.2', // 结果结构版本；解析方应对未知字段保持兼容（向后兼容）
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
        confidenceNote: `儿童版图形题 ${child.correct}/${child.total} 作答正确。${child.note}`,
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
        <strong>初筛体验</strong>
        ，结果受孩子的配合度、屏幕色彩与环境光线影响，不能作为诊断依据。建议先在
        <Link href="/guide">《检测前指引》</Link>
        完成屏幕与环境准备；如结果提示异常，请到正规医院眼科复查。
      </Callout>
    </div>
  );
}
