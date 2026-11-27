'use client';
// components/layout/LangProvider.tsx — 界面语言上下文（zh / zh-TW / en，存 localStorage）
// chromacheck v1.15.0
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANG, LANGS, LANG_STORAGE_KEY, applyHtmlLang, t as translate, type DictKey, type Lang } from '@/lib/i18n';

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
    let restored: Lang = DEFAULT_LANG;
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (saved && (LANGS as string[]).includes(saved)) restored = saved as Lang;
    } catch {
      /* 隐私模式禁用存储时保持默认 */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 挂载后恢复语言偏好并同步 html lang
    setLangState(restored);
    // 恢复偏好时同步 html lang，避免繁中 / 英文用户首屏语义标记错误（O-02）
    applyHtmlLang(restored);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
      applyHtmlLang(next);
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
