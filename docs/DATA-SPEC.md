# 色辨 ChromaCheck 数据规范文档

> **规范遵循**：本文档为 [SPEC.md](./SPEC.md) 的子主题分册；若与 SPEC 冲突，以 SPEC 为准。类型别名（ColorDeficiencyType / OverallResult / SeverityLevel / TestMode）以 SPEC §5.5 为权威定义。
> **实现状态**：v1.0–v1.14.2 已实现（Next.js 14 应用；石原氏 38 板 / 路径追踪 v1.1 / 色相排列 D15 v1.2 / 进阶联合 v1.3 / 趣味包 v1.4 / GA4 v1.5.1 / SEO·GEO v1.6 / 驾驶员场景 v1.7 / 设置面板 v1.10.0 / FAQ 手风琴 v1.11.0 / i18n 子模块化 v1.11.1 / lockfile 与 SEO metadata 补齐 v1.11.2 / 无障碍走查与测试覆盖优化 v1.12.0）。权威总纲见 [SPEC.md](./SPEC.md)，任务清单见 [TASKS.md](./TASKS.md)。

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.14.2 |
| 创建日期 | 2026-09-03 |

---

## 1. 概述

本文档定义色辨 ChromaCheck 的所有数据结构，包括：

- 题库数据（石原氏测试、路径追踪、色相排列）
- 答题记录
- 判读结果
- 本地存储数据

所有数据结构均有对应的 TypeScript 类型定义，集中在 `lib/types.ts`。

---

## 2. 题库数据结构

### 2.1 石原氏题目（Question）

```typescript
interface Question {
  /** 题目唯一标识，格式：ishihara-序号 */
  id: string;
  /** 石原氏图版号（原型字段 `plate`，早期文档误作 `plateNumber`） */
  plate: number;
  /**
   * 题目类型（PlateType 6 值枚举，定义见 ./SPEC.md §5.1；
   * 题库实际仅使用 demonstration / vanishing（另含 2 题 normal），
   * transformation / hidden / classification 题均已降级移除）：
   * - demonstration: 演示题
   * - normal: 常规数字题
   * - vanishing: 消失题（等亮度混淆配色，正常可见、异常难辨）
   */
  type: 'demonstration' | 'normal' | 'transformation' | 'vanishing' | 'hidden' | 'classification';
  /** 正常色觉应读数字 */
  answer: string;
  /** 预留字段：红色觉异常典型误读；38 题预期值均已清空，不参与类型判读 */
  protan: string;
  /** 预留字段：绿色觉异常典型误读；38 题预期值均已清空，不参与类型判读 */
  deutan: string;
  /** 难度等级（number） */
  difficulty: number;
  /** 是否纳入快速版题库（原型字段 `quick`，早期文档误作 `inQuickSet`） */
  quick: boolean;
}
```

**题型说明与判读用途**：

| 题型 | 正常色觉 | 异常色觉 | 判读用途 |
|------|----------|----------|----------|
| `demonstration` | 看到数字 | 也能看到 | 确认用户理解测试 |
| `normal` | 看到数字 | 也能看到 | 常规数字题（仅 2 张） |
| `vanishing` | 看到数字 | 难以辨认 | 判断是否存在异常 |

> `transformation` / `hidden` / `classification` 仅保留在类型枚举中，**题库已无此类题目**，其「判断异常类型 / 区分红绿色盲」用途在当前实现下不可达。

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
  /** 用户输入答案（空串表示未作答 / hidden 题留空 /「看不清」） */
  userAnswer: string;
  /** 答题时长（毫秒） */
  durationMs: number;
}

