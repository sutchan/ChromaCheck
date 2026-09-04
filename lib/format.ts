// lib/format.ts — 格式化辅助
// chromacheck v1.0.1

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
  const os = /Windows/.test(ua) ? 'Windows' : /Mac OS X|Macintosh/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) ? 'iOS' : '系统';
  let browser = '浏览器';
  let ver = '';
  const m = ua.match(/(Edg|Chrome|Firefox|Safari)\/(\d+)/);
  if (m) {
    const name = m[1];
    ver = m[2];
    if (name === 'Edg') browser = 'Edge';
    else if (name === 'Chrome') browser = 'Chrome';
    else if (name === 'Firefox') browser = 'Firefox';
    else if (name === 'Safari') {
      browser = 'Safari';
      const v = ua.match(/Version\/(\d+)/);
      if (v) ver = v[1];
    }
  } else {
    if (/Edg/.test(ua)) browser = 'Edge';
    else if (/Chrome/.test(ua)) browser = 'Chrome';
    else if (/Firefox/.test(ua)) browser = 'Firefox';
    else if (/Safari/.test(ua)) browser = 'Safari';
  }
  return `${os} · ${browser} ${ver}`.trim();
}
