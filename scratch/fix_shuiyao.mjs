import fs from 'node:fs';
const p = 'js/data/maps2d.js';
let s = fs.readFileSync(p, 'utf8');
// shuiyao 无渲染分支，换成有分支的 yecha
const c = s.split('"appearance": "shuiyao"').length - 1;
if (c < 1) { console.log('无 shuiyao 需替换'); process.exit(0); }
s = s.replace(/"appearance": "shuiyao"/g, '"appearance": "yecha"');
fs.writeFileSync(p, s, 'utf8');
console.log(`✓ 已替换 ${c} 处 shuiyao → yecha`);
