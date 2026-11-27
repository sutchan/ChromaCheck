# 色辨 ChromaCheck API 接口文档

> **规范遵循**：本文档为 [SPEC.md](./SPEC.md) 的子主题分册；若与 SPEC 冲突，以 SPEC 为准。
> **实现状态**：v1.0–v1.17.6 已实现（按 [SPEC.md](./SPEC.md) §0.3 分类清单）；纯前端、无服务端 API 路由。权威总纲见 [SPEC.md](./SPEC.md)，任务清单见 [tasks.md](./tasks.md)。
> **OpenAPI 规范**：机器可读规范见 [openapi.yaml](./openapi.yaml)（OpenAPI 3.1），仅描述真实存在的 `GET /llms.txt` 与 `GET /llms-full.txt`；业务 API 数量为零，下文 §3 的历史接口均标注未实现 / 已移除。

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.17.6 |
| 创建日期 | 2026-09-03 |
| Base URL | 无服务端 API；唯一规范域名取自 `lib/site.ts` 的 `SITE_URL`（`https://chroma.appti.cn`），旧域名由 Next 308 永久重定向收敛；仓库不含 `/api` 路由 |

> 本分册 §2 起描述的服务端 API 均为**历史规划 / 未落地**设计；当前仓库除 GA4 外无任何服务端业务接口，现行公开接口见 §1，架构边界见 [ARCHITECTURE.md §5](./ARCHITECTURE.md#5-api-设计)。

---

## 1. 现行公开接口（更新于 2026-11-27 / v1.17.6）

当前应用**不提供任何业务 API**：无 `/api/*` 路由、无认证、无数据库、无服务端上报。真实存在的公开接口只有两个静态文本 Route Handler，均由 [openapi.yaml](./openapi.yaml) 机器校验（`npm run check:openapi`）。

| 方法 | 路径 | 说明 | 内容类型 | 实现文件 |
|------|------|------|----------|----------|
| GET | `/llms.txt` | 站点关键事实索引，面向 LLM / SEO | `text/plain` | `app/llms.txt/route.ts` |
| GET | `/llms-full.txt` | 站点全文索引，恒为简体中文 | `text/plain` | `app/llms-full.txt/route.ts` |

### 1.1 `GET /llms.txt`

- **请求**：无路径参数、无查询参数、无认证；仅 `GET`，其他方法由 Next.js 返回 `405`。
- **响应**：`200 text/plain`；由 `export const dynamic = 'force-static'` 在构建期生成。
- **示例**：

```bash
curl https://chroma.appti.cn/llms.txt
```

### 1.2 `GET /llms-full.txt`

- **请求**：无参数、无认证；输出恒为简体中文，便于 AI 爬虫与站点索引。
- **响应**：`200 text/plain`；构建期静态输出，罕见生成失败时返回 `500`。
- **示例**：

```bash
curl https://chroma.appti.cn/llms-full.txt
```

### 1.3 当前边界、待办与关键决策

- **已知问题**：公开面仅上述两个静态文本端点；历史规划接口不可调用。生产依赖 critical 审计已归零（Next 16.4.6），与接口实现无关。
- **待办事项**：唯一来源为 [tasks.md](./tasks.md)。服务端账号 / 云同步（O-10）与 AI 辅助判读 / 开放 API（O-11）均因业务与合规决策阻塞，当前不得写入已实现能力。
- **关键决策**：纯前端本地优先；检测数据不上传，仅 GA4 匿名 `page_view`；不保留服务端事件上报接口（v1.9.0 已移除）；两个静态 Route Handler 是 SEO/GEO 例外，不扩展为通用后端。

---

## 2. 历史规划总览

> **历史规划状态说明**：截至 v1.17.6，本产品仍为**纯前端应用，无服务端业务 API 路由**（见 SPEC §2.3 与 PRIVACY §2.2：当前仅 GA4 匿名访问统计，无服务端上报接口）。本节描述的 API 为 **v1.1+ 历史规划**，仅在引入服务端能力（匿名上报 / 题库远程更新）时落地；现行版本不包含下列接口。

本项目采用**隐私优先**设计，核心检测功能完全在客户端运行，无需服务端 API。规划中的服务端 API 仅用于：

1. 健康检查
2. 匿名事件上报（需用户明确同意）
3. 题库版本查询与更新（远期）
4. 管理功能（远期）

所有 API 均为无状态接口，不依赖 Cookie 会话，通过请求头传递必要信息。

---

## 3. 历史通用规范（未落地）

### 2.1 请求头

| Header | 说明 | 必填 |
|--------|------|------|
| `Content-Type` | `application/json`（POST 请求） | 是 |
| `Origin` | 请求来源（用于 CSRF 防护） | POST 是 |
| `X-Request-ID` | 请求追踪 ID（UUID），便于排查 | 否 |

### 2.2 响应格式

所有接口返回统一 JSON 格式：

```json
{
  "ok": true,
  "data": { },
  "error": null
}
```

**成功响应**：
```json
{
  "ok": true,
  "data": { }
}
```

**错误响应**：
```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "资源不存在"
  }
}
```

### 2.3 错误码

| 错误码 | HTTP 状态码 | 说明 |
|--------|-------------|------|
| `BAD_REQUEST` | 400 | 请求参数错误 |
| `UNAUTHORIZED` | 401 | 未认证 |
| `FORBIDDEN` | 403 | 无权限 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `RATE_LIMITED` | 429 | 请求过于频繁 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

### 2.4 限流策略

- 匿名事件上报：每 IP 每分钟最多 60 次。
- 题库接口：每 IP 每小时最多 120 次。
- 超出限制返回 `429` 及 `Retry-After` 响应头。

---

## 4. 历史接口列表（未实现 / 已移除）

### 3.1 健康检查

#### GET `/api/health`（未实现）

检查服务是否正常运行。

**请求示例**：
```bash
curl https://chroma.appti.cn/api/health
```

**响应示例**：
```json
{
  "ok": true,
  "data": {
    "status": "healthy",
    "version": "1.17.6",
    "timestamp": "2026-09-03T10:00:00.000Z"
  }
}
```

---

### 3.2 匿名事件上报（已于 v1.9.0 移除）

> **v1.9.0 起废止**：`POST /api/analytics/event` 路由与客户端 `reportServerEvent()` 已删除，应用不再向服务端上报任何检测事件，仅保留 Google Analytics 4 匿名访问统计。以下内容保留作历史设计记录，不再对外提供服务。

#### POST `/analytics/event`（已移除）

上报匿名使用事件，用于产品数据统计。**仅在用户明确同意的情况下**，客户端才会调用此接口。

**请求体**：

```typescript
interface AnalyticsEventRequest {
  /** 事件类型 */
  event: 'test_start' | 'test_complete' | 'result_view' | 'report_export' | 'learn_view';
  /** 测试类型（如适用）；advanced 为 v1.1 规划 */
  testType?: 'quick' | 'standard';
  /** 测试时长（毫秒，如适用） */
  duration?: number;
  /** 检测结果（如适用） */
  resultOverall?: 'normal' | 'suspected_deficiency' | 'suspected_blindness' | 'inconclusive';
  /** 客户端生成的事件 ID（用于幂等去重） */
  eventId: string;
  /** 事件时间 ISO 字符串 */
  timestamp: string;
}
```

**请求示例**：
```bash
curl -X POST https://chroma.appti.cn/api/analytics/event \
  -H "Content-Type: application/json" \
  -d '{
    "event": "test_complete",
    "testType": "quick",
    "duration": 120000,
    "resultOverall": "normal",
    "eventId": "evt_abc123",
    "timestamp": "2026-09-03T10:00:00.000Z"
  }'
```

**响应示例**：
```json
{
  "ok": true,
  "data": {
    "accepted": true
  }
}
```

**隐私说明**：
- 接口不记录 IP 地址（服务端配置为丢弃）。
- 不接收和存储任何用户身份信息。
- 事件 ID 仅用于幂等去重，30 天后自动清理。
- 聚合统计时不关联具体用户。

---

### 3.3 题库版本查询

#### GET `/api/questions/version`（未实现）

查询当前题库版本，客户端据此判断是否需要更新本地题库。

**请求示例**：
```bash
curl https://chroma.appti.cn/api/questions/version
```

**响应示例**：
```json
{
  "ok": true,
  "data": {
    "ishihara": "1.0.0",
    "pathTracking": "1.0.0",
    "hueArrangement": "1.0.0",
    "publishedAt": "2026-09-01T00:00:00.000Z"
  }
}
```

---

### 3.4 获取题库数据（远期）

#### GET `/api/questions/:type`（未实现）

获取指定类型的题库数据，用于客户端远程更新题库。

**路径参数**：

| 参数 | 说明 | 可选值 |
|------|------|--------|
| `type` | 题库类型 | `ishihara`、`path-tracking`、`hue-arrangement` |

**请求参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `version` | string | 客户端当前版本，若相同则返回 `304` |
| `mode` | string | 可选，指定题目集 |

**请求示例**：
```bash
curl "https://chroma.appti.cn/api/questions/ishihara?version=1.0.0&mode=quick"
```

**响应示例**：
```json
{
  "ok": true,
  "data": {
    "version": "1.0.1",
    "questions": [
      {
        "id": "ishihara-01",
        "plate": 1,
        "type": "demonstration",
        "answer": "12",
        "difficulty": 1,
        "quick": true
      }
    ]
  }
}
```

---

## 5. 历史错误示例

### 4.1 参数错误

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "event 字段不能为空"
  }
}
```

### 4.2 资源不存在

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "题库类型不存在"
  }
}
```

---

## 6. 历史安全规范

- 所有接口仅支持 HTTPS。
- 事件上报接口校验 `Origin` 头，拒绝跨域伪造请求。
- 不返回任何可能包含用户隐私的数据。
- 服务端日志仅记录请求路径、状态码和耗时，不记录请求体。

---

## 7. 版本记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.17.5 | 2026-11-27 | 同步 OpenAPI `info.version` 至当前版本；保留历史规划接口为未实现记录 |
| v1.17.4 | 2026-11-27 | 新增现行公开接口章节（`/llms.txt`、`/llms-full.txt`）；同步 OpenAPI `info.version`；历史规划接口归档为未实现 / 已移除 |
| v1.0 | 2026-09-03 | 初始版本：健康检查、事件上报、题库查询 |

---

*文档结束*
