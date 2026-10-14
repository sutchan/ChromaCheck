// app/privacy/page.tsx — 隐私政策
// chromacheck v1.8.1
import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';

export const metadata: Metadata = {
  title: '隐私政策',
  description: 'ChromaCheck 检测数据默认仅存于你的浏览器本地，不上传服务器；仅以匿名方式统计访问量（Google Analytics 与第一方可选事件上报），不收集身份信息，不展示广告。',
  keywords: ['隐私政策', '数据本地化', '匿名统计', 'ChromaCheck'],
  alternates: { canonical: '/privacy' },
  openGraph: {
    type: 'website',
    title: '隐私政策 · 色辨 ChromaCheck',
    description: '检测数据本地化、匿名统计与医学免责声明。',
    url: 'https://chromacheck.app/privacy',
    siteName: 'ChromaCheck',
    locale: 'zh_CN',
  },
};

const PRINCIPLES = [
  { icon: 'shield', t: '数据最小化', d: '仅收集提供服务所必需的最少数据。' },
  { icon: 'device', t: '本地优先', d: '核心检测数据默认仅存于你的浏览器，不上传服务器。' },
  { icon: 'check', t: '用户掌控', d: '可随时查看、导出、删除自己的数据。' },
  { icon: 'eye', t: '默认匿名', d: '不强制注册登录，不收集个人身份信息。' },
];

export default function PrivacyPage() {
  return (
    <div id="privacy-page" className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-5)', maxWidth: 860 }}>
      <div className="stack" style={{ gap: 'var(--s-2)' }}>
        <span className="chip">隐私政策</span>
        <h1 style={{ margin: 0 }}>我们如何对待你的数据</h1>
        <p className="muted" style={{ margin: 0 }}>最后更新：2026-10-14 · 本文档对应 docs/PRIVACY.md。</p>
      </div>

      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
        {PRINCIPLES.map((p) => (
          <div key={p.t} className="card stack" style={{ gap: 'var(--s-2)' }}>
            <span style={{ color: 'var(--brand)' }}><Icon name={p.icon} size={24} /></span>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{p.t}</h3>
            <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>{p.d}</p>
          </div>
        ))}
      </div>

      <section className="stack" style={{ gap: 'var(--s-2)' }}>
        <h2 style={{ margin: 0 }}>1. 我们收集什么</h2>
        <p className="muted" style={{ margin: 0 }}>
          默认情况下，应用仅在本机浏览器（localStorage）保存：检测答题记录与判读结果、进行中的检测进度、以及你的显示设置（主题、色觉安全模式、趣味开关）。这些<strong>核心检测数据不会上传到任何服务器</strong>，仅用于在你的设备上生成报告与历史记录。
        </p>
        <p className="muted" style={{ margin: 0 }}>
          除核心数据外，应用仅发起<strong>匿名统计</strong>请求（详见第 6 节），不含答题内容、判读详情或任何身份信息。
        </p>
      </section>

      <section className="stack" style={{ gap: 'var(--s-2)' }}>
        <h2 style={{ margin: 0 }}>2. 我们如何使用与共享</h2>
        <p className="muted" style={{ margin: 0 }}>
          本地数据仅用于在你的设备上生成检测报告与历史记录。我们<strong>不与任何第三方共享个人数据</strong>，也不展示广告。
        </p>
        <p className="muted" style={{ margin: 0 }}>
          统计方面：仅使用 Google Analytics 4（第三方，IP 匿名化）与可选的<strong>第一方</strong>匿名事件上报（详见第 6 节）。两者都只采集聚合指标，不携带答题记录、判读结果与任何身份信息。
        </p>
      </section>

      <section className="stack" style={{ gap: 'var(--s-2)' }}>
        <h2 style={{ margin: 0 }}>3. 数据存储与安全</h2>
        <p className="muted" style={{ margin: 0 }}>
          检测结果保存在浏览器本地，最多保留最近 30 次。受浏览器同源策略保护，其他网站无法读取。清除浏览器数据或更换设备后记录将不可恢复。应用代码与检测图由服务端分发，全程使用 HTTPS 传输。唯一的网络请求为匿名统计（GA 与可选的第一方事件上报，见第 6 节），不传输检测内容。
        </p>
      </section>

      <section className="stack" style={{ gap: 'var(--s-2)' }}>
        <h2 style={{ margin: 0 }}>4. 你的权利</h2>
        <p className="muted" style={{ margin: 0 }}>
          你可以在「历史记录」页查看、导出或删除任意一条结果，也可一键清空全部；可随时在浏览器设置中清除本站数据。
        </p>
      </section>

      <section className="stack" style={{ gap: 'var(--s-2)' }}>
        <h2 style={{ margin: 0 }}>5. 医学免责声明</h2>
        <p className="muted" style={{ margin: 0 }}>
          本产品为色觉<strong>筛查</strong>工具，不是医疗器械，不做医学诊断。结果措辞仅为「疑似 / 提示 / 建议就医」，不构成确诊。若日常生活中频繁出现辨色困难，请前往正规医院眼科进行专业检查。
        </p>
      </section>

      <section className="stack" style={{ gap: 'var(--s-2)' }}>
        <h2 style={{ margin: 0 }}>6. 匿名访问统计</h2>
        <p className="muted" style={{ margin: 0 }}>
          <strong>Google Analytics 4（第三方）</strong>：了解整体访问情况（如页面浏览量），用于判断哪些功能值得改进。它只采集匿名指标，<strong>不包含</strong>你的答题记录、判读结果与任何身份信息，IP 地址由 Google 匿名化处理。若不希望被统计，可使用浏览器隐私模式、脚本拦截插件，或阻止 Google Analytics 域名加载。
        </p>
        <p className="muted" style={{ margin: 0 }}>
          <strong>第一方匿名事件上报（可选，<code>/api/analytics/event</code>）</strong>：服务端仅接收事件名白名单（<code>test_start</code> / <code>test_complete</code> / <code>share</code> / <code>download</code> / <code>learn_view</code> / <code>export</code>）与三项聚合字段——测试类型、时长、结果摘要（类别，非明细）。请求体上限 1KB；服务端<strong>不落库、不记录 IP 与 User-Agent</strong>，仅输出结构化日志用于产品优化。仍不上传答题记录、判读结果与任何身份信息；该上报可在部署时关闭。
        </p>
      </section>

      <section className="stack" style={{ gap: 'var(--s-2)' }}>
        <h2 style={{ margin: 0 }}>7. 未成年人（儿童模式）</h2>
        <p className="muted" style={{ margin: 0 }}>
          儿童模式为图形辨色初筛，结果受孩子配合度、屏幕色彩与环境光线影响，<strong>不能作为诊断依据</strong>。我们建议由家长陪同使用，并在结果提示异常时前往正规医院眼科或儿童保健科复查。儿童模式不单独收集超出前述范围的任何数据，也不向未成年人展示确诊性结论。
        </p>
      </section>

      <Callout icon="info">
        如果你对隐私有任何疑问，可通过项目仓库 Issues 联系维护者。政策重大变更会在此页面提前告知。
      </Callout>
    </div>
  );
}
