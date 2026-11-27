<!-- ./SPEC.md v1.17.4 — ChromaCheck 项目规范总纲（单一事实来源） -->
<!-- 权威顺序：全局用户规则 > 本 SPEC > 各分册 > prototype/ 设计参考；冲突时按此顺序取舍 -->
<!-- 实现状态：Next.js 14 应用已落地——石原氏检测（38 板）、路径追踪、色相排列 D15、进阶联合、信号灯专项、趣味包、结果/历史/科普/隐私、首页 FAQ 双栏（12 条）、GA4、SEO/GEO、Vitest（15 文件 107 例）；原型仅作设计验证参考。当前版本 v1.17.4。 -->

# 色辨 ChromaCheck 项目规范（SPEC）

> 本文档是 ChromaCheck 的**单一事实来源（Single Source of Truth）**，整合 `docs/` 各分册与 `prototype/` 的真实事实。分册为本文档的子主题细化，冲突以本文档为准。
> 原型 `prototype/` 仅作设计验证参考：判读算法与绘制以 `app/` 与 `lib/` 的实现为权威。

## 0. 文档关系、优先级与实现状态

### 0.1 规范优先级（硬约束）

| 层级 | 来源 | 适用范围 | 冲突处理 |
|------|------|----------|----------|
| L0 | 全局用户规则（中文响应、语义化 id、200 行拆分、页脚版本格式等） | 所有项目与任务 | 最高，覆盖本项目一切约定 |
| L1 | 本 SPEC | 产品/架构/数据/算法/设计/合规/治理 | 项目内权威，分册冲突以本 SPEC 为准 |
| L2 | `docs/` 各分册、`.github/CONTRIBUTING.md` | 对应子主题 | 不得与 L1 冲突；冲突即修订分册 |
| L3 | `prototype/`（4 页 HTML + 经典全局脚本） | 设计验证与视觉参考 | 判读/绘制以 `app/` `lib/` 为准；脚本豁免 200 行拆分 |

### 0.2 文档清单（16 份，1 总纲 + 15 分册，v1.17.4 标准化）

| 文档 | 角色 | 权威领域 |
|------|------|----------|
| `./SPEC.md`（本文件） | **权威总纲** | 跨文档裁决、术语、版本与治理 |
| `./PRD.md` | 产品需求分册 | 功能需求、用户流程、验收口径 |
| `./ARCHITECTURE.md` | 架构分册 | 架构风格、技术选型理由、模块设计、存储、安全、CI/CD |
| `./FEATURES.md` | 功能模块分册 | 按模块划分的核心功能、业务流程图、关键逻辑 |
| `./API.md` | 接口分册 | 当前静态 GET 接口 + 历史规划接口（均标注未落地） |
| `./openapi.yaml` | OpenAPI 3.1 规范 | 机器可读接口规范（仅真实存在的 2 个 GET） |
| `./DATA-SPEC.md` | 数据分册 | 题库、答题、结果、存储键 |
| `./DEPLOYMENT.md` | 部署分册 | 环境依赖、多环境部署、Vercel / Docker / 验证 / 发布 |
| `./TESTING.md` | 测试分册 | Vitest、手工清单、质量门禁 |
| `./USER-GUIDE.md` | 用户操作指南 | 角色权限说明、操作流程图、详细步骤 |
| `./FAQ.md` | 常见问题分册 | 面向终端用户的常见疑问 |
| `./TROUBLESHOOTING.md` | 故障排除分册 | 用户与部署侧故障定位、依赖告警 |
| `./PRIVACY.md` | 隐私分册 | 数据收集、合规、免责声明 |
| `./ROADMAP.md` | 路线图分册 | 历史版本规划、优化建议与未来展望 |
| `./tasks.md` | 任务清单（**单一来源**） | 未完成项、待验证细节、优化项，按优先级排序 |
| `./tasks-done.md` | 已完成任务归档 | 历史任务收口记录 |
| `.github/CONTRIBUTING.md` | 贡献约定（位于 `.github/`） | 分支、提交、发版流程 |

### 0.3 实现状态（截至 v1.17.4，按模块分类）

