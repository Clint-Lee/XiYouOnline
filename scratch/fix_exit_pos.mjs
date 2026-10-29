import fs from 'node:fs';
const p = 'js/data/maps2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

// 西行出口改到 (35,14) 即 1120,448 —— 与传送门 (1152,448) 错开一格，仍可通行
const from = `"id": "npc_pansi_west_exit", "name": "西行关口", "title": "【西去路】", "x": 1152, "y": 448,`;
const to = `"id": "npc_pansi_west_exit", "name": "西行关口", "title": "【西去路】", "x": 1056, "y": 480,`;
const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 西行出口坐标已错开');
