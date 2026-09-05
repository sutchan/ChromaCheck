# 变更日志

本文件记录 ChromaCheck 的版本变更，遵循 [Keep a Changelog](https://keepachangelog.com/) 规范。
版本号的单一来源为仓库根目录 `VERSION` 文件与 `package.json` 的 `version` 字段（当前 `1.2.3`）。

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
