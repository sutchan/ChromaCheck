'use client';
// components/test/TestSelectContent.tsx — 模式选择页双语内容
// chromacheck v1.8.0
import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';
import { useLang } from '@/components/layout/LangProvider';
import type { DictKey } from '@/lib/i18n';

interface ModeCard {
  id: string;
  titleKey: DictKey;
  descKey: DictKey;
  metaKey: DictKey;
  href: string;
}

const MODES: ModeCard[] = [
  { id: 'quick', titleKey: 'mode.quick.title', descKey: 'mode.quick.desc', metaKey: 'mode.quick.meta', href: '/test/ishihara/quick' },
  { id: 'standard', titleKey: 'mode.standard.title', descKey: 'mode.standard.desc', metaKey: 'mode.standard.meta', href: '/test/ishihara/standard' },
  { id: 'path', titleKey: 'mode.path.title', descKey: 'mode.path.desc', metaKey: 'mode.path.meta', href: '/test/path-tracking/standard' },
  { id: 'hue', titleKey: 'mode.hue.title', descKey: 'mode.hue.desc', metaKey: 'mode.hue.meta', href: '/test/hue-arrangement/standard' },
  { id: 'advanced', titleKey: 'mode.advanced.title', descKey: 'mode.advanced.desc', metaKey: 'mode.advanced.meta', href: '/test/advanced' },
  { id: 'child', titleKey: 'mode.child.title', descKey: 'mode.child.desc', metaKey: 'mode.child.meta', href: '/test/child' },
];

export function TestSelectContent() {
  const { t } = useLang();

  return (
    <>
      <div className="stack" style={{ gap: 'var(--s-2)', maxWidth: 640 }}>
        <span className="chip">{t('select.chip')}</span>
        <h1 style={{ margin: 0 }}>{t('select.title')}</h1>
        <p className="muted" style={{ margin: 0 }}>{t('select.desc')}</p>
      </div>

      <div id="mode-grid" className="grid-cards">
        {MODES.map((m) => (
          <Link key={m.id} href={m.href} style={{ color: 'inherit' }}>
            <div className="card stack" style={{ gap: 'var(--s-3)', height: '100%' }}>
              <div className="row between">
                <h3 style={{ margin: 0 }}>{t(m.titleKey)}</h3>
                <Icon name="arrowRight" size={20} />
              </div>
              <p className="muted" style={{ margin: 0, flex: 1 }}>{t(m.descKey)}</p>
              <span className="muted" style={{ fontSize: '0.85rem' }}>{t(m.metaKey)}</span>
            </div>
          </Link>
        ))}
      </div>

      <Callout icon="info">
        {t('select.guideCallout')}
        <Link href="/guide">{t('select.guideLink')}</Link>
        {t('select.guideTail')}
      </Callout>

      <div className="stack" style={{ gap: 'var(--s-3)' }}>
        <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Icon name="device" size={20} style={{ color: 'var(--brand)' }} />
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{t('driver.title')}</h2>
        </div>
        <p className="muted" style={{ margin: 0 }}>{t('driver.desc')}</p>
        <div id="driver-grid" className="grid-cards">
          <Link href="/test/ishihara/standard?scene=driver" style={{ color: 'inherit' }}>
            <div className="card stack" style={{ gap: 'var(--s-3)', height: '100%' }}>
              <div className="row between">
                <h3 style={{ margin: 0 }}>{t('driver.standard')}</h3>
                <Icon name="arrowRight" size={20} />
              </div>
              <p className="muted" style={{ margin: 0, flex: 1 }}>{t('driver.standardDesc')}</p>
              <span className="muted" style={{ fontSize: '0.85rem' }}>{t('mode.standard.meta')}</span>
            </div>
          </Link>
          <Link href="/test/signal" style={{ color: 'inherit' }}>
            <div className="card stack" style={{ gap: 'var(--s-3)', height: '100%' }}>
              <div className="row between">
                <h3 style={{ margin: 0 }}>{t('driver.signal')}</h3>
                <Icon name="arrowRight" size={20} />
              </div>
              <p className="muted" style={{ margin: 0, flex: 1 }}>{t('driver.signalDesc')}</p>
              <span className="muted" style={{ fontSize: '0.85rem' }}>{t('driver.signalMeta')}</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="stack" style={{ gap: 'var(--s-3)' }}>
        <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Icon name="users" size={20} style={{ color: 'var(--brand)' }} />
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{t('batch.title')}</h2>
        </div>
        <p className="muted" style={{ margin: 0 }}>{t('batch.desc')}</p>
        <div id="batch-grid" className="grid-cards">
          <Link href="/test/batch" style={{ color: 'inherit' }}>
            <div className="card stack" style={{ gap: 'var(--s-3)', height: '100%' }}>
              <div className="row between">
                <h3 style={{ margin: 0 }}>{t('batch.title')}</h3>
                <Icon name="arrowRight" size={20} />
              </div>
              <p className="muted" style={{ margin: 0, flex: 1 }}>{t('batch.desc')}</p>
              <span className="muted" style={{ fontSize: '0.85rem' }}>{t('batch.meta')}</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
