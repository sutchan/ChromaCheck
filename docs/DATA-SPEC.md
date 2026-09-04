# 色辨 ChromaCheck 数据规范文档

> **规范遵循**：本文档为 [docs/SPEC.md](docs/SPEC.md) 的子主题分册；若与 SPEC 冲突，以 SPEC 为准。类型别名（ColorDeficiencyType / OverallResult / SeverityLevel / TestMode）以 SPEC §5.5 为权威定义。
> **实现状态**：v1.0 已实现（Next.js 14 应用 + 石原氏检测 + 结果/历史/科普/隐私）。路径追踪与色相排列为 v1.1 规划。

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-09-03 |

---

## 1. 概述

本文档定义色辨 ChromaCheck 的所有数据结构，包括：

- 题库数据（石原氏测试、路径追踪、色相排列）
- 答题记录
- 判读结果
- 本地存储数据

所有数据结构均有对应的 TypeScript 类型定义，存放在 `types/` 目录。

---

## 2. 题库数据结构

### 2.1 石原氏题目（IshiharaQuestion）

```typescript
interface IshiharaQuestion {
  /** 题目唯一标识，格式：ishihara-序号 */
  id: string;
  /** 石原氏图版号（原型字段 `plate`，早期文档误作 `plateNumber`） */
  plate: number;
  /**
   * 题目类型（6 值枚举，定义见 docs/SPEC.md §5.1）：
   * - demonstration: 演示题
   * - normal: 常规数字题
   * - transformation: 转换题（正常/异常看到不同数字）
   * - vanishing: 消失题（正常可见、异常不可见）
   * - hidden: 隐藏题（异常可见、正常不可见）
   * - classification: 分类题（区分红/绿色盲）
   */
  type: 'demonstration' | 'normal' | 'transformation' | 'vanishing' | 'hidden' | 'classification';
  /** 正常色觉应读数字；hidden 题为 ''（空串表示不可见） */
  answer: string;
  /** 红色觉异常典型误读（'' 表示无） */
  protan?: string;
  /** 绿色觉异常典型误读（'' 表示无） */
  deutan?: string;
  /** 蓝色觉异常典型误读（v1.0 暂未启用，保留扩展） */
  answerTritan?: string;
  /** 难度等级 1-3 */
  difficulty: 1 | 2 | 3;
  /** 是否纳入快速版题库（原型字段 `quick`，早期文档误作 `inQuickSet`） */
  quick: boolean;
}
```

**题型说明与判读用途**：

| 题型 | 正常色觉 | 异常色觉 | 判读用途 |
|------|----------|----------|----------|
| `demonstration` | 看到数字 | 也能看到 | 确认用户理解测试 |
| `vanishing` | 看到数字 | 看不到 | 判断是否存在异常 |
| `transformation` | 看到 A | 看到 B | 判断异常类型 |
| `hidden` | 看不到 | 看到数字 | 辅助判断异常 |
| `classification` | 看到 A | 红盲看 B，绿盲看 C | 区分红/绿色盲 |

### 2.2 路径追踪题目（PathTrackingQuestion）

```typescript
interface PathTrackingQuestion {
  /** 题目唯一标识 */
  id: string;
  /** 画布宽度（CSS 像素） */
  width: number;
  /** 画布高度（CSS 像素） */
  height: number;
  /** 标准路径点集（归一化坐标 0-1） */
  standardPath: Array<{ x: number; y: number }>;
  /** 背景色点配置 */
  backgroundDots: {
    /** 颜色（使用异常者难区分的色相） */
    color: string;
    /** 半径范围 */
    radiusRange: [number, number];
    /** 密度（每 100x100px 的点数） */
    density: number;
  };
  /** 路径色点颜色 */
  pathDotColor: string;
  /** 该题用于检测的异常类型 */
  targets: Array<'protan' | 'deutan'>;
}
```

### 2.3 色相排列题目（HueArrangementQuestion）

```typescript
interface HueArrangementQuestion {
  /** 题目唯一标识 */
  id: string;
  /** 色卡数量（含首尾固定卡） */
  cardCount: 17; // 15 可移动 + 2 固定
  /** 色卡 sRGB 颜色值（按正确顺序排列） */
  cards: string[];
  /** 固定卡索引（首尾） */
  fixedIndices: [number, number];
}
```

