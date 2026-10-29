// 重建第十八回狮驼岭地图：7.1% 窄缝 → 岭谷三级通路 (~39% 可行走)
// 保留：playerSpawn / 东西传送口 / 怪物 id 与巡逻设置；重排：tiles / npcs / 怪物落点避让
import fs from 'fs';

const FILE = 'js/data/maps2d.js';
const src = fs.readFileSync(FILE, 'utf8');

const W = 38, H = 28;
const grid = Array.from({ length: H }, () => Array(W).fill('mountain_rock'));
const carve = (x0, x1, y0, y1) => {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++)
    if (x >= 0 && x < W && y >= 0 && y < H) grid[y][x] = 'grass';
};
// 主岭道 (东西贯通，含两端传送口)
carve(1, 36, 11, 17);
// 北侧崖廊 / 南侧谷廊
carve(5, 31, 7, 9);
carve(6, 28, 19, 21);
// 连接缝
carve(8, 9, 10, 10); carve(20, 21, 10, 10); carve(28, 29, 10, 10);
carve(14, 15, 18, 18); carve(22, 23, 18, 18); carve(11, 12, 18, 18);
// 局部台地：青狮斗场 / 罗汉坪
carve(17, 23, 10, 10);
// 主道脊线铺土
for (let x = 1; x <= 36; x++) grid[14][x] = 'dirt_path';
grid[10][8] = 'dirt_path'; grid[10][9] = 'dirt_path';
grid[10][20] = 'dirt_path'; grid[10][21] = 'dirt_path';
grid[18][14] = 'dirt_path'; grid[18][15] = 'dirt_path';

const SOLID = new Set(['mountain_rock', 'water', 'city_wall', 'stone_wall', 'void', 'abyss',
  'demon_cave_wall', 'cloud_void', 'heaven_pillar', 'bamboo', 'dark_water', 'hut_wall',
  'palace_eaves', 'wooden_barricade', 'blacksmith_forge', 'ginseng_tree', 'purple_bamboo',
  'tang_palace', 'tang_store', 'stone_temple', 'two_realms_stele', 'lava', 'fire_wall']);
const walkable = (x, y) => x >= 0 && y >= 0 && x < W && y < H && !SOLID.has(grid[y][x]);

// 可行走比例校验 (章节测试要求 ≥35%)
let walk = 0;
for (const row of grid) for (const t of row) if (!SOLID.has(t)) walk++;
const ratio = walk / (W * H);
if (ratio < 0.38) { console.error(`可行走比例不足: ${(ratio * 100).toFixed(1)}%`); process.exit(1); }

// 连通性校验：从出生点必须能走到全部关键点
const keyTiles = {
  spawn: [34, 14], portalE: [36, 14], portalW: [1, 14],
  taibai: [26, 14], scout: [24, 13], qingshi: [20, 13], baixiang: [15, 15],
  nationGate: [11, 14], rulai: [8, 13], tangseng: [19, 15], westExit: [3, 14],
  mobEleph1: [11, 15], mobEleph2: [27, 14], mobEagle1: [12, 15], mobEagle2: [23, 15]
};
const sx = keyTiles.spawn[0], sy = keyTiles.spawn[1];
const seen = new Set([sx + ',' + sy]);
const q = [[sx, sy]];
while (q.length) {
  const [cx, cy] = q.shift();
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = cx + dx, ny = cy + dy, k = nx + ',' + ny;
    if (seen.has(k) || !walkable(nx, ny)) continue;
    seen.add(k); q.push([nx, ny]);
  }
}
for (const [name, [x, y]] of Object.entries(keyTiles)) {
  if (!walkable(x, y)) { console.error(`${name} 落在阻挡格 (${x},${y})`); process.exit(1); }
  if (!seen.has(x + ',' + y)) { console.error(`${name} 与出生点不连通 (${x},${y})`); process.exit(1); }
}

// 生成 tiles JSON (与现有 12 空格缩进一致：4 层)
const tilesJson = grid.map(row =>
  '      [\n' + row.map(t => '        "' + t + '"').join(',\n') + '\n      ]'
).join(',\n');

