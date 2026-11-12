# 已完成任务归档

> 来源：`./TASKS.md`。已完成的条目从任务清单移入本文档，保留目标与实现摘要以便回溯。
> **最后更新：2026-11-09**（当前版本 **v1.17.0**）：归档范围覆盖（v1.15.0 起见 §七）
 T1–T6、C1–C9、R1/R2、审查遗留项 R3–R7（v1.11.1–v1.12.0）及 R8 全量收口（v1.12.0 共享 hook + v1.13.4 R8a/R8b，见 §六）。未完成任务见 `./TASKS.md`（已清零）。

---

## 一、驾驶员场景色觉检测改进（T1–T6）

> 来源：2026-09-06 对 ChromaCheck v1.6.0 检测覆盖度评估；**已于 v1.7.0 完成（2026-09-06）**。

| 编号 | 任务 | 实现 | 验收 |
|------|------|------|------|
| T1 | 结果页「驾照辨色力参考」栏（P0） | `components/result/DriverCompliance.tsx` + `lib/license.ts` | 三类结果均显示正确参考文案与免责，可聚焦 |
| T2 | 信号灯辨识专项检测（P1） | `app/test/signal` + `lib/questions/signal.ts` + `lib/signal-scoring.ts` | 任务可完成，判读能区分「能 / 不能辨识三色信号」 |
| T3 | 色弱 vs 色盲语义澄清（P1） | `lib/scoring.ts` 判读文案 + `DriverCompliance` 说明 | 文案不再把「疑似色弱」等同于「不合格」 |
| T4 | 屏幕校准 / 环境光提示（P1） | `app/guide/page.tsx` 校准区块 | 指引页含校准提示与未校准免责 |
| T5 | 石原氏图版明度控制（P2） | `lib/ishihara.ts` 等亮度异色相 `PALETTE` | 模拟色觉下亮度差显著小于色相差 |
| T6 | 严肃场景隐藏趣味模块（P2） | `TestResult.scene` + `?scene=driver` + 结果页按场景隐藏 | 驾驶场景报告不含趣味称号 |

---

## 二、收敛待办（C3 / C4 / C6 / C7）

> **于 v1.7.9 完成（2026-10-13）**。

### C7 PWA 支持（原 P2 → 提升为 P0）

- 目标：离线可用、可安装到桌面。
- 实现：
  - `app/manifest.ts`：Web App Manifest（standalone、主题色、192/512/maskable 图标）。
  - `public/sw.js`：Service Worker，预缓存 `/`、`/guide`、`/test`、`/offline`；导航请求离线回退 `/offline`；静态资源 stale-while-revalidate。
  - `components/pwa/ServiceWorkerRegistrar.tsx`：仅生产环境注册，注册失败静默降级。
  - `public/icons/icon-192.png`、`icon-512.png`、`icon-maskable-512.png`：零依赖 PNG 编码脚本生成（品牌色底 + 三色叠加圆）。
  - `app/offline/page.tsx`：离线兜底页；根布局补 `appleWebApp` 配置。
- 验收：安装后可从桌面启动；断网时导航到已缓存页面或离线页。

### C4 儿童模式（原 P1 → 提升为 P0）

- 目标：图形识别替代数字题，适合 5–10 岁。
- 实现：
  - `lib/questions/child.ts`：10 题图形题库（含 2 道演示题），选项含「看不清 / 没有图形」，中英标签。
  - `lib/child-scoring.ts`：保守判读（错 0 正常 / 错 1–2 提示复查 / 错 ≥3 提示疑似），文案适配低龄。
  - `components/test/ChildPlate.tsx`：图形掩码点阵图（复用 `buildDots` + `PALETTE`）；`ChildShapeIcon.tsx` 图形图标。
  - `components/test/ChildRunner.tsx` / `ChildFlow.tsx`：答题流程（不显示对错）、判读、本地保存、跳转结果页。
  - `app/test/child/page.tsx` + 模式选择入口；`TestMode` 增加 `'child'`、`MODE_TEXT` 补「儿童版」、`TestResult.child` 与结果页 `ChildSummary`。
