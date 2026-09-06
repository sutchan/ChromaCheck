// components/result/DriverCompliance.tsx — 驾照辨色力参考栏（T1 / T3）
// chromacheck v1.7.0
import React from 'react';
import type { TestResult } from '@/lib/types';
import { mapToLicense, type LicenseVerdict } from '@/lib/license';
import { Icon } from '@/components/common/Icon';

const TONE: Record<LicenseVerdict, string> = {
  compliant: 'chip-ok',
  deficiency_only: 'chip-warn',
  non_compliant: 'chip-risk',
  uncertain: 'chip-warn',
};

const VERDICT_ICON: Record<LicenseVerdict, string> = {
  compliant: 'check',
  deficiency_only: 'info',
  non_compliant: 'alert',
  uncertain: 'info',
};

export function DriverCompliance({ result }: { result: TestResult }) {
  const ref = mapToLicense(result);

  return (
    <section id="driver-compliance" className="card stack" style={{ gap: 'var(--s-3)', borderColor: 'var(--brand)' }}>
      <div className="row between" style={{ flexWrap: 'wrap', gap: 'var(--s-2)' }}>
        <div className="row" style={{ gap: 'var(--s-2)' }}>
          <Icon name="device" size={20} style={{ color: 'var(--brand)' }} />
          <h2 style={{ margin: 0, fontSize: '1.15rem' }}>驾照辨色力参考</h2>
        </div>
        <span className={`chip ${TONE[ref.verdict]}`}>
          <Icon name={VERDICT_ICON[ref.verdict]} size={14} /> {ref.title}
        </span>
      </div>

      <p style={{ margin: 0 }}>{ref.detail}</p>

      {ref.note ? (
        <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>{ref.note}</p>
      ) : null}

      <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>
        筛查结果仅作参考，不能替代专业眼科诊断；是否取得驾驶资格，以公安交管部门指定体检机构的结论为准。
      </p>
    </section>
  );
}
