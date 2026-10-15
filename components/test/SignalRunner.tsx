// components/test/SignalRunner.tsx — 信号灯辨识检测编排
// chromacheck v1.9.0
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { getSignalTasks, type SignalTask } from '@/lib/questions/signal';
import { scoreSignal } from '@/lib/signal-scoring';
import { Callout } from '@/components/common/Callout';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';

export function SignalRunner() {
  const { t, lang } = useLang();
  const tasks = useMemo(() => getSignalTasks(), []);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recorded, setRecorded] = useState(false);
  const [done, setDone] = useState<ReturnType<typeof scoreSignal> | null>(null);

  const total = tasks.length;
  const q: SignalTask | undefined = tasks[idx];

  function pick(value: string) {
    if (recorded || !q) return;
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    setRecorded(true);
    window.setTimeout(() => {
      setRecorded(false);
      if (idx + 1 >= total) {
        setDone(scoreSignal(tasks, next, lang));
      } else {
        setIdx(idx + 1);
      }
    }, 320);
  }

  if (done) {
    return (
      <section id="signal-result" className="wrap stack" style={{ maxWidth: 720, paddingBlock: 'var(--s-6)', gap: 'var(--s-4)' }}>
        <div className="row between">
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{t('test.signalResultTitle')}</h1>
          <span className={`chip ${done.overall === 'pass' ? 'chip-ok' : 'chip-risk'}`}>
            {done.overall === 'pass' ? t('test.signalPass') : t('test.signalFail')}
          </span>
        </div>

        <p style={{ margin: 0 }}>{done.note}</p>

        <div className="card stack" style={{ gap: 'var(--s-2)' }}>
          <div className="row between">
            <strong>{t('test.signalOverview')}</strong>
            <span className="muted" style={{ fontSize: '0.85rem' }}>{t('test.signalScore', { c: done.correct, t: done.total })}</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 4 }}>
            {done.tasks.map((task, i) => (
              <li key={task.id} className="muted" style={{ fontSize: '0.88rem' }}>
                <Icon name={task.correct ? 'check' : 'alert'} size={14} style={{ color: task.correct ? 'var(--ok)' : 'var(--risk)' }} /> {t('test.signalItem', { n: i + 1, r: t(task.correct ? 'test.signalItemOk' : 'test.signalItemBad') })}
              </li>
            ))}
          </ul>
        </div>

        <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>
          {t('test.signalNote')}
        </p>

        <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={() => { setAnswers({}); setIdx(0); setDone(null); }}>
            <Icon name="reset" size={18} /> {t('test.signalRetry')}
          </button>
          <Link href="/test" className="btn btn-ghost">{t('test.signalBack')}</Link>
        </div>
      </section>
    );
  }

  if (!q) return null;

  return (
    <section id="signal-runner" className="wrap stack" style={{ maxWidth: 720, paddingBlock: 'var(--s-6)', gap: 'var(--s-4)' }}>
      <div className="row between">
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{t('test.titleSignal')}</h1>
        <span className="chip">{t('test.progress', { i: idx + 1, total })}</span>
      </div>

      <Callout icon="info">{t('test.calloutSignal')}</Callout>

      <div className="card stack" style={{ alignItems: 'center', gap: 'var(--s-4)' }}>
        {q.kind === 'light' && q.color ? (
          <div
            aria-hidden
            style={{
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, ${q.color}, ${q.color} 60%, rgba(0,0,0,0.25))`,
              boxShadow: `0 0 40px ${q.color}`,
            }}
          />
        ) : null}
        <p style={{ margin: 0, textAlign: 'center', fontSize: '1.05rem' }}>{lang === 'en' ? q.promptEn : q.prompt}</p>
      </div>

      <div className="stack" style={{ gap: 'var(--s-3)' }}>
        {q.options.map((o) => (
          <button
            key={o.value}
            type="button"
            className="btn btn-ghost btn-block"
            style={{ height: 48, fontSize: '1rem' }}
            disabled={recorded}
            onClick={() => pick(o.value)}
          >
            {lang === 'en' ? o.labelEn : o.label}
          </button>
        ))}
      </div>
    </section>
  );
}
