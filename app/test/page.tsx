// app/test/page.tsx — 模式选择
// chromacheck v1.17.8
import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
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
    url: 'https://chroma.appti.cn/test',
    siteName: 'ChromaCheck',
    locale: 'zh_CN',
  },
};

export default async function TestSelectPage({
  searchParams,
}: {
  searchParams: Promise<{ scene?: string }>;
}) {
  // Next.js 16 的 searchParams 为 Promise；驾驶场景入口 /test?scene=driver 需透传给模式卡片
  const { scene } = await searchParams;
  const driverScene = scene === 'driver';
  return (
    <div id="test-select-page" className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-5)' }}>
      <Breadcrumbs items={[{ name: '首页', path: '/' }, { name: '选择检测模式', path: '/test' }]} />
      <TestSelectContent scene={driverScene ? 'driver' : 'general'} />
    </div>
  );
}
