---
name: 页脚版本与构建号格式规范
description: ChromaCheck 页脚必须展示 V{版本}· build {10位yymmddhhmm}；构建号由 next.config.mjs 注入 NEXT_PUBLIC_BUILD_ID，禁止回退旧格式
type: feedback
---

页脚（`components/layout/Footer.tsx`，根元素 `id="app-footer"`）展示版本号 + 构建号，格式固定为 `V{版本号}· build {构建号}`：大写 `V`、版本号后**紧接** `·`（无空格）、再 ` build `（空格-英文 build-空格）、最后 **10 位**构建号。完整行：`© {年} ChromaCheck · V{pkg.version}· build {buildId} · {t('footer.purpose')}`。示例 `V1.14.0· build 2611061430`。

- **版本号**直读 `package.json`（`pkg.version`），单一来源，**禁止硬编码**。
- **构建号**为 **10 位 `yymmddhhmm`**（2 位年份 + 月日时分），由 `next.config.mjs` 在**构建时**按构建机本地时间生成并注入 `NEXT_PUBLIC_BUILD_ID`（Next 自动暴露给客户端）；`dev` / `build` 均生效，缺失（如本地未注入）时回退 `pkg.version`。
- 页脚其余文案（`© {年}`、品牌名、用途 `footer.purpose`）保持原样，不随版本/build token 改动。

**Why:** 用户 2026-11-06 明确要求统一页脚版本/build 编号为 `V{ver}· build {yymmddhhmm}`（yymmddhhmm 为 10 位）。旧实现是小写 `v` + 12 位 `yyyymmddhhmm` + 空格分隔（`v{ver} · build {yyyymmddhhmm}`），不一致。已于 v1.14.0（提交 `ad56cb7`）落地，并写入 `docs/SPEC.md` §3.6。

**How to apply:** 任何改动 `Footer.tsx` / `next.config.mjs` 时，保持上述格式与 10 位构建号；改应用版本只动 `package.json` / `VERSION`，页脚自动跟随（勿在页脚硬编码版本号）。如外部/并行进程再次重排页脚，核对格式与位数未被改回。
