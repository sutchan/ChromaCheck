// app/not-found.tsx — 404（服务端壳：提供元数据；UI 在 NotFoundClient）
// chromacheck v1.17.0
import type { Metadata } from 'next';
import { NotFoundClient } from '@/components/NotFoundClient';

export const metadata: Metadata = {
  title: '页面未找到',
  description: '你访问的页面不存在或已被移动。返回 ChromaCheck 在线色觉筛查首页。',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundClient />;
}
