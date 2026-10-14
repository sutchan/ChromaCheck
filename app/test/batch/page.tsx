// app/test/batch/page.tsx — 批量检测（本地优先：录入名单 → 逐人标准检测 → 汇总导出）
// chromacheck v1.8.0
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/components/layout/LangProvider';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';
import { addProfile, setActiveProfile, getDefaultProfile } from '@/lib/profile';
import { listResults } from '@/lib/storage';
import { downloadSummaryCsv } from '@/lib/export-import';

const K_BATCH = 'cc.batch.v1';

interface BatchSubject {
  profileId: string;
  name: string;
}

function loadBatch(): BatchSubject[] {
  try {
    const raw = localStorage.getItem(K_BATCH);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BatchSubject[]) : [];
  } catch {
    return [];
  }
}

function saveBatch(s: BatchSubject[]): void {
  try {
    localStorage.setItem(K_BATCH, JSON.stringify(s));
  } catch {
    /* 静默失败 */
  }
}

const inputStyle: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--bg)',
  color: 'var(--fg)',
  fontSize: '0.95rem',
  width: '100%',
  fontFamily: 'inherit',
  resize: 'vertical',
};

export default function BatchPage() {
  const { t } = useLang();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [names, setNames] = useState('');
  const [subjects, setSubjects] = useState<BatchSubject[]>([]);
  const [doneSet, setDoneSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const s = loadBatch();
    setSubjects(s);
    setMounted(true);
  }, []);

  useEffect(() => {
    const results = listResults();
    const done = new Set(results.map((r) => r.profileId ?? getDefaultProfile().id));
    setDoneSet(done);
  }, [subjects, mounted]);

  function start() {
    const list = names
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean);
    if (list.length === 0) return;
    const created: BatchSubject[] = list.map((n) => {
      const p = addProfile({ name: n, relation: '批量' });
      return { profileId: p.id, name: n };
    });
    const merged = [...subjects, ...created];
    saveBatch(merged);
    setSubjects(merged);
    setNames('');
  }

  function goTest(profileId: string) {
    setActiveProfile(profileId);
    router.push('/test/ishihara/standard');
  }

  function reset() {
    saveBatch([]);
    setSubjects([]);
  }

  if (!mounted) return null;

  const doneCount = subjects.filter((s) => doneSet.has(s.profileId)).length;

  return (
    <div id="batch-page" className="wrap stack" style={{ paddingBlock: 'var(--s-6)', gap: 'var(--s-5)', maxWidth: 820 }}>
      <div className="stack" style={{ gap: 4 }}>
        <h1 style={{ margin: 0 }}>{t('batch.title')}</h1>
        <span className="muted">{t('batch.desc')}</span>
      </div>

      <div className="card stack" style={{ gap: 'var(--s-3)', padding: 'var(--s-4)' }}>
        <label className="stack" style={{ gap: 6, fontSize: '0.9rem' }}>
          {t('batch.names')}
          <textarea
            rows={4}
            value={names}
            onChange={(e) => setNames(e.target.value)}
            placeholder={'张三\n李四\n王五'}
            style={inputStyle}
          />
        </label>
        <div className="row" style={{ gap: 'var(--s-2)' }}>
          <button type="button" className="btn btn-primary" onClick={start} disabled={!names.trim()}>
            <Icon name="users" size={16} /> {t('batch.start')}
          </button>
          {subjects.length > 0 && (
            <button type="button" className="btn btn-ghost" onClick={reset}>
              重置名单
            </button>
          )}
        </div>
      </div>

      {subjects.length === 0 ? (
        <Callout icon="info">{t('batch.none')}</Callout>
      ) : (
        <>
          <div className="row between">
            <span className="muted">
              已完成 {doneCount} / {subjects.length}
            </span>
            <button type="button" className="btn btn-ghost" onClick={() => downloadSummaryCsv()}>
              <Icon name="chart" size={16} /> {t('batch.summary')}
            </button>
          </div>
          <div className="stack" style={{ gap: 'var(--s-3)' }}>
            {subjects.map((s) => {
              const done = doneSet.has(s.profileId);
              return (
                <div
                  key={s.profileId}
                  className="card row between"
                  style={{ gap: 'var(--s-3)', padding: 'var(--s-4)', flexWrap: 'wrap' }}
                >
                  <div className="row" style={{ gap: 'var(--s-2)', alignItems: 'center' }}>
                    <Icon name={done ? 'check' : 'user'} size={20} />
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                    <span className={`chip ${done ? 'chip-ok' : 'chip-warn'}`}>
                      {done ? t('batch.done') : t('batch.pending')}
                    </span>
                  </div>
                  <button type="button" className="btn btn-primary" style={{ fontSize: '0.85rem' }} onClick={() => goTest(s.profileId)}>
                    <Icon name="play" size={15} /> {done ? '重测' : t('batch.goTest')}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <Callout icon="info">{t('batch.hint')}</Callout>
    </div>
  );
}
