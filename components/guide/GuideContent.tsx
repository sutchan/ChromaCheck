// components/guide/GuideContent.tsx — 检测前指引内容（客户端，双语）
// chromacheck v1.9.0
'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';
import { useLang } from '@/components/layout/LangProvider';

type Block = { icon: string; title: string; text: string };

export function GuideContent() {
  const { t } = useLang();

  const steps: Block[] = [
    { icon: 'device', title: t('guide.envTitle'), text: t('guide.envText') },
    { icon: 'eye', title: t('guide.eyesTitle'), text: t('guide.eyesText') },
    { icon: 'clock', title: t('guide.stateTitle'), text: t('guide.stateText') },
    { icon: 'info', title: t('guide.answerTitle'), text: t('guide.answerText') },
  ];

  const calibration: Block[] = [
    { icon: 'device', title: t('guide.filterTitle'), text: t('guide.filterText') },
    { icon: 'clock', title: t('guide.tempTitle'), text: t('guide.tempText') },
    { icon: 'eye', title: t('guide.lightTitle'), text: t('guide.lightText') },
    { icon: 'info', title: t('guide.demoTitle'), text: t('guide.demoText') },
  ];

  return (
    <div id="guide-page" className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-5)', maxWidth: 880 }}>
      <div className="stack" style={{ gap: 'var(--s-2)' }}>
        <span className="chip">{t('guide.title')}</span>
        <h1 style={{ margin: 0 }}>{t('guide.startHint')}</h1>
        <p className="muted" style={{ margin: 0 }}>
          {t('guide.startDesc')}
        </p>
      </div>

      <div className="grid-cards">
        {steps.map((s) => (
          <div key={s.title} className="card stack" style={{ gap: 'var(--s-2)' }}>
            <span style={{ color: 'var(--brand)' }}>
              <Icon name={s.icon} size={26} />
            </span>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{s.title}</h3>
            <p className="muted" style={{ margin: 0, fontSize: '0.92rem' }}>{s.text}</p>
          </div>
        ))}
      </div>

      <Callout tone="warn" icon="alert">
        {t('guide.disclaimer')}
      </Callout>

      <div className="stack" style={{ gap: 'var(--s-3)' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{t('guide.calibTitle')}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {t('guide.calibDesc')}
        </p>
        <div className="grid-cards">
          {calibration.map((c) => (
            <div key={c.title} className="card stack" style={{ gap: 'var(--s-2)' }}>
              <h3 style={{ margin: 0, fontSize: '1.02rem' }}>{c.title}</h3>
              <p className="muted" style={{ margin: 0, fontSize: '0.92rem' }}>{c.text}</p>
            </div>
          ))}
        </div>
        <Callout tone="info" icon="info">
          {t('guide.calibNote')}
        </Callout>
      </div>

      <div className="row" style={{ gap: 'var(--s-3)' }}>
        <Link href="/test" className="btn btn-primary">{t('guide.ctaSelect')} <Icon name="arrowRight" size={18} /></Link>
        <Link href="/test?scene=driver" className="btn btn-ghost">{t('guide.ctaDriver')}</Link>
        <Link href="/" className="btn btn-ghost">{t('guide.ctaHome')}</Link>
      </div>
    </div>
  );
}
