import fs from 'node:fs';
const p = 'test_heishui_chapter.js';
let s = fs.readFileSync(p, 'utf8');

if (s.includes('章节奖励物品必须真实存在')) {
  console.log('断言已存在');
  process.exit(0);
}

const from = `  console.log('  ✅ 黑水河章节断言全部通过');`;
const to = `  // ── 12. 章节奖励物品必须真实存在于物品表 ──
  // 历史缺陷：eq_nk_huoyun / eq_nk_heishui 曾被写进奖励却未在 items.js 定义，
  // 导致 claimStoryReward 返回 invalid_items，玩家永远领不到章节奖励。
  {
    const rewardItemIds = [
      'eq_nk_huoyun',   // 第十二回 火云辟火珠
      'eq_nk_heishui'   // 第十三回 黑水辟水佩
    ];
    for (const id of rewardItemIds) {
      const it = window.GAME_DATA.ITEMS[id];
      assert(!!it, \`章节奖励物品「\${id}」必须在 GAME_DATA.ITEMS 中定义\`);
      assert(it && it.type === 'equip', \`章节奖励物品「\${id}」应为可穿戴装备\`);
      assert(it && it.slot === 'necklace', \`章节奖励物品「\${id}」应为挂链部位\`);
      assert(it && !!it.element, \`章节奖励物品「\${id}」应带五行属性（挂链决定玩家五行）\`);
    }

    // 端到端：用真实物品领取必须成功
    const p = new window.Player({ classId: 'jingang', level: 60 });
    const inv = new window.Inventory([]);
    const res = p.claimStoryReward('heishui_reward_e2e_test',
      { items: [{ itemId: 'eq_nk_heishui', count: 1 }] }, inv);
    assert(res.success === true, '使用真实物品的黑水河奖励应能成功入包');
  }

  console.log('  ✅ 黑水河章节断言全部通过');`;

const c = s.split(from).length - 1;
if (c !== 1) { console.error(`锚点匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已追加奖励物品存在性断言');
