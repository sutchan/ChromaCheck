// app/test/hue-arrangement/[mode]/page.tsx — 色相排列测试页
// chromacheck v1.7.3
import React from 'react';
import { notFound } from 'next/navigation';
import { HueArrangementRunner } from '@/components/test/HueArrangementRunner';
import type { TestMode } from '@/lib/types';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return [{ mode: 'standard' }];
}

export function generateMetadata({ params }: { params: { mode: string } }): Metadata {
  const title = '色相排列检测（D15 简化版）';
  const desc = 'ChromaCheck 色相排列检测（Farnsworth D15 简化版）：将 15 张色卡按色彩渐变顺序排列，评估辨色精度。';
  return {
    title,
    description: desc,
    alternates: { canonical: `/test/hue-arrangement/${params.mode}` },
    openGraph: {
      type: 'website',
      title: `${title} · 色辨 ChromaCheck`,
      description: desc,
      url: `https://chromacheck.app/test/hue-arrangement/${params.mode}`,
      siteName: 'ChromaCheck',
      locale: 'zh_CN',
    },
  };
}

export default function HueArrangementTestPage({ params }: { params: { mode: string } }) {
  if (params.mode !== 'quick' && params.mode !== 'standard') notFound();
  return <HueArrangementRunner mode={params.mode as TestMode} />;
}
