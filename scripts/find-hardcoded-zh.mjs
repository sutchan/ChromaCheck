// scripts/find-hardcoded-zh.mjs — 扫描源码中仍含中文的代码行（剥离行注释后报告）
// 一次性排查脚本，非构建依赖。
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['app', 'components', 'lib'];
const SKIP_DIRS = new Set(['node_modules', '.next', 'prototype']);
const CJK = /[\u4e00-\u9fa5]/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.ts$/.test(name)) out.push(p);
  }
  return out;
}

const findings = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((raw, i) => {
      // 去掉整行注释与行尾注释中的说明性中文（保留字符串字面量里的中文）
      const code = raw.replace(/\/\/.*$/, '');
      if (!CJK.test(code)) return;
      findings.push(`${file}:${i + 1}: ${raw.trim()}`);
    });
  }
}

console.log(findings.length ? findings.join('\n') : 'NO_HARDCODED_ZH');
console.log(`TOTAL=${findings.length}`);
