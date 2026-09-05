// app/learn/[slug]/page.tsx — 科普详情
// chromacheck v1.6.0
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ARTICLES, getArticle } from '@/lib/learn-data';
import { Icon } from '@/components/common/Icon';
import { JsonLd } from '@/components/seo/JsonLd';

const BASE = 'https://chromacheck.app';

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

  const idx = ARTICLES.findIndex((a) => a.slug === article.slug);
  const next = ARTICLES[(idx + 1) % ARTICLES.length];

  return (
    <article id="learn-article-page" className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-4)', maxWidth: 760 }}>
      <JsonLd data={[articleLd, breadcrumbLd]} />
      <Link href="/learn" className="muted row" style={{ gap: 6, fontSize: '0.88rem', width: 'fit-content' }}>
        <Icon name="arrowRight" size={16} style={{ transform: 'rotate(180deg)' }} /> 返回科普列表
      </Link>

      <div className="stack" style={{ gap: 'var(--s-2)' }}>
        <div className="row" style={{ gap: 'var(--s-2)' }}>
          <span className="chip" style={{ background: article.hue, color: '#fff', borderColor: 'transparent' }}>{article.cat}</span>
          <span className="muted" style={{ fontSize: '0.85rem' }}><Icon name="clock" size={14} /> {article.read}</span>
        </div>
        <h1 style={{ margin: 0 }}>{article.title}</h1>
        <p className="muted" style={{ margin: 0 }}>{article.excerpt}</p>
      </div>

      <div className="stack" style={{ gap: 'var(--s-4)' }}>
        {article.body.map((s, i) => (
          <section key={i} className="stack" style={{ gap: 'var(--s-2)' }}>
            {s.h && <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{s.h}</h2>}
            <p style={{ margin: 0, color: 'var(--fg-soft)' }}>{s.p}</p>
          </section>
        ))}
      </div>

      <div className="card row between" style={{ gap: 'var(--s-3)', flexWrap: 'wrap' }}>
        <span className="muted" style={{ fontSize: '0.9rem' }}>下一篇</span>
        <Link href={`/learn/${next.slug}`} className="row" style={{ gap: 6, fontWeight: 600 }}>
          {next.title} <Icon name="arrowRight" size={16} />
        </Link>
      </div>

      <Link href="/test" className="btn btn-primary btn-block" style={{ maxWidth: 320, marginInline: 'auto' }}>
        现在做一次检测 <Icon name="arrowRight" size={18} />
      </Link>
    </article>
  );
}