- **检测范式**：石原氏（`quick` 10 题 / `standard` 38 题，v1.5 补齐 38 板）、路径追踪（v1.1）、色相排列 D15（v1.2）、进阶联合（v1.3）、信号灯辨识（v1.7，独立于 `TestMode`）、儿童图形（v1.7.9）、批量检测。
- **体验与内容**：结果页五视角、历史多档案 + 导出导入、科普与隐私页、首页 FAQ 双栏 12 条（v1.13.2）、趣味体验包（v1.4）、断点续测、驾驶场景专项（v1.7.0）。
- **工程与合规**：三语 i18n（v1.15.0，简中 > 繁中 > 英文）、判读类型未分型收敛（v1.15.1）、GitHub Releases 自动发布（v1.16.0）、页脚版本 + 构建号（v1.14.0）、安全响应头（v1.7.6）。
- **SEO / GEO（v1.17.0）**：`lib/seo-routes.ts` 单一路由源、`llms.txt` / `llms-full.txt`、站点级结构化数据、静态 PNG 社交图、`safeJson()` 转义修复、回归测试。
- **质量**：Vitest 15 文件 107 例（node 环境）；V8 覆盖率阈值与 Playwright 配置 / 主链路用例已提供，但 npm 脚本 / 依赖 / CI 接入及 E2E 验收尚未闭环；组件测试未落地。
- **边界**：纯前端、无服务端 API 路由（仅 `app/llms.txt/route.ts`、`app/llms-full.txt/route.ts` 两个 Route Handler）、无账号、无 PII 上传、仅 GA4 匿名统计。

## 1. 产品定位与功能范围

### 1.1 目标与用户
在线色觉筛查 Web 应用，提供石原氏测试、结果解读、历史记录与科普。定位为**筛查与科普工具，非医疗诊断**。核心用户：怀疑自身/家人有色觉异常者、职业体检前自查者、科普读者。

### 1.2 现行功能边界
- **纳入**：首页、检测前指引、模式选择、石原氏测试、结果页、历史记录、科普列表与详情、隐私政策页、结果导出（PNG / 打印 / 复制）、分享卡、三语切换、设置面板、离线页。
- **检测模式**：`quick`（10 题）/ `standard`（38 题）/ `advanced`（进阶联合，v1.3）/ `child`（儿童图形，v1.7.9），定义见 `lib/types.ts` 的 `TestMode`。
- **独立专项**：信号灯辨识（`/test/signal`）与 `TestMode` 解耦，结果不写入 `TestResult`、不进历史（详见 §5.7 / §6.7）。
- **不承诺**：服务端并发能力、医疗诊断、可靠区分红/绿/蓝黄异常类型（见 §6.4）、云端存储与账号体系（均为未实现的远期选项）。

## 2. 技术架构

> 本节描述 v1.17.4 实际落地的技术栈与结构；与真实代码不一致时以代码为准并修订本节。

### 2.1 技术栈与选型
- 框架：**Next.js 14（App Router）+ TypeScript（strict）**；样式：**Tailwind CSS + CSS 变量令牌**（深色 / 色觉安全）。
- 图表：内联 SVG 自绘，不引入图表库；导出：Canvas（PNG）+ `window.print()`（PDF），不引入重型依赖。
- 存储：React 状态 + `localStorage`（`safeSet` 降级与运行时校验），无服务端状态。
- 测试：Vitest（node 环境）；CI Node 22 LTS，checkout / setup-node v5，`npm install`（不配 `cache`）。

### 2.2 目录结构（核心）
```
app/              # App Router：/ /guide /test /offline /privacy /result/[id] /history /learn /learn/[slug]
                  # /test/{ishihara/[mode],path-tracking/[mode],hue-arrangement/[mode],advanced,signal,batch,child}
                  # + robots.ts sitemap.ts llms.txt/route.ts llms-full.txt/route.ts globals.css icon.svg
components/       # common/ home/ layout/ result/ test/ analytics/ seo/
lib/
  types.ts        # 全局类型（§5 为结构说明，代码为最终真值）
  questions.ts    # 石原氏题库（38 题）；questions/ 为专项题库子目录
  scoring.ts / hue-scoring.ts / path-scoring.ts / signal-scoring.ts / advanced-scoring.ts
  ishihara.ts / path-field.ts / report-canvas.ts / sharecard*.ts
  storage.ts      # localStorage 读写（safeSet 降级 + 校验）
  i18n/           # lang.ts / dict.ts / t.ts + zh-/tw-/en-* 字典
  seo-routes.ts   # SEO_ROUTES 单一路由源（v1.17.0）
  site.ts / seo-routes.ts / format.ts / analytics.ts / license.ts / privacy-data.ts / learn-data.ts / fun.ts
  *.test.ts       # Vitest 单测（15 文件 107 例）
prototype/        # 4 页 HTML 设计验证（v0.1.x，与产品版本解耦，不随发版刷写）
```
> 原型 `prototype/assets/js/*.js` 的纯逻辑已作为 `lib/` 的参考真值移植；v1.7.5 起原型判读反向对齐应用。详见 `.codebuddy/memory/`（项目内记忆索引）。

