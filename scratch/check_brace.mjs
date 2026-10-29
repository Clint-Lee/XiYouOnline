import fs from 'node:fs';
const t = fs.readFileSync('scratch/chedi_dlg.txt', 'utf8');
let d = 0, inStr = null, firstNeg = -1;
for (let i = 0; i < t.length; i++) {
  const ch = t[i], prev = t[i - 1];
  if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; continue; }
  if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
  if (ch === '{') d++;
  else if (ch === '}') { d--; if (d < 0 && firstNeg < 0) firstNeg = i; }
}
console.log('净深度:', d, '| 首次负值:', firstNeg);
console.log('总行数:', t.split('\n').length);
console.log('--- 末 6 行 ---');
console.log(t.split('\n').slice(-6).join('\n'));
console.log('--- 首 4 行 ---');
console.log(t.split('\n').slice(0, 4).join('\n'));
