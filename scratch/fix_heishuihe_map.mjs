import fs from 'node:fs';
const p = 'js/data/maps2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');
let n = 0;

const swap = (from, to, label) => {
  const c = s.split(from).length - 1;
  if (c !== 1) { console.error(`✗ ${label}: 匹配 ${c} 处`); return; }
  s = s.replace(from, to); n++; console.log(`✓ ${label}`);
};

// 1) 尺寸改 38x28（保持全局不变式）；同时把骨架压回 38x28 内
//    原骨架：西岸 x=3..13 / 旧庙 x=3..13,y=18..25 / 神府 x=23..36,y=8..21 / 东岸 x=29..38,y=24..27
//    38x28 时：东岸 x 上限改 37、神府 x 上限改 34、y 上限不超过 27
const k = s.indexOf('"heishuihe": {');
const k2 = s.indexOf('\n  },', k);
const before = s.slice(0, k);
let seg = s.slice(k, k2 + 4);

// 重算 tiles：38x28
const W = 38, H = 28;
const ROCK = 'mountain_rock', PATH = 'dirt_path';
const grid = Array.from({ length: H }, () => Array(W).fill(ROCK));
const carve = (x0, y0, x1, y1) => {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++)
    if (y >= 0 && y < H && x >= 0 && x < W) grid[y][x] = PATH;
};
carve(3, 4, 13, 13);    // 西岸渡口
carve(3, 17, 13, 24);   // 河神旧庙
carve(22, 8, 33, 20);   // 水下神府
carve(28, 23, 36, 26);  // 东岸出口区
carve(7, 12, 9, 19);    // 西侧连接道
carve(12, 6, 24, 8);    // 北侧连接道
carve(12, 21, 30, 23);  // 南侧连接道

const tilesText = grid.map(row => '      [\n' + row.map(t => `        "${t}"`).join(',\n') + '\n      ]').join(',\n');

// 重写 tiles 与尺寸
const tilesStart = seg.indexOf('"tiles": [');
const tilesOpen = seg.indexOf('[', tilesStart);
let depth = 0, inStr = null, tilesClose = -1;
for (let i = tilesOpen; i < seg.length; i++) {
  const ch = seg[i], prev = seg[i - 1];
  if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; continue; }
  if (ch === '"') { inStr = ch; continue; }
  if (ch === '[') depth++;
  else if (ch === ']') { depth--; if (depth === 0) { tilesClose = i; break; } }
}
seg = seg.slice(0, tilesOpen) + '[\n' + tilesText + '\n    ]' + seg.slice(tilesClose + 1);
seg = seg.replace('"width": 42', '"width": 38').replace('"height": 30', '"height": 28');

// 2) 外观替换为有专属渲染的身份
seg = seg.replace('"appearance": "fisherman"', '"appearance": "fisherman"');   // 保留（fisherman 有渲染）
seg = seg.replace(/"appearance": "shuiyao"[\s\S]*?"dialogueKey": "heishui_tuojie_challenge"/,
  '"appearance": "yecha",\n        "icon": "🐊",\n        "dialogueKey": "heishui_tuojie_challenge"');
seg = seg.replace(/"appearance": "xuanzang"[\s\S]*?"dialogueKey": "heishui_crossing_epilogue"/,
  '"appearance": "monk",\n        "icon": "🧘",\n        "dialogueKey": "heishui_crossing_epilogue"');

s = before + seg + s.slice(k2 + 4);
fs.writeFileSync(p, s, 'utf8');
console.log(`已重建 heishuihe（38x28）`);
