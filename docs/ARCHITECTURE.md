# 色辨 ChromaCheck 技术架构文档

> **规范遵循**：本文档为 [docs/SPEC.md](docs/SPEC.md) 的子主题分册；若与 SPEC 冲突，以 SPEC 为准。
> **实现状态**：v1.0 已实现（Next.js 14 应用）。路径追踪与色相排列为 v1.1 规划；详见 §2 已实现结构。

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-09-03 |
| 技术负责人 | ChromaCheck 团队 |

---

## 1. 架构总览

### 1.1 架构风格

本项目采用 **客户端渲染（CSR）为主 + 静态生成（SSG）为辅** 的混合架构：

- **营销/科普页面**（首页、科普文章）：使用 SSG 静态生成，利于 SEO 和首屏加载。
- **检测/结果页面**：使用 CSR 客户端渲染，检测过程涉及大量交互和状态管理，无需 SEO。
- **API 路由**：使用 Next.js Route Handlers，用于可选的数据上报和内容管理。

### 1.2 架构图

```
┌─────────────────────────────────────────────────────────┐
│                        客户端 (Browser)                    │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │  首页/科普   │  │  检测模块    │  │   结果/报告模块  │ │
│  │  (SSG)      │  │  (CSR)      │  │    (CSR)        │ │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘ │
│         │                │                    │          │
│         └────────────────┼────────────────────┘          │
│                          │                               │
│              ┌───────────┴───────────┐                   │
│              │    React Context       │                   │
│              │    (全局状态管理)       │                   │
│              └───────────┬───────────┘                   │
│                          │                               │
│         ┌────────────────┼────────────────┐              │
│         ▼                ▼                ▼              │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐      │
│  │  题库数据   │  │  判读引擎   │  │  本地存储      │      │
│  │  (静态JSON) │  │  (纯函数)   │  │  (localStorage)│     │
│  └────────────┘  └────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS (可选数据上报)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      服务端 (Vercel)                       │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  Next.js SSR │  │  API Routes  │  │  静态资源 CDN  │ │
│  │  / SSG 渲染  │  │  (可选上报)  │  │  (检测图/图片) │ │
│  └──────────────┘  └──────┬───────┘  └───────────────┘ │
│                             │                             │
│                             ▼                             │
│                    ┌───────────────┐                      │
│                    │  可选数据库    │                      │
│                    │ (Vercel KV /  │                      │
│                    │   Postgres)    │                      │
│                    └───────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

### 1.3 设计原则

1. **隐私优先**：默认纯前端运行，不收集用户数据；可选上报需用户明确同意。
2. **性能优先**：检测图预加载、代码分割、懒加载，确保检测流程流畅。
3. **可维护性**：题库数据与判读逻辑分离，组件单一职责，类型全覆盖。
4. **可访问性**：遵循 WCAG 2.1 AA 标准，支持键盘导航、屏幕阅读器。
5. **渐进增强**：核心检测功能在低配置设备上也能正常运行。

---

## 2. 前端架构

### 2.1 技术选型理由

| 技术 | 选型理由 | 替代方案 |
|------|----------|----------|
| Next.js 14 App Router | SSR/SSG/CSR 混合渲染、文件路由、内置优化、Vercel 原生部署 | Nuxt.js、Remix、纯 React + Vite |
| TypeScript | 类型安全、减少运行时错误、IDE 智能提示、题库/结果数据结构复杂 | JavaScript |
| Tailwind CSS | 原子化 CSS、开发效率高、 bundle 体积小、设计系统一致性 | CSS Modules、styled-components |
| shadcn/ui | 基于 Radix UI，可访问性好，组件可定制，非黑盒 | Ant Design、MUI、Chakra UI |
| Recharts | 基于 SVG，与 React 集成好，支持响应式，bundle 适中 | ECharts、Chart.js、D3.js |
| @dnd-kit | 现代拖拽库，支持触摸和键盘，无障碍友好 | react-beautiful-dnd（已停止维护）、react-dnd |
| Canvas API | 路径追踪测试需要精确的像素级绘制和交互 | SVG（性能较差） |

### 2.2 目录结构说明

```
app/
├── layout.tsx              # 根布局：HTML 结构、全局 Provider、字体
├── page.tsx                # 首页：SSG，产品介绍 + CTA
├── globals.css             # 全局样式：Tailwind 指令 + CSS 变量 + 自定义样式
├── guide/page.tsx          # 检测前指引：CSR，用户确认检测条件
├── test/
│   ├── page.tsx            # 测试模式选择：快速/标准/进阶
│   ├── ishihara/page.tsx   # 石原氏测试：核心检测流程
│   ├── path-tracking/page.tsx    # 路径追踪测试
│   └── hue-arrangement/page.tsx  # 色相排列测试
├── result/page.tsx         # 结果展示：读取 URL state / localStorage
├── learn/
│   ├── page.tsx            # 科普列表：SSG
│   └── [slug]/page.tsx     # 科普详情：SSG，generateStaticParams
└── history/page.tsx        # 历史记录：CSR，读取 localStorage

