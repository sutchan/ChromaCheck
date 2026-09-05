// app/history/layout.tsx — 历史页布局（本地私有数据，禁止索引）
// chromacheck v1.6.0
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
