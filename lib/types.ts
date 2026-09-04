// lib/types.ts — ChromaCheck 领域类型
// chromacheck v1.0.0

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
  ishihara: IshiharaResult;
  analysis: string;
  confidenceNote: string;
  device: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  cvdSafe: boolean;
}