- 验收：儿童可仅凭图形完成 10 题；结果页显示答对题数与保守结论。

### C6 英文版 / i18n（原 P2 → 提升为 P1，本轮完成框架与核心页面）

- 目标：国际化第一步，界面文案双语化。
- 实现：`lib/i18n.ts` 中英字典（零第三方依赖）；`components/layout/LangProvider.tsx`（偏好存 `cc.lang.v1`，首屏中文避免 SSR 不一致）+ `LangToggle.tsx`；首页 `HomeContent`、模式选择 `TestSelectContent`、导航、儿童模式已双语。
- 边界：科普文章、历史 / 结果页部分区块与 FAQ 仍为中文，属后续迭代范围（已在 `./TASKS.md` 标注）。

### C3 服务端匿名事件上报（P1）

- 目标：补齐规划中的服务端匿名事件上报。
- 实现：`app/api/analytics/event` 路由（事件名白名单、请求体 1KB 上限，仅保留事件名 / 测试类型 / 时长 / 结果摘要；不落库、不记录 IP 与 UA）；`lib/analytics.ts` 新增 `reportServerEvent()`。
- 隐私边界：仍不上传答题记录、判读结果与任何身份信息；口径同步至 `./PRIVACY.md`。

> **现状注记**：上述第一方上报实现已于 v1.9.0 由 §五 R1 全量移除，当前仓库不存在任何服务端上报通道，仅保留 GA4 匿名访问统计（见 ./PRIVACY.md）。本节保留为历史归档记录。

---

## 三、本地优先替代（C1 / C2 / C5 / C8，v1.8.0）

> 经 2026-10-14 产品决策：C1 / C2 / C5 / C8 采用「本地优先替代」方案，在纯前端落地，不引入服务端、不收集 PII，符合项目隐私定位。原「服务端账号 + 数据库」形态留作未来云账号模式的待办。

### C1 本地多档案（原 P0 → P2，本地优先替代）
- 目标：以本地档案替代云端账号，支持多成员 / 家庭共用同一设备。
- 实现：
  - `lib/profile.ts`：档案模型（昵称 / 头像 emoji / 关系标签），`localStorage` 存储（`cc.profiles.v1`）+ 当前档案（`cc.activeProfile.v1`）+ CRUD 与默认档案「本人」。
  - `components/history/ProfileSwitcher.tsx`：档案切换下拉 + 管理面板（新增 / 重命名 / 删除 / 设为当前）。
  - `lib/types.ts` 新增 `Profile`，`TestResult.profileId?`；`lib/storage.ts` 的 `saveResult` 自动把结果归属当前档案。
  - 历史页按档案筛选（含「全部档案」视图）。
- 验收：可建立多个档案、切换当前档案、结果自动归属；默认「本人」档案容纳旧记录。

### C2 历史导出 / 导入（原 P0 → P2，本地优先替代）
- 目标：跨设备备份与迁移（本地优先等效「云同步」）。
- 实现：`lib/export-import.ts` 导出 JSON 包（档案 + 结果），导入按 id 合并（档案冲突保留本地、结果冲突保留较新 createdAt）。
- 验收：导出文件可下载；导入可合并到另一设备 / 浏览器，重复导入不丢数据。

### C5 批量检测（原 P1 → P2，本地优先替代）
- 目标：面向学校 / 企业的批量筛查与汇总。
- 实现：`app/test/batch/page.tsx` 录入多名被测者（每行一姓名）→ 自动建档案 → 逐人标准检测 → 完成态追踪 → 汇总 CSV 导出（按档案分组，含 BOM 兼容 Excel）；检测选择页新增入口。
- 验收：批量名单生成档案；逐人测试后汇总表可导出，含姓名 / 关系 / 结论 / 类型 / 置信度 / 模式 / 时间。

