// app/test/page.tsx — 模式选择
// chromacheck v1.7.9
import React from 'react';
import type { Metadata } from 'next';
import { TestSelectContent } from '@/components/test/TestSelectContent';

export const metadata: Metadata = {
  title: '选择检测模式',
  description:
    'ChromaCheck 提供快速版（10 题）、标准版（38 题）、路径追踪、色相排列、进阶联合与儿童模式六种色觉检测模式，纯本地检测，结果即时生成。',
  keywords: ['色觉检测', '石原氏测试', '色盲测试', '色弱测试', '在线筛查'],
  alternates: { canonical: '/test' },
  openGraph: {
    type: 'website',
    title: '选择检测模式 · 色辨 ChromaCheck',
    description: '快速版、标准版、路径追踪、色相排列、进阶联合与儿童模式六类色觉检测。',
    url: 'https://chromacheck.app/test',
    siteName: 'ChromaCheck',
    locale: 'zh_CN',
  },
};

export default function TestSelectPage() {
  return (
    <div id="test-select-page" className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-5)' }}>
      <TestSelectContent />
    </div>
  );
}
