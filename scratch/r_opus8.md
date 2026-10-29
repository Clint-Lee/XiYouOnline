### FILE: test_cart_mechanic.js
```js
// 五行车阵 Boss 机制测试模块
// 由主套件以 await require('./test_cart_mechanic.js')(assert) 方式调用
// assert(condition, message) 由主套件提供，Math.random 已被覆写为固定序列

module.exports = async function (assert) {
  // 保存原始随机函数，便于 finally 还原
  const savedRandom = Math.random;

  try {
    // 构造测试用 Boss（字段需完整）的工厂方法，避免多条断言相互污染状态
    function makeBoss(id) {
      return {
        id: id || 'boss_redboy_test', name: '红孩儿测试体', level: 56,
        hp: 42000, maxHp: 42000, mp: 9999, maxMp: 9999,
        atk: 420, def: 215, matk: 400, mdef: 205, spd: 52, skills: [],
        mechanicId: 'five_element_cart',
        mechanicConfig: {
          breakRatio: 0.05, burstFactor: 1.5, guardFactor: 0.65, recoveryRounds: 2,
          elements: ['gold', 'wood', 'water', 'fire', 'earth']
        }
      };
    }

    // 构造一场战斗：构造函数会规范化敌人字段并调用 initCartMechanic
    function makeBattle(boss) {
      const player = new window.Player({ classId: 'jingang', level: 50 });
      return new window.BattleEngine(player, [], [boss]);
    }

    // 从 battle.enemies 取回被规范化后的 Boss 单位
    function liveBoss(battle) {
      return battle.enemies[0];
    }

    // ---------- 断言 1：预告先于输入 ----------
    {
      const battle = makeBattle(makeBoss('b1'));
      const boss = liveBoss(battle);
      // 若构造函数未触发首轮蓄力则主动初始化，保证读到预告态
      let st = battle.getCartState(boss);
      if (!st || st.phase !== 'charge') {
        battle.initCartMechanic(boss);
        st = battle.getCartState(boss);
      }
      assert(
        st && st.phase === 'charge' &&
        st.breakThreshold === 2100 &&
        typeof st.activeFromRound === 'number',
        '断言1-预告先于输入：initCartMechanic 后应处于 charge 蓄力相位，带 breakThreshold(2100) 与 activeFromRound'
      );
    }

    // ---------- 断言 2：阶段确定性 ----------
    {
      const battle = makeBattle(makeBoss('b2'));
      const boss = liveBoss(battle);
      let st = battle.getCartState(boss);
      if (!st || st.phase !== 'charge') {
        battle.initCartMechanic(boss);
      }
      // 连续推进 5 次，记录每次相位
      const phases = [];
      for (let i = 0; i < 5; i++) {
        battle.advanceCartCycle(boss);
        const cur = battle.getCartState(boss);
        phases.push(cur ? cur.phase : null);
      }
      // 只需保证：爆发只出现一次、恢复出现两次、第 5 次回到蓄力
      const burstCount = phases.filter(function (p) { return p === 'burst'; }).length;
      const recoveryCount = phases.filter(function (p) { return p === 'recovery'; }).length;
      assert(
        burstCount === 1 && recoveryCount === 2 && phases[4] === 'charge',
        '断言2-阶段确定性：5 次推进内爆发仅 1 次、恢复 2 次，第 5 次回到 charge'
      );
    }

    // ---------- 断言 3：抢攻破阵生效 ----------
    {
      const battle = makeBattle(makeBoss('b3'));
      const boss = liveBoss(battle);
      let st = battle.getCartState(boss);
      if (!st || st.phase !== 'charge') {
        battle.initCartMechanic(boss);
        st = battle.getCartState(boss);
      }
      const ally = battle.allies[0];
      // 蓄力期累计造成等于阈值的伤害
      battle.recordCartBreakDamage(ally, boss, st.breakThreshold);
      const after = battle.getCartState(boss);
      assert(
        after && after.phase === 'broken' && after.resolved === true,
        '断言3-抢攻破阵生效：蓄力期累计达阈值伤害后应转 broken 且 resolved 为 true'
      );
    }

    // ---------- 断言 4：累计边界 ----------
    {
      const battle = makeBattle(makeBoss('b4'));
      const boss = liveBoss(battle);
      let st = battle.getCartState(boss);
      if (!st || st.phase !== 'charge') {
        battle.initCartMechanic(boss);
        st = battle.getCartState(boss);
      }
      const ally = battle.allies[0];
      // 先累计到阈值差 1 点，应仍为蓄力
      battle.recordCartBreakDamage(ally, boss, st.breakThreshold - 1);
      const mid = battle.getCartState(boss);
      const notBrokenYet = mid && mid.phase === 'charge';
      // 再补 1 点，达到阈值破阵
      battle.recordCartBreakDamage(ally, boss, 1);
      const done = battle.getCartState(boss);
      assert(
        notBrokenYet && done && done.phase === 'broken',
        '断言4-累计边界：差 1 点不破阵（仍 charge），补足 1 点后转 broken'
      );
    }

    // ---------- 断言 5：零伤害不计入 ----------
    {
      const battle = makeBattle(makeBoss('b5'));
      const boss = liveBoss(battle);
      let st = battle.getCartState(boss);
      if (!st || st.phase !== 'charge') {
        battle.initCartMechanic(boss);
      }
      const ally = battle.allies[0];
      battle.recordCartBreakDamage(ally, boss, 0);
      const after = battle.getCartState(boss);
      assert(
        after && after.breakProgress === 0,
        '断言5-零伤害不计入：recordCartBreakDamage 传 0 后 breakProgress 应仍为 0'
      );
    }

    // ---------- 断言 6：守息授予 ----------
    {
      const battle = makeBattle(makeBoss('b6'));
      const boss = liveBoss(battle);
      let st = battle.getCartState(boss);
      if (!st || st.phase !== 'charge') {
        battle.initCartMechanic(boss);
      }
      const ally = battle.allies[0];
      battle.applyCartGuard(ally);
      const guard = (ally.buffs || []).find(function (b) { return b.id === 'hh_cart_guard'; });
      assert(
        guard && guard.burstDamageFactor === 0.65 && guard.consumed === false,
        '断言6-守息授予：蓄力期 applyCartGuard 后应出现 hh_cart_guard，burstDamageFactor 0.65 且 consumed false'
      );
    }

    // ---------- 断言 7：守息不叠加 ----------
    {
      const battle = makeBattle(makeBoss('b7'));
      const boss = liveBoss(battle);
      let st = battle.getCartState(boss);
      if (!st || st.phase !== 'charge') {
        battle.initCartMechanic(boss);
      }
      const ally = battle.allies[0];
      battle.applyCartGuard(ally);
      battle.applyCartGuard(ally);
      const guards = (ally.buffs || []).filter(function (b) { return b.id === 'hh_cart_guard'; });
      assert(
        guards.length === 1,
        '断言7-守息不叠加：同一 ally 连续两次 applyCartGuard 只应保留一条 hh_cart_guard'
      );
    }

    // ---------- 断言 8：爆发执行一次 ----------
    {
      const battle = makeBattle(makeBoss('b8'));
      const boss = liveBoss(battle);
      let st = battle.getCartState(boss);
      if (!st || st.phase !== 'charge') {
        battle.initCartMechanic(boss);
      }
      // 推进到 burst 相位
      let guard = 0;
      while (battle.getCartState(boss) && battle.getCartState(boss).phase !== 'burst' && guard < 10) {
        battle.advanceCartCycle(boss);
        guard++;
      }
      const ally = battle.allies[0];
      const hpBefore = ally.hp;
      // 第一次爆发：存活友方应掉血
      battle.resolveCartBurst(boss, function () {});
      const hpAfterFirst = ally.hp;
      // 第二次爆发：resolved 生效，不再掉血
      battle.resolveCartBurst(boss, function () {});
      const hpAfterSecond = ally.hp;
      assert(
        hpAfterFirst < hpBefore && hpAfterSecond === hpAfterFirst,
        '断言8-爆发执行一次：首次 resolveCartBurst 使存活友方掉血，再次调用不再掉血'
      );
    }

    // ---------- 断言 9：守息减伤真实生效 ----------
    {
      // 临时固定随机，排除随机波动影响
      Math.random = function () { return 0.5; };
      const battle = makeBattle(makeBoss('b9'));
      const boss = liveBoss(battle);
      let st = battle.getCartState(boss);
      if (!st || st.phase !== 'charge') {
        battle.initCartMechanic(boss);
      }
      // 构造同血量的两个 ally：一个带守息、一个不带
      const guarded = battle.allies[0];
      const naked = {
        id: 'ally_naked_test', name: '无守息测试体',
        hp: guarded.maxHp, maxHp: guarded.maxHp,
        mp: guarded.mp, maxMp: guarded.maxMp,
        atk: guarded.atk, def: guarded.def,
        matk: guarded.matk, mdef: guarded.mdef, spd: guarded.spd,
        buffs: []
      };
      // 对齐两者当前血量
      guarded.hp = guarded.maxHp;
      naked.hp = guarded.maxHp;
      battle.allies.push(naked);
      // 仅给 guarded 授守息
      battle.applyCartGuard(guarded);
      // 推进到 burst 相位
      let gcnt = 0;
      while (battle.getCartState(boss) && battle.getCartState(boss).phase !== 'burst' && gcnt < 10) {
        battle.advanceCartCycle(boss);
        gcnt++;
      }
      battle.resolveCartBurst(boss, function () {});
      assert(
        guarded.hp > naked.hp,
        '断言9-守息减伤真实生效：同波爆发后带守息者剩余血量应高于不带守息者'
      );
      // 还原到主套件的固定序列
      Math.random = savedRandom;
    }

    // ---------- 断言 10：破阵后不提前重新蓄力 ----------
    {
      const battle = makeBattle(makeBoss('b10'));
      const boss = liveBoss(battle);
      let st = battle.getCartState(boss);
      if (!st || st.phase !== 'charge') {
        battle.initCartMechanic(boss);
        st = battle.getCartState(boss);
      }
      const ally = battle.allies[0];
      // 先破阵
      battle.recordCartBreakDamage(ally, boss, st.breakThreshold);
      // 破阵后连续推进 2 次
      battle.advanceCartCycle(boss);
      battle.advanceCartCycle(boss);
      const after = battle.getCartState(boss);
      assert(
        after && after.phase !== 'charge',
        '断言10-破阵后不提前重新蓄力：破阵后连续推进 2 次相位不应为 charge'
      );
    }

    // ---------- 断言 11：到期清理 ----------
    {
      const battle = makeBattle(makeBoss('b11'));
      const boss = liveBoss(battle);
      let st = battle.getCartState(boss);
      if (!st || st.phase !== 'charge') {
        battle.initCartMechanic(boss);
      }
      battle.cleanupCartMechanic(boss);
      const stateNull = battle.getCartState(boss) === null;
      const noBuff = !(boss.buffs || []).some(function (b) { return b.id === 'hh_cart_state'; });
      assert(
        stateNull && noBuff,
        '断言11-到期清理：cleanupCartMechanic 后 getCartState 返回 null 且 buffs 中无 hh_cart_state'
      );
    }

    // ---------- 断言 12：结构完整 ----------
    {
      const proto = window.BattleEngine.prototype;
      const methods = [
        'getCartState', 'initCartMechanic', 'advanceCartCycle',
        'recordCartBreakDamage', 'applyCartGuard', 'resolveCartBurst',
        'cleanupCartMechanic'
      ];
      const allFn = methods.every(function (m) { return typeof proto[m] === 'function'; });
      assert(
        allFn,
        '断言12-结构完整：BattleEngine.prototype 上七个车阵方法均应存在且为 function'
      );
    }
  } finally {
    // 无论成败都还原随机函数，避免污染后续测试
    Math.random = savedRandom;
  }
};
```