### 2.3 运行形态与路由现状
纯前端、客户端渲染为主、无强制登录、无 PII 上传。静态托管可水平扩展；不承诺服务端并发能力。

| 路径 | 现状 |
|------|------|
| `app/llms.txt/route.ts`、`app/llms-full.txt/route.ts` | **现存 Route Handler**，输出 GEO 文本索引 |
| `/api/health`、`/api/questions/*` | **未实现**（历史规划，见 `API.md`；示例不可调用） |
| `/api/analytics/event` | **v1.9.0 已删除**（死代码，与隐私承诺冲突） |

## 3. 设计系统规范

### 3.1 令牌单一来源
`prototype/assets/css/tokens.css` 是设计令牌的参考来源（色彩/字体/间距/圆角/阴影/动效）；实现阶段以 `app/globals.css` 与 `tailwind.config.ts` 为运行真值，两者须逐值对齐，禁止另行定义色板。

### 3.2 字体（离线构建硬约束）
- 无衬线/展示 `Archivo`（400–800）、代码/数字 `IBM Plex Mono`（400–600），均 latin 子集。
- **v1.13.3 起真自托管**：8 个 woff2 随仓库提交于 `app/fonts/`，由 `app/font-defs.ts` 经 `next/font/local` 注入（`display:'swap'`）；构建期**不访问** `fonts.gstatic.com`，离线 CI 可用。**禁止改回 `next/font/google`**（构建期联网，离线必失败）。
- CSS 变量分层：`--font-archivo` / `--font-plex-mono` 为中间变量；`--font-sans` / `--font-mono` 组合中文回退链（PingFang SC / Microsoft YaHei / system-ui）。禁止让 next/font 的 `variable` 与 `:root` 变量同名，否则中文回退链丢失。

### 3.3 色彩语义与色觉友好
- 品牌色 **棱镜靛 `#4b3df0`**（避开红绿混淆轴）；数据轴色 protan `#c9543a` / deutan `#4f7c46` / tritan `#3d6fb4`。
- 色觉友好模式 `[data-cvd-safe='on']`：改用蓝—青—琥珀（`#4b3df0` / `#0e8a99` / `#b25e00`）。
- 语义色（ok/warn/risk）必须**色彩 + 图标 + 文案**三重编码；深色模式由 `[data-theme='dark']` 覆盖。

### 3.4 动效与可达性
动效 `cc-rise` / `cc-fade` / `cc-pop`，统一缓动 `--ease`；尊重 `prefers-reduced-motion: reduce`（已全局降级）。语义化 HTML、ARIA、键盘可达、WCAG AA；主要容器与关键 DOM 加 kebab-case 语义 id（见 §8.1）。

### 3.5 趣味性设计规范（v1.4 应用侧落地）
> 目标：降低弃测率 + 提升报告传播性；**不做留存钩子**（成人色觉终身稳定，「复测提醒」制造焦虑，与去污名化冲突）。

**红线（硬约束）**：①答题中永不显示对错（进度点阵仅三态，逐题染色仅在结果页）；②不引入积分/排行榜/每日挑战；③趣味元素同样通过五种色觉模拟校验与三重编码；④称号去污名化（旅人隐喻），仅本机展示。

**功能清单（7 项）**：进度点阵仪式感、章末轻科普过渡、中性提交反馈（恒开）、色觉人格分享卡（Canvas）、换一双眼睛（4 种色觉视角）、三轴互动科普、「趣味体验」总开关（`cc.settings.v1.funMode`，默认开；关闭后人格化文案回退中性）。开关控制 #1/#2/#4/#5 文案与过渡，#3 恒开。

