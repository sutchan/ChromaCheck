// lib/content-tw.test.ts — 内容型文案三语覆盖回归（任务 O-05）
// chromacheck v1.17.6
import { describe, expect, it } from 'vitest';
import { CHAPTERS, loc } from './fun';
import { ARTICLES } from './learn-data';
import { getPrivacyDoc } from './privacy-data';
import { SHAPE_LABEL_TW } from './questions/child';
import { getSignalTasks } from './questions/signal';

describe('内容型文案繁体覆盖', () => {
  it('趣味文案 loc() 在 zh-TW 下取台湾繁体字段', () => {
    expect(loc(CHAPTERS[0].name, 'zh')).toBe('热身 · 读懂规则');
    expect(loc(CHAPTERS[0].name, 'zh-TW')).toBe('熱身 · 讀懂規則');
    expect(loc(CHAPTERS[0].name, 'en')).toBe('Warm-up · learn the rules');
  });

  it('信号灯题干与选项具备繁体字段', () => {
    const task = getSignalTasks()[0];
    expect(task.promptTW).toContain('訊號燈');
    expect(task.options[0].labelTW).toBe('紅');
  });

  it('儿童图形标签具备繁体字段', () => {
    expect(SHAPE_LABEL_TW.circle).toBe('圓形');
    expect(SHAPE_LABEL_TW.none).toBe('看不清 / 沒有圖形');
  });

  it('科普文章标题与正文具备繁体字段', () => {
    const article = ARTICLES[0];
    expect(article.titleTW).toBe('色盲和色弱，其實不是一回事');
    expect(article.body[0].pTW.length).toBeGreaterThan(0);
  });

  it('隐私政策在 zh-TW 下返回繁体文档', () => {
    const doc = getPrivacyDoc('zh-TW');
    expect(doc.heading).toBe('我們如何對待你的資料');
    expect(doc.sections[0].paragraphs[0]).toContain('資料');
  });
});
