import fs from 'node:fs';

// 只应用指定块号的补丁
const patchFile = process.argv[2];
const wantBlocks = process.argv.slice(3).map(Number);
const text = fs.readFileSync(patchFile, 'utf8').replace(/\r\n/g, '\n');

const re = /^###\s*FILE:\s*(\S+)\s*$/gm;
const marks = [];
let m;
while ((m = re.exec(text)) !== null) marks.push({ file: m[1], i: m.index, e: m.index + m[0].length });

const blocks = [];
for (let k = 0; k < marks.length; k++) {
  const body = text.slice(marks[k].e, k + 1 < marks.length ? marks[k + 1].i : text.length);
  const oldStart = body.indexOf('<<<<<<< OLD');
  const sep = body.indexOf('=======');
  const newEnd = body.indexOf('>>>>>>> NEW');
  if (oldStart < 0 || sep < 0 || newEnd < 0) continue;
  blocks.push({
    no: k + 1,
    file: marks[k].file,
    oldText: body.slice(oldStart + 11, sep).replace(/^\n/, '').replace(/\n$/, ''),
    newText: body.slice(sep + 7, newEnd).replace(/^\n/, '').replace(/\n$/, '')
  });
}

let applied = 0;
for (const b of blocks) {
  if (!wantBlocks.includes(b.no)) continue;
  const src = fs.readFileSync(b.file, 'utf8').replace(/\r\n/g, '\n');
  const c = src.split(b.oldText).length - 1;
  if (c !== 1) { console.error(`✗ 块${b.no} ${b.file}: 匹配 ${c} 处`); continue; }
  fs.writeFileSync(b.file, src.replace(b.oldText, b.newText), 'utf8');
  console.log(`✓ 块${b.no} ${b.file} 已应用`);
  applied++;
}
console.log(`\n应用 ${applied} 块`);
