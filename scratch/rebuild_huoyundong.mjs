// 重建 huoyundong 地形：从"一条 77 格直线隧道"改为有层次的洞窟结构。
// 布局：西侧平顶山入口 → 枯松涧前庭(土地神) → 火云洞主洞 → 车阵祭坛(红孩儿) → 东侧纵深
// 保留：地图尺寸 38x28、出入口坐标、土地神坐标、原有瓦片种类。
import fs from 'node:fs';

const p = 'js/data/maps2d.js';
let s = fs.readFileSync(p, 'utf8');

const mapKey = '"huoyundong": {';
const kp = s.indexOf(mapKey);
if (kp < 0) { console.error('未找到 huoyundong'); process.exit(2); }

// 定位 tiles 数组
const tilesKey = '"tiles": [';
const tk = s.indexOf(tilesKey, kp);
if (tk < 0) { console.error('未找到 tiles'); process.exit(2); }

const W = 38, H = 28;
const ROCK = 'mountain_rock';
const PATH = 'dirt_path';
const WALL = 'demon_cave_wall';

// 全图填岩石
const grid = Array.from({ length: H }, () => Array(W).fill(ROCK));

const carve = (x0, y0, x1, y1, tile) => {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (y >= 0 && y < H && x >= 0 && x < W) grid[y][x] = tile;
    }
  }
};

// ── 枯松涧前庭（西侧）：从平顶山入口(32,448 → 格 1,14) 向右展开的天然谷地 ──
carve(1, 11, 11, 17, PATH);        // 前庭主体 11x7
carve(4, 8, 8, 10, PATH);          // 北侧枯松林
carve(4, 18, 8, 20, PATH);         // 南侧枯松林

// ── 涧道（前庭 → 主洞 的过渡窄道） ──
carve(12, 13, 14, 15, PATH);

// ── 火云洞主洞（中部）：洞窟大厅 ──
carve(15, 9, 24, 19, PATH);        // 主洞 10x11
// 洞壁描边（在主洞外圈加 demon_cave_wall，让"洞"有轮廓感）
for (let x = 14; x <= 25; x++) { grid[8][x] = WALL; grid[20][x] = WALL; }
for (let y = 8; y <= 20; y++) { grid[y][14] = WALL; grid[y][25] = WALL; }
// 但保留涧道与主洞的连通口
carve(12, 13, 15, 15, PATH);

// ── 车阵祭坛（东侧）：红孩儿布五行车的开阔场地，需比主洞更方正 ──
carve(26, 10, 34, 18, PATH);       // 祭坛 9x9
// 祭坛四角留岩石形成"车阵"视觉暗示
grid[10][26] = ROCK; grid[10][34] = ROCK;
grid[18][26] = ROCK; grid[18][34] = ROCK;

// ── 连接：主洞 → 祭坛 ──
carve(23, 13, 27, 15, PATH);

// ── 东侧纵深（通往破儿洞的入口在 (32,448) → 格 1,14？实际东侧出口需核对） ──
// 保留东端可通行，便于后续扩展
carve(35, 13, 37, 15, PATH);

// 校验：确保出生点(1088,448 → 格 34,14)与土地神(864,448 → 格 27,14)可站立
// 注意土地神在 864/32=27，属于祭坛区；出生点 1088/32=34，属祭坛东缘
// 两者都在 carve(26,10,34,18) 范围内 → 天然可站

// 生成 tiles 文本
const tilesText = grid.map(row => '      ' + row.map(t => `"${t}"`).join(', ') + '').join(',\n');

// 找到 tiles 数组的结束位置（配对的 ']'）
let depth = 0, i = tk + tilesKey.length - 1, endIdx = -1;
for (; i < s.length; i++) {
  const c = s[i];
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { endIdx = i; break; } }
}
if (endIdx < 0) { console.error('tiles 数组未闭合'); process.exit(2); }

s = s.slice(0, tk + tilesKey.length) + '\n' + tilesText + '\n    ' + s.slice(endIdx);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已重建 huoyundong 地形');
