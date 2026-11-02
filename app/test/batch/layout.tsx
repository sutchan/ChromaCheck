// app/test/batch/layout.tsx — 批量检测段元数据（page 为客户端组件，元数据放在 layout）
// chromacheck v1.11.2
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '批量色觉筛查',
  description:
    '面向学校 / 企业的本地批量色觉筛查：录入多名被测者名单，逐人完成标准检测，自动生成汇总表并可导出 CSV。全部数据仅存本机浏览器。',
  keywords: ['批量色觉检测', '学校色盲筛查', '企业体检', '色觉测试汇总'],
  alternates: { canonical: '/test/batch' },
  robots: { index: false, follow: false },
  openGraph: {
    type: 'website',
    title: '批量色觉筛查 · 色辨 ChromaCheck',
    description: '录入名单 → 逐人检测 → 汇总导出，适合学校与企业批量色觉筛查。',
    url: 'https://chromacheck.app/test/batch',
    siteName: 'ChromaCheck',
    locale: 'zh_CN',
  },
};

export default function BatchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
