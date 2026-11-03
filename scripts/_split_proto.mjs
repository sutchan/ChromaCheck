import fs from 'node:fs';
import path from 'node:path';
const D = 'e:/Github/ChromaCheck/prototype/assets/js';

// 提取顶层 `NAME = <balanced>;` 语句（支持 {} [] 嵌套）
function extractAssign(src, name) {
  const start = src.indexOf(name + ' = ');
  if (start < 0) return null;
  let i = start + name.length + 3; // skip ' = '
  const open = src[i];
  const close = { '[': ']', '{': '}' }[open];
  let depth = 0, inStr = false, esc = false, ch;
  for (; i < src.length; i++) {
    ch = src[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\') { esc = true; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === open) depth++;
    else if (ch === close) { depth--; if (depth === 0) { i++; break; } }
  }
  // include trailing ;
  while (i < src.length && src[i] === ';') i++;
  return { text: src.slice(start, i), end: i };
}

function removeRange(src, from, to) {
  return src.slice(0, from) + src.slice(to);
}

/* ---------- 1. data.js：把内容型块搬到 data-articles.js ---------- */
{
  const f = 'data.js';
  let src = fs.readFileSync(path.join(D, f), 'utf8');
  const blocks = ['CC.articles', 'CC.chapters', 'CC.titles', 'CC.dimScenes'];
  const out = [];
  for (const b of blocks) {
    const ex = extractAssign(src, b);
    if (!ex) { console.log('WARN 未命中', b); continue; }
    out.push(ex.text);
    // remove from src (keep one blank line)
    src = removeRange(src, src.lastIndexOf('\n', ex.start) + 1, ex.end);
    src = src.replace(/\n{3,}/g, '\n\n');
  }
  fs.writeFileSync(path.join(D, 'data-articles.js'),
    '/* prototype/assets/js/data-articles.js — 内容型数据（科普 / 章节 / 称号 / 维度场景），从 data.js 抽出 */\nwindow.CC = window.CC || {};\n\n' + out.join('\n\n') + '\n');
  fs.writeFileSync(path.join(D, f), src);
  console.log('data.js 切分完成，剩余行数', src.split('\n').length);
}

/* ---------- 2&3. 目录数组切分为两半（机械、安全） ---------- */
function splitCatalog(file, varName) {
  let src = fs.readFileSync(path.join(D, file), 'utf8');
  const ex = extractAssign(src, varName);
  if (!ex) { console.log('WARN 未命中', varName); return; }
  const inner = ex.text.slice(varName.length + 4, -1).trim(); // 去 `var X = [` 与 `]`
  // 按顶层元素切分：统计顶层逗号（depth 0 处的 ','）
  let depth = 0, inStr = false, esc = false, cuts = [], last = 0;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (c === ',' && depth === 0) { cuts.push(i); }
  }
  // 取靠近中点的切点
  const mid = cuts[Math.floor(cuts.length / 2)];
  const a = inner.slice(0, mid).trim();
  const b = inner.slice(mid + 1).trim();
  const gA = '__CAT_' + varName + '_A', gB = '__CAT_' + varName + '_B';
  fs.writeFileSync(path.join(D, file.replace('.js', '-1.js')),
    `/* ${file} 前半（自动切分） */\nwindow.${gA} = [\n${a}\n];\n`);
  fs.writeFileSync(path.join(D, file.replace('.js', '-2.js')),
    `/* ${file} 后半（自动切分） */\nwindow.${gB} = [\n${b}\n];\n`);
  // 重写主文件：拼接两段全局数组
  const head = src.slice(0, ex.start);
  const tail = src.slice(ex.end);
  const newSrc = head + `var ${varName} = (window.${gA} || []).concat(window.${gB} || []);` + tail;
  fs.writeFileSync(path.join(D, file), newSrc);
  console.log(file, '切分完成，主文件行数', newSrc.split('\n').length, '| A/B 行数',
    (a.split('\n').length + 2), (b.split('\n').length + 2));
}
splitCatalog('wireframes-catalog-base.js', 'BASE');
splitCatalog('wireframes-catalog-biz.js', 'BIZ');
console.log('done');