components/
├── ui/                     # shadcn/ui 生成的基础组件（Button、Card、Dialog 等）
├── layout/
│   ├── Navbar.tsx          # 顶部导航栏
│   ├── Footer.tsx          # 页脚
│   └── Container.tsx       # 内容容器
├── test/
│   ├── IshiharaPlate.tsx       # 石原氏检测图展示组件
│   ├── TestProgress.tsx        # 测试进度条
│   ├── AnswerInput.tsx         # 答案输入组件（数字键盘）
│   ├── PathTrackingCanvas.tsx  # 路径追踪画布
│   └── HueArrangementGrid.tsx  # 色相排列网格
├── result/
│   ├── ResultSummary.tsx   # 结果总览卡片
│   ├── ResultChart.tsx     # 结果图表（雷达图/条形图）
│   ├── AnswerDetail.tsx    # 答题明细（可展开）
│   └── ReportExport.tsx    # 报告导出按钮组
└── common/
    ├── Logo.tsx            # 品牌 Logo
    ├── ThemeToggle.tsx     # 深色模式切换
    └── Seo.tsx             # SEO 元数据组件

lib/
├── questions/
│   ├── ishihara.ts         # 石原氏题库数据（24题 + 快速版10题）
│   ├── path-tracking.ts    # 路径追踪题库
│   └── hue-arrangement.ts  # 色相排列色卡数据
├── scoring/
│   ├── ishihara-scoring.ts # 石原氏判读算法
│   ├── path-scoring.ts     # 路径追踪判读
│   ├── hue-scoring.ts      # 色相排列判读（TES 计算）
│   └── index.ts            # 综合判读入口
├── storage/
│   └── localStorage.ts     # localStorage 封装（带版本管理、加密）
├── export/
│   └── report-export.ts    # 报告导出逻辑（PNG/PDF）
└── utils.ts                # 通用工具函数（cn、formatDate 等）

types/
├── question.ts             # 题目相关类型
├── result.ts               # 结果相关类型
└── storage.ts              # 存储相关类型
```

### 2.3 状态管理

**不引入 Redux/Zustand 等外部状态管理库**，使用 React 内置方案：

| 状态类型 | 管理方式 | 说明 |
|----------|----------|------|
| 检测进行中状态 | React Context (`TestContext`) | 当前题目索引、答案、开始时间等，仅在检测流程内共享 |
| 结果数据 | URL Search Params + localStorage | 检测完成后将结果 ID 存入 URL，结果页从 localStorage 读取详情 |
| UI 状态（主题、设置） | React Context (`SettingsContext`) | 深色模式、音效开关等，持久化到 localStorage |
| 组件局部状态 | `useState` / `useReducer` | 输入框值、展开/收起等 |

**TestContext 数据结构**：

```typescript
interface TestState {
  testType: 'quick' | 'standard' | 'advanced';
  currentIndex: number;
  answers: Record<string, AnswerRecord>;
  startTime: string;
  isCompleted: boolean;
}

