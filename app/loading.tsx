// app/loading.tsx — 路由级加载骨架
// chromacheck v1.7.3
export default function Loading() {
  return (
    <div
      className="wrap stack"
      style={{
        paddingBlock: 'var(--s-7)',
        gap: 'var(--s-4)',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
      }}
    >
      <div
        aria-hidden
        style={{
          width: 'min(90%, 520px)',
          height: 240,
          borderRadius: 'var(--r-lg)',
          background: 'var(--bg-sunken)',
        }}
      />
      <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
        正在加载…
      </p>
    </div>
  );
}
