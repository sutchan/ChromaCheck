// components/test/SignalRunner.tsx — 信号灯辨识检测编排
// chromacheck v1.7.0
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { getSignalTasks, type SignalTask } from '@/lib/questions/signal';
import { scoreSignal } from '@/lib/signal-scoring';
import { Callout } from '@/components/common/Callout';
import { Icon } from '@/components/common/Icon';

export function SignalRunner() {
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
        setDone(scoreSignal(tasks, next));
      } else {
        setIdx(idx + 1);
      }
    }, 320);
  }

  if (done) {
    const missed = done.tasks.filter((t) => !t.correct);
    return (
      <section id="signal-result" className="wrap stack" style={{ maxWidth: 720, paddingBlock: 'var(--s-6)', gap: 'var(--s-4)' }}>
        <div className="row between">
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>信号灯辨识结果</h1>
          <span className={`chip ${done.overall === 'pass' ? 'chip-ok' : 'chip-risk'}`}>
            {done.overall === 'pass' ? '三色信号可辨识' : '信号辨色存疑'}
          </span>
        </div>

        <p style={{ margin: 0 }}>{done.note}</p>

        <div className="card stack" style={{ gap: 'var(--s-2)' }}>
          <div className="row between">
            <strong>判读概览</strong>
            <span className="muted" style={{ fontSize: '0.85rem' }}>正确 {done.correct} / {done.total}</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 4 }}>
            {done.tasks.map((t, i) => (
              <li key={t.id} className="muted" style={{ fontSize: '0.88rem' }}>
                <Icon name={t.correct ? 'check' : 'alert'} size={14} style={{ color: t.correct ? 'var(--ok)' : 'var(--risk)' }} /> 第 {i + 1} 题：{t.correct ? '正确' : `你的选择有误`}
              </li>
            ))}
          </ul>
        </div>

        <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>
          本项检测仅验证红 / 绿 / 黄交通信号的辨识能力，不能替代专业眼科诊断与驾照体检。
        </p>

        <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={() => { setAnswers({}); setIdx(0); setDone(null); }}>
            <Icon name="reset" size={18} /> 重新检测
          </button>
          <Link href="/test" className="btn btn-ghost">返回检测选择</Link>
        </div>
      </section>
    );
  }

  if (!q) return null;

  return (
    <section id="signal-runner" className="wrap stack" style={{ maxWidth: 720, paddingBlock: 'var(--s-6)', gap: 'var(--s-4)' }}>
      <div className="row between">
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>信号灯辨识</h1>
        <span className="chip">第 {idx + 1} / {total} 题</span>
      </div>

      <Callout icon="info">
        模拟路口与夜间行车场景下的红、绿、黄信号辨识。请凭第一直觉作答；本项不计入历史记录，仅作驾驶场景参考。
      </Callout>

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
        <p style={{ margin: 0, textAlign: 'center', fontSize: '1.05rem' }}>{q.prompt}</p>
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
            {o.label}
          </button>
        ))}
      </div>
    </section>
  );
}
