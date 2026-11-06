# ChromaCheck 项目完整审查报告

- 审查对象：`e:/Github/ChromaCheck/README.md` 及全仓库
- 审查基线：HEAD `a22e169`，版本 `v1.14.0`
- 审查日期：2026-11-06
- 审查方式：README 逐条声明 → 代码/文档实况核对 → 门禁实跑 → 规范符合性检查
- 范围声明：外部链接（`chroma.ewuse.com`、GitHub Actions 徽章）未做联网可达性验证

---

## 一、结论

README 的**功能与路由声明基本属实**：7 条测试路由、三种报告导出、多档案历史、双语、PWA、GA4、FAQ、设置面板均有真实实现，未发现虚构路由或虚构 `lib` 模块；技术栈版本、快速开始命令、被点名的文件全部存在；质量门禁全绿。

但发现 **2 个高优先级问题**：

1. **P0｜面向用户的判读结论与实际算法能力不符**：题库在 v1.13.0 已全部降级为 `vanishing` 型，导致异常类型判定恒为绿色盲分支、三轴维度中 tritan 恒为推算值；而 README、结果页文案、FAQ、模式描述、趣味科普、多份规范文档仍按"能区分红/绿/蓝黄、覆盖转换/隐藏/分类题型"描述。对色觉筛查工具而言属信息误导。
2. **P0｜README 的 Docker 部署命令在克隆仓库后直接失败**：仓库无 `Dockerfile`，命令却写成可直接 `docker build`。

另有 **3 个中优先级**（版本口径脱节、部署文档过时、两套项目记忆格式冲突）与 **6 个低优先级**（README 内部不一致、能力遗漏、措辞夸大、头注释漏改等）问题。

> 本次为**审查任务**，未改动仓库内任何代码或文档。仅按记忆维护规则修正了仓库外的全局项目记忆（见 P1-3）。

---

## 二、问题清单

### P0-1 判读能力名实不符（最严重）

**代码事实**

- `lib/questions.ts:5-8` 注释明示：原 `transformation`/`classification`/`hidden` 题型因渲染层只绘单数字、且 hidden 因 `answer=''` 沦为 no-op，**统一降级为 `vanishing`**，并清除 `protan`/`deutan` 预期键；全库 38 题除演示题外均为 `vanishing`。
- `lib/scoring.ts:74-77`：只有 `transformation`/`classification` 才计入 `protanHit`/`deutanHit` → 实际题库下**两者恒为 0**。
- `lib/scoring.ts:103`：`if (deutanHit >= protanHit)` 在 `0 >= 0` 时恒真 → 异常类型**恒判为 `deuteranomaly` / `deuteranopia`**，永远无法输出 protan 或 tritan 类型。
- `lib/scoring.ts:85`：`tritan: clamp(Math.round(base * 0.35))` 为纯推算值，非测量值。
- `lib/learn-data.ts:63` 与 `CHANGELOG.md:66-68` 已诚实写明"未实现真正的变形/隐藏双数字版、对 protan 消隐弱于 deutan"——说明降级是**刻意的技术决策**，但面向用户的文案未同步。

**仍在按旧题型宣称的位置**

| 位置 | 内容 |
| --- | --- |
| `README.md:23` | 「智能判读（异常类型 / 程度 / 三轴维度）」 |
| `README.md:24` | 「多种测试范式」（隐含题型覆盖） |
| `lib/i18n/zh-result.ts:53` / `en-result.ts:53` | 结果页用户可见文案：「在转换题与分类题中，部分答案与{t}的典型表现一致」「可能影响红/绿相关色彩的区分」 |
| `lib/i18n/zh-result.ts:56-57,68` / `en-result.ts:56-57,67` | 「转换/分类题中 N 题符合绿色觉异常典型表现」「转换题」等指标文案 |
| `lib/scoring.ts:117-119,148` | 上述文案由 `scoreIshihara` 实际消费并展示给用户 |
| `lib/i18n/zh-faq.ts:13` / `en-faq.ts:13` | 「转换题、消失题、隐藏题多角度交叉…偏向红绿还是蓝黄」 |
| `lib/i18n/en-core.ts:41` | 「All 38 plates covering transformation, vanishing, hidden and classification types」 |
| `lib/fun.ts:38-47` | 章末科普：「隐藏题反向探测，分类题区分红绿两轴」 |
| `lib/i18n/zh-ui.flow.ts:79-82` / `en-ui.flow.ts:79-82` | 题型标签键仍含转换/隐藏/分类 |
| `app/test/ishihara/[mode]/page.tsx` metadata | 「覆盖转换/消失/隐藏/分类题型」 |
| `docs/SPEC.md:174-194`、`docs/PRD.md:287`、`docs/DATA-SPEC.md:40-69,346-348`、`docs/ARCHITECTURE.md:251-252`、`docs/TESTING.md:47-48` | 规范与测试文档仍按 6 值题型枚举与「转换题判定异常类型」描述判读规则 |

