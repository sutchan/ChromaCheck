// app/test/path-tracking/[mode]/page.tsx — 路径追踪测试页
// chromacheck v1.17.6
import React from 'react';
import { notFound } from 'next/navigation';
import { PathTrackingRunner } from '@/components/test/PathTrackingRunner';
import type { TestMode } from '@/lib/types';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return [{ mode: 'standard' }];
}

export async function generateMetadata({ params }: { params: Promise<{ mode: string }> }): Promise<Metadata> {
  const { mode } = await params;
  const title = '路径追踪检测';
  const desc = 'ChromaCheck 路径追踪检测：沿嵌入色点连成的路径描线，辅助判断红 / 绿色觉异常。';
  return {
    title,
    description: desc,
    // 仅预生成 standard；quick 为同内容动态变体，canonical 统一指向 standard 避免重复内容
    alternates: { canonical: `/test/path-tracking/standard` },
    openGraph: {
      type: 'website',
      title: `${title} · 色辨 ChromaCheck`,
      description: desc,
      url: `https://chroma.appti.cn/test/path-tracking/${mode}`,
      siteName: 'ChromaCheck',
      locale: 'zh_CN',
    },
  };
}

export default async function PathTrackingTestPage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  if (mode !== 'quick' && mode !== 'standard') notFound();
  return <div id="path-test-page"><PathTrackingRunner mode={mode as TestMode} /></div>;
}
