// app/result/[id]/layout.tsx — 结果页布局（私有数据，禁止索引）
// chromacheck v1.6.0
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
