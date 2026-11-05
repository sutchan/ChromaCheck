import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.cwd();
const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);
const skip = new Set(['node_modules', '.next', '.git', 'prototype/assets']);
const large = [];
const consoleLog = [];
const anys = [];
const debuggerUse = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) { walk(p); continue; }
    const ext = extname(p);
    if (!exts.has(ext)) continue;
    let content;
    try { content = readFileSync(p, 'utf8'); } catch { continue; }
    const lines = content.split('\n').length;
    if (lines > 200) large.push({ p: p.replace(root + '\\', ''), lines });
    content.split('\n').forEach((ln, i) => {
      if (/\bconsole\.(log|debug|info|warn)\b/.test(ln)) consoleLog.push(`${p.replace(root + '\\', '')}:${i + 1}`);
      if (/\bdebugger\b/.test(ln)) debuggerUse.push(`${p.replace(root + '\\', '')}:${i + 1}`);
      if (/:\s*any\b|\bas\s*any\b|<any>|<any,/.test(ln)) anys.push(`${p.replace(root + '\\', '')}:${i + 1}`);
    });
  }
}
walk(root);
console.log('=== FILES >200 LINES ===');
large.sort((a, b) => b.lines - a.lines).forEach((x) => console.log(`${x.lines}\t${x.p}`));
console.log('\n=== console.log/debug/info/warn ===');
console.log(consoleLog.length ? consoleLog.join('\n') : '(none)');
console.log('\n=== debugger ===');
console.log(debuggerUse.length ? debuggerUse.join('\n') : '(none)');
console.log('\n=== any usage (approx) ===');
console.log(anys.length ? anys.slice(0, 60).join('\n') : '(none)');
