# 色辨 ChromaCheck 测试策略文档

> **规范遵循**：本文档为 [SPEC.md](./SPEC.md) 的子主题分册；若与 SPEC 冲突，以 SPEC 为准。判读引擎测试以 SPEC §6 与 `lib/scoring.ts` 为权威。
> **实现状态**：v1.17.6（相关任务见 [tasks.md](./tasks.md) O-03）：Vitest 17 文件 116 例（node 环境）；V8 覆盖率 89.53% lines / 84.3% branches / 87.64% functions 达标；Playwright 配置、依赖、脚本与 CI 已接入，但首页 CTA 路由断言与当前实现不一致，需先对齐再验收连续三次稳定运行；组件测试未落地。判读引擎测试以 SPEC §6 与 `lib/scoring.ts` 为权威。

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.17.6 |
| 创建日期 | 2026-09-03 |

---

## 1. 测试总览

本项目采用分层测试策略，当前覆盖单元测试、覆盖率门禁、Playwright 主链路 E2E 与手动检查清单；组件测试未落地，E2E 已接入 CI，但需先对齐首页 CTA 路由断言，再做连续三次稳定验收。

| 层级 | 工具 | 重点 |
|------|------|------|
| 单元测试 | Vitest（node 环境） | 判读算法、工具函数、存储封装 —— **已落地，17 文件 116 例** |
| 组件测试 | Vitest + React Testing Library | UI 组件渲染与交互 —— **规划中，未落地**（无 jsdom/happy-dom、无 RTL 依赖） |
| 集成测试 | Playwright | 主链路回归与语言切换 `html lang` —— **配置 / 依赖 / 脚本 / CI 已接入** |
| 端到端测试 | Playwright | 完整检测链路 —— **已接入 CI，首页 CTA 路由断言待对齐，随后验收连续三次稳定**（O-03） |
| 手动测试 | 人工 | 兼容性、无障碍、色彩准确性 |

---

## 2. 单元测试

### 2.1 测试范围

#### 判读算法（`lib/scoring.ts` 等 `lib/*-scoring.ts`）— 最高优先级

| 文件 | 测试重点 |
|------|----------|
| `scoring.ts` | 消失题 / 演示题边界用例、hit 恒 0 下的类型退化（type 输出 null 未分型，v1.15.1 起不再默认输出 deutan 系）、tritan 推算值、程度与判读稳定性计算 |
| `path-scoring.ts` | 路径 `pathF1` 重合度计算与阈值判定（F1 思路，非 IoU） |
| `hue-scoring.ts` | TES 计算、偏差方向判定 |

**判读算法测试用例清单**：

```
describe('scoreIshiharaTest')
  - 全部答对 → normal
  - 全部答错（正常色觉答案）→ suspected_blindness
  - 消失题答错 2 题 → suspected_deficiency
  - 消失题答错 4 题 → suspected_blindness
  - 转换题答案匹配 protan → protanopia/protanomaly（**当前题库无转换题，protan 分支不可达**）
  - 无转换 / 分类题时 protanHit = deutanHit = 0 → type 恒为 null（未分型，v1.15.1）
  - 演示题答错 → inconclusive 或降低置信度
  - 答题过快 → 置信度降低
  - 空答案数组 → 边界处理
  - 未知题目 ID → 忽略处理
  - 答题矛盾 → 置信度降低（当前不可达）
```

#### 工具函数（`lib/format.ts`）

- `formatDate()` 日期格式
- `formatDuration()` 时长格式（含多语言）
- `detectDevice()` 设备/UA 摘要（含多语言）

#### 存储封装（`lib/storage.ts`）

- 设置读写与默认值合并（`cc.settings.v1`）
- 测试进度保存/恢复/清除（`cc.progress.v1`）
- 结果保存与历史记录联动（`cc.results.v1`）
- 历史条数上限（30 条完整 `TestResult`，含逐题作答）
- 删除与清空

### 2.2 测试文件结构

