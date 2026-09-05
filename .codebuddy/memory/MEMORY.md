# 记忆索引

## 项目：ChromaCheck（e:/Github/ChromaCheck）
- 已从「纯文档 + 静态原型」进入**应用开发阶段**，v1.0.0 已实现（2026-09-04），当前版本 **v1.5.1**（2026-09-05；注意会话间隙用户会自行 bump/提交，改版本前必须重读 VERSION 并 `git status --short --untracked-files=all` 确认新建文件是否已被中间会话提交）。
- 应用技术栈：Next.js 14 (App Router) + React 18 + TypeScript(strict) + Tailwind 3，纯本地、无后端、无重型依赖；图表用内联 SVG，报告导出用 Canvas(PNG)+`window.print()`(PDF)。
- 版本单一来源：`VERSION`(=1.5.1) 与 `package.json` version 一致；原型文件头原为 v0.1.0，与正式应用版本解耦。
- **已实现页面/功能**：v1.0 首页(含色觉模拟 CvdSimulator)、检测前指引、模式选择(快速10题/标准38题)、石原氏测试(`/test/ishihara/[mode]`)、结果页(`/result/[id]`)、历史、科普列表+详情、隐私政策；v1.1 路径追踪(`/test/path-tracking/[mode]`)；v1.2 色相排列 D15(`/test/hue-arrangement/[mode]`)；v1.3 进阶联合判读(`/test/advanced`)；**v1.4 趣味性体验包**（`lib/fun.ts` 趣味数据+`lib/sharecard.ts` Canvas 分享卡、`components/test/FunBits.tsx` 进度点阵/章末过渡、`components/result/EyesSwitcher.tsx` 换一双眼睛、`components/result/DimScenes.tsx` 三轴科普；`AppSettings.funMode` 开关经 `ThemeToggle`「趣味开/关」控制，中性反馈恒开）。GitHub 仓库：https://github.com/sutchan/ChromaCheck（页脚与 README 联系方式已链入）。
- **v1.5.1 起接入 Google Analytics 4**：衡量 ID `G-0F9QWS1PDX`，单一来源 `lib/analytics.ts`（`NEXT_PUBLIC_GA_ID` 可覆盖，置空即停用；**仅生产环境加载**）；`components/analytics/GoogleAnalytics.tsx` 为客户端组件（`next/script` afterInteractive 注入 gtag.js，`usePathname` 变化补报 page_view），挂载于 `app/layout.tsx` body 首位；`trackEvent` 已预留但未埋点——检测内容/判读结果一律不上报。
- **规划中**：`analyticsEnabled` 服务端匿名事件上报（仍推迟，无服务端）；ROADMAP P1 分享卡片社交优化 / 屏幕校准指引；P2 英文版 / PWA。
- 色相排列模块（v1.2 已实现）架构：`lib/questions/hue-arrangement.ts`（D15 sRGB 15 卡 + `shuffledOrder` mulberry32 确定性打乱，初始种子 20260905 防 SSR 闪烁）；评分 `lib/hue-scoring.ts`（TES：seq=[0,...order,14]，首末权重1/中间2，max(0,d-1)×权重；<20 正常/20-40 轻度/>40 明显；偏差方向 min(卡号)≤5→tritan 否则默认 deutan，注明不足以临床分型）；交互 `HueArrangementGrid`（点击选中+交换，role=listbox）；**测试中不显示实时 TES**（防用户凑分，原型演示有显示但正式应用刻意去掉）。
- 路径追踪模块（v1.1 已实现）架构：题库 `lib/questions/path-tracking.ts`（3 题，kind 0/1/2，复用 `standardPath`）；渲染用 `lib/ishihara.ts` 的 `buildPathField`（离屏 canvas 缓存于 `PathTrackingCanvas`）；评分 `lib/path-scoring.ts`（`pathOverlap` IoU + `computePathResult`）；`TestResult.ishihara` 改为可选、`pathTracking?: PathTrackingResult[]` 新增；结果页/摘要/导出/历史均按测试类型守卫渲染。
- 数据/算法权威来源（应用从原型移植）：`prototype/assets/js/data.js`(24题)、`scoring.js`(判读)、`ishihara.js`(点阵绘制/色觉模拟)。移植后位于 `lib/questions.ts` `lib/scoring.ts` `lib/ishihara.ts` `components/test/IshiharaPlate.tsx`。
- **构建关键坑（Windows/PowerShell + 腾讯 coding-copilot 扩展）**：该扩展注入的 `node-safe-delete-shim` 会拦截 Node 目录删除并因调用 genie-trash 超时，导致 `next build` 在 cleanup 阶段失败（ETIMEDOUT）。**解决办法**：构建前设 `$env:CODEBUDDY_SAFE_DELETE_ENABLED='0'`（shim 读此变量跳过安全删除），不影响代码本身。
- 内置题库 38 道（`lib/questions.ts`，v1.5.0 由 24 扩至 38，新增 plate 25–38），题型含 demonstration/transformation/vanishing/hidden/classification/normal；隐藏题对正常视觉应渲染为空白图版（figureText 返回 ''），避免误判；快速版固定 10 题核心集，标准版/进阶版 38 题。
- 设计令牌移植到 `app/globals.css`（`:root`/`[data-theme=dark]`/`body.cvd-safe`）；`tailwind.config.ts` 将颜色映射到这些 CSS 变量。
- 原型集（`prototype/`）四页互相链接、纯 HTML+CSS+原生 JS、无构建依赖：`prototype.html`(高保真可交互+色觉模拟) / `wireframes.html`(组件库) / `design-system.html`(设计系统) / `interaction.html`(交互标准)。图标库 `prototype/assets/js/icons.js` 暴露 `CC.icon(name)`（24×24 线性 SVG，`currentColor` 继承）。
- 文档治理教训：分册（ARCHITECTURE/DATA-SPEC/PRD/PRIVACY）的「规划蓝图」结构树/存储规范/上报功能须明确标注 v1.0 实际与 v1.1 规划边界，否则会与 SPEC/代码矛盾（v1.1.0 已统一：去 `advanced` 模式、path-tracking 标注已实现/hue-arrangement 标注未实现、`LocalStorageData` 标注 v1.1、`PRIVACY` 明确 v1.0 无上报）。分册头注释保持各自文档版，不随项目版本刷写。
- **趣味性设计（2026-09-05，SPEC §3.5 原型已验证）**：4 红线——答题中永不显示对错（判读数据污染）、无积分/排行榜（刷分毁效度）、无障碍零豁免（5 种色觉模拟 + reduced-motion）、称号去污名化（旅人隐喻，本机展示可关闭）；明确不做复测提醒等留存钩子（成人色觉稳定）。7 功能：进度点阵仪式感（每8题脉冲）、章末轻科普过渡（题型分3章）、中性提交反馈「✓已记录」恒开、Canvas 分享卡（`sharecard.js` 零依赖 PNG 导出）、换一双眼睛（复用 `CC.renderPlate` 的 cvd 参数）、三轴互动科普、「趣味体验」总开关（`cc.funMode`，默认开）。应用侧承接：ROADMAP v1.1「趣味性体验包」（P1）。
- 原型 `ishihara.js` 坑：`CVD_MATRIX` 键名为 protanopia/deuteranopia/tritanopia/achromatopsia，**不是** protan/deutan/tritan/mono——键名写错会静默回退正常视觉不报错。

## 跨项目通用（沿用）
- 源文件单文件 >200 行须按职责拆分（仅代码文件，文档不拆）。
- 每次修改 bump 最小版本号；仅被改文件头注释更新，禁止全仓库刷写头注释。
- 中文对话、回复精简直给。
