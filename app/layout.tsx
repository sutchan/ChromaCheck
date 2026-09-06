// app/layout.tsx — 根布局
// chromacheck v1.7.0
import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL('https://chromacheck.app'),
  title: {
    default: '色辨 ChromaCheck — 在线色觉筛查',
    template: '%s · 色辨 ChromaCheck',
  },
  description:
    '基于石原氏检测原理的在线色觉筛查工具：快速版 10 题、标准版 38 题，即时生成判读结果与维度分析。结果仅供参考，不能替代专业眼科诊断。',
  applicationName: 'ChromaCheck',
  keywords: ['色觉', '色盲', '色弱', '石原氏', 'Ishihara', '在线筛查', '色觉测试', 'ChromaCheck', 'color blindness test'],
  authors: [{ name: 'ChromaCheck' }],
  category: 'health',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'ChromaCheck',
    title: '色辨 ChromaCheck — 在线色觉筛查',
    description: '基于石原氏检测原理的在线色觉筛查工具：快速版 10 题、标准版 38 题，即时生成判读结果与维度分析。',
    url: 'https://chromacheck.app',
    images: [
      { url: '/og-default.svg', width: 1200, height: 630, alt: 'ChromaCheck 在线色觉筛查' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '色辨 ChromaCheck — 在线色觉筛查',
    description: '基于石原氏检测原理的在线色觉筛查工具，快速了解你的色彩世界。',
    images: ['/og-default.svg'],
  },
  other: {
    'llms-txt': '/llms.txt',
  },
};

// WebApplication 结构化数据（GEO / SEO 实体声明）
const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '色辨 ChromaCheck',
  alternateName: 'ChromaCheck',
  url: 'https://chromacheck.app',
  description:
    '基于石原氏等亮度检测原理的在线色觉筛查工具，提供快速版、标准版、路径追踪、色相排列与进阶联合判读，结果仅存于本机浏览器。',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'zh-CN',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CNY',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ChromaCheck',
    url: 'https://chromacheck.app',
  },
};

export const viewport: Viewport = {
  themeColor: '#1f7a8c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=localStorage.getItem('cc.settings.v1');var t=s?JSON.parse(s).theme:'light';document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
      </head>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=localStorage.getItem('cc.settings.v1');if(s&&JSON.parse(s).cvdSafe)document.body.classList.add('cvd-safe');}catch(e){}})();",
          }}
        />
        <JsonLd data={webAppLd} />
        <GoogleAnalytics />
        <ThemeProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
