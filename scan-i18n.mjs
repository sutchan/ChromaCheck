// scan-i18n.mjs — 一次性诊断：扫描从未被引用的 i18n 字典键
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SKIP = new Set(['node_modules', '.next', 'prototype', '.codebuddy', 'coverage']);
function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    if (SKIP.has(n)) continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|mjs)$/.test(n)) out.push(p);
  }
  return out;
}

// 1. 收集中文基准字典的全部键
const zhFiles = ['zh-core.ts', 'zh-ui.ts', 'zh-result.ts'].map((f) => join(ROOT, 'lib/i18n', f));
const keyRe = /^\s{2}'([^']+)':/gm;
const keys = new Set();
for (const f of zhFiles) {
  const src = readFileSync(f, 'utf8');
  keyRe.lastIndex = 0;
  let m;
  while ((m = keyRe.exec(src))) keys.add(m[1]);
}

// 2. 收集所有使用处的源码（排除字典定义文件自身）
const srcs = [];
for (const d of ['app', 'components', 'lib']) {
  for (const f of walk(join(ROOT, d))) {
    const r = relative(ROOT, f).replace(/\\/g, '/');
    if (/^lib\/i18n\/(zh|en)-/.test(r)) continue; // 跳过字典定义
    srcs.push(readFileSync(f, 'utf8'));
  }
}
const hay = srcs.join('\n');

const unused = [];
for (const k of keys) {
  // 匹配 'key' / "key" / `key` 形式
  const re = new RegExp(`['"\`]${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`);
  if (!re.test(hay)) unused.push(k);
}

// 3. 额外：查 t('...') 调用里出现的键是否都存在于字典（反向校验，防拼写错误）
const used = new Set();
const callRe = /\bt\(\s*(?:lang\s*,\s*)?['"`]([\w.\-]+)['"`]/g;
for (const s of srcs) {
  callRe.lastIndex = 0;
  let m;
  while ((m = callRe.exec(s))) used.add(m[1]);
}
const missing = [...used].filter((k) => !keys.has(k));

console.log(`字典键总数：${keys.size}`);
console.log(`\n===== 从未被引用的字典键（${unused.length}）=====`);
console.log(unused.length ? unused.sort().join('\n') : '(无)');
console.log(`\n===== t() 引用但字典缺失的键（${missing.length}）=====`);
console.log(missing.length ? missing.sort().join('\n') : '(无)');
