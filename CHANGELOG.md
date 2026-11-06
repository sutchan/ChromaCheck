# 变更日志

本文件记录 ChromaCheck 的版本变更，遵循 [Keep a Changelog](https://keepachangelog.com/) 规范。
版本号的单一来源为仓库根目录 `VERSION` 文件与 `package.json` 的 `version` 字段（当前 `1.13.3`）。

## [1.13.4] - 2026-11-06

### 改进（任务清单收口：R8a / R8b）
- R8a：历史页内联样式收敛——`app/history/page.tsx`（16 处内联 `style={{…}}` 清零）与 `app/history/error.tsx` 改用 `globals.css` 新增语义类（`.history-*` / `.btn-sm` / `.hidden-input`），沿 `.faq-*` 页面级样式先例、置于 `@layer components` 末尾确保覆盖 `.stack` / `.row` 默认值。
- R8b：`components/test/TestRunner.tsx` 不再内联复刻答题流程 JSX，改为复用 `IshiharaFlow`（`key=runKey` 重挂载保持「重新开始」语义；`IshiharaFlow` 新增可选 `id` prop 保留 runKey 实例标识）。原「result props 透传 6+ 层」经复核已过时——现行架构经 Context（`useLang` / `useSettings`）与 2–3 层回调 props 无深透传，一并销项。
- 验证：`tsc --noEmit`、`next lint`、Vitest 14 文件 97 例、离线 `next build`（8 个自托管 woff2 打包）全部通过。
- 任务文档：R8 全量归档至 `docs/tasks-done.md` §六；`docs/TASKS.md` 待办清零并记录 2026-11-06 时间戳。
- 版本单一来源同步至 `1.13.4`（`VERSION` / `package.json` / `package-lock.json` / `README` / `docs/SPEC.md` 状态行）。

## [1.13.3] - 2026-11-05

### 修复（CI 运行时）
- `.github/workflows/ci.yml`：`setup-node` 的 `node-version` 由已弃用的 `20` 升至 LTS `22`；`actions/checkout` 与 `actions/setup-node` 由 `v4` 升至 `v5`（动作自身运行时已迁移 Node 24），消除 GitHub Actions「Node.js 20 is deprecated / forced to run on Node.js 24」告警。
- 同步修正工作流注释：明确 `npm install` 安装策略与不启用 `cache` 的原因（避开 setup-node v5 依据 packageManager 字段的自动缓存检测），项目运行时固定 Node 22 LTS。
- 版本单一来源同步至 `1.13.3`：`VERSION` / `package.json` / `package-lock.json` / `README` / `docs/` 各分册「实现状态」行与 SPEC 头注释；页脚版本直读 `package.json`，无需改动。

### 修复（离线构建字体失败）
- 修复 EdgeOne / CI 构建失败：`next/font/google` 在**构建期**需访问 `fonts.gstatic.com`，离线环境返回 null 并报 `TypeError: Cannot read properties of null (reading '1')`（`app/layout.tsx`）。改为 `next/font/local` 真自托管。
- 8 个 latin 子集 woff2（Archivo 400–800 / IBM Plex Mono 400–600，取自 `@fontsource/*`）随仓库提交于 `app/fonts/`；字体定义抽至 `app/font-defs.ts`，构建期不再联网，生产环境亦自托管。
- 修复 CSS 字体变量覆盖缺陷：next/font 的 `variable` 与 `globals.css` `:root` 同名 `--font-sans` / `--font-mono` 作用于同一元素相互覆盖，会丢失中文回退链；改用中间变量 `--font-archivo` / `--font-plex-mono` 组合回退链。
- 验证：离线环境 `next build` 通过（29/29 静态页生成，8 个 woff2 产物已打包）；`tsc --noEmit`、`next lint`、Vitest 97 例全绿。
- 同步 `docs/SPEC.md` §3.2 字体规范；被改文件头注释升至 `1.13.3`。

## [1.13.2] - 2026-11-05

### 改进（首页常见问题）
- 首页 FAQ 区改为桌面双栏：左侧简介侧栏（标题 / 说明 / 问题总数 / 延伸阅读入口）随滚动吸附，右侧为整卡分隔式手风琴；修复原单列 `max-width: 760px` 造成的左侧大片留白与内容错位，`≤900px` 自动收为单栏。
- 手风琴由原生 `<details>` 改为受控按钮结构（`aria-expanded` / `aria-controls` / `role="region"`），补齐题号、`hidden` 面板与焦点环，支持同时展开多题；移除字面量与内联布局样式，样式集中至 `globals.css` 的 `.faq-*`。
- FAQ 文案由 5 条扩充至 12 条：新增检测前准备、能否替代体检、遗传与治疗、儿童适用性、结果波动原因、测后去向、辅助手段；`FAQPage` 结构化数据随问答列表自动同步。
- 文案抽离为 `lib/i18n/zh-faq.ts` / `en-faq.ts`（中英键集合对称，`DictKey` 编译期校验），`zh-core.ts` / `en-core.ts` 不再逼近 200 行上限；`dict.ts` 合并顺序改为 core → faq → ui → result。
- 版本单一来源同步至 `1.13.2`（`VERSION` / `package.json` / `README` / `docs/` 各分册「实现状态」行）。

### 审查修复（安全 / 规范 / 可达性 / 文档）
- 安全：JSON-LD 注入增加 `<` `>` `&` 与行/段分隔符转义（`components/seo/JsonLd.tsx` 的 `safeJson`），阻断 `</script>` 断点注入与脚本逃逸（纵深防御，即使数据为可信常量）。
- 规范：`components/test/ChildFlow.tsx` 的 `useCallback` 补齐缺失的 `lang` / `t` 依赖，消除 ESLint `react-hooks/exhaustive-deps` 警告。
- 可达性：为 `guide` / `learn` / `privacy` / `offline` 四个服务端页面补充语义化根容器 id（`guide-page` / `learn-page` / `privacy-page` / `offline-page`），对齐全局语义 id 规范，便于调试定位与端到端测试锚定。
- 文档：`docs/SPEC.md` §6.3 总体结论阈值对齐实际实现（`wrongRate` 比例阈值，与 `lib/scoring.ts` 及单元测试一致），并修正 SPEC 版本漂移（头注释 / 实现状态行 / §8.2 / 页脚统一至 `1.13.2`）。
- 全仓版本单一来源同步至 `1.13.2`（`VERSION` / `package.json` / `README` / `SPEC`，先前 `VERSION` 滞后于 `package.json` 与 `CHANGELOG`，本次校正）。

## [1.13.1] - 2026-11-03

### 代码健壮性 / 规范对齐
- 修复原型 `prototype/assets/js/data.js` 在历史提交中引入的重复/损坏内容（约 1006 行冗余），恢复为干净的数据定义；移除误提交的拆分产物（`data-articles.js`、`wireframes-catalog-base-1/2.js`、`wireframes-catalog-biz-1/2.js`），恢复 `wireframes-catalog-base.js`/`wireframes-catalog-biz.js` 为完整数组定义。
- 为 5 个测试运行页（`advanced`/`signal`/`hue-arrangement`/`ishihara`/`path-tracking`）补充路由级语义 id（`advanced-test-page` 等），便于调试定位与端到端测试锚定，对齐全局语义 id 规范。
- 文档体系同步至 v1.13.1（`docs/` 各分册「实现状态」行对齐当前版本；SPEC 记录 v1.13.0 科学性修正）。
- 原型 `prototype/` 按 `docs/SPEC.md §2.2` 界定为「设计验证参考，非发布源码」，其脚本为无打包器的经典全局脚本、依赖固定加载顺序；本次未对其超 200 行文件做机械拆分，以避免破坏参考原型且无法在本环境浏览器验证。提交版应用源码 `app/`/`components/`/`lib/` 均符合单文件 ≤200 行规范。

## [1.13.0] - 2026-11-03

### 科学性修正（色觉检测图）
- 修正 `lib/ishihara.ts` 色觉异常模拟矩阵：原 daltonize 矩阵可逆（秩 3），仅做色相偏移、仍保留可分辨性，预览会错误显示石原氏数字"清晰可见"。改为 Brettel/Vienot 1999 秩-2 二色觉投影矩阵，使等混淆色在模拟异常视觉下正确趋同/减弱。
- 路径追踪配色改为等亮度异色相混淆对（橙 `#b8732e` / 绿 `#4f9438`，正常空间 ΔL≈0.005、异常空间 2D 距离≈0.04），避免依赖亮度线索导致非色混淆筛查；原配色 ΔL≈0.13、且背景为单色，实为亮度描线任务。
- D15 色相排列：固定参考卡由"双蓝紫"（破坏色环闭合几何）改为色相远端（蓝紫 `#009ce0` 与粉红 `#d66ea3`，跨约 269°）；15 张可移动卡改为 CIELAB Lch 等亮度等彩度（L*≈60、C* 近似恒定）的蓝→红单调光谱渐变，消除亮度/彩度线索干扰纯色相判别。
- 题库：原 `transformation`/`classification`/`hidden` 题型渲染层仅绘制单数字，无法呈现"异常者读另一数字/隐藏数字浮现"，且 `hidden` 因 `answer=''` 渲染空白沦为 no-op；统一降级为 `vanishing`（红绿等混淆，正常可见、异常难辨），并清除不可见的 `protan`/`deutan` 预期键。本应用定位为初筛，未实现真正的双数字变形/隐藏版（`learn-data.ts` 已同步说明）。
- 修正 `learn-data.ts` 对变形/隐藏题型的夸大描述，与实现一致。
- 已知限制：单一红/绿对无法同时完美混淆 protan 与 deutan（二者混淆点不同），对红色盲(protan)消隐弱于红绿色盲(deutan)，与真实石原氏"分题型配色"一致；D15 的 TES 阈值(20/40)仍沿用经验值，未做本地样本标定。

## [1.12.3] - 2026-11-03

### 清理（页脚构建号规范收尾）
- 修正 `lib/site.ts` 过时注释：`SITE_UPDATED` 不再用于页脚（页脚已改 build 编号展示），现仅支撑隐私页「最后更新」。
- 删除 i18n 死键 `footer.updated`（页脚「更新于」展示已移除，全仓库无引用处）。
- 同步 `site.ts` / `zh-core` / `en-core` 头注释至 `1.12.3`，全局版本单一来源同步至 `1.12.3`。

## [1.12.2] - 2026-11-03

### 改进（页脚构建号）
- 页脚取消「更新于 {日期}」展示，改为构建号：`© · v{version} · build {yyyymmddhhmm} · {用途}`。
- 构建号由 `next.config.mjs` 在构建时按本地时间生成 `yyyymmddhhmm`，注入 `NEXT_PUBLIC_BUILD_ID`（自动暴露客户端）；`dev` / `build` 均生效，无需手工维护、杜绝脱节。
- `components/privacy/PrivacyContent.tsx` 的「最后更新」日期保留不变（合规需要，仍读 `lib/site.ts` 的 `SITE_UPDATED`）。
- 版本单一来源同步至 `1.12.2`。

## [1.12.1] - 2026-11-03

### 文档
- `docs/TASKS.md` 精简：移除已归档任务的残留索引（T1–T6 / C1–C9 详情），仅保留未完成待办清单（R8）；已完成任务统一见 `docs/tasks-done.md`（§一~§六）。
- 版本单一来源同步至 `1.12.1`。

## [1.12.0] - 2026-11-03

### 改进（R4 无障碍 / R5 测试 / R8 反模式）
- **R4 无障碍走查**：`IshiharaPlate` 的 `<canvas>` 加 `role="img"` 与类型化 `aria-label`（不剧透答案）；`AnswerReview` 表格 `<th>` 加 `scope="col"`、表加 `aria-label`；`Numpad` 加 `role="group"` + `aria-label`；新增 i18n 键 `ishihara.plateAria` / `test.numpadLabel`。`ChildPlate` / `SignalRunner` 经核验已具备 aria。
- **R5 测试覆盖**：新增 6 模块单测（child-scoring / format / scoring-text / path-field / ishihara / sharecard 的 `computeRadar`），`vitest` 套件 73 → 97 例。受 node 环境限制，`sharecard`（`drawShareCard`）/ `report-canvas`（`drawReport`）的 Canvas 绘制不可单测。
- **R8 反模式**：提取 `TestRunner` 与 `AdvancedRunner` 重复的 mounted 水合守卫 + 进度恢复逻辑为共享 hook `components/test/useResumeProgress.ts`，消除重复。

### 文档
- `docs/TASKS.md` §6 收敛至仅余 R8（R3–R7 已归档）；`docs/tasks-done.md` 新增 §六 归档 R3–R8。
- 版本单一来源同步至 `1.12.0`。

## [1.11.2] - 2026-11-02

### 修复（R3 / R6 / R7 收口）
- **R3 拆分收尾**：`components/test/PathTrackingCanvas.tsx` 在已抽离 `pathCanvas.types/render/coords` 基础上，再把键盘通道（光标移动 / Enter 落点 / Backspace 撤销 / Esc 清空）抽为 `pathCanvas.keymap.ts`，组件由 247 行降至 146 行，符合单文件 ≤200 行规则。
- **修复 vitest 误报**：i18n 数据分片 `zh-ui.test.ts` / `en-ui.test.ts` 被 vitest 的 `lib/**/*.test.ts` 匹配规则当成测试文件，报 `No test suite found`；更名为 `zh-ui.flow.ts` / `en-ui.flow.ts`（导出契约不变），测试套件由 10 收为 8、73 例全过。
- **R6 构建可复现**：生成 `package-lock.json`（8072 行），`vitest` 与 `@vitest/coverage-v8` 由 `^2.1.9` 钉死为 `2.1.9`。注：v1.10.1 曾因 CI 无 lockfile 而用 `npm install`；现 lockfile 入库后，CI 可择机切回 `npm ci`（本轮未改 CI）。
- **R7 SEO metadata 补齐**：`app/test/batch/page.tsx` 为客户端组件无法导出 metadata，新增 `app/test/batch/layout.tsx` 提供标题 / 描述 / canonical / OG（`robots: noindex`，工具页不索引）；`app/not-found.tsx` 由客户端组件改为服务端壳，UI 移至 `components/NotFoundClient.tsx`，404 页补上 `noindex` 元数据。

### 验证
- `tsc --noEmit` 干净；`vitest run` 8 文件 73 例全过；`next build` 29 路由全部成功生成（含 `/test/batch`、`/_not-found`、`/learn/[slug]`）。

## [1.11.1] - 2026-11-02

### 重构（R3 超 200 行拆分）
- 按单文件 ≤200 行规则拆分超行源码：`components/test/PathTrackingCanvas.tsx`（247）抽离 `pathCanvas.types.ts`（STEP 常量 + Props）、`pathCanvas.render.ts`（绘制纯函数）、`pathCanvas.coords.ts`（指针坐标归一化）；`components/layout/SettingsDialog.tsx`（236）抽离 `SettingsSwitchRow.tsx` 与 `settingsControls.ts`；i18n 字典 `lib/i18n/zh-ui.ts`（271）/ `en-ui.ts`（273）按语义块拆为 `*.test.ts` / `*.result.ts` / `*.guide.ts` 子模块，主文件合并导出。导出契约（`ZH_UI` / `EN_UI` / 组件 props）保持不变，仅内部模块拆分。

### 文档
- 版本单一来源同步至 `1.11.1`；修正 README 漂移的版本号（原误标 v1.10.2）。

## [1.11.0] - 2026-11-02

### 改进
- 首页常见问题（FAQ）界面升级：原生 `<details>` 卡片改为带旋转箭头指示器的手风琴。`app/globals.css` 新增 `.faq-list` / `.faq-item` / `.faq-q` / `.faq-a` / `.faq-marker` 样式——展开时高亮品牌色边框 + 阴影、hover 背景、`:focus-visible` 可见描边、内容淡入动画；首项默认展开以引导阅读。`components/common/Icon.tsx` 新增 `chevron` 图标。功能、文案与 `FAQPage` 结构化数据均不变。

### 文档
- 版本单一来源同步至 `1.11.0`。

## [1.10.2] - 2026-10-17

### 重构 / 清理
- 删除死代码：移除 `lib/questions.ts` 的 `TYPE_LABEL` 常量（已被 `components/test/TestProgress.tsx` 与 `components/result/AnswerReview.tsx` 的 `TYPE_LABEL_KEY` 取代）。
- 清理 i18n 字典中 11 个从未被引用的键（`nav.lang`、`child.noShape`、`common.analysisNote`、`guide.desc`、`guide.pageTitle`、`learn.title`、`learn.desc`、`learn.crumbHome`、`learn.crumbLearn`、`profile.avatar`、`profile.delete`），字典条目由 509 降至 498。说明：`child.noShape` 与 `SHAPE_LABEL.none` 重复；`guide.*` / `learn.*` 部分键对应服务端静态 `metadata`（已硬编码中文，无需字典条目）。
- 经脚本扫描确认：无孤儿文件、无未使用依赖、无 `console.*` / `debugger`；`app/globals.css` 的全部自定义类均被组件引用。

## [1.10.1] - 2026-10-17

### 修复
- CI 工作流（`.github/workflows/ci.yml`）：移除 `actions/setup-node` 的 `cache: npm`，安装步骤由 `npm ci` 改为 `npm install`。仓库不提交 lock 文件（`package-lock.json` / `yarn.lock`），而 `cache: npm` 与 `npm ci` 均要求 lock 文件存在，导致 `setup-node` 直接报 `Dependencies lock file is not found` 而使整个工作流失败。
- 设置弹窗显示不完整：弹窗遮罩改经 `createPortal` 挂载至 `document.body`。根因是 Navbar `header` 上的 `backdrop-filter: blur(10px)` 会成为 fixed 定位后代的包含块，使全屏遮罩被限制在 60px 高的头部内；Portal 到 body 后彻底绕过包含块与层叠上下文限制。
- 打开设置时锁定背景滚动（关闭后恢复）；遮罩顶部留白由 `10vh` 改为 `clamp(16px, 10vh, 72px)`，适配矮视口。
- 验证（Playwright 实测 1280×720 与 900×520）：遮罩父元素为 `BODY`，弹窗 420×441 完整居中，四组设置全部可见，Esc / 遮罩点击关闭正常。

### 文档
- `README.md` 追平实际版本：状态块收敛为单行，项目结构由逐文件罗列改为按目录职责概述（移除已删除的 ThemeToggle / LangToggle，补 lib/i18n/、设置面板等），移除占位联系方式。
- 版本单一来源同步至 `1.10.1`。

## [1.10.0] - 2026-10-17

### 新增
- 设置面板：右上角新增设置按钮（`components/layout/SettingsButton.tsx`，id `settings-button`，aria-haspopup/aria-expanded），点击弹出设置窗口（`components/layout/SettingsDialog.tsx`，`role="dialog"` + `aria-modal`，Esc / 点击遮罩关闭，打开即聚焦面板）。
- 原导航栏的中英切换、主题深浅、色觉安全、趣味体验四个开关统一迁移至设置弹窗，按「语言 / 主题外观 / 色觉安全 / 趣味体验」分组呈现；持久化机制不变（`cc.settings.v1` + `cc.lang.v1`）。

### 重构
- 删除 `components/layout/LangToggle.tsx` 与 `components/layout/ThemeToggle.tsx`（功能已并入设置弹窗，避免死代码）。
- i18n 字典 `theme.*` 键组替换为 `settings.*` 键组（中英对称，含设置项描述文案）。

### 文档
- 版本单一来源同步至 `1.10.0`。

## [1.9.1] - 2026-10-16

### 重构（R3 超 200 行拆分）
- `Profile` 接口由 `lib/types.ts` 迁移至 `lib/profile.ts`（领域归属更清晰），`components/history/ProfileSwitcher.tsx` 与 `lib/export-import.ts` 的 `Profile` 导入源同步调整。
- 历史页结果卡片抽取为 `components/history/HistoryCard.tsx`，`app/history/page.tsx` 由 212 → ~174 行。
- `lib/types.ts`（201 → ~191）、`app/history/page.tsx` 降至 200 行以内，满足单文件行数约束；`components/test/PathTrackingCanvas.tsx`（247）与 i18n 字典 `en-ui.ts` / `zh-ui.ts`（279 / 277，纯键值对数据）列为后续拆分待办。

### 文档
- `docs/TASKS.md` §6：R1 / R2 已由 v1.9.0 安全提交 5030859 收口，标记完成；R3 / R4 更新进展。
- `docs/tasks-done.md`：新增 §五 归档 R1 / R2 收口实现。
- 版本单一来源同步至 `1.9.1`。

## [1.9.0] - 2026-10-15

### 新增
- 国际化覆盖补齐（TASKS C9）：i18n 由单文件 `lib/i18n.ts` 重构为 `lib/i18n/` 模块（`dict.ts` / `zh-core|zh-ui|zh-result` / `en-core|en-ui|en-result` / `t.ts` / `lang.ts`）；`uiText` 与各 scoring 模块接入 `lang` 参数；40 个客户端组件接入 `useLang()`，覆盖历史 / 结果 / 科普（列表 + 正文）/ FAQ / 隐私 / 指引 / 离线页；中英词条对称（ui 77 / result 18 / learn 10 组）。

### 测试
- 新增 `lib/profile.test.ts`（11 例）与 `lib/export-import.test.ts`（10 例）：档案 CRUD / 默认档案回退 / 损坏数据不抛错；导出包结构 / 导入解析 / 冲突合并策略（档案保留本地、结果保留较新）/ 汇总 CSV（BOM、按档案分组、缺省 profileId 归默认）。测试总数 52 → 73，全部通过。

### 变更
- 收口版本漂移：代码文件头已标注 v1.9.0 而 `VERSION` / `package.json` 仍为 1.8.2，本次统一同步至 `1.9.0`。

## [1.8.2] - 2026-10-15

### 变更
- 页脚在版本号后新增「更新于 {日期}」展示：`components/layout/Footer.tsx` 读取 `lib/site.ts` 的 `SITE_UPDATED` 常量（更新日期唯一来源），格式为 `v{version} · 更新于 {SITE_UPDATED}`。
- 静态原型同步：产品页脚、原型外壳版本徽标及三份规范页（组件库/设计系统/交互标准）版本号后均追加「更新于 2026-10-15」。
- 修正文档版本展示漂移：README「当前项目版本」v1.7.9 → v1.8.2；SPEC §0 实现状态 v1.7.8 → v1.8.2。
- 结果结构 `version` 字段与改动文件头注释对齐 `1.8.2`。

### 文档
- `docs/TASKS.md`：修正过时的头部状态（v1.7.9 旧快照 / C1–C8 阻塞描述 → v1.8.2 全部完成），§5 完成结论补充 v1.8.1 审查整改说明，修正 tasks-done 章节引用（§四 → §三）。
- `docs/tasks-done.md`：更新时间戳与版本，新增 v1.8.1 审查整改附注。

## [1.8.1] - 2026-10-14

### 修复（对抗式审查整改）
- 隐私政策（`app/privacy/page.tsx`）与 `docs/PRIVACY.md` 对齐：如实披露第一方匿名事件上报（`/api/analytics/event`，不落库、不记录 IP/UA）与 Google Analytics，新增未成年人（儿童模式）条款。
- 色相排列判读 `lib/hue-scoring.ts`：收窄 `deviationAxis` 返回类型，D-15 不再输出不可达的 `protan`（红绿向统一归为 deutan，细分见进阶联合判读），修正误导性注释。
- 结果展示将"置信度"统一改为"判读稳定性（内部估计）"，消除虚假医学确定感（`ResultSummary.tsx` / `ReportActions.tsx` 文案与各 scoring 模块注释）。
- 路径追踪 `lib/path-scoring.ts`：重合度计算由 `pathOverlap` 更名为 `pathF1`（实为 F1 而非 IoU），重采样改为按累计弧长等距，避免采样不均导致的覆盖率偏差；明确 `TOL=0.07` 为归一化坐标容差（画布 7%）。
- 结果结构 `version` 由 `1.0.0` 对齐至 `1.8.1`（`hue-scoring` / `path-scoring` / `advanced-scoring` / `ChildFlow`），并标注向后兼容。
- 改动文件头注释版本号统一对齐 `1.8.1`；`docs/DATA-SPEC.md` 同步 `deviationDirection` 类型。

## [1.8.0] - 2026-10-14

### 新增（本地优先替代，无需服务端账号）
- 本地多档案 / 家庭共享（TASKS C1/C8）：`lib/profile.ts` 档案模型（昵称 / 头像 / 关系标签），`components/history/ProfileSwitcher.tsx` 切换与增删改；`TestResult.profileId` 由 `saveResult` 自动归属当前档案；历史页支持按档案筛选。
- 历史导出 / 导入（TASKS C2）：`lib/export-import.ts` 导出 JSON 包（档案 + 结果），导入按 id 合并（档案冲突保留本地、结果冲突保留较新），实现断点备份与跨设备迁移。
- 批量检测（TASKS C5）：新增 `/test/batch` 录入多名被测者、逐人标准检测、汇总 CSV 导出（按档案分组，含 BOM 兼容 Excel）；检测选择页新增入口。

### 文档
- `docs/TASKS.md`：C1 / C2 / C5 / C8 标注「本地优先替代已完成（v1.8.0）」；`docs/tasks-done.md` 归档实现摘要（§四）。
- 版本单一来源同步至 `1.8.0`。

## [1.7.9] - 2026-10-13

### 新增
- PWA 支持（TASKS C7）：`app/manifest.ts` 生成 Web App Manifest；`public/sw.js` Service Worker（预缓存首页 / 检测前指引 / 模式选择，导航请求回退 `/offline`，静态资源 stale-while-revalidate）；`components/pwa/ServiceWorkerRegistrar.tsx` 仅生产环境注册；零依赖脚本生成 `public/icons/icon-192.png`、`icon-512.png`、`icon-maskable-512.png`；根布局补 `appleWebApp` 配置。
- 儿童模式（TASKS C4）：`lib/questions/child.ts` 图形题库（10 题，含 2 道演示题）+ `lib/child-scoring.ts` 保守判读；`components/test/ChildPlate.tsx`（图形掩码点阵图）、`ChildShapeIcon.tsx`、`ChildRunner.tsx`、`ChildFlow.tsx`；新增 `/test/child` 与模式选择入口；`TestResult.child` 扩展与结果页 `ChildSummary` 区块；`TestMode` 增加 `'child'`，`MODE_TEXT` 补「儿童版」。
- 轻量 i18n（TASKS C6）：`lib/i18n.ts` 中英字典 + `components/layout/LangProvider.tsx` / `LangToggle.tsx`（偏好存 `cc.lang.v1`）；首页 `HomeContent`、模式选择 `TestSelectContent`、导航与儿童模式支持中英切换，零第三方依赖。
- 服务端匿名事件上报（TASKS C3）：`app/api/analytics/event` 路由（事件名白名单 + 1KB 体积上限，仅保留事件名 / 测试类型 / 时长 / 结果摘要，不落库、不记录 IP 与 UA）；`lib/analytics.ts` 新增 `reportServerEvent()`。

### 文档
- `docs/TASKS.md`：记录时间戳 2026-10-13，T1–T6 标注已完成；C1–C8 重新评估优先级与状态（C7 / C4 升 P0，C6 / C3 维持 P1，C1 / C2 / C5 / C8 因需服务端账号与数据库、与本地优先隐私定位冲突而阻塞）。
- 新增 `docs/tasks-done.md`：归档 T1–T6 与本次完成的 C3 / C4 / C6 / C7。
- 版本单一来源同步至 `1.7.9`（`VERSION`、`package.json`、改动文件头注释）。

## [1.7.8] - 2026-09-21

### 文档（SPEC 总纲对齐 v1.7.7 真实代码）
- 修复 SPEC 权威总纲长期脱节：头注释与底部版本声明由 `v1.0.6` 同步为 `v1.7.8`；§0 实现状态声明补全 v1.4 趣味包 / v1.5 38 板 / v1.5.1 GA4 / v1.6 SEO·GEO / v1.7 驾驶员场景 / v1.7.6 Vitest。
- §2.2 目录结构重写为真实模块清单（补 `hue-scoring`/`path-scoring`/`signal-scoring`/`advanced-scoring`/`fun`/`sharecard`/`report-canvas`/`analytics`/`license`/`site`/`path-field`/`scoring-text` + `lib/questions/` 子目录 + `*.test.ts`）。
- §3.2 字体改为 `next/font/google` 自托管（v1.7.4 起），不再写 CDN `<link>`。
- §5.2 `AnswerRecord` 对齐代码：移除未持久化的 `correct`/`expectedAnswer` 字段（判读时由 `isCorrect` 现场计算）。
- §5.3 `TestResult`：`ishihara` 改可选，补 `pathTracking?`/`hueArrangement?`/`scene?`（`'general'|'driver'`）。
- §5.4 `AppSettings` 补 `funMode: boolean`（v1.4，默认 true，存于 `cc.settings.v1` 内）。
- §8.2 版本单一来源 `1.7.2`→`1.7.8`，原型头版本 `v0.1.0`→`v0.1.2`。
- §8.4 测试门禁更新为 Vitest 已落地（39 判读例 + 13 storage 例，node 环境 + `vitest.setup.ts`），补安全响应头条目。
- §9 待办重写：已完成项列至 v1.7，推迟项更新为服务端上报/英文版/PWA/账号云同步。

### 版本同步
- 修复 `package.json` 版本（1.7.6）与 `VERSION`（1.7.7）不一致问题，统一至 `1.7.8`；README 状态行与 `npm test` 命令补全同步。

## [1.7.7] - 2026-09-09

### 修正（测试环境）
- 修复 Node 26 实验性 `localStorage` 与 DOM 模拟环境冲突导致 storage 用例全挂的问题：新增 `vitest.setup.ts` 注入内存版 `Storage`（`window` 指向 `globalThis`），全部用例统一跑 node 环境，移除 `jsdom` / `happy-dom` 依赖。

### 优化（可访问性与性能）
- `app/globals.css` 新增 `prefers-reduced-motion: reduce` 支持，尊重系统「减弱动态效果」偏好（WCAG 2.3.3）。
- 版本展示防脱节：`Footer` 版本号改为直读 `package.json`，不再硬编码。

### 版本同步
- 版本单一来源同步至 `1.7.7`（`VERSION`、`package.json`、改动文件头注释、README 状态行）。
- 同步 `docs/ARCHITECTURE.md` §4.1 存储规格与实际实现对齐（Key 规范 / 30 条上限 / safeSet 降级 / 运行时校验）。

## [1.7.6] - 2026-09-09

### 修正（判读引擎与存储健壮性）
- 修复石原氏判读误报：无隐含题时满分不再误判为「可疑色觉异常」（`scoring.ts` 增加 `hiddenTotal > 0` 前置条件）。
- `lib/storage.ts` 写路径统一 `safeSet` 降级（配额满 / 隐私模式静默失败），读取增加运行时校验（`isTestResult` / `isProgress` 类型守卫），损坏数据不再抛错。

### 新增（测试）
- 初始化 Vitest 测试套件：判读引擎全量单测（scoring / hue / path / signal / advanced，39 例）+ storage 13 例。

### 安全
- `next.config.mjs` 新增安全响应头：CSP、X-Frame-Options、X-Content-Type-Options、Referrer-Policy、Permissions-Policy。

### 优化（可访问性与性能）
- `HueArrangementGrid` 修复 `listbox` ARIA 误用（未实现键盘模式），改用 `group` + `aria-pressed`。
- `PathTrackingCanvas` 指针移动事件加 `requestAnimationFrame` 节流，消除高频重绘卡顿。
- `app/layout.tsx` 新增「跳到主内容」skip link（WCAG 2.4.1）。

## [1.7.5] - 2026-09-08

### 优化（导航结构）
- 将页眉导航的「科普」「隐私」入口移至页脚区，页眉仅保留「首页 / 开始检测 / 历史」，减少顶部干扰、突出核心检测流程（页脚已含「科普文章」「隐私政策」入口）。

### 版本同步
- 版本单一来源同步至 `1.7.5`（`VERSION`、`package.json`、改动文件头注释、`Footer` 展示版本、`README.md` 状态行）。
- 修正 `Footer` 展示版本长期停留在 `v1.7.0` 的脱节问题，现统一为 `v1.7.5`。

## [1.7.4] - 2026-09-07

### 优化（审查修复）
- 字体改为 `next/font/google` 自托管（Archivo / IBM Plex Mono），消除 `no-page-custom-font` 告警并去除运行时外部字体请求；同步移除手动 `<link>` 预连接。
- 移除根级 `app/loading.tsx` 全局加载骨架，避免每次路由切换闪现骨架屏。
- 首页 Hero 图版改用 `lib/questions.ts` 导出的 `HERO_PLATE` 常量，避免直接依赖完整题库导入。
- 新增 `lib/site.ts` 集中 `SITE_URL`，统一 `sitemap.ts` / `robots.ts` / `learn/[slug]` / 根布局的结构化数据域名来源。

### 版本同步
- 版本单一来源同步至 `1.7.4`（`VERSION`、`package.json`、改动文件头注释）。

## [1.7.3] - 2026-09-07

### 修正（答题流程与进阶模式恢复）
- 修复演示题作为最后一题时 `advanceFromReveal` 永不调用 `onDone`、测试卡死无法完成的问题（现末题直接提交结果）。
- 修复「恢复进度」功能整体失效：进度经 `useEffect` 异步写入 `initial`，而 `useIshiharaFlow` 的 `useState(initial?.index ?? 0)` 仅在首挂载生效，导致恢复总是从第一题开始。改用挂载门控（`mounted`），确保 `IshiharaFlow` 首挂载即带正确 `initial`。
- 修复进阶联合检测中途刷新后石原氏作答进度丢失：进阶模式现持久化并恢复石原氏阶段进度（`initial` 接入 `IshiharaFlow`，完成即清进度），与标准 / 快速版一致。

### 优化（SEO / 站点结构）
- 为 `/test/ishihara/[mode]`、`/test/hue-arrangement/[mode]`、`/test/path-tracking/[mode]`、`/test/advanced` 补充 `generateMetadata`（标题 / 描述 / canonical / OG）。
- 为色相排列与路径追踪动态路由补充 `generateStaticParams`。
- `app/sitemap.ts` 补全 `/test/ishihara/{quick,standard}`、`/test/advanced`、`/test/hue-arrangement/standard`、`/test/path-tracking/standard`。
- 新增 `app/loading.tsx` 路由级加载骨架。

### 版本同步
- 版本单一来源同步至 `1.7.3`（`VERSION`、`package.json`、改动文件头注释、`README.md` 状态行）。

## [1.7.2] - 2026-09-06

### 修正（文档版本同步、可访问性、代码拆分）
- 修正文档与代码版本脱节：`README.md` 状态行「当前项目版本」由 `v1.7.0` 同步为 `v1.7.2`（对齐 `VERSION`）；`docs/SPEC.md` §8.2 版本单一来源说明确认为 `1.7.2`。
- `app/page.tsx` 首页根容器补齐语义化 `id="home-page"`，与结果 / 指引 / 历史等页面一致。
- 拆分 5 个超 200 行源文件以符合「单文件 ≤200 行」规范（保持公开 API / 导出契约不变）：
  - `lib/sharecard.ts` 抽 Canvas 绘制原语至 `lib/sharecard-canvas.ts`；
  - `components/result/ReportActions.tsx` 抽报告绘制 `drawReport` 至 `lib/report-canvas.ts`；
  - `lib/ishihara.ts` 抽路径追踪（`standardPath` / `buildPathField` / `Path*`）至 `lib/path-field.ts`；
  - `components/test/IshiharaFlow.tsx` 抽答题状态与逻辑至 `components/test/useIshiharaFlow.ts`；
  - `lib/scoring.ts` 抽判读文案映射（`uiText` / 类型标签）至 `lib/scoring-text.ts`，并 re-export `uiText`。
- 版本单一来源同步至 `1.7.2`（`VERSION`、`package.json`、改动文件头注释）。

## [1.7.1] - 2026-09-06

### 优化（清理冗余代码与文件）
- 删除 `lib/analytics.ts` 中零引用的 `trackEvent`（其依赖的服务端事件上报尚未实现，GA4 页面统计由 `pageview` 覆盖）。
- 删除 `lib/advanced-scoring.ts` 中未使用的局部常量 `PATH_PASS`。
- 收敛仅模块内部使用、无外部引用的导出（去掉 `export` 关键字，收窄公共 API 面）：`lib/ishihara.ts` 的 `CVD_MATRIX`/`hexToRgb`/`rgbToCss`、`lib/hue-scoring.ts` 的 `TES_NORMAL`/`scoreHueArrangement`、`lib/fun.ts` 的 `TITLES`、`lib/path-scoring.ts` 的 `pathOverlap`、`lib/questions/hue-arrangement.ts` 的 `HUE_QUESTION`、`lib/questions/path-tracking.ts` 的 `PATH_QUESTIONS`。
- `docs/ARCHITECTURE.md` 补充消歧说明：`prototype/` 为独立设计参考、非应用运行依赖。

## [1.7.0] - 2026-09-06

### 新增（驾驶员场景色觉检测改进，对应 `docs/TASKS.md` T1–T6）
- **T1 驾照辨色力参考栏**：`lib/license.ts` 新增 `mapToLicense()`，依据《机动车驾驶证申领和使用规定》（公安部令第 172 号）第十二条「无红绿色盲」，将检测结果映射为合规结论 + 免责声明；`components/result/DriverCompliance.tsx` 在结果页渲染该参考栏（语义化 `id="driver-compliance"`）。
- **T2 信号灯辨识专项检测**：新增 `lib/questions/signal.ts`（9 题：红/绿/黄单灯辨色 + 信号含义）、`lib/signal-scoring.ts`（`scoreSignal`：辨色类任务须全对才算通过）、`components/test/SignalRunner.tsx` 与 `app/test/signal/page.tsx`；结果仅作驾驶场景参考，不计入历史。
- **T4 屏幕校准提示**：`app/guide/page.tsx` 新增「屏幕校准提示」区块（关闭护眼/夜间滤镜、标准色温亮度、控制环境光、演示题自检）与未校准免责提示。
- **T5 图版明度控制**：`lib/ishihara.ts` 的 `PALETTE` 重设计为判别型图版（转换/消失/隐藏/分类）采用「等亮度、异色相」配色，避免异常视觉仅凭亮度误读数字。
- **T6 严肃场景隐藏趣味模块**：`lib/types.ts` 新增 `Scene` 与 `TestResult.scene`；`?scene=driver` 经 `searchParams` 传入 `TestRunner` / `AdvancedRunner` 并写入结果；结果页在 driver 场景下隐藏「换眼睛」「三轴科普」等趣味元素，分享卡去除称号（`ReportActions` 新增 `plain`）。

### 修正 / 澄清
- **T3 色弱 vs 色盲语义澄清**：`lib/scoring.ts` 判读文案区分 dichromacy（色盲）与 anomalous（色弱），并明确「色弱一般不影响驾驶资格」；`DriverCompliance` 补充说明「色弱≠色盲、不代表不合格」。
- `app/test/page.tsx` 新增「驾驶 / 职业体检准备」入口（标准版驾驶场景 + 信号灯辨识，附场景参数）。
- `app/sitemap.ts` 纳入 `/test/signal`。

## [1.6.0] - 2026-09-05

### 新增（SEO 搜索引擎优化 / GEO 生成式引擎优化）
- `app/robots.ts`：自动生成 `robots.txt`，指向 sitemap，并屏蔽私有页面 `/result/`、`/history/`。
- `app/sitemap.ts`：自动生成 `sitemap.xml`，覆盖首页、各入口页与全部科普文章。
- `app/llms.txt/route.ts`：新增 `llms.txt`（GEO 约定），向生成式引擎提供站点索引、科普清单与关键事实的纯文本摘要；根布局 `<head>` 增加 `<link rel="alternate" href="/llms.txt">`。
- `components/seo/JsonLd.tsx`：通用 JSON-LD 注入组件。
- `app/layout.tsx`：注入 `WebApplication` 结构化数据（schema.org），并完善 `metadata`（robots 指令、`category`、`alternates.canonical`、`authors`、静态 SVG 社交分享图）。
- `components/home/HomeFaq.tsx` + 首页：新增常见问题区块与 `FAQPage` 结构化数据，提供可被引用的事实性问答。
- `app/learn/[slug]/page.tsx`：科普详情新增 `Article` 与 `BreadcrumbList` 结构化数据，并补全 per-page `metadata`。
- `app/learn/page.tsx`、`app/test/page.tsx`、`app/guide/page.tsx`、`app/privacy/page.tsx`：补全 per-page `metadata`（标题、描述、关键词、canonical、OG）。
- `app/result/[id]/layout.tsx`、`app/history/layout.tsx`：私有页面增加 `noindex` 声明。
- `public/og-default.svg`：1200×630 品牌社交分享图。

### 文档
- 版本单一来源同步至 `1.6.0`（`VERSION`、`package.json`、各改动文件头注释）。

## [1.5.1] - 2026-09-05

### 新增
- 接入 Google Analytics 4 匿名访问统计（衡量 ID `G-0F9QWS1PDX`）：新增 `lib/analytics.ts`（衡量 ID 单一来源 + `pageview`/`trackEvent` 上报辅助）与 `components/analytics/GoogleAnalytics.tsx`（`next/script` 注入 gtag.js，并随 App Router 路由变化补报 page_view）；根布局 `app/layout.tsx` 挂载该组件。
- 仅生产环境加载统计脚本；支持环境变量 `NEXT_PUBLIC_GA_ID` 覆盖，置为空字符串即全局停用。

### 文档
- `app/privacy/page.tsx`：新增「6. 匿名访问统计（Google Analytics）」，并更正「不嵌入追踪脚本 / 未启用匿名统计上报」的旧表述。
- `docs/PRIVACY.md` §2.2 更新为 GA4 实际采集范围与不上报清单，并标注 `analyticsEnabled` 服务端事件上报仍未实现。
- 版本单一来源同步至 `1.5.1`（`VERSION`、`package.json`、改动文件头注释）。

## [1.5.0] - 2026-09-05

### 新增
- 石原氏题库扩充至 38 板完整图谱（ROADMAP P1）：`lib/questions.ts` 在原有 24 题基础上新增 14 道检测图（plate 25–38，覆盖转换/消失/隐藏/分类/演示/常规题型），异常轴区分度与判读稳定性提升。
- 快速版维持 10 题核心集不变；标准版与进阶版（advanced）检测量由 24 题升级为 38 题。

### 文档
- 应用内与文档中「标准版 24 题」全部同步为「38 题」（模式选择页、首页、layout 元信息、进阶联合判读文案、SPEC/PRD/ROADMAP/README）。
- 版本单一来源同步至 `1.5.0`（`VERSION`、`package.json`、各改动文件头注释）。

## [1.4.0] - 2026-09-05

### 新增
- 趣味性体验包（SPEC §3.5，原型已验证，应用侧落地）：
  - 进度点阵仪式感（`components/test/FunBits.tsx` `ProgressDots`）：24 圆点三态（已完成/当前/未到），每完成 8 题触发脉冲 + 「已完成 N / 24 版」轻提示；硬约束：不表达对错。
  - 章末轻科普过渡（`ChapterCard`）：题型分 3 章（暖身/主体/深水），章节交替处插入过渡卡，回车或按钮继续。
  - 中性提交反馈：提交后恒显「✓ 已记录」420ms 缓冲（不随开关关闭）。
  - 色觉人格分享卡（`lib/sharecard.ts` + 结果页「分享卡 PNG」按钮）：Canvas 手绘雷达 + 称号 + 三轴条，本地 `toDataURL` 导出 PNG，零依赖。
  - 换一双眼睛（`components/result/EyesSwitcher.tsx`）：第 4 版转换图（标准答案 29）五种色觉视角切换，复用 `IshiharaPlate` 的 `cvd` 参数。
  - 三轴互动科普（`components/result/DimScenes.tsx`）：点维度条展开日常生活影响，含 `aria-expanded` 键盘可达。
  - 旅人隐喻称号（`lib/fun.ts` `TITLES`）：去污名化，仅本机展示。
  - `趣味`总开关（`AppSettings.funMode`，默认开）：导航栏 `ThemeToggle` 处切换，关闭后称号/章末过渡/里程碑仪式感回退中性，中性反馈恒开。
- 抽离 `lib/fun.ts` 集中趣味数据（章节/称号/三轴科普），`AppSettings` 新增 `funMode` 字段（`lib/types.ts`、`lib/storage.ts` 默认值 `true`）。

### 文档
- SPEC §3.5 / ROADMAP 趣味性体验包标注为 v1.4 已实现；README/页脚/版本单一来源同步至 `1.4.0`。

## [1.3.0] - 2026-09-05

### 新增
- 进阶联合检测（advanced 模式）：新增 `/test/advanced` 路由与 `AdvancedRunner` 组件，依次完成石原氏 24 题、路径追踪 3 题与色相排列 D15 三模块，联合判读交叉验证：
  - 三模块一致正常 → 置信度上调并注明交叉验证；
  - 石原氏异常且进阶模块方向一致 → 置信度上调；
  - 石原氏正常 / 样本不足但进阶模块异常 → 倾向疑似色弱（轻度，置信度下调）；
  - 结果分歧时在分析中注明建议复查。
- 新增 `lib/advanced-scoring.ts` 联合判读模块；`TestMode` 扩展 `'advanced'`；`uiText.mode` 补充「进阶版」。
- 从 `TestRunner` 抽取可复用 `IshiharaFlow` 答题流程组件（标准模式对外行为与持久化语义不变）；模式选择页启用「进阶版」入口；历史记录标签新增「进阶联合」。

### 文档
- SPEC / DATA-SPEC / PRD / PRIVACY / API / ARCHITECTURE / ROADMAP 实现状态声明同步（advanced 标注为 v1.3 已实现，推迟项仅剩匿名分析）。
- 版本单一来源同步至 `1.3.0`（`VERSION`、`package.json`、本文件）。

## [1.2.4] - 2026-09-05

### 文档
- 清理 `docs/ARCHITECTURE.md` 规划残留（与真实依赖/状态管理对齐，经 `package.json` 与代码核验）：§2.1 技术选型表删除虚构的 `shadcn/ui`、`Recharts`、`@dnd-kit`，新增「内联 SVG（零依赖自绘图表）」行；§2.3 状态管理将检测流程由虚构的 `TestContext` 改为组件本地状态（useState/useReducer），并删除 `TestContext` 数据结构接口代码块；§2.5 去除虚构的 `jsPDF`/`html2canvas`/`@dnd-kit` 动态导入。
- 版本单一来源同步至 `1.2.4`（`VERSION`、`package.json`、本文件）。

## [1.2.3] - 2026-09-05

### 文档
- 重写 `docs/ARCHITECTURE.md` §2.2 目录结构树，消除蓝图残留：移除虚构的 `components/ui/`（shadcn）、`common/Seo.tsx`、顶层 `types/` 目录，以及 `lib/questions`、`lib/scoring`、`lib/storage`、`lib/export` 子目录划分；改为与 `README.md` 一致的真实扁平结构（`lib/` 主模块 + `lib/questions/` 子题库、五域 `components/`）。同步补全 `app/` 真实条目（`not-found.tsx`、`icon.svg`、`result/[id]`、`privacy` 等）与组件真实清单。
- 版本单一来源同步至 `1.2.3`（`VERSION`、`package.json`、本文件）。

## [1.2.2] - 2026-09-05

### 文档
- 同步文档至 v1.2 实际实现（色相排列 D15 检测）：`docs/ARCHITECTURE.md` 结构树与路由表将 `hue-arrangement` 由「v1.1 规划，未实现」更正为「v1.2 已实现」，并补齐 `ishihara`/`hue-arrangement` 的 `[mode]` 动态路由段；`docs/SPEC.md` §5.3 与 `docs/PRD.md` 的 `TestResult` 注释将 `pathTracking`/`hueArrangement` 标注为已实现（v1.1 / v1.2）；`docs/API.md` 实现状态同步。
- 项目地址 `https://github.com/sutchan/ChromaCheck` 已在 README 与页脚正确引用。
- 版本单一来源同步至 `1.2.2`（`VERSION`、`package.json`、本文件）。

## [1.2.1] - 2026-09-05

### 文档
- 完善根目录 `.gitignore`：补齐 Next.js 标准忽略集（依赖、构建产物 `.next`/`.out`、类型检查缓存 `*.tsbuildinfo`/`next-env.d.ts`、调试日志、环境变量与密钥、测试覆盖率、托管平台 `.vercel`/`.turbo`/`.netlify`、编辑器/系统文件），并保留 `prototype/`、`docs/`、`.codebuddy/` 等应跟踪目录。
- 版本单一来源同步至 `1.2.1`（`VERSION`、`package.json`、本文件）。

## [1.2.0] - 2026-09-05

### 新增
- 色相排列检测模块（简化版 Farnsworth-Munsell D15）：新增 `/test/hue-arrangement/[mode]` 路由、`HueArrangementRunner` 与 `HueArrangementGrid` 组件（点击选中 + 点击交换，两端参考卡固定，初始排列确定性生成避免 SSR 闪烁）；移植原型 `CC.hueCards` 为 `lib/questions/hue-arrangement.ts`（D15 sRGB 色卡 + 种子打乱）；新增 `lib/hue-scoring.ts`（TES 相邻位置误差评分、偏差方向启发式、综合结果汇总）。
- `TestResult` 扩展可选 `hueArrangement` 字段；结果页新增色相排列摘要（TES、偏差方向、最终排列色条），结果总览统计位与历史标签按测试类型守卫渲染。
- PNG 导出报告为色相排列绘制最终排列色卡条；复制文本包含 TES 结果。
- 应用页脚新增 GitHub 仓库链接（`https://github.com/sutchan/ChromaCheck`）。

### 修复
- 应用页脚版本号由陈旧的 v1.0.0 同步为当前版本。

### 文档
- README 实现状态、功能清单、项目结构树与联系方式同步 v1.2.0；SPEC / DATA-SPEC / ARCHITECTURE / PRD / ROADMAP 实现状态声明同步（色相排列标注为 v1.2 已实现）。
- 版本单一来源同步至 `1.2.0`（`VERSION`、`package.json`、本文件）。

## [1.1.1] - 2026-09-04

### 文档
- 完善 `.github/` Community Health Files：新增 `CODE_OF_CONDUCT.md`、`SECURITY.md`、`SUPPORT.md`、`ISSUE_TEMPLATE/{bug_report,feature_request,config}.yml`、`PULL_REQUEST_TEMPLATE.md`，与既有 `CONTRIBUTING.md`、`workflows/ci.yml` 组成标准社区健康文件集合。
- `CONTRIBUTING.md` 行为准则段链接至 `CODE_OF_CONDUCT.md`。
- 版本单一来源同步至 `1.1.1`（`VERSION`、`package.json`、本文件）。

## [1.1.0] - 2026-09-04

### 新增
- 路径追踪检测模块（v1.1 首个功能）：新增 `/test/path-tracking/[mode]` 路由、`PathTrackingRunner` 与 `PathTrackingCanvas` 组件；移植原型 `renderPathField`/`standardPath` 为 `lib/ishihara.ts` 纯函数 `buildPathField`；新增 `lib/questions/path-tracking.ts` 题库（S 形/螺旋/之字形 3 题）与 `lib/path-scoring.ts`（重合度 IoU 评分 + 综合结果汇总）。
- `TestResult` 扩展可选 `pathTracking` 字段，`ishihara` 改为可选；结果页、摘要、导出报告与历史均按测试类型守卫渲染。
- 测试选择页新增「路径追踪」入口。

## [1.0.4] - 2026-09-04

### 文档
- 修复 `docs/SPEC.md` 内部版本引用脱节：§0 顶部注释「目标版本 v1.0.2」改为「当前版本 v1.0.4」；§8.2 版本单一来源处的「当前 `1.0.2`」「SPEC `v1.0.2`」同步为 `1.0.4`；底部版本声明 `v1.0.3`→`v1.0.4`。
- `docs/API.md`：概述补充「v1.0 为纯前端、无服务端 API，本节为 v1.1+ 规划」标注（与 PRIVACY 口径一致）；`AnalyticsEventRequest.testType` 移除未实现的 `advanced`（对齐 SPEC §5.5）。
- `docs/DATA-SPEC.md` §5 `TestResult` 对齐 SPEC §5.3 与 `lib/types.ts`：`testMode` 去 `advanced`，字段改为实际结构（`schema`/`version`/`createdAt`/`ishihara`/`analysis`/`confidenceNote`/`device`），路径追踪 / 色相排列标注为 v1.1 扩展；移除与代码不符的 `startTime`/`endTime`/`totalQuestions`/`ishiharaAssessment`/`overallAssessment` 旧字段。
- `docs/ARCHITECTURE.md` §1.1：API 路由条目标注「v1.1 规划，v1.0 为纯前端、无服务端 API 路由」。
- 版本单一来源同步至 `1.0.4`（`VERSION`、`package.json`、本文件）。

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

[1.0.4]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.4
[1.0.3]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.3
[1.0.2]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.2
[1.0.1]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.1
[1.0.0]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.0
