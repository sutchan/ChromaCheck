// components/history/ProfileSwitcher.tsx — 本地档案切换与管理（家庭多成员）
// chromacheck v1.9.1
'use client';

import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/layout/LangProvider';
import { Icon } from '@/components/common/Icon';
import type { Profile } from '@/lib/profile';
import {
  listProfiles,
  addProfile,
  updateProfile,
  deleteProfile,
  setActiveProfile,
  getDefaultProfile,
} from '@/lib/profile';

const selectStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--bg-elev)',
  color: 'var(--fg)',
  fontSize: '0.9rem',
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--bg)',
  color: 'var(--fg)',
  fontSize: '0.9rem',
};

export function ProfileSwitcher({
  current,
  onChange,
}: {
  current: string;
  onChange: (id: string) => void;
}) {
  const { t, lang } = useLang();
  const [mounted, setMounted] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [managing, setManaging] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');

  useEffect(() => {
    setProfiles(listProfiles());
    setMounted(true);
  }, []);

  function refresh() {
    setProfiles(listProfiles());
  }

  function choose(id: string) {
    setActiveProfile(id);
    onChange(id);
  }

  function add() {
    const p = addProfile({ name, relation }, lang);
    setName('');
    setRelation('');
    refresh();
    choose(p.id);
  }

  function remove(id: string) {
    if (!window.confirm(t('profile.deleteConfirm'))) return;
    const wasCurrent = current === id;
    deleteProfile(id);
    refresh();
    if (wasCurrent) choose(getDefaultProfile().id);
  }

  function rename(id: string) {
    const cur = profiles.find((p) => p.id === id)?.name ?? '';
    const np = window.prompt(t('profile.name'), cur);
    if (np && np.trim()) {
      updateProfile(id, { name: np.trim() });
      refresh();
    }
  }

  if (!mounted) return null;

  return (
    <div className="stack" style={{ gap: 'var(--s-2)' }}>
      <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'center' }}>
        <Icon name="users" size={18} />
        <select
          id="profile-select"
          style={selectStyle}
          value={current}
          onChange={(e) => choose(e.target.value)}
          aria-label={t('profile.switch')}
        >
          <option value="__all__">{t('profile.all')}</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.avatar} {p.name}
              {p.relation ? `（${p.relation}）` : ''}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ fontSize: '0.85rem' }}
          onClick={() => setManaging((v) => !v)}
        >
          <Icon name="settings" size={16} /> {t('profile.manage')}
        </button>
      </div>

      {managing && (
        <div className="card stack" style={{ gap: 'var(--s-3)', padding: 'var(--s-4)' }}>
          <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap' }}>
            <input
              style={inputStyle}
              placeholder={t('profile.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              style={inputStyle}
              placeholder={t('profile.relation')}
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: '0.85rem' }}
              onClick={add}
              disabled={!name.trim()}
            >
              <Icon name="user" size={16} /> {t('profile.add')}
            </button>
          </div>
          <div className="stack" style={{ gap: 'var(--s-2)' }}>
            {profiles.map((p) => (
              <div
                key={p.id}
                className="row between"
                style={{ gap: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'center' }}
              >
                <span style={{ fontSize: '0.95rem' }}>
                  {p.avatar} {p.name}
                  {p.relation ? `（${p.relation}）` : ''}
                  {current === p.id && (
                    <span className="chip chip-ok" style={{ marginLeft: 6 }}>
                      {t('profile.current')}
                    </span>
                  )}
                </span>
                <span className="row" style={{ gap: 'var(--s-1)' }}>
                  {current !== p.id && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ fontSize: '0.8rem', height: 32 }}
                      onClick={() => choose(p.id)}
                    >
                      {t('profile.switch')}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: '0.8rem', height: 32 }}
                    onClick={() => rename(p.id)}
                  >
                    {t('profile.rename')}
                  </button>
                  {p.id !== getDefaultProfile().id && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ fontSize: '0.8rem', height: 32 }}
                      onClick={() => remove(p.id)}
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
