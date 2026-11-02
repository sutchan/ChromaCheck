# 任务文档：驾驶员场景色觉检测改进

> 来源：2026-09-06 对 ChromaCheck v1.6.0 检测覆盖度评估。
> 关联：`docs/ROADMAP.md`（v1.1 规划中已有 P1「屏幕校准指引」，本任务集为其专项延展）。
> **最后更新：2026-11-02**（当前版本 **v1.10.2**）。T1–T6、C1–C9、R1/R2 全部完成并归档至 `docs/tasks-done.md`（§一~§五）；本文档仅保留**未完成待办 R3–R8**（见 §6）与已完成项索引。期间版本由 v1.9.1 推进至 v1.10.2（设置面板、记忆重构、冗余清理等，详见 `CHANGELOG.md`）。

## 1. 背景与评估结论

现有四大检测范式对「红绿色盲 / 色弱」的**筛查能力基本够用**，但针对**驾驶员视力检查**这一特定场景不充分。

| 模块 | 覆盖缺陷类型 | 驾驶员相关性 |
|------|--------------|--------------|
| 石原氏 Ishihara（38 题） | 红绿色盲/色弱为主 | 核心（法定初筛同范式） |
| 路径追踪 PathTracking（3 题） | protan/deutan 轨迹辨识 | 中（类夜间辨红绿尾灯） |
| 色相排列 D15 | 整体排列精度 + 偏差方向 | 中（职业/航空用，驾考非必需） |
| 进阶联合 Advanced | 多范式汇总 | 中 |
| 色觉模拟 / 趣味模块 | 仅演示 | 低（严肃场景宜隐藏） |

法规依据：《机动车驾驶证申领和使用规定》（公安部令第 172 号，2024-12 修订）第十二条——**辨色力：无红绿色盲**（C1/C2 与 A/B 类同条，区别在视力而非色觉）。法规只禁「红绿色盲」，未明确「色弱」，体检尺度各地不一。

## 2. 已完成任务索引（T1–T6，全部 ✅ 已归档）

> **T1–T6 已于 v1.7.0 完成，详情见 `docs/tasks-done.md` §一。**

- T1 ✅ 结果页「驾照辨色力参考」栏（P0）
- T2 ✅ 信号灯辨识专项检测（P1）
- T3 ✅ 色弱 vs 色盲语义澄清（P1）
- T4 ✅ 屏幕校准 / 环境光提示（P1）
- T5 ✅ 石原氏图版明度控制（P2）
- T6 ✅ 严肃场景隐藏趣味模块（P2）

## 3. 验收总览（T1–T6，已归档至 `docs/tasks-done.md` §一）

- [x] T1 结果页驾照参考栏上线（P0）
- [x] T2 信号灯辨识任务可运行（P1）
- [x] T3 色弱/色盲语义澄清（P1）
- [x] T4 屏幕校准提示（P1）
- [x] T5 图版明度控制（P2）
- [x] T6 严肃场景隐藏趣味（P2）

> 已于 ChromaCheck **v1.7.0** 实现（2026-09-06），实现与验收详情见 `docs/tasks-done.md` §一。

## 4. 关联文档

- `docs/ROADMAP.md` — 总体路线图（v1.1 含屏幕校准指引 P1）
- `docs/PRD.md` — 产品定位与「贴合国内职业体检标准」目标
- `docs/SPEC.md` — 检测范式权威定义
- `lib/scoring.ts` / `lib/ishihara.ts` / `lib/hue-scoring.ts` — 判读与图版实现

## 5. 已完成任务索引（C1–C9，全部 ✅ 已归档）

> C1–C9 全部完成，详情见 `docs/tasks-done.md`（§二~§四）。原「服务端账号 + 数据库」形态留作未来云账号模式待办。

| 任务 | 状态 | 归档位置 |
|------|------|----------|
| C1 本地多档案（原 P0→P2，本地优先替代） | ✅ v1.8.0 | tasks-done.md §三 |
| C2 历史导出 / 导入（原 P0→P2，本地优先替代） | ✅ v1.8.0 | tasks-done.md §三 |
| C3 服务端匿名事件上报（P1） | ✅ v1.7.9（后于 v1.9.0 移除，见 R1） | tasks-done.md §二 |
| C4 儿童模式（原 P1→P0） | ✅ v1.7.9 | tasks-done.md §二 |
| C5 批量检测（原 P1→P2，本地优先替代） | ✅ v1.8.0 | tasks-done.md §三 |
| C6 英文版 / i18n（原 P2→P1） | ✅ v1.7.9（框架）+ v1.9.0（补齐 C9） | tasks-done.md §二 / §四 |
| C7 PWA 支持（原 P2→P0） | ✅ v1.7.9 | tasks-done.md §二 |
| C8 家庭共享（原 P2，本地优先替代） | ✅ v1.8.0 | tasks-done.md §三 |
| C9 i18n 覆盖补齐（P2） | ✅ v1.9.0 | tasks-done.md §四 |

> **完成结论**：C1 / C2 / C5 / C8 采用「本地优先替代」方案，纯前端落地，不引入服务端、不收集 PII，符合项目隐私定位。v1.8.1 对抗式审查整改、v1.9.0 移除 C3 服务端上报（见 R1），均不改变本清单已完成状态。

## 6. 未完成待办（R3–R8）

> 来源：2026-10-15 代码库全面审查遗留项。**R1 / R2 已于 v1.9.0 完成并归档至 `docs/tasks-done.md` §五**（死代码上报移除 + CSP 收紧），不在本清单。⏳ 表示改动前需先确认方案（涉及隐私承诺、安全策略、破坏性变更或跨模块重构）。下表"状态"为 2026-11-02（v1.10.2）复核。

| 编号 | 问题 | 优先级 | 状态 |
|------|------|--------|------|
| R3 | 单文件 >200 行违规（受「≤200 行」规则约束）：`components/test/PathTrackingCanvas.tsx`(247)、`lib/i18n/en-ui.ts`(273)/`zh-ui.ts`(271)、`components/layout/SettingsDialog.tsx`(236) 待拆分；`lib/types.ts` 与 `app/history/page.tsx` 已于 v1.9.1 拆至 ≤200 | P1 | 🟡 部分完成 |
| R4 | 无障碍：`Numpad` / `SignalRunner` / `DimScenes` / `AnswerReview` / `ChildPlate` / `IshiharaPlate` 缺 aria 语义（`PathTrackingCanvas` 经 v1.9.1 核验已具键盘通道 tabIndex / role / aria-keyshortcuts） | P1 | 🟡 部分（待复核） |
| R5 | 测试覆盖率缺口：child-scoring / sharecard / report-canvas / scoring-text / ishihara / path-field / format 无单测；无组件测试与 e2e（≥80% 门禁未达成） | P2 | 🟡 部分完成（v1.9.0 补 profile + export-import 共 21 例） |
| R6 | 无 lockfile（`package-lock.json` 缺失）→ 构建不可复现；依赖钉扎策略不统一（vitest/coverage 用 `^`） | P2 | ⏳ 待决策（2026-11-02 确认仓库仍无 lockfile） |
| R7 | SEO metadata 缺 9 个路由段（首页、`test/advanced`、`test/batch`、`test/*/[mode]`、`learn/[slug]`、not-found） | P2 | ⏳ 待处理 |
| R8 | 轻微反模式：mounted 进度恢复逻辑重复（AdvancedRunner / TestRunner）、history 页内联 style 与 Tailwind 混用、result props 透传 6+ 层 | P2 | ⏳ 后续迭代 |
