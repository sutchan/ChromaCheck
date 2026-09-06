// app/error.tsx — 根级错误边界
// chromacheck v1.7.0
'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="wrap stack" style={{ paddingBlock: 'var(--s-8)', alignItems: 'center', textAlign: 'center', gap: 'var(--s-3)' }}>
      <Icon name="alert" size={40} />
      <h1 style={{ margin: 0 }}>出了点问题</h1>
      <p className="muted">页面运行出现异常。你可以重试，或返回首页重新开始。</p>
      <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button type="button" className="btn btn-primary" onClick={reset}>重试</button>
        <Link href="/" className="btn btn-ghost">返回首页</Link>
      </div>
    </div>
  );
}
