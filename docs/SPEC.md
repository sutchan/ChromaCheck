<!-- docs/SPEC.md v1.0.5 — ChromaCheck 项目规范总纲（单一事实来源） -->
<!-- 地位：本规范为权威总纲。当与各分册（PRD/ARCHITECTURE/API/DATA-SPEC/DEPLOYMENT/TESTING/CONTRIBUTING/PRIVACY/ROADMAP）冲突时，以本规范为准。 -->
<!-- 实现状态：v1.0 已实现（Next.js 14 应用 + 石原氏检测 + 结果/历史/科普/隐私），原型作为设计验证参考。当前版本 v1.0.5。 -->

# 色辨 ChromaCheck 项目规范（SPEC）

> 本文档整合 `docs/` 下各分册与原型（`prototype/`）的真实事实，作为后续实现的**单一事实来源（Single Source of Truth）**。
> 各分册为本文档的子主题细化，若与本文档冲突，以本文档为准；分册应据本文档持续修订。

## 0. 文档关系与实现状态

| 文档 | 角色 | 状态 |
|------|------|------|
| `docs/SPEC.md`（本文件） | **权威总纲**：产品/架构/数据/算法/设计/合规/治理 | 生效 |
| `docs/PRD.md` | 产品需求分册 | 已对齐 SPEC，生效 |
| `docs/ARCHITECTURE.md` | 架构分册 | 已对齐 SPEC，生效 |
| `docs/API.md` | 事件/分析 API 分册 | 已对齐 SPEC，生效 |
| `docs/DATA-SPEC.md` | 数据结构分册 | 已对齐 SPEC，生效 |
| `docs/DEPLOYMENT.md` | 部署分册 | 已对齐 SPEC，生效 |
| `docs/TESTING.md` | 测试分册 | 已对齐 SPEC，生效 |
| `.github/CONTRIBUTING.md` | 贡献约定分册（已归位 .github/） | 生效 |
| `docs/PRIVACY.md` | 隐私政策分册 | 已对齐 SPEC，生效 |
| `docs/ROADMAP.md` | 路线图分册 | 已对齐 SPEC，生效 |

**实现状态声明（必须写入各文档顶部）**：ChromaCheck 已完成 v1.0 实现——Next.js 14 应用 + 石原氏检测 + 结果/历史/科普/隐私页均已落地，`npm install / npm run dev / npm run build / npm test` 均可正常执行（见 README「快速开始」）。路径追踪（F4）已于 v1.1 实现，色相排列（F5）已于 v1.2 实现；原型仅作设计验证参考。

## 1. 产品定位与功能范围

### 1.1 目标与用户
在线色觉筛查 Web 应用，提供石原氏测试、结果解读、历史记录与科普。定位为**筛查与科普工具，非医疗诊断**。核心用户：怀疑自身/家人有色觉异常者、职业体检前自查者、科普读者。

### 1.2 功能范围（v1.0）
遵循 ROADMAP §2.2 的边界，明确 v1.0 交付范围，**覆盖 PRD 与 ROADMAP 的冲突**：

- **纳入 v1.0（核心）**：首页、检测前指引、模式选择、石原氏测试、结果页、历史记录、科普列表与详情、**隐私政策页**（PRIVACY §6 要求，补入 PRD 功能架构）、结果导出（PDF/图片）、结果分享。
- **排除 v1.0（推迟至 v1.1+）**：路径追踪测试（F4）、色相排列测试（F5）。二者已在原型中作演示，但 v1.0 不实现正式模块。（路径追踪已于 v1.1 实现，色相排列已于 v1.2 实现）

检测模式：`quick`（快速，10 题）/ `standard`（标准，24 题）。`advanced`（进阶）推迟至 v1.1。

## 2. 技术架构（v1.0 已实现）

> 本节描述 v1.0 实际落地的技术栈与目录结构，与真实实现一致（详见 README §技术栈）。

### 2.1 技术栈与选型
- 框架：**Next.js 14（App Router）+ TypeScript（strict）**。
- 样式：**Tailwind CSS + 设计令牌（CSS 变量，支持深色与色觉安全模式）**。
- 图表：**内联 SVG（自绘维度条形图）**，不引入图表库。
- 导出：**Canvas（PNG）+ `window.print()`（PDF）**，不引入重型依赖。
- 状态/存储：React 状态 + `localStorage`（隐私优先，无服务端状态）。

