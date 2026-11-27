// lib/i18n/html-lang.ts — 将界面语言同步到 <html lang>（任务 O-02）
// chromacheck v1.17.3
import { htmlLang, type Lang } from './lang';

/**
 * 写入文档语言属性。target 参数仅用于 node 环境测试；浏览器侧默认写 document。
 * 挂载恢复偏好与主动切换语言两条路径必须统一调用，避免首屏语义标记滞后。
 */
export function applyHtmlLang(lang: Lang, target?: Pick<Document, 'documentElement'>): void {
  const doc = target ?? (typeof document === 'undefined' ? undefined : document);
  if (!doc) return;
  doc.documentElement.setAttribute('lang', htmlLang(lang));
}
