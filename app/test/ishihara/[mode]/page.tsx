// app/test/ishihara/[mode]/page.tsx — 石原氏测试页
// chromacheck v1.17.6
import React from 'react';
import { notFound } from 'next/navigation';
import { TestRunner } from '@/components/test/TestRunner';
import type { TestMode } from '@/lib/types';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return [{ mode: 'quick' }, { mode: 'standard' }];
}

export async function generateMetadata({ params }: { params: Promise<{ mode: string }> }): Promise<Metadata> {
  const { mode } = await params;
  const isQuick = mode === 'quick';
  const title = isQuick ? '快速版色觉检测（石原氏 10 题）' : '标准版色觉检测（石原氏 38 题）';
  const desc = isQuick
    ? 'ChromaCheck 快速版石原氏色觉检测：10 道核心题目，约 3 分钟，纯本地自测。'
    : 'ChromaCheck 标准版石原氏色觉检测：完整 38 题消失型数字图，约 12 分钟，纯本地自测。';
  return {
    title,
    description: desc,
    alternates: { canonical: `/test/ishihara/${mode}` },
    openGraph: {
      type: 'website',
      title: `${title} · 色辨 ChromaCheck`,
      description: desc,
      url: `https://chroma.appti.cn/test/ishihara/${mode}`,
      siteName: 'ChromaCheck',
      locale: 'zh_CN',
    },
  };
}

export default async function IshiharaTestPage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  if (mode !== 'quick' && mode !== 'standard') notFound();
  return <div id="ishihara-test-page"><TestRunner mode={mode as TestMode} /></div>;
}