### 2.2 目录结构（v1.0 已实现）
```
app/              # Next.js App Router：layout/page/guide/test/result/learn/history/privacy + globals.css/icon.svg
components/       # 按域：common/ home/ layout/ result/ test/
lib/
  questions.ts    # 题库数据
  scoring.ts      # 判读引擎（移植 prototype/assets/js/scoring.js 真值）
  ishihara.ts     # 石原氏点阵生成（移植 prototype/assets/js/ishihara.js 真值）
  storage.ts      # localStorage 读写
  learn-data.ts   # 科普文章数据
  format.ts       # 格式化工具
  types.ts        # 全局类型（以本文档 §5 为权威）
```
> 原型 `prototype/assets/js/*.js` 中的纯逻辑（scoring/data/ishihara）已作为 `lib/` 实现的**参考真值**完成移植，算法与字段保持一致。

### 2.3 运行形态
纯前端、客户端渲染为主；无强制登录、无 PII 上传、无传统后端（与 PRD「隐私优先」一致）。**不承诺服务端并发能力**——PRD §4.1「支持 1000 并发用户」与纯前端架构矛盾，予以作废，改为「静态托管可水平扩展」表述。

## 3. 设计系统规范

### 3.1 令牌单一来源
**`prototype/assets/css/tokens.css` 是设计令牌的单一来源**（色彩/字体/间距/圆角/阴影/动效）。实现阶段的 Tailwind 主题配置（`tailwind.config`）必须逐值映射该文件，禁止另行定义一套色板。

### 3.2 字体
- 无衬线/展示：`Archivo`（Google Fonts）；代码/数字：`IBM Plex Mono`。
- 通过 `fonts.googleapis.com` 引入；离线/沙箱构建需本地回退（系统字体栈已在 tokens.css 定义）。

### 3.3 色彩语义与色觉友好
- 品牌色：**棱镜靛 `#4b3df0`**（刻意避开红绿混淆轴，红绿色盲用户可完整辨识）。
- 数据轴色（取自石原氏图谱实际用色）：protan `#c9543a` / deutan `#4f7c46` / tritan `#3d6fb4`。
- **色觉友好模式** `[data-cvd-safe='on']`：数据可视化改用蓝—青—琥珀（`#4b3df0`/`#0e8a99`/`#b25e00`），确保全类型色觉异常可辨。
- **语义色（ok/warn/risk）必须与图标 + 文案三重编码**，不得仅靠色相传达状态（可达性硬约束）。
- 深色模式：`[data-theme='dark']` 覆盖语义映射。

### 3.4 动效与可达性
- 动效：`cc-rise`/`cc-fade`/`cc-pop`（tokens.css §10）；统一缓动 `--ease`。
- 必须尊重 `prefers-reduced-motion: reduce`（tokens.css 已全局降级）。
- 无障碍：语义化 HTML、ARIA 属性、键盘可达、WCAG AA；主要容器与关键 DOM 须加语义化 `id`（见 §8.1）。

### 3.5 趣味性设计规范（v0.1 原型已实现）

> 目标：降低弃测率 + 提升报告传播性；科普为加分项。**明确不做留存钩子**（成人色觉终身稳定，「复测提醒」会暗示色觉恶化、制造焦虑，与去污名化原则冲突）。

**红线（硬约束）**
1. **答题中永不显示对错**——任何对错暗示都会污染后续答题与判读数据。进度点阵只表达「已完成 / 当前 / 未到」三态；逐题明细的对错染色仅允许出现在结果页。
2. **不引入积分/排行榜/每日挑战**——刷分会诱导乱答，损害判读数据可信度。
3. **无障碍零豁免**——趣味元素同样通过五种色觉模拟校验、遵循「状态不靠颜色」三重编码、尊重 `prefers-reduced-motion`。
4. **称号去污名化**——旅人隐喻（如「全谱旅人」「森林色偏航的旅人」），仅本机展示，不默认公开。

**功能清单（7 项，均受「趣味体验」开关控制¹）**

