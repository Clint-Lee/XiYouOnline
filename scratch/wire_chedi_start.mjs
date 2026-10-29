import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes('this.ensureChediChapterStarted();')) { console.log('已接入'); process.exit(0); }

const from = '    this.ensureHeishuiChapterStarted();';
const c = s.split(from).length - 1;
if (c !== 1) { console.error(`锚点 ${c} 处`); process.exit(1); }
s = s.replace(from, from + '\n    this.ensureChediChapterStarted();');
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 章节起点已接入 loadMap');
