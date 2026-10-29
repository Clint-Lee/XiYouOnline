// 校验 huoyundong 地图：可行走比例、玩家出生点、NPC/怪物坐标是否落在可行走格上。
import fs from 'node:fs';
import vm from 'node:vm';

const sandbox = { window: {}, console, JSON, Object, Array, Number, Math, String };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('js/data/maps2d.js', 'utf8'), sandbox);

const maps = sandbox.GAME_DATA.MAPS_2D;
const SOLID = new Set([
  'cloud_void', 'heaven_pillar', 'bamboo', 'water', 'dark_water', 'city_wall', 'hut_wall',
  'palace_eaves', 'wooden_barricade', 'blacksmith_forge', 'mountain_rock', 'demon_cave_wall',
  'ginseng_tree', 'purple_bamboo', 'tang_palace', 'tang_store', 'stone_temple',
  'two_realms_stele', 'wall', 'stone_wall', 'void', 'abyss', 'lava', 'fire_wall'
]);

for (const mapId of process.argv.slice(2)) {
  const m = maps[mapId];
  if (!m) { console.log(`✗ ${mapId} 不存在`); continue; }
  const W = m.width, H = m.height, TS = 32;
  let walk = 0, total = 0;
  const walkable = (tx, ty) => {
    if (tx < 0 || ty < 0 || tx >= W || ty >= H) return false;
    const row = m.tiles[ty];
    if (!row) return false;
    const t = row[tx];
    if (!t) return false;
    return !SOLID.has(t);
  };
  for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) { total++; if (walkable(c, r)) walk++; }

  console.log(`\n=== ${mapId} 「${m.name}」 ${W}x${H} ===`);
  console.log(`可行走: ${walk}/${total} (${(walk / total * 100).toFixed(1)}%)`);

  const sp = m.playerSpawn;
  if (sp) {
    const ok = walkable(Math.floor(sp.x / TS), Math.floor(sp.y / TS));
    console.log(`出生点 (${sp.x},${sp.y}) -> 可行走: ${ok ? '✓' : '✗ 卡墙！'}`);
  } else {
    console.log('✗ 缺少 playerSpawn');
  }

  for (const n of (m.npcs || [])) {
    const ok = walkable(Math.floor(n.x / TS), Math.floor(n.y / TS));
    console.log(`  NPC ${n.id} (${n.x},${n.y}) ${ok ? '✓' : '✗ 落在阻挡格'}`);
  }
  for (const mo of (m.monsters || [])) {
    const ok = walkable(Math.floor(mo.x / TS), Math.floor(mo.y / TS));
    if (!ok) console.log(`  ✗ 怪物 ${mo.id} (${mo.x},${mo.y}) 落在阻挡格`);
  }
  for (const p of (m.portals || [])) {
    const ok = walkable(Math.floor(p.x / TS), Math.floor(p.y / TS));
    console.log(`  传送门 ${p.name} (${p.x},${p.y}) -> ${p.targetMap} ${ok ? '✓' : '✗ 落在阻挡格'}`);
  }
}
