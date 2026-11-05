// app/offline/page.tsx — 离线兜底页（服务端壳，metadata 静态；内容见 OfflineContent）
// chromacheck v1.13.2
import React from 'react';
import type { Metadata } from 'next';
import { OfflineContent } from '@/components/offline/OfflineContent';

export const metadata: Metadata = {
  title: '当前处于离线状态',
  description: '网络不可用时的离线说明页。',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div id="offline-page" className="wrap stack" style={{ paddingBlock: 'var(--s-6)', gap: 'var(--s-5)' }}>
      <OfflineContent />
    </div>
  );
}
