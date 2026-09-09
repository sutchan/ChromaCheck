// components/test/HueArrangementGrid.tsx — D15 色相排列交互网格
// chromacheck v1.2.0
'use client';

import React, { useState } from 'react';
import type { HueArrangementQuestion } from '@/lib/types';
import { shuffledOrder } from '@/lib/questions/hue-arrangement';

/** 初始种子固定，保证 SSR / CSR 首屏渲染一致 */
const INITIAL_SEED = 20260905;

export function HueArrangementGrid({
  question,
  onSubmit,
}: {
  question: HueArrangementQuestion;
  onSubmit: (order: number[]) => void;
}) {
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
        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>把 15 张色卡按颜色渐变的顺序排好</h3>
        <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>
          两端紫色卡为固定参考。点击一张选中，再点击另一张交换位置；排好后提交。
        </p>
      </div>

      {/* 原生 button 天然键盘可用；用 group + aria-pressed 表达选中态，避免未实现键盘模式的 listbox 误用 */}
      <div className="row" id="hue-grid" role="group" aria-label="色相排列色卡" style={{ gap: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'stretch' }}>
        <FixedCard color={fixedLeft} position="左" />
        {order.map((capId, slot) => (
          <button
            type="button"
            key={slot}
            aria-pressed={pick === slot}
            aria-label={`第 ${slot + 1} 位色卡`}
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
        <FixedCard color={fixedRight} position="右" />
      </div>

      <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-ghost" style={{ height: 38, fontSize: '0.85rem' }} onClick={reshuffle}>
          重新打乱
        </button>
        <div style={{ flex: 1 }} />
        <button type="button" className="btn btn-primary" onClick={() => onSubmit(order)} disabled={pick !== null}>
          提交并查看结果
        </button>
      </div>

      <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>
        提示：请勿使用系统取色器或屏幕滤镜辅助，否则结果无效。
      </p>
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