### 3.6 页脚版本号与构建号（v1.14.0 起规范）
- 页脚（`components/layout/Footer.tsx`，`id="app-footer"`）以单一 token 展示，格式固定 `V{版本号}· build {构建号}`：大写 `V`、版本号后**紧接** `·`（无空格）、再 ` build `、最后 10 位构建号。示例 `V1.17.4· build 2611121200`。
- 版本号直读 `package.json`（单一来源，禁止硬编码）；构建号为 **10 位 `yymmddhhmm`**，由 `next.config.mjs` 构建时按本地时间生成并注入 `NEXT_PUBLIC_BUILD_ID`（dev / build 均生效），缺失时回退版本号。
- **版本与构建号只在页脚展示，页眉禁止出现版本号**；不再展示更新日期（`SITE_UPDATED` 另有用途，见 §8.7）。

## 4. 原型契约（CC.* 全局 API）

原型以 `window.CC` 暴露自身逻辑，**仅作设计验证参考**；应用判读与绘制以 `lib/` 为权威（§6）。

- **数据层** `prototype/assets/js/data.js`：`CC.questions`（38 题）、`CC.typeLabel`、`CC.rules`、`CC.history`、`CC.overallLabel`/`typeText`/`severityText`/`modeText`、`CC.demoResult`/`demoAnswers`、`CC.hueCards`/`hueShuffled`、`CC.chapters`/`chapterOf`/`titles`/`dimScenes`、`CC.articles`、`CC.routes`；`app.js` 的 `CC.fun()`/`CC.setFun(on)`，分享卡 API 见 `sharecard.js`。
- **判读** `scoring.js`：`CC.scoreIshihara`、`CC.scoreHue`、`CC.scorePath`（原型命中比例，**与应用 `pathF1` 不同**，见 §6.6）、`CC.isCorrect`。
- **绘制与模拟** `ishihara.js`：`CC.renderPlate`、`CC.renderPathField`、`CC.simulate`（`kind ∈ none|protanopia|deuteranopia|tritanopia|achromatopsia`）。CVD 矩阵键名为完整名，非 `protan`/`deutan`/`tritan` 缩写。

## 5. 数据模型（权威定义）

> 结构说明以本节为准；**字段名、可选性与枚举以 `lib/types.ts` / `lib/storage.ts` 为最终真值**。早期命名 `IshiharaScoringResult` 已更名为 `IshiharaResult`，本节统一使用新名。

### 5.1 题库 `Question`
```ts
type PlateType = 'demonstration' | 'normal' | 'transformation'
               | 'vanishing' | 'hidden' | 'classification';
interface Question {
  id: string;          // 如 'ishihara-01'
  plate: number;       // 图版号
  type: PlateType;     // 类型定义保留 6 值；题库实际仅 demonstration / vanishing / normal(3 题)
  answer: string;      // 正常视觉应读数字
  protan: string;      // 预留字段：32 道消失题已清空；其余保留 = answer，不参与类型判读
  deutan: string;      // 同上
  difficulty: number;  // 难度等级
  quick: boolean;      // 是否纳入快速版
}
```
`timeLimit`/`suggestedTime`/`answerTritan?`/`inQuickSet` 均未实现；v1.13.0 起题库降级为消失型（详见 §6.1）。

### 5.2 答题记录 `AnswerRecord`
```ts
interface AnswerRecord {
  questionId: string;
  userAnswer: string;     // 原始输入，空串表示未作答
  durationMs: number;     // 作答用时（>0 有效）
}
```
`correct` 与 `expectedAnswer` 不持久化，判读时由 `isCorrect(q, ua)` 现场计算（§6.1）。

### 5.3 测试结果 `TestResult`
```ts
interface IshiharaResult {
  overall: OverallResult;
  type: DeficiencyType | null;
  severity: Severity | null;
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
  version: string;                  // 结果结构版本，当前 '1.9.0'
  createdAt: string;                // ISO8601
  testMode: TestMode;               // 实际字段名（非 mode / testType）
  overall: OverallResult;
  type: DeficiencyType | null;
  severity: Severity | null;
  confidence: number;               // 0–100
  durationMs: number;
  answers: AnswerRecord[];
  ishihara?: IshiharaResult;
  pathTracking?: PathTrackingResult[];   // v1.1
  hueArrangement?: HueArrangementResult;  // v1.2
  child?: ChildResult;                    // v1.7.9
  analysis: string;
  confidenceNote: string;
  device: string;
  scene?: 'general' | 'driver';     // v1.7，driver 隐藏趣味元素
  profileId?: string;               // v1.8.1，旧记录归默认档案
}
```
> **版本口径**：`TestResult.version` 是**结果结构版本**（当前 `1.9.0`），与**产品版本**（`VERSION` = `1.17.4`）不同，不得混用或同步修改。

