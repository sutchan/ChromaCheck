# 色辨 ChromaCheck

> 一眼辨色，科学筛查 — 在线色觉检测 Web 应用

> **实现状态**：v1.0 已实现（Next.js 14 应用 + 石原氏检测 + 结果/历史/科普/隐私）；路径追踪已于 v1.1 实现，色相排列（D15）已于 v1.2 实现，进阶联合判读（advanced）已于 v1.3 实现，趣味性体验包（进度点阵/章末科普/分享卡/换一双眼睛/三轴科普/旅人称号）已于 v1.4 实现。权威规范见 [docs/SPEC.md](docs/SPEC.md)。当前项目版本 **v1.7.0**（见 `VERSION`）；38 板完整石原氏图谱已于 v1.5 实现，Google Analytics 匿名访问统计已于 v1.5.1 接入，SEO/GEO（sitemap/robots/结构化数据/llms.txt/社交图）已于 v1.6.0 完善；驾驶员场景色觉检测改进（驾照辨色力参考栏 / 信号灯辨识 / 屏幕校准提示 / 图版明度控制 / 严肃场景隐藏趣味）已于 v1.7.0 实现（详见 [docs/TASKS.md](docs/TASKS.md)）。

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)

## 项目简介

色辨（ChromaCheck）是一款基于 Web 的在线色觉检测工具，通过标准化的石原氏色盲检测图（Ishihara Test）及多种色觉测试范式，帮助用户快速、便捷地筛查色觉异常。

本项目使用 **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS** 构建。

## 功能特性

- 石原氏数字图测试（快速版 10 题 / 标准版 38 题）— **已实现**
- 智能判读算法（基于答题模式推断异常类型、程度与三轴维度）— **已实现**
- 结果可视化（维度条形图、答题明细、错误模式）— **已实现**
- 报告导出（PNG / 打印另存 PDF / 复制文字）— **已实现**
- 检测历史本地存储（无需注册，可查看/删除/清空）— **已实现**
- 响应式设计（桌面 / 平板 / 手机）— **已实现**
- 深色模式 + 色觉安全模式 — **已实现**
- 路径追踪描线测试（区分红/绿色盲类型）— **已实现（v1.1）**
- 色相排列测试（简化版 Farnsworth-Munsell D15）— **已实现（v1.2）**
- 进阶联合检测（石原氏 + 路径追踪 + 色相排列交叉验证）— **已实现（v1.3）**
- 趣味性体验包：进度点阵仪式感、章末轻科普过渡、中性提交反馈、色觉人格分享卡（Canvas PNG）、换一双眼睛（五种色觉视角）、三轴互动科普、旅人隐喻称号 — **已实现（v1.4）**；`趣味`开关可统一关闭（不影响判读）

## 技术栈

> v1.0 实际落地：以 Next.js + TypeScript + Tailwind 为核心，图表用内联 SVG、导出用 Canvas + 浏览器打印，不引入重型依赖。路径追踪（v1.1，纯 Canvas）与色相排列（v1.2，点击交换，无需拖拽库）均无需额外依赖。

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 14.x |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS + 设计令牌（CSS 变量，支持深色与色觉安全模式） | 3.x |
| 图表 | 内联 SVG（自绘维度条形图） | — |
| 导出 | Canvas（PNG）+ `window.print()`（PDF） | — |
| 代码规范 | ESLint（next/core-web-vitals） | latest |
| 部署 | Vercel / 任意静态 Node 托管 | — |

详细技术架构见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

项目规范（权威总纲，各分册冲突以之为准）：[docs/SPEC.md](docs/SPEC.md)。

## 快速开始

### 环境要求

- Node.js >= 18.17.0
- npm >= 9.0.0 或 pnpm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm（推荐）
pnpm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)。

### 构建生产版本

```bash
npm run build
npm run start
```

### 代码检查与格式化

```bash
# ESLint 检查
npm run lint

# 类型检查
npm run type-check
```

## 项目结构

> 下方为实际落地结构（与 `docs/ARCHITECTURE.md` 一致）。`lib/` 为主模块 + `lib/questions/` 子目录；路径追踪已于 v1.1 实现（`app/test/path-tracking/[mode]`），色相排列已于 v1.2 实现（`app/test/hue-arrangement/[mode]`），进阶联合判读已于 v1.3 实现（`app/test/advanced`）。

