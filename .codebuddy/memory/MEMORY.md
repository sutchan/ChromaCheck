# 记忆索引

## 项目：ChromaCheck（e:/Github/ChromaCheck）
- 纯前端 Next.js 14(App Router)+React 18+TS(strict)+Tailwind 3，本地优先、无后端、无重型依赖；图表内联 SVG，报告 Canvas(PNG)+`window.print()`(PDF)。当前版本 **v1.10.1**（2026-10-17；会话间隙用户会自行 bump/提交，改版本前必须重读 `VERSION` 并 `git status --short --untracked-files=all`）。
- 版本单一来源：`VERSION`(=1.10.1) 与 `package.json` 一致；代码改后同步 `README`/`CHANGELOG` 顶部版本。原型文件头 v0.1.3（已反向对齐应用，与正式版本解耦）。
- 字体（v1.7.4 自托管）：`app/layout.tsx` 用 `next/font/google` 注入 Archivo+IBM Plex Mono；`lib/site.ts` 提供 `SITE_URL`/`SITE_UPDATED`（更新日期唯一来源，页脚 `v{ver}·更新于{SITE_UPDATED}` 直读 package.json）。构建需访问 fonts.gstatic.com，离线可能 ECONNRESET（重试通常可过）。
- 导航（v1.7.5）：页眉 Navbar 仅「首页/开始检测/历史」；科普/隐私入口在页脚 Footer。

### 功能/路由（详见 CHANGELOG）
石原氏(quick10/standard38)+智能判读、路径追踪、色相排列D15、进阶联合判读、信号灯(`/test/signal`)、批量(`/test/batch`)、儿童、趣味包(可关)、历史多档案+导出导入、响应式+深色+色觉安全+五视角、中英 i18n、PWA、设置面板、GA4。`/test/`：ishihara/path-tracking/hue-arrangement/advanced/signal/batch/child；**FAQ 是首页区块 `components/home/HomeFaq.tsx`，非独立路由**。

### 关键模块（长期有效）
- i18n：`lib/i18n/`(dict/zh-*/en-*/t/lang)，40+ 组件 `useLang()`；含 metadata 静态页=服务端 page 导中文 metadata + client 内容组件 `useLang()`（范例 `app/test/page.tsx`→`TestSelectContent.tsx`）；长文本走 `lib/privacy-data.ts`/`lib/learn-data.ts`。
- 本地数据：`lib/profile.ts`(Profile)、`lib/export-import.ts`、历史 `components/history/{HistoryCard,ProfileSwitcher}.tsx`；`TestResult.profileId` 由 `saveResult` 自动归属。
- 设置面板（v1.10.0）：`components/layout/{SettingsButton,SettingsDialog}.tsx` 收编语言/主题/色觉安全/趣味；删 `LangToggle`/`ThemeToggle`；持久化 `cc.settings.v1`+`cc.lang.v1`。
- 判读：`lib/{scoring,hue-scoring,path-scoring,signal-scoring,advanced-scoring}.ts`+`lib/ishihara.ts`；题库 `lib/questions.ts`(38)+`lib/questions/*`；`pathOverlap` 实为 F1；「置信度」已改「判读稳定性」。
- 隐私：v1.9.0 已移除 `reportServerEvent`/`app/api/analytics/event`，**仅 GA4 上报**（口径见 `lib/privacy-data.ts`）。
- 原型 `prototype/`：4 页纯 HTML 设计验证，**判读算法须以 app/lib 为准**（已对齐 v0.1.x，与 VERSION 解耦）；`CVD_MATRIX` 键名 protanopia/deuteranopia/tritanopia/achromatopsia（非 protan/deutan/tritan/mono）。
- **仓库结构（长期有效）**：`.github/` 已规范化——含 CODE_OF_CONDUCT/CONTRIBUTING/SECURITY/SUPPORT/PULL_REQUEST_TEMPLATE/ISSUE_TEMPLATE/workflows；**未建 FUNDING.yml**；遵守全局规则**禁止新建 `.github/readme.md`**。根目录其余文件（README/LICENSE/CHANGELOG/package.json/VERSION/各构建配置/metadata.json/ChromaCheck.code-workspace）均属项目核心，按惯例留根，不应移入 .github/（用户 2026-10-17 核查确认）。

### 坑/约束
- 构建：`next build` cleanup 被腾讯 coding-copilot 的 node-safe-delete-shim 拦截致 ETIMEDOUT；构建前 `$env:CODEBUDDY_SAFE_DELETE_ENABLED='0'`。
- CI：仓库**不提交** lock 文件，`.github/workflows/ci.yml` 的 setup-node **勿配 `cache: npm`**，安装用 `npm install`（非 `npm ci`）。
- 版本漂移：改版本前必重读 VERSION+package.json+CHANGELOG 头；目标版本节已存在则追加，勿新建重复节。

## 跨项目通用（沿用）
- 源码单文件 >200 行须拆分（文档不拆）。
- 每次修改 bump 最小版本号；仅被改文件头注释更新，禁全仓库刷写。
- 中文对话、精简直给。