| # | 功能 | 位置 | 说明 |
|---|------|------|------|
| 1 | 进度点阵仪式感 | 答题页 | 24 圆点母题进度条；每完成 8 题触发脉冲 + 「已完成 N / 24 版」轻提示 |
| 2 | 章末轻科普过渡 | 答题页 | 题型分 3 章（热身/主体/深水），章节交替处插入过渡卡（`CC.chapters`），回车或按钮继续 |
| 3 | 中性提交反馈 | 答题页 | 提交后「✓ 已记录」+ 420ms 缓冲（¹恒开，不随开关关闭） |
| 4 | 色觉人格分享卡 | 结果页 | Canvas 手绘（`sharecard.js`）：雷达 + 称号 + 三轴条，本地 `toDataURL` 导出 PNG，零依赖 |
| 5 | 换一双眼睛 | 结果页 | 第 4 版转换图（标准答案 29）五种色觉视角切换，复用 `CC.renderPlate` 的 `cvd` 参数（键名须用 `CVD_MATRIX` 的 `protanopia/deuteranopia/tritanopia/achromatopsia`） |
| 6 | 三轴互动科普 | 结果页 | 点维度条展开日常生活影响（`CC.dimScenes`），`aria-expanded` 状态可键盘操作 |
| 7 | 「趣味体验」总开关 | 设置面板 | 导航栏「设置」模态；`localStorage` 键 `cc.funMode`，默认开；关闭后称号/人格化文案回退中性措辞 |

¹ 开关控制范围：称号与人格化文案（#4/#5 之外的文案）、章末过渡（#2）、里程碑仪式感（#1）。中性反馈（#3）属于基础体验，恒开。

## 4. 原型契约（CC.* 全局 API）

原型以 `window.CC` 命名空间暴露真实逻辑，是判读与绘制的**参考真值**。

### 4.1 数据层 `prototype/assets/js/data.js`
- `CC.questions`：石原氏题库（24 题）。
- `CC.typeLabel`：题型中文名。
- `CC.rules`：判读规则参数（置信度/消失题/程度/维度/TES/路径重合阈值）。
- `CC.history`：历史记录演示数据。
- `CC.overallLabel` / `CC.typeText` / `CC.severityText` / `CC.modeText`：枚举展示文案。
- `CC.demoResult` / `CC.demoAnswers`：完整结果演示。
- `CC.hueCards` / `CC.hueShuffled`：色相排列色卡（Farnsworth-Munsell D15 sRGB 近似，15 色）。
- 趣味性数据（§3.5）：`CC.chapters` + `CC.chapterOf(type)`（章节文案与题型归属）、`CC.titles`（旅人称号，键为 ColorDeficiencyType / `normal` / `inconclusive`）、`CC.dimScenes`（三轴日常场景科普）。
- `app.js`：`CC.fun()` / `CC.setFun(on)`（趣味开关读写 + localStorage `cc.funMode`）。
- `sharecard.js`：`CC.drawShareCard(canvas, ish, radarValues, radarLabels, dateText)` / `CC.exportShareCard(canvas)`（Canvas 分享卡与 PNG 导出）。
- `CC.articles`：科普文章列表。
- `CC.routes`：页面路由清单（home/guide/select/ishihara/path/hue/result/history/learn/learnDetail）。

### 4.2 判读引擎 `prototype/assets/js/scoring.js`
- `CC.scoreIshihara(answers, questions)` → `IshiharaScoringResult`。
- `CC.scoreHue(order)` → 色相排列 TES 结果。
- `CC.scorePath(userPath, standardPath, tolerance?)` → 路径重合度（0–100，默认容差 0.055）。
- `CC.isCorrect(q, userAnswer)` → 布尔。

### 4.3 绘制与模拟 `prototype/assets/js/ishihara.js`
- `CC.renderPlate(opts)`：生成石原氏点阵检测图。
- `CC.renderPathField(opts)` → `{ W, H, path }`（`path` 为归一化坐标数组，用于 `scorePath` 重合度计算）。
- `CC.simulate(hex, kind)`：色觉模拟（Viénot-Brettel 近似），`kind ∈ none|protanopia|deuteranopia|tritanopia|achromatopsia`。

## 5. 数据模型（权威定义）

