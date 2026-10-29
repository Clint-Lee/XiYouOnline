import fs from 'node:fs';
const p = 'js/data/maps2d.js';
let s = fs.readFileSync(p, 'utf8');

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

const T = 32;
const mapObj = `  "heishuihe": {
    "id": "heishuihe",
    "name": "黑水河·衡阳峪",
    "region": "西行路·黑水河",
    "width": ${W},
    "height": ${H},
    "tiles": [
${tilesText}
    ],
    "playerSpawn": { "x": ${5 * T}, "y": ${7 * T}, "direction": "down" },
    "npcs": [
      { "id": "npc_heishui_ferryman", "name": "摆渡船夫", "title": "【黑水渡口】", "x": ${10 * T}, "y": ${9 * T}, "appearance": "fisherman", "icon": "🛶", "dialogueKey": "heishui_ferry_trap" },
      { "id": "npc_heishui_rivergod_exiled", "name": "失府河神", "title": "【无处安身】", "x": ${6 * T}, "y": ${20 * T}, "appearance": "tudi_gong", "icon": "🌊", "dialogueKey": "heishui_rivergod_appeal" },
      { "id": "npc_heishui_gate_guard", "name": "水府守将", "title": "【黑水拦路】", "x": ${23 * T}, "y": ${10 * T}, "appearance": "yecha", "icon": "🔱", "dialogueKey": "heishui_scout_challenge" },
      { "id": "npc_heishui_moang", "name": "西海龙太子摩昂", "title": "【奉命擒妖】", "x": ${26 * T}, "y": ${11 * T}, "appearance": "dragon_king", "icon": "🐉", "dialogueKey": "heishui_moang_briefing" },
      { "id": "npc_heishui_tuojie", "name": "鼍洁", "title": "【黑水大王】", "x": ${31 * T}, "y": ${14 * T}, "appearance": "yecha", "icon": "🐊", "dialogueKey": "heishui_tuojie_challenge" },
      { "id": "npc_heishui_rivergod_restored", "name": "黑水河神", "title": "【复位谢恩】", "x": ${29 * T}, "y": ${17 * T}, "appearance": "tudi_gong", "icon": "🌊", "dialogueKey": "heishui_reward_claim" },
      { "id": "npc_heishui_tangseng_rescued", "name": "唐三藏", "title": "【脱险】", "x": ${33 * T}, "y": ${24 * T}, "appearance": "stone_monkey", "icon": "🧘", "dialogueKey": "heishui_crossing_epilogue" }
    ],
    "monsters": [
      { "id": "mob_heishui_shrimp_1", "name": "黑水虾卒", "appearance": "shrimp", "x": ${12 * T}, "y": ${6 * T}, "level": 58, "hp": 9000, "maxHp": 9000, "atk": 380, "def": 190, "spd": 44, "skills": ["连击"] },
      { "id": "mob_heishui_crab_1", "name": "黑水蟹将", "appearance": "crab", "x": ${32 * T}, "y": ${19 * T}, "level": 59, "hp": 11000, "maxHp": 11000, "atk": 400, "def": 210, "spd": 42, "skills": ["连击"] }
    ],
    "portals": [
      { "x": ${4 * T}, "y": ${6 * T}, "targetMap": "huoyundong", "targetX": ${34 * T}, "targetY": ${14 * T}, "name": "回号山" }
    ]
  },`;

// 替换整个 heishuihe 对象
const k = s.indexOf('"heishuihe": {');
if (k < 0) { console.error('未找到 heishuihe'); process.exit(1); }
const objStart = s.indexOf('{', k);
let depth = 0, inStr = null, objEnd = -1;
for (let i = objStart; i < s.length; i++) {
  const ch = s[i], prev = s[i - 1];
  if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; continue; }
  if (ch === '"') { inStr = ch; continue; }
  if (ch === '{') depth++;
  else if (ch === '}') { depth--; if (depth === 0) { objEnd = i; break; } }
}
// 连同前面的 key 与后面的逗号一起替换
const lineStart = s.lastIndexOf('\n', k) + 1;
const afterEnd = s.indexOf('\n', objEnd);
s = s.slice(0, lineStart) + mapObj + s.slice(afterEnd);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已重建 heishuihe（38x28，外观全部有专属渲染）');
