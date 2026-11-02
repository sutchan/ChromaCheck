// components/layout/SettingsSwitchRow.tsx — 设置弹窗开关行（色觉安全 / 趣味体验共用）
// chromacheck v1.11.1

interface Props {
  id: string;
  label: string;
  desc: string;
  checked: boolean;
  onToggle: () => void;
  t: (key: 'settings.cvdSafe' | 'settings.funMode') => string;
}

export function SettingsSwitchRow({ id, label, desc, checked, onToggle, t }: Props) {
  return (
    <div className="row between" style={{ gap: 'var(--s-3)' }}>
      <div className="stack" style={{ gap: 2, flex: 1 }}>
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{label}</span>
        <span className="muted" style={{ fontSize: '0.82rem' }}>{desc}</span>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className="btn btn-ghost"
        style={{ height: 38, width: 48, padding: 0 }}
        onClick={onToggle}
      >
        <span
          style={{
            width: 40,
            height: 22,
            borderRadius: 999,
            background: checked ? 'var(--brand)' : 'var(--border)',
            position: 'relative',
            display: 'inline-block',
            transition: 'background .15s',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: checked ? 20 : 2,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left .15s',
            }}
          />
        </span>
      </button>
    </div>
  );
}