### C8 家庭共享（原 P2，本地优先替代）
- 目标：家庭成员结果共享与查看。
- 实现：依托 C1 本地多档案 + C2 历史导出 / 导入；单成员结果可导出 / 导入。
- 验收：家庭成员各自档案独立，结果互不混淆；可通过导出 / 导入在家庭设备间共享。

---

## 四、i18n 覆盖补齐（C9，v1.9.0）

> 2026-10-15：C6 边界记录但**未登记到 `./TASKS.md`** 的遗留范围（科普 / 历史 / 结果 / FAQ 仍为中文），由 v1.9.0 i18n 重构完成，现归档。

### C9 i18n 覆盖补齐（P2，2026-10-15 补录 → v1.9.0 完成）
- 目标：双语覆盖扩展到历史页、结果页、科普列表 / 正文、FAQ、隐私、指引、离线页。
- 实现：`lib/i18n.ts` → `lib/i18n/` 模块（`dict.ts` / `zh-core|zh-ui|zh-result` / `en-core|en-ui|en-result` / `t.ts` / `lang.ts`）；`uiText` 与各 scoring 模块接入 `lang` 参数；40 个客户端组件接入 `useLang()`；中英词条对称（ui 77 / result 18 / learn 10 组）。
- 验收：切换中英文后历史 / 结果 / 科普 / FAQ / 隐私 / 指引页文案同步切换；判读逻辑不随语言变化，语言偏好存 `cc.lang.v1`。

---

## 五、安全与审查遗留收口（R1 / R2，v1.9.0）

> 2026-10-15（实际随 v1.9.0 安全提交 `5030859` 落地）：代码库全面审查遗留项 R1 / R2 由并行会话在该安全提交中收口，现登记归档。

### R1 移除死代码事件上报（P0）
- 问题：`reportServerEvent()` 全仓库 0 调用、`app/api/analytics/event` 路由空转，但隐私页已披露该上报行为 → 实现与文案矛盾。
- 处理：移除 `reportServerEvent`、`/api/analytics/event` 路由与 `lib/analytics.ts` 相关逻辑；隐私文档同步去除「第一方匿名事件上报」口径，仅保留 GA4（生产环境）。
- 验收：仓库无服务端事件上报代码；隐私页口径与实现一致。

### R2 加固安全响应头（P0）
- 问题：CSP `frame-ancestors *` 允许任意站点 iframe 嵌入（点击劫持风险）。
- 处理：`next.config.mjs` 将 `frame-ancestors` 收紧为 `'self'`；`script-src` 仍含 `'unsafe-inline'`（Next.js 内联脚本运行所需，属已知约束）。
- 验收：`frame-ancestors 'self'`，消除跨站嵌入风险。

---

## 六、代码审查遗留项收口（R3–R7，v1.11.1–v1.12.0）

> 2026-10-15 全面审查遗留项 R3–R7 的收口实现，现登记归档（R8 部分完成，见末段）。

### R3 超 200 行拆分（v1.11.1–v1.11.2）
- `components/test/PathTrackingCanvas.tsx`（247）抽离 `pathCanvas.types.ts` / `pathCanvas.render.ts` / `pathCanvas.coords.ts` / `pathCanvas.keymap.ts`（键盘通道），降至 146 行。
- `components/layout/SettingsDialog.tsx`（236）抽离 `SettingsSwitchRow.tsx` 与 `settingsControls.ts`。
- i18n 字典 `zh-ui.ts`(271)/`en-ui.ts`(273) 按语义块拆为 `*.flow`/`*.result`/`*.guide` 子模块；并修复 vitest 误将 `zh-ui.test.ts` 当测试文件的问题（更名为 `*.flow.ts`）。

### R6 构建可复现（v1.11.2）
- 生成 `package-lock.json`（8072 行），`vitest` 与 `@vitest/coverage-v8` 钉死 `2.1.9`；CI 是否切回 `npm ci` 待决策（未改 CI）。

