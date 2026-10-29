// 安全重建 huoyundong 地形：精确定位 huoyundong 对象内 "tiles" 数组的字符区间。
// 关键：先找到 huoyundong 对象本身的闭合位置，只在那个范围内找 tiles，避免扫到别的对象。
import fs from 'node:fs';

const p = 'js/data/maps2d.js';
const src = fs.readFileSync(p, 'utf8');

// 1) 定位 huoyundong 对象的起始 '{'
const keyIdx = src.indexOf('"huoyundong": {');
if (keyIdx < 0) { console.error('未找到 huoyundong'); process.exit(2); }
const objStart = src.indexOf('{', keyIdx);

// 2) 从 objStart 做括号配对，找到该对象的结束 '}'
function matchBrace(s, openIdx) {
  let depth = 0, inStr = null;
  for (let i = openIdx; i < s.length; i++) {
    const ch = s[i], prev = s[i - 1];
    if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; continue; }
    if (ch === '"' || ch === "'") { inStr = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) return i; }
  }
  return -1;
}
const objEnd = matchBrace(src, objStart);
if (objEnd < 0) { console.error('huoyundong 对象未闭合'); process.exit(2); }
console.log(`huoyundong 对象区间: ${objStart}..${objEnd}`);

// 3) 只在这个区间内找 "tiles": [
const region = src.slice(objStart, objEnd);
const tRel = region.indexOf('"tiles": [');
if (tRel < 0) { console.error('对象内未找到 tiles'); process.exit(2); }
const tAbs = objStart + tRel;
const arrOpen = src.indexOf('[', tAbs);

// 4) 从 arrOpen 做方括号配对（同样要跳过字符串）
function matchBracket(s, openIdx) {
  let depth = 0, inStr = null;
  for (let i = openIdx; i < s.length; i++) {
    const ch = s[i], prev = s[i - 1];
    if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; continue; }
    if (ch === '"' || ch === "'") { inStr = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) return i; }
  }
  return -1;
}
const arrClose = matchBracket(src, arrOpen);
if (arrClose < 0) { console.error('tiles 数组未闭合'); process.exit(2); }
console.log(`tiles 数组区间: ${arrOpen}..${arrClose}`);

const oldArr = src.slice(arrOpen, arrClose + 1);
const oldRows = (oldArr.match(/\[/g) || []).length - 1;
console.log(`原 tiles 行数(约): ${oldRows}`);

// 5) 构建新地形
const W = 38, H = 28;
const ROCK = 'mountain_rock', PATH = 'dirt_path', WALL = 'demon_cave_wall';
const grid = Array.from({ length: H }, () => Array(W).fill(ROCK));
const carve = (x0, y0, x1, y1, t) => {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++)
    if (y >= 0 && y < H && x >= 0 && x < W) grid[y][x] = t;
};

// 实体格坐标：破儿洞(1,14) 炎兵1(11,14) 精灵2(23,15) 炎兵2(26,14) 土地神(27,14) 出生(34,14) 平顶山(36,14)
carve(1, 10, 14, 18, PATH);       // 枯松涧前庭
carve(4, 7, 9, 9, PATH);          // 北侧枯松林
carve(4, 19, 9, 21, PATH);        // 南侧枯松林
carve(14, 12, 18, 16, PATH);      // 涧道
carve(10, 11, 25, 19, PATH);      // 火云洞主洞
carve(25, 9, 37, 19, PATH);       // 车阵祭坛（含土地神/出生点/平顶山出口）

// 洞壁轮廓：只在主洞上/下沿点缀，不切断通路
for (let x = 10; x <= 24; x++) { if (grid[10][x] === PATH) grid[10][x] = WALL; }
for (let x = 10; x <= 24; x++) { if (grid[20][x] === PATH) grid[20][x] = WALL; }

// 祭坛四角点出车阵意象（避开所有实体坐标）
grid[9][25] = ROCK; grid[9][37] = ROCK;
grid[19][25] = ROCK; grid[19][37] = ROCK;

// 6) 生成数组文本（每行一个内层数组，缩进与项目一致）
const rowText = grid.map(row => '      [\n' + row.map(t => `        "${t}"`).join(',\n') + '\n      ]');
const newArr = '[\n' + rowText.join(',\n') + '\n    ]';

const out = src.slice(0, arrOpen) + newArr + src.slice(arrClose + 1);
fs.writeFileSync(p, out, 'utf8');
console.log('✓ 已重建 huoyundong 地形');
