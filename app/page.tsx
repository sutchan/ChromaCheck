// app/page.tsx — 首页
// chromacheck v1.17.0
import React from 'react';
import { CvdSimulator } from '@/components/home/CvdSimulator';
import { HomeFaq } from '@/components/home/HomeFaq';
import { HomeContent } from '@/components/home/HomeContent';
import { SITE_FACTS } from '@/lib/seo-routes';

export default function HomePage() {
  return (
    <div className="stack" id="home-page" style={{ gap: 'var(--s-8)', paddingBlock: 'var(--s-7)' }}>
      {/* 双语内容：Hero + 特性 + 流程 */}
      <HomeContent />

      {/* 色觉模拟 */}
      <section className="wrap">
        <CvdSimulator />
      </section>

      {/* 关键事实：SSR 简体静态文本，供搜索引擎与生成式引擎直接引用（与 /llms.txt 同源） */}
      <section className="wrap" aria-labelledby="site-facts-title">
        <h2 id="site-facts-title" style={{ fontSize: '1.25rem', marginBottom: 'var(--s-3)' }}>关于本站的关键事实</h2>
        <ul style={{ lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          {SITE_FACTS.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </section>

      {/* 常见问题（含 FAQPage 结构化数据） */}
      <HomeFaq />
    </div>
  );
}
