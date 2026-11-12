// app/sitemap.ts — 站点地图（由 lib/seo-routes.ts 单一数据源派生）
// chromacheck v1.17.0
import type { MetadataRoute } from 'next';
import { SEO_LAST_MODIFIED, SEO_ROUTES } from '@/lib/seo-routes';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return SEO_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: SEO_LAST_MODIFIED,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
