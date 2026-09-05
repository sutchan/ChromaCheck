// lib/types.ts — ChromaCheck 领域类型
// chromacheck v1.2.0

export type PlateType =
  | 'demonstration'
  | 'normal'
  | 'transformation'
  | 'vanishing'
  | 'hidden'
  | 'classification';

export type DeficiencyType =
  | 'protanopia'
  | 'protanomaly'
  | 'deuteranopia'
  | 'deuteranomaly'
  | 'tritanopia'
  | 'tritanomaly'
  | 'achromatopsia'
  | null;

export type Severity = 'mild' | 'moderate' | 'severe' | null;

export type Overall =
  | 'normal'
  | 'suspected_deficiency'
  | 'suspected_blindness'
  | 'inconclusive';

export type AxisKey = 'protan' | 'deutan' | 'tritan';

export type TestMode = 'quick' | 'standard';

export interface Question {
  id: string;
  plate: number;
  type: PlateType;
  answer: string;
  protan: string;
  deutan: string;
  difficulty: number;
  quick: boolean;
}

export interface AnswerRecord {
  questionId: string;
  userAnswer: string;
  durationMs: number;
}

export interface DiagnosisDimension {
  protan: number;
  deutan: number;
  tritan: number;
}

export interface ErrorPattern {
  type: string;
  questionCount: number;
  description: string;
}

export interface IshiharaResult {
  overall: Overall;
  type: DeficiencyType;
  severity: Severity;
  confidence: number;
  dimensions: DiagnosisDimension;
  details: {
    correctCount: number;
    totalCount: number;
    errorPatterns: ErrorPattern[];
  };
}

export interface PathTrackingQuestion {
  /** 题目唯一标识 */
  id: string;
  /** 画布宽度（CSS 像素） */
  width: number;
  /** 画布高度（CSS 像素） */
  height: number;
  /** 标准路径点集（归一化坐标 0-1） */
  standardPath: Array<{ x: number; y: number }>;
  /** 背景干扰色点配置 */
  backgroundDots: {
    /** 颜色（异常者难区分的色相） */
    color: string;
    /** 半径范围 */
    radiusRange: [number, number];
    /** 密度（每 100x100px 的点数，规划字段，渲染由 seed 决定） */
    density: number;
  };
  /** 路径色点颜色 */
  pathDotColor: string;
  /** 该题用于检测的异常类型 */
  targets: Array<'protan' | 'deutan'>;
  /** 标准路径形态：0=S 形, 1=螺旋, 2=之字形 */
  kind: 0 | 1 | 2;
  /** 确定性随机种子（渲染点阵用，保证每次渲染一致） */
  seed: number;
}

export interface PathTrackingResult {
  /** 题目 ID */
  questionId: string;
  /** 路径重合度 0-100 */
  overlapScore: number;
  /** 用户轨迹点（归一化 0-1） */
  userPath: Array<{ x: number; y: number }>;
  /** 是否通过（重合度 ≥ 70 视为正常） */
  passed: boolean;
}

export interface HueArrangementQuestion {
  /** 题目唯一标识 */
  id: string;
  /** 色卡数量（含首尾固定参考卡） */
  cardCount: 17;
  /** 15 张可移动色卡 sRGB 颜色（按正确渐变顺序） */
  cards: string[];
  /** 首尾固定参考卡颜色 */
  fixedColors: [string, string];
}

export interface HueArrangementResult {
  /** 题目 ID */
  questionId: string;
  /** 用户最终排列（可移动色卡索引序列，0-14） */
  order: number[];
  /** 总误差分数（TES） */
  totalErrorScore: number;
  /** 相邻色卡位置误差 */
  cardErrors: number[];
  /** 偏差方向（提示异常类型；D-15 排列不足以临床分型） */
  deviationDirection: 'protan' | 'deutan' | 'tritan' | 'none';
  /** TES < 20 视为正常 */
  normal: boolean;
}

export interface TestResult {
  id: string;
  schema: string;
  version: string;
  createdAt: string;
  testMode: TestMode;
  overall: Overall;
  type: DeficiencyType;
  severity: Severity;
  confidence: number;
  durationMs: number;
  answers: AnswerRecord[];
  /** 石原氏判读结果；纯路径追踪测试为 undefined */
  ishihara?: IshiharaResult;
  /** 路径追踪判读结果（v1.1 扩展） */
  pathTracking?: PathTrackingResult[];
  /** 色相排列（D15）判读结果（v1.2 扩展） */
  hueArrangement?: HueArrangementResult;
  analysis: string;
  confidenceNote: string;
  device: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  cvdSafe: boolean;
}
