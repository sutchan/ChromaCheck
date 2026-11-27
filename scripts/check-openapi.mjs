// scripts/check-openapi.mjs — OpenAPI 规范机器校验（任务 V-01）
// chromacheck v1.17.3
// 零依赖静态校验：版本、路径与代码 Route Handler 对齐、操作字段与实现文件存在性。
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const specPath = path.join(root, 'docs/openapi.yaml');
const errors = [];

if (!fs.existsSync(specPath)) {
  console.error('MISSING docs/openapi.yaml');
  process.exit(1);
}
const text = fs.readFileSync(specPath, 'utf8');

if (!/^openapi:\s*3\.1\.\d+\s*$/m.test(text)) errors.push('openapi 版本不是 3.1.x');

// 提取 paths 段（缩进两空格的绝对路径键）
const pathKeys = [...text.matchAll(/^  (\/[^:\s]+):\s*$/gm)].map((m) => m[1]);
const specPaths = [...new Set(pathKeys)];
if (specPaths.length === 0) errors.push('未解析到任何 path');

// 递归收集实际 Route Handler 路径
function collectRoutePaths(dir, prefix = '') {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('(')) continue;
    const segment = entry.name.startsWith('[') ? `{${entry.name.slice(1, -1)}}` : entry.name;
    const urlPath = `${prefix}/${segment}`;
    if (fs.existsSync(path.join(dir, entry.name, 'route.ts'))) found.push(urlPath);
    found.push(...collectRoutePaths(path.join(dir, entry.name), urlPath));
  }
  return found;
}
const codePaths = collectRoutePaths(path.join(root, 'app'));

for (const p of codePaths) {
  if (!specPaths.includes(p)) errors.push(`代码有 Route Handler 但规范缺失：${p}`);
}
for (const p of specPaths) {
  if (!codePaths.includes(p)) errors.push(`规范声明但代码无 Route Handler：${p}`);
}

// 逐操作检查必需字段与 x-implementation.file
const blocks = text.split(/^(?=  \/[^:\s]+:\s*$)/m).slice(1);
for (const block of blocks) {
  const urlPath = (block.match(/^  (\/[^:\s]+):/) || [])[1];
  if (!urlPath) continue;
  if (!/\boperationId:/.test(block)) errors.push(`${urlPath} 缺少 operationId`);
  if (!/^      responses:/m.test(block)) errors.push(`${urlPath} 缺少 responses`);
  const impl = block.match(/^\s+file:\s*(.+?)\s*$/m);
  if (!impl) {
    errors.push(`${urlPath} 缺少 x-implementation.file`);
  } else if (!fs.existsSync(path.join(root, impl[1]))) {
    errors.push(`${urlPath} 实现文件不存在：${impl[1]}`);
  }
}

if (errors.length > 0) {
  console.error(`OpenAPI 校验失败（${errors.length}）：`);
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}
console.log(`OpenAPI 校验通过：${specPaths.length} 个路径与代码一致`);
