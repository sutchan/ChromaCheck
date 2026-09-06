// lib/ishihara.ts — 点阵图数学与色觉模拟（移植自 prototype/ishihara.js，纯函数无 DOM）
// chromacheck v1.7.1

const CVD_MATRIX: Record<string, number[]> = {
  none: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
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
  // hidden：图点（红系）与背景（绿系）等亮度 → 正常视觉看不到数字、答「无数字」；异常视觉借色相看到数字
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

// ---- 路径追踪：标准路径 + 点阵底图（移植自 prototype renderPathField，纯函数） ----

export interface PathDot {
  x: number;
  y: number;
  r: number;
  isPath: boolean;
  color: string;
}

export interface PathField {
  W: number;
  H: number;
  dots: PathDot[];
  path: Array<{ x: number; y: number }>;
}

export type PathKind = 0 | 1 | 2;

/** 标准路径（归一化 0-1 坐标），kind: 0=S 形, 1=螺旋, 2=之字形 */
export function standardPath(kind: PathKind): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = [];
  if (kind === 0) {
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      pts.push({ x: 0.16 + 0.68 * t, y: 0.5 + 0.28 * Math.sin(t * Math.PI * 2) });
    }
  } else if (kind === 1) {
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * Math.PI * 2.6;
      const r = 0.12 + 0.3 * (i / 40);
      pts.push({ x: 0.5 + r * Math.cos(a), y: 0.5 + r * Math.sin(a) });
    }
  } else {
    for (let i = 0; i <= 40; i++) {
      const u = i / 40;
      pts.push({ x: 0.15 + 0.7 * u, y: 0.28 + 0.44 * Math.abs(Math.sin(u * Math.PI * 1.5)) });
    }
  }
  return pts;
}

/** 生成路径追踪点阵底图（纯数据，由组件负责绘制） */
export function buildPathField(cfg: {
  seed: number;
  kind: PathKind;
  width: number;
  height: number;
  pathColor: string;
  bgColors: string[];
  radiusRange: [number, number];
}): PathField {
  const { seed, kind, width: W, height: H, pathColor, bgColors, radiusRange } = cfg;
  const rng = mulberry32(seed * 7717 + 3);
  const path = standardPath(kind);
  const near = path.map((p) => ({ x: p.x * W, y: p.y * H }));

  const cell = 26;
  const cols = Math.ceil(W / cell);
  const grid: Record<number, PathDot[]> = {};
  const dots: PathDot[] = [];
  const tries = 9000;
  for (let t = 0; t < tries && dots.length < 1500; t++) {
    const x = rng() * W;
    const y = rng() * H;
    const gx = Math.floor(x / cell);
    const gy = Math.floor(y / cell);
    let ok = true;
    for (let oy = -1; oy <= 1 && ok; oy++) {
      for (let ox = -1; ox <= 1 && ok; ox++) {
        const b = grid[(gy + oy) * cols + (gx + ox)];
        if (!b) continue;
        for (let k = 0; k < b.length; k++) {
          if (Math.hypot(b[k].x - x, b[k].y - y) < 17) {
            ok = false;
            break;
          }
        }
      }
    }
    if (!ok) continue;
    const r = radiusRange[0] + rng() * (radiusRange[1] - radiusRange[0]);
    const d: PathDot = { x, y, r, isPath: false, color: '' };
    dots.push(d);
    const gi = gy * cols + gx;
    (grid[gi] = grid[gi] || []).push(d);
  }

  dots.forEach((d, idx) => {
    const isPath = near.some((p) => Math.hypot(p.x - d.x, p.y - d.y) < 26);
    if (isPath) {
      d.isPath = true;
      d.color = pathColor;
    } else {
      d.color = bgColors[idx % bgColors.length];
    }
  });

  return { W, H, dots, path };
}
