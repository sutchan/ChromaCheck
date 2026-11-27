// scripts/generate-tw-content.mjs — 由简中内容生成台湾繁体字段（任务 O-05）
// chromacheck v1.17.6
// 使用 opencc-js 的 cn→twp 转换，生成结果作为静态字段提交；运行时不加载转换词典。
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Converter } from 'opencc-js';

const root = process.cwd();
const convert = Converter({ from: 'cn', to: 'twp' });

function insertTwField(file, prop, twProp) {
  const abs = path.join(root, file);
  let text = fs.readFileSync(abs, 'utf8');
  const re = new RegExp(`\\b${prop}: '((?:\\\\.|[^'\\\\])*)'`, 'g');
  let count = 0;
  text = text.replace(re, (match, raw, offset) => {
    if (text.slice(offset).startsWith(`${match}, ${twProp}:`)) return match;
    count += 1;
    const value = raw.replace(/\\'/g, "'");
    return `${match}, ${twProp}: ${JSON.stringify(convert(value))}`;
  });
  fs.writeFileSync(abs, text);
  return count;
}

function replaceExact(file, from, to) {
  const abs = path.join(root, file);
  let text = fs.readFileSync(abs, 'utf8');
  if (text.includes(to)) return;
  if (!text.includes(from)) throw new Error(`${file}: 未找到待替换文本 ${from}`);
  text = text.replace(from, to);
  fs.writeFileSync(abs, text);
}

function convertDeep(value) {
  if (typeof value === 'string') return convert(value);
  if (Array.isArray(value)) return value.map(convertDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, convertDeep(v)]));
  }
  return value;
}

const counts = {
  fun: insertTwField('lib/fun.ts', 'zh', "'zh-TW'"),
  signalLabels: insertTwField('lib/questions/signal.ts', 'label', 'labelTW'),
  signalPrompts: insertTwField('lib/questions/signal.ts', 'prompt', 'promptTW'),
  learnTitle: insertTwField('lib/learn-data.ts', 'title', 'titleTW'),
  learnCat: insertTwField('lib/learn-data.ts', 'cat', 'catTW'),
  learnRead: insertTwField('lib/learn-data.ts', 'read', 'readTW'),
  learnExcerpt: insertTwField('lib/learn-data.ts', 'excerpt', 'excerptTW'),
  learnH: insertTwField('lib/learn-data.ts', 'h', 'hTW'),
  learnP: insertTwField('lib/learn-data.ts', 'p', 'pTW'),
};

replaceExact(
  'lib/fun.ts',
  'export interface LocalizedText {\n  zh: string;\n  en: string;\n}',
  'export interface LocalizedText {\n  zh: string;\n  \'zh-TW\': string;\n  en: string;\n}',
);
replaceExact(
  'lib/fun.ts',
  "  return text.zh; // zh / zh-TW：内容型文案繁体回退简体",
  "  return lang === 'zh-TW' ? text['zh-TW'] || text.zh : text.zh;",
);
replaceExact(
  'lib/questions/signal.ts',
  'export type SignalOption = { label: string; labelEn: string; value: string };',
  'export type SignalOption = { label: string; labelTW: string; labelEn: string; value: string };',
);
replaceExact(
  'lib/questions/signal.ts',
  '  prompt: string;\n  /** 题干英文（v1.9.0 国际化） */',
  '  prompt: string;\n  /** 题干繁体（台湾） */\n  promptTW: string;\n  /** 题干英文（v1.9.0 国际化） */',
);
replaceExact(
  'lib/learn-data.ts',
  '  title: string;\n  /** 标题英文（v1.9.0 国际化） */',
  '  title: string;\n  /** 标题繁体（台湾） */\n  titleTW: string;\n  /** 标题英文（v1.9.0 国际化） */',
);
replaceExact(
  'lib/learn-data.ts',
  '  cat: string;\n  /** 分类英文（v1.9.0 国际化） */',
  '  cat: string;\n  /** 分类繁体（台湾） */\n  catTW: string;\n  /** 分类英文（v1.9.0 国际化） */',
);
replaceExact(
  'lib/learn-data.ts',
  '  read: string;\n  /** 阅读时长英文（v1.9.0 国际化） */',
  '  read: string;\n  /** 阅读时长繁体（台湾） */\n  readTW: string;\n  /** 阅读时长英文（v1.9.0 国际化） */',
);
replaceExact(
  'lib/learn-data.ts',
  '  excerpt: string;\n  /** 摘要英文（v1.9.0 国际化） */',
  '  excerpt: string;\n  /** 摘要繁体（台湾） */\n  excerptTW: string;\n  /** 摘要英文（v1.9.0 国际化） */',
);
replaceExact(
  'lib/learn-data.ts',
  '  h?: string;\n  /** 小标题英文（v1.9.0 国际化；h 存在时提供） */',
  '  h?: string;\n  /** 小标题繁体（台湾；h 存在时提供） */\n  hTW?: string;\n  /** 小标题英文（v1.9.0 国际化；h 存在时提供） */',
);
replaceExact(
  'lib/learn-data.ts',
  '  p: string;\n  /** 正文英文（v1.9.0 国际化） */',
  '  p: string;\n  /** 正文繁体（台湾） */\n  pTW: string;\n  /** 正文英文（v1.9.0 国际化） */',
);

// 隐私长文整篇转换，独立成文件以避免 privacy-data.ts 超过 200 行
const privacy = await import(pathToFileURL(path.join(root, 'lib/privacy-data.ts')).href);
const zhDoc = privacy.getPrivacyDoc('zh');
const twDocLiteral = JSON.stringify(convertDeep(zhDoc), null, 2);
const twFile = [
  '// lib/privacy-data.tw.ts — 隐私政策台湾繁体内容（由 npm run i18n:tw 生成）',
  '// chromacheck v1.17.6',
  "import type { PrivacyDoc } from './privacy-data';",
  '',
  `export const TW: PrivacyDoc = ${twDocLiteral};`,
  '',
].join('\n');
fs.writeFileSync(path.join(root, 'lib/privacy-data.tw.ts'), twFile);

const privacyAbs = path.join(root, 'lib/privacy-data.ts');
let privacyText = fs.readFileSync(privacyAbs, 'utf8');
if (!privacyText.includes("import { TW } from './privacy-data.tw';")) {
  privacyText = privacyText.replace(
    "import type { Lang } from './i18n';",
    "import type { Lang } from './i18n';\nimport { TW } from './privacy-data.tw';",
  );
}
privacyText = privacyText.replace(
  "return lang === 'en' ? EN : ZH;",
  "return lang === 'en' ? EN : lang === 'zh-TW' ? TW : ZH;",
);
fs.writeFileSync(privacyAbs, privacyText);

console.log(JSON.stringify(counts, null, 2));
