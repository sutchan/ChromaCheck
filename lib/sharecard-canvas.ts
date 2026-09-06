// lib/sharecard-canvas.ts — 分享卡 Canvas 绘制原语（零依赖，移植自 prototype/sharecard.js）
// chromacheck v1.7.2
import type { Overall } from './types';

export const W = 720;
export const H = 960;

export const VERDICT: Record<Overall, [string, string]> = {
  normal: ['#0e8a99', '色觉正常'],
  suspected_deficiency: ['#e8a03c', '疑似色弱'],
  suspected_blindness: ['#f08b84', '疑似色盲'],
  inconclusive: ['#7c8798', '结果不确定'],
};

export function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number): number {
  let line = '';
  const lines: string[] = [];
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxW) {
      lines.push(line);
      line = ch;
    } else line += ch;
  }
  if (line) lines.push(line);
  lines.forEach((ln, k) => ctx.fillText(ln, x, y + k * lh));
  return y + lines.length * lh;
}

export function pt(idx: number, n: number, cx: number, cy: number, R: number, r: number): [number, number] {
  const a = -Math.PI / 2 + (idx / n) * Math.PI * 2;
  return [cx + Math.cos(a) * R * r, cy + Math.sin(a) * R * r];
}

export function drawRadar(
  ctx: CanvasRenderingContext2D,
  values: number[],
  labels: string[],
  cx: number,
  cy: number,
  R: number,
  color: string,
) {
  const n = values.length;
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 1;
  [0.25, 0.5, 0.75, 1].forEach((rr) => {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p = pt(i, n, cx, cy, R, rr);
      i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
    }
    ctx.closePath();
    ctx.stroke();
  });
  for (let i = 0; i < n; i++) {
    const e = pt(i, n, cx, cy, R, 1);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(e[0], e[1]);
    ctx.stroke();
  }
  ctx.beginPath();
  for (let j = 0; j < n; j++) {
    const p = pt(j, n, cx, cy, R, Math.max(0, Math.min(100, values[j])) / 100);
    j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(75,61,240,0.38)';
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = color;
  for (let j = 0; j < n; j++) {
    const p = pt(j, n, cx, cy, R, Math.max(0, Math.min(100, values[j])) / 100);
    ctx.beginPath();
    ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '13px Archivo, "PingFang SC", sans-serif';
  labels.forEach((lb, k) => {
    const q = pt(k, n, cx, cy, R, 1.22);
    ctx.textAlign = Math.abs(q[0] - cx) < 6 ? 'center' : q[0] > cx ? 'left' : 'right';
    ctx.fillText(lb, q[0], q[1] + 4);
  });
  ctx.textAlign = 'left';
}
