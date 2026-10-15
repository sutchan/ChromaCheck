// components/result/ReportActions.tsx — 结果导出 / 分享
// chromacheck v1.9.0
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { uiText } from '@/lib/scoring';
import type { TestResult } from '@/lib/types';
import { computeRadar, drawShareCard, exportShareCard } from '@/lib/sharecard';
import { drawReport } from '@/lib/report-canvas';
import { useSettings } from '@/components/layout/ThemeProvider';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';

export function ReportActions({ result, plain = false }: { result: TestResult; plain?: boolean }) {
  const [copied, setCopied] = useState(false);
  const { settings } = useSettings();
  const { t, lang } = useLang();

  /** 色觉人格分享卡（v1.4 趣味体验）：实时绘制并导出 PNG */
  function exportShareCardPng() {
    if (!result.ishihara) return;
    const radar = computeRadar(result.ishihara, result.answers, lang);
    const c = document.createElement('canvas');
    drawShareCard(c, {
      ish: result.ishihara,
      radarValues: radar.values,
      radarLabels: radar.labels,
      dateText: result.createdAt.slice(0, 10),
      funMode: !plain && settings.funMode,
      type: result.type,
      overall: result.overall,
      lang,
    });
    exportShareCard(c);
  }

  function exportPng() {
    const c = drawReport(result, lang);
    const url = c.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `chromacheck-report-${result.id.slice(0, 8)}.png`;
    a.click();
  }

  async function copyText() {
    const dimText = result.ishihara
      ? t('report.copyDimIshihara', {
          p: result.ishihara.dimensions.protan,
          d: result.ishihara.dimensions.deutan,
          t: result.ishihara.dimensions.tritan,
        })
      : result.pathTracking
        ? t('report.copyDimPath', { v: result.pathTracking.map((r) => `${r.overlapScore}%`).join(' / ') })
        : result.hueArrangement
          ? t('report.copyDimHue', {
              v: result.hueArrangement.totalErrorScore,
              label: result.hueArrangement.normal
                ? t('result.verdictNormal')
                : result.hueArrangement.totalErrorScore <= 40
                  ? t('result.verdictMild')
                  : t('result.verdictObvious'),
            })
          : '';
    const txt = `${t('report.copyTitle')}${t('report.copyVerdict', { v: uiText.overall(result.overall, lang) })}${
      result.type ? t('report.copyType', { t: uiText.type(result.type, lang), s: uiText.severity(result.severity, lang) }) : ''
    }${t('report.copyStability', { p: result.confidence })}${dimText}\n${result.analysis}`;
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* 忽略：剪贴板不可用时静默 */
    }
  }

  return (
    <div className="stack no-print" style={{ gap: 'var(--s-3)' }}>
      <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-primary" onClick={exportPng}>
          <Icon name="download" size={18} /> {t('report.png')}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
          <Icon name="share" size={18} /> {t('report.pdf')}
        </button>
        <button type="button" className="btn btn-ghost" onClick={copyText}>
          <Icon name="info" size={18} /> {copied ? t('report.copied') : t('report.copy')}
        </button>
        {result.ishihara && !plain ? (
          <button type="button" id="shareCardBtn" className="btn btn-ghost" onClick={exportShareCardPng}>
            <Icon name="share" size={18} /> {t('report.shareCard')}
          </button>
        ) : null}
      </div>
      <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap' }}>
        <Link href="/test" className="btn btn-ghost">
          <Icon name="reset" size={18} /> {t('report.retest')}
        </Link>
        <Link href="/history" className="btn btn-ghost">
          <Icon name="history" size={18} /> {t('report.viewHistory')}
        </Link>
      </div>
    </div>
  );
}
