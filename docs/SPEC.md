<!-- ./SPEC.md v1.17.0 — ChromaCheck 项目规范总纲（单一事实来源） -->
<!-- 地位：本规范为权威总纲。当与各分册（PRD/ARCHITECTURE/API/DATA-SPEC/DEPLOYMENT/TESTING/CONTRIBUTING/PRIVACY/ROADMAP）冲突时，以本规范为准。 -->
<!-- 实现状态：Next.js 14 应用已落地——石原氏检测（38板）、路径追踪、色相排列 D15、进阶联合、信号灯专项、趣味性体验包、结果/历史/科普/隐私、首页 FAQ 双栏问答（12 条）、GA4 匿名统计、SEO/GEO、Vitest 测试套件（15 文件 107 例）；原型仅作设计验证参考。当前版本 v1.17.0。 -->

# 色辨 ChromaCheck 项目规范（SPEC）

> 本文档整合 `docs/` 下各分册与原型（`prototype/`）的真实事实，作为后续实现的**单一事实来源（Single Source of Truth）**。
> 各分册为本文档的子主题细化，若与本文档冲突，以本文档为准；分册应据本文档持续修订。

## 0. 文档关系与实现状态

| 文档 | 角色 | 状态 |
|------|------|------|
| `./SPEC.md`（本文件） | **权威总纲**：产品/架构/数据/算法/设计/合规/治理 | 生效 |
| `./PRD.md` | 产品需求分册 | 已对齐 SPEC，生效 |
| `./ARCHITECTURE.md` | 架构分册 | 已对齐 SPEC，生效 |
| `./API.md` | 事件/分析 API 分册 | 已对齐 SPEC，生效 |
| `./DATA-SPEC.md` | 数据结构分册 | 已对齐 SPEC，生效 |
| `./DEPLOYMENT.md` | 部署分册 | 已对齐 SPEC，生效 |
| `./TESTING.md` | 测试分册 | 已对齐 SPEC，生效 |
| `.github/CONTRIBUTING.md` | 贡献约定分册（已归位 .github/） | 生效 |
| `./PRIVACY.md` | 隐私政策分册 | 已对齐 SPEC，生效 |
| `./ROADMAP.md` | 路线图分册 | 已对齐 SPEC，生效 |

**实现状态声明（必须写入各文档顶部）**：ChromaCheck 已完成 v1.0 实现并持续迭代至 v1.17.0——Next.js 14 应用 + 石原氏检测（38 板）+ 结果/历史/科普/隐私页均已落地，`npm install / npm run dev / npm run build / npm test`（Vitest）均可正常执行（见 README「快速开始」）。路径追踪（F4）已于 v1.1 实现，色相排列（F5）已于 v1.2 实现，进阶联合判读（advanced）已于 v1.3 实现，趣味性体验包已于 v1.4 实现，38 板完整图谱已于 v1.5 实现，GA4 匿名统计已于 v1.5.1 接入，SEO/GEO 已于 v1.6.0 完善，驾驶员场景专项已于 v1.7.0 落地，Vitest 测试套件已于 v1.7.6 引入；v1.10.0 设置面板、v1.11.0 FAQ 手风琴、v1.11.1 i18n 字典子模块化、v1.11.2 引入 package-lock.json 与 SEO metadata 补齐、v1.12.0 无障碍走查与测试覆盖优化（Vitest 15 文件 107 例）及反模式清理均已落地；v1.13.0 修正色觉检测科学性问题（二色觉模拟矩阵改为秩-2 投影、路径追踪等亮度混淆配色、D15 色卡与色相远端固定卡、题库题型降级为消失型、科普文案对齐）已落地；v1.13.2 首页 FAQ 改为双栏布局（简介吸附侧栏 + 受控手风琴）并将问答扩充至 12 条已落地；v1.13.3 CI 升级 Node 22 LTS 与 checkout / setup-node v5（消除 Node 20 弃用告警）已落地；v1.13.4 历史页内联样式收敛（R8a）与 TestRunner 复用 IshiharaFlow 消除答题流程重复 JSX（R8b）已落地；v1.14.0 石原氏检测支持实体键盘输入数字（全局 keydown 监听，输入框聚焦时交由原生处理，未聚焦时数字键 / 退格 / 回车路由到作答）与页脚版本号/构建号展示规范化（格式 `V{ver}· build {yymmddhhmm}`，10 位构建号由 next.config.mjs 注入 NEXT_PUBLIC_BUILD_ID）已落地；v1.14.2 对 SPEC + 8 个分册 + TASKS/tasks-done + README/CHANGELOG + `.github/` 文档做全量校订（工程事实、字体/CSP、判读权威、测试口径、数据结构、路由与交叉引用对齐现行代码）已落地；v1.15.0 界面语言升级为三语（简体中文默认 > 繁体中文 > 英语，规范见 §8.5）已落地；v1.15.1 判读类型退化输出收敛已落地；v1.16.0 GitHub Releases 自动发布（全绿后 release job，规范见 §8.6）已落地；v1.16.1 文档全面校订（CI 描述、判读未分型口径、三语架构补记、发版流程入 CONTRIBUTING）已落地；v1.16.2 全量文档审查（目录结构、接口签名、存储键、判读口径与格式统一）已落地；v1.16.3 首页 FAQ 移除延伸阅读入口、页脚移除「开始检测」并让描述单行显示已落地；v1.17.0 SEO/GEO 完善（路由单一数据源、llms-full.txt、站点级结构化数据、PNG 社交图与回归测试）已落地；原型仅作设计验证参考。

