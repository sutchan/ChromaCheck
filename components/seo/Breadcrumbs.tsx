// components/seo/Breadcrumbs.tsx — 通用面包屑结构化数据（BreadcrumbList，SSR 简体）
// chromacheck v1.17.0
import React from 'react';
import { JsonLd } from './JsonLd';
import { SITE_URL } from '@/lib/site';

export interface Crumb {
  name: string;
  /** 以 / 开头的站内路径 */
  path: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
  return <JsonLd data={data} />;
}
