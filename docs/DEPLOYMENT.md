# 色辨 ChromaCheck 部署文档

> **规范遵循**：本文档为 [SPEC.md](./SPEC.md) 的子主题分册；若与 SPEC 冲突，以 SPEC 为准。
> **实现状态**：v1.0–v1.17.7 已部署上线（Vercel 自动部署，静态原型可单独托管预览）；纯前端、无服务端 API 路由。权威总纲见 [SPEC.md](./SPEC.md)。

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.17.7 |
| 创建日期 | 2026-09-03 |

---

## 1. 部署总览

色辨 ChromaCheck 基于 Next.js 16，推荐使用 **Vercel** 进行部署（与 Next.js 原生集成、自动 CI/CD、全球 CDN）。也支持 Docker 自托管部署。

| 部署方式 | 适用场景 | 优点 |
|----------|----------|------|
| Vercel（推荐） | 快速上线、无运维团队 | 自动部署、CDN、免费额度充足 |
| Docker 自托管 | 数据主权要求高、已有服务器 | 可控性强、可私有化 |

### 1.1 环境依赖清单

| 依赖 | 版本 / 要求 | 用途 | 必需 |
|------|-------------|------|------|
| Node.js | ≥ 18.17，CI 固定 22 LTS（推荐本地 22） | 构建与运行 Next.js | 是 |
| npm | 11（仓库已提交 `package-lock.json`） | 依赖安装；`esbuild` 已在 `package.json.allowScripts` 批准 | 是 |
| Git | 任意现代版本 | 拉取仓库、触发部署 | 是 |
| Docker / Docker Compose | 20+（仅自托管） | 容器化运行，仓库已提供 `Dockerfile` / `docker-compose.yml` | 否 |
| Vercel 账号 | 免费版即可 | 推荐部署平台与 Preview 环境 | 否（推荐） |
| 数据库 / Blob / 对象存储 | **无** | 应用纯前端、无服务端存储 | 否 |

### 1.2 多环境部署方案

| 环境 | 触发方式 | 配置要点 | 验证重点 |
|------|----------|----------|----------|
| 本地开发 | `npm run dev` | `.env.local`（复制 `.env.example`）；监听 3000 端口 | 检测流程、HMR、三语切换 |
| Vercel Preview | PR / 非 `main` 分支推送 | 在 Vercel 项目设置中单独配置 Preview 环境变量 | 完整冒烟测试，不写入生产数据 |
| Vercel Production | 推送到 `main` 且 CI 全绿 | 生产环境变量单独配置；构建号自动注入 | 响应头、页脚版本号、GA4 |
| Docker 自托管 | 使用仓库 `Dockerfile` 执行 `docker build` | `output: 'standalone'`；反代配置见 §4 | 端口映射、HTTPS、CSP |

> 各环境的环境变量相互独立；`NEXT_PUBLIC_BUILD_ID` 在每次构建期由 `next.config.mjs` 自动生成，无需手工设置。

### 1.3 部署验证方法

1. **本地门禁**：依次执行 `npm run lint`、`npm run type-check`、`npm test`、`npm run build`，全部通过后再部署。
2. **可用性验证**：`curl -I http://localhost:3000/` 返回 200；`GET /llms.txt` 与 `GET /llms-full.txt` 返回 `text/plain`；`/offline` 可访问（纯前端无 `/api/health`）。
3. **功能抽查**：完成一次石原氏快速检测 → 结果页可见 → 导出 PNG → 历史出现记录 → 切换简中 / 繁中 / English。
4. **安全与版本验证**：检查响应头含 CSP、`X-Frame-Options: SAMEORIGIN`、`X-Content-Type-Options: nosniff`；页脚显示 `V{ver}· build {10 位}`。
5. **回滚**：若验证失败，按 §7 回滚方案切回上一版本，并在 `docs/tasks.md` 登记问题。

---

## 2. Vercel 部署

### 2.1 前置条件

- GitHub / GitLab / Bitbucket 账号
- Vercel 账号（免费）

### 2.2 部署步骤

