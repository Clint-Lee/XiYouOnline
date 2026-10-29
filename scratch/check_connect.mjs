// BFS 连通性验证：从出生点出发能到达哪些关键实体。
import fs from 'node:fs';
import vm from 'node:vm';

const sandbox = { window: {}, console, JSON, Object, Array, Number, Math, String };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('js/data/maps2d.js', 'utf8'), sandbox);

const SOLID = new Set([
  'cloud_void', 'heaven_pillar', 'bamboo', 'water', 'dark_water', 'city_wall', 'hut_wall',
  'palace_eaves', 'wooden_barricade', 'blacksmith_forge', 'mountain_rock', 'demon_cave_wall',
  'ginseng_tree', 'purple_bamboo', 'tang_palace', 'tang_store', 'stone_temple',
  'two_realms_stele', 'wall', 'stone_wall', 'void', 'abyss', 'lava', 'fire_wall'
]);

const mapId = process.argv[2];
const m = sandbox.GAME_DATA.MAPS_2D[mapId];
if (!m) { console.error(`${mapId} 不存在`); process.exit(2); }
const W = m.width, H = m.height, TS = 32;

const walkable = (x, y) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return false;
  const row = m.tiles[y];
  if (!row) return false;
  const t = row[x];
  return !!t && !SOLID.has(t);
};

const start = { x: Math.floor(m.playerSpawn.x / TS), y: Math.floor(m.playerSpawn.y / TS) };
const seen = new Set();
const q = [[start.x, start.y]];
seen.add(start.x + ',' + start.y);
while (q.length) {
  const [cx, cy] = q.shift();
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = cx + dx, ny = cy + dy, k = nx + ',' + ny;
    if (seen.has(k) || !walkable(nx, ny)) continue;
    seen.add(k);
    q.push([nx, ny]);
  }
}

console.log(`=== ${mapId} 连通性 ===`);
console.log(`从出生点 (${start.x},${start.y}) 可达 ${seen.size} 格`);
const check = (label, px, py) => {
  const gx = Math.floor(px / TS), gy = Math.floor(py / TS);
  const ok = seen.has(gx + ',' + gy);
  console.log(`  ${ok ? '✓' : '✗ 不可达'} ${label} (格 ${gx},${gy})`);
  return ok;
};
let allOk = true;
for (const n of (m.npcs || [])) allOk = check(`NPC ${n.id}`, n.x, n.y) && allOk;
for (const p of (m.portals || [])) allOk = check(`传送门 ${p.name}`, p.x, p.y) && allOk;
for (const mo of (m.monsters || [])) check(`怪物 ${mo.id}`, mo.x, mo.y);
console.log(allOk ? '\n✓ 全部关键实体可达' : '\n✗ 存在不可达实体');
