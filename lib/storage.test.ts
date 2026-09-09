// lib/storage.test.ts v1.7.6
/**
 * 浏览器存储封装需真实 DOM（jsdom 提供 window.localStorage）
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveResult, listResults, getResult, deleteResult, clearResults,
  loadSettings, saveSettings, saveProgress, loadProgress, clearProgress,
} from './storage';
import type { TestResult } from './types';

/** 构造最小合法 TestResult */
function result(id: string, createdAt: string): TestResult {
  return {
    id, schema: 'cc.result/v1', version: '1.0.0', createdAt,
    testMode: 'quick', overall: 'normal', type: null, severity: null,
    confidence: 90, durationMs: 60000, answers: [],
    analysis: '', confidenceNote: '', device: 'test',
  };
}

/** jsdom 环境下的存储引用（经 window 访问，规避 Node 实验性 localStorage 全局） */
const store = () => window.localStorage;

beforeEach(() => {
  store().clear();
  vi.restoreAllMocks();
});

describe('结果存取', () => {
  it('saveResult / listResults 往返，按 createdAt 降序', () => {
    saveResult(result('a', '2026-09-01T00:00:00Z'));
    saveResult(result('b', '2026-09-02T00:00:00Z'));
    const all = listResults();
    expect(all.map((r) => r.id)).toEqual(['b', 'a']);
  });

  it('最多保留 30 条，丢弃最旧', () => {
    for (let i = 0; i < 35; i++) {
      saveResult(result(`r${i}`, new Date(Date.UTC(2026, 0, 1, 0, 0, i)).toISOString()));
    }
    const all = listResults();
    expect(all).toHaveLength(30);
    expect(all[0].id).toBe('r34'); // 最新
    expect(all.map((r) => r.id)).not.toContain('r0'); // 最旧被淘汰
  });

  it('同名 id 覆盖旧记录而非重复', () => {
    saveResult(result('a', '2026-09-01T00:00:00Z'));
    saveResult(result('a', '2026-09-05T00:00:00Z'));
    const all = listResults();
    expect(all).toHaveLength(1);
    expect(all[0].createdAt).toBe('2026-09-05T00:00:00Z');
  });

  it('listResults 过滤结构非法的条目', () => {
    localStorage.setItem('cc.results.v1', JSON.stringify([{ bad: true }, result('ok', '2026-09-01T00:00:00Z')]));
    const all = listResults();
    expect(all.map((r) => r.id)).toEqual(['ok']);
  });

  it('存储内容损坏（非法 JSON）→ 返回空数组而非抛出', () => {
    localStorage.setItem('cc.results.v1', '{broken');
    expect(listResults()).toEqual([]);
  });

  it('getResult 按 id 查找；不存在返回 undefined', () => {
    saveResult(result('a', '2026-09-01T00:00:00Z'));
    expect(getResult('a')?.id).toBe('a');
    expect(getResult('missing')).toBeUndefined();
  });

  it('deleteResult / clearResults', () => {
    saveResult(result('a', '2026-09-01T00:00:00Z'));
    saveResult(result('b', '2026-09-02T00:00:00Z'));
    deleteResult('a');
    expect(listResults().map((r) => r.id)).toEqual(['b']);
    clearResults();
    expect(listResults()).toEqual([]);
  });
});

describe('写入降级（配额满 / 存储被禁用）', () => {
  it('setItem 抛出时 saveResult / saveSettings / saveProgress 静默失败', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => saveResult(result('a', '2026-09-01T00:00:00Z'))).not.toThrow();
    expect(() => saveSettings({ theme: 'dark', cvdSafe: true, funMode: false })).not.toThrow();
    expect(() => saveProgress({ mode: 'quick', index: 1, answers: [], startedAt: 0 })).not.toThrow();
  });
});

describe('设置', () => {
  it('默认值 + 局部合并', () => {
    expect(loadSettings()).toEqual({ theme: 'light', cvdSafe: false, funMode: true });
    saveSettings({ theme: 'dark', cvdSafe: true, funMode: false });
    expect(loadSettings()).toEqual({ theme: 'dark', cvdSafe: true, funMode: false });
  });

  it('设置内容损坏 → 回退默认值', () => {
    localStorage.setItem('cc.settings.v1', '{broken');
    expect(loadSettings()).toEqual({ theme: 'light', cvdSafe: false, funMode: true });
  });
});

describe('进度', () => {
  it('saveProgress / loadProgress 往返', () => {
    const p = { mode: 'standard' as const, index: 3, answers: [{ questionId: 'v1', userAnswer: '12', durationMs: 2000 }], startedAt: 1000 };
    saveProgress(p);
    expect(loadProgress()).toEqual(p);
  });

  it('进度内容损坏（非法 JSON / 结构不符）→ null', () => {
    store().setItem('cc.progress.v1', '{broken');
    expect(loadProgress()).toBeNull();
    store().setItem('cc.progress.v1', JSON.stringify({ mode: 'quick' })); // 缺 index / answers / startedAt
    expect(loadProgress()).toBeNull();
  });

  it('clearProgress 清空', () => {
    saveProgress({ mode: 'quick', index: 0, answers: [], startedAt: 0 });
    clearProgress();
    expect(loadProgress()).toBeNull();
  });
});
