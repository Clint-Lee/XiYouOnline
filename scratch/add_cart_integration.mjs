import fs from 'node:fs';

const p = 'test_cart_mechanic.js';
let s = fs.readFileSync(p, 'utf8');

// 幂等：已注入则跳过
if (s.includes('断言13-真实回合集成')) {
  console.log('已存在集成断言，跳过');
  process.exit(0);
}

const block = `
    // ---------- 断言 13-16：真实 executeRound 集成（单元层覆盖不到的路径） ----------
    // 历史缺陷：车阵状态曾被通用 buff 到期过滤删除（机制只活一轮），
    // 且 duration 同时被通用递减与 advanceCartCycle 双重递减（恢复期从 2 回合缩成 1 回合）。
    {
      const battle = makeBattle(makeBoss('b13'));
      const boss = liveBoss(battle);
      const ally = battle.allies[0];

      // 断言13：真实回合推进后车阵状态必须持续存在，不被通用到期过滤删除
      ally.hp = ally.maxHp;
      battle.setAllyAction('player', { type: 'defend' });
      await battle.executeRound(null);
      const afterR1 = battle.getCartState(boss);
      assert(afterR1 !== null,
        '断言13-机制常驻：真实回合结束后车阵状态不得被通用 buff 到期过滤删除');

      // 断言14：蓄力回合红孩儿不造成伤害（低速角色不该还没应对就挨打）
      assert(ally.hp === ally.maxHp,
        '断言14-蓄力回合无伤害：R1 玩家应为满血，实际 ' + ally.hp + '/' + ally.maxHp);

      // 断言15：衰减只由 advanceCartCycle 负责——恢复期必须跨满 2 个回合
      battle.setAllyAction('player', { type: 'defend' });
      await battle.executeRound(null); // R2 爆发
      const afterR2 = battle.getCartState(boss);
      assert(afterR2 && afterR2.phase === 'recovery',
        '断言15a-爆发后进入恢复期，实际 ' + (afterR2 && afterR2.phase));

      ally.hp = Math.min(ally.maxHp, ally.hp + 8000);
      battle.setAllyAction('player', { type: 'defend' });
      await battle.executeRound(null); // R3 恢复第 1 回合
      const afterR3 = battle.getCartState(boss);
      assert(afterR3 && afterR3.phase === 'recovery',
        '断言15b-恢复期第 1 回合仍应为 recovery（不得被双重递减提前结束），实际 ' + (afterR3 && afterR3.phase));

      ally.hp = Math.min(ally.maxHp, ally.hp + 8000);
      battle.setAllyAction('player', { type: 'defend' });
      await battle.executeRound(null); // R4 恢复第 2 回合结束后回到蓄力
      const afterR4 = battle.getCartState(boss);
      assert(afterR4 && afterR4.phase === 'charge',
        '断言15c-恢复满 2 回合后回到 charge，实际 ' + (afterR4 && afterR4.phase));

      // 断言16：破阵后真实战斗中不得立即重新蓄力
      const battle2 = makeBattle(makeBoss('b16'));
      const boss2 = liveBoss(battle2);
      const st2 = battle2.getCartState(boss2);
      battle2.recordCartBreakDamage(battle2.allies[0], boss2, st2.breakThreshold);
      const broken = battle2.getCartState(boss2);
      assert(broken && broken.phase === 'broken',
        '断言16a-破阵后应立即进入 broken');

      battle2.allies[0].hp = battle2.allies[0].maxHp;
      battle2.setAllyAction('player', { type: 'defend' });
      await battle2.executeRound(null);
      const afterBreakRound = battle2.getCartState(boss2);
      assert(afterBreakRound && afterBreakRound.phase !== 'charge',
        '断言16b-破阵后的真实回合不得立刻回到 charge，实际 ' + (afterBreakRound && afterBreakRound.phase));
    }
`;

// 插到文件末的 "}" 之前（module.exports 函数的收尾）
const lastBrace = s.lastIndexOf('};');
if (lastBrace < 0) { console.error('未找到函数结尾'); process.exit(1); }
s = s.slice(0, lastBrace) + block + '\n' + s.slice(lastBrace);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已追加断言 13-16（真实回合集成）');
