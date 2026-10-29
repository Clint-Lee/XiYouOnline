import fs from 'node:fs';
const p = 'js/data/maps2d.js';
let s = fs.readFileSync(p, 'utf8');

const W = 38, H = 28;
const ROCK = 'mountain_rock', PATH = 'dirt_path', LAVA = 'lava';
const grid = Array.from({ length: H }, () => Array(W).fill(ROCK));
const carve = (x0, y0, x1, y1, t = PATH) => {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++)
    if (y >= 0 && y < H && x >= 0 && x < W) grid[y][x] = t;
};

// Astra 连通骨架（三块两两通过中央通路相连）
carve(2, 13, 35, 18);    // 中央横向通路
carve(6, 3, 11, 24);     // 西侧纵向通路（休整地+芭蕉洞）
carve(25, 3, 30, 24);    // 东侧纵向通路（摩云台）

// 分区微调：洞前广场、试扇台周边、火根台周边
carve(12, 5, 16, 12);    // 芭蕉洞前广场
carve(17, 11, 22, 14);   // 试扇火口
carve(17, 15, 22, 20);   // 火根/断根坛
carve(31, 5, 34, 10);    // 摩云台

// 烈焰装饰（不可走，中央大块）
carve(14, 21, 22, 26, LAVA);
carve(31, 12, 36, 22, LAVA);
carve(2, 3, 5, 5, LAVA);

// 熄火前铺 lava 焦土感：把骨架外的少量岩石换成焦土色（仍不可走）
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (grid[y][x] === ROCK) grid[y][x] = 'ash_ground';
}

const tilesText = grid.map(row => '      [\n' + row.map(t => `        "${t}"`).join(',\n') + '\n      ]').join(',\n');

// 统计
let walk = 0;
for (const row of grid) for (const t of row) if (t === PATH) walk++;
console.log(`可行走: ${walk}/${W * H} (${(walk / (W * H) * 100).toFixed(1)}%)`);

const T = 32;
const mapObj = `  "huoyanshan": {
    "id": "huoyanshan",
    "name": "八百里·火焰山·芭蕉洞",
    "region": "西行路·火焰山",
    "width": ${W},
    "height": ${H},
    "tiles": [
${tilesText}
    ],
    "playerSpawn": { "x": ${8 * T}, "y": ${24 * T}, "direction": "up" },
    "npcs": [
      { "id": "npc_huoyan_villager", "name": "灾民代表", "title": "【火焰山灾民】", "x": ${6 * T}, "y": ${21 * T}, "appearance": "stone_monkey", "icon": "🧑‍🌾", "dialogueKey": "huoyan_appeal" },
      { "id": "npc_huoyan_land", "name": "火焰山土地", "title": "【本境土地】", "x": ${12 * T}, "y": ${20 * T}, "appearance": "tudi_gong", "icon": "👴", "dialogueKey": "huoyan_land_talk" },
      { "id": "npc_huoyan_princess", "name": "铁扇公主", "title": "【翠云山芭蕉洞】", "x": ${12 * T}, "y": ${5 * T}, "appearance": "tieshan", "icon": "👸", "dialogueKey": "huoyan_borrow_fan" },
      { "id": "npc_huoyan_bull_king", "name": "牛魔王", "title": "【摩云洞平天大圣】", "x": ${24 * T}, "y": ${6 * T}, "appearance": "bull_demon", "icon": "🐂", "dialogueKey": "huoyan_bull_encounter" },
      { "id": "npc_huoyan_fan_trial", "name": "试扇火口", "title": "【隔离试扇台】", "x": ${19 * T}, "y": ${13 * T}, "appearance": "shrimp", "icon": "🔥", "dialogueKey": "huoyan_test_fan" },
      { "id": "npc_huoyan_fire_root", "name": "火根台", "title": "【断绝火根】", "x": ${19 * T}, "y": ${18 * T}, "appearance": "shrimp", "icon": "🪨", "dialogueKey": "huoyan_quench_fire" }
    ],
    "monsters": [
      { "id": "mob_hy_demon_1", "name": "火焰山焰魔", "appearance": "shuiyao", "x": ${17 * T}, "y": ${11 * T}, "level": 66, "hp": 16000, "maxHp": 16000, "atk": 420, "def": 210, "spd": 46, "skills": ["三昧真火"] },
      { "id": "mob_hy_demon_2", "name": "焦土焰卒", "appearance": "shuiyao", "x": ${23 * T}, "y": ${15 * T}, "level": 64, "hp": 14000, "maxHp": 14000, "atk": 400, "def": 200, "spd": 44, "skills": ["连击"] }
    ],
    "portals": [
      { "x": ${7 * T}, "y": ${24 * T}, "targetMap": "tongtianhe", "targetX": ${34 * T}, "targetY": ${14 * T}, "name": "回通天河" },
      { "x": ${29 * T}, "y": ${3 * T}, "targetMap": "pansidong", "targetX": ${34 * T}, "targetY": ${14 * T}, "name": "西行·盘丝洞方向" }
    ]
  },`;

// 替换整个 huoyanshan 对象
const k = s.indexOf('"huoyanshan": {');
if (k < 0) { console.error('未找到 huoyanshan'); process.exit(1); }
const objStart = s.indexOf('{', k);
let depth = 0, inStr = null, objEnd = -1;
for (let i = objStart; i < s.length; i++) {
  const ch = s[i], prev = s[i - 1];
  if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; continue; }
  if (ch === '"') { inStr = ch; continue; }
  if (ch === '{') depth++;
  else if (ch === '}') { depth--; if (depth === 0) { objEnd = i; break; } }
}
const lineStart = s.lastIndexOf('\n', k) + 1;
const afterEnd = s.indexOf('\n', objEnd);
s = s.slice(0, lineStart) + mapObj + s.slice(afterEnd);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已重建 huoyanshan 地形');
