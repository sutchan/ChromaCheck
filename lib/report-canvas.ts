// lib/report-canvas.ts — 筛查报告 PNG 绘制（纯函数，零依赖）
// chromacheck v1.7.2
import type { TestResult } from './types';
import { uiText } from './scoring';
import { D15_CAPS, D15_FIXED } from './questions/hue-arrangement';

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

/** 生成筛查报告位图（白底，A4 比例），供 PNG 导出 / 打印使用 */
export function drawReport(result: TestResult): HTMLCanvasElement {
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

  // 维度条 / 路径重合度 / 色相排列色卡条
  y += 60;
  if (result.hueArrangement) {
    const hue = result.hueArrangement;
    ctx.fillStyle = '#6e7c87';
    ctx.font = '500 18px Archivo, sans-serif';
    ctx.fillText('色卡排列（左参考 → 右参考）', 40, y);
    y += 20;
    const strip = [D15_FIXED[0], ...hue.order.map((i) => D15_CAPS[i]), D15_FIXED[1]];
    const cw = 44;
    strip.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(40 + i * (cw + 6), y, cw, cw);
    });
    y += cw + 24;
    ctx.fillStyle = '#14202b';
    ctx.font = '700 24px Archivo, sans-serif';
    ctx.fillText(
      `TES ${hue.totalErrorScore}（${hue.totalErrorScore < 20 ? '排列正常' : hue.totalErrorScore <= 40 ? '轻度偏差' : '明显偏差'}）`,
      40,
      y,
    );
    y += 50;
  } else {
    const axes: [string, number, string][] = result.ishihara
      ? [
          ['红色觉轴', result.ishihara.dimensions.protan, '#d64550'],
          ['绿色觉轴', result.ishihara.dimensions.deutan, '#2f8f6b'],
          ['蓝色觉轴', result.ishihara.dimensions.tritan, '#2f6fb0'],
        ]
      : result.pathTracking
        ? result.pathTracking.map((r, i) => [`路径${i + 1}`, r.overlapScore, r.passed ? '#2f8f6b' : '#d64550'])
        : [];
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
  }

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
