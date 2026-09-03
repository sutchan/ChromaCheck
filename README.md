# 色辨 ChromaCheck

> 一眼辨色，科学筛查 — 在线色觉检测 Web 应用

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)

## 项目简介

色辨（ChromaCheck）是一款基于 Web 的在线色觉检测工具，通过标准化的石原氏色盲检测图（Ishihara Test）及多种色觉测试范式，帮助用户快速、便捷地筛查色觉异常。

本项目使用 **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS** 构建。

## 功能特性

- 石原氏数字图测试（快速版 10 题 / 标准版 24 题）
- 路径追踪图测试（区分红/绿色盲类型）
- 色相排列测试（简化版 Farnsworth-Munsell D15）
- 智能判读算法（基于答题模式推断异常类型与程度）
- 结果可视化（雷达图、条形图、答题明细）
- 报告导出（PNG / PDF）
- 检测历史本地存储（无需注册）
- 响应式设计（桌面 / 平板 / 手机）
- 深色模式支持

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 14.x |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 3.x |
| UI 组件 | shadcn/ui + Radix UI | latest |
| 图表 | Recharts | 2.x |
| 拖拽 | @dnd-kit/core | 6.x |
| 导出 | html2canvas + jsPDF | latest |
| 代码规范 | ESLint + Prettier | latest |
| 部署 | Vercel | — |

详细技术架构见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

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

# Prettier 格式化
npm run format

# 类型检查
npm run type-check
```

## 项目结构

```
chromacheck/
├── app/                          # Next.js App Router 页面
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   ├── globals.css               # 全局样式
│   ├── guide/                    # 检测前指引
│   │   └── page.tsx
│   ├── test/                     # 检测模块
│   │   ├── page.tsx              # 测试选择页
│   │   ├── ishihara/             # 石原氏测试
│   │   │   └── page.tsx
│   │   ├── path-tracking/        # 路径追踪测试
│   │   │   └── page.tsx
│   │   └── hue-arrangement/      # 色相排列测试
│   │       └── page.tsx
│   ├── result/                   # 结果页
│   │   └── page.tsx
│   ├── learn/                    # 科普模块
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   └── history/                  # 历史记录
│       └── page.tsx
├── components/                   # 可复用组件
│   ├── ui/                       # shadcn/ui 基础组件
│   ├── layout/                   # 布局组件（Navbar、Footer 等）
│   ├── test/                     # 测试相关组件
│   │   ├── IshiharaPlate.tsx
│   │   ├── TestProgress.tsx
│   │   ├── PathTrackingCanvas.tsx
│   │   └── HueArrangementGrid.tsx
│   ├── result/                   # 结果展示组件
│   │   ├── ResultSummary.tsx
│   │   ├── ResultChart.tsx
│   │   └── AnswerDetail.tsx
│   └── common/                   # 通用组件
├── lib/                          # 业务逻辑与工具函数
│   ├── questions/                # 题库数据
│   │   ├── ishihara.ts
│   │   ├── path-tracking.ts
│   │   └── hue-arrangement.ts
│   ├── scoring/                  # 判读算法
│   │   ├── ishihara-scoring.ts
│   │   ├── path-scoring.ts
│   │   └── hue-scoring.ts
│   ├── storage/                  # 本地存储
│   │   └── localStorage.ts
│   ├── export/                   # 报告导出
│   │   └── report-export.ts
│   └── utils.ts                  # 通用工具函数
├── types/                        # TypeScript 类型定义
│   ├── question.ts
│   ├── result.ts
│   └── storage.ts
├── public/                       # 静态资源
│   ├── plates/                   # 检测图资源
│   ├── images/                   # 其他图片
│   └── favicon.ico
├── docs/                         # 项目文档
│   ├── PRD.md                    # 产品需求文档
│   ├── ARCHITECTURE.md           # 技术架构文档
│   ├── API.md                    # 接口文档
│   ├── DATA-SPEC.md              # 数据规范文档
│   ├── DEPLOYMENT.md             # 部署文档
│   ├── TESTING.md                # 测试策略文档
│   ├── PRIVACY.md                # 隐私与合规文档
│   ├── ROADMAP.md                # 路线图文档
│   └── CONTRIBUTING.md           # 贡献指南
├── .eslintrc.json                # ESLint 配置
├── .prettierrc                   # Prettier 配置
├── tailwind.config.ts            # Tailwind 配置
├── postcss.config.js             # PostCSS 配置
├── tsconfig.json                 # TypeScript 配置
├── next.config.js                # Next.js 配置
├── package.json                  # 项目依赖
└── README.md                     # 项目说明（本文件）
```

## 文档索引

| 文档 | 说明 |
|------|------|
| [产品需求文档 (PRD)](docs/PRD.md) | 产品定义、功能需求、非功能需求、用户流程、排期 |
| [技术架构文档](docs/ARCHITECTURE.md) | 架构设计、技术选型、核心模块设计 |
| [接口文档](docs/API.md) | API 路由设计、请求/响应规范 |
| [数据规范文档](docs/DATA-SPEC.md) | 题库结构、结果结构、本地存储规范 |
| [部署文档](docs/DEPLOYMENT.md) | Vercel / Docker 部署指南 |
| [测试策略文档](docs/TESTING.md) | 单元/集成/手动测试计划 |
| [隐私与合规文档](docs/PRIVACY.md) | 数据收集、存储、合规要求 |
| [路线图文档](docs/ROADMAP.md) | 版本规划与未来方向 |
| [贡献指南](docs/CONTRIBUTING.md) | 开发流程、代码规范 |

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

## License

[MIT](LICENSE)

## 联系方式

- 项目地址：[GitHub Repository]
- 问题反馈：[Issues]
- 邮箱：[contact@chromacheck.example]

---

*色辨 ChromaCheck — 让每个人都能了解自己的色彩世界*