> 本节为数据结构的**唯一权威**，解决 PRD §6 与 DATA-SPEC §2/§4/§5/§6 的字段与枚举冲突。优先采用原型真实字段；原型未含、规划必需的字段以「可选」标注。

### 5.1 题库 `IshiharaQuestion`
```ts
type QuestionType =
  | 'demonstration' | 'normal' | 'transformation'
  | 'vanishing' | 'hidden' | 'classification';
interface IshiharaQuestion {
  id: string;          // 如 'ishihara-01'
  plate: number;       // 图版号
  type: QuestionType;  // 6 值枚举（原型实证，含 'normal'）
  answer: string;      // 正常视觉应读数字（hidden 题为空串）
  protan: string;      // 红色觉异常典型误读（空串=无）
  deutan: string;      // 绿色觉异常典型误读（空串=无）
  difficulty: 1 | 2 | 3;
  quick: boolean;      // 是否纳入快速版
  // 规划扩展（原型未含）：answerTritan?: string; inQuickSet?: boolean;
}
```
**决议**：PRD 的 `timeLimit`/`suggestedTime`、DATA-SPEC 的 `tritanopiaAnswer`/`inQuickSet` 原型均未使用。v1.0 采用 `quick` 表达快速版纳入，废用 `timeLimit`/`inQuickSet`；三色弱题通过 `answerTritan?` 扩展支持，v1.0 暂不实现。

### 5.2 答题记录 `AnswerRecord`
```ts
interface AnswerRecord {
  questionId: string;
  userAnswer: string;     // 用户原始输入（空串表示未作答/隐藏题留空）
  durationMs: number;     // 作答用时（>0 有效）
  correct: boolean;       // 由判读引擎计算（见 §6），解决 PRD 缺「是否正确」
  expectedAnswer: string; // 冗余存正确答案，便于结果复核
}
```

### 5.3 测试结果 `TestResult`
```ts
interface IshiharaScoringResult {
  overall: OverallResult;
  type: ColorDeficiencyType | null;
  severity: SeverityLevel | null;
  confidence: number;            // 0–100
  dimensions: { protan: number; deutan: number; tritan: number }; // 0–100
  details: {
    correctCount: number;
    totalCount: number;
    errorPatterns: { type: string; questionCount: number; description: string }[];
  };
}
interface TestResult {
  id: string;                       // crypto.randomUUID()
  schema: string;                   // 固定 'cc.result/v1'
  version: string;                  // 结果结构版本，当前 '1.0.0'
  createdAt: string;                // ISO8601 完成时间
  testMode: TestMode;               // 实际字段名（非 mode）
  overall: OverallResult;
  type: ColorDeficiencyType | null;
  severity: SeverityLevel | null;
  confidence: number;               // 0–100
  durationMs: number;               // 作答总时长
  answers: AnswerRecord[];          // 逐题作答（含 userAnswer/durationMs）
  ishihara: IshiharaScoringResult;  // 判读引擎输出（见 §6）
  analysis: string;                 // 文字解读
  confidenceNote: string;           // 置信度说明
  device: string;                   // 设备/UA 摘要
  // v1.1/v1.2 扩展（已实现）：pathTracking?（v1.1 已实现）/ hueArrangement?（v1.2 已实现）
}
```
**决议**：采用 DATA-SPEC 结构（`testMode` + `ishiharaAssessment` 内聚 `correctCount`），废用 PRD 顶层 `correctCount` 与 `testType` 命名。

### 5.4 本地存储（以 `lib/storage.ts` 实现为准）
> v1.0 实际落地：使用三个独立的 `localStorage` 键，不聚合为单一 `LocalStorageData` 对象；无用户账号、无 PII、无分析开关（均推迟至 v1.1）。

```ts
interface AppSettings {            // 键 cc.settings.v1
  theme: 'light' | 'dark';        // 含深色；'system' 由 ThemeProvider 解析，不持久化
  cvdSafe: boolean;               // 色觉安全模式开关
}
// 键 cc.results.v1    → TestResult[]（保留最近 30 条，按 createdAt 倒序）
// 键 cc.progress.v1   → { mode: TestMode; index: number; answers: AnswerRecord[]; startedAt: number }
```
**决议**：DATA-SPEC 的 `UserSettings{theme: 'light'|'dark'|'system'; analyticsEnabled}`、`HistorySummary`、`LocalStorageData` 聚合结构与 v1.0 代码不符。v1.0 采用上述扁平结构；`system` 主题与 `analyticsEnabled` 留作 v1.1 规划（届时再抽象为聚合 `LocalStorageData`）。

