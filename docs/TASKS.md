# 任务文档：驾驶员场景色觉检测改进

> 来源：2026-09-06 对 ChromaCheck v1.6.0 检测覆盖度评估。
> 关联：`docs/ROADMAP.md`（v1.1 规划中已有 P1「屏幕校准指引」，本任务集为其专项延展）。
> **最后更新：2026-10-15**（当前版本 **v1.9.0**）：T1–T6、C3–C8 全部完成并归档；C1/C2/C5/C8 于 v1.8.0 以「本地优先替代」落地；v1.8.1 为对抗式审查整改；**C9（i18n 覆盖补齐）于 v1.9.0 完成**并归档至 `docs/tasks-done.md` §四。**遗留问题见 §6**（2026-10-15 全面审查待决策项 R1–R8）。

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

## 2. 待改进任务清单（按优先级）

> **状态：T1–T6 已于 v1.7.0 完成并归档至 `docs/tasks-done.md`（§一），此处仅保留目标索引。**

- **T1 ✅** 结果页「驾照辨色力参考」栏（P0）
- **T2 ✅** 新增「信号灯辨识」驾驶场景专项检测（P1）
- **T3 ✅** 红绿「色弱 vs 色盲」语义澄清（P1）
- **T4 ✅** 屏幕校准 / 环境光提示（P1）
- **T5 ✅** 石原氏图版明度控制效度提升（P2）
- **T6 ✅** 严肃场景隐藏趣味模块（P2）

## 3. 验收总览

- [x] T1 结果页驾照参考栏上线（P0）— `components/result/DriverCompliance.tsx` + `lib/license.ts`
- [x] T2 信号灯辨识任务可运行（P1）— `app/test/signal` + `lib/questions/signal.ts` + `lib/signal-scoring.ts`
- [x] T3 色弱/色盲语义澄清（P1）— `lib/scoring.ts` 判读文案 + `DriverCompliance` 说明
- [x] T4 屏幕校准提示（P1，ROADMAP 既有）— `app/guide/page.tsx` 校准区块
- [x] T5 图版明度控制（P2）— `lib/ishihara.ts` 等亮度异色相 PALETTE
- [x] T6 严肃场景隐藏趣味（P2）— `TestResult.scene` + `?scene=driver` + 结果页按场景隐藏

> 已在 ChromaCheck **v1.7.0** 实现（2026-09-06）。

## 4. 关联文档

- `docs/ROADMAP.md` — 总体路线图（v1.1 含屏幕校准指引 P1）
- `docs/PRD.md` — 产品定位与「贴合国内职业体检标准」目标
- `docs/SPEC.md` — 检测范式权威定义
- `lib/scoring.ts` / `lib/ishihara.ts` / `lib/hue-scoring.ts` — 判读与图版实现

## 5. 收敛待办（2026-09-30 自 SPEC §9 / ROADMAP / ARCHITECTURE §10 迁入）

> 以下为各分册中残留的未完成行动项，统一收敛至此；原分册「待办 / 扩展规划」章节已改为指向本文档。原有 T1–T6 已于 v1.7.0 完成（见 §3）。

### 状态总览（2026-10-15 复核，当前版本 v1.8.2）

> 全部任务已完成（T1–T6、C3–C8），实现摘要归档于 `docs/tasks-done.md`。C1 / C2 / C5 / C8 以「本地优先替代」方式在纯前端落地（不引入服务端、不收集 PII），符合项目隐私定位。

| 任务 | 原优先级 | 新优先级 | 状态 | 说明 |
|------|----------|----------|------|------|
| C1 用户账号系统 | P0 | P2 | ✅ 已完成（v1.8.0，本地优先替代） | 本地多档案（昵称 / 头像 / 关系），非云端账号 |
| C2 历史记录云同步 | P0 | P2 | ✅ 已完成（v1.8.0，本地优先替代） | 历史导出 / 导入（JSON，含冲突合并） |
| C5 批量检测管理后台 | P1 | P2 | ✅ 已完成（v1.8.0，本地优先替代） | 客户端批量模式 + 汇总 CSV 导出 |
| C8 家庭共享 | P2 | P2 | ✅ 已完成（v1.8.0，本地优先替代） | 本地多档案 + 报告导出 / 导入 |

> **完成结论（v1.8.0，2026-10-15 复核确认）**：C1 / C2 / C5 / C8 经产品决策采用「本地优先替代」方案，在纯前端落地，不引入服务端、不收集 PII，符合项目隐私定位。具体实现见 `docs/tasks-done.md` §三；原「服务端账号 + 数据库」形态留作未来云账号模式待办。后续 v1.8.1（2026-10-14）为对抗式审查整改（判读修正 / 隐私披露 / 文案去虚假确定感），详见 `CHANGELOG.md`，不涉及本清单任务状态变化。

### P2 — 用户体系（原 P0；✅ 本地优先替代，v1.8.0）

**C1 ✅ 已完成（v1.8.0，本地优先替代）本地多档案**
- 目标：以本地档案替代云端账号，支持多成员 / 家庭共用同一设备。
- 方案：`lib/profile.ts` 档案模型（昵称 / 头像 / 关系标签）+ `components/history/ProfileSwitcher.tsx`；`TestResult.profileId` 由 `saveResult` 自动归属当前档案；历史页按档案筛选。
- 边界：非跨设备身份，不替代云端账号；详见 `docs/tasks-done.md` §三。
- 来源：ROADMAP.md §4.2、ARCHITECTURE.md §10.2。

