// app/test/advanced/page.tsx — 进阶联合检测页
// chromacheck v1.7.0
import React from 'react';
import { AdvancedRunner } from '@/components/test/AdvancedRunner';

export default function AdvancedTestPage({ searchParams }: { searchParams: { scene?: string } }) {
  const scene = searchParams.scene === 'driver' ? 'driver' : 'general';
  return <AdvancedRunner scene={scene} />;
}
