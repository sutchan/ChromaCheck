// app/test/path-tracking/[mode]/page.tsx — 路径追踪测试页
// chromacheck v1.7.3
import React from 'react';
import { notFound } from 'next/navigation';
import { PathTrackingRunner } from '@/components/test/PathTrackingRunner';
import type { TestMode } from '@/lib/types';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return [{ mode: 'standard' }];
}

export function generateMetadata({ params }: { params: { mode: string } }): Metadata {
  const title = '路径追踪检测';
  const desc = 'ChromaCheck 路径追踪检测：沿嵌入色点连成的路径描线，辅助判断红 / 绿色觉异常。';
  return {
    title,
    description: desc,
    alternates: { canonical: `/test/path-tracking/${params.mode}` },
    openGraph: {
      type: 'website',
      title: `${title} · 色辨 ChromaCheck`,
      description: desc,
      url: `https://chromacheck.app/test/path-tracking/${params.mode}`,
      siteName: 'ChromaCheck',
      locale: 'zh_CN',
    },
  };
}

export default function PathTrackingTestPage({ params }: { params: { mode: string } }) {
  if (params.mode !== 'quick' && params.mode !== 'standard') notFound();
  return <PathTrackingRunner mode={params.mode as TestMode} />;
}
