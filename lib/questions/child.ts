// lib/questions/child.ts — 儿童模式题库（图形识别替代数字题，适合 5–10 岁）
// chromacheck v1.7.9
import type { PlateType } from '../types';

export type ChildShape = 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'cross';

/** 儿童作答值：图形名，或「看不清 / 没有图形」 */
export type ChildAnswerValue = ChildShape | 'none';

export interface ChildQuestion {
  id: string;
  /** 点阵种子（与板号对应，保证每次渲染一致） */
  plate: number;
  /** 图中绘制的图形 */
  shape: ChildShape;
  /** 配色方案（复用石原氏调色板） */
  type: PlateType;
  /** 可选图形（含正确项与干扰项，顺序已打散） */
  options: ChildShape[];
  answer: ChildAnswerValue;
  /** 演示题：全员可见，不计入判读 */
  demo: boolean;
}

const ALL_SHAPES: ChildShape[] = ['circle', 'square', 'triangle', 'star', 'heart', 'cross'];

/** 生成选项：正确答案 + 3 个干扰项，按字母序打散，避免正确答案位置固定 */
function optionsFor(answer: ChildShape): ChildShape[] {
  return [answer, ...ALL_SHAPES.filter((s) => s !== answer).slice(0, 3)].sort((a, b) =>
    a.localeCompare(b),
  );
}

export const CHILD_QUESTIONS: ChildQuestion[] = [
  { id: 'k1', plate: 101, shape: 'circle', type: 'demonstration', options: optionsFor('circle'), answer: 'circle', demo: true },
  { id: 'k2', plate: 102, shape: 'square', type: 'demonstration', options: optionsFor('square'), answer: 'square', demo: true },
  { id: 'k3', plate: 103, shape: 'triangle', type: 'normal', options: optionsFor('triangle'), answer: 'triangle', demo: false },
  { id: 'k4', plate: 104, shape: 'star', type: 'transformation', options: optionsFor('star'), answer: 'star', demo: false },
  { id: 'k5', plate: 105, shape: 'heart', type: 'normal', options: optionsFor('heart'), answer: 'heart', demo: false },
  { id: 'k6', plate: 106, shape: 'cross', type: 'vanishing', options: optionsFor('cross'), answer: 'cross', demo: false },
  { id: 'k7', plate: 107, shape: 'circle', type: 'transformation', options: optionsFor('circle'), answer: 'circle', demo: false },
  { id: 'k8', plate: 108, shape: 'star', type: 'normal', options: optionsFor('star'), answer: 'star', demo: false },
  { id: 'k9', plate: 109, shape: 'square', type: 'vanishing', options: optionsFor('square'), answer: 'square', demo: false },
  { id: 'k10', plate: 110, shape: 'heart', type: 'transformation', options: optionsFor('heart'), answer: 'heart', demo: false },
];

export function getChildQuestions(): ChildQuestion[] {
  return CHILD_QUESTIONS;
}

export const SHAPE_LABEL_EN: Record<ChildAnswerValue, string> = {
  circle: 'Circle',
  square: 'Square',
  triangle: 'Triangle',
  star: 'Star',
  heart: 'Heart',
  cross: 'Cross',
  none: 'Not sure / no shape',
};

export const SHAPE_LABEL: Record<ChildAnswerValue, string> = {
  circle: '圆形',
  square: '方形',
  triangle: '三角形',
  star: '星星',
  heart: '爱心',
  cross: '十字',
  none: '看不清 / 没有图形',
};
