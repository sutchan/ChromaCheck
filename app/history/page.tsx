// app/history/page.tsx — 历史记录（含档案筛选 / 导出导入 / 汇总）
// chromacheck v1.13.4
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { listResults, deleteResult, clearResults } from '@/lib/storage';
import { getActiveProfileId, getDefaultProfile } from '@/lib/profile';
import { buildExport, downloadExport, parseImport, mergeImport, downloadSummaryCsv } from '@/lib/export-import';
import type { TestResult } from '@/lib/types';
import type { Lang } from '@/lib/i18n';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';
import { ProfileSwitcher } from '@/components/history/ProfileSwitcher';
import { HistoryCard } from '@/components/history/HistoryCard';
import { useLang } from '@/components/layout/LangProvider';

export default function HistoryPage() {
  const { t, lang } = useLang();
  const [items, setItems] = useState<TestResult[]>([]);
  const [activeId, setActiveId] = useState<string>('__all__');
  const [loaded, setLoaded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function reload() {
    const all = listResults();
    setItems(
      activeId === '__all__'
        ? all
        : all.filter((r) => (r.profileId ?? getDefaultProfile().id) === activeId),
    );
    setLoaded(true);
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  function remove(id: string) {
    deleteResult(id);
    reload();
  }

  function handleExport() {
    downloadExport(buildExport());
  }

  function handleSummary() {
    downloadSummaryCsv(undefined, lang);
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseImport(text, lang);
      if (!parsed.ok || !parsed.bundle) {
        setNotice(t('history.importError') + (parsed.error ?? ''));
        return;
      }
      const sum = mergeImport(parsed.bundle);
      reload();
      setNotice(t('history.importDone', { a: sum.addedResults, p: sum.addedProfiles }));
    } catch {
      setNotice(t('history.importError') + t('history.readFail'));
    }
  }

  return (
    <div id="history-page" className="wrap stack history-page">
      <div className="stack history-head">
        <div className="row between history-head-row">
          <div className="stack history-title-group">
            <h1>{t('nav.history')}</h1>
            <span className="muted history-sub">{t('history.localOnly')}</span>
          </div>
          <div className="row history-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleExport}>
              <Icon name="download" size={16} /> {t('history.export')}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
              <Icon name="upload" size={16} /> {t('history.import')}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleSummary}>
              <Icon name="chart" size={16} /> {t('history.exportSummary')}
            </button>
            {items.length > 0 && !confirming && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirming(true)}>
                <Icon name="trash" size={16} /> {t('history.clear')}
              </button>
            )}
          </div>
        </div>

        <ProfileSwitcher current={activeId} onChange={setActiveId} />
      </div>

      {notice && <Callout icon="info">{notice}</Callout>}

      {!loaded ? (
        <div className="skel history-skel" />
      ) : items.length === 0 ? (
        <div className="card stack history-empty">
          <Icon name="history" size={36} />
          <p className="muted">{t('history.empty')}</p>
          <Link href="/test" className="btn btn-primary">{t('history.firstTest')}</Link>
        </div>
      ) : (
        <div className="stack history-list">
          {items.map((r) => (
            <HistoryCard key={r.id} r={r} lang={lang} showProfile={activeId === '__all__'} onRemove={remove} />
          ))}
        </div>
      )}

      {confirming && (
        <div className="row history-confirm-row">
          <span className="muted history-confirm-hint">{t('history.clearConfirm')}</span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              clearResults();
              setItems([]);
              setConfirming(false);
            }}
          >
            {t('history.clearOk')}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>
            {t('history.cancel')}
          </button>
        </div>
      )}

      <input
        type="file"
        accept="application/json,.json"
        ref={fileRef}
        className="hidden-input"
        onChange={handleImportFile}
      />

      <Callout icon="shield">{t('history.privacyCallout')}</Callout>
    </div>
  );
}