## 1. 产品定位与功能范围

### 1.1 目标与用户
在线色觉筛查 Web 应用，提供石原氏测试、结果解读、历史记录与科普。定位为**筛查与科普工具，非医疗诊断**。核心用户：怀疑自身/家人有色觉异常者、职业体检前自查者、科普读者。

### 1.2 功能范围（v1.0）
遵循 ROADMAP §2.2 的边界，明确 v1.0 交付范围，**覆盖 PRD 与 ROADMAP 的冲突**：

- **纳入 v1.0（核心）**：首页、检测前指引、模式选择、石原氏测试、结果页、历史记录、科普列表与详情、**隐私政策页**（PRIVACY §6 要求，补入 PRD 功能架构）、结果导出（PDF/图片）、结果分享。
- **排除 v1.0（推迟至 v1.1+）**：路径追踪测试（F4）、色相排列测试（F5）。二者已在原型中作演示，但 v1.0 不实现正式模块。（路径追踪已于 v1.1 实现，色相排列已于 v1.2 实现）

检测模式：`quick`（快速，10 题）/ `standard`（标准，38 题）/ `advanced`（进阶联合，v1.3 实现）/ `child`（儿童图形识别，v1.7.9 实现；见 `lib/types.ts` 的 `TestMode`）。

- **信号灯辨识（驾驶场景专项，已实现）**：独立路由 `/test/signal`，模拟路口与夜间行车的红/绿/黄信号辨色与信号含义识别。与 `TestMode` 枚举**解耦**——其结果为瞬时判读，不计入 `TestResult`、不写入历史，仅作驾驶场景参考（详见 §5.7 / §6.7）。

## 2. 技术架构（v1.0 已实现）

> 本节描述 v1.0 实际落地的技术栈与目录结构，与真实实现一致（详见 README §技术栈）。

### 2.1 技术栈与选型
- 框架：**Next.js 14（App Router）+ TypeScript（strict）**。
- 样式：**Tailwind CSS + 设计令牌（CSS 变量，支持深色与色觉安全模式）**。
- 图表：**内联 SVG（自绘维度条形图）**，不引入图表库。
- 导出：**Canvas（PNG）+ `window.print()`（PDF）**，不引入重型依赖。
- 状态/存储：React 状态 + `localStorage`（隐私优先，无服务端状态）。

### 2.2 目录结构（v1.7 已实现）
```
app/              # Next.js App Router：/ /guide /test /offline /privacy
                  # /test/ishihara/[mode] /test/path-tracking/[mode] /test/hue-arrangement/[mode]
                  # /test/advanced /test/signal /test/batch /test/child
                  # /result/[id] /history /learn /learn/[slug] /not-found
                  # + robots.ts sitemap.ts llms.txt/route.ts globals.css icon.svg
components/       # 按域：common/ home/ layout/ result/ test/ analytics/ seo/
lib/
  types.ts        # 全局类型（以本文档 §5 为权威）
  questions.ts    # 石原氏题库（38 题，v1.5 扩充）
  questions/      # 专项题库子目录：hue-arrangement.ts / path-tracking.ts / signal.ts / child.ts
  scoring.ts      # 石原氏判读引擎 + scoring-text.ts（判读文案）
  hue-scoring.ts  # 色相排列 D15 判读（TES）
  path-scoring.ts # 路径追踪判读（pathF1，F1 重合度，非 IoU）
  signal-scoring.ts # 信号灯辨识判读
  advanced-scoring.ts # 进阶联合交叉验证判读
  ishihara.ts     # 石原氏点阵生成 + CVD 模拟 + path-field.ts（路径字段）
  storage.ts      # localStorage 读写（safeSet 降级 + 运行时校验）
  learn-data.ts   # 科普文章数据
  fun.ts          # 趣味性数据（章节/称号/三轴科普）
  sharecard.ts / sharecard-canvas.ts  # 色觉人格分享卡 Canvas
  report-canvas.ts # 报告 PNG 绘制
  analytics.ts    # GA4 衡量 ID 与 pageview 上报
  license.ts      # 驾照辨色力合规映射（172 号令）
  site.ts         # SITE_URL 单一来源
  format.ts       # 格式化工具
  *.test.ts       # Vitest 单测（scoring/hue/path/signal/advanced/storage）
```
> 原型 `prototype/assets/js/*.js` 中的纯逻辑（scoring/data/ishihara）已作为 `lib/` 实现的**参考真值**完成移植；v1.7.5 起原型判读已反向对齐应用实现（见 `.codebuddy/memory/MEMORY.md`）。

