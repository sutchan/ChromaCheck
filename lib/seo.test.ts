// lib/seo.test.ts — SEO / GEO 资产回归测试（路由单一数据源、llms.txt、robots、JSON-LD 转义）
// chromacheck v1.17.0
import { describe, it, expect } from 'vitest';
import sitemap from '../app/sitemap';
import robots from '../app/robots';
import { GET as llmsGet } from '../app/llms.txt/route';
import { GET as llmsFullGet } from '../app/llms-full.txt/route';
import { safeJson } from '../components/seo/JsonLd';
import { AI_CRAWLERS, INDEXABLE_URLS, SEO_LAST_MODIFIED, SEO_ROUTES, SITE_FACTS } from './seo-routes';
import { ARTICLES } from './learn-data';
import { ZH_FAQ } from './i18n/zh-faq';
import { ZH_CORE } from './i18n/zh-core';
import { TW_CORE } from './i18n/tw-core';
import { EN_CORE } from './i18n/en-core';
import { SITE_UPDATED, SITE_URL } from './site';

describe('SEO 路由单一数据源', () => {
  it('路径唯一、以 / 开头，且不含私有页面', () => {
    const paths = SEO_ROUTES.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of paths) {
      expect(p.startsWith('/')).toBe(true);
      expect(p).not.toMatch(/^\/(result|history)/);
      expect(p).not.toContain('/test/batch');
    }
  });

  it('sitemap 的 URL 集合与可索引路由完全一致（含 /test/child）', () => {
    const urls = sitemap().map((x) => x.url).sort();
    expect(urls).toEqual([...INDEXABLE_URLS].sort());
    expect(urls).toContain(`${SITE_URL}/test/child`);
  });

  it('sitemap 的 lastModified 为内容审阅日期，而非构建时间', () => {
    for (const entry of sitemap()) {
      expect(entry.lastModified).toEqual(SEO_LAST_MODIFIED);
      expect(new Date(entry.lastModified as string | Date).toISOString().slice(0, 10)).toBe(SITE_UPDATED);
    }
  });
});

describe('GEO 索引（llms.txt / llms-full.txt）', () => {
  it('llms.txt 覆盖全部可索引 URL，并声明全文索引、sitemap 与更新时间', async () => {
    const text = await llmsGet().text();
    for (const url of INDEXABLE_URLS) expect(text).toContain(url);
    expect(text).toContain('/llms-full.txt');
    expect(text).toContain('/sitemap.xml');
    expect(text).toContain('/robots.txt');
    expect(text).toContain(SITE_UPDATED);
    expect(text).toContain('## Optional');
    for (const fact of SITE_FACTS) expect(text).toContain(fact);
  });

  it('llms.txt 不残留旧题库题型的肯定式描述', async () => {
    const text = await llmsGet().text();
    expect(text).not.toContain('覆盖转换');
    expect(text).not.toContain('covering transformation');
    expect(text).toContain('未实现真正的变形、隐藏双数字或分类题型');
  });

  it('llms-full.txt 收录 12 组 FAQ 与全部科普文章正文', async () => {
    const text = await llmsFullGet().text();
    for (let i = 1; i <= 12; i++) {
      const q = ZH_FAQ[`faq.q${i}` as keyof typeof ZH_FAQ];
      const a = ZH_FAQ[`faq.a${i}` as keyof typeof ZH_FAQ];
      expect(text).toContain(q);
      expect(text).toContain(a);
    }
    for (const a of ARTICLES) {
      expect(text).toContain(a.title);
      expect(text).toContain(a.body[0].p.replace(/\*\*/g, ''));
    }
    expect(text).toContain('医学免责声明');
    expect(text).toContain(SITE_UPDATED);
  });

  it('两个索引端点均为 UTF-8 纯文本', async () => {
    for (const res of [llmsGet(), llmsFullGet()]) {
      expect(res.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    }
  });
});

describe('robots.txt 抓取策略', () => {
  it('显式放行 AI 抓取器并屏蔽私有路径', () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    const agents = rules.map((x) => x.userAgent).flat();
    for (const bot of AI_CRAWLERS) expect(agents).toContain(bot);
    for (const rule of rules) expect(rule.disallow).toEqual(['/result/', '/history/', '/test/batch/']);
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});

describe('结构化数据与文案一致性', () => {
  it('safeJson 阻断 </script> 逃逸并转义行分隔符', () => {
    const out = safeJson({ html: '</script><script>alert(1)</script>', ls: '\u2028\u2029' });
    expect(out).not.toContain('</script>');
    expect(out).toContain('\\u003c/script\\u003e');
    expect(out).toContain('\\u2028');
    expect(out).toContain('\\u2029');
  });

  it('三语字典不再宣称已实现转换 / 隐藏 / 分类题型', () => {
    expect(ZH_CORE['mode.standard.desc']).not.toMatch(/转换|隐藏|分类/);
    expect(TW_CORE['mode.standard.desc']).not.toMatch(/轉換|隱藏|分類/);
    expect(EN_CORE['mode.standard.desc']).not.toMatch(/transformation|hidden|classification/);
  });
});
