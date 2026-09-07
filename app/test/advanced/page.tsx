// app/test/advanced/page.tsx — 进阶联合检测页
// chromacheck v1.7.3
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
      url: 'https://chromacheck.app/test/advanced',
      siteName: 'ChromaCheck',
      locale: 'zh_CN',
    },
  };
}

export default function AdvancedTestPage({ searchParams }: { searchParams: { scene?: string } }) {
  const scene = searchParams.scene === 'driver' ? 'driver' : 'general';
  return <AdvancedRunner scene={scene} />;
}
