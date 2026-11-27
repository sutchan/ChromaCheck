// scripts/check-docs.mjs — 文档链接与版本展示位一致性（任务 V-02）
// chromacheck v1.17.3
// 产物写入 reports/docs-check.json；退出码非 0 表示存在断链或版本漂移。
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const version = fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim();
const errors = [];
const checked = { links: 0, versionLines: 0 };

function walkMarkdown(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMarkdown(abs));
    else if (entry.name.endsWith('.md')) out.push(path.relative(root, abs).replace(/\\/g, '/'));
  }
  return out;
}

const files = ['README.md', ...walkMarkdown(path.join(root, 'docs'))];
for (const rel of files) {
  const abs = path.join(root, rel);
  const text = fs.readFileSync(abs, 'utf8');
  const base = path.dirname(abs);

  // 相对链接检查（跳过 http(s) / mailto / 纯锚点）
  for (const m of text.matchAll(/\]\(([^)]+)\)/g)) {
    const raw = m[1].split('#')[0].trim();
    if (!raw || /^(https?:|mailto:)/.test(raw)) continue;
    if (!raw.startsWith('.') && !raw.endsWith('.md')) continue;
    checked.links++;
    const target = path.resolve(base, raw);
    if (!fs.existsSync(target)) errors.push(`${rel}: 断链 ${raw}`);
  }

  // 当前版本展示位（CHANGELOG 与归档文档保留历史版本，不参与校验）
  if (rel === 'CHANGELOG.md' || rel === 'docs/tasks-done.md') continue;
  const patterns = [/当前版本\s*v?(\d+\.\d+\.\d+)/g, /\|\s*文档版本\s*\|\s*v?(\d+\.\d+\.\d+)/g];
  for (const re of patterns) {
    for (const m of text.matchAll(re)) {
      checked.versionLines++;
      if (m[1] !== version) errors.push(`${rel}: 版本展示位 v${m[1]} 与 VERSION ${version} 不一致`);
    }
  }
}

// 环境变量一致性：代码读取的 NEXT_PUBLIC_* 必须在 .env.example 声明（O-08）
const envConsumers = ['app/layout.tsx', 'components/analytics/GoogleAnalytics.tsx'];
const usedEnv = new Set();
for (const rel of envConsumers) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) continue;
  for (const m of fs.readFileSync(abs, 'utf8').matchAll(/process\.env\.(NEXT_PUBLIC_[A-Z0-9_]+)/g)) {
    if (m[1] !== 'NEXT_PUBLIC_BUILD_ID') usedEnv.add(m[1]);
  }
}
const envExample = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
for (const key of usedEnv) {
  if (!new RegExp(`^${key}=`, 'm').test(envExample)) errors.push(`.env.example 缺少 ${key}`);
}
checked.envKeys = usedEnv.size;

const outDir = path.join(root, 'reports');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'docs-check.json'),
  JSON.stringify({ version, files: files.length, checked, errors }, null, 2),
  'utf8',
);

if (errors.length > 0) {
  console.error(`文档校验失败（${errors.length}）：`);
  for (const e of errors.slice(0, 30)) console.error(` - ${e}`);
  process.exit(1);
}
console.log(`文档校验通过：${files.length} 文件 / ${checked.links} 链接 / ${checked.versionLines} 版本展示位`);
