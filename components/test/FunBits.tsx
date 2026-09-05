// components/test/FunBits.tsx — 进度点阵与章末过渡卡（趣味体验，答题期不泄露对错）
// chromacheck v1.4.0
'use client';

import React, { useEffect } from 'react';
import type { Chapter } from '@/lib/fun';

/** 圆点三态：已完成 / 当前 / 未到（硬约束：不表达对错） */
export function ProgressDots({
  total,
  index,
  pulse,
  id,
}: {
  total: number;
  index: number;
  /** 里程碑脉冲触发时为 true（配合 key 重放动画） */
  pulse?: boolean;
  id?: string;
}) {
  return (
    <div
      className={`row ${pulse ? 'is-milestone' : ''}`}
      id={id}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={Math.min(index + 1, total)}
      aria-label={`第 ${Math.min(index + 1, total)} / ${total} 题`}
      style={{ gap: 5, flexWrap: 'wrap', alignItems: 'center' }}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={`pdot ${i < index ? 'pdot-done' : i === index ? 'pdot-cur' : ''}`}
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: i < index ? 'var(--brand)' : i === index ? 'var(--brand)' : 'var(--border-strong)',
            opacity: i <= index ? 1 : 0.55,
            transform: i === index ? 'scale(1.35)' : 'none',
            transition: 'transform var(--d-3, 0.2s) var(--ease, ease)',
          }}
        />
      ))}
    </div>
  );
}

/** 章末轻科普过渡卡（趣味体验开启时，章节交替处出现；回车或按钮继续） */
export function ChapterCard({
  chapter,
  chapterNo,
  total,
  index,
  onContinue,
}: {
  chapter: Chapter;
  chapterNo: number;
  total: number;
  index: number;
  onContinue: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter') onContinue();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card stack" id="chapter-card" role="status" aria-label="章节过渡" style={{ gap: 'var(--s-3)', alignItems: 'center', textAlign: 'center', paddingBlock: 'var(--s-6)' }}>
      <span aria-hidden style={{ fontSize: '1.8rem', color: 'var(--brand)' }}>{chapter.icon}</span>
      <span className="muted" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>第 {chapterNo + 1} / 3 章</span>
      <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{chapter.name}</h2>
      <p className="muted" style={{ margin: 0, maxWidth: 420 }}>{chapter.copy}</p>
      <ProgressDots total={total} index={index} />
      <button type="button" className="btn btn-primary" onClick={onContinue}>继续检测</button>
      <span className="muted" style={{ fontSize: '0.75rem' }}>回车键也可继续</span>
    </div>
  );
}
