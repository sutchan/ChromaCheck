// lib/ishihara.ts — 点阵图数学与色觉模拟（移植自 prototype/ishihara.js，纯函数无 DOM）
// chromacheck v1.7.2

// 正确的二色觉投影矩阵（Brettel/Vienot 1999，作用于线性 RGB；秩为 2，使等混淆对在异常视觉下真正趋同）。
// 旧版 daltonize 矩阵可逆（秩 3），仅做色相偏移、仍保留可分辨性，会错误显示石原氏数字"可见"。
const DICHROMAT: Record<string, number[]> = {
  none: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  protanopia: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  deuteranopia: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.011820, 0.042940, 0.968881],
  tritanopia: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.303900],
  achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
};

export type PaletteKey = 'demonstration' | 'normal' | 'transformation' | 'vanishing' | 'hidden' | 'classification';

// PALETTE：判别型图版（transformation/vanishing/hidden/classification）采用「等亮度、异色相」配色——
// 图点（红系）与背景点（绿系）相对亮度接近（ΔL 极小），异常视觉无法借亮度线索读出数字，
// 仅正常视觉能凭红/绿色相差异辨识（贴近真版石原氏图编码）。demonstration/normal 为全员可读题，保留对比度。
export const PALETTE: Record<PaletteKey, { fig: string[]; bg: string[] }> = {
  demonstration: { fig: ['#3e7cb1', '#4a88bd'], bg: ['#d8c79c', '#c9b98d', '#e0d3ae', '#bda97c'] },
  normal: { fig: ['#3e7cb1', '#37719f'], bg: ['#d8c79c', '#c9b98d', '#e2d5b2', '#bda97c'] },
  // 红系图点 L≈0.13–0.14，绿系背景 L≈0.15–0.16，亮度差远小于色相差
  transformation: { fig: ['#c0392b', '#b83227'], bg: ['#2e7d32', '#2f8f4e', '#357a38'] },
  vanishing: { fig: ['#c0392b', '#cf4434'], bg: ['#2e7d32', '#2f8f4e'] },
  // hidden：本应用未实现真正的"隐藏数字"双色版；相关题库已并入 vanishing（见 lib/questions.ts）。保留调色板仅供兼容。
  hidden: { fig: ['#c0392b', '#b83227'], bg: ['#2e7d32', '#2f8f4e'] },
  classification: { fig: ['#c0392b', '#b83227'], bg: ['#2e7d32', '#2f8f4e', '#357a38'] },
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToCss(r: number, g: number, b: number): string {
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

function toLin(v: number): number {
  v /= 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function toSrgb(v: number): number {
  v = Math.max(0, Math.min(1, v));
  return 255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);
}

/**
 * 色觉异常模拟：对线性 RGB 应用正确的二色觉投影矩阵（秩 2）。
 * 这样等混淆的图/底色在模拟的异常视觉下会真正趋同（石原氏消失题的数字会"消失"），
 * 而非旧版可逆矩阵那样仅做色相偏移、仍保留可分辨性。
 */
export function simulate(hex: string, kind: string): string {
  const m = DICHROMAT[kind] || DICHROMAT.none;
  if (kind === 'none' || !m) return hex;
  const [r, g, b] = hexToRgb(hex).map(toLin);
  const R = m[0] * r + m[1] * g + m[2] * b;
  const G = m[3] * r + m[4] * g + m[5] * b;
  const B = m[6] * r + m[7] * g + m[8] * b;
  return rgbToCss(toSrgb(R), toSrgb(G), toSrgb(B));
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
