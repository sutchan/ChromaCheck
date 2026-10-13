// lib/analytics.ts — Google Analytics 4 接入配置与上报辅助（单一来源）
// chromacheck v1.7.9

/**
 * GA4 衡量 ID 的唯一来源。
 * - 默认使用仓库内置 ID；部署时可用 `NEXT_PUBLIC_GA_ID` 覆盖。
 * - 将该环境变量置为空字符串（''）即可全局停用心智统计，无需改代码。
 */
const DEFAULT_MEASUREMENT_ID = 'G-0F9QWS1PDX';

/**
 * 仅在生产环境加载统计脚本，避免本地开发数据污染线上报表。
 * 空字符串表示停用（组件据此不渲染任何脚本）。
 */
export const GA_MEASUREMENT_ID: string =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_GA_ID ?? DEFAULT_MEASUREMENT_ID
    : '';

interface GtagWindow {
  gtag?: (...args: unknown[]) => void;
}

/** 上报页面浏览；App Router 为客户端路由，需在路径变化时手动补报。 */
export function pageview(path: string): void {
  const target = window as unknown as GtagWindow;
  // 脚本尚未就绪时跳过：首次浏览由 gtag('config') 自动上报，后续跳转会补报
  if (typeof target.gtag !== 'function') return;
  target.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
  });
}

/** 事件名白名单（与 app/api/analytics/event 服务端保持一致） */
export type AnalyticsEventName =
  | 'test_start'
  | 'test_complete'
  | 'share'
  | 'download'
  | 'learn_view'
  | 'export';

/**
 * 匿名事件上报至服务端 `/api/analytics/event`（C3）。
 * 仅含事件名 / 测试类型 / 时长 / 结果摘要，不含答题内容与身份信息；失败静默，不影响主流程。
 */
export function reportServerEvent(
  event: AnalyticsEventName,
  params?: { testType?: string; durationMs?: number; resultSummary?: string },
): void {
  if (typeof fetch !== 'function') return;
  void fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, ...params }),
    keepalive: true,
  }).catch(() => undefined);
}