### 5.5 枚举（统一别名，供全局复用）
```ts
type ColorDeficiencyType =
  | 'protanopia' | 'protanomaly' | 'deuteranopia'
  | 'deuteranomaly' | 'tritanopia' | 'tritanomaly' | 'achromatopsia';
type OverallResult = 'normal' | 'suspected_deficiency' | 'suspected_blindness' | 'inconclusive';
type SeverityLevel = 'mild' | 'moderate' | 'severe';
type TestMode = 'quick' | 'standard';  // v1.0 仅实现快速/标准；advanced 推迟至 v1.1
```
**决议**：DATA-SPEC §4/§5 引用的 `ColorDeficiencyType`/`OverallResult`/`SeverityLevel` 在此统一定义，分册不得另起别名。（代码实现别名为 `DeficiencyType`/`Overall`/`Severity`，语义一致，分册以本文类型为准）。

### 5.6 分析事件 `AnalyticsEvent`（以 API §3.2 为准，含 `eventId`）
```ts
type AnalyticsEventName =
  | 'page_view' | 'cta_click' | 'answer_submit' | 'test_complete'
  | 'share' | 'download' | 'test_error' | 'learn_view'; // 含 learn_view（API 增量）
interface AnalyticsEvent {
  eventId: string;          // API §3.2 字段，ARCHITECTURE §5.2 缺失，以 API 为准
  event: AnalyticsEventName;
  timestamp: string;
  mode?: TestMode;
  [context: string]: unknown;
}
```
**决议**：统一采用 API §3.2 字段集（含 `eventId` 与 `learn_view`），ARCHITECTURE 据此修订。

## 6. 判读算法（权威，以 `scoring.js` 实现为准）

> 本节为算法唯一权威，解决 ARCHITECTURE §3.2 与 DATA-SPEC §7 的扣分/阈值矛盾。**参考实现：`prototype/assets/js/scoring.js`。**

### 6.1 正确性判定 `isCorrect(q, ua)`
- `hidden` 题：空答案（`ua.trim()===''`）为正确。
- 其余题：空答案=false；否则 `ua === q.answer`。

### 6.2 维度评分
```
wrong = total - correct
base  = round(min(100, (wrong/total) * 130))
protan = clamp(base + protanHit*8 - deutanHit*3, 0, 100)
deutan = clamp(base + deutanHit*8 - protanHit*3, 0, 100)
tritan = round(base * 0.35)
```
（`protanHit`/`deutanHit` = 转换/分类题中答案匹配对应异常典型值的计数）

### 6.3 总体结论
```
if answered < total*0.5                          → inconclusive
else if vanishWrong >= 4 || wrong >= 8           → suspected_blindness
else if vanishWrong >= 2 || wrong >= 4
        || hiddenRight >= ceil(hiddenTotal/2)    → suspected_deficiency
if demoWrong>0 && protanHit===0 && deutanHit===0
        && wrong < 4                             → inconclusive  // 演示题错且模式不稳定
```

### 6.4 类型与程度
- 轴选择：`deutanHit >= protanHit` 选 deutan 轴，否则 protan 轴。
- 类型：`suspected_blindness`→`*opia`，`suspected_deficiency`→`*anomaly`。
- 程度：`rate = wrong/total`；`>=0.7` 重度，`>=0.4` 中度，否则轻度。

### 6.5 置信度
```
confidence = 100
           + demoWrong * (-25)        // 演示题错（DATA-SPEC -25 为准，非 ARCHITECTURE -20）
           + fastCount * (-2)         // <1s 作答
if protanHit>0 && deutanHit>0 → +(-15)   // 矛盾模式
if answered < total*0.5         → +(-20) // 覆盖不足
clamp(confidence, 0, 100)
```
**决议**：演示题扣分值以 DATA-SPEC `-25` 为准；ARCHITECTURE 的「设计题 -20」「答题数<50% -20 仅 DATA-SPEC 有」等差异，统一以本算法（覆盖 `demoWrong`/`fastCount`/矛盾/覆盖不足四因子）为权威。

