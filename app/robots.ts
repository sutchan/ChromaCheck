// app/robots.ts — robots.txt（指向 sitemap，屏蔽私有页面）
// chromacheck v1.6.0
import type { MetadataRoute } from 'next';

const BASE = 'https://chromacheck.app';

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
