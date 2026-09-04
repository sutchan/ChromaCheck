// lib/format.ts — 格式化辅助
// chromacheck v1.0.0

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m} 分 ${s.toString().padStart(2, '0')} 秒`;
}

export function detectDevice(): string {
  if (typeof navigator === 'undefined') return '未知设备';
  const ua = navigator.userAgent;
  const browser = /Edg/.test(ua) ? 'Edge' : /Chrome/.test(ua) ? 'Chrome' : /Firefox/.test(ua) ? 'Firefox' : /Safari/.test(ua) ? 'Safari' : '浏览器';
  const os = /Windows/.test(ua) ? 'Windows' : /Mac/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : '系统';
  return `${os} · ${browser} ${/\(.*?(\d+)[.;]/.exec(ua)?.[1] ?? ''}`.trim();
}
