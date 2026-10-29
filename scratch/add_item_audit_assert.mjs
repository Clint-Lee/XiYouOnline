import fs from 'node:fs';
const p = 'test_heishui_chapter.js';
let s = fs.readFileSync(p, 'utf8');

if (s.includes('所有奖励引用的物品必须已定义')) {
  console.log('已存在');
  process.exit(0);
}

const from = `  console.log('  ✅ 黑水河章节断言全部通过');`;
const to = `  // ── 13. 全项目奖励物品引用审计 ──
  // 历史缺陷：eq_nk_huoyun / eq_nk_heishui 曾写进奖励却未定义，玩家永远领不到。
  // 这条断言扫描 app2d.js 与 storyQuests.js 里所有 itemId 引用，防止同类缺口复发。
  {
    const fs = require('fs');
    const path = require('path');
    const root = __dirname;
    const referenced = new Set();
    for (const rel of ['js/app2d.js', 'js/data/storyQuests.js']) {
      const src = fs.readFileSync(path.join(root, rel), 'utf8');
      for (const m of src.matchAll(/itemId\\s*:\\s*'([a-zA-Z_0-9]+)'/g)) referenced.add(m[1]);
    }
    assert(referenced.size > 20, \`应扫描到足够多的物品引用，实际 \${referenced.size} 种\`);
    const missing = [...referenced].filter(id => !window.GAME_DATA.ITEMS[id]).sort();
    assert(missing.length === 0,
      \`所有奖励引用的物品必须已定义，缺失: \${missing.join(', ') || '无'}\`);
  }

  console.log('  ✅ 黑水河章节断言全部通过');`;

const c = s.split(from).length - 1;
if (c !== 1) { console.error(`锚点匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已追加物品引用审计断言');
