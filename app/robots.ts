// app/robots.ts — robots.txt（指向 sitemap，屏蔽私有页面）
// chromacheck v1.7.4
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const BASE = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/result/', '/history/'],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
