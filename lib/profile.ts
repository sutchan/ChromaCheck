// lib/profile.ts — 本地档案（家庭多成员），本地优先，不收集 PII
// chromacheck v1.9.1
import { t, type Lang } from './i18n';

/** 本地档案（v1.8.1：家庭多成员 / 批量检测，本地优先，不收集 PII） */
export interface Profile {
  id: string;
  name: string;
  /** 头像 emoji */
  avatar: string;
  /** 家庭关系标签，如「父亲 / 女儿」（可选） */
  relation?: string;
  createdAt: string;
}

const K_PROFILES = 'cc.profiles.v1';
const K_ACTIVE = 'cc.activeProfile.v1';
const DEFAULT_ID = 'default';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* 配额满 / 隐私模式：静默失败，不阻断流程 */
  }
}

function uid(): string {
  return 'p_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function getDefaultProfile(lang: Lang = 'zh'): Profile {
  return { id: DEFAULT_ID, name: t(lang, 'profile.defaultName'), avatar: '🧑', createdAt: '1970-01-01T00:00:00.000Z' };
}

export function listProfiles(): Profile[] {
  if (!isBrowser()) return [getDefaultProfile()];
  try {
    const raw = safeGet(K_PROFILES);
    if (!raw) return [getDefaultProfile()];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [getDefaultProfile()];
    if (!parsed.some((p: Profile) => p.id === DEFAULT_ID)) parsed.unshift(getDefaultProfile());
    return parsed;
  } catch {
    return [getDefaultProfile()];
  }
}

export function getActiveProfileId(): string {
  if (!isBrowser()) return DEFAULT_ID;
  const active = safeGet(K_ACTIVE);
  const profiles = listProfiles();
  if (active && profiles.some((p) => p.id === active)) return active;
  safeSet(K_ACTIVE, DEFAULT_ID);
  return DEFAULT_ID;
}

export function getActiveProfile(): Profile {
  const id = getActiveProfileId();
  return listProfiles().find((p) => p.id === id) ?? getDefaultProfile();
}

export function setActiveProfile(id: string): void {
  if (!isBrowser()) return;
  if (listProfiles().some((p) => p.id === id)) safeSet(K_ACTIVE, id);
}

export function addProfile(input: { name: string; avatar?: string; relation?: string }, lang: Lang = 'zh'): Profile {
  const p: Profile = {
    id: uid(),
    name: input.name.trim() || t(lang, 'profile.untitled'),
    avatar: input.avatar || '🧑',
    relation: input.relation?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  const all = listProfiles();
  all.push(p);
  safeSet(K_PROFILES, JSON.stringify(all));
  return p;
}

export function updateProfile(id: string, patch: Partial<Pick<Profile, 'name' | 'avatar' | 'relation'>>): void {
  const all = listProfiles();
  const idx = all.findIndex((p) => p.id === id);
  if (idx < 0) return;
  all[idx] = { ...all[idx], ...patch };
  safeSet(K_PROFILES, JSON.stringify(all));
}

export function deleteProfile(id: string): void {
  if (id === DEFAULT_ID) return; // 默认档案不可删除
  const all = listProfiles().filter((p) => p.id !== id);
  safeSet(K_PROFILES, JSON.stringify(all));
  if (getActiveProfileId() === id) safeSet(K_ACTIVE, DEFAULT_ID);
}

export function saveAllProfiles(arr: Profile[]): void {
  if (!isBrowser()) return;
  safeSet(K_PROFILES, JSON.stringify(arr));
}

export function getProfileName(id?: string, lang: Lang = 'zh'): string {
  if (!id) return getDefaultProfile(lang).name;
  return listProfiles().find((p) => p.id === id)?.name ?? getDefaultProfile(lang).name;
}
