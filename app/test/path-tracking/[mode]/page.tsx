// app/test/path-tracking/[mode]/page.tsx — 路径追踪测试页
// chromacheck v1.1.0
import React from 'react';
import { notFound } from 'next/navigation';
import { PathTrackingRunner } from '@/components/test/PathTrackingRunner';
import type { TestMode } from '@/lib/types';

export default function PathTrackingTestPage({ params }: { params: { mode: string } }) {
  if (params.mode !== 'quick' && params.mode !== 'standard') notFound();
  return <PathTrackingRunner mode={params.mode as TestMode} />;
}
