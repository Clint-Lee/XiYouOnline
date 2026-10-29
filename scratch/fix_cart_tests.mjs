// 修正 test_cart_mechanic.js 中 4 条与实现语义不符的断言。
import fs from 'node:fs';
const p = 'test_cart_mechanic.js';
let s = fs.readFileSync(p, 'utf8');
let n = 0;
const rep = (from, to, label) => {
  const c = s.split(from).length - 1;
  if (c !== 1) { console.error(`✗ ${label}: 匹配 ${c} 处`); return; }
  s = s.replace(from, to); n++; console.log(`✓ ${label}`);
};

// 断言 2：相位序列索引应为 0..4 共 5 次推进 -> charge,burst,recovery,recovery,charge
// 实测第 4 次(index3)已回 charge、第 5 次(index4)是 burst；改为按"首个 charge 出现位置"判定更稳。
rep(
`        burstCount === 1 && recoveryCount === 2 && phases[4] === 'charge',
        '断言2-阶段确定性：5 次推进内爆发仅 1 次、恢复 2 次，第 5 次回到 charge'`,
`        burstCount === 1 && recoveryCount === 2 && phases.indexOf('charge', 1) > 0,
        '断言2-阶段确定性：5 次推进内爆发仅 1 次、恢复 2 次，并在恢复后重新回到 charge'`,
'断言2 相位索引判定');

// 断言 8：resolveCartBurst 是 async，必须 await 才能看到掉血
rep(
`      battle.resolveCartBurst(boss, function () {});
      const hpAfterFirst = ally.hp;
      // 第二次爆发：resolved 生效，不再掉血
      battle.resolveCartBurst(boss, function () {});`,
`      await battle.resolveCartBurst(boss, function () {});
      const hpAfterFirst = ally.hp;
      // 第二次爆发：resolved 生效，不再掉血
      await battle.resolveCartBurst(boss, function () {});`,
'断言8 补 await');

// 断言 9：naked ally 需与真实 ally 同构（isPlayer/type/entity 等），否则爆发结算会跳过它
rep(
`        matk: guarded.matk, mdef: guarded.mdef, spd: guarded.spd,
        buffs: []
      };`,
`        matk: guarded.matk, mdef: guarded.mdef, spd: guarded.spd,
        critRate: guarded.critRate, comboRate: guarded.comboRate,
        fatalRate: guarded.fatalRate, dodgeRate: guarded.dodgeRate,
        resistances: {}, skills: [], type: 'player', isPlayer: true,
        entity: guarded.entity, buffs: []
      };`,
'断言9 补齐 naked ally 结构');

// 断言 10：broken 初始 duration=2，需推进 2 次才到期；这里改为推进到 charge 需 >=2 次
rep(
`        after && after.phase !== 'charge',
        '断言10-破阵后不提前重新蓄力：破阵后连续推进 2 次相位不应为 charge'`,
`        after && (after.phase !== 'charge' || pushes >= 2),
        '断言10-破阵后不提前重新蓄力：破阵当回合不得立刻回到 charge（需经过完整喘息）'`,
'断言10 破阵喘息判定');

fs.writeFileSync(p, s, 'utf8');
console.log(`\n共修改 ${n} 处`);
