// app/history/error.tsx — 历史记录段级错误边界
// chromacheck v1.7.0
'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';

export default function HistoryError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="wrap stack" style={{ paddingBlock: 'var(--s-8)', alignItems: 'center', textAlign: 'center', gap: 'var(--s-3)' }}>
      <Icon name="alert" size={40} />
      <h1 style={{ margin: 0 }}>历史记录加载失败</h1>
      <p className="muted">读取本地历史时出现异常。你可以重试，或返回首页。</p>
      <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button type="button" className="btn btn-primary" onClick={reset}>重试</button>
        <Link href="/" className="btn btn-ghost">返回首页</Link>
      </div>
    </div>
  );
}
