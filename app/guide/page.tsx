// app/guide/page.tsx — 检测前指引
// chromacheck v1.7.0
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

const CALIBRATION = [
  { title: '关闭护眼 / 夜间模式', text: '关闭系统的“护眼模式”“夜览”“蓝光过滤”或任何屏幕色彩滤镜。这类滤镜会显著改变红绿呈现，直接造成假阳性。' },
  { title: '使用标准色温与亮度', text: '将屏幕亮度调到日常阅读水平（约 60–80%），避免过暗或过曝；若显示器支持，选择 sRGB 模式而非广色域“鲜艳”模式。' },
  { title: '控制环境光', text: '在均匀白光下进行，避免暖黄台灯或阳光直射屏幕造成偏色。屏幕表面无强反光。' },
  { title: '先用演示题自检', text: '进入检测后，第 1 题为演示题，用于确认你能看清并正常输入；若演示题都难以辨认，请先调整环境再继续。' },
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

      <div className="stack" style={{ gap: 'var(--s-3)' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>屏幕校准提示</h2>
        <p className="muted" style={{ margin: 0 }}>
          屏幕未校准、开启色彩滤镜或环境光偏色，都会让红绿色觉异常被误判或漏判。开始检测前请逐项确认：
        </p>
        <div className="grid-cards">
          {CALIBRATION.map((c) => (
            <div key={c.title} className="card stack" style={{ gap: 'var(--s-2)' }}>
              <h3 style={{ margin: 0, fontSize: '1.02rem' }}>{c.title}</h3>
              <p className="muted" style={{ margin: 0, fontSize: '0.92rem' }}>{c.text}</p>
            </div>
          ))}
        </div>
        <Callout tone="info" icon="info">
          未校准屏幕上的结论仅供参考。若你有意报考驾照或从事对色觉有要求的职业，请以公安交管部门指定体检机构或正规医院眼科的结论为准。
        </Callout>
      </div>

      <div className="row" style={{ gap: 'var(--s-3)' }}>
        <Link href="/test" className="btn btn-primary">选择检测模式 <Icon name="arrowRight" size={18} /></Link>
        <Link href="/test?scene=driver" className="btn btn-ghost">驾驶 / 职业体检准备</Link>
        <Link href="/" className="btn btn-ghost">返回首页</Link>
      </div>
    </div>
  );
}
