---
name: ChromaCheck 当前状态（2026-11-27 / v1.17.6）
description: 当前版本、门禁基线、功能变更、已知问题、待办入口与关键决策；状态源为代码 / docs/SPEC.md / docs/tasks.md
type: project
lastVerified: 2026-11-27
status: current
---

# ChromaCheck 当前状态（更新于 2026-11-27 / v1.17.6）

## 事实基线 `[现行]`

- **版本**：`VERSION` / `package.json` / `package-lock.json` 三源一致为 `1.17.6`；页脚格式 `V{ver}· build {10位yymmddhhmm}`，版本与 build 只出现在页脚。
- **技术栈**：Next.js 16.4.6 App Router + React 19 + TypeScript strict + Tailwind 3；纯前端、无服务端业务 API、无账号、无 PII 上传。
- **门禁**：实跑 17 文件 / 116 例 Vitest 全绿；覆盖率 lines 89.53% / branches 84.3% / functions 87.64% / statements 89.53%，阈值 80/70/75/80 全绿；`lint`、`type-check`、`check:docs`、`check:openapi` 全绿。
- **CI**：Node 22 LTS，checkout / setup-node v5，`npm ci`（无 cache）；步骤含 lint / type-check / check:openapi / check:docs / test / coverage / build / playwright install / e2e；release job 自动创建 tag 与 Release。
- **测试**：Playwright `@playwright/test@1.65.1`，脚本 `npm run e2e`，用例 `e2e/main-flow.spec.ts`；组件测试未引入 React Testing Library。
- **存储**：7 个扁平 `localStorage` 键：`cc.settings.v1`、`cc.results.v1`、`cc.progress.v1`、`cc.lang.v1`、`cc.profiles.v1`、`cc.activeProfile.v1`、`cc.batch.v1`；无聚合对象。
- **公开接口**：仅 `GET /llms.txt` 与 `GET /llms-full.txt` 两个静态文本 Route Handler；OpenAPI 3.1 仅描述这两个路径，`npm run check:openapi` 校验路径与代码一致。
- **语言**：简中 `zh` > 繁中 `zh-TW` > 英文 `en`；内容型文案三语齐全；SSR metadata 恒简体。

## 最新功能变更

- **v1.17.3**：O-02 语言恢复 / 切换统一同步 `<html lang>`；O-07 历史页「N/30」容量条、达上限导出建议、写入失败非阻断提示；O-06 / O-08 提供 Dockerfile、Compose 与 `.env.example` 站点验证变量；V-01 / V-02 新增 OpenAPI 与文档一致性脚本；O-03 接入 V8 覆盖率与 Playwright 主链路 E2E；V-07 CI / Docker 统一 `npm ci`。
- **v1.17.4**：README / ARCHITECTURE / API / 项目记忆按当前代码与 CI 实况校订，OpenAPI `info.version` 同步；测试基线由 15/107 更新为 16/111。
- **v1.17.6**：收尾修正测试文档旧基线、Docker / CI / 依赖安装口径与记忆版本；E2E 首页 CTA 路由断言不一致登记至 O-03，OpenAPI 与全部当前版本展示位同步。

## 已知问题 `[现行]`

- `npm audit --omit=dev --audit-level=critical` 仍有 **1 个 critical**：审计库将全部 Next 16.x 判为受影响；官方建议跨 major 至 Next 16，是否迁移待业务决策（O-01）。
- E2E 已接入 CI，但 `e2e/main-flow.spec.ts` 期待首页 CTA 跳 `/guide`，`HomeContent.tsx` 实际为 `/test`（O-03）；需先对齐路由或断言，再做本地 Chromium 实跑与 CI 连续三次稳定验收。
- 组件测试未引入；内容型文案三语齐全；规范域名 `chromacheck.app` 与试用入口 `chroma.ewuse.com` 并存。
- 本地 `next build` 可能受 IDE safe-delete 护栏拦截；CI 不受影响。CI 当前也已执行 build，但 Dockerfile 镜像构建不在 CI 流程内。

## 待办事项

唯一来源为 [`docs/tasks.md`](../../docs/tasks.md)。本记忆不维护第二份任务清单；当前活跃项集中在 O-01、O-03、O-04、O-05、V-03、V-04、V-06、V-05 与 O-09~O-11，状态与计划以该文件为准。

## 关键决策记录

| 版本 / 日期 | 决策 | 影响 |
|-------------|------|------|
| v1.0 / 2026-09-03 | 纯前端 + 本地优先，检测数据不上传 | 无服务端业务 API；结果仅存 localStorage |
| v1.5.1 | 仅 GA4 匿名 `page_view`，移除服务端事件上报 | 隐私承诺与统计口径一致 |
| v1.13.3 起 | 字体真自托管（`next/font/local` + 8 个 woff2） | 构建期不联网，禁止回退 `next/font/google` |
| v1.14.0 起 | 页脚唯一展示 `V{ver}· build {yymmddhhmm}` | 页眉禁版本号 |
| v1.15.0 | 三语优先级简中 > 繁中 > 英文 | 缺键回退简体，繁体用台湾用语 |
| v1.17.3 / 2026-11-27 | 7 个扁平存储键；任务状态单一来源 `docs/tasks.md` | 避免聚合结构与多份任务清单漂移 |
| v1.17.3~v1.17.6 | CI / Dockerfile 统一 `npm ci`，接入覆盖率、OpenAPI、文档与 E2E 门禁 | 锁文件可复现；E2E 仍为 O-03 |

## 一致性检查来源

- 代码与配置：`package.json`、`package-lock.json`、`.github/workflows/ci.yml`、`vitest.config.ts`、`playwright.config.ts`、`app/llms*.txt/route.ts`。
- 文档：[`docs/SPEC.md`](../../docs/SPEC.md)、README、ARCHITECTURE、API、TESTING、ROADMAP、tasks.md。
- 校验命令：`npm run check:docs`、`npm run check:openapi`、`npm test`、`npm run test:coverage`。
