// app/offline/page.tsx — 离线兜底页（Service Worker 导航回退目标）
// chromacheck v1.7.9
import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Icon } from '@/components/common/Icon';

export const metadata: Metadata = {
  title: '当前处于离线状态',
  description: '网络不可用时的离线说明页。',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div id="offline-page" className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-4)', maxWidth: 640 }}>
      <span className="chip">离线</span>
      <h1 style={{ margin: 0 }}>当前没有网络连接</h1>
      <p className="muted" style={{ margin: 0 }}>
        已缓存的页面（首页、检测前指引、模式选择）与检测图版可离线使用；首次访问后再次打开即可离线运行。
        检测数据仍然只保存在本机浏览器，离线状态下不会影响已保存的历史记录。
      </p>
      <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap' }}>
        <Link href="/" className="btn btn-primary">
          回到首页
        </Link>
        <Link href="/test" className="btn">
          <Icon name="arrowRight" size={18} />
          继续检测
        </Link>
      </div>
      <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>
        恢复网络后刷新页面即可获取最新内容。
      </p>
    </div>
  );
}