**影响**：筛查结果会稳定输出"绿色觉异常（轻/中/重）"并配以根本不存在的"转换题命中"解释，用户可能据此形成错误的健康判断。README「不能替代专业医学诊断」的免责声明不足以抵消具体指标层面的误导。

**建议（按优先级）**

1. 在 `lib/scoring.ts` 中，当 `protanHit === 0 && deutanHit === 0` 时**不再输出具体 `type`**（返回 `null` 或新增"类型不可判定"态），并让结果页显示"本工具仅提示疑似异常与程度，不能区分异常类型"。
2. 同步清洗上表中所有用户可见文案（结果分析、FAQ、模式描述、趣味科普、metadata）与规范文档口径，统一为"消失型题 + 路径追踪 + D15 多角度交叉，仅作初筛"。
3. README 功能特性第 23 行改为「智能判读（疑似异常 / 程度 / 维度参考值）」并显式标注类型判定限制。
4. 若未来恢复双数字题型，再回写上述文案。

---

### P0-2 README Docker 部署命令不可执行

- `README.md:100-103` 给出 `docker build -t chromacheck . && docker run -p 3000:3000 chromacheck`。
- 全仓 `Dockerfile*` 搜索结果为 **0**；`docs/DEPLOYMENT.md:91-93` 才说明「在项目根目录创建 `Dockerfile`」，模板位于 `95-129` 行。
- 用户克隆仓库后直接照 README 执行必然失败。

**建议**：二选一 —— ① 把模板固化为仓库根 `Dockerfile` + `.dockerignore`，使 README 命令开箱可用（推荐）；② 在 README 部署段加前置说明「先按 `docs/DEPLOYMENT.md §3.1` 创建 Dockerfile」。

---

### P1-1 `docs/SPEC.md` 版本口径脱节（版本单一来源漏洞）

- `docs/SPEC.md:382` 写「`VERSION` 与 `package.json` 的 `version` 字段（**当前 `1.13.4`**）为权威」，同句又写「各文档头注释版本（如 SPEC `v1.14.0`）」——**自相矛盾**。
- 实况：`VERSION` / `package.json` / `package-lock.json` / `README.md:19` / `CHANGELOG.md:4,6` / 8 份 docs 分册实现状态行 / SPEC 头注释均为 **1.14.0**。
- `docs/SPEC.md:383`「文档版本当前统一标注 v1.0」与 382 行亦不一致。
- `metadata.json` 仅有 `name`/`description`，无版本字段，故用户版本规则中的「metadata.json name 版本」不适用于本项目。

**建议**：把 382 行改为「当前 `1.14.0`」并改用不随版本漂移的表述（如「以 `VERSION` 文件实时值为准」），避免每次发版都要改这一句；同时厘清 383 行的"文档自版本"口径。

---

### P1-2 `docs/DEPLOYMENT.md` Docker 章节过时 / 含虚构配置

- `docs/DEPLOYMENT.md:131-138`：「使用 standalone 输出模式需要先在 `next.config.js` 中配置」并给出 `module.exports = { output: 'standalone' }` 模板。实况：项目用 **`next.config.mjs`（ESM）** 且 `next.config.mjs:36` **已配置** `output: 'standalone'`。照文档操作会新建 `next.config.js`，造成双配置文件冲突。
- `docs/DEPLOYMENT.md:150,170,249` 使用环境变量 `NEXT_PUBLIC_APP_URL`；全仓检索该标识符**仅出现在这 4 处文档**，代码零引用，`.env.example` 也只声明 `NEXT_PUBLIC_GA_ID` —— 属于虚构配置项（Docker/compose 传了也不会被读取）。
- Node 版本三处口径不一：`README.md:57` ≥ 18.17 / `.github/workflows/ci.yml:26` 22 LTS / Dockerfile 模板 `node:20-alpine`（`:97,103,111`）。建议统一为 22 LTS。
- `docs/DEPLOYMENT.md:40-43` 的 `git remote add origin` / `git init` 引导对本已托管仓库有风险（虽有 :35 注释警告，仍建议删除该整段）。

