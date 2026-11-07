# 色辨 ChromaCheck 测试策略文档

> **规范遵循**：本文档为 [SPEC.md](./SPEC.md) 的子主题分册；若与 SPEC 冲突，以 SPEC 为准。判读引擎测试以 SPEC §6 与 `lib/scoring.ts` 为权威。
> **实现状态**：v1.16.0：Vitest 测试套件共 14 文件 97 例（`lib/*.test.ts`：scoring / hue-scoring / path-scoring / advanced-scoring / signal-scoring / child-scoring / profile / storage / export-import / format / scoring-text / path-field / ishihara / sharecard），node 环境。CI `.github/workflows/ci.yml` 跑 type-check + lint + build + test。组件测试与 Playwright E2E 尚未落地。判读引擎测试以 SPEC §6 与 `lib/scoring.ts` 为权威。

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.16.0 |
| 创建日期 | 2026-09-03 |

---

## 1. 测试总览

本项目采用分层测试策略，当前覆盖单元测试与手动检查清单；集成 / 组件 / E2E 尚未落地。

| 层级 | 工具 | 重点 |
|------|------|------|
| 单元测试 | Vitest（node 环境） | 判读算法、工具函数、存储封装 —— **已落地，14 文件 97 例** |
| 组件测试 | Vitest + React Testing Library | UI 组件渲染与交互 —— **规划中，未落地**（无 jsdom/happy-dom、无 RTL 依赖） |
| 集成测试 | Playwright | 核心用户流程 —— **规划中，未落地** |
| 端到端测试 | Playwright | 完整检测链路 —— **规划中，未落地**（CI 以 `echo` 占位跳过） |
| 手动测试 | 人工 | 兼容性、无障碍、色彩准确性 |

---

## 2. 单元测试

### 2.1 测试范围

#### 判读算法（`lib/scoring.ts` 等 `lib/*-scoring.ts`）— 最高优先级

| 文件 | 测试重点 |
|------|----------|
| `scoring.ts` | 消失题 / 演示题边界用例、hit 恒 0 下的类型退化（恒 deuteran*）、tritan 推算值、程度与判读稳定性计算 |
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
  - 无转换 / 分类题时 protanHit = deutanHit = 0 → type 恒为 deuteranopia/deuteranomaly
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
└── *.test.ts            # 14 个平铺测试文件，共 97 例
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

> 本章与 §4 E2E 章节均为**规划示例**：当前仓库未引入 @testing-library/react / Playwright，CI 的 E2E 步骤为占位跳过。

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

**核心流程**：
1. 首页 → 点击"开始检测" → 检测前指引
2. 指引页 → 勾选确认 → 开始测试
3. 石原氏测试 → 答题 10 题 → 完成
4. 结果页 → 显示评估结果
5. 历史记录 → 新增一条记录

**异常流程**：
1. 答题中途刷新页面 → 恢复进度
2. 答题中途退出 → 重新进入提示继续
3. 未勾选确认 → 开始按钮禁用
4. 结果页访问无效 ID → 显示"未找到"

### 4.2 配置文件（`e2e/playwright.config.ts`）

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'mobile-chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 667 },
        isMobile: true,
      },
    },
  ],
});
```

### 4.3 测试用例示例

```typescript
import { test, expect } from '@playwright/test';

test('完整检测流程', async ({ page }) => {
  // 首页
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /一眼辨色/ })).toBeVisible();

  // 进入指引
  await page.getByRole('link', { name: /开始检测/ }).click();
  await expect(page).toHaveURL(/\/guide/);

  // 勾选并开始
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: /开始检测/ }).click();
  await expect(page).toHaveURL(/\/test/);

  // 选择快速检测
  await page.getByRole('button', { name: /快速检测/ }).click();
  await expect(page).toHaveURL(/\/test\/ishihara\/quick/);

  // 答题
  for (let i = 0; i < 10; i++) {
    await page.getByLabel('输入您看到的数字').fill('12');
    await page.getByRole('button', { name: /下一题|完成检测/ }).click();
  }

  // 结果页
  await expect(page).toHaveURL(/\/result\/[^/]+/);
  await expect(page.getByText(/色觉正常|疑似色/)).toBeVisible();
});
```

### 4.4 运行命令

```bash
# 安装 Playwright 浏览器（首次）
npx playwright install

# 运行 E2E 测试（脚本尚未配置，以下为规划示例）
npx playwright test

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
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 22
      - run: npm install
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test
      - run: npm run build
      - run: echo "E2E 跳过：当前版本未配置 e2e"

```

### 7.2 发布门禁

只有满足以下条件才能合并到 `main` 并发布：

- [ ] 单元测试全部通过
- [ ] 覆盖率达标
- [ ] E2E 暂不纳入门禁（CI 为占位跳过）
- [ ] 手动测试清单完成
- [ ] 无新增安全告警

---

## 8. 测试数据准备

### 8.1 判读算法测试数据

| 场景 | 输入 | 期望输出 |
|------|------|----------|
| 正常色觉 | 所有题答对 | normal, confidence 100 |
| 绿色盲 | vanishing 全错 + deutan 匹配 | suspected_blindness, deuteranopia |
| 绿色弱 | vanishing 错 2 + 部分匹配 | suspected_deficiency, deuteranomaly |
| 红色盲 | vanishing 全错 + protan 匹配 | **不可达**（题库无 protan 预期值，实际输出 deuteran*） |
| 伪色盲 | 演示题答错 + 其他全对 | inconclusive 或低置信度 |
| 过快答题 | 所有题 < 1s | 置信度降低 |

### 8.2 E2E 测试账号

本项目无需登录，使用匿名模式测试即可。

---

*文档结束*
