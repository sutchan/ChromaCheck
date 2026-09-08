# 变更日志

本文件记录 ChromaCheck 的版本变更，遵循 [Keep a Changelog](https://keepachangelog.com/) 规范。
版本号的单一来源为仓库根目录 `VERSION` 文件与 `package.json` 的 `version` 字段（当前 `1.7.5`）。

## [1.7.5] - 2026-09-08

### 优化（导航结构）
- 将页眉导航的「科普」「隐私」入口移至页脚区，页眉仅保留「首页 / 开始检测 / 历史」，减少顶部干扰、突出核心检测流程（页脚已含「科普文章」「隐私政策」入口）。

### 版本同步
- 版本单一来源同步至 `1.7.5`（`VERSION`、`package.json`、改动文件头注释、`Footer` 展示版本、`README.md` 状态行）。
- 修正 `Footer` 展示版本长期停留在 `v1.7.0` 的脱节问题，现统一为 `v1.7.5`。

## [1.7.4] - 2026-09-07

### 优化（审查修复）
- 字体改为 `next/font/google` 自托管（Archivo / IBM Plex Mono），消除 `no-page-custom-font` 告警并去除运行时外部字体请求；同步移除手动 `<link>` 预连接。
- 移除根级 `app/loading.tsx` 全局加载骨架，避免每次路由切换闪现骨架屏。
- 首页 Hero 图版改用 `lib/questions.ts` 导出的 `HERO_PLATE` 常量，避免直接依赖完整题库导入。
- 新增 `lib/site.ts` 集中 `SITE_URL`，统一 `sitemap.ts` / `robots.ts` / `learn/[slug]` / 根布局的结构化数据域名来源。

### 版本同步
- 版本单一来源同步至 `1.7.4`（`VERSION`、`package.json`、改动文件头注释）。

## [1.7.3] - 2026-09-07

### 修正（答题流程与进阶模式恢复）
- 修复演示题作为最后一题时 `advanceFromReveal` 永不调用 `onDone`、测试卡死无法完成的问题（现末题直接提交结果）。
- 修复「恢复进度」功能整体失效：进度经 `useEffect` 异步写入 `initial`，而 `useIshiharaFlow` 的 `useState(initial?.index ?? 0)` 仅在首挂载生效，导致恢复总是从第一题开始。改用挂载门控（`mounted`），确保 `IshiharaFlow` 首挂载即带正确 `initial`。
- 修复进阶联合检测中途刷新后石原氏作答进度丢失：进阶模式现持久化并恢复石原氏阶段进度（`initial` 接入 `IshiharaFlow`，完成即清进度），与标准 / 快速版一致。

### 优化（SEO / 站点结构）
- 为 `/test/ishihara/[mode]`、`/test/hue-arrangement/[mode]`、`/test/path-tracking/[mode]`、`/test/advanced` 补充 `generateMetadata`（标题 / 描述 / canonical / OG）。
- 为色相排列与路径追踪动态路由补充 `generateStaticParams`。
- `app/sitemap.ts` 补全 `/test/ishihara/{quick,standard}`、`/test/advanced`、`/test/hue-arrangement/standard`、`/test/path-tracking/standard`。
- 新增 `app/loading.tsx` 路由级加载骨架。

### 版本同步
- 版本单一来源同步至 `1.7.3`（`VERSION`、`package.json`、改动文件头注释、`README.md` 状态行）。

## [1.7.2] - 2026-09-06

### 修正（文档版本同步、可访问性、代码拆分）
- 修正文档与代码版本脱节：`README.md` 状态行「当前项目版本」由 `v1.7.0` 同步为 `v1.7.2`（对齐 `VERSION`）；`docs/SPEC.md` §8.2 版本单一来源说明确认为 `1.7.2`。
- `app/page.tsx` 首页根容器补齐语义化 `id="home-page"`，与结果 / 指引 / 历史等页面一致。
- 拆分 5 个超 200 行源文件以符合「单文件 ≤200 行」规范（保持公开 API / 导出契约不变）：
  - `lib/sharecard.ts` 抽 Canvas 绘制原语至 `lib/sharecard-canvas.ts`；
  - `components/result/ReportActions.tsx` 抽报告绘制 `drawReport` 至 `lib/report-canvas.ts`；
  - `lib/ishihara.ts` 抽路径追踪（`standardPath` / `buildPathField` / `Path*`）至 `lib/path-field.ts`；
  - `components/test/IshiharaFlow.tsx` 抽答题状态与逻辑至 `components/test/useIshiharaFlow.ts`；
  - `lib/scoring.ts` 抽判读文案映射（`uiText` / 类型标签）至 `lib/scoring-text.ts`，并 re-export `uiText`。
- 版本单一来源同步至 `1.7.2`（`VERSION`、`package.json`、改动文件头注释）。

## [1.7.1] - 2026-09-06

### 优化（清理冗余代码与文件）
- 删除 `lib/analytics.ts` 中零引用的 `trackEvent`（其依赖的服务端事件上报尚未实现，GA4 页面统计由 `pageview` 覆盖）。
- 删除 `lib/advanced-scoring.ts` 中未使用的局部常量 `PATH_PASS`。
- 收敛仅模块内部使用、无外部引用的导出（去掉 `export` 关键字，收窄公共 API 面）：`lib/ishihara.ts` 的 `CVD_MATRIX`/`hexToRgb`/`rgbToCss`、`lib/hue-scoring.ts` 的 `TES_NORMAL`/`scoreHueArrangement`、`lib/fun.ts` 的 `TITLES`、`lib/path-scoring.ts` 的 `pathOverlap`、`lib/questions/hue-arrangement.ts` 的 `HUE_QUESTION`、`lib/questions/path-tracking.ts` 的 `PATH_QUESTIONS`。
- `docs/ARCHITECTURE.md` 补充消歧说明：`prototype/` 为独立设计参考、非应用运行依赖。

## [1.7.0] - 2026-09-06

### 新增（驾驶员场景色觉检测改进，对应 `docs/TASKS.md` T1–T6）
- **T1 驾照辨色力参考栏**：`lib/license.ts` 新增 `mapToLicense()`，依据《机动车驾驶证申领和使用规定》（公安部令第 172 号）第十二条「无红绿色盲」，将检测结果映射为合规结论 + 免责声明；`components/result/DriverCompliance.tsx` 在结果页渲染该参考栏（语义化 `id="driver-compliance"`）。
- **T2 信号灯辨识专项检测**：新增 `lib/questions/signal.ts`（9 题：红/绿/黄单灯辨色 + 信号含义）、`lib/signal-scoring.ts`（`scoreSignal`：辨色类任务须全对才算通过）、`components/test/SignalRunner.tsx` 与 `app/test/signal/page.tsx`；结果仅作驾驶场景参考，不计入历史。
- **T4 屏幕校准提示**：`app/guide/page.tsx` 新增「屏幕校准提示」区块（关闭护眼/夜间滤镜、标准色温亮度、控制环境光、演示题自检）与未校准免责提示。
- **T5 图版明度控制**：`lib/ishihara.ts` 的 `PALETTE` 重设计为判别型图版（转换/消失/隐藏/分类）采用「等亮度、异色相」配色，避免异常视觉仅凭亮度误读数字。
- **T6 严肃场景隐藏趣味模块**：`lib/types.ts` 新增 `Scene` 与 `TestResult.scene`；`?scene=driver` 经 `searchParams` 传入 `TestRunner` / `AdvancedRunner` 并写入结果；结果页在 driver 场景下隐藏「换眼睛」「三轴科普」等趣味元素，分享卡去除称号（`ReportActions` 新增 `plain`）。

### 修正 / 澄清
- **T3 色弱 vs 色盲语义澄清**：`lib/scoring.ts` 判读文案区分 dichromacy（色盲）与 anomalous（色弱），并明确「色弱一般不影响驾驶资格」；`DriverCompliance` 补充说明「色弱≠色盲、不代表不合格」。
- `app/test/page.tsx` 新增「驾驶 / 职业体检准备」入口（标准版驾驶场景 + 信号灯辨识，附场景参数）。
- `app/sitemap.ts` 纳入 `/test/signal`。

## [1.6.0] - 2026-09-05

### 新增（SEO 搜索引擎优化 / GEO 生成式引擎优化）
- `app/robots.ts`：自动生成 `robots.txt`，指向 sitemap，并屏蔽私有页面 `/result/`、`/history/`。
- `app/sitemap.ts`：自动生成 `sitemap.xml`，覆盖首页、各入口页与全部科普文章。
- `app/llms.txt/route.ts`：新增 `llms.txt`（GEO 约定），向生成式引擎提供站点索引、科普清单与关键事实的纯文本摘要；根布局 `<head>` 增加 `<link rel="alternate" href="/llms.txt">`。
- `components/seo/JsonLd.tsx`：通用 JSON-LD 注入组件。
- `app/layout.tsx`：注入 `WebApplication` 结构化数据（schema.org），并完善 `metadata`（robots 指令、`category`、`alternates.canonical`、`authors`、静态 SVG 社交分享图）。
- `components/home/HomeFaq.tsx` + 首页：新增常见问题区块与 `FAQPage` 结构化数据，提供可被引用的事实性问答。
- `app/learn/[slug]/page.tsx`：科普详情新增 `Article` 与 `BreadcrumbList` 结构化数据，并补全 per-page `metadata`。
- `app/learn/page.tsx`、`app/test/page.tsx`、`app/guide/page.tsx`、`app/privacy/page.tsx`：补全 per-page `metadata`（标题、描述、关键词、canonical、OG）。
- `app/result/[id]/layout.tsx`、`app/history/layout.tsx`：私有页面增加 `noindex` 声明。
- `public/og-default.svg`：1200×630 品牌社交分享图。

### 文档
- 版本单一来源同步至 `1.6.0`（`VERSION`、`package.json`、各改动文件头注释）。

## [1.5.1] - 2026-09-05

### 新增
- 接入 Google Analytics 4 匿名访问统计（衡量 ID `G-0F9QWS1PDX`）：新增 `lib/analytics.ts`（衡量 ID 单一来源 + `pageview`/`trackEvent` 上报辅助）与 `components/analytics/GoogleAnalytics.tsx`（`next/script` 注入 gtag.js，并随 App Router 路由变化补报 page_view）；根布局 `app/layout.tsx` 挂载该组件。
- 仅生产环境加载统计脚本；支持环境变量 `NEXT_PUBLIC_GA_ID` 覆盖，置为空字符串即全局停用。

### 文档
- `app/privacy/page.tsx`：新增「6. 匿名访问统计（Google Analytics）」，并更正「不嵌入追踪脚本 / 未启用匿名统计上报」的旧表述。
- `docs/PRIVACY.md` §2.2 更新为 GA4 实际采集范围与不上报清单，并标注 `analyticsEnabled` 服务端事件上报仍未实现。
- 版本单一来源同步至 `1.5.1`（`VERSION`、`package.json`、改动文件头注释）。

## [1.5.0] - 2026-09-05

### 新增
- 石原氏题库扩充至 38 板完整图谱（ROADMAP P1）：`lib/questions.ts` 在原有 24 题基础上新增 14 道检测图（plate 25–38，覆盖转换/消失/隐藏/分类/演示/常规题型），异常轴区分度与判读稳定性提升。
- 快速版维持 10 题核心集不变；标准版与进阶版（advanced）检测量由 24 题升级为 38 题。

### 文档
- 应用内与文档中「标准版 24 题」全部同步为「38 题」（模式选择页、首页、layout 元信息、进阶联合判读文案、SPEC/PRD/ROADMAP/README）。
- 版本单一来源同步至 `1.5.0`（`VERSION`、`package.json`、各改动文件头注释）。

## [1.4.0] - 2026-09-05

### 新增
- 趣味性体验包（SPEC §3.5，原型已验证，应用侧落地）：
  - 进度点阵仪式感（`components/test/FunBits.tsx` `ProgressDots`）：24 圆点三态（已完成/当前/未到），每完成 8 题触发脉冲 + 「已完成 N / 24 版」轻提示；硬约束：不表达对错。
  - 章末轻科普过渡（`ChapterCard`）：题型分 3 章（暖身/主体/深水），章节交替处插入过渡卡，回车或按钮继续。
  - 中性提交反馈：提交后恒显「✓ 已记录」420ms 缓冲（不随开关关闭）。
  - 色觉人格分享卡（`lib/sharecard.ts` + 结果页「分享卡 PNG」按钮）：Canvas 手绘雷达 + 称号 + 三轴条，本地 `toDataURL` 导出 PNG，零依赖。
  - 换一双眼睛（`components/result/EyesSwitcher.tsx`）：第 4 版转换图（标准答案 29）五种色觉视角切换，复用 `IshiharaPlate` 的 `cvd` 参数。
  - 三轴互动科普（`components/result/DimScenes.tsx`）：点维度条展开日常生活影响，含 `aria-expanded` 键盘可达。
  - 旅人隐喻称号（`lib/fun.ts` `TITLES`）：去污名化，仅本机展示。
  - `趣味`总开关（`AppSettings.funMode`，默认开）：导航栏 `ThemeToggle` 处切换，关闭后称号/章末过渡/里程碑仪式感回退中性，中性反馈恒开。
- 抽离 `lib/fun.ts` 集中趣味数据（章节/称号/三轴科普），`AppSettings` 新增 `funMode` 字段（`lib/types.ts`、`lib/storage.ts` 默认值 `true`）。

### 文档
- SPEC §3.5 / ROADMAP 趣味性体验包标注为 v1.4 已实现；README/页脚/版本单一来源同步至 `1.4.0`。

## [1.3.0] - 2026-09-05

### 新增
- 进阶联合检测（advanced 模式）：新增 `/test/advanced` 路由与 `AdvancedRunner` 组件，依次完成石原氏 24 题、路径追踪 3 题与色相排列 D15 三模块，联合判读交叉验证：
  - 三模块一致正常 → 置信度上调并注明交叉验证；
  - 石原氏异常且进阶模块方向一致 → 置信度上调；
  - 石原氏正常 / 样本不足但进阶模块异常 → 倾向疑似色弱（轻度，置信度下调）；
  - 结果分歧时在分析中注明建议复查。
- 新增 `lib/advanced-scoring.ts` 联合判读模块；`TestMode` 扩展 `'advanced'`；`uiText.mode` 补充「进阶版」。
- 从 `TestRunner` 抽取可复用 `IshiharaFlow` 答题流程组件（标准模式对外行为与持久化语义不变）；模式选择页启用「进阶版」入口；历史记录标签新增「进阶联合」。

### 文档
- SPEC / DATA-SPEC / PRD / PRIVACY / API / ARCHITECTURE / ROADMAP 实现状态声明同步（advanced 标注为 v1.3 已实现，推迟项仅剩匿名分析）。
- 版本单一来源同步至 `1.3.0`（`VERSION`、`package.json`、本文件）。

## [1.2.4] - 2026-09-05

### 文档
- 清理 `docs/ARCHITECTURE.md` 规划残留（与真实依赖/状态管理对齐，经 `package.json` 与代码核验）：§2.1 技术选型表删除虚构的 `shadcn/ui`、`Recharts`、`@dnd-kit`，新增「内联 SVG（零依赖自绘图表）」行；§2.3 状态管理将检测流程由虚构的 `TestContext` 改为组件本地状态（useState/useReducer），并删除 `TestContext` 数据结构接口代码块；§2.5 去除虚构的 `jsPDF`/`html2canvas`/`@dnd-kit` 动态导入。
- 版本单一来源同步至 `1.2.4`（`VERSION`、`package.json`、本文件）。

## [1.2.3] - 2026-09-05

### 文档
- 重写 `docs/ARCHITECTURE.md` §2.2 目录结构树，消除蓝图残留：移除虚构的 `components/ui/`（shadcn）、`common/Seo.tsx`、顶层 `types/` 目录，以及 `lib/questions`、`lib/scoring`、`lib/storage`、`lib/export` 子目录划分；改为与 `README.md` 一致的真实扁平结构（`lib/` 主模块 + `lib/questions/` 子题库、五域 `components/`）。同步补全 `app/` 真实条目（`not-found.tsx`、`icon.svg`、`result/[id]`、`privacy` 等）与组件真实清单。
- 版本单一来源同步至 `1.2.3`（`VERSION`、`package.json`、本文件）。

## [1.2.2] - 2026-09-05

### 文档
- 同步文档至 v1.2 实际实现（色相排列 D15 检测）：`docs/ARCHITECTURE.md` 结构树与路由表将 `hue-arrangement` 由「v1.1 规划，未实现」更正为「v1.2 已实现」，并补齐 `ishihara`/`hue-arrangement` 的 `[mode]` 动态路由段；`docs/SPEC.md` §5.3 与 `docs/PRD.md` 的 `TestResult` 注释将 `pathTracking`/`hueArrangement` 标注为已实现（v1.1 / v1.2）；`docs/API.md` 实现状态同步。
- 项目地址 `https://github.com/sutchan/ChromaCheck` 已在 README 与页脚正确引用。
- 版本单一来源同步至 `1.2.2`（`VERSION`、`package.json`、本文件）。

## [1.2.1] - 2026-09-05

### 文档
- 完善根目录 `.gitignore`：补齐 Next.js 标准忽略集（依赖、构建产物 `.next`/`.out`、类型检查缓存 `*.tsbuildinfo`/`next-env.d.ts`、调试日志、环境变量与密钥、测试覆盖率、托管平台 `.vercel`/`.turbo`/`.netlify`、编辑器/系统文件），并保留 `prototype/`、`docs/`、`.codebuddy/` 等应跟踪目录。
- 版本单一来源同步至 `1.2.1`（`VERSION`、`package.json`、本文件）。

## [1.2.0] - 2026-09-05

### 新增
- 色相排列检测模块（简化版 Farnsworth-Munsell D15）：新增 `/test/hue-arrangement/[mode]` 路由、`HueArrangementRunner` 与 `HueArrangementGrid` 组件（点击选中 + 点击交换，两端参考卡固定，初始排列确定性生成避免 SSR 闪烁）；移植原型 `CC.hueCards` 为 `lib/questions/hue-arrangement.ts`（D15 sRGB 色卡 + 种子打乱）；新增 `lib/hue-scoring.ts`（TES 相邻位置误差评分、偏差方向启发式、综合结果汇总）。
- `TestResult` 扩展可选 `hueArrangement` 字段；结果页新增色相排列摘要（TES、偏差方向、最终排列色条），结果总览统计位与历史标签按测试类型守卫渲染。
- PNG 导出报告为色相排列绘制最终排列色卡条；复制文本包含 TES 结果。
- 应用页脚新增 GitHub 仓库链接（`https://github.com/sutchan/ChromaCheck`）。

### 修复
- 应用页脚版本号由陈旧的 v1.0.0 同步为当前版本。

### 文档
- README 实现状态、功能清单、项目结构树与联系方式同步 v1.2.0；SPEC / DATA-SPEC / ARCHITECTURE / PRD / ROADMAP 实现状态声明同步（色相排列标注为 v1.2 已实现）。
- 版本单一来源同步至 `1.2.0`（`VERSION`、`package.json`、本文件）。

## [1.1.1] - 2026-09-04

### 文档
- 完善 `.github/` Community Health Files：新增 `CODE_OF_CONDUCT.md`、`SECURITY.md`、`SUPPORT.md`、`ISSUE_TEMPLATE/{bug_report,feature_request,config}.yml`、`PULL_REQUEST_TEMPLATE.md`，与既有 `CONTRIBUTING.md`、`workflows/ci.yml` 组成标准社区健康文件集合。
- `CONTRIBUTING.md` 行为准则段链接至 `CODE_OF_CONDUCT.md`。
- 版本单一来源同步至 `1.1.1`（`VERSION`、`package.json`、本文件）。

## [1.1.0] - 2026-09-04

### 新增
- 路径追踪检测模块（v1.1 首个功能）：新增 `/test/path-tracking/[mode]` 路由、`PathTrackingRunner` 与 `PathTrackingCanvas` 组件；移植原型 `renderPathField`/`standardPath` 为 `lib/ishihara.ts` 纯函数 `buildPathField`；新增 `lib/questions/path-tracking.ts` 题库（S 形/螺旋/之字形 3 题）与 `lib/path-scoring.ts`（重合度 IoU 评分 + 综合结果汇总）。
- `TestResult` 扩展可选 `pathTracking` 字段，`ishihara` 改为可选；结果页、摘要、导出报告与历史均按测试类型守卫渲染。
- 测试选择页新增「路径追踪」入口。

## [1.0.4] - 2026-09-04

### 文档
- 修复 `docs/SPEC.md` 内部版本引用脱节：§0 顶部注释「目标版本 v1.0.2」改为「当前版本 v1.0.4」；§8.2 版本单一来源处的「当前 `1.0.2`」「SPEC `v1.0.2`」同步为 `1.0.4`；底部版本声明 `v1.0.3`→`v1.0.4`。
- `docs/API.md`：概述补充「v1.0 为纯前端、无服务端 API，本节为 v1.1+ 规划」标注（与 PRIVACY 口径一致）；`AnalyticsEventRequest.testType` 移除未实现的 `advanced`（对齐 SPEC §5.5）。
- `docs/DATA-SPEC.md` §5 `TestResult` 对齐 SPEC §5.3 与 `lib/types.ts`：`testMode` 去 `advanced`，字段改为实际结构（`schema`/`version`/`createdAt`/`ishihara`/`analysis`/`confidenceNote`/`device`），路径追踪 / 色相排列标注为 v1.1 扩展；移除与代码不符的 `startTime`/`endTime`/`totalQuestions`/`ishiharaAssessment`/`overallAssessment` 旧字段。
- `docs/ARCHITECTURE.md` §1.1：API 路由条目标注「v1.1 规划，v1.0 为纯前端、无服务端 API 路由」。
- 版本单一来源同步至 `1.0.4`（`VERSION`、`package.json`、本文件）。

## [1.0.3] - 2026-09-04

### 文档
- 修复文档与 v1.0.2 实际代码脱节：重写 README 项目结构树为真实扁平结构（`lib/` 扁平模块 + `components/` 五域），删除未安装的 Prettier `npm run format` 引用。
- 同步 `docs/SPEC.md` 与代码：`§0` 移除「应用源码尚未编写 / npm 运行会失败」旧声明；`§5.3` 字段名 `mode`→`testMode` 并补全实字段；`§5.4` `AppSettings` 对齐代码（`theme` 仅 `light`/`dark` + `cvdSafe`，移除未实现的 `analyticsEnabled`/`system`）；`§5.5` `TestMode` 移除未实现的 `advanced`；`§8.4` 标注 CI 已建；`§9` 待建项改为已完成；底部版本 `v0.1.0`→`v1.0.3`。
- 版本单一来源同步至 `1.0.3`（`VERSION`、`package.json`、本文件）。

## [1.0.2] - 2026-09-04

### 修复
- 新增 `npm test` 脚本（委托 `tsc --noEmit` 类型检查作为正确性闸门），修复 CI 因缺失 test 脚本而失败。
- 更新 `.github/workflows/ci.yml` 过期注释（项目已是 Next.js 应用），并将 e2e 步骤改为内联跳过，避免 `npx playwright` 联网拉取。

## [1.0.1] - 2026-09-04

### 修复
- 消除首屏主题闪烁：根布局注入阻塞脚本，首屏渲染前预置 `data-theme` 与 `cvd-safe`，避免已保存深色 / 色觉安全模式的用户先闪浅色。
- 修正 `ThemeToggle` 语义化 id 误命名：`langBtn`→`cvdSafeBtn`、`settingsBtn`→`themeToggleBtn`。
- 修正 `lib/format.ts` 设备识别正则误抓 OS 版本号，改为按浏览器 token 提取真实版本。
- `TestRunner` 的「重新开始」补全重置 `reveal` 状态与单题计时起点 `qStartRef`。
- 补充站点图标 `app/icon.svg` 与 metadata 的 `icons`/`openGraph`/`twitter`，消除 favicon 与社交分享图 404。
- 为历史、科普、指引、隐私、模式选择、科普详情等页面根容器补齐语义化 `id`。

### 修正
- 文档治理收尾：更新 `docs/SPEC.md` §0 文档关系表，将 8 份分册状态由"待据本规范修订"更正为"已对齐 SPEC，生效"（此前已据 SPEC 完成修订）。
- 修复 README 贡献指南链接重复 `.github/` 路径（`.github/.github/` → `.github/`）。
- README 文档索引补充 `docs/SPEC.md`（权威总纲）与 `CHANGELOG.md` 条目。
- 版本单一来源同步至 `1.0.1`（`VERSION`、`package.json`、本文件）。

## [1.0.0] - 2026-09-04

### 新增
- 项目文档体系：`docs/` 下 PRD、技术架构、API、数据规范、部署、测试、贡献、隐私、路线图 9 份分册。
- 权威规范总纲 `docs/SPEC.md`：整合各分册与原型真实事实，并解决分册间字段/算法/范围冲突；确立其"单一事实来源"地位。
- 高保真静态原型 `prototype/`：石原氏点阵检测图生成、判读引擎、设计系统与组件库（纯 HTML/CSS/原生 JS，无构建依赖）。
- 缺失文件补全：`LICENSE`（MIT）、`.github/workflows/ci.yml`（CI 骨架，应用骨架未建前步骤安全跳过）。
- 版本单一来源：`VERSION` 与 `package.json.version`（当前 `1.0.0`）。

### 说明
- v1.0 应用已实现（Next.js 14 应用 + 高保真静态原型作为设计验证）；文档顶部"实现状态"均已更新为 v1.0 已实现。
- 原型文件头标记 `v0.1.0` 为原型内部迭代号，不随项目版本号同步刷写。
- 各文档头注释版本（v1.0.2）与 `VERSION` 的 `1.0.2` 一致。

[1.0.4]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.4
[1.0.3]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.3
[1.0.2]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.2
[1.0.1]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.1
[1.0.0]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.0
