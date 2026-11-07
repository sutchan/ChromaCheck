# 记忆索引

## 项目：ChromaCheck（e:/Github/ChromaCheck）
- 纯前端 Next.js 14(App Router)+React 18+TS(strict)+Tailwind 3，本地优先、无后端、无重型依赖；图表内联 SVG，报告 Canvas(PNG)+`window.print()`(PDF)。当前版本 **v1.16.0**（2026-11-06；外部进程曾自行推进至 v1.14.1（含石原氏键盘输入 + 页脚版本/build 规范，提交 `ad56cb7`），并会自行 bump/提交甚至直接 commit 工作区改动；改版本前必须重读 `VERSION` 并 `git status --short --untracked-files=all`）。
- 版本单一来源：`VERSION`(=1.14.2) 与 `package.json`/`package-lock.json` 一致；代码改后同步 `README`/`CHANGELOG` 顶部版本与 `docs/` 各分册「实现状态」行。任务清单 `docs/TASKS.md`（磁盘大小写与跟踪名不一致，Windows 下同文件）待办已清零，新待办自 R9+ 顺延。原型文件头 v0.1.3（已反向对齐应用，与正式版本解耦）。**历史坑**：某次会话把 CHANGELOG 写成 1.13.2 却漏 bump `VERSION`（停在 1.13.1），改版本须同步 VERSION/package.json/package-lock.json + CHANGELOG 顶部 + README/docs 实现状态行；CHANGELOG 目标版本节已存在则**追加**，勿新建重复节。
- 审查与修复要点（JSON-LD 转义、语义 id 覆盖、SPEC §6.3 判读阈值口径、测试环境限制、构建坑）见 [review-2026-11-05.md](review-2026-11-05.md)。
- 字体（v1.13.3 真自托管）：`app/font-defs.ts` 用 `next/font/local` 注入 `app/fonts/` 下 8 个 latin woff2（Archivo 400–800 / IBM Plex Mono 400–600，来源 `@fontsource/*`）；构建期**不联网**，离线 CI 可用。中间变量 `--font-archivo`/`--font-plex-mono` 由 `globals.css` 组合中文回退链。**禁止改回 `next/font/google`**（构建期需访问 gstatic，离线必失败）。详见全局记忆 `font_selfhost_offline_build.md`。`lib/site.ts` 的 `SITE_UPDATED` 现仅用于隐私页「最后更新」，页脚为 `V{ver}· build {NEXT_PUBLIC_BUILD_ID}`（10 位 `yymmddhhmm`）。
- 导航（v1.7.5）：页眉 Navbar 仅「首页/开始检测/历史」；科普/隐私入口在页脚 Footer。

### 功能/路由（详见 CHANGELOG）

补充：断点续测草稿 `cc.progress.v1`、历史/批量汇总 CSV 导出、`scene=driver` 驾驶合规提示、SkipLink、FAQPage JSON-LD、4 处 error.tsx 错误边界；信号灯/批量结果不落历史。
石原氏(quick10/standard38)+规则化初筛、路径追踪、色相排列D15、进阶联合判读、信号灯(`/test/signal`)、批量(`/test/batch`)、儿童、趣味包(可关)、历史多档案+导出导入、响应式+深色+色觉安全+结果页五视角(首页模拟器 4 种)、三语 i18n(简默认>繁体>英语,v1.15.0)、PWA、设置面板、GA4。`/test/`：ishihara/path-tracking/hue-arrangement/advanced/signal/batch/child；**FAQ 是首页区块 `components/home/HomeFaq.tsx`，非独立路由**。