### 5.4 本地存储（7 个扁平键，以代码为准）

| 键 | 数据 | 负责模块 | 说明 |
|----|------|----------|------|
| `cc.settings.v1` | `AppSettings` | `lib/storage.ts` | `theme: 'light' \| 'dark'`（无 `system` 主题）、`cvdSafe`、`funMode`（默认 true） |
| `cc.results.v1` | `TestResult[]` | `lib/storage.ts` | 最近 30 条，按 `createdAt` 倒序 |
| `cc.progress.v1` | 断点续测草稿 | `lib/storage.ts` | `{ mode, index, answers, startedAt }`，`saveProgress()` 直接写入，**无防抖** |
| `cc.lang.v1` | `Lang` | `lib/i18n/lang.ts` | `'zh' \| 'zh-TW' \| 'en'` |
| `cc.profiles.v1` | `Profile[]` | `lib/profile.ts` | 昵称 / emoji / 关系 / 创建时间 |
| `cc.activeProfile.v1` | 当前档案 ID | `lib/profile.ts` | 旧记录缺失时归默认档案 |
| `cc.batch.v1` | `BatchSubject[]` | `app/test/batch/page.tsx` | 批量检测名单，页面直接读写（`try/catch`） |

核心结果 / 设置 / 进度经 `safeSet` 降级写入；批量名单由页面直接读写。无 `LocalStorageData` 聚合结构、无 `analyticsEnabled`、无 `UserSettings`（均属未实现规划）。

### 5.5 枚举别名（代码为准）
代码使用 `DeficiencyType` / `Overall` / `Severity`（`lib/types.ts`）；分册若使用 `ColorDeficiencyType` / `OverallResult` / `SeverityLevel`，语义一致但**不得另起新别名**：
```ts
type DeficiencyType = 'protanopia' | 'protanomaly' | 'deuteranopia'
                    | 'deuteranomaly' | 'tritanopia' | 'tritanomaly' | 'achromatopsia'
                    | null;
type Overall = 'normal' | 'suspected_deficiency' | 'suspected_blindness' | 'inconclusive';
type Severity = 'mild' | 'moderate' | 'severe' | null;
type TestMode = 'quick' | 'standard' | 'advanced' | 'child';
```

### 5.6 分析事件 `AnalyticsEvent`（历史设计，已废止）
> **v1.9.0 起废止**：`/api/analytics/event` 与 `reportServerEvent()` 已删除（死代码且与隐私承诺冲突）。当前除 GA4 `pageview` 外无任何服务端上报。事件名字段集曾有多个版本（`page_view`/`cta_click`/… 与 `test_start`/`report_export`/… 并存），均不再适用；本节仅留历史记录，不得据此实现新接口。

### 5.7 信号灯辨识（结果不计入 `TestResult`）
```ts
type SignalTaskKind = 'light' | 'meaning';   // 辨色 / 信号含义识别
interface SignalTask {
  id: string; kind: SignalTaskKind;
  prompt: string; promptEn: string;          // 简/英题干，繁体回退简体
  color?: string;                            // meaning 题留空
  options: { label: string; labelEn: string; value: string }[];
  answer: string;
}
interface SignalTestResult {
  overall: 'pass' | 'fail'; correct: number; total: number;
  colorOk: boolean; tasks: { id: string; userAnswer: string; correct: boolean }[]; note: string;
}
```
题库 9 题（6 辨色 + 3 含义）；结果仅会话内展示，不持久化、不进历史、不进入 `TestResult`。

## 6. 判读算法（权威，以 `lib/*-scoring.ts` 实现为准）

> **实现真值：`lib/scoring.ts` 等；原型 `prototype/assets/js/scoring.js` 仅参考。** 当前题库的判读能力已退化，务必先读 §6.1 与 §6.4 的能力边界。

### 6.1 正确性判定
`lib/questions.ts` 38 题仅用 `demonstration` / `vanishing`（含 3 题 `normal`），无 `transformation` / `classification` / `hidden`；32 道消失题的 `protan` / `deutan` 已清空。故所有依赖转换/分类/隐藏题的分支**当前不可达**，保留仅为兼容旧题库：
- `hidden` 题：空答案为正确（兼容分支，不可达）；
- 其余题：空答案 = false，否则 `ua === q.answer`。

