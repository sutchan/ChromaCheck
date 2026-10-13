# 已完成任务归档

> 来源：`docs/TASKS.md`。已完成的条目从任务清单移入本文档，保留目标与实现摘要以便回溯。
> **最后更新：2026-10-13**（当前版本 v1.7.9）。

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
- 边界：科普文章、历史 / 结果页部分区块与 FAQ 仍为中文，属后续迭代范围（已在 `docs/TASKS.md` 标注）。

### C3 服务端匿名事件上报（P1）

- 目标：补齐规划中的服务端匿名事件上报。
- 实现：`app/api/analytics/event` 路由（事件名白名单、请求体 1KB 上限，仅保留事件名 / 测试类型 / 时长 / 结果摘要；不落库、不记录 IP 与 UA）；`lib/analytics.ts` 新增 `reportServerEvent()`。
- 隐私边界：仍不上传答题记录、判读结果与任何身份信息；口径同步至 `docs/PRIVACY.md`。

---

## 三、仍阻塞（未归档，保留在 `docs/TASKS.md`）

- **C1 用户账号系统、C2 历史记录云同步、C5 批量检测管理后台、C8 家庭共享**：均需服务端与数据库，与项目「纯前端 / 本地优先 / 不收集 PII」定位冲突；待明确是否转向云账号模式后启动。
