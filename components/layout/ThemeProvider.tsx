// components/layout/ThemeProvider.tsx — 主题与色觉安全模式
// chromacheck v1.0.0
'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AppSettings } from '@/lib/types';
import { loadSettings, saveSettings } from '@/lib/storage';

interface SettingsCtx {
  settings: AppSettings;
  toggleTheme: () => void;
  toggleCvdSafe: () => void;
}

const Ctx = createContext<SettingsCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({ theme: 'light', cvdSafe: false });

  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    document.body.classList.toggle('cvd-safe', settings.cvdSafe);
  }, [settings]);

  const toggleTheme = useCallback(() => {
    setSettings((prev) => {
      const next: AppSettings = { ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' };
      saveSettings(next);
      return next;
    });
  }, []);

  const toggleCvdSafe = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, cvdSafe: !prev.cvdSafe };
      saveSettings(next);
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ settings, toggleTheme, toggleCvdSafe }}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings must be used within ThemeProvider');
  return ctx;
}
