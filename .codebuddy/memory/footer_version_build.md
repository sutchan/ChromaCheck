---
name: 页脚版本与构建号格式规范
description: ChromaCheck 页脚必须展示 V{版本}· build {10位yymmddhhmm}；构建号由 next.config.mjs 注入 NEXT_PUBLIC_BUILD_ID，禁止回退旧格式
type: feedback
lastVerified: 2026-11-27（随 v1.17.6 复核）
---

页脚（`components/layout/Footer.tsx`，根元素 `id="app-footer"`）展示版本号 + 构建号，格式固定为 `V{版本号}· build {构建号}`：大写 `V`、版本号后**紧接** `·`（无空格）、再 ` build `（空格-英文 build-空格）、最后 **10 位**构建号。完整行：`© {年} ChromaCheck · V{pkg.version}· build {buildId} · {t('footer.purpose')}`。示例 `V1.17.5· build 2611121200`（示例仅示意格式，实际值以构建注入为准）。

- **版本号**直读 `package.json`（`pkg.version`），单一来源，**禁止硬编码**。
- **构建号**为 **10 位 `yymmddhhmm`**（2 位年份 + 月日时分），由 `next.config.mjs` 在**构建时**按构建机本地时间生成并注入 `NEXT_PUBLIC_BUILD_ID`（Next 自动暴露给客户端）；`dev` / `build` 均生效，缺失时回退 `pkg.version`。
- 页脚其余文案（`© {年}`、品牌名、用途 `footer.purpose`）保持原样；**版本与构建号只在页脚展示，页眉禁止出现版本号**。

**Why:** 用户 2026-11-06 明确要求统一页脚版本/build 编号为 `V{ver}· build {yymmddhhmm}`（10 位）；旧格式小写 `v` + 12 位 `yyyymmddhhmm` + 空格分隔已作废。已于 v1.14.0 落地，权威条文见 `docs/SPEC.md` §3.6。

**How to apply:** 改动 `Footer.tsx` / `next.config.mjs` 时保持格式与 10 位构建号；改应用版本须同步 `VERSION` / `package.json` / `package-lock.json` + CHANGELOG + README + docs 状态行，页脚自动跟随。两套记忆并存时以代码与 `docs/SPEC.md §3.6` 为准。