**C2 ✅ 已完成（v1.8.0，本地优先替代）历史导出 / 导入**
- 目标：跨设备备份与迁移历史记录（本地优先等效「云同步」）。
- 方案：`lib/export-import.ts` 导出 JSON 包（档案 + 结果），导入按 id 合并（档案冲突保留本地、结果冲突保留较新）。
- 来源：ROADMAP.md §4.2、ARCHITECTURE.md §10.2。

### P0 / P1 — 服务端增强与场景（C3/C4 已完成已归档；C5 ✅ 本地优先替代）

**C5 ✅ 已完成（v1.8.0，本地优先替代）批量检测**
- 目标：面向学校 / 企业的批量筛查与汇总报告。
- 方案：新增 `/test/batch` 录入多名被测者、逐人标准检测、汇总 CSV 导出（按档案分组，含 BOM 兼容 Excel）；检测选择页新增入口。
- 来源：ROADMAP.md §4.2、ARCHITECTURE.md §10.2。

### P2 — 国际化与可安装（C6/C7 已完成已归档；C8 ✅ 本地优先替代）

**C8 ✅ 已完成（v1.8.0，本地优先替代）家庭共享**
- 目标：家庭成员结果共享与查看。
- 方案：基于本地多档案（C1 替代）+ 历史导出 / 导入（C2 替代）；单成员结果可导出 / 导入。
- 来源：ROADMAP.md §4.2。

### 待办（2026-10-15 补录，源自 `docs/tasks-done.md` §二 C6 边界）

> C1–C8 均已完成；本项为 tasks-done 记录「科普文章 / 历史页 / 结果页 / FAQ 仍为中文」但**未登记到本清单**的遗留范围，现补录跟踪。

**C9 ✅ 已完成（v1.9.0）i18n 覆盖补齐**
- 目标：双语覆盖扩展到历史页、结果页、科普列表 / 正文、FAQ、隐私、指引、离线页，消除核心页面中文硬编码。
- 实现：i18n 由单文件 `lib/i18n.ts` 重构为 `lib/i18n/` 模块（`dict.ts` / `zh-core|zh-ui|zh-result` / `en-core|en-ui|en-result` / `t.ts` / `lang.ts`）；`uiText` 与各 scoring 模块接入 `lang` 参数；40 个客户端组件接入 `useLang()`；中英词条对称（ui 77 / result 18 / learn 10 组）。
- 边界：判读逻辑不随语言变化，仅文案本地化；语言偏好存 `cc.lang.v1`。
- 备注：`VERSION` / `package.json` 已同步至 1.9.0（此前代码文件头先于版本文件的漂移已收口）；本轮另补 `lib/profile.test.ts` / `lib/export-import.test.ts` 共 21 例，测试总数 52 → 73。
- 来源：`docs/tasks-done.md` §二 C6 边界说明、`docs/ROADMAP.md` §3.2。

## 6. 审查发现待办（2026-10-15 全面审查遗留项）

> 来源：2026-10-15 代码库全面审查（10 项问题）。已处理项见 `CHANGELOG.md`；以下为**仍需决策或排期**的部分。⏳ 表示改动前需先确认方案（涉及隐私承诺、安全策略、破坏性变更或跨模块重构）。

| 编号 | 问题 | 优先级 | 状态 |
|------|------|--------|------|
| R1 | 服务端分析是死代码：`reportServerEvent` 全仓库 0 调用、`/api/analytics/event` 空转，但隐私页已披露该行为 → 实现与文案矛盾 | P0 | ⏳ 待决策（补埋点，或移除端点并同步改隐私文案） |
| R2 | 安全：CSP `frame-ancestors *` 允许任意站点 iframe 嵌入（点击劫持）；生产 `script-src 'unsafe-inline'` | P0 | ⏳ 待决策 |
| R3 | 单文件 >200 行违规：`app/history/page.tsx` 211、`lib/types.ts` 201（`lib/i18n.ts` 307 已由 v1.9.0 模块化拆分解决） | P1 | ⏳ 待拆分（受「≤200 行」规则约束） |
| R4 | 无障碍：`PathTrackingCanvas` 仅支持指针（键盘不可达，WCAG 2.1.1）；Numpad / SignalRunner / DimScenes / AnswerReview / ChildPlate / IshiharaPlate 缺 aria 语义 | P1 | ⏳ 待处理 |
| R5 | 测试覆盖率缺口：child-scoring / sharecard / report-canvas / scoring-text / ishihara / path-field / format 无单测；无组件测试与 e2e（≥80% 门禁未达成） | P2 | 🟡 部分完成（v1.9.0 补 profile + export-import 共 21 例，总数 73） |
| R6 | 无 lockfile（`package-lock.json` 缺失）→ 构建不可复现；依赖钉扎策略不统一（vitest/coverage 用 `^`） | P2 | ⏳ 待决策 |
| R7 | SEO metadata 缺 9 个路由段（首页、`test/advanced`、`test/batch`、`test/*/[mode]`、`learn/[slug]`、not-found） | P2 | ⏳ 待处理 |
| R8 | 轻微反模式：mounted 进度恢复逻辑重复（AdvancedRunner / TestRunner）、history 页内联 style 与 Tailwind 混用、result props 透传 6+ 层 | P2 | ⏳ 后续迭代 |

> **已在本轮闭环**：i18n 覆盖仅约 20%（审查第 4 项）→ 由 C9 / v1.9.0 重构解决；`metadata.json` 失实声明（声称服务端 Gemini 能力）→ 审查后已修正。
