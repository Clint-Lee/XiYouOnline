import fs from 'node:fs';
const t = fs.readFileSync('scratch/r_opus11.md', 'utf8').replace(/\r\n/g, '\n');
const re = /^###\s*FILE:\s*(\S+)\s*$/gm;
const marks = [];
let m;
while ((m = re.exec(t)) !== null) marks.push({ i: m.index, e: m.index + m[0].length });
console.log('块数:', marks.length);

const body = t.slice(marks[1].e, marks[2].i);
const sep = body.indexOf('=======');
const ne = body.indexOf('>>>>>>> NEW');
const newText = body.slice(sep + 7, ne).replace(/^\n/, '').replace(/\n+$/, '');
fs.writeFileSync('scratch/armor_methods.txt', newText + '\n', 'utf8');
console.log('方法组长度', newText.length, '行数', newText.split('\n').length);
console.log('--- 前 5 行 ---');
console.log(newText.split('\n').slice(0, 5).join('\n'));
