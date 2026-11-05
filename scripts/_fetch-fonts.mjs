import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'app', 'fonts');
mkdirSync(OUT, { recursive: true });

const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const cssUrl =
  'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap';

const css = await fetch(cssUrl, { headers: { 'User-Agent': ua } }).then((r) => r.text());

// 匹配每个 @font-face 块及其前置子集注释
const re = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g;
let m;
const jobs = [];
while ((m = re.exec(css)) !== null) {
  const subset = m[1];
  if (subset !== 'latin') continue; // 仅取 latin 子集，与 next/font/google subsets:['latin'] 一致
  const block = m[2];
  const fam = /font-family:\s*'([^']+)'/i.exec(block)?.[1];
  const weight = /font-weight:\s*(\d+)/i.exec(block)?.[1];
  const url = /src:\s*url\(([^)]+)\)\s*format\('woff2'\)/i.exec(block)?.[1];
  if (!fam || !weight || !url) continue;
  const safeFam = fam.replace(/[^a-zA-Z]/g, '');
  const fileName = `${safeFam}-${weight}.woff2`;
  jobs.push({ url, fileName });
}

console.log(`found ${jobs.length} latin woff2 to download`);
for (const { url, fileName } of jobs) {
  const buf = await fetch(url, { headers: { 'User-Agent': ua } }).then((r) => {
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return r.arrayBuffer();
  });
  writeFileSync(join(OUT, fileName), Buffer.from(buf));
  console.log('saved', fileName, buf.byteLength, 'bytes');
}
console.log('DONE');