### 2.3 运行形态
纯前端、客户端渲染为主；无强制登录、无 PII 上传、无传统后端（与 PRD「隐私优先」一致）。**不承诺服务端并发能力**——PRD §4.1「支持 1000 并发用户」与纯前端架构矛盾，予以作废，改为「静态托管可水平扩展」表述。

## 3. 设计系统规范

### 3.1 令牌单一来源
**`prototype/assets/css/tokens.css` 是设计令牌的单一来源**（色彩/字体/间距/圆角/阴影/动效）。实现阶段的 Tailwind 主题配置（`tailwind.config`）必须逐值映射该文件，禁止另行定义一套色板。

### 3.2 字体
- 无衬线/展示：`Archivo`（400/500/600/700/800）；代码/数字：`IBM Plex Mono`（400/500/600）。均为 latin 子集。
- **v1.13.3 起真自托管**：8 个 woff2 随仓库提交于 `app/fonts/`（来源 `@fontsource`），由 `app/font-defs.ts` 经 `next/font/local` 注入（`display:'swap'`）。构建期**不访问** `fonts.gstatic.com`，EdgeOne / CI 等离线环境亦可用。此前 `next/font/google` 虽称自托管，实则构建期仍需联网拉取字体，离线会失败：`TypeError: Cannot read properties of null (reading '1')`。
- CSS 变量分层：`font-defs.ts` 暴露中间变量 `--font-archivo` / `--font-plex-mono`；`globals.css` 的 `--font-sans` / `--font-mono` 用 `var(--font-archivo, 'Archivo')` 组合中文回退链（PingFang SC / Microsoft YaHei / system-ui）。**禁止**让 next/font 的 `variable` 与 `:root` 同名，否则两者作用于同一元素相互覆盖、中文回退链丢失。

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

### 3.5 趣味性设计规范（v0.1 原型已实现；v1.4 应用侧落地）

> 目标：降低弃测率 + 提升报告传播性；科普为加分项。**明确不做留存钩子**（成人色觉终身稳定，「复测提醒」会暗示色觉恶化、制造焦虑，与去污名化原则冲突）。

**红线（硬约束）**
1. **答题中永不显示对错**——任何对错暗示都会污染后续答题与判读数据。进度点阵只表达「已完成 / 当前 / 未到」三态；逐题明细的对错染色仅允许出现在结果页。
2. **不引入积分/排行榜/每日挑战**——刷分会诱导乱答，损害判读数据可信度。
3. **无障碍零豁免**——趣味元素同样通过五种色觉模拟校验、遵循「状态不靠颜色」三重编码、尊重 `prefers-reduced-motion`。
4. **称号去污名化**——旅人隐喻（如「全谱旅人」「森林色偏航的旅人」），仅本机展示，不默认公开。

**功能清单（7 项，均受「趣味体验」开关控制¹）**

| # | 功能 | 位置 | 说明 |
|---|------|------|------|
| 1 | 进度点阵仪式感 | 答题页 | 圆点数与题目总数一致（快速 10 / 标准 38，`components/test/FunBits.tsx`）；每完成 8 题触发脉冲 + 「已完成 {a} / {t} 版」轻提示 |
| 2 | 章末轻科普过渡 | 答题页 | 题型分 3 章（热身/主体/深水），章节交替处插入过渡卡（`lib/fun.ts` 的 `CHAPTERS`），回车或按钮继续 |
| 3 | 中性提交反馈 | 答题页 | 提交后「✓ 已记录」+ 420ms 缓冲（¹恒开，不随开关关闭） |
| 4 | 色觉人格分享卡 | 结果页 | Canvas 手绘（`lib/sharecard-canvas.ts`）：雷达 + 称号 + 三轴条，本地 `toDataURL` 导出 PNG，零依赖 |
| 5 | 换一双眼睛 | 结果页 | 第 4 版（答案 29，消失型题）正常 + 4 种色觉视角切换，复用 `components/test/IshiharaPlate` 的 `cvd` 参数（取值对应 `lib/ishihara.ts` 的 `DICHROMAT` 键） |
| 6 | 三轴互动科普 | 结果页 | 点维度条展开日常生活影响（`lib/fun.ts` 的 `DIM_SCENES`），`aria-expanded` 状态可键盘操作 |
| 7 | 「趣味体验」总开关 | 设置面板 | 导航栏「设置」模态；`localStorage` 键 `cc.settings.v1` 的 `funMode` 字段，默认开；关闭后称号/人格化文案回退中性措辞 |

¹ 开关控制范围：称号与人格化文案（#4/#5 之外的文案）、章末过渡（#2）、里程碑仪式感（#1）。中性反馈（#3）属于基础体验，恒开。

