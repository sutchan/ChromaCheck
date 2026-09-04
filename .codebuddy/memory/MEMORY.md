# 记忆索引

## 项目：ChromaCheck（e:/Github/ChromaCheck）
- 已从「纯文档 + 静态原型」进入**应用开发阶段**，v1.0.0 已实现（2026-09-04），当前版本 **v1.1.0**。
- 应用技术栈：Next.js 14 (App Router) + React 18 + TypeScript(strict) + Tailwind 3，纯本地、无后端、无重型依赖；图表用内联 SVG，报告导出用 Canvas(PNG)+`window.print()`(PDF)。
- 版本单一来源：`VERSION`(=1.1.0) 与 `package.json` version 一致；原型文件头原为 v0.1.0，与正式应用版本解耦。
- **已实现页面/功能**：v1.0 首页(含色觉模拟 CvdSimulator)、检测前指引、模式选择(快速10题/标准24题)、石原氏测试(`/test/ishihara/[mode]`)、结果页(`/result/[id]`)、历史、科普列表+详情、隐私政策；v1.1 路径追踪(`/test/path-tracking/[mode]`)。
- **规划中（v1.1+）**：色相排列（F5，Farnsworth-Munsell D15，规范见 DATA-SPEC §2.3/§4.3）；路径追踪已实现。
- 路径追踪模块（v1.1 已实现）架构：题库 `lib/questions/path-tracking.ts`（3 题，kind 0/1/2，复用 `standardPath`）；渲染用 `lib/ishihara.ts` 的 `buildPathField`（离屏 canvas 缓存于 `PathTrackingCanvas`）；评分 `lib/path-scoring.ts`（`pathOverlap` IoU + `computePathResult`）；`TestResult.ishihara` 改为可选、`pathTracking?: PathTrackingResult[]` 新增；结果页/摘要/导出/历史均按测试类型守卫渲染。
- 数据/算法权威来源（应用从原型移植）：`prototype/assets/js/data.js`(24题)、`scoring.js`(判读)、`ishihara.js`(点阵绘制/色觉模拟)。移植后位于 `lib/questions.ts` `lib/scoring.ts` `lib/ishihara.ts` `components/test/IshiharaPlate.tsx`。
- **构建关键坑（Windows/PowerShell + 腾讯 coding-copilot 扩展）**：该扩展注入的 `node-safe-delete-shim` 会拦截 Node 目录删除并因调用 genie-trash 超时，导致 `next build` 在 cleanup 阶段失败（ETIMEDOUT）。**解决办法**：构建前设 `$env:CODEBUDDY_SAFE_DELETE_ENABLED='0'`（shim 读此变量跳过安全删除），不影响代码本身。
- 内置题库 24 道（`lib/questions.ts`），题型含 demonstration/transformation/vanishing/hidden/classification/normal；隐藏题对正常视觉应渲染为空白图版（figureText 返回 ''），避免误判。
- 设计令牌移植到 `app/globals.css`（`:root`/`[data-theme=dark]`/`body.cvd-safe`）；`tailwind.config.ts` 将颜色映射到这些 CSS 变量。
- 原型集（`prototype/`）四页互相链接、纯 HTML+CSS+原生 JS、无构建依赖：`prototype.html`(高保真可交互+色觉模拟) / `wireframes.html`(组件库) / `design-system.html`(设计系统) / `interaction.html`(交互标准)。图标库 `prototype/assets/js/icons.js` 暴露 `CC.icon(name)`（24×24 线性 SVG，`currentColor` 继承）。
- 文档治理教训：分册（ARCHITECTURE/DATA-SPEC/PRD/PRIVACY）的「规划蓝图」结构树/存储规范/上报功能须明确标注 v1.0 实际与 v1.1 规划边界，否则会与 SPEC/代码矛盾（v1.1.0 已统一：去 `advanced` 模式、path-tracking 标注已实现/hue-arrangement 标注未实现、`LocalStorageData` 标注 v1.1、`PRIVACY` 明确 v1.0 无上报）。分册头注释保持各自文档版，不随项目版本刷写。

## 跨项目通用（沿用）
- 源文件单文件 >200 行须按职责拆分（仅代码文件，文档不拆）。
- 每次修改 bump 最小版本号；仅被改文件头注释更新，禁止全仓库刷写头注释。
- 中文对话、回复精简直给。
