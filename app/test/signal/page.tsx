// app/test/signal/page.tsx — 信号灯辨识检测页
// chromacheck v1.7.0
import React from 'react';
import type { Metadata } from 'next';
import { SignalRunner } from '@/components/test/SignalRunner';

export const metadata: Metadata = {
  title: '信号灯辨识 · 驾驶场景检测',
  description: 'ChromaCheck 信号灯辨识：模拟路口与夜间行车下的红、绿、黄交通信号辨识，验证驾驶所需的信号辨色能力。',
  keywords: ['信号灯辨识', '红绿灯测试', '驾驶色觉', 'lantern test', 'ChromaCheck'],
  alternates: { canonical: '/test/signal' },
  openGraph: {
    type: 'website',
    title: '信号灯辨识 · 色辨 ChromaCheck',
    description: '模拟驾驶场景的红、绿、黄信号辨色测试。',
    url: 'https://chromacheck.app/test/signal',
    siteName: 'ChromaCheck',
    locale: 'zh_CN',
  },
};

export default function SignalTestPage() {
  return <SignalRunner />;
}
