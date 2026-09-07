// lib/questions.ts — 石原氏题库（移植自 prototype/data.js）
// chromacheck v1.7.4
import type { Question, TestMode } from './types';

export const QUESTIONS: Question[] = [
  { id: 'ishihara-01', plate: 1, type: 'demonstration', answer: '12', protan: '12', deutan: '12', difficulty: 1, quick: true },
  { id: 'ishihara-02', plate: 2, type: 'demonstration', answer: '8', protan: '8', deutan: '8', difficulty: 1, quick: true },
  { id: 'ishihara-03', plate: 3, type: 'transformation', answer: '6', protan: '5', deutan: '5', difficulty: 1, quick: true },
  { id: 'ishihara-04', plate: 4, type: 'transformation', answer: '29', protan: '70', deutan: '70', difficulty: 2, quick: true },
  { id: 'ishihara-05', plate: 5, type: 'transformation', answer: '57', protan: '35', deutan: '35', difficulty: 2, quick: false },
  { id: 'ishihara-06', plate: 6, type: 'transformation', answer: '5', protan: '2', deutan: '2', difficulty: 1, quick: true },
  { id: 'ishihara-07', plate: 7, type: 'transformation', answer: '3', protan: '5', deutan: '5', difficulty: 1, quick: false },
  { id: 'ishihara-08', plate: 8, type: 'transformation', answer: '15', protan: '17', deutan: '17', difficulty: 2, quick: true },
  { id: 'ishihara-09', plate: 9, type: 'transformation', answer: '74', protan: '21', deutan: '21', difficulty: 2, quick: false },
  { id: 'ishihara-10', plate: 10, type: 'vanishing', answer: '2', protan: '', deutan: '', difficulty: 1, quick: true },
  { id: 'ishihara-11', plate: 11, type: 'vanishing', answer: '6', protan: '', deutan: '', difficulty: 1, quick: false },
  { id: 'ishihara-12', plate: 12, type: 'vanishing', answer: '97', protan: '', deutan: '', difficulty: 2, quick: true },
  { id: 'ishihara-13', plate: 13, type: 'vanishing', answer: '45', protan: '', deutan: '', difficulty: 2, quick: false },
  { id: 'ishihara-14', plate: 14, type: 'vanishing', answer: '5', protan: '', deutan: '', difficulty: 1, quick: true },
  { id: 'ishihara-15', plate: 15, type: 'vanishing', answer: '7', protan: '', deutan: '', difficulty: 1, quick: false },
  { id: 'ishihara-16', plate: 16, type: 'vanishing', answer: '16', protan: '', deutan: '', difficulty: 2, quick: true },
  { id: 'ishihara-17', plate: 17, type: 'hidden', answer: '', protan: '73', deutan: '73', difficulty: 3, quick: false },
  { id: 'ishihara-18', plate: 18, type: 'classification', answer: '26', protan: '6', deutan: '2', difficulty: 3, quick: false },
  { id: 'ishihara-19', plate: 19, type: 'classification', answer: '42', protan: '2', deutan: '4', difficulty: 3, quick: false },
  { id: 'ishihara-20', plate: 20, type: 'classification', answer: '35', protan: '5', deutan: '3', difficulty: 3, quick: false },
  { id: 'ishihara-21', plate: 21, type: 'classification', answer: '96', protan: '6', deutan: '9', difficulty: 3, quick: false },
  { id: 'ishihara-22', plate: 22, type: 'transformation', answer: '8', protan: '3', deutan: '3', difficulty: 2, quick: false },
  { id: 'ishihara-23', plate: 23, type: 'normal', answer: '2', protan: '2', deutan: '2', difficulty: 1, quick: false },
  { id: 'ishihara-24', plate: 24, type: 'normal', answer: '5', protan: '5', deutan: '5', difficulty: 1, quick: false },
  { id: 'ishihara-25', plate: 25, type: 'transformation', answer: '8', protan: '3', deutan: '3', difficulty: 2, quick: false },
  { id: 'ishihara-26', plate: 26, type: 'transformation', answer: '29', protan: '70', deutan: '70', difficulty: 2, quick: false },
  { id: 'ishihara-27', plate: 27, type: 'transformation', answer: '74', protan: '21', deutan: '21', difficulty: 2, quick: false },
  { id: 'ishihara-28', plate: 28, type: 'vanishing', answer: '6', protan: '', deutan: '', difficulty: 1, quick: false },
  { id: 'ishihara-29', plate: 29, type: 'vanishing', answer: '2', protan: '', deutan: '', difficulty: 1, quick: false },
  { id: 'ishihara-30', plate: 30, type: 'vanishing', answer: '45', protan: '', deutan: '', difficulty: 2, quick: false },
  { id: 'ishihara-31', plate: 31, type: 'vanishing', answer: '73', protan: '', deutan: '', difficulty: 2, quick: false },
  { id: 'ishihara-32', plate: 32, type: 'hidden', answer: '', protan: '5', deutan: '5', difficulty: 3, quick: false },
  { id: 'ishihara-33', plate: 33, type: 'hidden', answer: '', protan: '29', deutan: '29', difficulty: 3, quick: false },
  { id: 'ishihara-34', plate: 34, type: 'classification', answer: '16', protan: '2', deutan: '5', difficulty: 3, quick: false },
  { id: 'ishihara-35', plate: 35, type: 'classification', answer: '73', protan: '5', deutan: '6', difficulty: 3, quick: false },
  { id: 'ishihara-36', plate: 36, type: 'classification', answer: '35', protan: '5', deutan: '3', difficulty: 3, quick: false },
  { id: 'ishihara-37', plate: 37, type: 'demonstration', answer: '7', protan: '7', deutan: '7', difficulty: 1, quick: false },
  { id: 'ishihara-38', plate: 38, type: 'normal', answer: '9', protan: '9', deutan: '9', difficulty: 1, quick: false },
];

// 首页 Hero 展示用图版（题库首题，确定性，无需依赖完整题库导入）
export const HERO_PLATE = QUESTIONS[0];

export const TYPE_LABEL: Record<Question['type'], string> = {
  demonstration: '演示题',
  normal: '常规题',
  transformation: '转换题',
  vanishing: '消失题',
  hidden: '隐藏题',
  classification: '分类题',
};

const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

export function getQuestion(id: string): Question | undefined {
  return BY_ID.get(id);
}

/** 返回指定模式的题目子集（演示题始终包含在前部） */
export function getQuestions(mode: TestMode): Question[] {
  if (mode === 'quick') return QUESTIONS.filter((q) => q.quick);
  return QUESTIONS.slice();
}