interface TestContextValue extends TestState {
  setAnswer: (questionId: string, answer: AnswerRecord) => void;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  complete: () => void;
  reset: () => void;
}
```

### 2.4 路由设计

| 路径 | 渲染方式 | 说明 |
|------|----------|------|
| `/` | SSG | 首页 |
| `/guide` | CSR | 检测前指引 |
| `/test` | CSR | 测试模式选择 |
| `/test/ishihara` | CSR | 石原氏测试（`?mode=quick\|standard`） |
| `/test/path-tracking` | CSR | 路径追踪测试 |
| `/test/hue-arrangement` | CSR | 色相排列测试 |
| `/result?id=xxx` | CSR | 结果展示页 |
| `/learn` | SSG | 科普文章列表 |
| `/learn/[slug]` | SSG | 科普文章详情 |
| `/history` | CSR | 历史记录 |

### 2.5 性能优化策略

1. **图片优化**：
   - 检测图使用 Next.js `<Image>` 组件，自动 WebP/AVIF 转换、懒加载。
   - 预加载下一题图片（`next/image` priority + 预取）。
   - 检测图使用 SVG 格式（如自绘）或高压缩 WebP，单图 < 100KB。

2. **代码分割**：
   - 每个页面自动代码分割。
   - 重型库（jsPDF、html2canvas、@dnd-kit）动态导入（`next/dynamic`）。
   - 结果图表组件懒加载。

3. **字体优化**：
   - 使用 `next/font` 加载中文字体（思源黑体），自动预加载、避免 FOIT。
   - 字体子集化，仅加载常用字符。

4. **缓存策略**：
   - 静态资源（检测图、JS/CSS）设置长期缓存（`Cache-Control: public, max-age=31536000, immutable`）。
   - SSG 页面使用 ISR（Incremental Static Regeneration），科普文章 `revalidate: 3600`。

5. **检测流程优化**：
   - 题库数据在进入检测页时一次性加载（JSON < 50KB）。
   - 答题数据实时保存到 localStorage（防抖 500ms），防止意外丢失。
   - 结果计算在客户端同步执行（< 10ms），无需网络请求。

---

## 3. 核心模块设计

### 3.1 题库数据模块

**设计目标**：题库数据与业务逻辑完全分离，支持热更新和版本管理。

**数据来源**：
- 石原氏检测图：使用公有领域版本（1917 年初版已过版权保护期）或自行绘制 SVG。
- 路径追踪图：基于标准石原氏路径图自行数字化。
- 色相排列色卡：基于 Munsell 色卡系统，使用 sRGB 近似值。

**题库版本管理**：

```typescript
// lib/questions/ishihara.ts
export const ISHIHARA_VERSION = '1.0.0';

export const ishiharaQuestions: IshiharaQuestion[] = [
  // ...题目数据
];

export const getQuickSet = (): IshiharaQuestion[] => {
  // 从完整题库中筛选快速版题目（10题）
  return ishiharaQuestions.filter(q => q.quick === true);
};

export const getStandardSet = (): IshiharaQuestion[] => {
  return ishiharaQuestions.filter(q => q.type !== 'demonstration');
};
```

### 3.2 判读引擎

**设计目标**：纯函数、可测试、可追溯，判读规则与 UI 分离。

**石原氏判读算法**：

```
输入：用户答案数组（每题：题目ID、用户答案、答题时长）
输出：评估结果（总体结论、异常类型、程度、置信度）

判读逻辑（详见 docs/SPEC.md §6，以 prototype/assets/js/scoring.js 真值为准）：
1. 演示题校验：若演示题答错，标记"未理解测试要求"，降低置信度。
2. 按题目类型分组统计：
   - vanishing 题（正常可见，异常不可见）：答错数 → 异常程度
   - transformation 题（正常和异常看到不同数字）：答案匹配哪种异常 → 异常类型
   - hidden 题（异常可见，正常不可见）：答对 → 提示异常
