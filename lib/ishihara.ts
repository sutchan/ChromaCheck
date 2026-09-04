// lib/ishihara.ts — 点阵图数学与色觉模拟（移植自 prototype/ishihara.js，纯函数无 DOM）
// chromacheck v1.0.0

export const CVD_MATRIX: Record<string, number[]> = {
  none: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
  achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
};

export type PaletteKey = 'demonstration' | 'normal' | 'transformation' | 'vanishing' | 'hidden' | 'classification';

export const PALETTE: Record<PaletteKey, { fig: string[]; bg: string[] }> = {
  demonstration: { fig: ['#3e7cb1', '#4a88bd'], bg: ['#d8c79c', '#c9b98d', '#e0d3ae', '#bda97c'] },
  normal: { fig: ['#3e7cb1', '#37719f'], bg: ['#d8c79c', '#c9b98d', '#e2d5b2', '#bda97c'] },
  transformation: { fig: ['#c4553b', '#cf6a45'], bg: ['#8fa05a', '#a9b581', '#c3c8a8', '#6f7f4a', '#d3cdbb'] },
  vanishing: { fig: ['#d97b45', '#cf7a52'], bg: ['#93a45e', '#a7b47a', '#c0c2a4', '#75864c'] },
  hidden: { fig: ['#b9a87e', '#c2b189'], bg: ['#c6b48a', '#d0bf98', '#bda97c'] },
  classification: { fig: ['#c4553b', '#b84f38'], bg: ['#8fa05a', '#a9b581', '#c3c8a8', '#6f7f4a'] },
};

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function rgbToCss(r: number, g: number, b: number): string {
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

/** 在近似线性空间应用矩阵，避免暗部偏色 */
export function simulate(hex: string, kind: string): string {
  const m = CVD_MATRIX[kind] || CVD_MATRIX.none;
  if (kind === 'none' || !m || kind === undefined) return hex;
  const c = hexToRgb(hex).map((v) => Math.pow(v / 255, 2.2) * 255);
  const o = [
    m[0] * c[0] + m[1] * c[1] + m[2] * c[2],
    m[3] * c[0] + m[4] * c[1] + m[5] * c[2],
    m[6] * c[0] + m[7] * c[1] + m[8] * c[2],
  ].map((v) => Math.pow(Math.max(v, 0) / 255, 1 / 2.2) * 255);
  return rgbToCss(o[0], o[1], o[2]);
}

export function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Dot {
  x: number;
  y: number;
  r: number;
}

/** 点阵生成（dart throwing + 网格加速），返回归一化坐标前的中间点（size=720 空间） */
export function buildDots(rng: () => number, size: number, rMin: number, rMax: number, max: number): Dot[] {
  const cell = rMax * 2;
  const cols = Math.ceil(size / cell);
  const grid: Record<number, Dot[]> = {};
  const dots: Dot[] = [];
  const R = size / 2 - rMax - 3;
  const tries = max * 40;
  for (let t = 0; t < tries && dots.length < max; t++) {
    const x = rng() * size;
    const y = rng() * size;
    const dx = x - size / 2;
    const dy = y - size / 2;
    if (dx * dx + dy * dy > R * R) continue;
    const gx = Math.floor(x / cell);
    const gy = Math.floor(y / cell);
    let ok = true;
    for (let oy = -1; oy <= 1 && ok; oy++) {
      for (let ox = -1; ox <= 1 && ok; ox++) {
        const b = grid[(gy + oy) * cols + (gx + ox)];
        if (!b) continue;
        for (let k = 0; k < b.length; k++) {
          if (Math.hypot(b[k].x - x, b[k].y - y) < (b[k].r + rMin) * 0.9) {
            ok = false;
            break;
          }
        }
      }
    }
    if (!ok) continue;
    const d = { x, y, r: rMin + rng() * (rMax - rMin) };
    dots.push(d);
    const gi = gy * cols + gx;
    (grid[gi] = grid[gi] || []).push(d);
  }
  return dots;
}
