// lib/questions/hue-arrangement.ts — 色相排列（D15）题库（v1.2）
// chromacheck v1.7.1
import type { HueArrangementQuestion, TestMode } from '../types';

/**
 * Farnsworth-Munsell D15 风格色卡。相较原版改进：
 * - 15 张可移动卡在 CIELAB Lch 空间生成（恒定 L*≈60、C* 近似恒定，仅色相变化），
 *   等亮度、等彩度，避免亮度/彩度线索干扰纯色相判别。
 * - 按蓝→红单调光谱渐变排列（hue 241°→10°），相邻步长均匀。
 * - 首尾固定参考卡取色相远端（蓝紫 #009ce0 与粉红 #d66ea3，跨约 269°），
 *   正确闭合色环；旧版两端同为蓝紫会破坏闭环几何。
 * 注意：TES 阈值（hue-scoring.ts 的 20/40）为经验值，尚未用本地样本标定。
 */
export const D15_CAPS: string[] = [
  '#00a2d0',
  '#00a5bf',
  '#00a6aa',
  '#00a693',
  '#00a57c',
  '#42a266',
  '#639f53',
  '#7e9a44',
  '#95953a',
  '#aa8e38',
  '#bd863e',
  '#cc7d4a',
  '#d8755b',
  '#de6f6e',
  '#df6c84',
];

/** 首尾固定参考卡颜色（色相远端，用于正确闭合色环） */
export const D15_FIXED: [string, string] = ['#009ce0', '#d66ea3'];

/** 确定性打乱：同一种子生成相同序列，保证 SSR / CSR 初始渲染一致 */
export function shuffledOrder(seed: number): number[] {
  const arr = D15_CAPS.map((_, i) => i);
  let s = seed >>> 0 || 1;
  const rand = () => {
    // mulberry32 LCG
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // 避免与正确顺序完全一致
  return arr.every((v, i) => v === i) ? shuffledOrder(seed + 1) : arr;
}

const HUE_QUESTION: HueArrangementQuestion = {
  id: 'hue-1',
  cardCount: 17,
  cards: D15_CAPS,
  fixedColors: D15_FIXED,
};

/** 取色相排列题目；quick / standard 均为同一组 D15 */
export function getHueQuestions(_mode: TestMode): HueArrangementQuestion[] {
  return [HUE_QUESTION];
}
