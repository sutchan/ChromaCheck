// lib/i18n/html-lang.test.ts — 三语 <html lang> 属性写入（任务 O-02）
// chromacheck v1.17.3
import { describe, expect, it } from 'vitest';
import { applyHtmlLang } from './html-lang';
import type { Lang } from './lang';

function makeDoc() {
  let value = '';
  const doc = {
    documentElement: {
      setAttribute(name: string, next: string) {
        if (name === 'lang') value = next;
      },
    },
    get lang() {
      return value;
    },
  };
  return doc;
}

describe('applyHtmlLang', () => {
  it.each<[Lang, string]>([
    ['zh', 'zh-CN'],
    ['zh-TW', 'zh-TW'],
    ['en', 'en'],
  ])('%s 写入 html lang=%s', (lang, expected) => {
    const doc = makeDoc();
    applyHtmlLang(lang, doc as unknown as Pick<Document, 'documentElement'>);
    expect(doc.lang).toBe(expected);
  });

  it('无 document 环境静默跳过', () => {
    expect(() => applyHtmlLang('zh')).not.toThrow();
  });
});
