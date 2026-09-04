// app/test/page.tsx — 模式选择
// chromacheck v1.0.1
import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';
import type { TestMode } from '@/lib/types';

const MODES: {
  mode: TestMode | 'advanced' | 'path';
  title: string;
  desc: string;
  meta: string;
  enabled: boolean;
  href: string;
}[] = [
  { mode: 'quick', title: '快速版', desc: '10 道核心题目，3 分钟左右，适合初次自测与定期复检。', meta: '约 3 分钟 · 10 题', enabled: true, href: '/test/ishihara/quick' },
  { mode: 'standard', title: '标准版', desc: '完整 24 题，覆盖转换、消失、隐藏与分类题型，结果更稳定。', meta: '约 8 分钟 · 24 题', enabled: true, href: '/test/ishihara/standard' },
  { mode: 'path', title: '路径追踪', desc: '沿嵌入色点连成的路径描线，辅助判断红/绿色觉异常（v1.1 新增）。', meta: '约 2 分钟 · 描线', enabled: true, href: '/test/path-tracking/standard' },
  { mode: 'advanced', title: '进阶版', desc: '石原氏 + 路径追踪 + 色相排列三模块联合判读（规划中）。', meta: '规划中 · v1.1+', enabled: false, href: '' },
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
    </div>
  );
}
