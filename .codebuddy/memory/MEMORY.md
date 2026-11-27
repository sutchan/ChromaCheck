# ChromaCheck 项目记忆索引

> 最后核对：2026-11-27 · 核对版本：**v1.17.6**（实查 `VERSION` / `package.json` / `package-lock.json` 一致）
> 权威规范：`docs/SPEC.md`（项目总纲）；本目录记录**决策背景与工程约束**，不重复规范条文。
> 可信度标记：`[现行]` 已由代码或 SPEC 核对 · `[指示]` 来自用户明确要求 · `[历史]` 当时快照，勿当现状 · `[待核]` 需复核。

## 一、项目基本盘（现行）

| 主题 | 关键结论 | 依据 / 时效 |
|------|----------|-------------|
| 定位 | 纯前端色觉筛查工具，筛查与科普，**非医疗诊断**；无账号、无 PII 上传、无服务端状态 | `[现行]` `docs/SPEC.md` §1 / §7 |
| 技术栈 | Next.js 16.4.6 App Router + React 19 + TS strict + Tailwind 3；报告 Canvas PNG + `window.print()` PDF；图表内联 SVG | `[现行]` `SPEC.md` §2 |
| 版本 | 单一来源 `VERSION` / `package.json` / `package-lock.json`，当前 `1.17.6`；每次改动 bump 最小版本，仅被改文件头注释更新 | `[现行]` `SPEC.md` §8.2 |
| 质量门禁 | Vitest 17 文件 116 例（node 环境）；覆盖率 89.53% lines / 84.3% branches / 87.64% functions；E2E 本地连续三次通过；CI Node 22 + checkout/setup-node v5 + `npm ci`，含 OpenAPI / 文档 / coverage / E2E 步骤；组件测试未引入 | `[现行]` `SPEC.md` §8.4 |
| 存储 | 7 个扁平 `localStorage` 键（settings/results/progress/lang/profiles/activeProfile/batch），无聚合对象；核心键走 `safeSet` 降级 | `[现行]` `SPEC.md` §5.4 |
| 路由 | 唯一现存 Route Handler 为 `llms.txt` / `llms-full.txt`；`/api/*` 均未实现或已删除 | `[现行]` `SPEC.md` §2.3 |
| 判读边界 | 题库降级为消失型，`type` 恒为 `null`；**不得宣称可区分红/绿/蓝黄类型** | `[现行]` `SPEC.md` §6.4 |
| 已知边界 | 生产依赖 critical 审计为 0；首页 CTA 与 E2E 断言一致且本地连续三次通过；规范域名已收敛至 `chroma.appti.cn`；仅 O-10 / O-11 两个产品远景保留开放 | `[现行]` `docs/tasks.md` / `docs/tasks-done.md` §九 |
| 语言 | 三语优先级 简体中文 `zh` > 繁体中文 `zh-TW` > 英语 `en`；内容型文案三语齐全 | `[指示]` `SPEC.md` §8.5 |

## 二、主题深挖（按主题归类，优先查阅）

| 主题 | 记忆文件 | 时效 | 可信度 | 一句话结论 |
|------|----------|------|--------|------------|
| 当前状态（版本 / 门禁 / 决策） | [current-state-2026-11-27.md](current-state-2026-11-27.md) | 2026-11-27 / v1.17.6 | `[现行]` | README / 架构 / API / 记忆一致性入口；含已知问题与待办链接 |
| 页脚版本 / 构建号 | [footer_version_build.md](footer_version_build.md) | 2026-11-27 复核 / v1.17.5 | `[指示]` `[现行]` | `V{ver}· build {10位yymmddhhmm}`，只在页脚，页眉禁版本号 |
| 审查与修复要点（2026-11-05） | [review-2026-11-05.md](review-2026-11-05.md) | 2026-11-22 校正 | `[历史]` 部分条目已失效，见文件内标注 | JSON-LD `safeJson()` 转义勿删；Canvas 不可单测 |
| 字体与离线构建 | 仓库外 `font_selfhost_offline_build.md` | 2026-11-22 复核 | `[指示]` `[现行]` | 禁改回 `next/font/google`；woff2 随仓库提交 + `next/font/local` |
| 三语国际化 | 仓库外 `i18n_trilingual.md` | 2026-11-22 复核 | `[指示]` `[现行]` | `LANGS` 顺序即优先级；繁体字典由 opencc-js `s2twp` 生成 |
| 外部自动提交 | 仓库外 `parallel_autocommit_artifacts.md` | 2026-11-22 复核 | `[现行]` | 会话间隙外部进程会 bump / commit；验证产物放仓库外 |
| 原型 200 行豁免 | 仓库外 `prototype_reference_exempt.md` | 2026-11-22 复核 | `[指示]` `[现行]` | `prototype/` 是设计参考，经典全局脚本不机械拆分 |
| 仓库外主题索引 | `C:/Users/Admin/.codebuddy/projects/e-Github-ChromaCheck/memory/MEMORY.md` | 2026-11-22 | `[现行]` | 跨会话主题记忆的唯一入口 |

