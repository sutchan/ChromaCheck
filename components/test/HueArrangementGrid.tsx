// components/test/HueArrangementGrid.tsx — D15 色相排列交互网格
// chromacheck v1.9.0
'use client';

import React, { useState } from 'react';
import type { HueArrangementQuestion } from '@/lib/types';
import { shuffledOrder } from '@/lib/questions/hue-arrangement';
import { useLang } from '@/components/layout/LangProvider';

/** 初始种子固定，保证 SSR / CSR 首屏渲染一致 */
const INITIAL_SEED = 20260905;

export function HueArrangementGrid({
  question,
  onSubmit,
}: {
  question: HueArrangementQuestion;
  onSubmit: (order: number[]) => void;
}) {
  const { t, lang } = useLang();
  const [order, setOrder] = useState<number[]>(() => shuffledOrder(INITIAL_SEED));
  const [pick, setPick] = useState<number | null>(null);

  function clickSlot(slot: number) {
    if (pick === null) {
      setPick(slot);
    } else if (pick === slot) {
      setPick(null);
    } else {
      const next = order.slice();
      [next[pick], next[slot]] = [next[slot], next[pick]];
      setOrder(next);
      setPick(null);
    }
  }

  function reshuffle() {
    setOrder(shuffledOrder(Math.floor(Math.random() * 0x7fffffff) + 1));
    setPick(null);
  }

  const [fixedLeft, fixedRight] = question.fixedColors;

  return (
    <div className="stack" id="hue-grid-wrap" style={{ gap: 'var(--s-4)', width: '100%' }}>
      <div className="stack" style={{ gap: 'var(--s-1)' }}>
        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{t('test.hueInstruction')}</h3>
        <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>{t('test.hueDesc')}</p>
      </div>

      {/* 原生 button 天然键盘可用；用 group + aria-pressed 表达选中态，避免未实现键盘模式的 listbox 误用 */}
      <div className="row" id="hue-grid" role="group" aria-label={t('test.hueGroupAria')} style={{ gap: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'stretch' }}>
        <FixedCard color={fixedLeft} position={t('test.hueFixedLeft')} />
        {order.map((capId, slot) => (
          <button
            type="button"
            key={slot}
            aria-pressed={pick === slot}
            aria-label={t('test.hueCardAria', { n: slot + 1 })}
            className="stack"
            onClick={() => clickSlot(slot)}
            style={{
              gap: 4,
              padding: 6,
              borderRadius: 'var(--r-md)',
              border: `2px solid ${pick === slot ? 'var(--brand)' : 'transparent'}`,
              background: pick === slot ? 'var(--bg-sunken)' : 'transparent',
              cursor: 'pointer',
              alignItems: 'center',
            }}
          >
            <span
              aria-hidden
              style={{ width: 46, height: 46, borderRadius: '50%', background: question.cards[capId], boxShadow: 'var(--sh-1)' }}
            />
            <span className="muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
              {String(slot + 1).padStart(2, '0')}
            </span>
          </button>
        ))}
        <FixedCard color={fixedRight} position={t('test.hueFixedRight')} />
      </div>

      <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-ghost" style={{ height: 38, fontSize: '0.85rem' }} onClick={reshuffle}>
          {t('test.hueReshuffle')}
        </button>
        <div style={{ flex: 1 }} />
        <button type="button" className="btn btn-primary" onClick={() => onSubmit(order)} disabled={pick !== null}>
          {t('test.hueSubmit')}
        </button>
      </div>

      <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>{t('test.hueHint')}</p>
    </div>
  );
}

function FixedCard({ color, position }: { color: string; position: string }) {
  return (
    <div className="stack" aria-hidden style={{ gap: 4, padding: 6, alignItems: 'center', opacity: 0.85 }}>
      <span style={{ width: 46, height: 46, borderRadius: '50%', background: color, boxShadow: 'var(--sh-1)' }} />
      <span className="muted" style={{ fontSize: '0.72rem' }}>{position}参考</span>
    </div>
  );
}