---

## 3. 答题记录

```typescript
interface AnswerRecord {
  /** 题目 ID */
  questionId: string;
  /** 用户输入答案（空串表示未作答 / hidden 题留空） */
  userAnswer: string;
  /** 是否选择"看不清/无数字" */
  cannotSee: boolean;
  /** 答题时长（毫秒） */
  durationMs: number;
  /** 答题时间戳 ISO 字符串 */
  timestamp: string;
  /** 是否正确（由判读引擎计算，详见 docs/SPEC.md §6.1；原型无此字段，实现阶段补入） */
  correct: boolean;
  /** 冗余存正确答案，便于结果复核 */
  expectedAnswer: string;
}
```

---

## 4. 判读结果

### 4.1 石原氏判读结果（IshiharaScoringResult）

```typescript
interface IshiharaScoringResult {
  /** 总体结论 */
  overall:
    | 'normal'        // 色觉正常
    | 'suspected_deficiency'  // 疑似色弱
    | 'suspected_blindness'   // 疑似色盲
    | 'inconclusive';  // 无法判定
  /** 异常类型 */
  type?:
    | 'protanopia'   // 红色盲
    | 'deuteranopia' // 绿色盲
    | 'protanomaly'  // 红色弱
    | 'deuteranomaly'// 绿色弱
    | 'tritanopia'   // 蓝色盲
    | 'tritanomaly'  // 蓝色弱
    | 'achromatopsia'; // 全色盲
  /** 异常程度 */
  severity?: 'mild' | 'moderate' | 'severe';
  /** 置信度 0-100 */
  confidence: number;
  /** 各维度异常评分（越高越异常） */
  dimensions: {
    protan: number;  // 红色觉 0-100
    deutan: number;  // 绿色觉 0-100
    tritan: number;  // 蓝色觉 0-100
  };
  /** 详细信息 */
  details: {
    correctCount: number;
    totalCount: number;
    errorPatterns: ErrorPattern[];
  };
}

interface ErrorPattern {
  type: 'protan' | 'deutan' | 'tritan' | 'mixed' | 'random';
  questionCount: number;
  description: string;
}
```

### 4.2 路径追踪判读结果

```typescript
interface PathTrackingResult {
  /** 题目 ID */
  questionId: string;
  /** 路径重合度 0-100 */
  overlapScore: number;
  /** 用户轨迹点 */
  userPath: Array<{ x: number; y: number }>;
  /** 是否通过 */
  passed: boolean;
}
```

### 4.3 色相排列判读结果

```typescript
interface HueArrangementResult {
  /** 总误差分数（TES） */
  totalErrorScore: number;
  /** 每张色卡位置偏差 */
  cardErrors: number[];
  /** 偏差方向（指示异常类型） */
  deviationDirection: 'protan' | 'deutan' | 'tritan' | 'none';
  /** 是否正常 */
  normal: boolean;
}
```

**TES 判读标准**：

| TES 值 | 判定 |
|--------|------|
| < 20 | 色觉正常 |
| 20 - 40 | 轻度异常 |
| > 40 | 明显异常 |

---

## 5. 完整测试结果

> 以下结构与 `docs/SPEC.md §5.3` 及 `lib/types.ts` 对齐（权威）。路径追踪 / 色相排列为 v1.1 扩展，v1.0 不产生。

```typescript
interface TestResult {
  /** 结果唯一标识（crypto.randomUUID） */
  id: string;
  /** 结果结构标记，固定 'cc.result/v1' */
  schema: string;
  /** 结果结构版本，当前 '1.0.0' */
  version: string;
  /** ISO8601 完成时间 */
  createdAt: string;
  /** 测试模式；advanced 推迟至 v1.1 */
  testMode: 'quick' | 'standard';
  /** 综合判定 */
  overall: OverallResult;
  /** 疑似色觉异常类型（无则 null） */
  type: ColorDeficiencyType | null;
  /** 严重程度（无则 null） */
  severity: SeverityLevel | null;
  /** 置信度 0–100 */
  confidence: number;
  /** 作答总时长（毫秒） */
  durationMs: number;
  /** 逐题作答记录 */
  answers: AnswerRecord[];
  /** 判读引擎输出（见 §4） */
  ishihara: IshiharaScoringResult;
  /** 文字解读 */
  analysis: string;
  /** 置信度说明 */
  confidenceNote: string;
  /** 设备/UA 摘要 */
  device: string;
  /** v1.1 扩展（当前未实现）：pathTracking? / hueArrangement? */
}
```

