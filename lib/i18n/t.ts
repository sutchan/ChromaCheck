// lib/i18n/t.ts — 取译文（缺失时回退中文，避免界面出现键名）
// chromacheck v1.9.0
import { DICTS, type DictKey } from './dict';
import { DEFAULT_LANG, type Lang } from './lang';

export function t(lang: Lang, key: DictKey, vars?: Record<string, string | number>): string {
  const raw = DICTS[lang]?.[key] ?? DICTS[DEFAULT_LANG][key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_m, name: string) => String(vars[name] ?? `{${name}}`));
}
