// app/test/page.tsx — 模式选择
// chromacheck v1.7.0
import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';
import type { TestMode } from '@/lib/types';

export const metadata: Metadata = {
  title: '选择检测模式',
  description: 'ChromaCheck 提供快速版（10 题）、标准版（38 题）、路径追踪、色相排列与进阶联合五种色觉检测模式，纯本地检测，结果即时生成。',
  keywords: ['色觉检测', '石原氏测试', '色盲测试', '色弱测试', '在线筛查'],
  alternates: { canonical: '/test' },
  openGraph: {
    type: 'website',
    title: '选择检测模式 · 色辨 ChromaCheck',
    description: '快速版、标准版、路径追踪、色相排列与进阶联合五类色觉检测。',
    url: 'https://chromacheck.app/test',
    siteName: 'ChromaCheck',
    locale: 'zh_CN',
  },
};

const MODES: {
  mode: TestMode | 'advanced' | 'path' | 'hue';
  title: string;
  desc: string;
  meta: string;
  enabled: boolean;
  href: string;
}[] = [
  { mode: 'quick', title: '快速版', desc: '10 道核心题目，3 分钟左右，适合初次自测与定期复检。', meta: '约 3 分钟 · 10 题', enabled: true, href: '/test/ishihara/quick' },
  { mode: 'standard', title: '标准版', desc: '完整 38 题，覆盖转换、消失、隐藏与分类题型，结果更稳定。', meta: '约 12 分钟 · 38 题', enabled: true, href: '/test/ishihara/standard' },
  { mode: 'path', title: '路径追踪', desc: '沿嵌入色点连成的路径描线，辅助判断红/绿色觉异常（v1.1 新增）。', meta: '约 2 分钟 · 描线', enabled: true, href: '/test/path-tracking/standard' },
  { mode: 'hue', title: '色相排列', desc: '将 15 张色卡按色彩渐变顺序排列，评估辨色精度（D15 简化版，v1.2 新增）。', meta: '约 3 分钟 · 排列', enabled: true, href: '/test/hue-arrangement/standard' },
  { mode: 'advanced', title: '进阶版', desc: '石原氏 38 题 + 路径追踪 + 色相排列三模块联合判读，交叉验证，结果最全面（v1.3 新增）。', meta: '约 19 分钟 · 三模块', enabled: true, href: '/test/advanced' },
];

export default function TestSelectPage() {
  return (
    <div id="test-select-page" className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-5)' }}>
      <div className="stack" style={{ gap: 'var(--s-2)', maxWidth: 640 }}>
        <span className="chip">开始检测</span>
        <h1 style={{ margin: 0 }}>选择检测模式</h1>
        <p className="muted" style={{ margin: 0 }}>
          两种石原氏模式均为纯本地检测，结果仅保存在你的浏览器。建议先做快速版，如需更稳妥的结论再做标准版。
        </p>
      </div>

      <div className="grid-cards">
        {MODES.map((m) => {
          const inner = (
            <div className="card stack" style={{ gap: 'var(--s-3)', height: '100%', opacity: m.enabled ? 1 : 0.6 }}>
              <div className="row between">
                <h3 style={{ margin: 0 }}>{m.title}</h3>
                {m.enabled ? <Icon name="arrowRight" size={20} /> : <span className="chip">敬请期待</span>}
              </div>
              <p className="muted" style={{ margin: 0, flex: 1 }}>{m.desc}</p>
              <span className="muted" style={{ fontSize: '0.85rem' }}>{m.meta}</span>
            </div>
          );
          return m.enabled ? (
            <Link key={m.mode} href={m.href} style={{ color: 'inherit' }}>
              {inner}
            </Link>
          ) : (
            <div key={m.mode} aria-disabled style={{ cursor: 'not-allowed' }}>
              {inner}
            </div>
          );
        })}
      </div>

      <Callout icon="info">
        检测前请阅读<Link href="/guide">《检测前指引》</Link>，确保光线、距离与状态都合适，结果才更可信。
      </Callout>

      <div className="stack" style={{ gap: 'var(--s-3)' }}>
        <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Icon name="device" size={20} style={{ color: 'var(--brand)' }} />
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>驾驶 / 职业体检准备</h2>
        </div>
        <p className="muted" style={{ margin: 0 }}>
          以下入口针对报考驾照、从事对色觉有要求的职业等场景：报告将对照驾照辨色力要求给出参考，并隐藏趣味元素。建议先做屏幕校准。
        </p>
        <div className="grid-cards">
          <Link href="/test/ishihara/standard?scene=driver" style={{ color: 'inherit' }}>
            <div className="card stack" style={{ gap: 'var(--s-3)', height: '100%' }}>
              <div className="row between">
                <h3 style={{ margin: 0 }}>标准版（驾驶场景）</h3>
                <Icon name="arrowRight" size={20} />
              </div>
              <p className="muted" style={{ margin: 0, flex: 1 }}>完整 38 题检测，结果页附「驾照辨色力参考」与免责声明。</p>
              <span className="muted" style={{ fontSize: '0.85rem' }}>约 12 分钟 · 38 题</span>
            </div>
          </Link>
          <Link href="/test/signal" style={{ color: 'inherit' }}>
            <div className="card stack" style={{ gap: 'var(--s-3)', height: '100%' }}>
              <div className="row between">
                <h3 style={{ margin: 0 }}>信号灯辨识</h3>
                <Icon name="arrowRight" size={20} />
              </div>
              <p className="muted" style={{ margin: 0, flex: 1 }}>模拟路口与夜间行车的红 / 绿 / 黄信号辨识，验证驾驶辨色能力。</p>
              <span className="muted" style={{ fontSize: '0.85rem' }}>约 3 分钟 · 9 题</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