1. **推送代码到 Git 仓库**（若尚未初始化本地仓库）：

   > 注意：本项目**已使用 Git 管理**，请勿执行 `git init`（会重置仓库、丢失历史）。仅当从零开始才需 `git init`。

   ```bash
   # 若本地尚无仓库才初始化（已有则跳过此步）：
   # git init
   git add .
   git commit -m "chore: initial commit"
   git remote add origin <repository-url>
   git push -u origin main
   ```

2. **导入项目到 Vercel**：
   - 访问 [Vercel](https://vercel.com) 并登录。
   - 点击 "Add New Project" → "Import Git Repository"。
   - 选择 ChromaCheck 仓库。
   - Vercel 会自动识别为 Next.js 项目。

3. **配置构建参数**（Vercel 通常自动识别）：

   | 参数 | 值 |
   |------|-----|
   | Framework Preset | Next.js |
   | Build Command | `npm run build` |
   | Output Directory | `.next` |
   | Install Command | `npm ci` |

4. **配置环境变量**：

   在 Vercel 项目设置 → Environment Variables 中配置：

   | 变量名 | 说明 | 示例值 |
   |--------|------|--------|
   | `NEXT_PUBLIC_GA_ID` | Google Analytics 4 衡量 ID（置空即停用匿名统计，仅生产环境加载） | G-0F9QWS1PDX |

   > 这是面向用户的主要可选环境变量（见 `.env.example`）；`app/layout.tsx` 还读取两个站点验证变量（见 §5）。`NEXT_PUBLIC_BUILD_ID` 由 `next.config.mjs` 在构建期自动注入，无需配置；`NEXT_PUBLIC_APP_NAME` / `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_ANALYTICS_ENABLED` 均为早期规划，代码零引用、未实现。

   > 注意：环境变量应在 Production 和 Preview 环境中分别配置。

5. **点击 Deploy** 完成部署。

6. **绑定自定义域名**（可选）：
   - 在项目设置 → Domains 中添加域名。
   - 按提示配置 DNS 记录（CNAME / A 记录）。

### 2.3 自动部署流程

| 分支 | 触发 | 环境 |
|------|------|------|
| `main` | 推送 | 生产环境 |
| 其他分支 / PR | 推送 / 创建 | Preview 环境 |

---

## 3. Docker 自托管部署

### 3.1 使用仓库提供的 Dockerfile

项目根目录已提供 `Dockerfile`（多阶段构建，依赖阶段使用 `npm ci` 保证锁文件可复现）。`package.json` 与 `package-lock.json` 已同步至 `next@16.4.6`；镜像构建与 CI 冒烟由运维侧按需执行，若未来再次出现版本漂移，`npm ci` 会在依赖阶段失败：

```dockerfile
# Dockerfile — ChromaCheck 多阶段自托管构建（任务 O-06）
# chromacheck v1.17.7
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
```

> 注意：standalone 输出模式**已在** `next.config.mjs` 中配置，无需另行新建配置：

```javascript
// next.config.mjs（节选）
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BUILD_ID: BUILD_ID },  // 构建期注入 10 位 yymmddhhmm
  async headers() { /* CSP 等安全响应头 */ },
};
export default nextConfig;
```

### 3.2 构建与运行

```bash
# 构建镜像
docker build -t chromacheck:latest .

# 运行容器
docker run -d \
  --name chromacheck \
  -p 3000:3000 \
  --restart unless-stopped \
  chromacheck:latest
```

### 3.3 使用 docker-compose（推荐）

项目根目录已提供 `docker-compose.yml`：

```yaml

services:
  chromacheck:
    build: .
    container_name: chromacheck
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'wget', '-qO-', 'http://localhost:3000/']
      interval: 30s
      timeout: 5s
      retries: 3
```

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f chromacheck

# 停止服务
docker-compose down
```

---

## 4. 反向代理配置（自托管）

### 4.1 Nginx 配置示例

```nginx
server {
    listen 80;
    server_name chromacheck.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name chromacheck.example.com;

    ssl_certificate     /etc/nginx/ssl/chromacheck.pem;
    ssl_certificate_key /etc/nginx/ssl/chromacheck.key;

    # 安全响应头
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header Referrer-Policy strict-origin-when-cross-origin;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### 4.2 防火墙与安全

```bash
# 仅开放 80/443 端口
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 3000/tcp  # 3000 端口仅内网访问
```

---

## 5. 环境变量清单

> 代码实际读取的环境变量如下（含构建期注入的 `NEXT_PUBLIC_BUILD_ID`）；`NEXT_PUBLIC_APP_NAME` / `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_ANALYTICS_ENABLED` / `NEXT_PUBLIC_SENTRY_DSN` / `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` 均为早期规划，代码零引用、**未实现**。

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `NEXT_PUBLIC_GA_ID` | 否 | Google Analytics 4 衡量 ID（`lib/analytics.ts`，置空即停用；仅生产环境加载） |
| `NEXT_PUBLIC_BUILD_ID` | 否（自动） | 10 位 `yymmddhhmm` 构建号，由 `next.config.mjs` 在**构建时**按构建机本地时间生成并注入，供页脚展示；缺失时回退版本号，无需手工配置 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | 否 | Google Search Console 站点所有权验证（`app/layout.tsx` 读取；`.env.example` 已列出，CI 静态检查属 O-08 未完成部分） |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | 否 | Bing Webmaster Tools 站点验证（`app/layout.tsx` 读取；`.env.example` 已列出，CI 静态检查属 O-08 未完成部分） |

---

## 6. 上线检查清单

### 6.1 部署前检查

- [ ] `npm run build` 本地构建成功
- [ ] `npm run lint` 无错误
- [ ] `npm run type-check` 通过
- [ ] 自托管字体 `app/fonts/` 下 8 个 woff2 已随仓库提交（检测图为 Canvas 自绘，无 `public/plates/` 图片资源）
- [ ] 环境变量已配置
- [ ] 自定义域名 DNS 已生效（如使用）

### 6.2 上线后检查

- [ ] 首页可正常访问（HTTP 200）
- [ ] 首页与 `/offline` 离线兜底页可正常访问（纯前端，无 `/api/health` 端点）
- [ ] 完成一次完整检测流程
- [ ] 移动端访问正常
- [ ] HTTPS 证书有效
- [ ] 页面加载性能达标（LCP < 2.5s）

---

## 7. 回滚方案

### 7.1 Vercel

- 在 Vercel Dashboard → Deployments 中选择历史部署，点击 "Redeploy" 即可回滚。
- 支持按分支、按时间查看历史版本。

### 7.2 Docker

```bash
# 查看历史镜像
docker images chromacheck

# 回滚到指定版本
docker stop chromacheck
docker run -d --name chromacheck-rollback -p 3000:3000 chromacheck:<old-tag>
```

---

## 8. 运维建议

- **监控**：当前仅 GA4 匿名页面浏览统计（`NEXT_PUBLIC_GA_ID`，生产环境）；Vercel Analytics / Web Vitals 均为规划项，尚未接入。
- **告警**：Sentry / 自建错误率告警为**规划项，当前未接入**；接入后可配置日错误率 > 1% 触发通知。
- **备份**：本项目为无状态应用，无需数据库备份；本地存储数据由用户自持。
- **升级**：关注 Next.js 和依赖的安全更新，定期 `npm audit`。

---

## 9. 版本发布（GitHub Releases 自动发布，v1.16.0 起）

规范见 [SPEC.md §8.6](./SPEC.md)。要点：

- **触发**：`push` 到 `main` 且 CI workflow 所有 job 全绿后，`release` job 自动执行；PR / `develop` / 非 push 事件不发布。
- **版本来源**：仓库根 `VERSION`（tag 与 Release 标题为 `v{VERSION}`）；发版前须按规范同步 `VERSION` / `package.json` / `package-lock.json` 三源与 CHANGELOG。
- **幂等**：同名 tag 已存在则跳过，同一版本永不重复发布；发布新版本必须先 bump 版本。
- **Release 内容**：notes 取自 `CHANGELOG.md` 当前版本节（`awk` 提取，为空回退占位说明）；tag 指向全绿的那次 commit。
- **权限**：`permissions: contents: write`，内置 `github.token`，无第三方发布 Action。
- **与部署的关系**：Releases 仅承载版本归档与变更说明；生产部署仍由 Vercel 独立自动承接（push main 即部署），二者互不阻塞。

---

*文档结束*