### 3.6 页脚版本号与构建号（v1.14.0 起规范）
- 页脚（`components/layout/Footer.tsx`）以单一 token 展示版本与构建号，格式固定为 `V{版本号}· build {构建号}`：大写 `V`、版本号后紧接 `·`（无空格）、再 ` build `（空格-英文 build-空格）、最后 10 位构建号。
- **版本号直读 `package.json`**（单一来源），禁止硬编码；展示示例 `V1.14.1· build 2611061430`。
- **构建号为 10 位 `yymmddhhmm`**（2 位年份 + 月日时分），由 `next.config.mjs` 在**构建时**按构建机本地时间生成并注入 `NEXT_PUBLIC_BUILD_ID`（Next 自动暴露客户端）；`dev` / `build` 均生效，无需手工维护、杜绝版本/构建号脱节。缺失（如本地未注入）时回退为版本号。
- 页脚其余文案（`© {年}`、品牌名、用途 `footer.purpose`）保持原样，不随版本/build token 改动。

## 4. 原型契约（CC.* 全局 API）

原型以 `window.CC` 命名空间暴露原型自身逻辑，仅作设计验证参考；应用判读与绘制以 `lib/` 为权威实现（见 §6）。

### 4.1 数据层 `prototype/assets/js/data.js`
- `CC.questions`：石原氏题库（38 题）。
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

### 4.2 原型判读引擎 `prototype/assets/js/scoring.js`（设计验证参考）
- `CC.scoreIshihara(answers, questions)` → `IshiharaScoringResult`。
- `CC.scoreHue(order)` → 色相排列 TES 结果。
- `CC.scorePath(userPath, standardPath, tolerance?)` → 路径重合度（0–100，默认容差 0.055）。
- `CC.isCorrect(q, userAnswer)` → 布尔。

### 4.3 绘制与模拟 `prototype/assets/js/ishihara.js`
- `CC.renderPlate(opts)`：生成石原氏点阵检测图。
- `CC.renderPathField(opts)` → `{ W, H, path }`（`path` 为归一化坐标数组，用于 `scorePath` 重合度计算）。
- `CC.simulate(hex, kind)`：色觉模拟（Viénot-Brettel 近似），`kind ∈ none|protanopia|deuteranopia|tritanopia|achromatopsia`。

## 5. 数据模型（权威定义）

> 本节为数据结构的**唯一权威**，解决 PRD §6 与 DATA-SPEC §2/§4/§5/§6 的字段与枚举冲突；历史决议曾以原型字段为参考，现行字段名与枚举一律以下述实现权威为准。
>
> **实现权威**：字段名、可选性与枚举以 `lib/types.ts` / `lib/storage.ts` 为最终真值；本节为结构说明，个别早期命名（如 `IshiharaQuestion`、`IshiharaScoringResult`）已在实现中分别更名为 `Question`、`IshiharaResult`。

### 5.1 题库 `Question`（`lib/types.ts`）
```ts
type PlateType =
  | 'demonstration' | 'normal' | 'transformation'
  | 'vanishing' | 'hidden' | 'classification';
interface Question {
  id: string;          // 如 'ishihara-01'
  plate: number;       // 图版号
  type: PlateType;     // 6 值枚举；题库实际仅用 demonstration / vanishing（另含 3 题 normal）
  answer: string;      // 正常视觉应读数字
  protan: string;      // 预留字段：32 道消失题已清空；演示题/常规题保留与 answer 相同的值，不参与类型判读
  deutan: string;      // 预留字段：32 道消失题已清空；演示题/常规题保留与 answer 相同的值，不参与类型判读
  difficulty: number;  // 难度等级
  quick: boolean;      // 是否纳入快速版
}
```
**决议**：PRD 的 `timeLimit`/`suggestedTime`、DATA-SPEC 的 `answerTritan?`/`inQuickSet` 均未实现；v1.13.0 起题库统一降级为消失型，不再有转换 / 隐藏 / 分类题（详见 §6 实现现状）。