---

### P1-3 两套项目记忆对页脚格式互相冲突

- 全局项目记忆 `C:/Users/Admin/.codebuddy/projects/e-Github-ChromaCheck/memory/footer_version_build.md`（2026-11-05）规定 `v主.次.修 · build yymmddhhmm`（小写 v、空格·空格），并称「当前 1.13.1、已在代码完整落地」。
- 用户 **2026-11-06** 明确修订为 `V{ver}· build {yymmddhhmm}`（示例 `V1.2.3· build 2611051259`）；代码 `Footer.tsx:37`、`next.config.mjs:4-8`、`docs/SPEC.md §3.6`、工作区 `.codebuddy/memory/footer_version_build.md` 均已按新格式落地。
- 全局记忆未同步 → 未来会话可能"按记忆"把页脚改回旧格式。

**本次已处理**：按记忆维护规则更新了仓库外的全局项目记忆文件与索引行（未改动仓库文件）。另提示：工作区 `.codebuddy/memory/`（随仓库提交）与 IDE 全局项目记忆是两套并存体系，同主题内容需保持同步，建议后续统一到单一来源。

> 附：代码本身符合用户 11-06 指令 —— 版本+build 唯一位置在 `Footer.tsx`（容器 `id="app-footer"`），`Navbar` 等头部组件无版本号，构建号 10 位 `yymmddhhmm` 由 `next.config.mjs` 构建期注入 `NEXT_PUBLIC_BUILD_ID`，缺失回退 `pkg.version`。

---

### P2 低优先级偏差

| 编号 | 问题 | 证据 |
| --- | --- | --- |
| P2-1 | README 内部清单不一致：第 19 行「已实现」未含信号灯/批量/键盘输入，第 24 行功能特性却含前两者；v1.14.0 新增的**实体键盘输入**整个 README 未提（仅在图片 alt「数字键盘」出现） | `README.md:19,24,37`；`CHANGELOG.md:6-11` |
| P2-2 | README 遗漏已实现能力：断点续测草稿 `cc.progress.v1`、历史汇总 CSV / 批量汇总导出、驾驶场景 `scene=driver` 与合规提示、无障碍 SkipLink / `prefers-reduced-motion`、自托管字体、FAQPage JSON-LD、错误边界 | `components/test/useResumeProgress.ts`、`lib/export-import.ts:113-151`、`components/result/DriverCompliance.tsx`、`app/fonts/`、`components/home/HomeFaq.tsx:35-46` |
| P2-3 | 「项目结构」漏列 9 个 `lib` 模块 | `signal-scoring.ts`、`report-canvas.ts`、`sharecard-canvas.ts`、`scoring-text.ts`、`path-field.ts`、`privacy-data.ts`、`license.ts`、`site.ts`、`types.ts` |
| P2-4 | 措辞不准：①「首页 FAQ 双栏问答」实为「左简介吸附栏 + 右单列手风琴」，非双栏并排问答（SPEC 头注释同措辞）；②「五种色觉视角切换」仅结果页 `EyesSwitcher.tsx` 有 5 种，首页 `CvdSimulator.tsx` 只有 4 种；③「检测历史本地存储」若理解为全范式覆盖，信号灯结果只在组件 state、不调用 `saveResult` | `README.md:27,28,19`；`components/home/HomeFaq.tsx:55-110`；`components/test/SignalRunner.tsx` |
| P2-5 | 头注释漏改：`lib/questions.ts:2` 仍为 `v1.7.4`，但 v1.13.0 明确改动了题库；按用户「仅被改动文件更新头注释」规则应升至 `1.13.0` | `CHANGELOG.md:66` 对照 `lib/questions.ts:2` |
| P2-6 | 工程一致性：CI `npx tsc --noEmit` 未复用 `npm run type-check`；CI 注释称「避免 setup-node v5 依据 `packageManager` 字段自动缓存」但 `package.json` 无该字段；README 称可用 pnpm/yarn，但仓库提交 `package-lock.json` 且 CI 固定 `npm install` | `.github/workflows/ci.yml:5-6,35`；`README.md:60` |

