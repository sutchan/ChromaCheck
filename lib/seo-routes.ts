// lib/seo-routes.ts — SEO/GEO 路由单一数据源（sitemap / llms.txt / llms-full.txt 共用）
// chromacheck v1.17.0
import { ARTICLES } from './learn-data';
import { SITE_URL, SITE_UPDATED } from './site';

export type RouteGroup = '主要页面' | '检测模式' | '科普文章';

export interface SeoRoute {
  /** 以 / 开头的站内路径；根为 '/' */
  path: string;
  title: string;
  /** 供 llms.txt 引用的一句话摘要（简体，SSR 默认语言，SPEC §8.5） */
  summary: string;
  changeFrequency: 'monthly' | 'yearly';
  priority: number;
  group: RouteGroup;
  /** 次要页面：llms.txt 主索引不列，仅进 ## Optional */
  optional?: boolean;
}

const STATIC_ROUTES: SeoRoute[] = [
  { path: '/', title: '首页', summary: '产品介绍、检测流程、色觉模拟体验与 12 组常见问题', changeFrequency: 'monthly', priority: 1, group: '主要页面' },
  { path: '/test', title: '检测模式选择', summary: '快速版 / 标准版 / 路径追踪 / 色相排列 / 进阶联合 / 儿童 / 信号灯等模式入口', changeFrequency: 'monthly', priority: 0.9, group: '主要页面' },
  { path: '/guide', title: '检测前指引', summary: '环境光线、屏幕色彩、观看距离与作答方式的准备建议', changeFrequency: 'yearly', priority: 0.7, group: '主要页面' },
  { path: '/learn', title: '科普列表', summary: '色觉基础、石原氏原理、遗传、职业限制、日常建议与就医时机的文章列表', changeFrequency: 'monthly', priority: 0.8, group: '主要页面' },
  { path: '/privacy', title: '隐私政策', summary: '数据仅存本机浏览器、匿名访问统计、儿童条款与医学免责声明', changeFrequency: 'yearly', priority: 0.5, group: '主要页面' },
  { path: '/test/ishihara/quick', title: '石原氏快速版', summary: '10 道消失型数字图，约 3 分钟，适合初次自测', changeFrequency: 'monthly', priority: 0.7, group: '检测模式' },
  { path: '/test/ishihara/standard', title: '石原氏标准版', summary: '完整 38 题消失型数字图，约 12 分钟，结果更稳定', changeFrequency: 'monthly', priority: 0.8, group: '检测模式' },
  { path: '/test/advanced', title: '进阶联合检测', summary: '石原氏 38 题 + 路径追踪 + 色相排列三模块交叉判读，约 19 分钟', changeFrequency: 'monthly', priority: 0.7, group: '检测模式' },
  { path: '/test/hue-arrangement/standard', title: '色相排列（D15 简化版）', summary: '按色彩渐变顺序排列 15 张色卡，以 TES 评估辨色精度', changeFrequency: 'yearly', priority: 0.6, group: '检测模式' },
  { path: '/test/path-tracking/standard', title: '路径追踪', summary: '描出嵌入色点连成的路径，以 pathF1 重合度评估辨色表现', changeFrequency: 'yearly', priority: 0.6, group: '检测模式' },
  { path: '/test/signal', title: '信号灯辨识', summary: '红 / 绿 / 黄交通信号辨识专项，9 题，结果不计入历史', changeFrequency: 'yearly', priority: 0.6, group: '检测模式' },
  { path: '/test/child', title: '儿童模式', summary: '面向 5–10 岁儿童的图形辨色检测，用图形替代数字题，约 10 题', changeFrequency: 'yearly', priority: 0.6, group: '检测模式', optional: true },
];

const ARTICLE_ROUTES: SeoRoute[] = ARTICLES.map((a) => ({
  path: `/learn/${a.slug}`,
  title: a.title,
  summary: a.excerpt,
  changeFrequency: 'yearly',
  priority: 0.6,
  group: '科普文章',
}));

/** 全部可索引路由（私有页 /result/、/history/、/test/batch/ 与 /offline 不在表内） */
export const SEO_ROUTES: SeoRoute[] = [...STATIC_ROUTES, ...ARTICLE_ROUTES];

export const INDEXABLE_URLS: string[] = SEO_ROUTES.map((r) => `${SITE_URL}${r.path}`);

/** sitemap 的 lastModified：内容审阅日期，不是构建时间（避免每次部署全站 lastmod 变动） */
export const SEO_LAST_MODIFIED = new Date(`${SITE_UPDATED}T00:00:00Z`);

/** 机器可读的站点事实；llms.txt 与首页「关键事实」共用，避免多处口径漂移 */
export const SITE_FACTS: string[] = [
  '题库实况：石原氏标准版为 38 张消失型数字图（另含演示题），快速版取其 10 题；未实现真正的变形、隐藏双数字或分类题型。',
  '判读边界：本工具仅提示色觉异常倾向与程度，不能可靠区分红色觉 / 绿色觉 / 蓝黄色觉异常类型，也不能区分「色盲」与「色弱」；异常类型字段在无转换/分类题命中时输出未分型（null）。',
  '色盲是某类视锥细胞缺失，色弱是该类细胞功能减弱；先天性红绿色觉异常多为 X 染色体连锁隐性遗传，男性更常见。',
  '隐私：答题记录与判读结果默认仅存于用户本机浏览器（localStorage），不上传服务器，可随时查看、导出或删除，最多保留最近 30 次；仅以 GA4 匿名统计页面浏览。',
  '医学免责声明：在线筛查结果仅供初筛参考，不能替代专业眼科诊断；入学、入职与驾照等正式体检须由指定机构完成。',
  '界面语言：默认简体中文，其次繁体中文（台湾用语），再次英语；SSR metadata 与结构化数据恒以简体中文输出（SPEC §8.5）。',
];

/** 显式放行的生成式引擎抓取器（robots.txt 策略声明，默认对所有 UA 放行） */
export const AI_CRAWLERS: string[] = [
  'GPTBot',
  'OAI-SearchBot',
  'CCBot',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
];
