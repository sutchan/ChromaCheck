// lib/privacy-data.ts — 隐私政策内容（zh / en）
// chromacheck v1.9.0
//
// 长文本采用独立数据模块（与 lib/learn-data.ts 同构），避免撑大 i18n 字典。
// 段落内以 **强调** 标记表达需要加粗的片段，由 parseEmphasis 拆为片段数组。
import type { Lang } from './i18n';

export interface PrivacyPrinciple {
  icon: string;
  title: string;
  desc: string;
}

export interface PrivacySection {
  title: string;
  paragraphs: string[];
}

export interface PrivacyDoc {
  chip: string;
  heading: string;
  /** 「最后更新：」前缀（日期取 lib/site.ts 的 SITE_UPDATED） */
  updatedLabel: string;
  /** 更新说明后缀 */
  updatedRef: string;
  principles: PrivacyPrinciple[];
  sections: PrivacySection[];
  note: string;
}

const ZH: PrivacyDoc = {
  chip: '隐私政策',
  heading: '我们如何对待你的数据',
  updatedLabel: '最后更新：',
  updatedRef: '本文档对应 docs/PRIVACY.md。',
  principles: [
    { icon: 'shield', title: '数据最小化', desc: '仅收集提供服务所必需的最少数据。' },
    { icon: 'device', title: '本地优先', desc: '核心检测数据默认仅存于你的浏览器，不上传服务器。' },
    { icon: 'check', title: '用户掌控', desc: '可随时查看、导出、删除自己的数据。' },
    { icon: 'eye', title: '默认匿名', desc: '不强制注册登录，不收集个人身份信息。' },
  ],
  sections: [
    {
      title: '1. 我们收集什么',
      paragraphs: [
        '默认情况下，应用仅在本机浏览器（localStorage）保存：检测答题记录与判读结果、进行中的检测进度、以及你的显示设置（主题、色觉安全模式、趣味开关）。这些**核心检测数据不会上传到任何服务器**，仅用于在你的设备上生成报告与历史记录。',
        '除核心数据外，应用仅发起**匿名访问统计**请求（Google Analytics，详见第 6 节），不含答题内容、判读详情或任何身份信息。',
      ],
    },
    {
      title: '2. 我们如何使用与共享',
      paragraphs: [
        '本地数据仅用于在你的设备上生成检测报告与历史记录。我们**不与任何第三方共享个人数据**，也不展示广告。',
        '统计方面：仅使用 Google Analytics 4（第三方，IP 匿名化）。它只采集聚合访问指标，不携带答题记录、判读结果与任何身份信息。',
      ],
    },
    {
      title: '3. 数据存储与安全',
      paragraphs: [
        '检测结果保存在浏览器本地，最多保留最近 30 次。受浏览器同源策略保护，其他网站无法读取。清除浏览器数据或更换设备后记录将不可恢复。应用代码与检测图由服务端分发，全程使用 HTTPS 传输。唯一的网络请求为匿名访问统计（Google Analytics，见第 6 节），不传输检测内容。',
      ],
    },
    {
      title: '4. 你的权利',
      paragraphs: [
        '你可以在「历史记录」页查看、导出或删除任意一条结果，也可一键清空全部；可随时在浏览器设置中清除本站数据。',
      ],
    },
    {
      title: '5. 医学免责声明',
      paragraphs: [
        '本产品为色觉**筛查**工具，不是医疗器械，不做医学诊断。结果措辞仅为「疑似 / 提示 / 建议就医」，不构成确诊。若日常生活中频繁出现辨色困难，请前往正规医院眼科进行专业检查。',
      ],
    },
    {
      title: '6. 匿名访问统计',
      paragraphs: [
        '**Google Analytics 4（第三方）**：了解整体访问情况（如页面浏览量），用于判断哪些功能值得改进。它只采集匿名指标，**不包含**你的答题记录、判读结果与任何身份信息，IP 地址由 Google 匿名化处理。若不希望被统计，可使用浏览器隐私模式、脚本拦截插件，或阻止 Google Analytics 域名加载。',
        '除 Google Analytics 外，本应用**不向任何服务端上报检测事件**：检测开始 / 完成、分享、导出等行为均只在本机处理，不产生额外的网络请求。',
      ],
    },
    {
      title: '7. 未成年人（儿童模式）',
      paragraphs: [
        '儿童模式为图形辨色初筛，结果受孩子配合度、屏幕色彩与环境光线影响，**不能作为诊断依据**。我们建议由家长陪同使用，并在结果提示异常时前往正规医院眼科或儿童保健科复查。儿童模式不单独收集超出前述范围的任何数据，也不向未成年人展示确诊性结论。',
      ],
    },
  ],
  note: '如果你对隐私有任何疑问，可通过项目仓库 Issues 联系维护者。政策重大变更会在此页面提前告知。',
};