```
lib/
├── scoring.ts / hue-scoring.ts / path-scoring.ts
├── signal-scoring.ts / advanced-scoring.ts / child-scoring.ts
├── storage.ts / profile.ts / export-import.ts / format.ts
├── ishihara.ts / path-field.ts / sharecard.ts / scoring-text.ts
└── *.test.ts            # 17 个平铺测试文件，共 116 例
```

### 2.3 覆盖率目标

| 模块 | 目标覆盖率 |
|------|------------|
| 判读算法 | ≥ 95% |
| 工具函数 | ≥ 85% |
| 存储封装 | ≥ 80% |
| 整体业务逻辑 | ≥ 80% |

### 2.4 运行命令

```bash
# 运行单元测试
npm run test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npx vitest run --coverage
```

---

## 3. 组件测试

> 本章组件测试代码仍为**规划示例**：仓库未引入 `@testing-library/react`；§4 的 `playwright.config.ts` 与 `e2e/main-flow.spec.ts` 已接入依赖、脚本与 CI，E2E 部分为可执行配置，组件测试部分仍仅作示例。

### 3.1 测试重点

| 组件 | 测试内容 |
|------|----------|
| `IshiharaPlate` | 图片加载、尺寸适配、占位状态 |
| `TestProgress` | 进度计算、样式状态 |
| `AnswerInput` | 数字输入限制、禁用状态 |
| `PathTrackingCanvas` | 鼠标/触摸事件、轨迹记录 |
| `HueArrangementGrid` | 拖拽排序、点击交换 |
| `ResultSummary` | 各结果类型渲染 |
| `DimensionBar` | 分数对应颜色、宽度计算 |

### 3.2 组件测试示例

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { AnswerInput } from '@/components/test/AnswerInput';

