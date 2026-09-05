// app/guide/page.tsx — 检测前指引
// chromacheck v1.6.0
import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';

export const metadata: Metadata = {
  title: '检测前指引',
  description: '开始色觉检测前，请准备合适的环境、设备与状态：光线均匀、色彩正常的屏幕、摘除有色眼镜、眼睛距屏 40–50cm，并凭第一直觉作答。',
  keywords: ['色觉检测准备', '石原氏测试环境', '检测前注意', 'ChromaCheck'],
  alternates: { canonical: '/guide' },
  openGraph: {
    type: 'website',
    title: '检测前指引 · 色辨 ChromaCheck',
    description: '检测前的环境、设备、距离与作答方式准备。',
    url: 'https://chromacheck.app/guide',
    siteName: 'ChromaCheck',
    locale: 'zh_CN',
  },
};

const STEPS = [
  { icon: 'device', title: '环境与设备', text: '在光线充足、均匀的室内进行，避免强光直射屏幕。使用色彩表现正常的显示器，建议校准过色温。' },
  { icon: 'eye', title: '眼睛与距离', text: '摘除有色眼镜与美瞳；若平时戴矫正眼镜，请正常佩戴。眼睛与屏幕保持约 40–50cm。' },
  { icon: 'clock', title: '状态', text: '疲劳、熬夜或饮酒后辨色能力会下降。请在一次精神较好的时段完成，中途尽量不中断。' },
  { icon: 'info', title: '作答方式', text: '凭第一直觉说出图中数字，不要反复猜测或放大查看。看不清就选“看不清 / 无数字”。' },
];

export default function GuidePage() {
  return (
    <div id="guide-page" className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-5)', maxWidth: 880 }}>
      <div className="stack" style={{ gap: 'var(--s-2)' }}>
        <span className="chip">检测前指引</span>
        <h1 style={{ margin: 0 }}>开始前，请先准备</h1>
        <p className="muted" style={{ margin: 0 }}>
          在线筛查对环境较敏感。以下条件都满足时，结果才更可信。整个过程约 3–8 分钟。
        </p>
      </div>

      <div className="grid-cards">
        {STEPS.map((s) => (
          <div key={s.title} className="card stack" style={{ gap: 'var(--s-2)' }}>
            <span style={{ color: 'var(--brand)' }}>
              <Icon name={s.icon} size={26} />
            </span>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{s.title}</h3>
            <p className="muted" style={{ margin: 0, fontSize: '0.92rem' }}>{s.text}</p>
          </div>
        ))}
      </div>

      <Callout tone="warn" icon="alert">
        本检测为筛查用途，不能替代专业眼科诊断。若你已出现日常辨色困难，建议直接前往正规医院眼科检查。
      </Callout>

      <div className="row" style={{ gap: 'var(--s-3)' }}>
        <Link href="/test" className="btn btn-primary">选择检测模式 <Icon name="arrowRight" size={18} /></Link>
        <Link href="/" className="btn btn-ghost">返回首页</Link>
      </div>
    </div>
  );
}
