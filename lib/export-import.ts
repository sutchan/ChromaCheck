// lib/export-import.ts — 历史导出 / 导入（本地优先，JSON 包），含冲突合并与汇总 CSV
// chromacheck v1.17.8
import type { TestResult } from './types';
import type { Profile } from './profile';
import { listProfiles, saveAllProfiles, getDefaultProfile } from './profile';
import { listResults, saveAllResults } from './storage';
import { uiText } from './scoring';
import { t, type Lang } from './i18n';

export interface ExportBundle {
  app: 'ChromaCheck';
  schema: 'history-bundle/v1';
  version: string;
  exportedAt: string;
  profiles: Profile[];
  results: TestResult[];
}

export function buildExport(): ExportBundle {
  const results = listResults();
  return {
    app: 'ChromaCheck',
    schema: 'history-bundle/v1',
    version: results[0]?.version ?? 'unknown',
    exportedAt: new Date().toISOString(),
    profiles: listProfiles(),
    results,
  };
}

function triggerDownload(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadExport(bundle: ExportBundle, filename?: string): void {
  const name = filename ?? `chromacheck-history-${bundle.exportedAt.slice(0, 10)}.json`;
  triggerDownload(JSON.stringify(bundle, null, 2), name, 'application/json');
}

export interface ImportResult {
  ok: boolean;
  error?: string;
  bundle?: ExportBundle;
}

/**
 * 导入包逐字段白名单校验：只接受结构合法的档案 / 结果，阻断 null 元素与原型污染键。
 * 导入内容直接进入 localStorage 并参与渲染，宽松校验会导致合并阶段 TypeError 与原型污染。
 */
function isPlainRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x) && Object.getPrototypeOf(x) === Object.prototype;
}

function hasUnsafeKeys(x: unknown): boolean {
  if (!isPlainRecord(x)) return true;
  return Object.keys(x).some((k) => k === '__proto__' || k === 'constructor' || k === 'prototype');
}

function validProfile(p: unknown): boolean {
  return (
    isPlainRecord(p) &&
    typeof p.id === 'string' && p.id.length > 0 &&
    typeof p.name === 'string' &&
    typeof p.avatar === 'string' &&
    typeof p.createdAt === 'string' &&
    !hasUnsafeKeys(p)
  );
}

const VALID_OVERALLS = new Set(['normal', 'inconclusive', 'suspected_deficiency', 'suspected_blindness']);

function validResult(r: unknown): boolean {
  if (!isPlainRecord(r) || hasUnsafeKeys(r)) return false;
  return (
    typeof r.id === 'string' && r.id.length > 0 &&
    typeof r.createdAt === 'string' &&
    typeof r.overall === 'string' && VALID_OVERALLS.has(r.overall) &&
    typeof r.testMode === 'string' &&
    typeof r.confidence === 'number' && Number.isFinite(r.confidence) &&
    Array.isArray(r.answers)
  );
}

export function parseImport(text: string, lang: Lang = 'zh'): ImportResult {
  try {
    const data: unknown = JSON.parse(text);
    if (
      !isPlainRecord(data) ||
      data.app !== 'ChromaCheck' ||
      data.schema !== 'history-bundle/v1' ||
      !Array.isArray(data.profiles) ||
      !Array.isArray(data.results) ||
      !data.profiles.every(validProfile) ||
      !data.results.every(validResult)
    ) {
      return { ok: false, error: t(lang, 'history.errBadFormat') };
    }
    return { ok: true, bundle: data as unknown as ExportBundle };
  } catch {
    return { ok: false, error: t(lang, 'history.errBadJson') };
  }
}

export interface MergeSummary {
  addedProfiles: number;
  skippedProfiles: number;
  addedResults: number;
  skippedResults: number;
}

/** 按 id 合并；档案冲突保留本地，结果冲突保留 createdAt 较新者 */
export function mergeImport(bundle: ExportBundle): MergeSummary {
  const localProfiles = listProfiles();
  const localProfileIds = new Set(localProfiles.map((p) => p.id));
  let addedProfiles = 0;
  let skippedProfiles = 0;
  for (const p of bundle.profiles ?? []) {
    if (localProfileIds.has(p.id)) {
      skippedProfiles++;
      continue;
    }
    localProfiles.push(p);
    addedProfiles++;
  }
  saveAllProfiles(localProfiles);

  const localResults = listResults();
  const map = new Map(localResults.map((r) => [r.id, r]));
  let addedResults = 0;
  let skippedResults = 0;
  for (const r of bundle.results ?? []) {
    const existing = map.get(r.id);
    if (existing) {
      if (new Date(r.createdAt).getTime() > new Date(existing.createdAt).getTime()) map.set(r.id, r);
      else skippedResults++;
    } else {
      map.set(r.id, r);
      addedResults++;
    }
  }
  saveAllResults(Array.from(map.values()));
  return { addedProfiles, skippedProfiles, addedResults, skippedResults };
}

function csvCell(value: string): string {
  let safe = String(value ?? '');
  // CSV 公式注入防护：Excel / Sheets 会把 = + - @ 与制表符 / 回车开头的单元格当公式执行
  if (/^[=+\-@\t\r]/.test(safe)) safe = `'${safe}`;
  if (/[",\n]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

/** 批量汇总 CSV：按档案分组，每人取最新一条结果；lang 缺省为中文 */
export function buildSummaryCsv(lang: Lang = 'zh'): string {
  const profiles = listProfiles();
  const results = listResults();
  const header = [
    t(lang, 'csv.name'),
    t(lang, 'csv.relation'),
    t(lang, 'csv.verdict'),
    t(lang, 'csv.type'),
    t(lang, 'csv.stability'),
    t(lang, 'csv.mode'),
    t(lang, 'csv.date'),
    t(lang, 'csv.id'),
  ];
  const rows: string[][] = [];
  for (const p of profiles) {
    const rs = results
      .filter((r) => (r.profileId ?? getDefaultProfile().id) === p.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const latest = rs[0];
    if (!latest) continue;
    rows.push([
      p.name,
      p.relation ?? '',
      uiText.overall(latest.overall, lang),
      latest.type ? uiText.type(latest.type, lang) : '—',
      `${latest.confidence}%`,
      uiText.mode(latest.testMode, lang),
      latest.createdAt.slice(0, 10),
      latest.id,
    ]);
  }
  const lines = [header, ...rows].map((row) => row.map(csvCell).join(','));
  return '﻿' + lines.join('\n'); // BOM 确保 Excel 正确识别 UTF-8
}

export function downloadSummaryCsv(filename?: string, lang: Lang = 'zh'): void {
  const name = filename ?? `chromacheck-summary-${new Date().toISOString().slice(0, 10)}.csv`;
  triggerDownload(buildSummaryCsv(lang), name, 'text/csv;charset=utf-8');
}
