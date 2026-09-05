// components/result/HueArrangementSummary.tsx — 色相排列结果摘要
// chromacheck v1.2.0
'use client';

import React from 'react';
import type { HueArrangementResult } from '@/lib/types';
import { D15_CAPS, D15_FIXED } from '@/lib/questions/hue-arrangement';

/** 与 lib/hue-scoring.ts 阈值一致（< 20 正常，20–40 轻度，> 40 明显） */
function verdict(tes: number): { chip: string; label: string } {
  if (tes < 20) return { chip: 'chip-ok', label: '排列正常' };
  if (tes <= 40) return { chip: 'chip-warn', label: '轻度偏差' };
  return { chip: 'chip-risk', label: '明显偏差' };
}

export function HueArrangementSummary({ result }: { result: HueArrangementResult }) {
  const v = verdict(result.totalErrorScore);
  // 展示用户最终排列：左参考 + 15 张 + 右参考
  const strip = [D15_FIXED[0], ...result.order.map((i) => D15_CAPS[i]), D15_FIXED[1]];
  return (
    <div className="card stack" id="hue-summary" style={{ gap: 'var(--s-3)' }}>
      <div className="row between" style={{ flexWrap: 'wrap', gap: 'var(--s-2)' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>色相排列结果（D15）</h3>
        <span className={`chip ${v.chip}`}>{v.label}</span>
      </div>

      <div className="row" style={{ gap: 'var(--s-4)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="stat">
          <span className="stat-k">TES 总误差分</span>
          <span className="stat-v" style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)' }}>
            {result.totalErrorScore}
          </span>
        </div>
        <div className="stat">
          <span className="stat-k">偏差方向</span>
          <span className="stat-v" style={{ fontSize: '0.95rem' }}>
            {result.deviationDirection === 'none'
              ? '无明显偏差'
              : result.deviationDirection === 'tritan'
                ? '蓝黄向'
                : '红绿向'}
          </span>
        </div>
      </div>

      <div>
        <div className="stat-k" style={{ marginBottom: 6 }}>你的排列（左参考 → 右参考）</div>
        <div className="row" id="hue-strip" style={{ gap: 4, flexWrap: 'wrap' }}>
          {strip.map((c, i) => (
            <span
              key={i}
              aria-hidden
              title={i === 0 || i === strip.length - 1 ? '参考卡' : `卡 ${i}`}
              style={{ width: 30, height: 30, borderRadius: 8, background: c, boxShadow: 'var(--sh-1)' }}
            />
          ))}
        </div>
      </div>

      <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
        TES &lt; 20 为排列正常，20–40 为轻度偏差，&gt; 40 为明显偏差。D-15 筛查不能确定具体异常类型，结果请以专业眼科检查为准。
      </p>
    </div>
  );
}
