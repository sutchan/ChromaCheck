// app/guide/page.tsx — 检测前指引（服务端壳，metadata 静态；内容见 GuideContent）
// chromacheck v1.9.0
import React from 'react';
import type { Metadata } from 'next';
import { GuideContent } from '@/components/guide/GuideContent';

export const metadata: Metadata = {
  title: '检测前指引',
  description: '开始色觉检测前，请准备合适的环境、设备与状态：光线均匀、色彩正常的屏幕、摘除有色眼镜、眼睛距屏 40–50cm，并凭第一直觉作答。',
  keywords: ['色觉检测准备', '石原氏测试环境', '检测前注意', 'ChromaCheck'],
  alternates: { canonical: '/guide' },
  openGraph: {
    type: 'website',
    title: '检测前指引 · 色辨 ChromaCheck',
    description: '检测前的环境、设备、距离与作答方式准备。',
    url: 'https://chromacheck.app/guide',
    siteName: 'ChromaCheck',
    locale: 'zh_CN',
  },
};

export default function GuidePage() {
  return <GuideContent />;
}
