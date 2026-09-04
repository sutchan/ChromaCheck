// components/result/ReportActions.tsx — 结果导出 / 分享
// chromacheck v1.0.0
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { uiText } from '@/lib/scoring';
import type { TestResult } from '@/lib/types';
import { Icon } from '@/components/common/Icon';

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const ch of text) {
    if (ch === '\n') {
      lines.push(line);
      line = '';
      continue;
    }
    if (ctx.measureText(line + ch).width > maxW) {
      lines.push(line);
      line = ch;
    } else line += ch;
  }
  if (line) lines.push(line);
  return lines;
}

function drawReport(result: TestResult): HTMLCanvasElement {
  const W = 900;
  const H = 1320;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // 头部
  ctx.fillStyle = '#1f7a8c';
  ctx.fillRect(0, 0, W, 96);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 34px Archivo, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('色辨 ChromaCheck · 筛查报告', 40, 48);

  let y = 150;
  ctx.fillStyle = '#14202b';
  ctx.font = '700 30px Archivo, sans-serif';
  ctx.fillText(uiText.overall(result.overall), 40, y);
  y += 44;
  ctx.fillStyle = '#41525f';
  ctx.font = '500 22px Archivo, sans-serif';
  const sub = result.type ? `${uiText.type(result.type)}${result.severity ? ` · ${uiText.severity(result.severity)}` : ''}` : '未见明显异常';
  ctx.fillText(sub, 40, y);
  y += 40;
  ctx.fillText(`置信度 ${result.confidence}%  ·  ${uiText.mode(result.testMode)}`, 40, y);

  // 维度条
  y += 60;
  const dims = result.ishihara.dimensions;
  const axes: [string, number, string][] = [
    ['红色觉轴', dims.protan, '#d64550'],
    ['绿色觉轴', dims.deutan, '#2f8f6b'],
    ['蓝色觉轴', dims.tritan, '#2f6fb0'],
  ];
  const bw = 200;
  const gap = 40;
  const baseY = y + 220;
  axes.forEach(([label, v, color], i) => {
    const x = 60 + i * (bw + gap);
    ctx.fillStyle = '#eef0f3';
    ctx.fillRect(x, y, bw, 220);
    ctx.fillStyle = color;
    const h = (v / 100) * 220;
    ctx.fillRect(x, baseY - h, bw, h);
    ctx.fillStyle = '#14202b';
    ctx.font = '700 26px Archivo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(v), x + bw / 2, y + 30);
    ctx.fillStyle = '#6e7c87';
    ctx.font = '500 18px Archivo, sans-serif';
    ctx.fillText(label, x + bw / 2, baseY + 28);
    ctx.textAlign = 'left';
  });
  y = baseY + 80;

  // 分析文字
  ctx.fillStyle = '#14202b';
  ctx.font = '500 20px Archivo, sans-serif';
  wrap(ctx, result.analysis, W - 80).forEach((ln) => {
    ctx.fillText(ln, 40, y);
    y += 30;
  });

  // 页脚
  ctx.fillStyle = '#6e7c87';
  ctx.font = '400 16px Archivo, sans-serif';
  ctx.fillText(`报告生成时间：${new Date(result.createdAt).toLocaleString('zh-CN')}`, 40, H - 60);
  ctx.fillText('本结果仅供参考，不能替代专业眼科诊断。', 40, H - 36);
  return c;
}

export function ReportActions({ result }: { result: TestResult }) {
  const [copied, setCopied] = useState(false);

  function exportPng() {
    const c = drawReport(result);
    const url = c.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `chromacheck-report-${result.id.slice(0, 8)}.png`;
    a.click();
  }

  async function copyText() {
    const txt = `色辨 ChromaCheck 筛查结果：\n结论：${uiText.overall(result.overall)}\n${
      result.type ? `类型：${uiText.type(result.type)}（${uiText.severity(result.severity)}）\n` : ''
    }置信度：${result.confidence}%\n维度：红${result.ishihara.dimensions.protan} 绿${result.ishihara.dimensions.deutan} 蓝${result.ishihara.dimensions.tritan}\n${result.analysis}`;
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
