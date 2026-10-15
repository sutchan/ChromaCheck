// app/learn/page.tsx — 科普列表（服务端壳，metadata 静态；内容见 LearnListContent）
// chromacheck v1.9.0
import React from 'react';
import type { Metadata } from 'next';
import { LearnListContent } from '@/components/learn/LearnListContent';

export const metadata: Metadata = {
  title: '色觉科普',
  description: '了解色盲与色弱的区别、石原氏检测原理、色觉异常的遗传规律，以及生活中实用的辨色技巧与就医建议。',
  keywords: ['色觉科普', '色盲', '色弱', '石原氏原理', '色觉遗传', 'ChromaCheck'],
  alternates: { canonical: '/learn' },
  openGraph: {
    type: 'website',
    title: '色觉科普 · 色辨 ChromaCheck',
    description: '色盲与色弱的区别、石原氏检测原理、遗传规律与生活技巧。',
    url: 'https://chromacheck.app/learn',
    siteName: 'ChromaCheck',
    locale: 'zh_CN',
  },
};

export default function LearnPage() {
  return <LearnListContent />;
}
