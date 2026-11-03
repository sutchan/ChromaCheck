// lib/questions.ts — 石原氏题库（移植自 prototype/data.js）
// chromacheck v1.7.4
import type { Question, TestMode } from './types';

// 说明：原 transformation / classification / hidden 题型在渲染层仅绘制单数字（石原氏图编码为单层），
// 无法呈现"异常者读另一数字/隐藏数字浮现"的行为，且 hidden 因 answer='' 渲染空白沦为 no-op。
// 为科学性与诚实性，统一降级为 vanishing（红绿等混淆配色，正常可见、异常难以辨识），
// 并清除不可见的 protan/deutan 预期键。本应用定位为初筛，未实现真正的双数字变形/隐藏版（详见 learn 文案）。
export const QUESTIONS: Question[] = [
  { id: 'ishihara-01', plate: 1, type: 'demonstration', answer: '12', protan: '12', deutan: '12', difficulty: 1, quick: true },
  { id: 'ishihara-02', plate: 2, type: 'demonstration', answer: '8', protan: '8', deutan: '8', difficulty: 1, quick: true },
  { id: 'ishihara-03', plate: 3, type: 'vanishing', answer: '6', protan: '', deutan: '', difficulty: 1, quick: true },
  { id: 'ishihara-04', plate: 4, type: 'vanishing', answer: '29', protan: '', deutan: '', difficulty: 2, quick: true },
  { id: 'ishihara-05', plate: 5, type: 'vanishing', answer: '57', protan: '', deutan: '', difficulty: 2, quick: false },
  { id: 'ishihara-06', plate: 6, type: 'vanishing', answer: '5', protan: '', deutan: '', difficulty: 1, quick: true },
  { id: 'ishihara-07', plate: 7, type: 'vanishing', answer: '3', protan: '', deutan: '', difficulty: 1, quick: false },
  { id: 'ishihara-08', plate: 8, type: 'vanishing', answer: '15', protan: '', deutan: '', difficulty: 2, quick: true },
  { id: 'ishihara-09', plate: 9, type: 'vanishing', answer: '74', protan: '', deutan: '', difficulty: 2, quick: false },
  { id: 'ishihara-10', plate: 10, type: 'vanishing', answer: '2', protan: '', deutan: '', difficulty: 1, quick: true },
  { id: 'ishihara-11', plate: 11, type: 'vanishing', answer: '6', protan: '', deutan: '', difficulty: 1, quick: false },
  { id: 'ishihara-12', plate: 12, type: 'vanishing', answer: '97', protan: '', deutan: '', difficulty: 2, quick: true },
  { id: 'ishihara-13', plate: 13, type: 'vanishing', answer: '45', protan: '', deutan: '', difficulty: 2, quick: false },
  { id: 'ishihara-14', plate: 14, type: 'vanishing', answer: '5', protan: '', deutan: '', difficulty: 1, quick: true },
  { id: 'ishihara-15', plate: 15, type: 'vanishing', answer: '7', protan: '', deutan: '', difficulty: 1, quick: false },
  { id: 'ishihara-16', plate: 16, type: 'vanishing', answer: '16', protan: '', deutan: '', difficulty: 2, quick: true },
  { id: 'ishihara-17', plate: 17, type: 'vanishing', answer: '73', protan: '', deutan: '', difficulty: 3, quick: false },
  { id: 'ishihara-18', plate: 18, type: 'vanishing', answer: '26', protan: '', deutan: '', difficulty: 3, quick: false },
  { id: 'ishihara-19', plate: 19, type: 'vanishing', answer: '42', protan: '', deutan: '', difficulty: 3, quick: false },
  { id: 'ishihara-20', plate: 20, type: 'vanishing', answer: '35', protan: '', deutan: '', difficulty: 3, quick: false },
  { id: 'ishihara-21', plate: 21, type: 'vanishing', answer: '96', protan: '', deutan: '', difficulty: 3, quick: false },
  { id: 'ishihara-22', plate: 22, type: 'vanishing', answer: '8', protan: '', deutan: '', difficulty: 2, quick: false },
  { id: 'ishihara-23', plate: 23, type: 'normal', answer: '2', protan: '2', deutan: '2', difficulty: 1, quick: false },
  { id: 'ishihara-24', plate: 24, type: 'normal', answer: '5', protan: '5', deutan: '5', difficulty: 1, quick: false },
  { id: 'ishihara-25', plate: 25, type: 'vanishing', answer: '8', protan: '', deutan: '', difficulty: 2, quick: false },
  { id: 'ishihara-26', plate: 26, type: 'vanishing', answer: '29', protan: '', deutan: '', difficulty: 2, quick: false },
  { id: 'ishihara-27', plate: 27, type: 'vanishing', answer: '74', protan: '', deutan: '', difficulty: 2, quick: false },
  { id: 'ishihara-28', plate: 28, type: 'vanishing', answer: '6', protan: '', deutan: '', difficulty: 1, quick: false },
  { id: 'ishihara-29', plate: 29, type: 'vanishing', answer: '2', protan: '', deutan: '', difficulty: 1, quick: false },
  { id: 'ishihara-30', plate: 30, type: 'vanishing', answer: '45', protan: '', deutan: '', difficulty: 2, quick: false },
  { id: 'ishihara-31', plate: 31, type: 'vanishing', answer: '73', protan: '', deutan: '', difficulty: 2, quick: false },
  { id: 'ishihara-32', plate: 32, type: 'vanishing', answer: '5', protan: '', deutan: '', difficulty: 3, quick: false },
  { id: 'ishihara-33', plate: 33, type: 'vanishing', answer: '29', protan: '', deutan: '', difficulty: 3, quick: false },
  { id: 'ishihara-34', plate: 34, type: 'vanishing', answer: '16', protan: '', deutan: '', difficulty: 3, quick: false },
  { id: 'ishihara-35', plate: 35, type: 'vanishing', answer: '73', protan: '', deutan: '', difficulty: 3, quick: false },
  { id: 'ishihara-36', plate: 36, type: 'vanishing', answer: '35', protan: '', deutan: '', difficulty: 3, quick: false },
  { id: 'ishihara-37', plate: 37, type: 'demonstration', answer: '7', protan: '7', deutan: '7', difficulty: 1, quick: false },
  { id: 'ishihara-38', plate: 38, type: 'normal', answer: '9', protan: '9', deutan: '9', difficulty: 1, quick: false },
];

// 首页 Hero 展示用图版（题库首题，确定性，无需依赖完整题库导入）
export const HERO_PLATE = QUESTIONS[0];

const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

export function getQuestion(id: string): Question | undefined {
  return BY_ID.get(id);
}

/** 返回指定模式的题目子集（演示题始终包含在前部） */
export function getQuestions(mode: TestMode): Question[] {
  if (mode === 'quick') return QUESTIONS.filter((q) => q.quick);
  return QUESTIONS.slice();
}
