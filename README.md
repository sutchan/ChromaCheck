# 色辨 ChromaCheck

> 一眼辨色，科学筛查 — 在线色觉检测 Web 应用

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)

色辨（ChromaCheck）是基于 Web 的在线色觉检测工具，通过标准化石原氏色盲检测图与多种测试范式，帮助用户快速、便捷地筛查色觉异常。纯本地运行、无需注册，检测数据默认仅存储于浏览器。

> **当前版本 v1.10.1**（版本单一来源见 `VERSION`）。已实现：石原氏数字图（快速 10 / 标准 38 题）与智能判读、路径追踪、色相排列（D15）、进阶联合判读、儿童模式、趣味体验包、中英双语、PWA 离线兜底、设置面板等。权威规范见 [docs/SPEC.md](docs/SPEC.md)。

## 功能特性

- 石原氏数字图测试（快速 10 / 标准 38 题）与智能判读（异常类型 / 程度 / 三轴维度）
- 路径追踪描线、色相排列（D15）、进阶联合判读、信号灯辨识、儿童图形识别、批量检测等多种范式
- 结果可视化（维度条形图 / 答题明细）与报告导出（PNG / 打印 PDF / 复制文字）
- 检测历史本地存储，支持多档案与导出 / 导入
- 响应式 + 深色模式 + 色觉安全模式 + 五种色觉视角切换
- 趣味体验包（进度点阵 / 章末轻科普 / 色觉人格分享卡 / 旅人称号），可一键关闭
- 中英双语（i18n）、PWA 离线兜底、Google Analytics 匿名访问统计

## 技术栈

Next.js 14（App Router）+ TypeScript + Tailwind CSS（设计令牌 / CSS 变量，支持深色与色觉安全模式）。图表用内联 SVG，导出用 Canvas + 浏览器打印，不引入重型运行时依赖。

| 类别 | 技术 |
| --- | --- |
| 框架 | Next.js 14（App Router） |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 3 + 设计令牌 |
| 图表 | 内联 SVG |
| 导出 | Canvas（PNG）+ `window.print()`（PDF） |
| 测试 | Vitest |
| 部署 | Vercel / 任意 Node 托管 |

架构详见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)；权威总纲见 [docs/SPEC.md](docs/SPEC.md)。

## 快速开始

要求 Node.js ≥ 18.17。

```bash
npm install          # 安装依赖（亦可用 pnpm / yarn）
npm run dev          # 开发服务器 → http://localhost:3000
npm run build && npm run start   # 构建并启动生产版本
npm run lint && npm run type-check && npm test   # 代码检查 / 类型检查 / 单元测试
```

## 项目结构

```
chromacheck/
├── app/            # 页面：首页（色觉模拟 + FAQ 区块）、检测指引、模式选择、
│                   #   各测试（ishihara / path-tracking / hue-arrangement / advanced / signal / batch / child）、
│                   #   结果、历史、科普、隐私、离线兜底、PWA manifest 与 SEO（robots / sitemap / llms.txt）
├── components/     # common / layout（导航·页脚·主题·语言·设置面板）/ home /
│                   #   test（各测试交互与渲染）/ result（摘要·图表·导出·分享卡）/
│                   #   history（档案切换·历史卡片）/ analytics / pwa
├── lib/            # types / site / 题库（questions + questions/）/ 判读（scoring、path-scoring、
│                   #   hue-scoring、advanced-scoring、child-scoring）/ 趣味（fun、sharecard）/
│                   #   i18n/（中英字典与 t()）/ profile / export-import / ishihara / storage /
│                   #   learn-data / format / analytics
├── docs/           # 项目文档（SPEC.md 为权威总纲）
├── prototype/      # 高保真静态原型（设计验证参考，无运行依赖）
├── .github/        # 贡献指南 + CI
└── 配置文件与元数据  # next.config / tailwind / postcss / tsconfig / eslint / VERSION / LICENSE
```

## 文档

权威总纲 [docs/SPEC.md](docs/SPEC.md)；分册：PRD / ARCHITECTURE / API / DATA-SPEC / DEPLOYMENT / TESTING / PRIVACY / ROADMAP（均在 `docs/`），任务跟踪 `docs/TASKS.md`、`docs/tasks-done.md`；开发约定见 [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md)；版本记录见 [CHANGELOG.md](CHANGELOG.md)。

## 高保真原型

纯静态、无依赖，浏览器直接打开：`prototype/prototype.html`（可交互 + 色觉模拟）、`wireframes.html`（组件库）、`design-system.html`（设计系统）、`interaction.html`（交互标准）。

## 开发规范

提交遵循 [Conventional Commits](https://www.conventionalcommits.org/)：`feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `chore`。分支：`main`（生产）/ `develop` / `feature/*`。

## 部署

**Vercel（推荐）**：导入仓库，构建命令自动识别为 `next build`。**Docker**：

```bash
docker build -t chromacheck . && docker run -p 3000:3000 chromacheck
```

## 隐私与免责

- 本工具仅用于色觉筛查参考，**不能替代专业医学诊断**。
- 检测结果受屏幕显示、环境光线影响；如结果异常，请前往正规医院眼科检查。
- 检测数据默认仅存于本地浏览器；站点仅发起 Google Analytics 匿名访问统计（不含答题记录与判读结果），详见 [docs/PRIVACY.md](docs/PRIVACY.md)。

## License

[MIT](LICENSE)

## 联系方式

- 项目地址：<https://github.com/sutchan/ChromaCheck>
- 问题反馈：<https://github.com/sutchan/ChromaCheck/issues>

---

*色辨 ChromaCheck — 让每个人都能了解自己的色彩世界*
