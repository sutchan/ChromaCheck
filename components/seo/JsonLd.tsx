// components/seo/JsonLd.tsx — 通用 JSON-LD 结构化数据注入
// chromacheck v1.17.0
import React from 'react';

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

/**
 * 将 JSON 序列化为可安全嵌入 <script> 的字符串：
 * 转义 < > & 与行/段分隔符，阻断 </script> 断点注入与脚本逃逸
 * （即使数据来自可信常量，也做纵深防御，契合项目安全红线）。
 */
export function safeJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * 将结构化数据以 application/ld+json 注入页面。
 * 数据由内部常量生成，经 safeJson 转义后写入，杜绝脚本断点注入。
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(data) }} />
  );
}
