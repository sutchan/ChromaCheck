import fs from 'node:fs';
import path from 'node:path';
const ROOT = 'e:/Github/ChromaCheck';
const EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.vue', '.py', '.dart', '.go', '.java']);
function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.next', '.git', 'out', 'scripts'].includes(e.name)) continue;
      walk(p, out);
    } else if (EXT.has(path.extname(e.name))) {
      const n = fs.readFileSync(p, 'utf8').split('\n').length;
      if (n > 200) out.push({ p: path.relative(ROOT, p), n });
    }
  }
}
const out = [];
walk(ROOT, out);
out.sort((a, b) => b.n - a.n);
console.log('超过 200 行的源代码文件：', out.length);
for (const f of out) console.log(`  ${f.n}\t${f.p}`);
