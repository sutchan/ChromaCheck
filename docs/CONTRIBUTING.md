# 贡献指南

> **规范遵循**：本文档为 [docs/SPEC.md](docs/SPEC.md) 的子主题分册；若与 SPEC 冲突，以 SPEC 为准。
> **实现状态**：当前为「文档 + 高保真静态原型」阶段，Next.js 应用源码尚未实现；§开发环境 的 npm 流程仅适用于实现阶段，当前不适用。

感谢你对色辨 ChromaCheck 的关注！本文档描述了如何参与项目贡献。

## 开发环境搭建

### 前置要求

- Node.js >= 18.17.0
- npm >= 9.0.0（或 pnpm / yarn）
- Git

### 克隆项目

```bash
git clone <repository-url>
cd chromacheck
```

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看效果。

## 开发流程

### 1. 创建分支

从 `develop` 分支创建功能分支：

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

分支命名规范：
- `feature/*` — 新功能
- `fix/*` — Bug 修复
- `docs/*` — 文档更新
- `refactor/*` — 代码重构
- `perf/*` — 性能优化

### 2. 开发

- 遵循项目代码规范（ESLint + Prettier）
- 新增功能需编写对应的单元测试
- 保持提交粒度合理，每个提交做一件事

### 3. 提交代码

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

Type 可选值：
- `feat` — 新功能
- `fix` — Bug 修复
- `docs` — 文档
- `style` — 代码格式（不影响功能）
- `refactor` — 重构
- `perf` — 性能优化
- `test` — 测试
- `chore` — 构建/工具

示例：

```
feat(ishihara): 添加快速版10题测试模式

- 新增快速版题库筛选函数
- 测试页增加模式选择
- 更新结果页适配快速版结果

Closes #123
```

### 4. 推送并创建 PR

```bash
git push origin feature/your-feature-name
```

在 GitHub 上创建 Pull Request，目标分支为 `develop`。

PR 描述模板：

```
## 变更内容
简要描述本次变更的内容。

## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化

## 测试
- [ ] 单元测试通过
- [ ] 手动测试通过
- [ ] 无需测试（说明原因）

## 截图/录屏
（如涉及 UI 变更，请附上截图）

## 关联 Issue
Closes #xxx
```

## 代码规范

### TypeScript

- 所有文件使用 TypeScript，禁止使用 `any`（如必须使用，需加注释说明原因）。
- 类型定义放在 `types/` 目录，组件内联类型优先。
- 使用 `interface` 定义对象类型，`type` 定义联合类型和工具类型。

### React

- 使用函数组件 + Hooks，不使用 Class 组件。
- 组件文件使用 `.tsx` 扩展名。
- Props 使用 `interface` 定义，并导出。
- 避免不必要的 `useEffect`，优先使用派生状态。
- 列表渲染必须加 `key`，且使用稳定的唯一标识。

### 样式

- 使用 Tailwind CSS 原子类，避免自定义 CSS。
- 如需自定义样式，使用 CSS 变量 + `globals.css`。
- 颜色使用设计系统变量（`primary`、`secondary` 等），不硬编码色值。
- 响应式优先使用移动端优先（`md:`、`lg:` 等）。

### 目录规范

- 页面组件放在 `app/` 目录，遵循 Next.js App Router 规范。
- 可复用组件放在 `components/` 目录，按功能域分子目录。
- 业务逻辑放在 `lib/` 目录，纯函数优先。
- 静态资源放在 `public/` 目录。

## 测试规范

### 单元测试

- 测试文件与源文件同目录，命名为 `*.test.ts` 或 `*.test.tsx`。
- 测试用例描述清晰，使用 `describe` + `it` 结构。
- 判读算法必须覆盖边界用例和异常输入。

### 集成测试

- 使用 Playwright，测试文件放在 `e2e/` 目录。
- 覆盖核心用户流程（检测、结果、导出）。

## 常见问题

### 依赖安装失败

尝试清除缓存后重新安装：

```bash
rm -rf node_modules package-lock.json
npm install
```

### 开发服务器启动失败

1. 确认端口 3000 未被占用。
2. 删除 `.next` 目录后重启。
3. 确认 Node.js 版本符合要求。

## 行为准则

参与本项目即表示你同意遵守以下准则：

- 尊重他人，友善沟通。
- 接受建设性的批评和建议。
- 关注项目整体利益，不引入恶意代码。
- 保护用户隐私，不收集或泄露用户数据。

## 联系方式

- 项目地址：[GitHub Repository]
- 问题反馈：[Issues]
- 邮箱：[contact@chromacheck.example]

再次感谢你的贡献！
