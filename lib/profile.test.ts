// lib/profile.test.ts v1.9.0
/**
 * 本地档案模块测试：CRUD、默认档案、当前档案切换与损坏数据回退。
 * 依赖 vitest.setup.ts 注入的内存版 localStorage（window 指向 globalThis）。
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  listProfiles,
  addProfile,
  updateProfile,
  deleteProfile,
  setActiveProfile,
  getActiveProfileId,
  getActiveProfile,
  getDefaultProfile,
  getProfileName,
  saveAllProfiles,
} from './profile';

const store = () => window.localStorage;

beforeEach(() => {
  store().clear();
  vi.restoreAllMocks();
});

describe('档案管理', () => {
  it('空存储 → 仅含默认档案', () => {
    const all = listProfiles();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe('default');
    expect(getDefaultProfile().id).toBe('default');
  });

  it('addProfile 新增档案并持久化（保留默认档案）', () => {
    const p = addProfile({ name: '父亲', relation: '父亲' });
    expect(p.name).toBe('父亲');
    expect(p.id).not.toBe('default');
    const all = listProfiles();
    expect(all).toHaveLength(2);
    expect(all.map((x) => x.id)).toContain(p.id);
  });

  it('addProfile 空名称 → 回退为「未命名」', () => {
    const p = addProfile({ name: '   ' });
    expect(p.name).not.toBe('');
  });

  it('setActiveProfile / getActiveProfileId 切换当前档案', () => {
    const p = addProfile({ name: '女儿' });
    expect(getActiveProfileId()).toBe('default');
    setActiveProfile(p.id);
    expect(getActiveProfileId()).toBe(p.id);
    expect(getActiveProfile().name).toBe('女儿');
  });

  it('setActiveProfile 传入不存在的 id → 不切换', () => {
    setActiveProfile('not-exist');
    expect(getActiveProfileId()).toBe('default');
  });

  it('updateProfile 改名生效', () => {
    const p = addProfile({ name: '小明' });
    updateProfile(p.id, { name: '小红' });
    expect(listProfiles().find((x) => x.id === p.id)?.name).toBe('小红');
  });

  it('deleteProfile 不可删除默认档案', () => {
    deleteProfile('default');
    expect(listProfiles().map((p) => p.id)).toContain('default');
  });

  it('deleteProfile 删除当前档案 → 当前回退默认', () => {
    const p = addProfile({ name: '临时' });
    setActiveProfile(p.id);
    deleteProfile(p.id);
    expect(listProfiles().map((x) => x.id)).not.toContain(p.id);
    expect(getActiveProfileId()).toBe('default');
  });

  it('getProfileName 未知 id → 默认档案名', () => {
    expect(getProfileName('unknown')).toBe(getDefaultProfile().name);
    expect(getProfileName()).toBe(getDefaultProfile().name);
  });

  it('档案数据损坏（非法 JSON）→ 回退默认档案而非抛出', () => {
    store().setItem('cc.profiles.v1', '{broken');
    expect(listProfiles().map((p) => p.id)).toEqual(['default']);
  });

  it('saveAllProfiles 全量覆盖', () => {
    addProfile({ name: '将被覆盖' });
    saveAllProfiles([getDefaultProfile()]);
    expect(listProfiles()).toHaveLength(1);
  });
});
