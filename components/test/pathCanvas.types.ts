// components/test/pathCanvas.types.ts — 路径追踪画布类型与常量
// chromacheck v1.11.1
import type { PathTrackingQuestion } from '@/lib/types';

export const STEP = 0.04; // 键盘移动步长（归一化坐标）

export interface PathCanvasProps {
  question: PathTrackingQuestion;
  onResult: (userPath: { x: number; y: number }[]) => void;
}
