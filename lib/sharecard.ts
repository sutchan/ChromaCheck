// lib/sharecard.ts — 色觉人格分享卡：Canvas 手绘 + PNG 导出（零依赖，移植自 prototype/sharecard.js）
// chromacheck v1.7.2
import type { AnswerRecord, IshiharaResult, Overall } from './types';
import { getQuestion } from './questions';
import { uiText } from './scoring';
import { funTitle } from './fun';
import { W, H, VERDICT, wrapText, drawRadar } from './sharecard-canvas';

/** 六轴雷达值：三轴维度 + 转换/分类题错误率 + 消失题错误率 + 综合轴 */
export function computeRadar(ish: IshiharaResult, answers: AnswerRecord[]): { values: number[]; labels: string[] } {
  let tt = 0;
  let tw = 0;
  let vt = 0;
  let vw = 0;
  (answers || []).forEach((a) => {
    const q = getQuestion(a.questionId);
    if (!q) return;
    const ua = (a.userAnswer || '').trim();
    const ok = q.type === 'hidden' ? ua === '' : ua !== '' && ua === q.answer;
    if (q.type === 'transformation' || q.type === 'classification') {
      tt++;
      if (!ok) tw++;
    }
    if (q.type === 'vanishing') {
      vt++;
      if (!ok) vw++;
    }
  });
  const d = ish.dimensions;
  return {
    values: [
      d.protan,
      d.deutan,
      d.tritan,
      tt ? Math.round((tw / tt) * 100) : 0,
      vt ? Math.round((vw / vt) * 100) : 0,
      d.deutan,
    ],
    labels: ['红轴', '绿轴', '蓝轴', '转换题', '消失题', '综合'],
  };
}

export interface ShareCardInput {
  ish: IshiharaResult;
  radarValues: number[];
  radarLabels: string[];
  dateText: string;
  /** 趣味体验开关：开启时展示旅人称号 */
  funMode: boolean;
  /** 结果类型 / 综合判定（取称号用） */
  type: IshiharaResult['type'];
  overall: Overall;
}

export function drawShareCard(canvas: HTMLCanvasElement, input: ShareCardInput): void {
  const { ish, radarValues, radarLabels, dateText, funMode, type, overall } = input;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const v = VERDICT[ish.overall] ?? VERDICT.inconclusive;
  const color = v[0];
  const title = funTitle(type, overall, funMode);

  // 背景：暗色仪器外壳 + 点阵母题
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#10161f');
  bg.addColorStop(1, '#1c2530');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 4; j++) {
      ctx.beginPath();
      ctx.arc(52 + i * 32, 40 + j * 26, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = i < 3 ? 'rgba(142,133,255,0.5)' : 'rgba(255,255,255,0.10)';
      ctx.fill();
    }
  }

  // 品牌行
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '700 22px Archivo, "PingFang SC", sans-serif';
  ctx.fillText('色辨 ChromaCheck', 52, 96);
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '13px "IBM Plex Mono", monospace';
  ctx.fillText('ONLINE COLOR VISION SCREENING', 52, 118);

  // 结论
  ctx.fillStyle = color;
  ctx.font = '800 44px Archivo, "PingFang SC", sans-serif';
  ctx.fillText(v[1], 52, 196);
  const sub = (ish.type ? uiText.type(ish.type) : '') + (ish.severity ? ` · ${uiText.severity(ish.severity)}` : '');
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '20px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText(sub || '本次未得出类型结论', 52, 228);

  // 称号（趣味体验）或中性说明
  let y = 268;
  if (title) {
    ctx.fillStyle = '#8e85ff';
    ctx.font = '700 26px Archivo, "PingFang SC", sans-serif';
    ctx.fillText(`「${title.name}」`, 52, y);
    ctx.fillStyle = 'rgba(255,255,255,0.62)';
    ctx.font = '15px "PingFang SC", "Microsoft YaHei", sans-serif';
    y = wrapText(ctx, title.desc, 52, y + 30, W - 104, 24) + 6;
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '15px "PingFang SC", "Microsoft YaHei", sans-serif';
    y = wrapText(ctx, '本报告仅基于本机检测数据生成，仅供筛查参考，不构成医学诊断。', 52, y, W - 104, 24) + 6;
  }

  // 雷达
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '600 14px "IBM Plex Mono", monospace';
  ctx.fillText('COLOR VISION PROFILE / 色觉画像', 52, y + 34);
  drawRadar(ctx, radarValues, radarLabels, W / 2, y + 250, 150, color);

  // 三轴数值条
  const dims: [string, number][] = [
    ['红色觉', ish.dimensions.protan],
    ['绿色觉', ish.dimensions.deutan],
    ['蓝色觉', ish.dimensions.tritan],
  ];
  const by = y + 470;
  dims.forEach((d, k) => {
    const dy = by + k * 40;
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '15px "PingFang SC", sans-serif';
    ctx.fillText(d[0], 52, dy + 14);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(120, dy, W - 224, 10);
    ctx.fillStyle = color;
    ctx.fillRect(120, dy, ((W - 224) * Math.min(100, d[1])) / 100, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '600 14px "IBM Plex Mono", monospace';
    ctx.fillText(String(d[1]), W - 84, dy + 12);
  });

  // 页脚
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(52, H - 96);
  ctx.lineTo(W - 52, H - 96);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '14px "PingFang SC", sans-serif';
  ctx.fillText(`置信度 ${ish.confidence} / 100 · ${dateText}`, 52, H - 62);
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.font = '12px "PingFang SC", sans-serif';
  ctx.fillText('筛查参考，不替代专业医学诊断 · 数据不出本机', 52, H - 38);
}

/** 导出 PNG（canvas 无外源图像，不会被污染） */
export function exportShareCard(canvas: HTMLCanvasElement): void {
  const a = document.createElement('a');
  a.download = 'chromacheck-share-card.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
}
