// app/test/ishihara/[mode]/page.tsx — 石原氏测试页
// chromacheck v1.0.0
import React from 'react';
import { notFound } from 'next/navigation';
import { TestRunner } from '@/components/test/TestRunner';
import type { TestMode } from '@/lib/types';

export default function IshiharaTestPage({ params }: { params: { mode: string } }) {
  if (params.mode !== 'quick' && params.mode !== 'standard') notFound();
  return <TestRunner mode={params.mode as TestMode} />;
}