const EN: PrivacyDoc = {
  chip: 'Privacy',
  heading: 'How we handle your data',
  updatedLabel: 'Last updated:',
  updatedRef: 'This page corresponds to docs/PRIVACY.md.',
  principles: [
    { icon: 'shield', title: 'Data minimization', desc: 'We collect only the minimum data needed to provide the service.' },
    { icon: 'device', title: 'Local first', desc: 'Core test data stays in your browser by default and is never uploaded.' },
    { icon: 'check', title: 'User control', desc: 'View, export or delete your data at any time.' },
    { icon: 'eye', title: 'Anonymous by default', desc: 'No forced sign-up, and no personal identity information is collected.' },
  ],
  sections: [
    {
      title: '1. What we collect',
      paragraphs: [
        'By default, the app stores the following only in your own browser (localStorage): your test answers and results, in-progress test progress, and your display settings (theme, color-vision-safe mode, fun mode). This **core test data is never uploaded to any server**; it is used solely to generate reports and history on your device.',
        'Apart from that core data, the app makes only **anonymous traffic statistics** requests (Google Analytics — see section 6), which contain no answers, no result details and no identity information.',
      ],
    },
    {
      title: '2. How we use and share it',
      paragraphs: [
        'Local data is used only to generate test reports and history on your device. We **do not share personal data with any third party**, and we show no advertising.',
        'For analytics: only Google Analytics 4 (a third party, with IP anonymization). It collects aggregate traffic metrics only, carrying no answers, no results and no identity information.',
      ],
    },
    {
      title: '3. Storage and security',
      paragraphs: [
        'Results are stored in your browser and at most the 30 most recent runs are kept. They are protected by the browser same-origin policy, so other sites cannot read them. Clearing browser data or switching devices makes them unrecoverable. The app code and test plates are served over HTTPS. The only network request is the anonymous traffic statistics call (Google Analytics, see section 6), which transmits no test content.',
      ],
    },
    {
      title: '4. Your rights',
      paragraphs: [
        'On the History page you can view, export or delete any single result, or clear everything at once; you can also clear this site’s data from your browser settings at any time.',
      ],
    },
    {
      title: '5. Medical disclaimer',
      paragraphs: [
        'This product is a color vision **screening** tool. It is not a medical device and does not provide a medical diagnosis. Result wording is limited to “suspected / worth confirming / consider seeing a doctor” and does not constitute a confirmed diagnosis. If you frequently struggle with color in daily life, please get a professional examination at a reputable hospital.',
      ],
    },
    {
      title: '6. Anonymous traffic statistics',
      paragraphs: [
        '**Google Analytics 4 (third party)**: used to understand overall traffic (such as page views) and judge which features are worth improving. It collects anonymous metrics only and **does not include** your answers, results or any identity information; IP addresses are anonymized by Google. If you would rather not be counted, use your browser’s private mode, a script-blocking extension, or block the Google Analytics domains.',
        'Other than Google Analytics, this app **does not report any test event to any server**: starting and finishing a test, sharing and exporting are all handled locally and generate no extra network requests.',
      ],
    },
    {
      title: '7. Minors (Kids mode)',
      paragraphs: [
        'Kids mode is a first-pass shape-recognition screen. Its results are affected by the child’s cooperation, screen color and ambient light, and **cannot serve as a diagnosis basis**. We recommend that a parent supervise the test and, if the result flags an abnormality, follow up at a reputable ophthalmology department or child health clinic. Kids mode collects no data beyond the scope described above and shows no conclusive diagnosis to minors.',
      ],
    },
  ],
  note: 'If you have any privacy questions, contact the maintainer through the project repository Issues. Significant policy changes will be announced on this page in advance.',
};

export function getPrivacyDoc(lang: Lang): PrivacyDoc {
  return lang === 'en' ? EN : ZH;
}

/** 将 **强调** 标记拆为片段数组，交由渲染层输出 <strong>。 */
export function parseEmphasis(text: string): Array<{ text: string; bold: boolean }> {
  return text
    .split('**')
    .map((chunk, i) => ({ text: chunk, bold: i % 2 === 1 }))
    .filter((seg) => seg.text.length > 0);
}