```
chromacheck/
├── app/                          # Next.js App Router 页面
│   ├── layout.tsx                # 根布局（含 ThemeProvider、GoogleAnalytics）
│   ├── page.tsx                  # 首页（含色觉模拟 CvdSimulator）
│   ├── not-found.tsx             # 404
│   ├── globals.css               # 全局样式 + 设计令牌
│   ├── icon.svg                  # 站点图标
│   ├── guide/page.tsx            # 检测前指引
│   ├── test/
│   │   ├── page.tsx              # 模式选择（快速 / 标准 / 路径追踪 / 色相排列 / 进阶联合）
│   │   ├── ishihara/[mode]/page.tsx   # 石原氏测试
│   │   ├── path-tracking/[mode]/page.tsx   # 路径追踪测试（v1.1）
│   │   ├── hue-arrangement/[mode]/page.tsx # 色相排列测试（v1.2）
│   │   └── advanced/page.tsx     # 进阶联合检测（v1.3）
│   ├── result/[id]/page.tsx      # 结果页
│   ├── learn/
│   │   ├── page.tsx              # 科普列表
│   │   └── [slug]/page.tsx       # 科普详情
│   ├── history/page.tsx          # 历史记录
│   └── privacy/page.tsx          # 隐私政策
├── components/
│   ├── common/                   # Callout、Icon
│   ├── home/                     # CvdSimulator
│   ├── layout/                   # Footer、Navbar、ThemeProvider、ThemeToggle
│   ├── analytics/                # GoogleAnalytics（GA4 脚本注入与路由上报，v1.5.1）
│   ├── result/                   # AnswerReview、AxisChart、ReportActions、ResultSummary、PathTrackingSummary、HueArrangementSummary、EyesSwitcher、DimScenes、DriverCompliance
│   └── test/                     # IshiharaPlate、Numpad、TestProgress、IshiharaFlow、FunBits、TestRunner、PathTrackingCanvas、PathTrackingRunner、HueArrangementGrid、HueArrangementRunner、AdvancedRunner、SignalRunner
├── lib/
│   ├── types.ts                  # 全局类型（以 docs/SPEC.md §5 为权威）
│   ├── questions.ts              # 石原氏题库数据
│   ├── questions/                # 子题库（path-tracking.ts、hue-arrangement.ts）
│   ├── scoring.ts                # 判读引擎
│   ├── path-scoring.ts           # 路径追踪判读（v1.1）
│   ├── hue-scoring.ts            # 色相排列 TES 判读（v1.2）
│   ├── advanced-scoring.ts       # 进阶联合判读（v1.3）
│   ├── fun.ts                    # 趣味性数据（章节/旅人称号/三轴科普，v1.4）
│   ├── sharecard.ts              # 色觉人格分享卡 Canvas 绘制（v1.4）
│   ├── analytics.ts              # GA4 衡量 ID 与上报辅助（v1.5.1）
│   ├── ishihara.ts              # 点阵生成与色觉模拟
│   ├── storage.ts                # 本地存储
│   ├── learn-data.ts             # 科普文章数据
│   └── format.ts                 # 格式化工具
├── docs/                         # 项目文档（SPEC.md 为权威总纲）
│   ├── SPEC.md
│   ├── PRD.md / ARCHITECTURE.md / API.md / DATA-SPEC.md
│   ├── DEPLOYMENT.md / TESTING.md / PRIVACY.md / ROADMAP.md
│   └── （贡献约定见 .github/CONTRIBUTING.md）
├── prototype/                    # 高保真静态原型（设计验证参考）
├── .github/
│   ├── CONTRIBUTING.md
│   └── workflows/ci.yml
├── .eslintrc.json                # ESLint 配置
├── .gitignore
├── tailwind.config.ts            # Tailwind 配置
├── postcss.config.mjs            # PostCSS 配置
├── next.config.mjs               # Next.js 配置
├── tsconfig.json                 # TypeScript 配置
├── package.json                  # 项目依赖
├── package-lock.json
├── VERSION                       # 版本单一来源
├── LICENSE                       # MIT
└── README.md                     # 项目说明（本文件）
```

