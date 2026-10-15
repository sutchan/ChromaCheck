// components/test/PathTrackingCanvas.tsx — 路径追踪画布 + 描线交互（指针 + 键盘双通道）
// chromacheck v1.9.0
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { buildPathField, type PathField } from '@/lib/path-field';
import { simulate } from '@/lib/ishihara';
import type { PathTrackingQuestion } from '@/lib/types';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';

const STEP = 0.04; // 键盘移动步长（归一化坐标）

interface Props {
  question: PathTrackingQuestion;
  onResult: (userPath: { x: number; y: number }[]) => void;
}

export function PathTrackingCanvas({ question, onResult }: Props) {
  const { t } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const fieldRef = useRef<PathField | null>(null);
  const drawing = useRef(false);
  const ptsRef = useRef<{ x: number; y: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [userPath, setUserPath] = useState<{ x: number; y: number }[]>([]);
  const [, forceTick] = useState(0);

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
      const W = fieldRef.current!.W;
      const H = fieldRef.current!.H;
      ctx.moveTo(up[0].x * W, up[0].y * H);
      for (let i = 1; i < up.length; i++) ctx.lineTo(up[i].x * W, up[i].y * H);
      ctx.stroke();
    }
    // 键盘光标
    const c = cursorRef.current;
    ctx.beginPath();
    ctx.arc(c.x * fieldRef.current!.W, c.y * fieldRef.current!.H, 9, 0, Math.PI * 2);
    ctx.strokeStyle = '#5b7cfa';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /** rAF 节流：合并同一帧内的多次 pointermove，只做一次重绘 */
  function scheduleRender() {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      render();
    });
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
    cursorRef.current = { x: 0.5, y: 0.5 };
    setUserPath([]);
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  // 卸载时取消未执行的重绘，避免操作已卸载的 canvas
  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

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
    cursorRef.current = toNorm(e);
    ptsRef.current = [cursorRef.current];
    setUserPath(ptsRef.current);
    forceTick((v) => v + 1);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const p = toNorm(e);
    cursorRef.current = p;
    ptsRef.current.push(p);
    scheduleRender();
  }

  function onUp() {
    if (!drawing.current) return;
    drawing.current = false;
    const up = ptsRef.current.slice();
    setUserPath(up);
    forceTick((v) => v + 1);
    if (up.length > 1) onResult(up);
  }

  function moveCursor(dx: number, dy: number) {
    const c = cursorRef.current;
    cursorRef.current = { x: Math.max(0, Math.min(1, c.x + dx)), y: Math.max(0, Math.min(1, c.y + dy)) };
    forceTick((v) => v + 1);
  }

  function dropCursor() {
    ptsRef.current = [...ptsRef.current, { ...cursorRef.current }];
    setUserPath(ptsRef.current);
    forceTick((v) => v + 1);
  }

  function undo() {
    ptsRef.current = ptsRef.current.slice(0, -1);
    setUserPath(ptsRef.current);
    forceTick((v) => v + 1);
  }

  function clear() {
    ptsRef.current = [];
    setUserPath([]);
    forceTick((v) => v + 1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveCursor(-STEP, 0);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveCursor(STEP, 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveCursor(0, -STEP);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveCursor(0, STEP);
        break;
      case 'Enter':
        e.preventDefault();
        dropCursor();
        break;
      case 'Backspace':
        e.preventDefault();
        undo();
        break;
      case 'Escape':
        e.preventDefault();
        clear();
        break;
      default:
        break;
    }
  }

  return (
    <div className="stack" style={{ gap: 'var(--s-3)', alignItems: 'center' }} id="path-canvas-wrap">
      <canvas
        id="path-canvas"
        ref={canvasRef}
        width={question.width}
        height={question.height}
        className="path-canvas"
        tabIndex={0}
        role="application"
        aria-label={t('test.pathAria')}
        aria-keyshortcuts="ArrowKeys Enter Backspace Escape"
        style={{ width: 'min(100%, 560px)', height: 'auto', touchAction: 'none', borderRadius: 12, boxShadow: 'var(--shadow)', outline: 'none', cursor: 'crosshair' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onKeyDown={handleKeyDown}
      />
      <div className="row" style={{ gap: 'var(--s-3)' }}>
        <button type="button" className="btn btn-ghost" onClick={clear} disabled={userPath.length === 0}>
          <Icon name="reset" size={18} /> {t('test.pathRedraw')}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => userPath.length > 1 && onResult(userPath)}
          disabled={userPath.length < 2}
        >
          {t('test.pathSubmit')}
        </button>
        <span className="muted" style={{ fontSize: '0.85rem', alignSelf: 'center' }}>{t('test.pathPoints', { n: userPath.length })}</span>
      </div>
      <p className="muted" style={{ margin: 0, fontSize: '0.85rem', textAlign: 'center' }}>
        {t('test.pathHint')}
      </p>
      <p className="muted" style={{ margin: 0, fontSize: '0.82rem', textAlign: 'center' }}>
        {t('test.pathKeyboardHint')}
      </p>
    </div>
  );
}
