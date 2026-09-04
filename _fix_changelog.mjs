import { readFileSync, writeFileSync } from 'fs';
const p = 'e:/Github/ChromaCheck/CHANGELOG.md';
let s = readFileSync(p, 'utf8');

// 删除由文档治理插入的重复 [1.0.1] 小节（### 修正 块），并将其要点并入用户已有的 [1.0.1] 小节
const mySec = '\n## [1.0.1] - 2026-09-04\n\n### 修正';
const end = '\n## [1.0.0]';
const i = s.indexOf(mySec);
const j = s.indexOf(end);
if (i >= 0 && j > i) {
  const insert = '- 文档治理收尾：更新 `docs/SPEC.md` §0 状态表（8 份分册由“待据本规范修订”更正为“已对齐 SPEC，生效”）；修复 README 贡献指南链接重复 `.github/` 路径；README 文档索引补充 `docs/SPEC.md` 与 `CHANGELOG.md`；版本单一来源同步至 `1.0.1`。\n';
  s = s.slice(0, i) + insert + s.slice(j);
}

// 删除多余的 [1.0.1]: 链接锚点，仅保留第一个
const link = '[1.0.1]: https://github.com/ChromaCheck/ChromaCheck/releases/tag/v1.0.1';
let k = s.indexOf(link);
const nxt = s.indexOf(link, k + 1);
if (k >= 0 && nxt >= 0) {
  s = s.slice(0, nxt) + s.slice(nxt + link.length);
}

writeFileSync(p, s);
console.log('changelog fixed; mySec removed =', i >= 0, '; dup link removed =', nxt >= 0);
