import fs from 'node:fs';
const p = 'scratch/add_huoyan_dlg.mjs';
let s = fs.readFileSync(p, 'utf8');
const from = `push("        text: '猴哥，这"八戒"走路脚底板不着地——是牛魔王变的！'");`;
const to = `push("        text: '猴哥，那个八戒走路脚底板不着地——是牛魔王变的！'");`;
const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已修正嵌套引号');
