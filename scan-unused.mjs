// scan-unused.mjs — 一次性诊断脚本：扫描未使用的导出、未被引用的文件、未使用的依赖
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';

const ROOT = process.cwd();
const CODE_DIRS = ['app', 'components', 'lib'];
const SKIP_DIRS = new Set(['node_modules', '.next', 'prototype', '.codebuddy', 'public', 'docs', 'coverage']);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|mjs|js)$/.test(name)) out.push(p);
  }
  return out;
}

const files = CODE_DIRS.flatMap((d) => walk(d));
const rel = files.map((f) => relative(ROOT, f).replace(/\\/g, '/'));
const contents = new Map(files.map((f, i) => [f, readFileSync(f, 'utf8')]));

// ---------- 1. 未被引用的文件 ----------
// Next.js / vitest 入口点不参与判定
const ENTRY_BASENAMES = new Set(['page.tsx', 'layout.tsx', 'error.tsx', 'not-found.tsx', 'route.ts', 'manifest.ts', 'robots.ts', 'sitemap.ts', 'default.tsx', 'loading.tsx', 'template.tsx', 'global-error.tsx', 'instrumentation.ts']);
const isEntry = (r) => {
  if (r.endsWith('.test.ts')) return true;
  if (r === 'vitest.setup.ts') return true;
  const base = basename(r);
  const dir = dirname(r);
  if (ENTRY_BASENAMES.has(base)) {
    // app 下的约定路由入口，或 app/llms.txt/route.ts 这类
    return dir === 'app' || dir.startsWith('app/') || dir === 'lib';
  }
  return false;
};

// 计算每个文件被 import 的次数（按 basename 与路径后缀匹配）
const importRe = /(?:from\s+|import\s*\(\s*|require\(\s*)['"]([^'"]+)['"]/g;
const inCount = new Map(rel.map((r) => [r, 0]));
for (const [f, src] of contents) {
  const self = relative(ROOT, f).replace(/\\/g, '/');
  let m;
  importRe.lastIndex = 0;
  while ((m = importRe.exec(src))) {
    const spec = m[1];
    if (!spec.startsWith('.') && !spec.startsWith('@/') && !spec.startsWith('~/')) continue;
    // 解析到目标文件
    let base = spec.startsWith('@/') ? spec.slice(2) : spec.replace(/^\.\//, '');
    const fromDir = dirname(self);
    if (spec.startsWith('.')) {
      const parts = (fromDir + '/' + spec).split('/');
      const stack = [];
      for (const p of parts) {
        if (p === '.' || p === '') continue;
        if (p === '..') stack.pop();
        else stack.push(p);
      }
      base = stack.join('/');
    }
    const cands = [base, base + '.ts', base + '.tsx', base + '.mjs', base + '.js', base + '/index.ts', base + '/index.tsx'];
    const target = rel.find((r) => cands.includes(r));
    if (target && target !== self) inCount.set(target, (inCount.get(target) ?? 0) + 1);
  }
}
const orphanFiles = rel.filter((r) => !isEntry(r) && (inCount.get(r) ?? 0) === 0);

// ---------- 2. 未使用的导出符号 ----------
const exportRes = [
  /export\s+function\s+([A-Za-z_$][\w$]*)/g,
  /export\s+const\s+([A-Za-z_$][\w$]*)/g,
  /export\s+class\s+([A-Za-z_$][\w$]*)/g,
  /export\s+interface\s+([A-Za-z_$][\w$]*)/g,
  /export\s+type\s+([A-Za-z_$][\w$]*)/g,
  /export\s*\{([^}]*)\}/g,
];
const unusedExports = [];
for (const [f, src] of contents) {
  const self = relative(ROOT, f).replace(/\\/g, '/');
  const names = new Set();
  for (const re of exportRes) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) {
      const raw = m[1];
      if (raw.includes(',')) {
        raw.split(',').forEach((s) => {
          const t = s.trim().split(/\s+as\s+/).pop()?.trim();
          if (t && /^[A-Za-z_$][\w$]*$/.test(t)) names.add(t);
        });
      } else if (/^[A-Za-z_$][\w$]*$/.test(raw.trim())) names.add(raw.trim());
    }
  }
  for (const name of names) {
    const wordRe = new RegExp(`\\b${name.replace(/\$/g, '\\$')}\\b`, 'g');
    let external = 0;
    for (const [f2, src2] of contents) {
      const r2 = relative(ROOT, f2).replace(/\\/g, '/');
      if (r2 === self) continue;
      const c = (src2.match(wordRe) ?? []).length;
      if (c > 0) { external += c; break; }
    }
    if (external === 0) unusedExports.push(`${self} :: ${name}`);
  }
}

// ---------- 3. 未使用的依赖 ----------
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const allSrc = [...contents.values()].join('\n');
const cfgFiles = ['next.config.mjs', 'tailwind.config.ts', 'postcss.config.mjs', 'vitest.config.ts', 'vitest.setup.ts', 'tsconfig.json']
  .filter((f) => existsSync(join(ROOT, f)))
  .map((f) => readFileSync(join(ROOT, f), 'utf8')).join('\n');
const hay = allSrc + '\n' + cfgFiles + '\n' + JSON.stringify(pkg.scripts ?? {});
const unusedDeps = [];
for (const group of ['dependencies', 'devDependencies']) {
  for (const dep of Object.keys(pkg[group] ?? {})) {
    const re = new RegExp(`['"\`/]${dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/|['"\`]|$)`, 'm');
    if (!re.test(hay)) unusedDeps.push(`${group} :: ${dep}`);
  }
}

// ---------- 4. 遗留调试语句 ----------
const debugHits = [];
for (const [f, src] of contents) {
  const self = relative(ROOT, f).replace(/\\/g, '/');
  src.split(/\r?\n/).forEach((line, i) => {
    if (/(^|[^.\w])console\.(log|debug|warn|error)\s*\(|\bdebugger\b/.test(line) && !/\/\//.test(line.split('console.')[0])) {
      debugHits.push(`${self}:${i + 1}: ${line.trim().slice(0, 100)}`);
    }
  });
}

console.log('===== 未被引用的文件（排除框架入口） =====');
console.log(orphanFiles.length ? orphanFiles.join('\n') : '(无)');
console.log('\n===== 未使用的导出符号 =====');
console.log(unusedExports.length ? unusedExports.join('\n') : '(无)');
console.log('\n===== 未使用的依赖 =====');
console.log(unusedDeps.length ? unusedDeps.join('\n') : '(无)');
console.log('\n===== console.* / debugger =====');
console.log(debugHits.length ? debugHits.join('\n') : '(无)');
