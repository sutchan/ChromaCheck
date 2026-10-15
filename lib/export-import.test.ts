// lib/export-import.test.ts v1.9.0
/**
 * 导出 / 导入模块测试：导出包结构、导入解析与冲突合并策略、汇总 CSV 生成。
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { buildExport, parseImport, mergeImport, buildSummaryCsv } from './export-import';
import { saveResult, listResults } from './storage';
import { addProfile, listProfiles, getDefaultProfile } from './profile';
import type { ExportBundle } from './export-import';
import type { TestResult } from './types';

function result(id: string, createdAt: string, profileId?: string): TestResult {
  return {
    id,
    schema: 'cc.result/v1',
    version: '1.0.0',
    createdAt,
    testMode: 'quick',
    overall: 'normal',
    type: null,
    severity: null,
    confidence: 90,
    durationMs: 60000,
    answers: [],
    analysis: '',
    confidenceNote: '',
    device: 'test',
    ...(profileId ? { profileId } : {}),
  };
}

function bundle(profiles: ExportBundle['profiles'], results: TestResult[]): ExportBundle {
  return {
    app: 'ChromaCheck',
    schema: 'history-bundle/v1',
    version: '1.0.0',
    exportedAt: '2026-09-10T00:00:00Z',
    profiles,
    results,
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('导出', () => {
  it('buildExport 含档案与结果，包名与 schema 固定', () => {
    addProfile({ name: '父亲' });
    saveResult(result('a', '2026-09-01T00:00:00Z'));
    const b = buildExport();
    expect(b.app).toBe('ChromaCheck');
    expect(b.schema).toBe('history-bundle/v1');
    expect(b.profiles.length).toBeGreaterThanOrEqual(2); // 默认档案 + 新增
    expect(b.results.map((r) => r.id)).toEqual(['a']);
    expect(b.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe('导入解析', () => {
  it('合法包 → ok', () => {
    expect(parseImport(JSON.stringify(buildExport())).ok).toBe(true);
  });

  it('app 不符 / results 非数组 → ok:false 且带错误文案', () => {
    const bad1 = parseImport(JSON.stringify({ app: 'Other', results: [] }));
    expect(bad1.ok).toBe(false);
    expect(bad1.error).toBeTruthy();
    expect(parseImport(JSON.stringify({ app: 'ChromaCheck' })).ok).toBe(false);
  });

  it('非法 JSON → ok:false', () => {
    expect(parseImport('{broken').ok).toBe(false);
  });
});

describe('导入合并（冲突策略）', () => {
  it('新档案新增；同名档案保留本地', () => {
    const local = addProfile({ name: '本地成员' });
    const sum = mergeImport(
      bundle(
        [
          { id: local.id, name: '远端同名', avatar: '👤', createdAt: '2026-09-01T00:00:00Z' },
          { id: 'remote-1', name: '远端成员', avatar: '👤', createdAt: '2026-09-01T00:00:00Z' },
        ],
        [],
      ),
    );
    expect(sum.addedProfiles).toBe(1);
    expect(sum.skippedProfiles).toBe(1);
    expect(listProfiles().find((p) => p.id === local.id)?.name).toBe('本地成员');
    expect(listProfiles().map((p) => p.id)).toContain('remote-1');
  });

  it('新结果新增；同 id 旧结果保留本地较新者', () => {
    saveResult(result('a', '2026-09-05T00:00:00Z'));
    const sum = mergeImport(
      bundle([], [result('a', '2026-09-01T00:00:00Z'), result('b', '2026-09-02T00:00:00Z')]),
    );
    expect(sum.addedResults).toBe(1);
    expect(sum.skippedResults).toBe(1);
    expect(listResults().map((r) => r.id).sort()).toEqual(['a', 'b']);
    expect(listResults().find((r) => r.id === 'a')?.createdAt).toBe('2026-09-05T00:00:00Z');
  });

  it('同 id 且导入结果更新 → 覆盖本地', () => {
    saveResult(result('a', '2026-09-01T00:00:00Z'));
    mergeImport(bundle([], [result('a', '2026-09-10T00:00:00Z')]));
    expect(listResults().find((r) => r.id === 'a')?.createdAt).toBe('2026-09-10T00:00:00Z');
  });
});

describe('汇总 CSV', () => {
  it('含 BOM、每个有结果的档案一行（含姓名与关系）', () => {
    const p = addProfile({ name: '成员A', relation: '女儿' });
    saveResult(result('a', '2026-09-01T00:00:00Z', p.id));
    const csv = buildSummaryCsv();
    expect(csv.charCodeAt(0)).toBe(0xfeff); // BOM 兼容 Excel
    expect(csv).toContain('成员A');
    expect(csv).toContain('女儿');
  });

  it('无结果的档案不出现在汇总中', () => {
    addProfile({ name: '未测成员' });
    expect(buildSummaryCsv()).not.toContain('未测成员');
  });

  it('缺省 profileId 的结果归入默认档案', () => {
    saveResult(result('legacy', '2026-09-01T00:00:00Z'));
    const csv = buildSummaryCsv();
    expect(csv).toContain(getDefaultProfile().name);
    expect(csv).toContain('legacy');
  });
});