## 文档索引

| 文档 | 说明 |
|------|------|
| [项目规范（权威总纲）](docs/SPEC.md) | 单一事实来源：产品/架构/数据/算法/设计/合规/治理 |
| [产品需求文档 (PRD)](docs/PRD.md) | 产品定义、功能需求、非功能需求、用户流程、排期 |
| [技术架构文档](docs/ARCHITECTURE.md) | 架构设计、技术选型、核心模块设计 |
| [接口文档](docs/API.md) | API 路由设计、请求/响应规范 |
| [数据规范文档](docs/DATA-SPEC.md) | 题库结构、结果结构、本地存储规范 |
| [部署文档](docs/DEPLOYMENT.md) | Vercel / Docker 部署指南 |
| [测试策略文档](docs/TESTING.md) | 单元/集成/手动测试计划 |
| [隐私与合规文档](docs/PRIVACY.md) | 数据收集、存储、合规要求 |
| [路线图文档](docs/ROADMAP.md) | 版本规划与未来方向 |
| [贡献指南](.github/CONTRIBUTING.md) | 开发流程、代码规范 |
| [变更日志](CHANGELOG.md) | 版本变更记录 |

## 高保真原型

无需构建，直接在浏览器打开即可预览（纯静态 HTML + CSS + 原生 JS，无运行依赖）。三个页面互相链接，组成完整原型集：

| 文件 | 说明 |
|------|------|
| [prototype/prototype.html](prototype/prototype.html) | 高保真可交互原型：完整视觉设计稿 + 动效 + 真实数据；支持桌面/平板/手机画框切换与色觉模拟 |
| [prototype/wireframes.html](prototype/wireframes.html) | 组件库规范：基础组件 / 复合组件 / 业务组件 + 组件使用总规则与无障碍基线 |
| [prototype/design-system.html](prototype/design-system.html) | 设计系统：色彩、字体、间距/圆角/阴影、图标、动效令牌与色觉模拟基线 |
| [prototype/interaction.html](prototype/interaction.html) | 交互标准：模式 / 反馈 / 错误 / 空状态的可交互规范 |

原型目录结构：

```
prototype/
├── prototype.html               # 高保真可交互产品原型（真实数据）
├── wireframes.html              # 组件库规范（基础/复合/业务组件）
├── design-system.html           # 设计系统（色彩/字体/间距/图标/动效）
├── interaction.html             # 交互标准（模式/反馈/错误/空状态）
└── assets/
    ├── css/                     # tokens / ui / screens / screens-test / docs
    └── js/                      # 数据、判读、石原氏绘制、图表、屏幕渲染、图标库、组件目录、各页脚本
```

## 开发规范

### Git 提交信息

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 新增功能
fix: 修复 bug
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
```

### 分支策略

- `main` — 生产分支，保护分支
- `develop` — 开发分支
- `feature/*` — 功能分支
- `fix/*` — 修复分支

## 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 [Vercel](https://vercel.com) 导入项目
3. 构建命令自动识别为 `next build`
4. 配置环境变量（如有）
5. 点击 Deploy

### Docker 部署

```bash
# 构建镜像
docker build -t chromacheck .

# 运行容器
docker run -p 3000:3000 chromacheck
```

## 隐私与免责声明

- 本工具仅用于色觉筛查参考，**不能替代专业医学诊断**。
- 检测结果可能受屏幕显示、环境光线等因素影响。
- 如检测结果异常，建议前往正规医院眼科进行专业检查。
- 用户检测数据默认仅存储于本地浏览器，不会上传至服务器。
- 本站使用 Google Analytics 统计匿名访问量（不含答题记录与判读结果），可用浏览器脚本拦截插件屏蔽。

## License

[MIT](LICENSE)

## 联系方式

- 项目地址：[GitHub Repository](https://github.com/sutchan/ChromaCheck)
- 问题反馈：[Issues](https://github.com/sutchan/ChromaCheck/issues)
- 邮箱：[contact@chromacheck.example]

---

*色辨 ChromaCheck — 让每个人都能了解自己的色彩世界*
