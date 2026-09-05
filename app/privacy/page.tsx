// app/privacy/page.tsx — 隐私政策
// chromacheck v1.5.1
import React from 'react';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';

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
        <p className="muted" style={{ margin: 0 }}>最后更新：2026-09-05 · 本文档对应 docs/PRIVACY.md。</p>
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
          默认情况下，应用仅在本机浏览器（localStorage）保存：检测答题记录与判读结果、进行中的检测进度、以及你的显示设置（主题、色觉安全模式）。这些数据不会上传到任何服务器。
        </p>
      </section>

      <section className="stack" style={{ gap: 'var(--s-2)' }}>
        <h2 style={{ margin: 0 }}>2. 我们如何使用与共享</h2>
        <p className="muted" style={{ margin: 0 }}>
          本地数据仅用于在你的设备上生成检测报告与历史记录。我们不与任何第三方共享个人数据，也不展示广告。唯一引入的第三方脚本是 Google Analytics（详见第 6 节），仅用于统计匿名访问量。
        </p>
      </section>

      <section className="stack" style={{ gap: 'var(--s-2)' }}>
        <h2 style={{ margin: 0 }}>3. 数据存储与安全</h2>
        <p className="muted" style={{ margin: 0 }}>
          检测结果保存在浏览器本地，最多保留最近 30 次。受浏览器同源策略保护，其他网站无法读取。清除浏览器数据或更换设备后记录将不可恢复。应用代码与检测图由服务端分发，全程使用 HTTPS 传输。
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
        <h2 style={{ margin: 0 }}>6. 匿名访问统计（Google Analytics）</h2>
        <p className="muted" style={{ margin: 0 }}>
          本站使用 Google Analytics 了解整体访问情况（如页面浏览量），用于判断哪些功能值得改进。它只采集匿名指标，<strong>不包含</strong>你的答题记录、判读结果与任何身份信息，IP 地址由 Google 匿名化处理。若不希望被统计，可使用浏览器隐私模式、脚本拦截插件，或阻止 Google Analytics 域名加载。
        </p>
      </section>

      <Callout icon="info">
        如果你对隐私有任何疑问，可通过项目仓库 Issues 联系维护者。政策重大变更会在此页面提前告知。
      </Callout>
    </div>
  );
}
