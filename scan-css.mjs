// scan-css.mjs — 一次性诊断：检查 globals.css 中定义的类是否在 app/ 与 components/ 中被使用
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
    else if (/\.(tsx|ts)$/.test(n)) out.push(p);
  }
  return out;
}

const css = readFileSync(join(ROOT, 'app/globals.css'), 'utf8');
const defined = [...new Set([...css.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)\s*(?=[{,:\s])/g)].map((m) => m[1]))];

const srcs = ['app', 'components'].flatMap((d) => walk(join(ROOT, d)))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');

const unused = [];
for (const c of defined) {
  // 匹配 className="... c ..." / className={`... c ...`} / ' c' 等形式
  const re = new RegExp(`(?:_|["'\`\\s{(,:])${c}(?![a-zA-Z0-9_-])`);
  if (!re.test(srcs)) unused.push(c);
}

console.log(`globals.css 定义的类（${defined.length}）：`);
console.log(defined.sort().join(', '));
console.log(`\n===== 未被使用的类（${unused.length}）=====`);
console.log(unused.length ? unused.sort().join(', ') : '(无)');
