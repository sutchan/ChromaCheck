'use client';
// components/layout/LangProvider.tsx — 界面语言上下文（zh / en，存 localStorage）
// chromacheck v1.7.9
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANG, LANG_STORAGE_KEY, t as translate, type DictKey, type Lang } from '@/lib/i18n';

export interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** 便捷取值：t(key, vars) */
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => undefined,
  t: (key) => key,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // 挂载后恢复偏好（首屏统一渲染中文，避免 SSR 与客户端不一致）
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'zh' || saved === 'en') setLangState(saved);
    } catch {
      /* 隐私模式禁用存储时保持默认 */
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
      document.documentElement.setAttribute('lang', next === 'en' ? 'en' : 'zh-CN');
    } catch {
      /* 写入失败不影响界面切换 */
    }
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      t: (key: DictKey, vars?: Record<string, string | number>) => translate(lang, key, vars),
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
