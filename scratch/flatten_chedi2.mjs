import fs from 'node:fs';
const src = fs.readFileSync('scratch/chedi_dlg.txt', 'utf8');
const noComments = src.split('\n').filter(l => !l.trim().startsWith('//')).join('\n');

// 顶层键可能是 0 空格或 2 空格缩进
const re = /^ ?([a-z][a-z0-9_]*):\s*\{$/gm;
const hits = [];
let m;
while ((m = re.exec(noComments)) !== null) hits.push({ key: m[1], braceAt: m.index + m[0].length - 1 });

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
const seen = new Set();
for (const h of hits) {
  if (seen.has(h.key)) continue;
  seen.add(h.key);
  const body = extractObj(noComments, h.braceAt);
  if (!body) { console.error(`跳过 ${h.key}`); continue; }
  parts.push(`  ${h.key}: ${body},`);
}

fs.writeFileSync('scratch/chedi_dlg_flat.txt', parts.join('\n\n') + '\n', 'utf8');
console.log(`提取 ${parts.length} 键: ` + [...seen].join(', '));
