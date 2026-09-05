// lib/storage.ts — 本地存储（历史 / 设置 / 进度），SSR 安全
// chromacheck v1.4.0
import type { AppSettings, TestResult } from './types';

const K = {
  results: 'cc.results.v1',
  settings: 'cc.settings.v1',
  progress: 'cc.progress.v1',
};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

const DEFAULT_SETTINGS: AppSettings = { theme: 'light', cvdSafe: false, funMode: true };

export function loadSettings(): AppSettings {
  if (!isBrowser()) return { ...DEFAULT_SETTINGS };
  try {
    const raw = window.localStorage.getItem(K.settings);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(s: AppSettings): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(K.settings, JSON.stringify(s));
}

export function saveResult(r: TestResult): void {
  if (!isBrowser()) return;
  const all = listResults();
  const map = new Map(all.map((x) => [x.id, x]));
  map.set(r.id, r);
  const arr = Array.from(map.values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  window.localStorage.setItem(K.results, JSON.stringify(arr.slice(0, 30)));
}

export function listResults(): TestResult[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(K.results);
    return raw ? (JSON.parse(raw) as TestResult[]) : [];
  } catch {
    return [];
  }
}

export function getResult(id: string): TestResult | undefined {
  return listResults().find((r) => r.id === id);
}

export function deleteResult(id: string): void {
  if (!isBrowser()) return;
  const arr = listResults().filter((r) => r.id !== id);
  window.localStorage.setItem(K.results, JSON.stringify(arr));
}

export function clearResults(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(K.results);
}

export interface TestProgress {
  mode: import('./types').TestMode;
  index: number;
  answers: import('./types').AnswerRecord[];
  startedAt: number;
}

export function saveProgress(p: TestProgress): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(K.progress, JSON.stringify(p));
}

export function loadProgress(): TestProgress | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(K.progress);
    return raw ? (JSON.parse(raw) as TestProgress) : null;
  } catch {
    return null;
  }
}

export function clearProgress(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(K.progress);
}
