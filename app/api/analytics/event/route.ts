// app/api/analytics/event/route.ts — 匿名事件上报端点（C3）
// chromacheck v1.7.9
import { NextResponse } from 'next/server';

/** 事件名白名单：只接受聚合所需的匿名事件，杜绝任意数据写入 */
const ALLOWED_EVENTS = new Set([
  'test_start',
  'test_complete',
  'share',
  'download',
  'learn_view',
  'export',
]);

/** 请求体上限，避免滥用 */
const MAX_BODY_BYTES = 1024;

function trim(value: unknown, max: number): string | undefined {
  return typeof value === 'string' ? value.slice(0, max) : undefined;
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = payload.event;
  if (typeof event !== 'string' || !ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // 仅保留聚合指标：事件名 / 测试类型 / 时长 / 结果摘要
  // 服务端不落库、不记录 IP 与 User-Agent、不写入任何身份信息
  const durationRaw = payload.durationMs;
  const record = {
    event,
    testType: trim(payload.testType, 16),
    resultSummary: trim(payload.resultSummary, 24),
    durationMs:
      typeof durationRaw === 'number' && Number.isFinite(durationRaw)
        ? Math.min(Math.max(0, Math.round(durationRaw)), 3_600_000)
        : undefined,
  };

  console.info(`[analytics] ${JSON.stringify(record)}`);
  return NextResponse.json({ ok: true });
}
