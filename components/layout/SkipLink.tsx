// components/layout/SkipLink.tsx — 跳转主内容链接（仅键盘聚焦时可见，WCAG 2.4.1）
// chromacheck v1.9.0
'use client';

import React from 'react';
import { useLang } from './LangProvider';

export function SkipLink() {
  const { t } = useLang();
  return (
    <a href="#main-content" className="skip-link">
      {t('common.skipToContent')}
    </a>
  );
}
