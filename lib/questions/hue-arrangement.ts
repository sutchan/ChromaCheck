// lib/questions/hue-arrangement.ts — 色相排列（D15）题库（v1.2）
// chromacheck v1.7.1
import type { HueArrangementQuestion, TestMode } from '../types';

/**
 * Farnsworth-Munsell D15 色卡 sRGB 近似值（与原型 data.js CC.hueCards 一致），
 * 按正确渐变顺序排列：蓝紫 → 蓝 → 青 → 绿 → 黄绿 → 黄 → 橙 → 红 → 品红 → 紫。
 */
export const D15_CAPS: string[] = [
  '#7b6ea8',
  '#6a7fc4',
  '#4f97c9',
  '#3fa8b8',
  '#49b295',
  '#5fb369',
  '#87ad4c',
  '#b3a33f',
  '#c9903c',
  '#cf7442',
  '#c95f52',
  '#bb5566',
  '#a95f87',
  '#9568a4',
  '#8474ae',
];

/** 首尾固定参考卡颜色（与原型 screens-advanced.js 一致） */
export const D15_FIXED: [string, string] = ['#6b5fa8', '#8a7bb2'];

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
