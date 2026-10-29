// 自动解析 Opus 输出里的 "### FILE / <<<<<<< OLD / ======= / >>>>>>> NEW" 补丁块并逐块应用。
// 用法: node scratch/apply_patch.mjs <patchFile> [--dry]
import fs from 'node:fs';
import path from 'node:path';

const [, , patchFile, ...flags] = process.argv;
const dry = flags.includes('--dry');
const ROOT = process.cwd();

const text = fs.readFileSync(patchFile, 'utf8').replace(/\r\n/g, '\n');

// 按 "### FILE: xxx" 切块
const blocks = [];
const fileRe = /^###\s*FILE:\s*(\S+)\s*$/gm;
const marks = [];
let m;
while ((m = fileRe.exec(text)) !== null) {
  marks.push({ file: m[1].trim(), index: m.index, end: m.index + m[0].length });
}
if (!marks.length) {
  console.error('未找到任何 ### FILE: 标记');
  process.exit(2);
}

for (let i = 0; i < marks.length; i++) {
  const body = text.slice(marks[i].end, i + 1 < marks.length ? marks[i + 1].index : text.length);
  const oldStart = body.indexOf('<<<<<<< OLD');
  const sep = body.indexOf('=======');
  const newEnd = body.indexOf('>>>>>>> NEW');
  if (oldStart === -1 || sep === -1 || newEnd === -1 || !(oldStart < sep && sep < newEnd)) {
    console.error(`块 ${i + 1} (${marks[i].file}) 标记不完整，跳过`);
    continue;
  }
  const oldText = body.slice(oldStart + '<<<<<<< OLD'.length, sep).replace(/^\n/, '').replace(/\n$/, '');
  const newText = body.slice(sep + '======='.length, newEnd).replace(/^\n/, '').replace(/\n$/, '');
  blocks.push({ file: marks[i].file, oldText, newText });
}

let applied = 0;
let failed = 0;
for (const b of blocks) {
  const abs = path.resolve(ROOT, b.file);
  if (!fs.existsSync(abs)) {
    console.error(`✗ 文件不存在: ${b.file}`);
    failed++;
    continue;
  }
  const src = fs.readFileSync(abs, 'utf8').replace(/\r\n/g, '\n');
  const count = src.split(b.oldText).length - 1;
  if (count === 0) {
    console.error(`✗ ${b.file}: OLD 片段未匹配到（可能已应用或格式有差异）`);
    failed++;
    continue;
  }
  if (count > 1) {
    console.error(`✗ ${b.file}: OLD 片段匹配到 ${count} 处，不唯一，拒绝应用`);
    failed++;
    continue;
  }
  if (dry) {
    console.log(`✓ [dry] ${b.file}: 可唯一匹配，将替换 ${b.oldText.length} -> ${b.newText.length} 字符`);
    applied++;
    continue;
  }
  const replaced = src.replace(b.oldText, b.newText);
  fs.writeFileSync(abs, replaced, 'utf8');
  console.log(`✓ ${b.file}: 已应用 (${b.oldText.length} -> ${b.newText.length} 字符)`);
  applied++;
}

console.log(`\n合计: 应用 ${applied} 块，失败 ${failed} 块`);
process.exit(failed > 0 ? 1 : 0);