### 6.6 辅助评分
- 路径重合 `scorePath`：容差默认 `0.055`，命中比例 ×100。
- 色相排列 `scoreHue`：相邻位置偏差求和（首末位置偏差 `max(0,d-1)`，中间 `max(0,d-1)*2`），`TES < 20` 判正常。

## 7. 隐私与合规基线（摘要，详见 `PRIVACY.md`）
- 纯前端、localStorage 存储；**无强制登录、无 PII 上传、无服务端状态**。
- 提供数据导出与删除入口；`analyticsEnabled` 默认关闭，开启后仅采集匿名事件。
- 所有结果页/科普页显著标注**「筛查工具，非医疗诊断」**免责声明。
- **v1.0 必须上线路由 `/privacy` 隐私政策页**（PRIVACY §6 要求；PRD 功能架构原缺，规范补入）。

## 8. 代码与文档治理

### 8.1 编码与命名（复用全局规则）
- 组件 `PascalCase`，hooks/工具 `camelCase`（`useX`），配置/常量 `SCREAMING_SNAKE_CASE`，CSS `kebab-case`。
- 关键逻辑加中文注释；TS `strict`，避免 `any`；正确捕获 Promise 异常。
- **所有主要容器/关键 DOM 元素须加语义化 `id`**（如 `app-header`、`result-main`、`history-grid`、`privacy-page`），便于测试与无障碍。
- 不得出现 XSS/密钥泄露/`console.log` 遗留。
- **源文件单文件 ≤200 行须按职责拆分**（仅代码文件；文档不拆分，保持完整）。

### 8.2 版本管理
- 每次修改 bump 最小版本（patch 优先；新功能 minor；破坏性 major）。
- 源码文件头统一 `// path vX.Y.Z`；**仅被改动文件更新头注释，禁止全仓库批量刷写**。
- 项目的**版本单一来源已确立**：仓库根 `VERSION` 文件与 `package.json` 的 `version` 字段（当前 `1.0.4`）为权威；每次发版须同步二者并新增 `CHANGELOG.md` 条目。各文档头注释版本（如 SPEC `v1.0.4`）与 `VERSION` 保持一致；分册"文档版本 v1.0"为文档初版标记，与项目发布版本分属两套体系。原型文件头 `v0.1.0` 为原型内部迭代号，不随项目版本刷写（见 CHANGELOG 说明）。
- 文档版本当前统一标注 v1.0（产品目标）；原型文件头为 v0.1.0（原型阶段），二者分阶段对齐，不混用。

### 8.3 文档结构
- 9 份分册 + 本 SPEC；本 SPEC 为总纲，分册冲突以本规范为准。
- 每文档顶部须含：路径与版本、实现状态声明、负责人（当前为 `—`，应补实）。
- 变更须记录 CHANGELOG（实现阶段建立）。

### 8.4 测试与质量门禁
- 判读引擎（`lib/scoring/*`）为纯函数，须以 Vitest/Jest 单测覆盖，**覆盖率 ≥80%**（直接移植 scoring.js 后补齐）。
- 实现阶段质量门禁：ESLint + Prettier + Stylelint；TS strict；无 `console.log`/`debugger`；CI（`.github/workflows/ci.yml`，已建）跑 type-check + lint + build（e2e 安全跳过）。

## 9. 实现状态与待办（对齐 ROADMAP）
- **已完成（v1.0）**：文档体系（9 分册 + SPEC 总纲）、高保真静态原型（4 页）、Next.js 14 应用骨架、石原氏检测全流程（`lib/` 题库/判读/点阵/存储移植 + `components/` 组件）、结果/历史/科普/隐私页、导出（PNG/打印/复制）/分享、CI。
- **推迟**：`advanced` 进阶模式、匿名分析（`analyticsEnabled`）。（路径追踪 F4 已于 v1.1 实现，色相排列 F5 已于 v1.2 实现）

---
*本文档为 ChromaCheck 权威规范总纲 v1.0.4。分册应据本规范修订以消除前述字段/算法/范围冲突。*
