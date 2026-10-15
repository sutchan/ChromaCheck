// app/history/page.tsx — 历史记录（含档案筛选 / 导出导入 / 汇总）
// chromacheck v1.8.0
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { listResults, deleteResult, clearResults } from '@/lib/storage';
import { getActiveProfileId, getProfileName, getDefaultProfile } from '@/lib/profile';
import { buildExport, downloadExport, parseImport, mergeImport, downloadSummaryCsv } from '@/lib/export-import';
import { uiText } from '@/lib/scoring';
import { formatDate } from '@/lib/format';
import type { Overall, TestResult } from '@/lib/types';
import type { Lang } from '@/lib/i18n';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';
import { ProfileSwitcher } from '@/components/history/ProfileSwitcher';
import { useLang } from '@/components/layout/LangProvider';

const TONE: Record<Overall, string> = {
  normal: 'chip-ok',
  suspected_deficiency: 'chip-warn',
  suspected_blindness: 'chip-risk',
  inconclusive: 'chip-warn',
};

function profileOf(r: TestResult, lang: Lang): string {
  return getProfileName(r.profileId ?? getDefaultProfile(lang).id, lang);
}

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
    <div id="history-page" className="wrap stack" style={{ paddingBlock: 'var(--s-6)', gap: 'var(--s-5)' }}>
      <div className="stack" style={{ gap: 'var(--s-3)' }}>
        <div className="row between" style={{ flexWrap: 'wrap', gap: 'var(--s-3)' }}>
          <div className="stack" style={{ gap: 4 }}>
            <h1 style={{ margin: 0 }}>{t('nav.history')}</h1>
            <span className="muted" style={{ fontSize: '0.9rem' }}>
              {t('history.localOnly')}
            </span>
          </div>
          <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-ghost" style={{ fontSize: '0.85rem' }} onClick={handleExport}>
              <Icon name="download" size={16} /> {t('history.export')}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: '0.85rem' }}
              onClick={() => fileRef.current?.click()}
            >
              <Icon name="upload" size={16} /> {t('history.import')}
            </button>
            <button type="button" className="btn btn-ghost" style={{ fontSize: '0.85rem' }} onClick={handleSummary}>
              <Icon name="chart" size={16} /> {t('history.exportSummary')}
            </button>
            {items.length > 0 && !confirming && (
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '0.85rem' }}
                onClick={() => setConfirming(true)}
              >
                <Icon name="trash" size={16} /> {t('history.clear')}
              </button>
            )}
          </div>
        </div>

        <ProfileSwitcher current={activeId} onChange={setActiveId} />
      </div>

      {notice && <Callout icon="info">{notice}</Callout>}

      {!loaded ? (
        <div className="skel" style={{ height: 120 }} />
      ) : items.length === 0 ? (
        <div className="card stack" style={{ alignItems: 'center', textAlign: 'center', gap: 'var(--s-3)' }}>
          <Icon name="history" size={36} />
          <p className="muted" style={{ margin: 0 }}>{t('history.empty')}</p>
          <Link href="/test" className="btn btn-primary">{t('history.firstTest')}</Link>
        </div>
      ) : (
        <div className="stack" style={{ gap: 'var(--s-3)' }}>
          {items.map((r) => (
            <div
              key={r.id}
              className="card row between"
              style={{ gap: 'var(--s-3)', flexWrap: 'wrap', padding: 'var(--s-4)' }}
            >
              <Link href={`/result/${r.id}`} className="stack" style={{ gap: 4, flex: 1, minWidth: 220, color: 'var(--fg)' }}>
                <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap' }}>
                  <span className={`chip ${TONE[r.overall]}`}>{uiText.overall(r.overall, lang)}</span>
                  <span className="chip">
                    {r.ishihara && r.pathTracking && r.hueArrangement
                      ? t('history.tagAdvanced')
                      : r.hueArrangement
                        ? t('history.tagHue')
                        : r.pathTracking
                          ? t('history.tagPath')
                          : t('history.tagIshihara')}
                  </span>
                  {r.type && <span className="chip">{uiText.type(r.type, lang)}</span>}
                  <span className="chip">{t('history.stabilityChip', { p: r.confidence })}</span>
                  {activeId === '__all__' && <span className="chip">{profileOf(r, lang)}</span>}
                </div>
                <span className="muted" style={{ fontSize: '0.85rem' }}>
                  {formatDate(r.createdAt)} · {uiText.mode(r.testMode, lang)}
                </span>
              </Link>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ height: 38, fontSize: '0.85rem' }}
                onClick={() => remove(r.id)}
                aria-label={t('history.deleteAria')}
              >
                <Icon name="trash" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {confirming && (
        <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="muted" style={{ fontSize: '0.85rem' }}>{t('history.clearConfirm')}</span>
          <button
            type="button"
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
            onClick={() => {
              clearResults();
              setItems([]);
              setConfirming(false);
            }}
          >
            {t('history.clearOk')}
          </button>
          <button type="button" className="btn btn-ghost" style={{ fontSize: '0.85rem' }} onClick={() => setConfirming(false)}>
            {t('history.cancel')}
          </button>
        </div>
      )}

      <input
        type="file"
        accept="application/json,.json"
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={handleImportFile}
      />

      <Callout icon="shield">{t('history.privacyCallout')}</Callout>
    </div>
  );
}
