// app/test/advanced/page.tsx — 进阶联合检测页
// chromacheck v1.17.8
import React from 'react';
import type { Metadata } from 'next';
import { AdvancedRunner } from '@/components/test/AdvancedRunner';

export function generateMetadata(): Metadata {
  const title = '进阶联合色觉检测';
  const desc = 'ChromaCheck 进阶联合检测：石原氏 38 题 + 路径追踪 + 色相排列三模块联合判读，交叉验证，结果最全面。';
  return {
    title,
    description: desc,
    alternates: { canonical: '/test/advanced' },
    openGraph: {
      type: 'website',
      title: `${title} · 色辨 ChromaCheck`,
      description: desc,
      url: 'https://chroma.appti.cn/test/advanced',
      siteName: 'ChromaCheck',
      locale: 'zh_CN',
    },
  };
}

export default async function AdvancedTestPage({
  searchParams,
}: {
  searchParams: Promise<{ scene?: string }>;
}) {
  // Next.js 16 的 searchParams 为 Promise，须 await 后读取，否则驾驶场景参数恒为 undefined
  const { scene } = await searchParams;
  return <div id="advanced-test-page"><AdvancedRunner scene={scene === 'driver' ? 'driver' : 'general'} /></div>;
}
