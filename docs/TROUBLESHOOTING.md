# 色辨 ChromaCheck 故障排除指南

> **文档版本**：v1.17.6 ｜ **适用对象**：终端用户与部署 / 维护人员
> **配套**：常见问题见 [FAQ.md](./FAQ.md)，安装部署见 [DEPLOYMENT.md](./DEPLOYMENT.md)，CI 与测试见 [TESTING.md](./TESTING.md)。

## 目录

- [1. 排查前置信息](#1-排查前置信息)
- [2. 终端用户故障](#2-终端用户故障)
- [3. 部署与构建故障](#3-部署与构建故障)
- [4. 依赖与环境告警](#4-依赖与环境告警)
- [5. 仍未解决时](#5-仍未解决时)

---

## 1. 排查前置信息

反馈问题前请准备：浏览器与版本、操作系统、访问入口（`chroma.appti.cn` / `chroma.appti.cn` / 本地）、是否开启深色 / 色觉安全模式、语言、复现步骤与截图。控制台报错（`F12` → Console）对定位最有帮助。

---

## 2. 终端用户故障

### 2.1 页面空白或样式错乱

- **现象**：打开站点只有空白、字体缺失或样式未加载。
- **常见原因**：浏览器版本过旧、缓存了旧版静态资源、网络拦截了字体 / 脚本。
- **处理**：强制刷新（`Ctrl+F5`）；换最新 Chrome / Edge / Firefox；关闭广告拦截插件后重试；检查控制台是否有资源 404。

### 2.2 点击题目无反应 / 键盘输入无效

- **原因**：作答控件未获得焦点；或输入框聚焦时由原生输入接管，实体键盘快捷键按设计不生效。
- **处理**：先点击图版下方数字键盘或答题区，再使用键盘；`Enter` 用于提交当前题。若仍无反应，刷新页面并从草稿续测。

### 2.3 图版数字看不清

- **处理**：开启设置面板的「色觉安全模式」；调高屏幕亮度并在自然光下查看；避免用手机在强光直射环境测试。注意低对比度本身可能影响结果，不必强行猜测。

### 2.4 结果与预期不符

- **原因**：题型仅含消失型 / 常规数字题，无法分型；无轴命中时 `type = null`；屏幕与光线差异会改变读数。
- **处理**：按 [FAQ.md Q2](./FAQ.md#q2为什么结果里的异常类型显示为空) 的口径解读；用标准 38 题复测；如仍怀疑异常，前往医院眼科确诊。

### 2.5 历史记录丢失

- **原因**：清除浏览器站点数据、换浏览器 / 设备，或 `localStorage` 写入失败（结果写入失败会在历史页提示，草稿写入静默降级）；结果上限 30 条，超出后最早记录被覆盖。
- **处理**：从导出的 JSON 导入恢复；今后定期导出备份。若正在使用隐私模式，关闭后数据不会保留。

### 2.6 导出 PNG / PDF 失败

- **PNG**：Canvas 尺寸固定（报告 900×1320、分享卡 720×960），低内存设备可能失败；关闭其他标签页后重试。
- **PDF**：使用浏览器打印功能，在对话框选择「另存为 PDF」；若样式错乱，检查是否启用了浏览器的「适合页面缩放」。
- **通用**：若浏览器禁用了下载，检查站点下载权限。

### 2.7 语言切换后部分内容仍是简体

- **原因**：界面文案三语齐全，但科普文章、隐私政策等**内容型长文本只有简中 / 英文**，繁体环境按设计回退简体；SSR metadata 与 JSON-LD 恒为简体。
- **处理**：这是当前已知限制（见 [FEATURES.md §8](./FEATURES.md#8-国际化模块)），非故障。

### 2.8 PWA 离线不可用

- **处理**：确认首次访问时 Service Worker 已注册（`public/sw.js`）；在浏览器地址栏检查「安装应用」状态；断网后访问 `/offline`。离线缓存覆盖范围有限，关键检测请在线完成。

---

## 3. 部署与构建故障

### 3.1 本地启动失败：`npm install` 报错

- 要求 Node.js ≥ 18.17（CI 固定 22 LTS，推荐本地也用 22）；执行 `node -v` 核对。
- 仓库提交 `package-lock.json`，使用 `npm ci` 而非随意切换包管理器；CI 与 Dockerfile 同样固定 `npm ci`。
- 若公司网络受限，配置 registry 代理后重试。

### 3.2 `npm run build` 失败

- 先跑 `npm run lint && npm run type-check && npm test`，定位是类型、lint 还是测试问题。
- `next.config.mjs` 在构建期注入 10 位 `NEXT_PUBLIC_BUILD_ID`；如构建环境缺少本地时间 / 时区异常，检查该文件第 4–8 行。
- CSP 由 `next.config.mjs` 统一生成；自定义代理或服务时若被 CSP 拦截，核对 `connect-src` / `img-src` 白名单。

### 3.3 Vercel 部署后页面 404 或资源丢失

- 确认项目根目录为仓库根（Next.js `public/` 必须在根，不能自定义路径）。
- 检查 `app/` 下对应路由文件是否存在；`ishihara/[mode]` 预生成 `quick` / `standard`，`path-tracking/[mode]` 与 `hue-arrangement/[mode]` 仅预生成 `standard`（`quick` 为动态变体），非法 mode 会 404。
- 站点规范域名为 `https://chroma.appti.cn`（`lib/site.ts` 的 `SITE_URL`）；部署到新域名后需同步更新 `SITE_URL`、`next.config.mjs` 的旧域名 308 永久重定向列表与 sitemap / metadata。

### 3.4 Docker 自托管失败

- 仓库已提供 `Dockerfile` 与 `docker-compose.yml`，用法见 [DEPLOYMENT.md §3.1](./DEPLOYMENT.md)；项目已配置 `output: 'standalone'`。
- 确认 `node:22-alpine` 基础镜像与 `npm ci` 步骤完整，构建后容器监听 3000 端口。

### 3.5 GA4 统计无数据

- 确认部署平台已设置 `NEXT_PUBLIC_GA_ID`（见 `.env.example`）；置空即停用。
- 广告拦截插件、浏览器 DNT、CSP 的 `script-src` 白名单都可能导致无数据；检查控制台是否有 googletagmanager 加载失败。

---

## 4. 依赖与环境告警

### 4.1 `npm warn Unknown env config "cache-dir"`

调用方设置了 `npm_config_cache_dir`，npm 11 已不再识别该键名。本地仓库无 `.npmrc`，需在**部署平台 / CI 环境变量**中改名为 `NPM_CONFIG_CACHE` 或 `npm_config_cache`。不影响功能，可暂忽略。

### 4.2 `install-scripts ... esbuild@0.21.5 not yet covered by allowScripts`

npm 11 的安装脚本批准策略提示。`package.json` 已通过 `npm install-scripts approve esbuild` 写入 `allowScripts: { "esbuild@0.21.5": true }`，`npm install-scripts ls` 应返回 `No packages with unreviewed install scripts.`。若在新环境仍出现，确认 `package.json` 的该字段已提交。

### 4.3 `next@14.2.15` 安全告警（依赖已升级，待验收）

npm 提示旧版本存在已披露漏洞（2025-12-11 公告）。`package.json` 与 `package-lock.json` 均已升至 `14.2.35`；仍需完成 lint / type-check / test / build 与 Preview 冒烟后才视为闭环。该升级属于优化建议 O-01，见 [ROADMAP.md](./ROADMAP.md) 与 [tasks.md](./tasks.md)。

### 4.4 弃用依赖告警（rimraf / inflight / glob / eslint 8）

来自 Next.js 16 + ESLint 8 + Vitest 2 工具链的传递依赖，当前不影响运行；升级工具链时一并处理，见优化建议 O-04。

---

## 5. 仍未解决时

在 [GitHub Issues](https://github.com/sutchan/ChromaCheck/issues) 提交问题，包含：环境信息、复现步骤、期望与实际结果、控制台报错、是否已尝试上述步骤。涉及个人健康数据的截图请先自行打码。
