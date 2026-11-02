// components/test/PathTrackingCanvas.tsx — 路径追踪画布 + 描线交互（指针 + 键盘双通道）
// chromacheck v1.11.1
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { buildPathField, type PathField } from '@/lib/path-field';
import { simulate } from '@/lib/ishihara';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';
import { type PathCanvasProps } from './pathCanvas.types';
import { drawPathField } from './pathCanvas.render';
import { toNormPoint } from './pathCanvas.coords';
import { createPathKeymap } from './pathCanvas.keymap';

export function PathTrackingCanvas({ question, onResult }: PathCanvasProps) {
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
  const { handleKeyDown, clear } = createPathKeymap({ cursorRef, ptsRef, setUserPath, forceTick });

  function scheduleRender() {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      drawPathField(canvasRef.current, offRef.current, fieldRef.current, ptsRef.current, cursorRef.current);
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
    drawPathField(canvasRef.current, off, field, [], cursorRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  // 卸载时取消未执行的重绘，避免操作已卸载的 canvas
  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    drawing.current = true;
    cursorRef.current = toNormPoint(canvasRef.current!, e);
    ptsRef.current = [cursorRef.current];
    setUserPath(ptsRef.current);
    forceTick((v) => v + 1);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const p = toNormPoint(canvasRef.current!, e);
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
