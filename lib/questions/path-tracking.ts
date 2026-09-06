// lib/questions/path-tracking.ts — 路径追踪题库（v1.1）
// chromacheck v1.7.1
import type { PathTrackingQuestion, TestMode } from '../types';
import { standardPath } from '../path-field';

const GREEN = '#8fa05a';
const PATH_COLOR = '#c4553b';

type Seed = Omit<PathTrackingQuestion, 'standardPath'>;

const RAW: Seed[] = [
  { id: 'path-1', width: 700, height: 520, backgroundDots: { color: GREEN, radiusRange: [7, 11.5], density: 0 }, pathDotColor: PATH_COLOR, targets: ['deutan'], kind: 0, seed: 11 },
  { id: 'path-2', width: 700, height: 520, backgroundDots: { color: GREEN, radiusRange: [7, 11.5], density: 0 }, pathDotColor: PATH_COLOR, targets: ['protan'], kind: 1, seed: 23 },
  { id: 'path-3', width: 700, height: 520, backgroundDots: { color: GREEN, radiusRange: [7, 11.5], density: 0 }, pathDotColor: PATH_COLOR, targets: ['protan', 'deutan'], kind: 2, seed: 37 },
];

const PATH_QUESTIONS: PathTrackingQuestion[] = RAW.map((q) => ({
  ...q,
  standardPath: standardPath(q.kind),
}));

/** 取路径追踪题目；quick 取 1 题，standard 取全部 3 题 */
export function getPathQuestions(mode: TestMode): PathTrackingQuestion[] {
  return mode === 'quick' ? PATH_QUESTIONS.slice(0, 1) : PATH_QUESTIONS;
}
