'use client';
// components/analytics/GoogleAnalytics.tsx — GA4 脚本注入与路由级页面浏览上报
// chromacheck v1.7.0
import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { GA_MEASUREMENT_ID, pageview } from '@/lib/analytics';

/** 在根布局挂载一次；未配置衡量 ID（如开发环境）时不渲染任何脚本。 */
export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    pageview(pathname);
  }, [pathname]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${GA_MEASUREMENT_ID}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