### 5.2 答题记录 `AnswerRecord`
```ts
interface AnswerRecord {
  questionId: string;
  userAnswer: string;     // 用户原始输入（空串表示未作答）
  durationMs: number;     // 作答用时（>0 有效）
}
```
**决议**：`correct` 与 `expectedAnswer` 不持久化在 `AnswerRecord` 中——判读时由 `isCorrect(q, ua)` 现场计算（见 §6.1），避免冗余字段与判读规则漂移。

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
  version: string;                  // 结果结构版本，当前 '1.9.0'
  createdAt: string;                // ISO8601 完成时间
  testMode: TestMode;               // 实际字段名（非 mode）
  overall: OverallResult;
  type: ColorDeficiencyType | null;
  severity: SeverityLevel | null;
  confidence: number;               // 0–100
  durationMs: number;               // 作答总时长
  answers: AnswerRecord[];          // 逐题作答（含 userAnswer/durationMs）
  ishihara?: IshiharaScoringResult; // 石原氏判读输出（纯路径追踪测试为 undefined）
  pathTracking?: PathTrackingResult[];   // v1.1 路径追踪
  hueArrangement?: HueArrangementResult;  // v1.2 色相排列 D15
  child?: ChildResult;              // v1.7.9 儿童图形识别
  analysis: string;                 // 文字解读
  confidenceNote: string;           // 置信度说明
  device: string;                   // 设备/UA 摘要
  scene?: 'general' | 'driver';     // v1.7 检测场景；driver 隐藏趣味元素
  profileId?: string;               // v1.8.1 归属档案；旧记录缺失时归默认档案
}
```
**决议**：采用 DATA-SPEC 结构（`testMode` + `ishihara` 内聚 `correctCount`），废用 PRD 顶层 `correctCount` 与 `testType` 命名。`pathTracking`/`hueArrangement`/`scene` 均为可选扩展字段，结果页与历史按测试类型守卫渲染。

### 5.4 本地存储（以 `lib/storage.ts` 实现为准）
> 实际落地：共 **6 个**扁平 `localStorage` 键（`lib/storage.ts` 3 个 + `lib/i18n/lang.ts` 1 个 + `lib/profile.ts` 2 个），不聚合为单一 `LocalStorageData` 对象；无用户账号、无 PII、无分析开关。

```ts
interface AppSettings {            // 键 cc.settings.v1
  theme: 'light' | 'dark';        // 含深色；'system' 由 ThemeProvider 解析，不持久化
  cvdSafe: boolean;               // 色觉安全模式开关
  funMode: boolean;               // v1.4 趣味体验开关（称号/章末过渡/里程碑仪式感），默认 true
}
// 键 cc.results.v1        → TestResult[]（保留最近 30 条，按 createdAt 倒序）
// 键 cc.progress.v1       → { mode: TestMode; index: number; answers: AnswerRecord[]; startedAt: number }
// 键 cc.lang.v1           → Lang（'zh' | 'zh-TW' | 'en'，lib/i18n/lang.ts）
// 键 cc.profiles.v1       → Profile[]（昵称 / emoji / 关系 / 创建时间，lib/profile.ts）
// 键 cc.activeProfile.v1  → 当前档案 ID
```
**决议**：DATA-SPEC 的 `UserSettings{theme: 'light'|'dark'|'system'; analyticsEnabled}`、`HistorySummary`、`LocalStorageData` 聚合结构与代码不符。采用上述扁平结构；`system` 主题与 `analyticsEnabled` 服务端上报留作 v1.1 规划。`funMode` 已于 v1.4 落地（键 `cc.settings.v1` 内字段，非独立 localStorage 键）。

### 5.5 枚举（统一别名，供全局复用）
```ts
type ColorDeficiencyType =
  | 'protanopia' | 'protanomaly' | 'deuteranopia'
  | 'deuteranomaly' | 'tritanopia' | 'tritanomaly' | 'achromatopsia';
