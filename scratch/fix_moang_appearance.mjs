import fs from 'node:fs';
const p = 'js/data/maps2d.js';
let s = fs.readFileSync(p, 'utf8');
const target = '"appearance": "dragon_king"';
const c = s.split(target).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(target, '"appearance": "longwang"');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 摩昂外观改为 longwang');