> 字段以 `lib/types.ts` 的 `AnswerRecord` 为权威（仅 3 个字段）；正确性由判读引擎按题目答案现场计算，不落库、不冗余存正确答案。
```

---

## 4. 判读结果

### 4.1 石原氏判读结果（IshiharaResult）

```typescript
interface IshiharaResult {
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
  deviationDirection: 'deutan' | 'tritan' | 'none';
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

> 以下结构与 `./SPEC.md §5.3` 及 `lib/types.ts` 对齐（权威）。路径追踪 / 色相排列为 v1.1 扩展，v1.0 不产生。

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
  /** 测试模式（TestMode：quick / standard / advanced / child） */
  testMode: TestMode;
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
  /** 判读引擎输出（见 §4）；纯路径追踪测试为 undefined */
  ishihara?: IshiharaResult;
  /** 文字解读 */
  analysis: string;
  /** 置信度说明 */
  confidenceNote: string;
  /** 设备/UA 摘要 */
  device: string;
  /** v1.1 扩展：pathTracking 已于 v1.1 实现；hueArrangement 已于 v1.2 实现 */
}
```

---

## 6. 本地存储规范

### 6.1 存储 Key 规范

```
cc.settings.v1      # 用户设置（AppSettings：theme + cvdSafe + funMode）
cc.results.v1       # 检测历史（TestResult[]，保留最近 30 条）
cc.progress.v1      # 进行中的检测进度（TestProgress）

> 实际以 `lib/storage.ts` 与 `./SPEC.md §5.4` 为准：使用上述三个扁平键，无聚合 `LocalStorageData`；`soundEnabled` / `autoNext` / `analyticsEnabled` / `'system'` 主题均为早期规划字段，**至今未实现**。下方 §6.2–§6.4 的结构为早期规划草案，现行结构见各节标注。
```

### 6.2 用户设置（Settings）

> **现行实现**：`lib/types.ts` 的 `AppSettings`（默认 `{ theme: 'light', cvdSafe: false, funMode: true }`），存于 `cc.settings.v1`。下方 `UserSettings` 为早期规划草案，**未实现**。

```typescript
interface AppSettings {
  theme: 'light' | 'dark';
  cvdSafe: boolean;
  /** 趣味体验开关（称号 / 章末过渡 / 里程碑仪式感），默认开 */
  funMode: boolean;
}
```

<details><summary>早期规划草案（未实现）</summary>

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

</details>

### 6.3 检测进度（CurrentTest）

> **现行实现**：`lib/storage.ts` 的 `TestProgress`，存于 `cc.progress.v1`；`answers` 为数组而非字典，`startedAt` 为毫秒时间戳。

```typescript
export interface TestProgress {
  mode: TestMode;                 // quick / standard / advanced / child
  index: number;                  // 下一题索引
  answers: AnswerRecord[];
  startedAt: number;
}
```

### 6.4 历史记录摘要（HistorySummary）

> **早期规划草案，未采用**：现行历史为 `cc.results.v1` 中完整 `TestResult[]`（最多 30 条，含逐题作答），不单独存摘要；字段以 `lib/types.ts` 的 `TestResult` 与 `./SPEC.md §5.3` 为权威。

```typescript
interface HistorySummary {
  id: string;
  /** 检测时间 ISO 字符串 */
  date: string;
  testMode: 'quick' | 'standard' | 'advanced';  // advanced 已于 v1.3 实现
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
   - hidden 题答对 ≥ 50% → 提示异常（兼容分支，当前不可达）

3. 异常类型判定（当前为退化分支）
   - 题库无 transformation / classification 题 → protanHit / deutanHit 恒为 0
   - `deutanHit >= protanHit` 恒真 → `type` 恒为 deuteranopia / deuteranomaly
   - **无法可靠区分红 / 绿 / 蓝黄异常类型**；tritan 维度为 `base * 0.35` 推算参考值

4. 程度判定
   - 色盲 + 消失题错误率 ≥ 70% → 重度
   - 色盲 + 错误率 ≥ 40% → 中度
   - 其余 → 轻度

5. 置信度计算
   - 基础 100 分
   - 演示题错误 -25
   - 答题过快（<1s）每题 -2
   - 答题矛盾 -15（当前不可达）
   - 答题数 < 50% -20
```

### 7.2 判读输出阈值

| 维度 | 正常范围 | 轻度异常 | 明显异常 |
|------|----------|----------|----------|
| protan / deutan / tritan | 0-30 | 30-60 | 60-100 |

> `tritan` 恒为 `base * 0.35`（≤35），「明显异常 60-100」对 tritan 不可达；三轴数值为参考值，不作异常类型判据。

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
