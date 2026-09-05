# 色辨 ChromaCheck 部署文档

> **规范遵循**：本文档为 [docs/SPEC.md](docs/SPEC.md) 的子主题分册；若与 SPEC 冲突，以 SPEC 为准。
> **实现状态**：v1.0 应用已实现，部署流程见 §2（Vercel / Node 托管）；静态原型仍可单独托管预览。

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-09-03 |

---

## 1. 部署总览

色辨 ChromaCheck 基于 Next.js 14，推荐使用 **Vercel** 进行部署（与 Next.js 原生集成、自动 CI/CD、全球 CDN）。也支持 Docker 自托管部署。

| 部署方式 | 适用场景 | 优点 |
|----------|----------|------|
| Vercel（推荐） | 快速上线、无运维团队 | 自动部署、CDN、免费额度充足 |
| Docker 自托管 | 数据主权要求高、已有服务器 | 可控性强、可私有化 |

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
   | Install Command | `npm install` |

4. **配置环境变量**：

   在 Vercel 项目设置 → Environment Variables 中配置：

   | 变量名 | 说明 | 示例值 |
   |--------|------|--------|
   | `NEXT_PUBLIC_APP_NAME` | 应用名称 | 色辨 ChromaCheck |
   | `NEXT_PUBLIC_APP_URL` | 应用 URL | https://chromacheck.example.com |
   | `NEXT_PUBLIC_GA_ID` | Google Analytics 4 衡量 ID（置空即停用心智统计） | G-0F9QWS1PDX |
   | `NEXT_PUBLIC_ANALYTICS_ENABLED` | 是否启用分析 | false |

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

### 3.1 创建 Dockerfile

在项目根目录创建 `Dockerfile`：

```dockerfile
# 依赖安装阶段
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 运行阶段
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

> 注意：使用 standalone 输出模式需要先在 `next.config.js` 中配置：

```javascript
module.exports = {
  output: 'standalone',
  // ...其他配置
};
```

### 3.2 构建与运行

```bash
# 构建镜像
docker build -t chromacheck:latest .

# 运行容器
docker run -d \
  --name chromacheck \
  -p 3000:3000 \
  -e NEXT_PUBLIC_APP_URL=https://chromacheck.example.com \
  --restart unless-stopped \
  chromacheck:latest
```

### 3.3 使用 docker-compose（推荐）

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  chromacheck:
    build: .
    container_name: chromacheck
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://chromacheck.example.com
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'wget', '-qO-', 'http://localhost:3000/api/health']
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
    add_header X-Frame-Options DENY;
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

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `NEXT_PUBLIC_APP_NAME` | 是 | 应用名称 |
| `NEXT_PUBLIC_APP_URL` | 是 | 应用公开 URL |
| `NEXT_PUBLIC_GA_ID` | 否 | Google Analytics 4 衡量 ID（默认 G-0F9QWS1PDX，置空即停用；仅生产环境加载） |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | 否 | 匿名分析开关（默认 false） |
| `NEXT_PUBLIC_SENTRY_DSN` | 否 | Sentry 错误监控 DSN |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | 否 | Vercel Analytics ID |

---

## 6. 上线检查清单

### 6.1 部署前检查

- [ ] `npm run build` 本地构建成功
- [ ] `npm run lint` 无错误
- [ ] `npm run type-check` 通过
- [ ] 检测图资源已上传至 `public/plates/`
- [ ] 环境变量已配置
- [ ] 自定义域名 DNS 已生效（如使用）

### 6.2 上线后检查

- [ ] 首页可正常访问（HTTP 200）
- [ ] `/api/health` 返回 healthy
- [ ] 完成一次完整检测流程
- [ ] 移动端访问正常
- [ ] HTTPS 证书有效
- [ ] 页面加载性能达标（LCP < 2.5s）

---

## 7. 回滚方案

### Vercel

- 在 Vercel Dashboard → Deployments 中选择历史部署，点击 "Redeploy" 即可回滚。
- 支持按分支、按时间查看历史版本。

### Docker

```bash
# 查看历史镜像
docker images chromacheck

# 回滚到指定版本
docker stop chromacheck
docker run -d --name chromacheck-rollback -p 3000:3000 chromacheck:<old-tag>
```

---

## 8. 运维建议

- **监控**：启用 Vercel Analytics 和 Web Vitals，关注 LCP/FID/CLS。
- **告警**：配置错误率告警（Sentry 或自建），日错误率 > 1% 触发通知。
- **备份**：本项目为无状态应用，无需数据库备份；本地存储数据由用户自持。
- **升级**：关注 Next.js 和依赖的安全更新，定期 `npm audit`。

---

*文档结束*
