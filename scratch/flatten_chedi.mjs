import fs from 'node:fs';

// 把 Opus 输出的 "部分1" 转成 STORY_DIALOGUES 可直接使用的键值对序列。
// Opus 输出形如：  [ { chedi_monk_appeal: {...}, chedi_royal_terms: {...}, ... } ]
// 或顶层就散着 key: {...}, key: {...}
const src = fs.readFileSync('scratch/chedi_dlg.txt', 'utf8');

// 去掉注释行
const noComments = src.split('\n').filter(l => !l.trim().startsWith('//')).join('\n');

// 提取所有顶层 "  key: {" 起始
const re = /^  ([a-z][a-z0-9_]*):\s*\{$/gm;
const hits = [];
let m;
while ((m = re.exec(noComments)) !== null) hits.push({ key: m[1], start: m.index, braceAt: m.index + m[0].length - 1 });

function extractObj(text, openBrace) {
  let depth = 0, inStr = null;
  for (let i = openBrace; i < text.length; i++) {
    const ch = text[i], prev = text[i - 1];
    if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) return text.slice(openBrace, i + 1); }
  }
  return null;
}

const parts = [];
for (const h of hits) {
  const body = extractObj(noComments, h.braceAt);
  if (!body) { console.error(`跳过 ${h.key}（括号不配对）`); continue; }
  parts.push(`  ${h.key}: ${body},`);
}

fs.writeFileSync('scratch/chedi_dlg_flat.txt', parts.join('\n\n') + '\n', 'utf8');
console.log(`✓ 提取 ${parts.length} 个对白键`);
console.log('键名: ' + hits.map(h => h.key).join(', '));
