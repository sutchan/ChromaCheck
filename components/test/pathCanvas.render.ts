// components/test/pathCanvas.render.ts — 路径追踪画布绘制（纯函数，无 React 依赖）
// chromacheck v1.11.1
import type { PathField } from '@/lib/path-field';

/** 在 canvas 上重绘：底图 + 已描用户路径 + 键盘光标 */
export function drawPathField(
  canvas: HTMLCanvasElement | null,
  off: HTMLCanvasElement | null,
  field: PathField | null,
  userPath: { x: number; y: number }[],
  cursor: { x: number; y: number },
) {
  const ctx = canvas?.getContext('2d');
  if (!ctx || !off || !field) return;
  ctx.drawImage(off, 0, 0);
  const up = userPath;
  if (up.length > 1) {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(20,30,45,0.85)';
    const W = field.W;
    const H = field.H;
    ctx.moveTo(up[0].x * W, up[0].y * H);
    for (let i = 1; i < up.length; i++) ctx.lineTo(up[i].x * W, up[i].y * H);
    ctx.stroke();
  }
  const c = cursor;
  ctx.beginPath();
  ctx.arc(c.x * field.W, c.y * field.H, 9, 0, Math.PI * 2);
  ctx.strokeStyle = '#5b7cfa';
  ctx.lineWidth = 2;
  ctx.stroke();
}
