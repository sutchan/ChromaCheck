'use client';
// components/test/ChildPlate.tsx — 儿童模式点阵图渲染（图形替代数字）
// chromacheck v1.7.9
import React, { useEffect, useRef } from 'react';
import { buildDots, mulberry32, PALETTE, simulate } from '@/lib/ishihara';
import type { PlateType } from '@/lib/types';
import type { ChildShape } from '@/lib/questions/child';

export interface ChildPlateProps {
  type: PlateType;
  shape: ChildShape;
  seed: number;
  dots?: number;
  maxWidth?: number;
}

/** 在离屏画布绘制图形路径（与选项图标形状一致） */
function drawShapePath(c: CanvasRenderingContext2D, shape: ChildShape, size: number): void {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.3;
  c.beginPath();
  switch (shape) {
    case 'circle':
      c.arc(cx, cy, R, 0, Math.PI * 2);
      break;
    case 'square': {
      const s = R * 1.75;
      c.rect(cx - s / 2, cy - s / 2, s, s);
      break;
    }
    case 'triangle':
      c.moveTo(cx, cy - R * 1.15);
      c.lineTo(cx + R, cy + R * 0.75);
      c.lineTo(cx - R, cy + R * 0.75);
      c.closePath();
      break;
    case 'star': {
      const outer = R * 1.15;
      const inner = R * 0.5;
      for (let i = 0; i < 10; i++) {
        const rr = i % 2 === 0 ? outer : inner;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const px = cx + Math.cos(a) * rr;
        const py = cy + Math.sin(a) * rr;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      break;
    }
    case 'heart': {
      c.moveTo(cx, cy + R * 1.05);
      c.bezierCurveTo(cx - R * 1.5, cy - R * 0.2, cx - R * 0.7, cy - R * 1.25, cx, cy - R * 0.45);
      c.bezierCurveTo(cx + R * 0.7, cy - R * 1.25, cx + R * 1.5, cy - R * 0.2, cx, cy + R * 1.05);
      c.closePath();
      break;
    }
    case 'cross': {
      const w = R * 0.62;
      c.rect(cx - R, cy - w / 2, R * 2, w);
      c.rect(cx - w / 2, cy - R, w, R * 2);
      break;
    }
  }
}

function buildShapeMask(shape: ChildShape, size: number): (x: number, y: number) => boolean {
  const off = document.createElement('canvas');
  off.width = size;
  off.height = size;
  const c = off.getContext('2d');
  if (!c) return () => false;
  c.fillStyle = '#000';
  drawShapePath(c, shape, size);
  c.fill();
  const data = c.getImageData(0, 0, size, size).data;
  return (x, y) => data[((y | 0) * size + (x | 0)) * 4 + 3] > 110;
}

export function ChildPlate({ type, shape, seed, dots = 1500, maxWidth = 420 }: ChildPlateProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const size = 720;
    canvas.width = size;
    canvas.height = size;
    const c = canvas.getContext('2d');
    if (!c) return;

    const rng = mulberry32((seed || 1) * 9176 + 13);
    const pal = PALETTE[type] ?? PALETTE.normal;
    const inShape = buildShapeMask(shape, size);
    const dotList = buildDots(rng, size, 10, 16, dots);

    c.clearRect(0, 0, size, size);
    c.save();
    c.beginPath();
    c.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = '#efe9db';
    c.fillRect(0, 0, size, size);
    for (let k = 0; k < dotList.length; k++) {
      const d = dotList[k];
      const isFig = inShape(d.x, d.y);
      const set = isFig ? pal.fig : pal.bg;
      c.beginPath();
      c.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      c.fillStyle = simulate(set[(k + (isFig ? 1 : 0)) % set.length], 'none');
      c.fill();
    }
    c.restore();
    c.beginPath();
    c.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
    c.lineWidth = 3;
    c.strokeStyle = 'rgba(16,22,30,.10)';
    c.stroke();
  }, [type, shape, seed, dots]);

  return (
    <div className="hero-plate" style={{ maxWidth, marginInline: 'auto', background: '#efe9db' }}>
      <canvas
        ref={ref}
        aria-label="儿童模式检测图"
        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'inherit' }}
      />
    </div>
  );
}