---

## 6. 本地存储规范

### 6.1 存储 Key 规范

```
cc.settings.v1      # 用户设置（AppSettings：theme + cvdSafe）
cc.results.v1       # 检测历史（TestResult[]，保留最近 30 条）
cc.progress.v1      # 进行中的检测进度（TestProgress）

> v1.0 实际以 `lib/storage.ts` 与 `docs/SPEC.md §5.4` 为准：使用上述三个扁平键，无聚合 `LocalStorageData`、无 `soundEnabled`/`autoNext`/`analyticsEnabled`/`system` 主题（均推迟至 v1.1）。
```

### 6.2 用户设置（Settings）

```typescript
interface UserSettings {
  /** 是否启用音效 */
  soundEnabled: boolean;
  /** 答题后自动进入下一题 */
  autoNext: boolean;
  /** 主题 */
  theme: 'light' | 'dark' | 'system';
  /** 是否启用匿名数据上报 */
  analyticsEnabled: boolean;
}
```

### 6.3 检测进度（CurrentTest）

```typescript
interface CurrentTestProgress {
  /** 测试模式 */
  testMode: 'quick' | 'standard';  // advanced 推迟至 v1.1
  /** 当前题目索引 */
  currentIndex: number;
  /** 已答题目 */
  answers: Record<string, AnswerRecord>;
  /** 开始时间 */
  startTime: string;
}
```

### 6.4 历史记录摘要（HistorySummary）

```typescript
interface HistorySummary {
  id: string;
  /** 检测时间 ISO 字符串 */
  date: string;
  testMode: 'quick' | 'standard';  // advanced 推迟至 v1.1
  overall: OverallResult;
  type?: ColorDeficiencyType;
  severity?: SeverityLevel;
  confidence: number;
}
```

### 6.5 存储限制

| 项目 | 限制 |
|------|------|
| 历史记录条数 | 最多 30 条（TestResult[] 数组截断） |
| 完整结果 | 并入历史数组（不单独存 result:{id}） |
| 总存储容量 | 受浏览器 localStorage 配额约束 |
| 超出策略 | 按 createdAt 倒序保留最近 30 条 |

---

## 7. 判读规则说明

### 7.1 石原氏判读规则

```
1. 演示题校验
   - 演示题答错 → 标记"未理解测试要求"，置信度 -25

2. 按题型分组统计
   - vanishing 题错误数 ≥ 2 → 疑似色弱
   - vanishing 题错误数 ≥ 4 → 疑似色盲
   - hidden 题答对 ≥ 50% → 提示异常

3. 异常类型判定（transformation + classification 题）
   - protan 匹配 > deutan 匹配 → 红色觉异常
   - deutan 匹配 > protan 匹配 → 绿色觉异常
   - 无法区分时默认提示绿色觉异常（最常见）

4. 程度判定
   - 色盲 + 消失题错误率 ≥ 70% → 重度
   - 色盲 + 错误率 ≥ 40% → 中度
   - 其余 → 轻度

5. 置信度计算
   - 基础 100 分
   - 演示题错误 -25
   - 答题过快（<1s）每题 -2
   - 答题矛盾 -15
   - 答题数 < 50% -20
```

### 7.2 判读输出阈值

| 维度 | 正常范围 | 轻度异常 | 明显异常 |
|------|----------|----------|----------|
| protan / deutan / tritan | 0-30 | 30-60 | 60-100 |

---

## 8. 数据版本管理

| 数据版本 | 说明 |
|----------|------|
| `ISHIHARA_VERSION` | 石原氏题库版本（如 `1.0.0`） |
| `STORAGE_VERSION` | 本地存储结构版本（如 `1.0.0`） |

- 题库版本升级不影响本地已存储的历史结果（结果按检测时题库版本归档）。
- 本地存储结构升级时，通过版本号前缀兼容旧数据。

---

*文档结束*
