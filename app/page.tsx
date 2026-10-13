// app/page.tsx — 首页
// chromacheck v1.7.9
import React from 'react';
import { CvdSimulator } from '@/components/home/CvdSimulator';
import { HomeFaq } from '@/components/home/HomeFaq';
import { HomeContent } from '@/components/home/HomeContent';

export default function HomePage() {
  return (
    <div className="stack" id="home-page" style={{ gap: 'var(--s-8)', paddingBlock: 'var(--s-7)' }}>
      {/* 双语内容：Hero + 特性 + 流程 */}
      <HomeContent />

      {/* 色觉模拟 */}
      <section className="wrap">
        <CvdSimulator />
      </section>

      {/* 常见问题（含 FAQPage 结构化数据） */}
      <HomeFaq />
    </div>
  );
}
