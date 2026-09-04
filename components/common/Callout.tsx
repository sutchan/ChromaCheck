// components/common/Callout.tsx — 提示条
// chromacheck v1.0.0
import React from 'react';
import { Icon } from './Icon';

export interface CalloutProps {
  tone?: 'info' | 'warn' | 'default';
  icon?: string;
  children: React.ReactNode;
}

export function Callout({ tone = 'default', icon, children }: CalloutProps) {
  const cls = tone === 'info' ? 'callout callout-info' : tone === 'warn' ? 'callout callout-warn' : 'callout';
  return (
    <div className={cls} role="note">
      {icon && (
        <span className="callout-icon">
          <Icon name={icon} size={20} />
        </span>
      )}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
