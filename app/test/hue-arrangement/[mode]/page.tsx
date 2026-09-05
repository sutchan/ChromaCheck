// app/test/hue-arrangement/[mode]/page.tsx — 色相排列测试页
// chromacheck v1.2.0
import React from 'react';
import { notFound } from 'next/navigation';
import { HueArrangementRunner } from '@/components/test/HueArrangementRunner';
import type { TestMode } from '@/lib/types';

export default function HueArrangementTestPage({ params }: { params: { mode: string } }) {
  if (params.mode !== 'quick' && params.mode !== 'standard') notFound();
  return <HueArrangementRunner mode={params.mode as TestMode} />;
}