describe('AnswerInput', () => {
  it('should only accept numeric input', () => {
    render(<AnswerInput value="" onChange={vi.fn()} disabled={false} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc123' } });
    // onChange 应只收到数字
    expect(input).toHaveValue('');
  });

  it('should be disabled when cannotSee is true', () => {
    render(<AnswerInput value="" onChange={vi.fn()} disabled={true} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
```

---

## 4. 集成测试（Playwright）

### 4.1 测试场景

**已实现场景**（以 `e2e/main-flow.spec.ts` 为准）：
1. 首页 → 检测指引 → 模式选择 → 石原氏快速 → 结果页；断言页脚含 10 位 `build` 编号。
2. 首页语言切换后，`html lang` 与所选语言一致（简体中文 `zh-CN`、繁体中文 `zh-TW`）。

**尚未自动化**：刷新恢复进度、中途退出提示、未勾选确认禁用按钮、无效结果 ID 等异常流程仍依赖手动检查。

### 4.2 配置文件（仓库根 `playwright.config.ts`）

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 2,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- -p 3000 -H 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
```

### 4.3 现行用例

实际用例位于 `e2e/main-flow.spec.ts`，覆盖主链路与语言切换回归；以该文件为权威，不再另存一份示例副本。

> **现行口径（2026-11-27）**：用户确认首页「开始检测」应先进入 `/guide`；`components/home/HomeContent.tsx` 已按此实现，主链路断言与实际路由一致。CI 连续三次稳定验收状态见 [tasks.md O-03](./tasks.md#o-03-playwright-主链路-e2e-在-ci-稳定三次)。

### 4.4 运行命令

```bash
# 安装 Playwright 浏览器（首次；CI 使用 --with-deps chromium）
npx playwright install chromium

# 运行 E2E 测试（依赖与 npm 脚本已接入）
npm run e2e

# 指定浏览器
npx playwright test --project=chromium

# 带 UI 模式调试
npx playwright test --ui
```

---

## 5. 手动测试清单

### 5.1 浏览器兼容性

| 浏览器 | 版本 | 通过 |
|--------|------|------|
| Chrome | 90+ | ☐ |
| Safari | 15+ | ☐ |
| Firefox | 90+ | ☐ |
| Edge | 90+ | ☐ |

### 5.2 设备兼容性

| 设备 | 分辨率 | 通过 |
|------|--------|------|
| 桌面 | 1920×1080 | ☐ |
| 桌面 | 1366×768 | ☐ |
| 平板 | 1024×768 | ☐ |
| 手机 | 375×667 | ☐ |
| 手机 | 414×896 | ☐ |

### 5.3 功能验收清单

- [ ] 首页 CTA 跳转正确
- [ ] 指引页勾选逻辑正确
- [ ] 快速版/标准版题量正确
- [ ] 答题输入、回车提交、上一题返回
- [ ] "看不清"选项逻辑
- [ ] 演示题反馈显示
- [ ] 检测完成后结果正确
- [ ] 结果页各维度图表渲染
- [ ] 报告打印/导出
- [ ] 历史记录增删查
- [ ] 刷新恢复进度
- [ ] 深色模式切换

### 5.4 色彩准确性检查

> **重要**：色觉检测应用的核心是检测图的色彩准确性。

- [ ] 使用校色过的显示器对比标准石原氏图谱
- [ ] 在 sRGB 色域下检查检测图颜色
- [ ] 在广色域显示器上确认无偏色
- [ ] 检查深色模式下检测图颜色是否受影响
- [ ] 检查移动端不同屏幕的显示差异

### 5.5 无障碍检查

- [ ] 键盘 Tab 导航
- [ ] 屏幕阅读器可读
- [ ] 颜色对比度达标
- [ ] 表单标签完整

---

## 6. 性能测试

### 6.1 核心指标

| 指标 | 目标值 |
|------|--------|
| LCP（最大内容绘制） | < 2.5s |
| FID（首次输入延迟） | < 100ms |
| CLS（累积布局偏移） | < 0.1 |
| 首屏 JS | < 170KB (gzip) |
| 检测图加载 | < 500ms/张 |

### 6.2 检测流程性能

- [ ] 题库数据加载时间 < 50KB
- [ ] 答题切换无卡顿（> 60fps）
- [ ] 结果计算 < 500ms
- [ ] 本地存储读写 < 10ms

---

## 7. 测试流程

### 7.1 CI 集成

每次 push / PR 自动运行：

```yaml
# .github/workflows/ci.yml（节选，完整版以仓库文件为准）
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 22
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run check:openapi
      - run: npm run check:docs
      - run: npm test
      - run: npm run test:coverage
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run e2e

  release:
    # v1.16.0 起：build-and-test 全绿且 push main 时自动发布（详见 ./DEPLOYMENT.md §9）
    needs: build-and-test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    permissions: { contents: write }
```

> **i18n 键完整性校验**：繁体 / 英文字典键集合类型化派生自简体基准（`DictKey = keyof ZH`），缺失键由 TypeScript 编译期报错——CI 的 type-check 步骤即为门禁，无独立运行时测试。

### 7.2 发布门禁

只有满足以下条件才能合并到 `main` 并发布：

- [ ] 单元测试全部通过
- [ ] 覆盖率达标
- [ ] E2E 已接入 CI；先对齐首页 CTA 路由断言，再连续三次稳定通过（O-03）
- [ ] 手动测试清单完成
- [ ] 无新增安全告警

---

## 8. 测试数据准备

### 8.1 判读算法测试数据

| 场景 | 输入 | 期望输出 |
|------|------|----------|
| 正常色觉 | 所有题答对 | normal, confidence 100 |
| 绿色盲 | vanishing 全错（无轴命中） | suspected_blindness, type 未分型（null）, severity severe |
| 绿色弱 | vanishing 错 2（无轴命中） | suspected_deficiency, type 未分型（null）, severity moderate |
| 红色盲 | vanishing 全错 + protan 匹配 | **不可达**（题库无 protan 预期值；输出 protan* 需转换/分类题命中） |
| 伪色盲 | 演示题答错 + 其他全对 | inconclusive 或低置信度 |
| 过快答题 | 所有题 < 1s | 置信度降低 |

### 8.2 E2E 测试账号

本项目无需登录，使用匿名模式测试即可。

---

*文档结束*
