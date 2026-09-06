// lib/path-field.ts — 路径追踪点阵底图（移植自 prototype renderPathField，纯函数）
// chromacheck v1.7.2
import { mulberry32 } from './ishihara';

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