### 6.2 维度评分
```
wrong = total - correct
base  = round(min(100, (wrong/total) * 130))
protan = clamp(base + protanHit*8 - deutanHit*3, 0, 100)
deutan = clamp(base + deutanHit*8 - protanHit*3, 0, 100)
tritan = round(base * 0.35)   // 推算值，非独立测量
```
`protanHit` / `deutanHit` 为转换/分类题中命中对应异常典型值的计数，**当前题库下恒为 0**，故 `protan === deutan === base`，`tritan ≤ 35`。

### 6.3 总体结论（双口径，勿混用）
- `wrongRate = wrong / Math.max(answered, 1)`（`wrong = Math.max(total - correct, 0)`，未作答计入错）用于总体结论；
- `rate = wrong / Math.max(total, 1)` 用于程度判定。

```
if answered < total*0.5                          → inconclusive
else if vanishWrong >= 4 || wrongRate >= 0.6     → suspected_blindness
else if vanishWrong >= 2 || wrongRate >= 0.3
        || hiddenRight >= ceil(hiddenTotal/2)    → suspected_deficiency  // hidden 分支不可达
if demoWrong>0 && protanHit===0 && deutanHit===0 && wrongRate < 0.3
                                                 → inconclusive
```

### 6.4 类型与程度（能力边界）
- **未分型优先（v1.15.1）**：`protanHit === 0 && deutanHit === 0` → `type = null`；非异常结论的 `severity` 同为 `null`。
- 有命中时：`deutanHit >= protanHit` 选 deutan 轴，否则 protan；`suspected_blindness` → `*opia`，`suspected_deficiency` → `*anomaly`。
- 程度：`rate >= 0.7` 重度，`>= 0.4` 中度，否则轻度。
- **硬约束**：当前两命中数恒 0，`type` 恒 `null`。**本项目不能可靠区分红 / 绿 / 蓝黄异常类型**；所有用户文案（结果、FAQ、模式、科普、README）不得宣称可区分类型或列出转换/隐藏/分类题；`tritan` 不得解释为独立蓝黄测量结果。

### 6.5 置信度
```
confidence = 100 + demoWrong*(-25) + fastCount*(-2)
           + (protanHit>0 && deutanHit>0 ? -15 : 0)   // 矛盾模式，当前不可达
           + (answered < total*0.5 ? -20 : 0)
clamp(confidence, 0, 100)
```
演示题扣分值以 `-25` 为准（非早期 `-20`）；四因子为演示题错 / 快速作答 / 矛盾 / 覆盖不足。

### 6.6 辅助评分
- 路径重合：应用侧为 **`pathF1`**（F1 重合度，`lib/path-scoring.ts`，弧长等距重采样，`TOL=0.07`），**非 IoU、非原型 `CC.scorePath` 的命中比例 ×100**。
- 色相排列：相邻位置偏差求和（首末 `max(0,d-1)`，中间 `max(0,d-1)*2`），`TES < 20` 判正常。

### 6.7 信号灯判读
逐题比对 `userAnswer === answer`；light 类须全对才 `colorOk = true`，`overall = colorOk ? 'pass' : 'fail'`；meaning 类错误反映认知，计入 `correct` 但不否决 `colorOk`。结果不持久化（§5.7）。

## 7. 隐私与合规基线（摘要，详见 `PRIVACY.md`）
- 纯前端、localStorage 存储；**无强制登录、无 PII 上传、无服务端状态**。
- 提供数据导出与删除入口；**v1.5.1 起仅 GA4 匿名访问统计**（衡量 ID 见 `lib/analytics.ts`，仅生产加载，不含检测内容与 PII）；`analyticsEnabled` 服务端上报从未实现且已删除（§5.6）。
- 结果页 / 科普页显著标注「筛查工具，非医疗诊断」；`/privacy` 路由必须上线。
- 远期服务端规划（账号 / 云同步 / 服务端日志）在 `ARCHITECTURE.md` §4.2、§9.3 中均标注为**未实现规划**，不得当作现状。

## 8. 代码与文档治理

