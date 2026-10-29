import fs from 'node:fs';
const p = 'test_huoyan_chapter.js';
let s = fs.readFileSync(p, 'utf8');

// ash_ground 是熄火后的焦土地面，应可通行； lava / fire_wall 才是真正阻挡
const from = `      'demon_cave_wall', 'cloud_void', 'heaven_pillar', 'bamboo', 'dark_water', 'hut_wall',
      'palace_eaves', 'wooden_barricade', 'blacksmith_forge', 'ginseng_tree', 'purple_bamboo',
      'tang_palace', 'tang_store', 'stone_temple', 'two_realms_stele', 'lava', 'fire_wall', 'ash_ground']);`;
const to = `      'demon_cave_wall', 'cloud_void', 'heaven_pillar', 'bamboo', 'dark_water', 'hut_wall',
      'palace_eaves', 'wooden_barricade', 'blacksmith_forge', 'ginseng_tree', 'purple_bamboo',
      'tang_palace', 'tang_store', 'stone_temple', 'two_realms_stele', 'lava', 'fire_wall']);
    // 注：ash_ground（熄火后的焦土）是可行走地面，不算阻挡`;

const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);

// 同步修正第 13 条的 SOLID
const from2 = `    const SOLID = new Set(['mountain_rock', 'lava', 'fire_wall', 'void', 'abyss', 'ash_ground']);`;
const to2 = `    const SOLID = new Set(['mountain_rock', 'lava', 'fire_wall', 'void', 'abyss']);`;
const c2 = s.split(from2).length - 1;
if (c2 === 1) { s = s.replace(from2, to2); console.log('✓ 第13条 SOLID 已修正'); }
else console.error(`✗ 第13条 ${c2}`);

fs.writeFileSync(p, s, 'utf8');
console.log('✓ ash_ground 已改为可通行');
