import fs from 'node:fs';
import vm from 'node:vm';

// 扫描所有剧情/战斗奖励里引用的 itemId，校验是否都在 ITEMS 表中定义。
const sb = { window: {}, console, JSON, Object, Array, Number, Math, String };
sb.window = sb;
vm.createContext(sb);
vm.runInContext(fs.readFileSync('js/data/items.js', 'utf8'), sb);
vm.runInContext(fs.readFileSync('js/data/classes.js', 'utf8'), sb);
vm.runInContext(fs.readFileSync('js/core/skills.js', 'utf8'), sb);
vm.runInContext(fs.readFileSync('js/data/pets.js', 'utf8'), sb);
vm.runInContext(fs.readFileSync('js/data/maps2d.js', 'utf8'), sb);

const ITEMS = sb.GAME_DATA.ITEMS || {};
const ids = new Set();

const scan = (file) => {
  const s = fs.readFileSync(file, 'utf8');
  // 覆盖 itemId: 'xxx' 与 itemId:'xxx' 两种写法
  for (const m of s.matchAll(/itemId\s*:\s*'([a-zA-Z_0-9]+)'/g)) ids.add(m[1]);
};
scan('js/app2d.js');
scan('js/data/storyQuests.js');

const missing = [...ids].filter(id => !ITEMS[id]).sort();
console.log(`奖励引用的物品共 ${ids.size} 种`);
if (missing.length) {
  console.log('✗ 未定义:');
  missing.forEach(id => console.log('   ', id));
  process.exit(1);
} else {
  console.log('✓ 全部已定义');
}
