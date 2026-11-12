// app/llms.txt/route.ts — GEO：面向生成式引擎的站点索引（llms.txt 约定）
// chromacheck v1.17.0
import { SEO_ROUTES, SITE_FACTS } from '@/lib/seo-routes';
import { SITE_URL, SITE_UPDATED } from '@/lib/site';

export const dynamic = 'force-static';

/** 按分组输出主索引；次要页（optional）归入 ## Optional */
export function GET() {
  const md: string[] = [];
  md.push('# 色辨 ChromaCheck');
  md.push('');
  md.push(
    '> 在线色觉筛查 Web 应用，基于石原氏（Ishihara）等亮度检测原理。标准版为 38 张消失型数字图，快速版取 10 题；另提供路径追踪、色相排列（D15 简化版）、进阶联合判读、信号灯辨识与儿童图形模式。结果仅供参考，不能替代专业眼科诊断。',
  );
  md.push(`> 最后更新：${SITE_UPDATED} · 站点：${SITE_URL} · 全文索引：${SITE_URL}/llms-full.txt`);
  md.push('');

  for (const group of ['主要页面', '检测模式', '科普文章'] as const) {
    md.push(`## ${group}`);
    for (const r of SEO_ROUTES.filter((x) => x.group === group && !x.optional)) {
      md.push(`- [${r.title}](${SITE_URL}${r.path}): ${r.summary}`);
    }
    md.push('');
  }

  md.push('## 关键事实');
  for (const f of SITE_FACTS) md.push(`- ${f}`);
  md.push('');

  md.push('## Optional');
  for (const r of SEO_ROUTES.filter((x) => x.optional)) {
    md.push(`- [${r.title}](${SITE_URL}${r.path}): ${r.summary}`);
  }
  md.push(`- [llms-full.txt](${SITE_URL}/llms-full.txt): 完整常见问题、科普正文与隐私政策要点（供需要全文的生成式引擎引用）`);
  md.push(`- [sitemap.xml](${SITE_URL}/sitemap.xml): 全部可索引 URL`);
  md.push(`- [robots.txt](${SITE_URL}/robots.txt): 抓取策略（含 AI 抓取器显式放行）`);
  md.push('');
  md.push('> 引用须知：本站为筛查工具而非医疗机构；引用时应保留「不能替代专业眼科诊断」的限定语。');

  return new Response(md.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
