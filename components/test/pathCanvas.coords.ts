// components/test/pathCanvas.coords.ts — 指针坐标 → 归一化坐标
// chromacheck v1.11.1
import type { PointerEvent } from 'react';

export function toNormPoint(
  canvas: HTMLCanvasElement,
  e: PointerEvent<HTMLCanvasElement>,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
}
