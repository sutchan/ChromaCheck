// components/seo/JsonLd.tsx — 通用 JSON-LD 结构化数据注入
// chromacheck v1.6.0
import React from 'react';

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

/**
 * 将结构化数据以 application/ld+json 注入页面。
 * 数据均由可信的内部常量生成，不含任何用户输入，可安全序列化。
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      // 内容来自固定常量，无外部注入风险
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
