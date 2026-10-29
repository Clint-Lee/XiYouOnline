// 从 Opus 输出提取所有 "  <key>: {" 形式的对白对象，写入独立片段文件，便于人工/脚本校验后插入。
// 用法: node scratch/extract_keys.mjs <patchFile> <outFile> [keyPrefix]
import fs from 'node:fs';

const [, , patchFile, outFile, prefix = ''] = process.argv;
const text = fs.readFileSync(patchFile, 'utf8').replace(/\r\n/g, '\n');

// 收集所有顶格两空格的 "key: {" 起始位置
const startRe = /^  ([a-z][a-z0-9_]*):\s*\{$/gm;
const hits = [];
let m;
while ((m = startRe.exec(text)) !== null) {
  if (prefix && !m[1].startsWith(prefix)) continue;
  hits.push({ key: m[1], index: m.index, headerEnd: m.index + m[0].length });
}

if (!hits.length) {
  console.error(`未找到前缀为 "${prefix}" 的对白键`);
  process.exit(2);
}

// 从起始大括号开始做配对，找到对象结束
function extractObject(src, openBraceIndex) {
  let depth = 0;
  let inStr = null;
  for (let i = openBraceIndex; i < src.length; i++) {
    const ch = src[i];
    const prev = src[i - 1];
    if (inStr) {
      if (ch === inStr && prev !== '\\') inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return src.slice(openBraceIndex, i + 1);
    }
  }
  return null;
}

const parts = [];
const seen = new Set();
for (const h of hits) {
  if (seen.has(h.key)) continue;
  seen.add(h.key);
  const body = extractObject(text, h.headerEnd - 1);
  if (!body) { console.warn(`跳过 ${h.key}（括号不配对）`); continue; }
  parts.push(`  ${h.key}: ${body},`);
}

fs.writeFileSync(outFile, parts.join('\n\n') + '\n', 'utf8');
console.log(`✓ 提取 ${parts.length} 个对白键 -> ${outFile}`);
console.log('键名: ' + [...seen].join(', '));
