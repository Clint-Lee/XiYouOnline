import fs from 'node:fs';
const p = 'js/data/maps2d.js';
let s = fs.readFileSync(p, 'utf8');

const mapKey = '"huoyundong": {';
const kp = s.indexOf(mapKey);
const tilesKey = '"tiles": [';
const tk = s.indexOf(tilesKey, kp);
if (kp < 0 || tk < 0) { console.error('定位失败'); process.exit(2); }

const W = 38, H = 28;
const ROCK = 'mountain_rock', PATH = 'dirt_path', WALL = 'demon_cave_wall';
const grid = Array.from({ length: H }, () => Array(W).fill(ROCK));
const carve = (x0, y0, x1, y1, t) => {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++)
    if (y >= 0 && y < H && x >= 0 && x < W) grid[y][x] = t;
};

// 关键实体的实际格子坐标（坐标/32）：
//   破儿洞出口 (32,448)    -> 格 (1,14)
//   土地神     (864,448)   -> 格 (27,14)
//   出生点     (1088,448)  -> 格 (34,14)
//   平顶山出口 (1152,448)  -> 格 (36,14)
//   炎兵1      (352,448)   -> 格 (11,14)
//   炎兵2      (832,448)   -> 格 (26,14)
//   精灵2      (736,480)   -> 格 (23,15)

// 1) 西侧前庭（格 1 起）：承接破儿洞出口与枯松林
carve(1, 10, 14, 18, PATH);
carve(4, 7, 9, 9, PATH);      // 北侧枯松林
carve(4, 19, 9, 21, PATH);    // 南侧枯松林

// 2) 涧道：前庭 → 主洞
carve(15, 12, 18, 16, PATH);

// 3) 火云洞主洞：覆盖炎兵1(11,14)/精灵2(23,15) 一带
carve(10, 11, 25, 19, PATH);

// 4) 主洞 → 祭坛连接
carve(24, 12, 28, 16, PATH);

// 5) 车阵祭坛：必须覆盖土地神(27,14)、炎兵2(26,14)、出生点(34,14)、平顶山出口(36,14)
carve(25, 9, 37, 19, PATH);

// 6) 洞壁轮廓（仅在外围点缀，不切断通路）
for (let x = 9; x <= 26; x++) { grid[10][x] = WALL; grid[20][x] = WALL; }
for (let y = 10; y <= 20; y++) { grid[y][9] = WALL; grid[y][26] = WALL; }
// 重新打通主洞与涧道
carve(14, 13, 16, 15, PATH);
carve(25, 13, 28, 15, PATH);

// 7) 祭坛四角岩石点出"五行车"意象，但不挡任何实体
grid[9][25] = ROCK; grid[9][37] = ROCK;
grid[19][25] = ROCK; grid[19][37] = ROCK;

const tilesText = grid.map(row => '      ' + row.map(t => `"${t}"`).join(', ')).join(',\n');
let depth = 0, i = tk + tilesKey.length - 1, endIdx = -1;
for (; i < s.length; i++) {
  const c = s[i];
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { endIdx = i; break; } }
}
s = s.slice(0, tk + tilesKey.length) + '\n' + tilesText + '\n    ' + s.slice(endIdx);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已重建 huoyundong 地形（按真实格坐标）');
