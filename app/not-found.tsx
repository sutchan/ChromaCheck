// app/not-found.tsx — 404
// chromacheck v1.7.0
import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';

export default function NotFound() {
  return (
    <div className="wrap stack" style={{ paddingBlock: 'var(--s-8)', alignItems: 'center', textAlign: 'center', gap: 'var(--s-3)' }}>
      <Icon name="alert" size={40} />
      <h1 style={{ margin: 0 }}>页面走丢了</h1>
      <p className="muted">你访问的页面不存在或已被移动。</p>
      <Link href="/" className="btn btn-primary">返回首页</Link>
    </div>
  );
}
