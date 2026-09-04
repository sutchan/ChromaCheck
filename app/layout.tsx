// app/layout.tsx — 根布局
// chromacheck v1.0.0
import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: '色辨 ChromaCheck — 在线色觉筛查',
    template: '%s · 色辨 ChromaCheck',
  },
  description:
    '基于石原氏检测原理的在线色觉筛查工具：快速版 10 题、标准版 24 题，即时生成判读结果与维度分析。结果仅供参考，不能替代专业眼科诊断。',
  applicationName: 'ChromaCheck',
  keywords: ['色觉', '色盲', '色弱', '石原氏', 'Ishihara', '在线筛查', 'ChromaCheck'],
};

export const viewport: Viewport = {
  themeColor: '#1f7a8c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
