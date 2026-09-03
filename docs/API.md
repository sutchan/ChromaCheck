# 色辨 ChromaCheck API 接口文档

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-09-03 |
| Base URL | `https://chromacheck.example.com/api` |

---

## 1. 概述

本项目采用**隐私优先**设计，核心检测功能完全在客户端运行，无需服务端 API。服务端 API 仅用于：

1. 健康检查
2. 匿名事件上报（需用户明确同意）
3. 题库版本查询与更新（远期）
4. 管理功能（远期）

所有 API 均为无状态接口，不依赖 Cookie 会话，通过请求头传递必要信息。

---

## 2. 通用规范

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

## 3. 接口列表

### 3.1 健康检查

#### GET `/health`

检查服务是否正常运行。

**请求示例**：
```bash
curl https://chromacheck.example.com/api/health
```

**响应示例**：
```json
{
  "ok": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2026-09-03T10:00:00.000Z"
  }
}
```

---

### 3.2 匿名事件上报

#### POST `/analytics/event`

上报匿名使用事件，用于产品数据统计。**仅在用户明确同意的情况下**，客户端才会调用此接口。

**请求体**：

```typescript
interface AnalyticsEventRequest {
  /** 事件类型 */
  event: 'test_start' | 'test_complete' | 'result_view' | 'report_export' | 'learn_view';
  /** 测试类型（如适用） */
  testType?: 'quick' | 'standard' | 'advanced';
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
curl -X POST https://chromacheck.example.com/api/analytics/event \
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

#### GET `/questions/version`

查询当前题库版本，客户端据此判断是否需要更新本地题库。

**请求示例**：
```bash
curl https://chromacheck.example.com/api/questions/version
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

#### GET `/questions/:type`

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
curl "https://chromacheck.example.com/api/questions/ishihara?version=1.0.0&mode=quick"
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
        "plateNumber": 1,
        "imageUrl": "/plates/ishihara-01.svg",
        "type": "demonstration",
        "correctAnswer": "12",
        "difficulty": 1,
        "inQuickSet": true
      }
    ]
  }
}
```

---

## 4. 错误示例

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

## 5. 安全规范

- 所有接口仅支持 HTTPS。
- 事件上报接口校验 `Origin` 头，拒绝跨域伪造请求。
- 不返回任何可能包含用户隐私的数据。
- 服务端日志仅记录请求路径、状态码和耗时，不记录请求体。

---

## 6. 版本记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2026-09-03 | 初始版本：健康检查、事件上报、题库查询 |

---

*文档结束*
