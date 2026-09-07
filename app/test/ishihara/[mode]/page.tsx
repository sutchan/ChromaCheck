// app/test/ishihara/[mode]/page.tsx — 石原氏测试页
// chromacheck v1.7.3
import React from 'react';
import { notFound } from 'next/navigation';
import { TestRunner } from '@/components/test/TestRunner';
import type { TestMode } from '@/lib/types';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return [{ mode: 'quick' }, { mode: 'standard' }];
}

export function generateMetadata({ params }: { params: { mode: string } }): Metadata {
  const isQuick = params.mode === 'quick';
  const title = isQuick ? '快速版色觉检测（石原氏 10 题）' : '标准版色觉检测（石原氏 38 题）';
  const desc = isQuick
    ? 'ChromaCheck 快速版石原氏色觉检测：10 道核心题目，约 3 分钟，纯本地自测。'
    : 'ChromaCheck 标准版石原氏色觉检测：完整 38 题，覆盖转换 / 消失 / 隐藏 / 分类题型，约 12 分钟。';
  return {
    title,
    description: desc,
    alternates: { canonical: `/test/ishihara/${params.mode}` },
    openGraph: {
      type: 'website',
      title: `${title} · 色辨 ChromaCheck`,
      description: desc,
      url: `https://chromacheck.app/test/ishihara/${params.mode}`,
      siteName: 'ChromaCheck',
      locale: 'zh_CN',
    },
  };
}

export default function IshiharaTestPage({
  params,
  searchParams,
}: {
  params: { mode: string };
  searchParams: { scene?: string };
}) {
  if (params.mode !== 'quick' && params.mode !== 'standard') notFound();
  const scene = searchParams.scene === 'driver' ? 'driver' : 'general';
  return <TestRunner mode={params.mode as TestMode} scene={scene} />;
}
