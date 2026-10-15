// components/privacy/PrivacyContent.tsx — 隐私政策内容（客户端，双语）
// chromacheck v1.9.0
'use client';

import React from 'react';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';
import { useLang } from '@/components/layout/LangProvider';
import { getPrivacyDoc, parseEmphasis } from '@/lib/privacy-data';
import { SITE_UPDATED } from '@/lib/site';

/** 段落内 **强调** 片段渲染为 <strong> */
function RichParagraph({ text }: { text: string }) {
  return (
    <>
      {parseEmphasis(text).map((seg, i) =>
        seg.bold ? <strong key={i}>{seg.text}</strong> : <span key={i}>{seg.text}</span>,
      )}
    </>
  );
}

export function PrivacyContent() {
  const { lang } = useLang();
  const doc = getPrivacyDoc(lang);

  return (
    <div id="privacy-page" className="wrap stack" style={{ paddingBlock: 'var(--s-7)', gap: 'var(--s-5)', maxWidth: 860 }}>
      <div className="stack" style={{ gap: 'var(--s-2)' }}>
        <span className="chip">{doc.chip}</span>
        <h1 style={{ margin: 0 }}>{doc.heading}</h1>
        <p className="muted" style={{ margin: 0 }}>{doc.updatedLabel} {SITE_UPDATED} · {doc.updatedRef}</p>
      </div>

      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
        {doc.principles.map((p) => (
          <div key={p.icon} className="card stack" style={{ gap: 'var(--s-2)' }}>
            <span style={{ color: 'var(--brand)' }}><Icon name={p.icon} size={24} /></span>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{p.title}</h3>
            <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>{p.desc}</p>
          </div>
        ))}
      </div>

      {doc.sections.map((sec) => (
        <section key={sec.title} className="stack" style={{ gap: 'var(--s-2)' }}>
          <h2 style={{ margin: 0 }}>{sec.title}</h2>
          {sec.paragraphs.map((p, i) => (
            <p key={i} className="muted" style={{ margin: 0 }}>
              <RichParagraph text={p} />
            </p>
          ))}
        </section>
      ))}

      <Callout icon="info">
        {doc.note}
      </Callout>
    </div>
  );
}