### R7 SEO metadata 补齐（v1.11.2）
- `app/test/batch/page.tsx` 新增 `layout.tsx` 提供标题/描述/canonical/OG（`robots: noindex`）；`app/not-found.tsx` 改为服务端壳，UI 移至 `components/NotFoundClient.tsx` 并补 `noindex`。

### R4 无障碍走查（v1.12.0）
- `IshiharaPlate` 的 `<canvas>` 加 `role="img"` + 类型化 `aria-label`（不剧透答案）；`AnswerReview` 表格 `<th>` 加 `scope="col"`、表加 `aria-label`；`Numpad` 加 `role="group"` + `aria-label`；`ChildPlate`/`SignalRunner` 经核验已具备。

### R5 测试覆盖率收窄（v1.12.0）
- 新增 6 模块单测：`child-scoring` / `format` / `scoring-text` / `path-field` / `ishihara` / `sharecard`(computeRadar)，套件由 73 → 97 例。
- 限制：vitest 为 node 环境，`sharecard`(`drawShareCard`)/`report-canvas`(`drawReport`) 的 Canvas 绘制依赖 DOM 不可单测；80% 覆盖率门禁未硬性达成，列为后续。

### R8 反模式（✅ 全量完成，v1.12.0 + v1.13.4）
- ✅ v1.12.0：将 `TestRunner` 与 `AdvancedRunner` 重复的 mounted 水合守卫 + 进度恢复逻辑提取为共享 hook `components/test/useResumeProgress.ts`。
- ✅ v1.13.4（R8a）：`app/history/page.tsx`（16 处内联 style 清零）与 `app/history/error.tsx` 收敛至 `globals.css` 语义类（`.history-*` / `.btn-sm` / `.hidden-input`），沿 `.faq-*` 页面级样式先例。
- ✅ v1.13.4（R8b）：`TestRunner` 改为复用 `IshiharaFlow`（`key=runKey` 重挂载保留「重新开始」语义，`IshiharaFlow` 新增可选 `id` prop），消除近乎逐行重复的答题流程 JSX；原「result props 透传 6+ 层」经 2026-11-06 复核已过时（现行经 Context 与 2–3 层回调，无深透传），销项。

---

## 七、v1.15.0–v1.16.0（2026-11-07）

### v1.15.0 三语国际化（提交 dad7953）
- 新增繁体（台湾）字典 `lib/i18n/tw-*.ts` 七组（OpenCC s2twp 转换生成并复核）；`Lang` 扩展 `zh | zh-TW | en`，`htmlLang()` 映射 BCP 47，语言偏好恢复兼容三语；SPEC 新增 §8.5 语言优先级规范（默认简体中文 > 繁体中文 > 英语）。

### v1.15.1 判读类型退化输出收敛（提交 dc363d9，审查报告 P0-1 代码部分）
- `lib/scoring.ts`：无转换/分类题命中时 `type` 输出 `null`（未分型），不再恒输出 deutan 系；`lib/license.ts` 未分型盲级映射「无法确认」（`license.untypedBlind*` 三语文案）；`analysis.abnormal` / `faq.a2` / `feat.dims.text` 三语对齐题库实况。

### v1.16.0 GitHub Releases 自动发布（提交 5e4e6da）
- CI workflow 新增 `release` job：push main 全绿后自动创建 `v{VERSION}` tag 与 GitHub Release（幂等，notes 提取 CHANGELOG）；SPEC 新增 §8.6 发布流程规范，DEPLOYMENT 新增 §9 版本发布章节。

---
## 附注：v1.8.1 对抗式审查整改（2026-10-14）

> 非任务清单条目，为 v1.8.1 发布后的审查整改：色相排列判读修正（D-15 不再输出不可达的 protan）、路径追踪重合度算法更名 `pathF1`（实为 F1 非 IoU）并按弧长等距重采样、结果结构 `version` 对齐 1.8.1、隐私政策如实披露当时的第一方上报与 GA4（v1.9.0 后第一方上报已移除） 及未成年人条款、结果文案去除虚假医学确定感。详见 `CHANGELOG.md` §1.8.1。
