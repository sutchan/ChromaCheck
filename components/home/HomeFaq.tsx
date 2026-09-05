// components/home/HomeFaq.tsx — 首页常见问题（含 FAQPage 结构化数据）
// chromacheck v1.6.0
import React from 'react';
import { JsonLd } from '@/components/seo/JsonLd';

const FAQS = [
  {
    q: '色盲和色弱有什么区别？',
    a: '色盲指某一类视锥细胞完全缺失，色弱则是该类细胞仍在但功能减弱、敏感度下降。两者的可辨颜色数量与日常影响差别明显，但仅凭在线筛查无法精确区分"盲"与"弱"，确诊需专业仪器。',
  },
  {
    q: 'ChromaCheck 在线色觉检测准确吗？',
    a: 'ChromaCheck 基于石原氏等亮度检测原理，通过转换题、消失题、隐藏题等多角度交叉，可筛查是否存在色觉异常及偏向红绿还是蓝黄。它属于筛查工具，结果仅供参考，不能替代专业眼科诊断。',
  },
  {
    q: '做一次检测需要多久？',
    a: '快速版 10 道核心题目约 3 分钟，适合初次自测；标准版 38 题约 12 分钟，结果更稳定；路径追踪约 2 分钟，色相排列约 3 分钟，进阶联合检测约 19 分钟。',
  },
  {
    q: '我的检测数据安全吗？',
    a: '是的。检测答题记录与判读结果默认仅保存在你本机的浏览器（localStorage）中，不会上传到任何服务器。你可以随时查看、导出或删除，最多保留最近 30 次。',
  },
  {
    q: '哪些专业或职业对色觉有要求？',
    a: '在我国，美术、医学、化学、交通运输、军事公安及部分工科专业在高考体检与职业准入中会检查色觉；驾驶方面红绿色觉异常通常不得申领大型车辆驾驶证。具体标准以当年相关部门文件为准。',
  },
];

export function HomeFaq() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section id="home-faq" className="wrap stack" style={{ gap: 'var(--s-4)', paddingBlock: 'var(--s-6)' }}>
      <div className="stack" style={{ gap: 'var(--s-2)', maxWidth: 640 }}>
        <span className="chip">常见问题</span>
        <h2 style={{ margin: 0 }}>关于色觉筛查，你可能想知道</h2>
        <p className="muted" style={{ margin: 0 }}>
          以下回答基于公开医学常识与本站检测原理整理，仅供科普参考。
        </p>
      </div>

      <div className="stack" style={{ gap: 'var(--s-3)', maxWidth: 760 }}>
        {FAQS.map((f) => (
          <details key={f.q} className="card stack" style={{ gap: 'var(--s-2)', padding: 'var(--s-4)' }}>
            <summary style={{ fontWeight: 600, cursor: 'pointer' }}>{f.q}</summary>
            <p className="muted" style={{ margin: 0, fontSize: '0.95rem' }}>{f.a}</p>
          </details>
        ))}
      </div>

      <JsonLd data={faqLd} />
    </section>
  );
}