3. 综合评分：
   - 红色盲/红色弱评分：protan 相关题目错误模式
   - 绿色盲/绿色弱评分：deutan 相关题目错误模式
   - 蓝色盲评分：tritan 相关题目
4. 总体结论：
   - 答题覆盖 < 50% → inconclusive
   - vanishing 错误 >= 4 或总错误 >= 8 → suspected_blindness
   - vanishing 错误 >= 2 或总错误 >= 4 或 hidden 答对 >= 半数 → suspected_deficiency
   - 演示题错且 protan/deutan 匹配均为 0 且错误 < 4 → inconclusive
5. 类型与程度（详见 SPEC §6.4）：
   - 轴选择：deutanHit >= protanHit 选 deutan 轴，否则 protan 轴
   - 类型：suspected_blindness → *opia，suspected_deficiency → *anomaly
   - 程度：错误率 >= 0.7 重度，>= 0.4 中度，否则轻度
6. 置信度计算（详见 SPEC §6.5）：
   - 基础 100
   - 演示题错误 -25
   - 答题过快（< 1s）每题 -2
   - 答题矛盾（protan 与 deutan 命中并存）-15
   - 答题覆盖不足（< 50%）-20
   - 最低 0
```

**判读引擎接口**：

```typescript
// lib/scoring/ishihara-scoring.ts
export function scoreIshiharaTest(
  answers: AnswerRecord[],
  questions: IshiharaQuestion[]
): IshiharaScoringResult {
  // 纯函数实现
}

export interface IshiharaScoringResult {
  overall: 'normal' | 'suspected_deficiency' | 'suspected_blindness' | 'inconclusive';
  type?: ColorDeficiencyType;
  severity?: 'mild' | 'moderate' | 'severe';
  confidence: number;
  dimensions: {
    protan: number;    // 红色觉异常评分 0-100
    deutan: number;    // 绿色觉异常评分 0-100
    tritan: number;    // 蓝色觉异常评分 0-100
  };
  details: {
    correctCount: number;
    totalCount: number;
    errorPatterns: ErrorPattern[];
  };
}
```

### 3.3 路径追踪模块

**技术方案**：使用 HTML5 Canvas 绘制色点图，用户用鼠标/触摸描绘路径。

**核心逻辑**：

1. **画布渲染**：
   - 背景色点（干扰点）：随机分布，使用异常者无法区分的颜色。
   - 路径色点：组成连续路径，使用正常色觉可区分的颜色。
   - 色点大小、间距标准化。

2. **交互处理**：
   - `mousedown` / `touchstart`：开始绘制
   - `mousemove` / `touchmove`：记录轨迹点，绘制线条
   - `mouseup` / `touchend`：结束绘制

3. **判读算法**：
   - 将用户轨迹与标准路径进行点集匹配。
   - 计算重合度（IoU）：用户轨迹覆盖标准路径的比例。
   - 重合度 > 70% → 该类型色觉正常；< 30% → 疑似异常。

### 3.4 色相排列模块

**技术方案**：基于 Farnsworth-Munsell D15 测试简化版。

**核心逻辑**：

1. **色卡生成**：
   - 15 张可移动色卡 + 2 张固定首尾色卡。
   - 色卡在 Munsell 色相环上等距分布，明度和饱和度固定。
   - sRGB 值预先计算并校准。

2. **交互处理**：
   - 使用 @dnd-kit 实现拖拽排序。
   - 移动端支持点击交换（点击两张色卡交换位置）。

3. **判读算法（TES - Total Error Score）**：
   - 计算每张色卡与正确位置的偏差。
   - 相邻色卡偏差求和得到 TES。
   - TES < 20 → 正常；20-40 → 轻度异常；> 40 → 明显异常。
   - 偏差方向（偏红/偏绿/偏蓝）指示异常类型。

### 3.5 报告导出模块

**技术方案**：
- PNG 导出：`html2canvas` 将报告 DOM 转为 Canvas，再导出 PNG。
- PDF 导出：`jsPDF` 将 Canvas 嵌入 PDF，或直接使用 `html2canvas` + `jsPDF.addImage`。

**优化**：
- 动态导入（`next/dynamic`），仅在用户点击导出时加载库（约 300KB gzip）。
- 导出前隐藏不需要的元素（按钮、导航）。
- 设置合适的缩放比（`scale: 2`）保证清晰度。

---

## 4. 数据与存储

### 4.1 本地存储设计

**存储 Key 规范**：

```
chromacheck:v1:settings       # 用户设置
chromacheck:v1:history        # 检测历史（仅存摘要，不存原始答案）
chromacheck:v1:current_test   # 进行中的检测进度
chromacheck:v1:result:{id}    # 单次检测完整结果（临时，结果页读取后可保留）
```

**存储容量控制**：
- 历史记录最多保留 20 条，超出自动删除最旧的。
- 完整结果数据最多保留 5 条。
- 总存储量控制在 1MB 以内。

**数据加密**：
- 不存储个人身份信息，无需强加密。
- 使用 Base64 编码避免 JSON 特殊字符问题。
- 版本号前缀，便于未来迁移。

### 4.2 可选服务端存储（远期）

如未来需要用户账号和云同步：

| 数据 | 存储方案 | 说明 |
|------|----------|------|
| 用户账号 | Auth.js (NextAuth) | 支持邮箱、微信、手机号登录 |
| 检测结果 | PostgreSQL (Vercel Postgres / Supabase) | 结构化数据，支持统计分析 |
| 匿名统计 | Vercel KV (Redis) | 每日检测次数、结果分布等聚合数据 |
| 文件存储 | Vercel Blob / S3 | 用户导出的报告（可选） |

**隐私保护**：
- 用户可随时导出和删除所有个人数据。
- 匿名统计数据不包含个人标识。
- 遵循 GDPR / 个人信息保护法要求。

---

## 5. API 设计

### 5.1 API 路由列表

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/health` | 健康检查 | 否 |
| POST | `/api/analytics/event` | 匿名事件上报（需用户同意） | 否 |
| GET | `/api/questions/version` | 题库版本查询（用于客户端更新判断） | 否 |
| GET | `/api/questions/:type` | 获取题库数据（远期，支持远程更新） | 否 |

