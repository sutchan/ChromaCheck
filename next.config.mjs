// next.config.mjs v1.13.5
/** @type {import('next').NextConfig} */

// 构建号：本地构建时间到分钟，结构 yymmddhhmm（2 位年份，共 10 位）；注入 NEXT_PUBLIC_BUILD_ID 供客户端（页脚）读取
const buildNow = new Date();
const p2 = (n) => String(n).padStart(2, '0');
const yy = String(buildNow.getFullYear()).slice(2);
const BUILD_ID = `${yy}${p2(buildNow.getMonth() + 1)}${p2(buildNow.getDate())}${p2(buildNow.getHours())}${p2(buildNow.getMinutes())}`;

// 安全响应头（docs/ARCHITECTURE.md §6.2）：
// CSP 放行 GA（googletagmanager / google-analytics）；开发模式放行 'unsafe-eval'（React 刷新所需）
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://*.google-analytics.com",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // 仅允许本站嵌入，杜绝点击劫持（v1.9.0：由 * 收紧为 'self'）
  "frame-ancestors 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  // 旧浏览器兜底：与现代浏览器以 frame-ancestors 为准，两者不冲突
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
