// app/test/child/page.tsx — 儿童模式检测页（图形识别，适合 5–10 岁；文案在 ChildFlow 内双语渲染）
// chromacheck v1.7.9
import React from 'react';
import type { Metadata } from 'next';
import { ChildFlow } from '@/components/test/ChildFlow';

export const metadata: Metadata = {
  title: '儿童模式检测',
  description:
    '面向 5–10 岁儿童的图形辨色检测：用圆形、方形、星星等图形替代数字题，约 10 题，结果仅存本机浏览器，仅供初筛参考。',
  keywords: ['儿童色觉检测', '色盲测试', '儿童色弱', '图形辨色'],
  alternates: { canonical: '/test/child' },
};

export default function ChildTestPage() {
  return (
    <div
      id="child-test-page"
      className="wrap stack"
      style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-5)', maxWidth: 760 }}
    >
      <ChildFlow />
    </div>
  );
}
