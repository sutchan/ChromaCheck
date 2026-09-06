// app/result/[id]/error.tsx — 结果页段级错误边界
// chromacheck v1.7.0
'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';

export default function ResultError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="wrap stack" style={{ paddingBlock: 'var(--s-8)', alignItems: 'center', textAlign: 'center', gap: 'var(--s-3)' }}>
      <Icon name="alert" size={40} />
      <h1 style={{ margin: 0 }}>结果加载失败</h1>
      <p className="muted">读取该检测结果时出现异常。你可以重试，或重新进行一次检测。</p>
      <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button type="button" className="btn btn-primary" onClick={reset}>重试</button>
        <Link href="/test" className="btn btn-ghost">开始检测</Link>
      </div>
    </div>
  );
}
