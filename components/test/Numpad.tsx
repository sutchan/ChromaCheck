// components/test/Numpad.tsx — 数字键盘
// chromacheck v1.0.0
'use client';

import React from 'react';
import { Icon } from '@/components/common/Icon';

export interface NumpadProps {
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'];

export function Numpad({ onDigit, onBackspace, onClear }: NumpadProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--s-2)',
        maxWidth: 320,
        marginInline: 'auto',
      }}
    >
      {KEYS.map((k, i) => {
        if (k === 'clear') {
          return (
            <button key={i} type="button" className="btn btn-ghost" style={{ height: 52 }} onClick={onClear} aria-label="清除">
              <Icon name="x" size={18} />
            </button>
          );
        }
        if (k === 'back') {
          return (
            <button key={i} type="button" className="btn btn-ghost" style={{ height: 52 }} onClick={onBackspace} aria-label="删除一位">
              <Icon name="reset" size={18} />
            </button>
          );
        }
        return (
          <button
            key={i}
            type="button"
            className="btn btn-ghost"
            style={{ height: 52, fontSize: '1.3rem', fontFamily: 'var(--font-mono)' }}
            onClick={() => onDigit(k)}
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}