## 三、工程约束与坑（现行）

- **构建**：`next build` 可能被 IDE 的 node-safe-delete 护栏拦截（ETIMEDOUT）；本地可设 `CODEBUDDY_SAFE_DELETE_ENABLED=0` 或换全新 `distDir`；CI 不受影响。`[现行]`
- **社交图**：`app/opengraph-image.tsx` 在 Node 26 预渲染失败，已改用静态 `public/og-default.png`（1200×630）；**勿改回运行时生成**。`[现行]`
- **CI**：`package-lock.json` 自 v1.11.2 起已提交；`ci.yml` 用 `npm ci` 且**不配 `cache`**，门禁含 lint / type-check / check:openapi / check:docs / test / coverage / build / playwright install / e2e。`[现行]`
- **校验命令**：`npm run check:docs`、`npm run check:openapi`、`npm test`、`npm run test:coverage` 是文档 / API / 代码一致性的最小复核链。`[现行]`
- **版本漂移**：改版本前必须重读 `VERSION` + `package.json` + `CHANGELOG` 头，禁止按会话记忆盲写；目标版本节已存在则追加。`[现行]`
- **仓库结构**：`.github/` 已规范化（含 workflows），**禁止新建 `.github/readme.md`**；`ChromaCheck.code-workspace` 为独份工作区配置，禁止删除。`[指示]`
- **DOM id**：主要容器用 kebab-case 语义 id（`app-header` / `app-footer` / `main-content` / `history-page` / `privacy-page` / `result-summary`）。`[指示]`

## 四、历史资料（按时间线，仅供追溯，勿当现状）

| 日期 | 文件 | 状态 |
|------|------|------|
| 2026-09-21 | [2026-09-21.md](2026-09-21.md) | `[历史]` 字体决策已推翻（曾写 `next/font/google`，现禁用）；SPEC 版本已远超当时值 |
| 2026-10-13 ~ 10-17 | [2026-10-13.md](2026-10-13.md) · [10-14](2026-10-14.md) · [10-15](2026-10-15.md) · [10-16](2026-10-16.md) · [10-17](2026-10-17.md) | `[历史]` 事件上报 / lockfile / `lib/i18n.ts` 等条目已被后续版本覆盖 |
| 2026-11-02 ~ 11-03 | [2026-11-02.md](2026-11-02.md) · [2026-11-03.md](2026-11-03.md) | `[历史]` 测试数 97 先更新为 107，当前基线为 17 文件 116 例；IDE / 端口等环境细节属当时快照 |

## 五、跨项目通用规则（长期沿用）

- 中文对话、精简直给；源码单文件 >200 行按职责拆分（文档不拆）。`[指示]`
- 每次修改 bump 最小版本；仅被改动文件头注释更新，禁全仓库刷写。`[指示]`
- 版本与 build 只在页脚展示，格式见主题文件；页眉禁版本号。`[指示]`
- 语义化 id、无障碍与可访问性要求见 `docs/SPEC.md` §8.1。
- 未完成任务只写入 `docs/tasks.md`；README / 分册 / CHANGELOG / 记忆只保留证据与链接，不维护第二份清单。`[指示]`
- 文档与记忆须同版本、同日期标注；代码事实优先，发现漂移时同步修订 README、架构、API、SPEC 与对应记忆条目。`[指示]`

> 本索引只保留**可快速定位的入口与结论**；细节见上表链接文件与 `docs/SPEC.md`。发现与代码不符时，以代码和 SPEC 为准并修订对应记忆条目。
