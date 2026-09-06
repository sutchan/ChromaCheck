// components/result/ReportActions.tsx — 结果导出 / 分享
// chromacheck v1.7.2
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { uiText } from '@/lib/scoring';
import type { TestResult } from '@/lib/types';
import { computeRadar, drawShareCard, exportShareCard } from '@/lib/sharecard';
import { drawReport } from '@/lib/report-canvas';
import { useSettings } from '@/components/layout/ThemeProvider';
import { Icon } from '@/components/common/Icon';

export function ReportActions({ result, plain = false }: { result: TestResult; plain?: boolean }) {
  const [copied, setCopied] = useState(false);
  const { settings } = useSettings();

  /** 色觉人格分享卡（v1.4 趣味体验）：实时绘制并导出 PNG */
  function exportShareCardPng() {
    if (!result.ishihara) return;
    const radar = computeRadar(result.ishihara, result.answers);
    const c = document.createElement('canvas');
    drawShareCard(c, {
      ish: result.ishihara,
      radarValues: radar.values,
      radarLabels: radar.labels,
      dateText: result.createdAt.slice(0, 10),
      funMode: !plain && settings.funMode,
      type: result.type,
      overall: result.overall,
    });
    exportShareCard(c);
  }

  function exportPng() {
    const c = drawReport(result);
    const url = c.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `chromacheck-report-${result.id.slice(0, 8)}.png`;
    a.click();
  }

  async function copyText() {
    const dimText = result.ishihara
      ? `维度：红${result.ishihara.dimensions.protan} 绿${result.ishihara.dimensions.deutan} 蓝${result.ishihara.dimensions.tritan}`
      : result.pathTracking
        ? `路径重合度：${result.pathTracking.map((r) => `${r.overlapScore}%`).join(' / ')}`
        : result.hueArrangement
          ? `色相排列 TES：${result.hueArrangement.totalErrorScore}（${result.hueArrangement.normal ? '排列正常' : result.hueArrangement.totalErrorScore <= 40 ? '轻度偏差' : '明显偏差'}）`
          : '';
    const txt = `色辨 ChromaCheck 筛查结果：\n结论：${uiText.overall(result.overall)}\n${
      result.type ? `类型：${uiText.type(result.type)}（${uiText.severity(result.severity)}）\n` : ''
    }置信度：${result.confidence}%\n${dimText}\n${result.analysis}`;
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
          <Icon name="download" size={18} /> 导出 PNG
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
          <Icon name="share" size={18} /> 打印 / 另存 PDF
        </button>
        <button type="button" className="btn btn-ghost" onClick={copyText}>
          <Icon name="info" size={18} /> {copied ? '已复制' : '复制结果'}
        </button>
        {result.ishihara && !plain ? (
          <button type="button" id="shareCardBtn" className="btn btn-ghost" onClick={exportShareCardPng}>
            <Icon name="share" size={18} /> 分享卡 PNG
          </button>
        ) : null}
      </div>
      <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap' }}>
        <Link href="/test" className="btn btn-ghost">
          <Icon name="reset" size={18} /> 重新检测
        </Link>
        <Link href="/history" className="btn btn-ghost">
          <Icon name="history" size={18} /> 查看历史
        </Link>
      </div>
    </div>
  );
}
