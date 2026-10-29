import fs from 'node:fs';
const p = 'js/data/storyQuests.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

// 修复模式：text: '...' 后直接换行接 action:/options: 而缺逗号
const badRe = /^(        text: '.*')\n(        (?:action|options):)/gm;
let count = 0;
s = s.replace(badRe, (_m, g1, g2) => { count++; return g1 + ',\n' + g2; });

if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log(`✓ 修复 ${count} 处缺失逗号`);
