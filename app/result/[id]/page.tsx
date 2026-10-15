// app/result/[id]/page.tsx — 结果页
// chromacheck v1.7.9
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getResult } from '@/lib/storage';
import type { TestResult } from '@/lib/types';
import { ResultSummary } from '@/components/result/ResultSummary';
import { AxisChart } from '@/components/result/AxisChart';
import { AnswerReview } from '@/components/result/AnswerReview';
import { PathTrackingSummary } from '@/components/result/PathTrackingSummary';
import { ChildSummary } from '@/components/result/ChildSummary';
import { HueArrangementSummary } from '@/components/result/HueArrangementSummary';
import { EyesSwitcher } from '@/components/result/EyesSwitcher';
import { DimScenes } from '@/components/result/DimScenes';
import { DriverCompliance } from '@/components/result/DriverCompliance';
import { ReportActions } from '@/components/result/ReportActions';
import { Callout } from '@/components/common/Callout';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';

export default function ResultPage() {
  const { t } = useLang();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [result, setResult] = useState<TestResult | null>(null);
  const [state, setState] = useState<'loading' | 'found' | 'missing'>('loading');

  useEffect(() => {
    if (!id) {
      setState('missing');
      return;
    }
    const r = getResult(id);
    if (r) {
      setResult(r);
      setState('found');
    } else {
      setState('missing');
    }
  }, [id]);

  if (state === 'loading') {
    return (
      <div className="wrap stack" style={{ paddingBlock: 'var(--s-8)', alignItems: 'center' }}>
        <div className="skel" style={{ width: 220, height: 22 }} />
        <div className="skel" style={{ width: 160, height: 16, marginTop: 12 }} />
      </div>
    );
  }

  if (state === 'missing' || !result) {
    return (
      <div className="wrap stack" style={{ paddingBlock: 'var(--s-8)', alignItems: 'center', textAlign: 'center' }}>
        <Icon name="alert" size={40} />
        <h1 style={{ fontSize: '1.5rem' }}>{t('result.notFound')}</h1>
        <p className="muted">{t('result.notFoundDesc')}</p>
        <Link href="/test" className="btn btn-primary">{t('result.notFoundCta')}</Link>
      </div>
    );
  }

  const isDriver = result.scene === 'driver';

  return (
    <div className="wrap stack" id="result-page" style={{ paddingBlock: 'var(--s-6)', gap: 'var(--s-5)' }}>
      <ResultSummary result={result} />

      <DriverCompliance result={result} />

      {result.ishihara ? (
        <>
          <div className="grid-cards" style={{ gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 1fr)', alignItems: 'start' }}>
            <AxisChart dimensions={result.ishihara.dimensions} />
            <div className="card stack" style={{ gap: 'var(--s-3)' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>{t('result.errorPatterns')}</h3>
              {result.ishihara.details.errorPatterns.map((p, i) => (
                <div key={i} className="row" style={{ gap: 'var(--s-2)', alignItems: 'flex-start' }}>
                  <Icon name={p.type === 'random' ? 'check' : 'alert'} size={18} style={{ color: p.type === 'random' ? 'var(--ok)' : 'var(--warn)', marginTop: 2 }} />
                  <span style={{ fontSize: '0.9rem' }}>{p.description}</span>
                </div>
              ))}
            </div>
          </div>

          <AnswerReview answers={result.answers} />

          {!isDriver && <EyesSwitcher />}
          {!isDriver && <DimScenes />}
        </>
      ) : null}

      {result.pathTracking ? <PathTrackingSummary results={result.pathTracking} /> : null}

      {result.hueArrangement ? <HueArrangementSummary result={result.hueArrangement} /> : null}

      {result.child ? <ChildSummary result={result.child} /> : null}

      {isDriver ? (
        <Callout icon="info">{t('result.sceneNote')}</Callout>
      ) : null}

      <ReportActions result={result} plain={isDriver} />

      <Callout tone="warn" icon="shield">
        {t('result.disclaimer')}
      </Callout>
    </div>
  );
}