const npcsBlock = `    "npcs": [
      {
        "id": "npc_taibai_warning",
        "name": "太白金星 (化身报信)",
        "title": "【天仙显圣指点】",
        "x": 832,
        "y": 448,
        "appearance": "taibai",
        "icon": "⭐",
        "dialogueKey": "taibai_warning_talk"
      },
      {
        "id": "npc_shituo_xiaozuanfeng",
        "name": "小钻风",
        "title": "【巡山小妖】",
        "x": 768,
        "y": 416,
        "appearance": "stone_monkey",
        "icon": "🥁",
        "dialogueKey": "shituo_scout_talk"
      },
      {
        "id": "npc_shituo_qingshi",
        "name": "青狮大王",
        "title": "【狮驼洞大魔】",
        "x": 640,
        "y": 416,
        "appearance": "bull_demon",
        "icon": "🦁",
        "dialogueKey": "shituo_lion_gate"
      },
      {
        "id": "npc_shituo_baixiang",
        "name": "白象大王",
        "title": "【狮驼洞二魔】",
        "x": 480,
        "y": 480,
        "appearance": "yecha",
        "icon": "🐘",
        "dialogueKey": "shituo_elephant_ambush"
      },
      {
        "id": "npc_shituo_nation_gate",
        "name": "狮驼国城门",
        "title": "【妖雾锁城】",
        "x": 352,
        "y": 448,
        "appearance": "stone_monkey",
        "icon": "🌫️",
        "dialogueKey": "shituo_nation_grief"
      },
      {
        "id": "npc_shituo_rulai",
        "name": "如来佛祖",
        "title": "【灵山法驾亲临】",
        "x": 256,
        "y": 416,
        "appearance": "rulai",
        "icon": "☸️",
        "dialogueKey": "shituo_rulai_advent"
      },
      {
        "id": "npc_shituo_tangseng_rescued",
        "name": "唐三藏 (获救)",
        "title": "【金殿脱困】",
        "x": 608,
        "y": 480,
        "appearance": "tang_seng",
        "icon": "🧘",
        "dialogueKey": "shituo_aftercare"
      },
      {
        "id": "npc_shituo_west_exit",
        "name": "西行关口",
        "title": "【西去灵山】",
        "x": 96,
        "y": 448,
        "appearance": "stone_monkey",
        "icon": "🌄",
        "dialogueKey": "shituo_cleared_end"
      }
    ]`;

// 定位 shituoling 对象并整体替换其 tiles / npcs / monsters 坐标
const startMark = '  "shituoling": {';
const startIdx = src.indexOf(startMark);
if (startIdx < 0) { console.error('未找到 shituoling 对象'); process.exit(1); }
// 对象结束于匹配的 "  }," (下一顶层键之前)
const nextKey = src.indexOf('\n  "daleiyinsi": {', startIdx);
if (nextKey < 0) { console.error('未找到 shituoling 结束边界'); process.exit(1); }

// 旧对象中提取需保留字段
const oldBlock = src.slice(startIdx, nextKey);
const grab = (key) => {
  const m = oldBlock.match(new RegExp('"' + key + '":\\s*(\\{[\\s\\S]*?\\n\\s*\\})'));
  return m ? m[1].split('\n').map(l => l.replace(/^ {6}/, '    ')).join('\n') : null;
};
const playerSpawn = grab('playerSpawn');
if (!playerSpawn) { console.error('未提取到 playerSpawn'); process.exit(1); }

// portals 保持原样：从旧块截取
const portalsStart = oldBlock.indexOf('"portals": [');
const portalsEnd = oldBlock.lastIndexOf(']');
const portalsBlock = oldBlock.slice(portalsStart, portalsEnd + 1);

// monsters 保留 id/数值，仅重排落点避开 NPC (条目为无嵌套的严格 JSON)
const monsterCoords = {
  mob_st_eleph_1: [352, 480],
  mob_st_eleph_2: [864, 448],
  mob_st_eagle_1: [384, 480],
  mob_st_eagle_2: [736, 480]
};
const monsSrc = oldBlock.slice(oldBlock.indexOf('"monsters": ['), oldBlock.indexOf('"portals": ['));
const monsters = [];
for (const raw of monsSrc.match(/\{[^{}]*\}/g) || []) {
  if (!raw.includes('"mob_st_')) continue;
  const mob = JSON.parse(raw);
  if (!monsterCoords[mob.id]) { console.error('未知怪物 ' + mob.id); process.exit(1); }
  const [nx, ny] = monsterCoords[mob.id];
  mob.x = nx; mob.y = ny;
  const order = ['id', 'name', 'x', 'y', 'appearance', 'level', 'hp', 'maxHp', 'atk', 'def', 'spd', 'skills', 'patrolRadius'];
  const body = order.filter(k => mob[k] !== undefined)
    .map(k => '        "' + k + '": ' + JSON.stringify(mob[k]))
    .join(',\n');
  monsters.push('      {\n' + body + '\n      }');
}
if (monsters.length !== 4) { console.error('怪物条目数异常: ' + monsters.length); process.exit(1); }

const newBlock = `  "shituoling": {
    "id": "shituoling",
    "name": "八百里·狮驼岭·狮驼国",
    "region": "万妖聚窟绝命魔国",
    "width": 38,
    "height": 28,
    "tiles": [
${tilesJson}
    ],
    "playerSpawn": ${playerSpawn},
${npcsBlock},
    "monsters": [
${monsters.join(',\n')}
    ],
${portalsBlock}
  },`;

const out = src.slice(0, startIdx) + newBlock + src.slice(nextKey);
fs.writeFileSync(FILE, out);
console.log(`✅ 狮驼岭地图重建完成: 可行走 ${(ratio * 100).toFixed(1)}%, 连通校验全过, NPC 8 位`);
