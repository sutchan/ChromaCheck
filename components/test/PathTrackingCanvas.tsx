// components/test/PathTrackingCanvas.tsx — 路径追踪画布 + 描线交互
// chromacheck v1.1.0
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { buildPathField, type PathField } from '@/lib/path-field';
import { simulate } from '@/lib/ishihara';
import type { PathTrackingQuestion } from '@/lib/types';
import { Icon } from '@/components/common/Icon';

interface Props {
  question: PathTrackingQuestion;
  onResult: (userPath: { x: number; y: number }[]) => void;
}

export function PathTrackingCanvas({ question, onResult }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const fieldRef = useRef<PathField | null>(null);
  const drawing = useRef(false);
  const ptsRef = useRef<{ x: number; y: number }[]>([]);
  const [userPath, setUserPath] = useState<{ x: number; y: number }[]>([]);

  function render() {
    const canvas = canvasRef.current;
    const off = offRef.current;
    if (!canvas || !off) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(off, 0, 0);
    const up = ptsRef.current;
    if (up.length > 1) {
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(20,30,45,0.85)';
      ctx.moveTo(up[0].x * fieldRef.current!.W, up[0].y * fieldRef.current!.H);
      for (let i = 1; i < up.length; i++) ctx.lineTo(up[i].x * fieldRef.current!.W, up[i].y * fieldRef.current!.H);
      ctx.stroke();
    }
  }

  useEffect(() => {
    const field = buildPathField({
      seed: question.seed,
      kind: question.kind,
      width: question.width,
      height: question.height,
      pathColor: question.pathDotColor,
      bgColors: [question.backgroundDots.color],
      radiusRange: question.backgroundDots.radiusRange,
    });
    fieldRef.current = field;

    const off = document.createElement('canvas');
    off.width = field.W;
    off.height = field.H;
    const o = off.getContext('2d');
    if (o) {
      o.fillStyle = simulate('#efe9db', 'none');
      o.fillRect(0, 0, field.W, field.H);
      field.dots.forEach((d) => {
        o.beginPath();
        o.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        o.fillStyle = simulate(d.color, 'none');
        o.fill();
      });
    }
    offRef.current = off;
    ptsRef.current = [];
    setUserPath([]);
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  function toNorm(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    drawing.current = true;
    ptsRef.current = [toNorm(e)];
    setUserPath(ptsRef.current);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    ptsRef.current.push(toNorm(e));
    render();
  }

  function onUp() {
    if (!drawing.current) return;
    drawing.current = false;
    const up = ptsRef.current.slice();
    setUserPath(up);
    if (up.length > 1) onResult(up);
  }

  function clear() {
    ptsRef.current = [];
    setUserPath([]);
    render();
  }

  return (
    <div className="stack" style={{ gap: 'var(--s-3)', alignItems: 'center' }}>
      <canvas
        id="path-canvas"
        ref={canvasRef}
        width={question.width}
        height={question.height}
        className="path-canvas"
        style={{ width: 'min(100%, 560px)', height: 'auto', touchAction: 'none', borderRadius: 12, boxShadow: 'var(--shadow)' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        aria-label="沿色点连成的路径描线"
      />
      <div className="row" style={{ gap: 'var(--s-3)' }}>
        <button type="button" className="btn btn-ghost" onClick={clear} disabled={userPath.length === 0}>
          <Icon name="reset" size={18} /> 重画
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => userPath.length > 1 && onResult(userPath)}
          disabled={userPath.length < 2}
        >
          确认提交
        </button>
      </div>
      <p className="muted" style={{ margin: 0, fontSize: '0.85rem', textAlign: 'center' }}>
        用手指或鼠标沿红色色点连成的路径描线，松手即记录。若看不到红色路径，凭直觉描出你认为相连的点。
      </p>
    </div>
  );
}
