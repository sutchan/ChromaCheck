// app/learn/[slug]/page.tsx — 科普详情（服务端壳：metadata / JSON-LD；正文见 ArticleContent）
// chromacheck v1.9.0
import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ARTICLES, getArticle } from '@/lib/learn-data';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArticleContent } from '@/components/learn/ArticleContent';

import { SITE_URL } from '@/lib/site';

const BASE = SITE_URL;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    keywords: ['色觉', '色盲', '色弱', article.cat, 'ChromaCheck'],
    alternates: { canonical: `/learn/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: `${BASE}/learn/${article.slug}`,
      siteName: 'ChromaCheck',
      locale: 'zh_CN',
      images: [
        { url: '/og-default.svg', width: 1200, height: 630, alt: article.title },
      ],
    },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    inLanguage: 'zh-CN',
    articleSection: article.cat,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/learn/${article.slug}` },
    publisher: { '@type': 'Organization', name: 'ChromaCheck' },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: BASE },
      { '@type': 'ListItem', position: 2, name: '科普', item: `${BASE}/learn` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${BASE}/learn/${article.slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={[articleLd, breadcrumbLd]} />
      <ArticleContent article={article} />
    </>
  );
}
