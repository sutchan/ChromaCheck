// app/test/error.tsx — 检测段级错误边界（覆盖全部子路由）
// chromacheck v1.7.0
'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';

export default function TestError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="wrap stack" style={{ paddingBlock: 'var(--s-8)', alignItems: 'center', textAlign: 'center', gap: 'var(--s-3)' }}>
      <Icon name="alert" size={40} />
      <h1 style={{ margin: 0 }}>检测过程出现错误</h1>
      <p className="muted">检测流程运行异常。你可以重试，或从检测模式重新开始。</p>
      <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button type="button" className="btn btn-primary" onClick={reset}>重试</button>
        <Link href="/test" className="btn btn-ghost">选择检测模式</Link>
      </div>
    </div>
  );
}
