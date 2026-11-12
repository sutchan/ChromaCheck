// app/robots.ts — robots.txt（指向 sitemap，屏蔽私有页面，显式放行生成式引擎抓取器）
// chromacheck v1.17.0
import type { MetadataRoute } from 'next';
import { AI_CRAWLERS } from '@/lib/seo-routes';
import { SITE_URL } from '@/lib/site';

const DISALLOW = ['/result/', '/history/', '/test/batch/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      // 显式声明 AI 抓取器许可：默认 UA 规则本已放行，列出便于站点策略可审计（GEO）
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
