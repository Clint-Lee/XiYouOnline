### FILE: js/core/battle.js
<<<<<<< OLD
    // 临时指令集
    this.actions = {}; // key: ally.id -> action
    this.turnQueue = []; // 全场速度队列

    // 计算初始速度序数
    this.calcTurnOrders();
=======
    // 临时指令集
    this.actions = {}; // key: ally.id -> action
    this.turnQueue = []; // 全场速度队列

    // 五行车阵：初始化带该机制的 Boss，首轮预告必须在玩家提交指令前写入
    for (const enemy of this.enemies) {
      if (enemy && enemy.mechanicId === 'five_element_cart') {
        this.initCartMechanic(enemy);
      }
    }

    // 计算初始速度序数
    this.calcTurnOrders();
>>>>>>> NEW

### FILE: js/core/battle.js
<<<<<<< OLD
      // 中毒/流血致死也要走复活与死亡判定，与主动攻击链保持一致
      if (unit.hp <= 0) this.tryRebirth(unit);
      unit.buffs = unit.buffs.filter(b => b.duration === undefined || b.duration > 0);
    }
  }

  // 检查战斗结束
  checkBattleEnd() {
=======
      // 中毒/流血致死也要走复活与死亡判定，与主动攻击链保持一致
      if (unit.hp <= 0) this.tryRebirth(unit);
      unit.buffs = unit.buffs.filter(b => b.duration === undefined || b.duration > 0);
    }
    // 回合末推进五行车阵相位（放在常规 buff 结算之后）
    for (const enemy of this.enemies) {
      if (enemy && enemy.mechanicId === 'five_element_cart' && enemy.hp > 0) {
        this.advanceCartCycle(enemy);
      }
    }
  }

  // ===================== 五行车阵（红孩儿 Boss 机制）=====================

  // 返回该敌人当前的车阵状态 buff，没有则 null
  getCartState(enemy) {
    if (!enemy || !Array.isArray(enemy.buffs)) return null;
    return enemy.buffs.find(b => b && b.id === 'hh_cart_state') || null;
  }

  // 五行阵眼轮换顺序：金→木→水→火→土
  _cartNextElement(prev) {
    const order = ['metal', 'wood', 'water', 'fire', 'earth'];
    if (!prev) return order[0];
    const idx = order.indexOf(prev);
    return order[(idx + 1) % order.length];
  }

  // 写入首轮蓄力：phase charge，预告在玩家提交指令前展示
  initCartMechanic(enemy) {
    if (!enemy) return;
    if (!Array.isArray(enemy.buffs)) enemy.buffs = [];
    // 保证最多一条车阵状态
    enemy.buffs = enemy.buffs.filter(b => !b || b.id !== 'hh_cart_state');
    const R = this.round; // 当前（蓄力）回合
    const threshold = Math.max(1, Math.floor((enemy.maxHp || enemy.hp || 0) * 0.05));
    const element = this._cartNextElement(null);
    enemy.buffs.push({
      id: 'hh_cart_state',
      name: '车阵蓄火',
      phase: 'charge',
      // 蓄力(R)→爆发(R+1) 之间经过一次回合末，duration 记为距到期的回合末次数
      duration: 1,
      appliedRound: R,
      activeFromRound: R,
      cycleStartRound: R,
      cycleId: (enemy.id || 'hh') + ':' + R,
      eyeElement: element,
      breakProgress: 0,
      breakThreshold: threshold,
      resolved: false
    });
    this.log(`【五行车阵】${enemy.name} 推出五辆火车，阵眼之火已然蓄起——下回合三昧真火将席卷全场！`);
  }

  // 相位推进：charge→burst→recovery→recovery→charge
  advanceCartCycle(enemy) {
    const st = this.getCartState(enemy);
    if (!st) return;
    if (st.phase === 'broken') {
      // 阵眼已破：recovery 期结束后重开下一轮蓄力，但破阵不提前启动
      st.duration--;
      if (st.duration <= 0) {
        const R = this.round + 1; // 下一回合开始新一轮蓄力
        const nextEl = this._cartNextElement(st.eyeElement);
        const threshold = Math.max(1, Math.floor((enemy.maxHp || enemy.hp || 0) * 0.05));
        st.name = '车阵蓄火';
        st.phase = 'charge';
        st.duration = 1;
        st.appliedRound = R;
        st.activeFromRound = R;
        st.cycleStartRound = R;
        st.cycleId = (enemy.id || 'hh') + ':' + R;
        st.eyeElement = nextEl;
        st.breakProgress = 0;
        st.breakThreshold = threshold;
        st.resolved = false;
        this.log(`【五行车阵】${enemy.name} 重整火车，阵眼转为新的五行，再度蓄火！`);
      }
      return;
    }
    if (st.phase === 'charge') {
      st.duration--;
      if (st.duration <= 0) {
        // 进入爆发：R+1 行动时执行群体三昧真火
        const R = this.round + 1;
        st.name = '五车俱燃';
        st.phase = 'burst';
        st.duration = 1;
        st.activeFromRound = R;
        // 爆发尚未执行
        st.resolved = false;
      }
      return;
    }
    if (st.phase === 'burst') {
      st.duration--;
      if (st.duration <= 0) {
        // 进入恢复：固定 2 回合只普攻
        const R = this.round + 1;
        st.name = '回气';
        st.phase = 'recovery';
        st.duration = 2;
        st.activeFromRound = R;
        st.resolved = true;
      }
      return;
    }
    if (st.phase === 'recovery') {
      st.duration--;
      if (st.duration <= 0) {
        // 恢复结束，建立下一轮蓄力
        const R = this.round + 1;
        const nextEl = this._cartNextElement(st.eyeElement);
        const threshold = Math.max(1, Math.floor((enemy.maxHp || enemy.hp || 0) * 0.05));
        st.name = '车阵蓄火';
        st.phase = 'charge';
        st.duration = 1;
        st.appliedRound = R;
        st.activeFromRound = R;
        st.cycleStartRound = R;
        st.cycleId = (enemy.id || 'hh') + ':' + R;
        st.eyeElement = nextEl;
        st.breakProgress = 0;
        st.breakThreshold = threshold;
        st.resolved = false;
        this.log(`【五行车阵】${enemy.name} 回气已毕，阵眼之火再度蓄起！`);
      }
      return;
    }
  }

  // 破阵累计：仅玩家主动攻击/伤害技能、蓄力期、目标为 Boss、实际扣血 > 0 才计入
  recordCartBreakDamage(attacker, target, dealt) {
    const st = this.getCartState(target);
    if (!st) return;
    // 必须处于蓄力期且窗口已开放
    if (st.phase !== 'charge' || st.activeFromRound > this.round) return;
    // 来源必须是玩家主动一方（DOT/反伤/反击由调用点不传入此函数来排除）
    if (!attacker || !this.allies.includes(attacker)) return;
    const real = Number(dealt);
    if (!Number.isFinite(real) || real <= 0) return;
    st.breakProgress += real;
    if (st.breakProgress >= st.breakThreshold && st.phase === 'charge' && !st.resolved) {
      // 破阵：转 broken，取消本轮爆发，清守息，反馈只触发一次
      st.phase = 'broken';
      st.name = '阵眼已破';
      st.resolved = true;
      // 破阵后进入与恢复等长的喘息，但不提前启动下一轮蓄力
      st.duration = 2;
      st.activeFromRound = this.round;
      // 清除本轮对应的守息 buff
      for (const ally of this.allies) {
        if (!Array.isArray(ally.buffs)) continue;
        ally.buffs = ally.buffs.filter(b => !(b && b.id === 'hh_cart_guard' && b.cycleId === st.cycleId));
      }
      this.log(`【破阵】${target.name} 的五行阵眼被击碎，三昧真火溃散，本轮爆发被彻底化解！`);
    }
  }

  // 授予/刷新守息：不叠加层数，R 得 duration 2、R+1 得 duration 1
  applyCartGuard(ally) {
    if (!ally) return;
    const bossWithCart = this.enemies.find(e =>
      e && e.mechanicId === 'five_element_cart' && e.hp > 0 && this.getCartState(e));
    if (!bossWithCart) return;
    const st = this.getCartState(bossWithCart);
    // 仅在蓄力或爆发且本轮未结算时才给守息
    if (!st || (st.phase !== 'charge' && st.phase !== 'burst') || st.resolved) return;
    if (!Array.isArray(ally.buffs)) ally.buffs = [];
    // 蓄力期获得可覆盖到爆发（2），爆发期获得仅当回合（1）
    const dur = st.phase === 'charge' ? 2 : 1;
    const exist = ally.buffs.find(b => b && b.id === 'hh_cart_guard');
    if (exist) {
      // 刷新而非叠加
      exist.sourceId = bossWithCart.id;
      exist.cycleId = st.cycleId;
      exist.appliedRound = this.round;
      exist.duration = dur;
      exist.burstDamageFactor = 0.65;
      exist.consumed = false;
    } else {
      ally.buffs.push({
        id: 'hh_cart_guard',
        name: '守息避火',
        sourceId: bossWithCart.id,
        cycleId: st.cycleId,
        appliedRound: this.round,
        duration: dur,
        burstDamageFactor: 0.65,
        consumed: false
      });
    }
    this.log(`【守息避火】${ally.name} 屏息凝神，以御三昧真火之势。`);
  }

  // 执行车阵爆发：对每个存活友方逐个结算一次三昧真火，套用守息与既有减伤链
  async resolveCartBurst(enemy, cb) {
    const st = this.getCartState(enemy);
    if (!st) return;
    // 已破阵或已结算则不爆发
    if (st.phase !== 'burst' || st.resolved) {
      st.resolved = true;
      return;
    }
    st.resolved = true;
    // 车阵爆发 = 既有 G 系法术基准威力 × 1.5
    const baseMagic = (enemy.magic || enemy.atk || enemy.attack || 0);
    const burstBase = Math.max(1, Math.floor(baseMagic * 1.5));
    this.log(`【五车俱燃】${enemy.name} 五辆火车同时喷焰，三昧真火席卷全场！`);
    if (cb) await cb({ type: 'cast', targetIndex: enemy.enemyIndex, text: '三昧真火·五车俱燃！', skillId: 'hh_cart_burst', skillName: '三昧真火' });
    const hits = [];
    const aliveAllies = this.getAliveAllies();
    for (const ally of aliveAllies) {
      if (ally.hp <= 0) continue;
      // 基准伤害加入轻微浮动，走既有减伤链
      let dmg = burstBase;
      // 守息减伤与普通防御取"更强"而非相乘
      let factor = 1;
      const guard = Array.isArray(ally.buffs)
        ? ally.buffs.find(b => b && b.id === 'hh_cart_guard' && b.sourceId === enemy.id && b.cycleId === st.cycleId && !b.consumed)
        : null;
      if (guard) {
        factor = Math.min(factor, guard.burstDamageFactor);
        guard.consumed = true;
      }
      const defend = Array.isArray(ally.buffs)
        ? ally.buffs.find(b => b && (b.id === 'defend' || b.name === '防御') && Number.isFinite(b.defRate))
        : null;
      if (defend) {
        // 普通防御 50% 减伤对应 factor 0.5，取更强（更小的 factor）
        factor = Math.min(factor, defend.defRate);
      }
      dmg = Math.max(1, Math.floor(dmg * factor));
      this.applyDamage(ally, dmg);
      this.log(`【三昧真火】${ally.name} 被烈焰灼烧，损失 ${dmg} 点气血。`);
      hits.push({ target: ally.id, damage: dmg, text: `-${dmg}` });
      if (ally.hp <= 0) this.tryRebirth(ally);
    }
    if (cb) await cb({ type: 'hits', hits });
  }

  // 战斗结束/破阵后清理车阵残留状态
  cleanupCartMechanic(enemy) {
    if (enemy && Array.isArray(enemy.buffs)) {
      enemy.buffs = enemy.buffs.filter(b => !b || b.id !== 'hh_cart_state');
    }
    for (const ally of this.allies) {
      if (Array.isArray(ally.buffs)) {
        ally.buffs = ally.buffs.filter(b => !b || b.id !== 'hh_cart_guard');
      }
    }
  }

  // 检查战斗结束
  checkBattleEnd() {
>>>>>>> NEW

### FILE: js/core/battle.js
<<<<<<< OLD
      this.applyDamage(targetEnemy, attackRes.totalDamage);

      let logMsg = `【${ally.name}】挥舞神兵，轰击【${targetEnemy.name}】！`;
=======
      this.applyDamage(targetEnemy, attackRes.totalDamage);
      // 五行车阵：玩家主动攻击计入破阵进度
      this.recordCartBreakDamage(ally, targetEnemy, attackRes.totalDamage);

      let logMsg = `【${ally.name}】挥舞神兵，轰击【${targetEnemy.name}】！`;
>>>>>>> NEW

### FILE: js/core/battle.js
<<<<<<< OLD
    if (action.type === 'defend') {
      ally.buffs.push({ id: 'defend', name: '防御', duration: 1, defRate: 0.5, appliedRound: this.round, expiresSameRound: true });
      this.log(`【${ally.name}】摆开防御架势，本回合受到伤害减半！`);
      if (cb) await cb({ type: 'defend', target: ally.id, text: '凝神防御！' });
      return;
    }
=======
    if (action.type === 'defend') {
      ally.buffs.push({ id: 'defend', name: '防御', duration: 1, defRate: 0.5, appliedRound: this.round, expiresSameRound: true });
      this.log(`【${ally.name}】摆开防御架势，本回合受到伤害减半！`);
      // 五行车阵：防御同时获得守息避火（蓄力/爆发期且本轮未结算）
      this.applyCartGuard(ally);
      if (cb) await cb({ type: 'defend', target: ally.id, text: '凝神防御！' });
      return;
    }
>>>>>>> NEW

### FILE: js/core/battle.js
<<<<<<< OLD
  async handleEnemyTurn(enemy, action, cb) {
    if (await this.handleControlState(enemy, action, cb)) return;
    const aliveAllies = this.getAliveAllies();
    if (aliveAllies.length === 0) return;
=======
  async handleEnemyTurn(enemy, action, cb) {
    if (await this.handleControlState(enemy, action, cb)) return;
    // 五行车阵：按相位接管红孩儿的行动
    const cartState = this.getCartState(enemy);
    if (cartState && cartState.activeFromRound <= this.round) {
      // 爆发回合：行动时执行一次群体三昧真火，不再普攻
      if (cartState.phase === 'burst' && !cartState.resolved) {
        await this.resolveCartBurst(enemy, cb);
        return;
      }
      // 蓄力回合：只做蓄火演出，不造成任何伤害
      if (cartState.phase === 'charge') {
        this.log(`【五行车阵】${enemy.name} 催动阵眼之火，烈焰升腾——本回合蓄势待发！`);
        if (cb) await cb({ type: 'message', text: '红孩儿正在蓄火，下回合三昧真火将席卷全场！' });
        return;
      }
    }
    const aliveAllies = this.getAliveAllies();
    if (aliveAllies.length === 0) return;
>>>>>>> NEW

现在接入 `handleSkillCast` 的破阵累计。由于提供的源码片段未包含各技能 `applyDamage` 的逐行原文，我需要读取实际文件以精确匹配。文件不在当前工作目录。让我定位它。实际的 `js/core/battle.js` 文件不在沙箱里——工作区为空，我只能看到你贴出的几段带行号的源码片段。

对于接入点 **(d) `handleSkillCast` 的破阵累计**，任务要求覆盖「舍生取义、佛光普照、如来神掌、雷霆万钧、万毒攻心、三昧真火/飞沙走石、乱魂咒、封印咒、定身咒、通用保底结算」等多处 `applyDamage(targetEnemy, ...)` / `applyDamage(e, ...)` 调用点。但你给出的片段里**只有 `handleSkillCast` 的开头 7 行**（1391–1407），没有任何这些技能的 `applyDamage` 原文行。

按硬性要求「OLD 片段必须逐字符忠实于给定原文，不得省略、不得加省略号」，我无法凭空编造这些行的精确原文来做唯一匹配——猜测的 OLD 会导致补丁无法命中、甚至误伤无关代码。

请二选一，我就能补齐 (d) 的补丁：