### 8.1 编码与命名
- 组件 `PascalCase`，hooks/工具 `camelCase`（`useX`），配置/常量 `SCREAMING_SNAKE_CASE`，CSS 与 DOM id `kebab-case`。
- 关键逻辑加中文注释；TS `strict` 避免 `any`；正确捕获 Promise 异常；无 `console.log` / `debugger` / 密钥泄露 / XSS。
- **主要容器与关键 DOM 必须有语义化 id**：以代码实况为准，如 `app-header`（`Navbar.tsx`）、`app-footer`（`Footer.tsx`）、`main-content`、`history-page`、`privacy-page`、`result-summary`。禁止 `div1` / `box` 等无意义命名。
- 源文件单文件 **≤200 行**须按职责拆分（仅代码文件；`.md` 文档不拆分，保持完整）。

### 8.2 版本管理
- **单一来源**：`VERSION` + `package.json` + `package-lock.json` 的 `version` 字段（以 `VERSION` 实时值为准）。每次修改 bump 最小版本（patch；新功能 minor；破坏性 major）。
- 发版同步清单：`VERSION` / `package.json` / `package-lock.json` → `CHANGELOG.md` 新增版本节 → README 版本徽章 → 全部 docs 分册「实现状态」行与「文档版本」表 → 实际被改源码文件头注释。若目标版本节已存在则**追加**，勿新建重复节。
- 源码头注释统一 `// chromacheck vX.Y.Z`（个别配置文件用 `// <文件名> vX.Y.Z`）；**仅被改动文件更新，禁止全仓库批量刷写**。
- 原型文件头为 v0.1.x（内部迭代号，与产品版本解耦，不随发版刷写）。

### 8.3 文档结构与维护
- 16 份文档（1 总纲 + 15 分册，见 §0.2，v1.17.4 标准化）；每份顶部含路径与版本、实现状态声明、负责人（当前多为 `—`，待补实）。
- 变更须记录 `CHANGELOG.md`；分册冲突以本 SPEC 裁决，并同步修订分册。
- **任务单一来源（硬约束，永久遵循）**：所有未完成 / 待验证 / 计划实施的任务只写入 `docs/tasks.md`，其他任何位置（README、CHANGELOG、ROADMAP、各分册、`tasks-done.md`、源码注释等）不得维护第二份任务清单。发现「待办 / TODO / 待验证 / 待实施 / 规划中 / 未闭环 / 待决策」等任务型表述时：先登记到 `docs/tasks.md`，原位置只保留问题证据与方案正文并链接到任务清单；迁移完成后删除冗余任务文档。
- 已完成项移入 `docs/tasks-done.md`（仅作归档，不维护状态）。

### 8.4 测试与质量门禁
- Vitest（v1.7.6 落地，当前 **15 文件 107 例**）：`lib/*.test.ts` 覆盖判读、存储、格式化、导出导入、分享卡、SEO 等；`npm test` = `vitest run`，`npm run test:coverage` 走 `@vitest/coverage-v8`。
- 测试环境为 node（`vitest.setup.ts` 注入内存 Storage，无 jsdom/happy-dom）；Canvas 绘制不可单测（仅 `computeRadar` 有覆盖），勿强行加 jsdom。组件测试未落地；Playwright 配置与主链路用例已提供，但依赖 / 脚本 / CI 接入待验。
- CI（`.github/workflows/ci.yml`）：Node 22 LTS、checkout / setup-node v5、`npm install`（无 `cache`），跑 type-check + lint + build + test（e2e 安全跳过）。
- **安全响应头唯一真值为 `next.config.mjs`**（§8.7 之外亦适用）：CSP（开发态额外放行 `'unsafe-eval'`）、X-Frame-Options、X-Content-Type-Options、Referrer-Policy、Permissions-Policy。

