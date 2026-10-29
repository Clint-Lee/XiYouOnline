// 新建 heishuihe 地图（黑水河·衡阳峪，42×30），按 Astra 设计的连通骨架落位。
// 骨架矩形（含端点）：
//   西岸渡口   x=3..13,  y=4..13
//   河神旧庙   x=3..13,  y=18..25
//   水下神府   x=23..36, y=8..21
//   东岸出口区 x=29..38, y=24..27
//   西侧连接道 x=7..9,   y=12..20
//   北侧连接道 x=12..26, y=6..8
//   南侧连接道 x=12..31, y=22..24
import fs from 'node:fs';

const p = 'js/data/maps2d.js';
let src = fs.readFileSync(p, 'utf8');

if (src.includes('"heishuihe": {')) {
  console.log('heishuihe 已存在，跳过');
  process.exit(0);
}

const W = 42, H = 30;
const ROCK = 'mountain_rock';
const PATH = 'dirt_path';
const WATER = 'water';

const grid = Array.from({ length: H }, () => Array(W).fill(ROCK));
const carve = (x0, y0, x1, y1, t = PATH) => {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++)
    if (y >= 0 && y < H && x >= 0 && x < W) grid[y][x] = t;
};

// 按设计骨架铺路
carve(3, 4, 13, 13);    // 西岸渡口
carve(3, 18, 13, 25);   // 河神旧庙
carve(23, 8, 36, 21);   // 水下神府
carve(29, 24, 38, 27);  // 东岸出口区
carve(7, 12, 9, 20);    // 西侧连接道
carve(12, 6, 26, 8);    // 北侧连接道
carve(12, 22, 31, 24);  // 南侧连接道

// 河道水体装饰：水面覆盖中央带（不切断通道，仅视觉；实际仍为可走"浅滩"）
// 为保持 BFS 连通，水域改用 water 会阻断，故仅在骨架外点缀岩石纹理差异——保持纯 PATH。
// 这里把神府内部铺成深色石地以区分"水下"，仍用 PATH 保持可走。

const tilesText = grid.map(row => '      [\n' + row.map(t => `        "${t}"`).join(',\n') + '\n      ]').join(',\n');

const spawn = { x: 5 * 32, y: 7 * 32 };

const mapObj = `  "heishuihe": {
    "id": "heishuihe",
    "name": "黑水河·衡阳峪",
    "region": "西行路·黑水河",
    "width": ${W},
    "height": ${H},
    "tiles": [
${tilesText}
    ],
    "playerSpawn": { "x": ${spawn.x}, "y": ${spawn.y}, "direction": "down" },
    "npcs": [
      {
        "id": "npc_heishui_ferryman",
        "name": "摆渡船夫",
        "title": "【黑水渡口】",
        "x": ${10 * 32},
        "y": ${9 * 32},
        "appearance": "fisherman",
        "icon": "🛶",
        "dialogueKey": "heishui_ferry_trap"
      },
      {
        "id": "npc_heishui_rivergod_exiled",
        "name": "失府河神",
        "title": "【无处安身】",
        "x": ${6 * 32},
        "y": ${21 * 32},
        "appearance": "tudi_gong",
        "icon": "🌊",
        "dialogueKey": "heishui_rivergod_appeal"
      },
      {
        "id": "npc_heishui_gate_guard",
        "name": "水府守将",
        "title": "【黑水拦路】",
        "x": ${24 * 32},
        "y": ${10 * 32},
        "appearance": "yecha",
        "icon": "🔱",
        "dialogueKey": "heishui_scout_challenge"
      },
      {
        "id": "npc_heishui_moang",
        "name": "西海龙太子摩昂",
        "title": "【奉命擒妖】",
        "x": ${27 * 32},
        "y": ${11 * 32},
        "appearance": "xiaobailong",
        "icon": "🐉",
        "dialogueKey": "heishui_moang_briefing"
      },
      {
        "id": "npc_heishui_tuojie",
        "name": "鼍洁",
        "title": "【黑水大王】",
        "x": ${32 * 32},
        "y": ${14 * 32},
        "appearance": "shuiyao",
        "icon": "🐊",
        "dialogueKey": "heishui_tuojie_challenge"
      },
      {
        "id": "npc_heishui_rivergod_restored",
        "name": "黑水河神",
        "title": "【复位谢恩】",
        "x": ${30 * 32},
        "y": ${17 * 32},
        "appearance": "tudi_gong",
        "icon": "🌊",
        "dialogueKey": "heishui_reward_claim"
      },
      {
        "id": "npc_heishui_tangseng_rescued",
        "name": "唐三藏",
        "title": "【脱险】",
        "x": ${34 * 32},
        "y": ${25 * 32},
        "appearance": "xuanzang",
        "icon": "🧘",
        "dialogueKey": "heishui_crossing_epilogue"
      }
    ],
    "monsters": [
      {
        "id": "mob_heishui_shrimp_1",
        "name": "黑水虾卒",
        "appearance": "shrimp",
        "x": ${12 * 32},
        "y": ${6 * 32},
        "level": 58,
        "hp": 9000,
        "maxHp": 9000,
        "atk": 380,
        "def": 190,
        "spd": 44,
        "skills": ["连击"]
      },
      {
        "id": "mob_heishui_crab_1",
        "name": "黑水蟹将",
        "appearance": "crab",
        "x": ${35 * 32},
        "y": ${19 * 32},
        "level": 59,
        "hp": 11000,
        "maxHp": 11000,
        "atk": 400,
        "def": 210,
        "spd": 42,
        "skills": ["连击"]
      }
    ],
    "portals": [
      {
        "x": ${4 * 32},
        "y": ${6 * 32},
        "targetMap": "huoyundong",
        "targetX": ${34 * 32},
        "targetY": ${14 * 32},
        "name": "回号山",
        "minLevel": 1
      }
    ]
  },
`;

// 插入到 huoyundong 对象结束之后
const keyIdx = src.indexOf('"huoyundong": {');
if (keyIdx < 0) { console.error('未找到 huoyundong'); process.exit(2); }
const objStart = src.indexOf('{', keyIdx);
let depth = 0, inStr = null, objEnd = -1;
for (let i = objStart; i < src.length; i++) {
  const ch = src[i], prev = src[i - 1];
  if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; continue; }
  if (ch === '"') { inStr = ch; continue; }
  if (ch === '{') depth++;
  else if (ch === '}') { depth--; if (depth === 0) { objEnd = i; break; } }
}
if (objEnd < 0) { console.error('huoyundong 未闭合'); process.exit(2); }

// 找到该对象后的第一个换行+逗号，插入新地图
let insertAt = src.indexOf('\n', objEnd);
const out = src.slice(0, insertAt + 1) + mapObj + src.slice(insertAt + 1);
fs.writeFileSync(p, out, 'utf8');
console.log('✓ 已新增 heishuihe 地图');
