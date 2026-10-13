'use client';
// components/home/HomeContent.tsx — 首页双语内容（Hero + 特性 + 流程）
// chromacheck v1.7.9
import React from 'react';
import Link from 'next/link';
import { IshiharaPlate } from '@/components/test/IshiharaPlate';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';
import { HERO_PLATE } from '@/lib/questions';
import { useLang } from '@/components/layout/LangProvider';
import type { DictKey } from '@/lib/i18n';

const FEATURES: Array<{ icon: string; titleKey: DictKey; textKey: DictKey }> = [
  { icon: 'eye', titleKey: 'feat.science.title', textKey: 'feat.science.text' },
  { icon: 'clock', titleKey: 'feat.quick.title', textKey: 'feat.quick.text' },
  { icon: 'chart', titleKey: 'feat.dims.title', textKey: 'feat.dims.text' },
  { icon: 'shield', titleKey: 'feat.privacy.title', textKey: 'feat.privacy.text' },
];

const STEPS: Array<{ n: number; titleKey: DictKey; textKey: DictKey }> = [
  { n: 1, titleKey: 'step1.title', textKey: 'step1.text' },
  { n: 2, titleKey: 'step2.title', textKey: 'step2.text' },
  { n: 3, titleKey: 'step3.title', textKey: 'step3.text' },
];

export function HomeContent() {
  const { t } = useLang();
  const hero = HERO_PLATE;

  return (
    <>
      {/* Hero */}
      <section
        id="home-hero"
        className="wrap grid-cards"
        style={{ gridTemplateColumns: 'minmax(280px,1fr) minmax(280px,420px)', alignItems: 'center', gap: 'var(--s-7)' }}
      >
        <div className="stack" style={{ gap: 'var(--s-4)' }}>
          <span className="chip">{t('home.chip')}</span>
          <h1 style={{ margin: 0 }}>{t('home.title')}</h1>
          <p className="muted" style={{ margin: 0, fontSize: '1.05rem' }}>
            {t('home.desc')}
          </p>
          <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap' }}>
            <Link href="/test" className="btn btn-primary">
              {t('home.ctaStart')} <Icon name="arrowRight" size={18} />
            </Link>
            <Link href="/learn" className="btn btn-ghost">
              {t('home.ctaLearn')}
            </Link>
          </div>
          <Callout tone="warn" icon="alert">
            {t('home.disclaimer')}
          </Callout>
        </div>
        <IshiharaPlate type={hero.type} text={hero.answer} seed={hero.plate} maxWidth={400} />
      </section>

      {/* 特性 */}
      <section className="wrap stack" style={{ gap: 'var(--s-4)' }}>
        <h2>{t('home.whyTitle')}</h2>
        <div className="grid-cards">
          {FEATURES.map((f) => (
            <div key={f.titleKey} className="card stack" style={{ gap: 'var(--s-2)' }}>
              <span style={{ color: 'var(--brand)' }}>
                <Icon name={f.icon} size={26} />
              </span>
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{t(f.titleKey)}</h3>
              <p className="muted" style={{ margin: 0, fontSize: '0.92rem' }}>{t(f.textKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 流程 */}
      <section className="wrap stack" style={{ gap: 'var(--s-4)' }}>
        <h2>{t('home.stepsTitle')}</h2>
        <div className="grid-cards">
          {STEPS.map((s) => (
            <div key={s.n} className="card row" style={{ gap: 'var(--s-3)', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--brand)' }}>
                {s.n}
              </span>
              <div className="stack" style={{ gap: 4 }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{t(s.titleKey)}</h3>
                <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>{t(s.textKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