### 8.5 语言与国际化（v1.15.0 起三语）
- **优先级**：默认**简体中文**（`zh`）> **繁体中文**（`zh-TW`，台湾用语）> **英语**（`en`）。`lib/i18n/lang.ts` 的 `LANGS` 顺序即优先级，设置面板按此渲染。
- **字典结构**：`zh-*.ts`（基准）/ `tw-*.ts` / `en-*.ts` × core / faq / ui / ui.flow / ui.guide / ui.result / result 七组；`DictKey = keyof ZH`，繁英受 TS 编译期完整性校验；`t()` 缺键回退简体。文件前缀 `tw-` 与 Lang 值 `zh-TW` 并存，属约定非冲突。
- **偏好与 html lang**：存 `cc.lang.v1`；`htmlLang()` 映射 `zh-CN` / `zh-TW` / `en`。
- **SSR metadata / JSON-LD / llms*.txt / 首页事实块恒为简体**（§8.7），不随客户端切换。
- **内容型边界**：科普、隐私长文、信号灯题库、儿童图形标签为简/英双语，繁体回退简体；界面文案三语全量覆盖。
- **验收项（跨分册共用）**：三语切换、`cc.lang.v1` 持久化与枚举校验、`htmlLang()` 映射、缺键回退简体、繁体台湾用语（設定/搜尋/網格/檔案/複製/匯入）。

### 8.6 发布流程（v1.16.0 起）
- `push` 到 `main` 且 `build-and-test` job 全绿后，`release` job（`needs: build-and-test`）自动发布；PR 与非 push 事件不触发。
- 版本取 `VERSION`（`v{VERSION}` 作 tag 与标题），三源一致，workflow 不硬编码版本号；同名 tag 已存在则跳过（幂等）。
- release notes 从 `CHANGELOG.md` 当前版本节提取，空则回退占位；tag 指向全绿 commit；权限仅 `contents: write`，使用内置 `github.token`。部署由 Vercel 独立承接。

### 8.7 SEO / GEO 规范（v1.17.0 起）
- **路由单一数据源**：`lib/seo-routes.ts` 的 `SEO_ROUTES` 是全部可索引 URL 唯一清单；`sitemap.ts` / `llms.txt` / `llms-full.txt` / `robots.ts` 均由此派生。新页面须先登记；私有页（`/result/`、`/history/`、`/test/batch/`、`/offline`）不登记且 noindex。
- **sitemap**：`lastModified` 取 `SITE_UPDATED`（内容审阅日期），**禁止用构建时间**；该常量同时用于 `llms*.txt`、`app/learn/[slug]` 的 Article 日期与隐私页「最后更新」，非仅隐私页。
- **metadata 与社交图**：根布局统一 `metadataBase` / 模板 / robots / OG / twitter；社交图必须为静态 PNG（`public/og-default.png`，1200×630），禁用 SVG 与运行时图像生成。站点验证令牌仅由 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_BING_SITE_VERIFICATION` 注入（另 `NEXT_PUBLIC_GA_ID` 为统计 ID；`NEXT_PUBLIC_BUILD_ID` 由构建注入）。
- **结构化数据**：根布局 WebApplication + WebSite + Organization 以 `@id` 互链；首页 FAQPage、科普 Article + BreadcrumbList、栏目页 BreadcrumbList；`components/seo/JsonLd.tsx` 的 `safeJson()` 必须转义 `< > &` 与 U+2028/U+2029（v1.17.0 修复历史 no-op）。
- **GEO 资产**：`/llms.txt` 主索引、`/llms-full.txt` 全文索引，均 `force-static`、`text/plain; charset=utf-8`，在 `<head>` 与根 `other` 声明；`SITE_FACTS` 为关键事实唯一来源。
- **AI 抓取与边界**：`robots.ts` 显式放行 GPTBot / CCBot / ClaudeBot / PerplexityBot / Google-Extended / Applebot-Extended，私有路径 disallow；无语言化 URL 故不输出 hreflang；验证令牌与域名由部署方确认。
- `lib/seo.test.ts` 对 URL 集合、事实文案、robots 与 `safeJson` 做回归断言。

## 9. 实现状态与待办
- **已完成**：见 §0.3 分类清单与 `CHANGELOG.md`（v1.0 → v1.17.4 逐版本记录）；历史里程碑细节以 CHANGELOG 为准，本节不重复枚举。
- **待办**：见 `docs/tasks.md`（唯一来源，当前 O-01 ~ O-11 / V-01 ~ V-07）；历史收口见 `docs/tasks-done.md`。
- **当前限制（非待办但需知悉）**：判读未分型（§6.4）、组件测试未落地、E2E 配置 / 用例待验收、内容型文案繁体回退简体、无服务端 API / 账号 / 云同步、本地 `next build` 可能受 IDE 安全删除护栏拦截（CI 不受影响）。

---
*本文档为 ChromaCheck 权威规范总纲 v1.17.4。分册应据本规范修订；冲突时以本规范为准。*
