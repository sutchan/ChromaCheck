// app/manifest.ts — PWA Web App Manifest（C7：离线可用 / 可安装）
// chromacheck v1.7.9
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '色辨 ChromaCheck — 在线色觉筛查',
    short_name: '色辨 ChromaCheck',
    description: '基于石原氏检测原理的在线色觉筛查工具：快速版 10 题、标准版 38 题，结果仅存于本机浏览器。',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1f7a8c',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