type OverallResult = 'normal' | 'suspected_deficiency' | 'suspected_blindness' | 'inconclusive';
type SeverityLevel = 'mild' | 'moderate' | 'severe';
type TestMode = 'quick' | 'standard' | 'advanced' | 'child';  // child（儿童图形识别）v1.7.9 实现
```
**决议**：DATA-SPEC §4/§5 引用的 `ColorDeficiencyType`/`OverallResult`/`SeverityLevel` 在此统一定义，分册不得另起别名。（代码实现别名为 `DeficiencyType`/`Overall`/`Severity`，语义一致，分册以本文类型为准）。

### 5.6 分析事件 `AnalyticsEvent`（以 API §3.2 为准，含 `eventId`）

> **v1.9.0 起已废止**：`/api/analytics/event` 路由与 `lib/analytics.ts` 的 `reportServerEvent()` 已删除——该端点自 v1.7.9 落地起从未被任何组件调用（死代码），且与"不上传服务器"的隐私承诺存在披露冲突。删除后应用除 Google Analytics 4 外无任何服务端数据上报。本节保留作历史设计记录。

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

### 5.7 信号灯辨识（驾驶场景专项，结果不计入 TestResult）
> 与 `TestMode` 枚举解耦，为独立专项检测；判读结果仅在会话内展示，不写 `TestResult`、不进历史、不入 `localStorage`。

```ts
type SignalTaskKind = 'light' | 'meaning';   // light=辨色 / meaning=信号含义识别
interface SignalOption { label: string; labelEn: string; value: string }  // v1.9.0 简/英标签
interface SignalTask {
  id: string;
  kind: SignalTaskKind;
  prompt: string;
  promptEn: string;        // 题干英文（v1.9.0，繁体回退简体）
  color?: string;          // 待辨识灯色（展示用；meaning 题留空）
  options: SignalOption[]; // light 题固定 COLORS3：红/绿/黄
  answer: string;          // 正确选项 value
}
interface SignalTaskResult { id: string; userAnswer: string; correct: boolean }
interface SignalTestResult {
  overall: 'pass' | 'fail';   // light 类全对则 pass
  correct: number;
  total: number;
  colorOk: boolean;           // light 类（辨色）是否全对
  tasks: SignalTaskResult[];
  note: string;
}
```
**决议**：信号灯辨识为驾驶场景专项（数字等效 lantern test），题库 9 题（6 辨色 + 3 含义）；结果不持久化、不进入 `TestResult` 聚合结构（§5.3），与历史/分享链路解耦。

## 6. 判读算法（权威，以 `lib/scoring.ts` 实现为准）

> 本节为算法唯一权威，解决 ARCHITECTURE §3.2 与 DATA-SPEC §7 的扣分/阈值矛盾。**实现真值：`lib/scoring.ts` 等 `lib/*-scoring.ts`；原型 `prototype/assets/js/scoring.js` 仅作参考。**

### 6.1 正确性判定 `isCorrect(q, ua)`

> **实现现状（v1.13.0 起，务必先读）**：`lib/questions.ts` 的 38 题仅使用 `demonstration` / `vanishing`（含 3 题 `normal`），已无 `transformation` / `classification` / `hidden` 题，且 32 道消失题的 `protan` / `deutan` 预期值已清空（演示题 / 常规题保留与 `answer` 相同的值）。`PlateType` 的 6 值枚举在 `lib/types.ts` 中保留，但题库只用到 3 值。因此本节所有依赖转换 / 分类 / 隐藏题的分支**在当前题库下均不可达**；保留其定义仅为兼容旧题库与说明算法结构。
- `hidden` 题：空答案（`ua.trim()===''`）为正确（**兼容分支**：现行题库无 hidden 题，不可达）。
- 其余题：空答案=false；否则 `ua === q.answer`。

### 6.2 维度评分
```
wrong = total - correct
base  = round(min(100, (wrong/total) * 130))
protan = clamp(base + protanHit*8 - deutanHit*3, 0, 100)
deutan = clamp(base + deutanHit*8 - protanHit*3, 0, 100)
tritan = round(base * 0.35)   // 推算值，非独立测量
```
（`protanHit`/`deutanHit` = 转换/分类题中答案匹配对应异常典型值的计数；**当前题库下两者恒为 0**，故 `protan === deutan === base`；`tritan` 恒 ≤35，仅为推算参考值。）

### 6.3 总体结论

> 阈值以**比例** `wrongRate = wrong / Math.max(answered, 1)` 表达（分母为有效作答数，`wrong = Math.max(total - correct, 0)`，未作答也计入错）；程度判定另用 `rate = wrong / Math.max(total, 1)`。两者口径不同，勿混用（与 `lib/scoring.ts` L80/L89/L112 及单元测试对齐）。

```
if answered < total*0.5                          → inconclusive
else if vanishWrong >= 4 || wrongRate >= 0.6     → suspected_blindness
else if vanishWrong >= 2 || wrongRate >= 0.3
        || hiddenRight >= ceil(hiddenTotal/2)    → suspected_deficiency  // hidden 分支当前不可达
if demoWrong>0 && protanHit===0 && deutanHit===0
        && wrongRate < 0.3                       → inconclusive  // 当前退化为 demoWrong>0 && wrongRate<0.3
```

### 6.4 类型与程度
- **未分型优先（v1.15.1 起）**：`protanHit === 0 && deutanHit === 0` → `type = null`（不再默认输出 deutan 系）；`severity` 在非异常结论时同为 `null`。
- 轴选择：有命中时 `deutanHit >= protanHit` 选 deutan 轴，否则 protan 轴。
- 类型：`suspected_blindness`→`*opia`，`suspected_deficiency`→`*anomaly`。
- 程度：`rate = wrong/max(total,1)`；`>=0.7` 重度，`>=0.4` 中度，否则轻度。
- **能力边界（硬约束）**：当前题库两命中数恒为 0，故 `type` 恒为 `null`（未分型）。**本项目不能可靠区分红 / 绿 / 蓝黄异常类型**；任何面向用户的文案（结果分析、FAQ、模式描述、科普、README）均不得宣称可区分类型或列出转换 / 隐藏 / 分类题。`type` 字段仅为兼容既有数据结构而保留，`tritan` 不得解释为独立的蓝黄测量结果。

### 6.5 置信度
```
confidence = 100
           + demoWrong * (-25)        // 演示题错（DATA-SPEC -25 为准，非 ARCHITECTURE -20）
           + fastCount * (-2)         // <1s 作答
if protanHit>0 && deutanHit>0 → +(-15)   // 矛盾模式（当前不可达）
if answered < total*0.5         → +(-20) // 覆盖不足
clamp(confidence, 0, 100)
```
**决议**：演示题扣分值以 DATA-SPEC `-25` 为准；ARCHITECTURE 的「设计题 -20」「答题数<50% -20 仅 DATA-SPEC 有」等差异，统一以本算法（覆盖 `demoWrong`/`fastCount`/矛盾/覆盖不足四因子）为权威。

### 6.6 辅助评分
- 路径重合：应用侧为 `pathF1`（F1 重合度，`lib/path-scoring.ts`；弧长等距重采样，容差 `TOL=0.07`），**非 IoU、非原型 `CC.scorePath` 的命中比例 ×100**。
- 色相排列 `scoreHue`：相邻位置偏差求和（首末位置偏差 `max(0,d-1)`，中间 `max(0,d-1)*2`），`TES < 20` 判正常。

### 6.7 信号灯辨识判读（`scoreSignal`）
- 逐题判定 `correct = (userAnswer === answer)`。
- **light 类（辨色）须全部正确**才 `colorOk = true`；`overall = colorOk ? 'pass' : 'fail'`。
- **meaning 类（信号含义）错误反映认知而非辨色**，计入 `correct` 但不直接判不合格（不否决 `colorOk`）。
- `note`：通过→「符合安全驾驶信号辨色基本要求」；未通过→「建议正规医院眼科确认，以体检机构结论为准」。
- 结果仅在会话内展示，**不写入 `TestResult`、不进历史**（与 §5.7 一致）。

## 7. 隐私与合规基线（摘要，详见 `PRIVACY.md`）
- 纯前端、localStorage 存储；**无强制登录、无 PII 上传、无服务端状态**。
- 提供数据导出与删除入口。**v1.5.1 起接入 Google Analytics 4 匿名访问统计**（衡量 ID 见 `lib/analytics.ts`，仅生产环境加载，不含检测内容与 PII）；`analyticsEnabled` 服务端事件上报**仍未实现**。
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
- 项目的**版本单一来源已确立**：仓库根 `VERSION` 文件、`package.json` 与 `package-lock.json` 的 `version` 字段（以 `VERSION` 实时值为准）为权威；每次发版须同步三者，并新增 `CHANGELOG.md` 条目、同步 README 与 docs 各分册「实现状态」行。
- 各文档头注释版本（如 SPEC `v1.17.0`）与 `VERSION` 保持一致；各分册「文档版本」表亦统一标注当前项目版本（不再沿用 v1.0 初版标记）。原型文件头为 v0.1.x（原型内部迭代号，与项目发布版本解耦，不随发版刷写）。

### 8.3 文档结构
- 9 份分册 + 本 SPEC；本 SPEC 为总纲，分册冲突以本规范为准。
- 每文档顶部须含：路径与版本、实现状态声明、负责人（当前为 `—`，应补实）。
- 变更须记录 CHANGELOG（实现阶段建立）。

### 8.4 测试与质量门禁
- **Vitest 测试套件（v1.7.6 落地，当前 15 文件 107 例）**：`lib/*.test.ts` 平铺覆盖判读引擎、存储、格式化、导出导入、分享卡等；`npm test` = `vitest run`，`npm run test:coverage` 走 `@vitest/coverage-v8`。测试环境为 node（`vitest.setup.ts` 注入内存 Storage，无 jsdom/happy-dom），组件测试与 E2E 尚未落地。
- 实现阶段质量门禁：ESLint + TypeScript strict；无 `console.log`/`debugger`；CI（`.github/workflows/ci.yml`）跑 type-check + lint + build + test（e2e 安全跳过）。
- **安全响应头（v1.7.6 起）**：`next.config.mjs` 配置 CSP / X-Frame-Options / X-Content-Type-Options / Referrer-Policy / Permissions-Policy。

### 8.5 语言与国际化规范（v1.15.0 起三语）
- **语言优先级（全局规范）**：默认语言为**简体中文**（`zh`），第二为**繁体中文**（`zh-TW`，台湾用语），第三为**英语**（`en`）。`lib/i18n/lang.ts` 的 `LANGS` 数组顺序即优先级，设置面板语言按钮按此顺序渲染。
- **字典结构**：`lib/i18n/` 下 `zh-*.ts`（基准）/ `tw-*.ts` / `en-*.ts` 三套 × core / faq / ui / ui.flow / ui.guide / ui.result / result 七组；键集合由简体中文字典派生（`DictKey = keyof ZH`），繁体与英文字典受 TS 编译期完整性校验；`t()` 缺失键时回退简体中文。
- **语言偏好**：存 `cc.lang.v1`；`htmlLang()` 将 Lang 映射为 BCP 47（`zh-CN` / `zh-TW` / `en`）写入 `<html lang>`。
- **SSR metadata 与 JSON-LD**：以默认语言（简体中文）静态输出，不随客户端语言切换（SEO 稳定性优先）。
- **内容型文案边界**：科普（`learn-data`）、隐私长文（`privacy-data`）、信号灯题库、儿童图形标签当前为简/英双语，选择繁体时回退简体展示；界面文案三语全量覆盖。

### 8.6 发布流程（v1.16.0 起 GitHub Releases 自动发布）
- **触发条件**：`push` 到 `main` 且 CI workflow 的**所有前置 job 全绿**（lint / type-check / test / build / e2e 均通过）后，`release` job（`needs: build-and-test`）自动执行；PR、`develop` 分支与非 push 事件不触发发布。
- **版本单一来源**：发布版本取自仓库根 `VERSION` 文件（`v{VERSION}` 作为 tag 与 Release 标题），与 `package.json` / `package-lock.json` 三源一致，禁止在 workflow 中另行硬编码或推导版本号。
- **幂等防重**：若远端已存在同名 tag（同一版本重复 push、或历史已发布），release job 直接跳过——**同一版本号永不重复发布**；要发布新版本必须先按 §8.2 bump 版本。
- **Release 内容**：release notes 从 `CHANGELOG.md` 提取当前版本节（`## [x.y.z]` 至下一版本节），提取为空时回退占位说明；tag 指向全绿的那次 commit。
- **权限最小化**：release job 仅声明 `permissions: contents: write`；使用内置 `github.token`，不引入第三方发布 Action 与个人令牌。
- **实现位置**：`.github/workflows/ci.yml` 的 `release` job（与 CI 同 workflow，发布强依赖测试门禁）；部署仍由 Vercel 独立承接，Releases 仅承载版本归档与变更说明。

### 8.7 SEO / GEO 规范（v1.17.0 起）

- **路由单一数据源**：`lib/seo-routes.ts` 的 `SEO_ROUTES` 是全部可索引 URL 的唯一清单；`app/sitemap.ts`、`app/llms.txt/route.ts`、`app/llms-full.txt/route.ts` 与 `app/robots.ts` 的 UA 清单均由此派生。新增页面须先登记路由表；私有页（`/result/`、`/history/`、`/test/batch/`、`/offline`）一律不登记且 noindex。
- **sitemap**：`lastModified` 取 `SITE_UPDATED`（内容审阅日期），禁止使用构建时间；重复内容变体（如 `quick`）canonical 统一指向 `standard`。
- **metadata 与社交图**：根布局统一 `metadataBase` / title 模板 / robots / OG / twitter；社交图必须为静态 PNG（`public/og-default.png`，1200×630），禁用 SVG（多数链接预览不支持）；不使用运行时图像生成（`@vercel/og` 在 Node 26 下资源加载失败）。站点验证令牌仅由 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_BING_SITE_VERIFICATION` 注入，未配置不输出。
- **结构化数据**：根布局输出 WebApplication + WebSite + Organization 并以 `@id` 互链；首页 FAQPage、科普 Article + BreadcrumbList、栏目页 BreadcrumbList；`components/seo/JsonLd.tsx` 的 `safeJson()` 必须转义 `< > &` 与 U+2028/U+2029（v1.17.0 修复历史 no-op）；Article 的日期取 `SITE_UPDATED`。
- **GEO 资产**：`/llms.txt` 主索引（全部可索引 URL + 关键事实 + Optional）、`/llms-full.txt` 全文索引（FAQ / 科普 / 隐私正文）；两者 `force-static`、`text/plain; charset=utf-8`，并在 `<head>` 与根 `other` 中声明发现入口。`SITE_FACTS` 为「关键事实」唯一来源，首页 SSR 事实块与 llms.txt 共用。
- **AI 抓取策略**：`app/robots.ts` 显式放行 GPTBot / CCBot / ClaudeBot / PerplexityBot / Google-Extended / Applebot-Extended 等（默认 UA 本已 allow），私有路径一律 disallow。
- **语言与事实口径**：SSR metadata、JSON-LD、llms*.txt 与首页事实块恒为简体中文（§8.5）；三语字典与 llms.txt 不得出现与题库实况冲突的题型描述（仅消失型数字图）；`lib/seo.test.ts` 对 URL 集合、事实文案、robots 与 safeJson 做回归断言。
- **边界（需人工确认）**：无语言化可抓取 URL，故不输出 hreflang（避免指向同内容变体）；验证令牌与站点域名由部署方确认。

## 9. 实现状态与待办（对齐 ROADMAP）

- **已完成（v1.0–v1.7）**：文档体系（9 分册 + SPEC 总纲）、高保真静态原型（4 页，判读已对齐应用）、Next.js 14 应用、石原氏检测全流程（38 板）、结果/历史/科普/隐私页、导出（PNG/打印/复制）/分享卡、路径追踪（v1.1）、色相排列 D15（v1.2）、进阶联合判读（v1.3）、趣味性体验包（v1.4）、38 板完整图谱（v1.5）、GA4 匿名统计（v1.5.1）、SEO/GEO（v1.6.0）、驾驶员场景专项（v1.7.0：驾照合规栏/信号灯辨识/屏幕校准/图版明度/严肃场景隐藏趣味）、Vitest 测试套件（v1.7.6）、安全响应头（v1.7.6）、三语国际化（v1.15.0）、判读类型退化输出收敛（v1.15.1）、GitHub Releases 自动发布（v1.16.0）、文档全面校订（v1.16.1）。
> 任务清单见 [TASKS.md](./TASKS.md)。
- **信号灯辨识（驾驶场景专项）**：独立路由 `/test/signal` 已实现（题库 9 题 + `scoreSignal` 判读），结果不计入历史，与 `TestMode` 枚举解耦。

---
*本文档为 ChromaCheck 权威规范总纲 v1.17.0。分册应据本规范修订以消除前述字段/算法/范围冲突。*