---

## 三、通过项（核实无误）

**版本与文档一致性**

- `VERSION` = `package.json.version` = `package-lock.json.version` = `1.14.0`；`README.md:19`、`CHANGELOG.md:4,6`、`docs/SPEC.md:1,3,25`、`docs/` 8 份分册实现状态行全部为 v1.14.0（唯 P1-1 一处脱节）。
- `LICENSE` 为 MIT，与 README 徽章一致；技术栈版本与 `package.json:18-33` 一致（Next 14.2.15 / React 18.3.1 / TS 5.4.5 / Tailwind 3.4.10 / Vitest 2.1.9）。

**README 声明 ↔ 代码实况**

- 快速开始 4 条命令对应脚本全部存在：`dev`/`build`/`start`/`lint`/`type-check`/`test`（`package.json:7-15`）。
- 7 条测试路由全部存在（前三条为 `[mode]` 动态目录）：`ishihara`、`path-tracking`、`hue-arrangement`、`advanced`、`signal`、`batch`、`child`。
- 三种报告导出均有实现：PNG（Canvas `lib/report-canvas.ts`）、打印 PDF（`window.print()`）、复制文字（`navigator.clipboard.writeText`），另有第 4 种分享卡 PNG。
- 历史多档案 CRUD/切换 + JSON 导出导入 + 汇总 CSV；响应式/深色/色觉安全/减少动效；趣味包四项且可一键关闭；中英双语 i18n；PWA（`app/offline/page.tsx`、`app/manifest.ts`、`public/sw.js`、注册组件）；GA4 仅生产且 `anonymize_ip`、只报 `page_view`；FAQ 12 条；设置面板四项。
- `lib/` 中 README 点名的 16 个模块全部存在；信号灯（9 任务题库 + 判读）、儿童（10 题图形库 + 落库）、批量（编排 + CSV 汇总）均为真实实现而非路由占位。
- 被点名文件全部存在：`docs/` 11 个 `.md`、`docs/images/` 3 张 `.jpg`、`prototype/` 4 个 `.html`、`.github/CONTRIBUTING.md` + `workflows/ci.yml`、`app/robots.ts`/`sitemap.ts`/`llms.txt/route.ts`/`manifest.ts`。

**质量门禁（本次实跑）**

| 检查 | 命令 | 结果 |
| --- | --- | --- |
| 类型检查 | `node node_modules/typescript/bin/tsc --noEmit` | 退出码 0，无错误 |
| Lint | `node node_modules/next/dist/bin/next lint` | `✔ No ESLint warnings or errors` |
| 单元测试 | `vitest run --reporter=json` | **14 文件 / 43 suites / 97 例，97 passed，0 failed** |
| 200 行拆分规则 | 全仓源码行扫描（排除 `prototype/`） | 152 个 `.ts/.tsx` 源文件全部 ≤200 行（`package-lock.json` 为数据文件，不属源码） |
| 页脚规范 | 代码 + SPEC §3.6 核对 | 符合用户 2026-11-06 指令（见 P1-3） |

> 注：`next build` 本次未重跑（CHANGELOG v1.13.4 记录离线构建 29/29 页通过，且本轮未改动构建链）；如需可另行验证。另本机工具会把 `vitest` 进程误判为 watch，测试结论通过 `--outputFile` 写 JSON 后读取确认。

---

## 四、建议处理顺序

1. **P0-1**：修正 `scoring.ts` 类型判定 + 清洗全部用户可见文案与规范文档（医疗筛查诚信问题，优先）。
2. **P0-2**：补 `Dockerfile` 或在 README 加前置说明（一次性，成本低）。
3. **P1-1 / P1-2**：修 SPEC §8.2 版本表述、DEPLOYMENT.md `next.config.js` 与虚构环境变量、统一 Node 版本口径。
4. **P2-1 ~ P2-4**：README 一次补全（键盘输入、断点续测、CSV、驾驶场景、漏列模块）并校正措辞。
5. **P2-5 / P2-6**：随后续改动顺带处理头注释与 CI 小项。

按用户版本规则，上述任一仓库文件修改均需 bump 最小版本并同步 `VERSION` / `package.json` / `package-lock.json` / README / CHANGELOG / docs 实现状态行，且仅更新被改动文件的头注释。
