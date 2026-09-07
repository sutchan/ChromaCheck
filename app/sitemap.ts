// app/sitemap.ts — 站点地图（静态路由 + 科普文章）
// chromacheck v1.7.4
import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/learn-data';
import { SITE_URL } from '@/lib/site';

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/test`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/test/ishihara/quick`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/test/ishihara/standard`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/test/advanced`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/test/hue-arrangement/standard`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE}/test/path-tracking/standard`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE}/test/signal`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE}/guide`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${BASE}/learn`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${BASE}/learn/${a.slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes];
}
