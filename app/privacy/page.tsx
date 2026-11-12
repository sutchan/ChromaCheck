// app/privacy/page.tsx — 隐私政策（服务端壳，metadata 静态；内容见 PrivacyContent）
// chromacheck v1.17.0
import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { PrivacyContent } from '@/components/privacy/PrivacyContent';

export const metadata: Metadata = {
  title: '隐私政策',
  description: 'ChromaCheck 检测数据默认仅存于你的浏览器本地，不上传服务器；仅以匿名方式统计访问量（Google Analytics），不收集身份信息，不展示广告。',
  keywords: ['隐私政策', '数据本地化', '匿名统计', 'ChromaCheck'],
  alternates: { canonical: '/privacy' },
  openGraph: {
    type: 'website',
    title: '隐私政策 · 色辨 ChromaCheck',
    description: '检测数据本地化、匿名统计与医学免责声明。',
    url: 'https://chromacheck.app/privacy',
    siteName: 'ChromaCheck',
    locale: 'zh_CN',
  },
};

export default function PrivacyPage() {
  return (
    <div id="privacy-page" className="wrap stack" style={{ paddingBlock: 'var(--s-6)', gap: 'var(--s-5)' }}>
      <Breadcrumbs items={[{ name: '首页', path: '/' }, { name: '隐私政策', path: '/privacy' }]} />
      <PrivacyContent />
    </div>
  );
}