### 5.2 事件上报接口

```typescript
// POST /api/analytics/event —— 字段以 docs/API.md §3.2 与 docs/SPEC.md §5.6 为权威
interface AnalyticsEvent {
  eventId: string;          // 事件唯一 ID
  event: 'page_view' | 'cta_click' | 'answer_submit' | 'test_complete'
       | 'share' | 'download' | 'test_error' | 'learn_view';
  timestamp: string;
  mode?: 'quick' | 'standard' | 'advanced';
  // 不含用户身份信息；其余上下文字段按需扩展
}

// 响应
{ "ok": true }
```

**隐私要求**：
- 默认不上报，用户在设置中明确开启后才上报。
- 不上报 IP 地址（Vercel 配置 `ip` 字段为 `0.0.0.0`）。
- 不上报 User-Agent 等可识别信息。
- 仅上报聚合统计所需的最少字段。

---

## 6. 安全设计

### 6.1 前端安全

| 风险 | 防护措施 |
|------|----------|
| XSS | React 默认转义；不使用 `dangerouslySetInnerHTML`（科普文章使用 Markdown 渲染库，默认转义） |
| CSRF | 无状态 API，不使用 Cookie 认证；事件上报使用 Origin 校验 |
| 依赖漏洞 | 定期 `npm audit`；Dependabot 自动更新；CI 中运行漏洞扫描 |
| 敏感信息泄露 | 前端代码中不包含 API Key、数据库连接等敏感信息 |

### 6.2 内容安全

- 配置 CSP（Content Security Policy）Header：
  ```
  default-src 'self';
  script-src 'self' 'unsafe-inline' (Next.js 需要);
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  connect-src 'self' https://*.vercel-analytics.com;
  ```
- 检测图资源同源，不引用外部图片。

### 6.3 合规

