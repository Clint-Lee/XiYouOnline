// 从 Opus 输出中取出 NEW 块内容，插入到指定文件的指定行号之前。
// 用法: node scratch/insert_block.mjs <patchFile> <targetFile> <insertBeforeLine> [--dry]
// 若 patchFile 含多个块，用 --block N 选择第 N 块（1-based）。
import fs from 'node:fs';

const argv = process.argv.slice(2);
const patchFile = argv[0];
const targetFile = argv[1];
const lineArg = argv[2];
const dry = argv.includes('--dry');
const bi = argv.indexOf('--block');
const blockNo = bi !== -1 ? Number(argv[bi + 1]) : 1;

const text = fs.readFileSync(patchFile, 'utf8').replace(/\r\n/g, '\n');
const fileRe = /^###\s*FILE:\s*(\S+)\s*$/gm;
const marks = [];
let m;
while ((m = fileRe.exec(text)) !== null) marks.push({ index: m.index, end: m.index + m[0].length });

const blocks = [];
for (let i = 0; i < marks.length; i++) {
  const body = text.slice(marks[i].end, i + 1 < marks.length ? marks[i + 1].index : text.length);
  const sep = body.indexOf('=======');
  const newEnd = body.indexOf('>>>>>>> NEW');
  if (sep === -1 || newEnd === -1) continue;
  const newText = body.slice(sep + '======='.length, newEnd).replace(/^\n/, '').replace(/\n$/, '');
  const oldStart = body.indexOf('<<<<<<< OLD');
  const oldText = oldStart === -1 ? '' : body.slice(oldStart + '<<<<<<< OLD'.length, sep).replace(/^\n/, '').replace(/\n$/, '');
  blocks.push({ oldText, newText });
}

if (!blocks.length) {
  console.error('未解析到任何补丁块');
  process.exit(2);
}
const block = blocks[Math.min(blockNo, blocks.length) - 1];

// 若 NEW 块里包含了 OLD 片段（即整段替换型），只取"新增部分"：
// 做法是把 OLD 从 NEW 中剔除，得到纯增量文本。
let insertText = block.newText;
if (block.oldText && insertText.includes(block.oldText)) {
  insertText = insertText.replace(block.oldText, '').replace(/^\n+/, '').replace(/\n+$/, '');
  console.log('检测到整段替换型补丁，已自动提取增量部分');
}

if (!insertText.trim()) {
  console.error('增量内容为空，拒绝写入');
  process.exit(2);
}

const lines = fs.readFileSync(targetFile, 'utf8').split(/\r?\n/);
const at = Math.max(0, Math.min(lines.length, Number(lineArg) - 1));

if (dry) {
  console.log(`[dry] 将在 ${targetFile} 第 ${at + 1} 行前插入 ${insertText.split('\n').length} 行`);
  console.log('--- 预览前 6 行 ---');
  console.log(insertText.split('\n').slice(0, 6).join('\n'));
  process.exit(0);
}

const out = [...lines.slice(0, at), ...insertText.split('\n'), ...lines.slice(at)];
fs.writeFileSync(targetFile, out.join('\n'), 'utf8');
console.log(`✓ 已插入 ${insertText.split('\n').length} 行到 ${targetFile}:${at + 1}`);
