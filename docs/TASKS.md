# 任务文档：驾驶员场景色觉检测改进

> 来源：2026-09-06 对 ChromaCheck v1.6.0 检测覆盖度评估。
> 关联：`docs/ROADMAP.md`（v1.1 规划中已有 P1「屏幕校准指引」，本任务集为其专项延展）。

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

### P0 — 核心缺口

**T1 结果页「驾照辨色力参考」栏**
- 目标：把检测结果映射到驾照辨色力要求，给出明确结论 + 免责声明。
- 方案：基于 `TestResult.overall / type`，在结果页新增栏目，输出：
  - 对照 172 号令第十二条「无红绿色盲」；
  - 本次结果（正常 / 疑似色弱 / 疑似色盲）是否触及该条款；
  - 明确免责：「筛查结果仅作参考，最终以指定体检机构结论为准」。
- 涉及（预估）：`components/result/`（新增 `DriverCompliance.tsx` 或在 `ResultSummary.tsx` 追加）、`lib/scoring.ts` 可加 `mapToLicense()` 辅助。
- 验收：正常 / 疑似色弱 / 疑似色盲三类结果下，均显示正确的参考文案与免责；无障碍可聚焦（语义化 id）。

### P1 — 体验与效度

**T2 新增「信号灯辨识」驾驶场景专项检测**
- 目标：数字等效 lantern / 信号灯测试，直接验证红 / 绿 / 黄交通信号辨识能力。
- 方案：红、绿、黄三组光点辨识任务 + 情境图（夜间尾灯、路口信号灯）；计入 `TestResult`（新增 `signalTest?` 字段，或并入 advanced）。
- 涉及（预估）：`lib/questions/` 新增题库、`components/test/` 新增 runner、对应 scoring。
- 验收：任务可完成、判读正确区分「能 / 不能辨识三色信号」。

**T3 红绿「色弱 vs 色盲」语义澄清**
- 目标：结果文案区分 dichromacy（色盲）与 anomalous（色弱），并对照法规仅禁色盲。
- 方案：`lib/scoring.ts` 的 `TYPE_TEXT`/分析文案补充；UI 提示「色弱与色盲不同，是否影响驾照以体检为准」。
- 涉及：`lib/scoring.ts`、`components/result/*`。
- 验收：输出文案不再把「疑似色弱」等同于「不合格」。

**T4 屏幕校准 / 环境光提示**（ROADMAP v1.1 P1 已规划，此处追踪）
- 目标：检测前引导用户校准显示器、控制环境光，降低假阳/假阴。
- 方案：检测前指引页增加校准步骤 + 免责提示。
- 涉及：`app/guide/`、`components/`。
- 验收：指引页含校准提示，且说明未校准屏幕的结论仅供参考。

### P2 — 算法与边界

**T5 石原氏图版明度控制效度提升**
- 目标：当前 `lib/ishihara.ts` 的 `PALETTE` 仅为红/绿配色数字图，未做明度控制，异常视觉可能仅凭亮度误读。
- 方案：重新设计 fig/bg 颜色，使异常视觉难以仅凭亮度区分数字（贴近真版石原氏图编码）。
- 涉及：`lib/ishihara.ts` `PALETTE`。
- 验收：对 deuteranopia/protanopia 模拟下，目标数字与背景亮度差显著小于色相差，避免亮度线索泄露。

**T6 严肃场景隐藏趣味模块**
- 目标：「驾驶 / 职业」入口下默认关闭 `funMode`，报告去除称号 / 换眼睛等趣味元素。
- 方案：新增场景入口参数；`ReportActions` / `ResultSummary` 按场景条件渲染。
- 涉及：`lib/types.ts` `AppSettings`、`components/result/*`、`components/test/FunBits.tsx`。
- 验收：驾驶场景下报告不含趣味称号，仅保留科学判读。

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