### 关键模块（长期有效）
- i18n：`lib/i18n/`(dict/zh-*/tw-*/en-*/t/lang，三语，SSR metadata 恒简体)，40+ 组件 `useLang()`；含 metadata 静态页=服务端 page 导中文 metadata + client 内容组件 `useLang()`（范例 `app/test/page.tsx`→`TestSelectContent.tsx`）；长文本走 `lib/privacy-data.ts`/`lib/learn-data.ts`。
- 本地数据：`lib/profile.ts`(Profile)、`lib/export-import.ts`、历史 `components/history/{HistoryCard,ProfileSwitcher}.tsx`；`TestResult.profileId` 由 `saveResult` 自动归属。
- 设置面板（v1.10.0）：`components/layout/{SettingsButton,SettingsDialog}.tsx` 收编语言/主题/色觉安全/趣味；删 `LangToggle`/`ThemeToggle`；持久化 `cc.settings.v1`+`cc.lang.v1`。
- **v1.12.0 审查项收口（2026-11-03）**：R4 aria 走查——`IshiharaPlate` 的 `<canvas>` 加 `role="img"`+类型化 `aria-label`（不剧透答案）、`AnswerReview` 表头 `scope="col"`/表 `aria-label`、`Numpad` 加 `role="group"`（新增 i18n 键 `ishihara.plateAria`/`test.numpadLabel`）；R5 新增 6 模块单测（child-scoring/format/scoring-text/path-field/ishihara/sharecard 的 computeRadar），套件 73→97 例（canvas 绘制因 vitest 为 node 环境不可单测）；R8 提取 `TestRunner`/`AdvancedRunner` 重复的 mounted 水合守卫+进度恢复为共享 hook `components/test/useResumeProgress.ts`。R3/R6/R7 已于 v1.11.1–v1.11.2 由并行会话完成；R8 的 history 内联 style / result props 透传仍列为后续（既定设计风格、改动风险高）。详见 `CHANGELOG.md`[1.12.0] 与 `docs/tasks-done.md` §六。
- 判读：`lib/{scoring,hue-scoring,path-scoring,signal-scoring,advanced-scoring}.ts`+`lib/ishihara.ts`；题库 `lib/questions.ts`(38)+`lib/questions/*`；`pathOverlap` 实为 F1；「置信度」已改「判读稳定性」。
- 隐私：v1.9.0 已移除 `reportServerEvent`/`app/api/analytics/event`，**仅 GA4 上报**（口径见 `lib/privacy-data.ts`）。
- **页脚版本/构建号格式（v1.14.0 起规范，详见 `footer_version_build.md`）**：`components/layout/Footer.tsx`（`id="app-footer"`）展示 `© {年} ChromaCheck · V{version}· build {NEXT_PUBLIC_BUILD_ID} · {用途}`——大写 `V`、版本后紧接 `·`、再 ` build `、最后 **10 位 `yymmddhhmm`**（2 位年份）。构建号由 `next.config.mjs` 在构建时按本地时间生成并注入 `NEXT_PUBLIC_BUILD_ID`（dev/build 均生效，缺失回退 `pkg.version`）。**不再展示更新日期**；`lib/site.ts` 的 `SITE_UPDATED` 现仅用于隐私页「最后更新」。
- 原型 `prototype/`：4 页纯 HTML 设计验证，**判读算法须以 app/lib 为准**（已对齐 v0.1.x，与 VERSION 解耦）；`CVD_MATRIX` 键名 protanopia/deuteranopia/tritanopia/achromatopsia（非 protan/deutan/tritan/mono）。
- **仓库结构（长期有效）**：`.github/` 已规范化——含 CODE_OF_CONDUCT/CONTRIBUTING/SECURITY/SUPPORT/PULL_REQUEST_TEMPLATE/ISSUE_TEMPLATE/workflows；**未建 FUNDING.yml**；遵守全局规则**禁止新建 `.github/readme.md`**。根目录其余文件（README/LICENSE/CHANGELOG/package.json/VERSION/各构建配置/metadata.json/ChromaCheck.code-workspace）均属项目核心，按惯例留根，不应移入 .github/（用户 2026-10-17 核查确认）。

### 坑/约束
- 构建：`next build` cleanup 被腾讯 coding-copilot 的 node-safe-delete-shim 拦截致 ETIMEDOUT；构建前 `$env:CODEBUDDY_SAFE_DELETE_ENABLED='0'`。
- CI：仓库**已提交** `package-lock.json`（v1.11.2 起），`.github/workflows/ci.yml` 的 setup-node **不配 `cache`**（避免 v5 按 packageManager 自动缓存），安装用 `npm install`（非 `npm ci`）。
- 版本漂移：改版本前必重读 VERSION+package.json+CHANGELOG 头；目标版本节已存在则追加，勿新建重复节。

## 跨项目通用（沿用）
- 源码单文件 >200 行须拆分（文档不拆）。
- 每次修改 bump 最小版本号；仅被改文件头注释更新，禁全仓库刷写。
- 中文对话、精简直给。
