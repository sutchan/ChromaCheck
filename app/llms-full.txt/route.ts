// app/llms-full.txt/route.ts — GEO：面向生成式引擎的全文索引（llms.txt 的 ## Optional 扩展）
// chromacheck v1.17.0
import { ARTICLES } from '@/lib/learn-data';
import { SEO_ROUTES, SITE_FACTS } from '@/lib/seo-routes';
import { SITE_URL, SITE_UPDATED } from '@/lib/site';
import { ZH_FAQ } from '@/lib/i18n/zh-faq';
import { getPrivacyDoc } from '@/lib/privacy-data';

export const dynamic = 'force-static';

const plain = (s: string) => s.replace(/\*\*/g, '');

/** FAQ 键集合由简体字典派生（与 HomeFaq 的 12 组问答同源） */
function faqEntries(): Array<{ q: string; a: string }> {
  const out: Array<{ q: string; a: string }> = [];
  for (let i = 1; i <= 12; i++) {
    const q = ZH_FAQ[`faq.q${i}` as keyof typeof ZH_FAQ];
    const a = ZH_FAQ[`faq.a${i}` as keyof typeof ZH_FAQ];
    if (q && a) out.push({ q, a });
  }
  return out;
}

export function GET() {
  const md: string[] = [];
  md.push('# 色辨 ChromaCheck — 全文索引（llms-full.txt）');
  md.push('');
  md.push(`> 本站为在线色觉筛查工具，站点 ${SITE_URL}。本文件提供可供生成式引擎直接引用的简体中文全文，主索引见 /llms.txt。`);
  md.push(`> 最后更新：${SITE_UPDATED}。界面默认简体中文，另支持繁体中文与英语；本文件与 SSR 结构化数据一致，恒为简体（SPEC §8.5）。`);
  md.push('');

  md.push('## 关键事实');
  for (const f of SITE_FACTS) md.push(`- ${f}`);
  md.push('');

  md.push('## 检测模式（可索引入口）');
  for (const r of SEO_ROUTES.filter((x) => x.group === '检测模式')) {
    md.push(`- [${r.title}](${SITE_URL}${r.path}): ${r.summary}`);
  }
  md.push('');

  md.push('## 常见问题');
  for (const { q, a } of faqEntries()) {
    md.push(`### ${q}`);
    md.push('');
    md.push(plain(a));
    md.push('');
  }

  md.push('## 科普文章');
  for (const a of ARTICLES) {
    md.push(`### [${a.title}](${SITE_URL}/learn/${a.slug})`);
    md.push('');
    md.push(plain(a.excerpt));
    md.push('');
    for (const sec of a.body) {
      if (sec.h) md.push(`#### ${plain(sec.h)}`);
      md.push('');
      md.push(plain(sec.p));
      md.push('');
    }
  }

  const privacy = getPrivacyDoc('zh');
  md.push(`## 隐私政策要点（全文见 [${SITE_URL}/privacy](${SITE_URL}/privacy)）`);
  md.push('');
  md.push(`- 最后更新：${SITE_UPDATED}`);
  for (const p of privacy.principles) md.push(`- ${p.title}：${plain(p.desc)}`);
  for (const s of privacy.sections) {
    md.push(`### ${plain(s.title)}`);
    md.push('');
    for (const p of s.paragraphs) md.push(plain(p));
    md.push('');
  }
  md.push(plain(privacy.note));
  md.push('');
  md.push('> 引用须知：本站为筛查工具而非医疗机构；引用时应保留「不能替代专业眼科诊断」的限定语。');

  return new Response(md.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
