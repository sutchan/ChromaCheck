// components/test/IshiharaPlate.tsx — 点阵检测图渲染（移植自 prototype/ishihara.js）
// chromacheck v1.0.0
'use client';

import React, { useEffect, useRef } from 'react';
import { buildDots, mulberry32, PALETTE, simulate } from '@/lib/ishihara';
import type { PlateType } from '@/lib/types';

export interface IshiharaPlateProps {
  type: PlateType;
  /** 要在图中绘制的数字（隐藏题传异常可见的隐藏数字） */
  text: string;
  seed: number;
  cvd?: string;
  dots?: number;
  animate?: boolean;
  className?: string;
  maxWidth?: number;
}

function buildMask(text: string, size: number): (x: number, y: number) => boolean {
  const off = document.createElement('canvas');
  off.width = off.height = size;
  const c = off.getContext('2d');
  if (!c) return () => false;
  const fs = size * (text.length > 2 ? 0.46 : 0.58);
  c.fillStyle = '#000';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = `700 ${fs}px Archivo, "PingFang SC", system-ui, sans-serif`;
  c.fillText(text, size / 2, size / 2 + fs * 0.02);
  const data = c.getImageData(0, 0, size, size).data;
  return (x, y) => data[((y | 0) * size + (x | 0)) * 4 + 3] > 110;
}

export function IshiharaPlate({
  type,
  text,
  seed,
  cvd = 'none',
  dots = 1600,
  animate = true,
  className,
  maxWidth = 460,
}: IshiharaPlateProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const size = 720;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = ctx;

    const rng = mulberry32((seed || 1) * 9176 + 13);
    const pal = PALETTE[type] || PALETTE.normal;
    const inGlyph = text ? buildMask(text, size) : () => false;
    const dotList = buildDots(rng, size, 9, 15, dots);
    for (let i = dotList.length - 1; i > 0; i--) {
      const j = (rng() * (i + 1)) | 0;
      const t = dotList[i];
      dotList[i] = dotList[j];
      dotList[j] = t;
    }

    function paint(progress: number) {
      c.clearRect(0, 0, size, size);
      c.save();
      c.beginPath();
      c.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      c.clip();
      c.fillStyle = simulate('#efe9db', cvd);
      c.fillRect(0, 0, size, size);
      const n = Math.floor(dotList.length * progress);
      for (let k = 0; k < n; k++) {
        const d = dotList[k];
        const isFig = inGlyph(d.x, d.y);
        const set = isFig ? pal.fig : pal.bg;
        const hex = set[(k + (isFig ? 1 : 0)) % set.length];
        c.beginPath();
        const rr = k > n - 90 ? d.r * (0.35 + 0.65 * ((k - (n - 90)) / 90)) : d.r;
        c.arc(d.x, d.y, rr, 0, Math.PI * 2);
        c.fillStyle = simulate(hex, cvd);
        c.fill();
      }
      c.restore();
      c.beginPath();
      c.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
      c.lineWidth = 3;
      c.strokeStyle = 'rgba(16,22,30,.10)';
      c.stroke();
    }

    if (animate === false) {
      paint(1);
      return;
    }
    let start: number | null = null;
    const dur = 720;
    function step(ts: number) {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      paint(p < 1 ? 1 - Math.pow(1 - p, 3) : 1);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [type, text, seed, cvd, dots, animate]);

  return (
    <div className={`hero-plate ${className ?? ''}`} style={{ maxWidth, marginInline: 'auto', background: '#efe9db' }}>
      <canvas ref={ref} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'inherit' }} />
    </div>
  );
}
