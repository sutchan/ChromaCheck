'use client';
// components/pwa/ServiceWorkerRegistrar.tsx — 注册 Service Worker（仅生产环境）
// chromacheck v1.7.9
import { useEffect } from 'react';

/** 注册失败仅降级离线能力，不影响在线使用；开发环境不注册，避免缓存干扰热更新。 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    };

    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register);

    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
