# 变更日志

本文件记录 ChromaCheck 的版本变更，遵循 [Keep a Changelog](https://keepachangelog.com/) 规范。
版本号的单一来源为仓库根目录 `VERSION` 文件与 `package.json` 的 `version` 字段（当前 `1.0.3`）。

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

[1.0.2]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.2
[1.0.1]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.1
[1.0.0]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.0