- **免责声明**：首页、检测前、结果页均有明确免责声明。
- **隐私政策**：提供完整的隐私政策页面，说明数据收集范围和用途。
- **Cookie 提示**：如使用分析 Cookie，需用户同意（默认仅使用必要 Cookie）。
- **无障碍**：遵循 WCAG 2.1 AA，色觉测试本身不依赖颜色作为唯一信息载体（有文字说明）。

---

## 7. 测试策略

### 7.1 单元测试

- **框架**：Vitest + React Testing Library
- **覆盖范围**：
  - 判读算法（`lib/scoring/*`）：各种答题模式的边界用例
  - 工具函数（`lib/utils.ts`）
  - 本地存储封装（`lib/storage/*`）
  - 纯组件（无副作用的 UI 组件）
- **覆盖率目标**：业务逻辑 > 80%，判读算法 > 95%

### 7.2 集成测试

- **框架**：Playwright
- **测试场景**：
  - 完整检测流程（首页 → 指引 → 测试 → 结果）
  - 答题中断恢复（刷新页面后继续）
  - 报告导出功能
  - 历史记录增删
  - 响应式布局（桌面/移动视口）

### 7.3 手动测试清单

- [ ] 各浏览器兼容性（Chrome、Safari、Firefox、Edge）
- [ ] 移动端触摸操作（iOS Safari、Android Chrome）
- [ ] 检测图色彩准确性（使用校色过的显示器对比标准图谱）
- [ ] 弱网环境（图片加载失败处理）
- [ ] 无障碍（键盘导航、屏幕阅读器）
- [ ] 深色模式

---

## 8. CI/CD

### 8.1 持续集成

使用 GitHub Actions：

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

### 8.2 持续部署

- **Vercel 自动部署**：连接 GitHub 仓库，`main` 分支推送自动部署生产环境。
- **Preview 部署**：每个 PR 自动生成 Preview 环境，便于评审。
- **环境变量**：在 Vercel Dashboard 配置，不写入代码仓库。

---

## 9. 监控与运维

### 9.1 性能监控

- **Vercel Analytics**：页面访问量、PV/UV、跳出率。
- **Web Vitals**：LCP、FID、CLS 指标采集（`next/web-vitals`）。
- **自定义指标**：检测完成率、平均检测时长、报告导出率。

### 9.2 错误监控

- **Sentry**（可选）：前端错误捕获、性能追踪。
- 错误率告警：日错误率 > 1% 时通知。

### 9.3 日志

- 服务端日志：Vercel Logs（保留 1 小时，付费版更长）。
- 客户端错误：Sentry 或自建日志收集。
- 日志中不记录用户个人信息和检测答案。

---

## 10. 扩展规划

### 10.1 短期（v1.1）

- 更多石原氏图版（38 板完整版）
- 检测结果分享卡片（社交媒体优化）
- 多语言支持（英文）
- PWA 支持（离线可用）

### 10.2 中期（v1.5）

- 用户账号系统（云同步历史记录）
- 儿童模式（图形识别替代数字，适合低龄儿童）
- 色觉模拟功能（让正常色觉用户体验色盲视角）
- 批量检测管理后台（学校/企业使用）

### 10.3 长期（v2.0）

- AI 辅助判读（结合用户答题模式和历史数据优化准确性）
- 可穿戴设备集成（手机摄像头环境光校准）
- 医疗合作（与眼科医院合作，提供在线预约转诊）
- 开放 API（供第三方应用集成色觉检测）

---

## 附录

### A. 参考资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [shadcn/ui 官方文档](https://ui.shadcn.com/)
- [WCAG 2.1 无障碍标准](https://www.w3.org/TR/WCAG21/)
- [Ishihara Test 维基百科](https://en.wikipedia.org/wiki/Ishihara_test)
- [Farnsworth-Munsell D15 Test](https://www.xrite.com/categories/color-management/farnsworth-munsell-hue-test)

### B. 变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| v1.0 | 2026-09-03 | 初始版本 | — |

---

*文档结束*
