import fs from 'node:fs';
// 精确替换各文档"实现状态"行的版本标记；仅替换当前版本标记，保留历史区间（如 v1.11.1–v1.12.0）不变。
const edits = [
  // 7 个分册共用同一行状态文本
  ...['docs/ROADMAP.md','docs/PRIVACY.md','docs/PRD.md','docs/API.md','docs/DEPLOYMENT.md','docs/DATA-SPEC.md','docs/ARCHITECTURE.md']
    .map(f => [f, [['v1.0–v1.12.0 已实现', 'v1.0–v1.13.0 已实现']]]),
  ['docs/TESTING.md', [['v1.12.0：Vitest', 'v1.13.0：Vitest']]],
  ['docs/TASKS.md', [['**v1.12.1**', '**v1.13.0**']]],
  ['docs/tasks-done.md', [['**v1.12.0**', '**v1.13.0**']]],
  ['docs/SPEC.md', [
    ['SPEC.md v1.12.0 —', 'SPEC.md v1.13.0 —'],
    ['当前版本 v1.12.0。', '当前版本 v1.13.0。'],
    ['持续迭代至 v1.12.0——', '持续迭代至 v1.13.0——'],
    ['（当前 `1.7.8`）', '（当前 `1.13.0`）'],
  ]],
];
for (const [f, reps] of edits) {
  let s = fs.readFileSync(f, 'utf8');
  for (const [a, b] of reps) {
    if (!s.includes(a)) { console.log('WARN 未命中:', a, 'in', f); continue; }
    s = s.split(a).join(b);
  }
  fs.writeFileSync(f, s);
  console.log('updated', f);
}
console.log('docsync done');
