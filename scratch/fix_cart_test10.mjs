import fs from 'node:fs';
const p = 'test_cart_mechanic.js';
let s = fs.readFileSync(p, 'utf8');
let n = 0;
const rep = (from, to, label) => {
  const c = s.split(from).length - 1;
  if (c !== 1) { console.error(`✗ ${label}: 匹配 ${c} 处`); return false; }
  s = s.replace(from, to); n++; console.log(`✓ ${label}`); return true;
};

// 断言 10：记录"第几次推进才回到 charge"，要求 >= 2（破阵当回合不得立刻重开）
rep(
`      // 破阵后连续推进 2 次
      battle.advanceCartCycle(boss);
      battle.advanceCartCycle(boss);
      const after = battle.getCartState(boss);
      assert(
        after && (after.phase !== 'charge' || pushes >= 2),
        '断言10-破阵后不提前重新蓄力：破阵当回合不得立刻回到 charge（需经过完整喘息）'
      );`,
`      // 破阵后逐次推进，记录第几次才回到 charge
      let pushes = 0;
      let backToChargeAt = 0;
      for (let guard = 0; guard < 8; guard++) {
        battle.advanceCartCycle(boss);
        pushes++;
        const cur = battle.getCartState(boss);
        if (cur && cur.phase === 'charge') { backToChargeAt = pushes; break; }
      }
      assert(
        backToChargeAt >= 2,
        '断言10-破阵后不提前重新蓄力：需经过完整喘息（>=2 次推进）才回到 charge，实际第 ' + backToChargeAt + ' 次'
      );`,
'断言10 记录回 charge 次数');

fs.writeFileSync(p, s, 'utf8');
console.log(`共修改 ${n} 处`);
