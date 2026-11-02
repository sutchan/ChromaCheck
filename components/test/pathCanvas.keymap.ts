// components/test/pathCanvas.keymap.ts — 路径追踪键盘通道：光标移动 / 落点 / 撤销 / 清空
// chromacheck v1.11.2
import type { KeyboardEvent, MutableRefObject } from 'react';
import { STEP } from './pathCanvas.types';

type Pt = { x: number; y: number };

interface KeymapHost {
  cursorRef: MutableRefObject<Pt>;
  ptsRef: MutableRefObject<Pt[]>;
  setUserPath: (p: Pt[]) => void;
  forceTick: (fn: (v: number) => number) => void;
}

/** 键盘通道：返回 onKeyDown 处理器与清空（按钮共用） */
export function createPathKeymap(host: KeymapHost) {
  const { cursorRef, ptsRef, setUserPath, forceTick } = host;

  function moveCursor(dx: number, dy: number) {
    const c = cursorRef.current;
    cursorRef.current = {
      x: Math.max(0, Math.min(1, c.x + dx)),
      y: Math.max(0, Math.min(1, c.y + dy)),
    };
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

  function handleKeyDown(e: KeyboardEvent<HTMLCanvasElement>) {
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

  return { handleKeyDown, clear };
}
