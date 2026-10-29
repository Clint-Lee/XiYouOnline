import fs from 'node:fs';
const p = 'js/data/maps2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

const fixes = [
  [`"id": "npc_pansi_oldwoman", "name": "指路老妇", "title": "【黎山故人】", "x": 640, "y": 640, "appearance": "stone_monkey", "icon": "👵", "dialogueKey": "pansi_oldwoman"`,
   `"id": "npc_pansi_oldwoman", "name": "指路老妇", "title": "【黎山故人】", "x": 640, "y": 640, "appearance": "stone_monkey", "icon": "👵", "dialogueKey": "pansi_poison_tea"`],
  // 解缚阶段入口：蜘蛛精 NPC 在 webbound 阶段应提供解缚对白
  [`"id": "npc_pansi_spider", "name": "盘丝七女妖", "title": "【濯垢泉边】", "x": 416, "y": 416, "appearance": "fox", "icon": "🕷️", "dialogueKey": "pansi_spring"`,
   `"id": "npc_pansi_spider", "name": "盘丝七女妖", "title": "【濯垢泉边】", "x": 416, "y": 416, "appearance": "fox", "icon": "🕷️", "dialogueKey": "pansi_unbind"`]
];
let n = 0;
for (const [from, to] of fixes) {
  const c = s.split(from).length - 1;
  if (c !== 1) { console.error(`✗ 匹配 ${c} 处`); continue; }
  s = s.replace(from, to); n++; console.log('✓ 已修正一个 dialogueKey');
}
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log(`共 ${n} 处`);
