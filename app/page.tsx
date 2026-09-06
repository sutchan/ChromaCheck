// app/page.tsx — 首页
// chromacheck v1.7.0
import React from 'react';
import Link from 'next/link';
import { IshiharaPlate } from '@/components/test/IshiharaPlate';
import { CvdSimulator } from '@/components/home/CvdSimulator';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';
import { HomeFaq } from '@/components/home/HomeFaq';
import { QUESTIONS } from '@/lib/questions';

const FEATURES = [
  { icon: 'eye', title: '科学原理', text: '基于石原氏等亮度检测图，仅靠色相差异构成数字，能分辨红绿与蓝黄异常。' },
  { icon: 'clock', title: '快速筛查', text: '快速版 10 题约 3 分钟，标准版 38 题约 12 分钟，随时在浏览器完成。' },
  { icon: 'chart', title: '维度分析', text: '输出红 / 绿 / 蓝三轴异常倾向与置信度，比“通过 / 不通过”更有信息量。' },
  { icon: 'shield', title: '隐私优先', text: '检测数据与历史仅存于本机浏览器，不上传服务器，可随时查看与删除。' },
];

const STEPS = [
  { n: 1, title: '选择模式', text: '快速版或标准版，按需自测。' },
  { n: 2, title: '看图作答', text: '说出图中数字，凭直觉、不猜测。' },
  { n: 3, title: '查看判读', text: '即时生成结论、维度图与明细。' },
];

export default function HomePage() {
  const hero = QUESTIONS[0];
  return (
    <div className="stack" style={{ gap: 'var(--s-8)', paddingBlock: 'var(--s-7)' }}>
      {/* Hero */}
      <section className="wrap grid-cards" style={{ gridTemplateColumns: 'minmax(280px,1fr) minmax(280px,420px)', alignItems: 'center', gap: 'var(--s-7)' }}>
        <div className="stack" style={{ gap: 'var(--s-4)' }}>
          <span className="chip">在线色觉筛查 · 石原氏原理</span>
          <h1 style={{ margin: 0 }}>看清世界的色彩，从一次自测开始</h1>
          <p className="muted" style={{ margin: 0, fontSize: '1.05rem' }}>
            色辨 ChromaCheck 帮你在家快速了解自己的色觉状况：是正常、色弱还是色盲倾向，以及偏向红绿还是蓝黄。
          </p>
          <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap' }}>
            <Link href="/test" className="btn btn-primary">开始检测 <Icon name="arrowRight" size={18} /></Link>
            <Link href="/learn" className="btn btn-ghost">了解色觉知识</Link>
          </div>
          <Callout tone="warn" icon="alert">
            本工具为筛查用途，不能替代专业眼科诊断。
          </Callout>
        </div>
        <IshiharaPlate type={hero.type} text={hero.answer} seed={hero.plate} maxWidth={400} />
      </section>

      {/* 特性 */}
      <section className="wrap stack" style={{ gap: 'var(--s-4)' }}>
        <h2>为什么用色辨</h2>
        <div className="grid-cards">
          {FEATURES.map((f) => (
            <div key={f.title} className="card stack" style={{ gap: 'var(--s-2)' }}>
              <span style={{ color: 'var(--brand)' }}><Icon name={f.icon} size={26} /></span>
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{f.title}</h3>
              <p className="muted" style={{ margin: 0, fontSize: '0.92rem' }}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 流程 */}
      <section className="wrap stack" style={{ gap: 'var(--s-4)' }}>
        <h2>三步完成</h2>
        <div className="grid-cards">
          {STEPS.map((s) => (
            <div key={s.n} className="card row" style={{ gap: 'var(--s-3)', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--brand)' }}>{s.n}</span>
              <div className="stack" style={{ gap: 4 }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{s.title}</h3>
                <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 色觉模拟 */}
      <section className="wrap">
        <CvdSimulator />
      </section>

      {/* 常见问题（含 FAQPage 结构化数据） */}
      <HomeFaq />
    </div>
  );
}
