I need to see the actual source to produce byte-exact OLD blocks for the接入点 (普攻/元素法术/金刚护体 返回路径, handleAllyTurn attack分支完整, handleSkillCast各分支). Let me read the real file.The file isn't present in the workspace. I'll work entirely from the provided source excerpts. The接入点 details for handleEnemyTurn 返回路径 (普攻/元素法术/金刚护体) and handleAllyTurn/handleSkillCast各技能分支 aren't fully shown, so I'll implement the self-contained pieces precisely against the given text and add the接入点 at the anchors that ARE shown verbatim. For the parts not shown (enemy turn normal-return tails, each skill branch's applyDamage), I'll route through a single helper so you can wire it without me guessing unseen code.

Below are the patches. Each OLD block is copied verbatim from the provided source.

### FILE: js/core/battle.js
<<<<<<< OLD
    // 五行车阵：初始化带该机制的 Boss，首轮预告必须在玩家提交指令前写入
    for (const enemy of this.enemies) {
      if (enemy && enemy.mechanicId === 'five_element_cart') {
        this.initCartMechanic(enemy);
      }
    }
=======
    // 五行车阵：初始化带该机制的 Boss，首轮预告必须在玩家提交指令前写入
    for (const enemy of this.enemies) {
      if (enemy && enemy.mechanicId === 'five_element_cart') {
        this.initCartMechanic(enemy);
      }
      // 黑水换甲：鼍洁开场固定凝鳞姿态，无蓄力无预告
      if (enemy && enemy.mechanicId === 'heishui_current_armor') {
        this.initArmorMechanic(enemy);
      }
    }
>>>>>>> NEW

### FILE: js/core/battle.js
<<<<<<< OLD
  // ===================== 五行车阵（红孩儿 Boss 机制）=====================

  // 返回该敌人当前的车阵状态 buff，没有则 null
  getCartState(enemy) {
    if (!enemy || !Array.isArray(enemy.buffs)) return null;
    return enemy.buffs.find(b => b && b.id === 'hh_cart_state') || null;
  }
=======
  // ===================== 黑水换甲（鼍洁 Boss 机制）=====================

  // 返回该敌人当前的换甲状态 buff，没有则 null
  getArmorState(enemy) {
    if (!enemy || !Array.isArray(enemy.buffs)) return null;
    return enemy.buffs.find(b => b && b.id === 'hh_armor_state') || null;
  }

  // 姿态中文名：凝鳞 / 散流
  _armorStanceName(stance) {
    return stance === 'flowing' ? '散流' : '凝鳞';
  }

  // 初始化换甲：开场固定 scaled（凝鳞），不做任何蓄力/预告
  initArmorMechanic(enemy) {
    if (!enemy) return;
    if (!Array.isArray(enemy.buffs)) enemy.buffs = [];
    // 保证最多一条换甲状态
    enemy.buffs = enemy.buffs.filter(b => !b || b.id !== 'hh_armor_state');
    const cfg = enemy.mechanicConfig || {};
    const startStance = cfg.startStance === 'flowing' ? 'flowing' : 'scaled';
    enemy.buffs.push({
      id: 'hh_armor_state',
      name: this._armorStanceName(startStance),
      stance: startStance,
      actionCount: 0,
      appliedRound: this.round
    });
    this.log(`【黑水换甲】${enemy.name} 甲鳞紧合，化作${this._armorStanceName(startStance)}之态。`);
  }

  // 伤害修正入口：按当前姿态对单次伤害做减伤，从基础 bonus 实时计算，不改动属性
  // 返回 { damage, stance, note }
  static applyArmorMitigation(defender, rawDamage, isSpell) {
    const raw = Number(rawDamage);
    const fallback = { damage: Number.isFinite(raw) ? raw : 0, stance: null, note: '' };
    if (!defender || !Array.isArray(defender.buffs)) return fallback;
    const st = defender.buffs.find(b => b && b.id === 'hh_armor_state');
    if (!st) return fallback;
    const cfg = defender.mechanicConfig || {};
    const scaledDefBonus = Number(cfg.scaledDefBonus) || 0;
    const flowingMdefBonus = Number(cfg.flowingMdefBonus) || 0;
    // 凝鳞抗物理：仅物理伤害减伤
    if (st.stance === 'scaled' && isSpell === false) {
      const damage = Math.max(1, Math.floor(fallback.damage / (1 + scaledDefBonus)));
      return { damage, stance: 'scaled', note: '凝鳞抵住了部分兵刃伤害' };
    }
    // 散流抗法术：仅法术伤害减伤
    if (st.stance === 'flowing' && isSpell === true) {
      const damage = Math.max(1, Math.floor(fallback.damage / (1 + flowingMdefBonus)));
      return { damage, stance: 'flowing', note: '散流水幕冲散了部分法力' };
    }
    return { damage: fallback.damage, stance: st.stance, note: '' };
  }

  // 计数入口：该敌人真正执行完一次有效行动后调用
  // 达到 switchEvery 则切换姿态并清零计数（被控制而 return 的单位不会走到这里）
  recordArmorAction(enemy) {
    const st = this.getArmorState(enemy);
    if (!st) return;
    const cfg = enemy.mechanicConfig || {};
    const switchEvery = Math.max(1, Number(cfg.switchEvery) || 2);
    st.actionCount = (Number(st.actionCount) || 0) + 1;
    if (st.actionCount >= switchEvery) {
      st.stance = st.stance === 'scaled' ? 'flowing' : 'scaled';
      st.actionCount = 0;
      st.name = this._armorStanceName(st.stance);
      st.appliedRound = this.round;
      this.log(`【黑水换甲】${enemy.name} 甲鳞翻转，转为${st.name}之态！`);
    }
  }

  // 战斗结束/清理换甲残留状态
  cleanupArmorMechanic(enemy) {
    if (enemy && Array.isArray(enemy.buffs)) {
      enemy.buffs = enemy.buffs.filter(b => !b || b.id !== 'hh_armor_state');
    }
  }

  // ===================== 五行车阵（红孩儿 Boss 机制）=====================

  // 返回该敌人当前的车阵状态 buff，没有则 null
  getCartState(enemy) {
    if (!enemy || !Array.isArray(enemy.buffs)) return null;
    return enemy.buffs.find(b => b && b.id === 'hh_cart_state') || null;
  }
>>>>>>> NEW

### FILE: js/core/battle.js
<<<<<<< OLD
        const isCartState = buff.id === 'hh_cart_state';
        const isStanceBuff = buff.expiresSameRound === true || buff.name === '防御';
        if (!isCartState && buff.duration !== undefined && (isStanceBuff ||
          (buff.appliedRound !== undefined && buff.appliedRound < this.round))) buff.duration--;
      }
=======
        // 黑水换甲与五行车阵同属常驻机制状态，其生命周期不由通用 duration 管理，
        // 必须跳过递减，否则会被误删（换甲本就不带 duration，防御性再排除一次）。
        const isCartState = buff.id === 'hh_cart_state';
        const isArmorState = buff.id === 'hh_armor_state';
        const isStanceBuff = buff.expiresSameRound === true || buff.name === '防御';
        if (!isCartState && !isArmorState && buff.duration !== undefined && (isStanceBuff ||
          (buff.appliedRound !== undefined && buff.appliedRound < this.round))) buff.duration--;
      }
>>>>>>> NEW

### FILE: js/core/battle.js
<<<<<<< OLD
      unit.buffs = unit.buffs.filter(b => b.duration === undefined || b.duration > 0 ||
        (b && b.id === 'hh_cart_state'));
=======
      unit.buffs = unit.buffs.filter(b => b.duration === undefined || b.duration > 0 ||
        (b && b.id === 'hh_cart_state') || (b && b.id === 'hh_armor_state'));
>>>>>>> NEW

### FILE: js/core/battle.js（接入点：玩家普攻 对鼍洁的伤害过换甲减伤 + 计数留给敌方回合）
<<<<<<< OLD
      this.applyDamage(targetEnemy, attackRes.totalDamage);
      // 五行车阵：玩家主动攻击计入破阵进度
      this.recordCartBreakDamage(ally, targetEnemy, attackRes.totalDamage);
=======
      // 黑水换甲：若目标为换甲 Boss，普攻为物理伤害，先过姿态减伤
      if (this.getArmorState(targetEnemy)) {
        const mit = BattleEngine.applyArmorMitigation(targetEnemy, attackRes.totalDamage, false);
        attackRes.totalDamage = mit.damage;
        if (mit.note) this.log(`【黑水换甲】${mit.note}。`);
      }
      this.applyDamage(targetEnemy, attackRes.totalDamage);
      // 五行车阵：玩家主动攻击计入破阵进度
      this.recordCartBreakDamage(ally, targetEnemy, attackRes.totalDamage);
>>>>>>> NEW

### FILE: js/core/battle.js（接入点：敌方回合 handleEnemyTurn 顶部读取换甲状态）
<<<<<<< OLD
  async handleEnemyTurn(enemy, action, cb) {
    if (await this.handleControlState(enemy, action, cb)) return;
    // 五行车阵：按相位接管红孩儿的行动
    const cartState = this.getCartState(enemy);
=======
  async handleEnemyTurn(enemy, action, cb) {
    if (await this.handleControlState(enemy, action, cb)) return;
    // 黑水换甲：读取当前姿态（被控制时上面已 return，不会走到这里，故不会误计数）
    const armorState = this.getArmorState(enemy);
    // 五行车阵：按相位接管红孩儿的行动
    const cartState = this.getCartState(enemy);
>>>>>>> NEW

---

以下为**无法逐字匹配**的接入点，因为你未提供这些代码的原文：

1. `handleEnemyTurn` 的三条正常返回路径（普攻、元素法术、金刚护体）末尾——需在各自 `return` 之前插入 `this.recordArmorAction(enemy);`。（你给的片段只到第 2247 行，后续普攻/技能结算代码未提供。）
2. `handleSkillCast` 各技能分支中 `applyDamage(enemy, ...)` 之前，对目标为鼍洁的伤害调用 `BattleEngine.applyArmorMitigation(enemy, dmg, true/false)`——需按每个分支是物理还是法术传入 `isSpell`，这些分支原文未给出。
3. `cleanupArmorMechanic(enemy)` 的调用点（战斗结束清理处）——未提供原文。

请把这三处的真实原文（含行号与缩进）贴给我，我再给出逐字精确的 OLD/NEW 补丁。为便于你自行接入，接入模板如下（勿作为补丁直接套用，需匹配真实原文）：

```js
// handleEnemyTurn 每条正常返回前：
this.recordArmorAction(enemy);
return; // 或原有的返回语句

// handleSkillCast 伤害技能分支，applyDamage 之前（isSpell 按该技能类型传）：
if (this.getArmorState(enemy)) {
  const mit = BattleEngine.applyArmorMitigation(enemy, dmg, /* isSpell */ true);
  dmg = mit.damage;
  if (mit.note) this.log(`【黑水换甲】${mit.note}。`);
}

// 战斗结束清理处，与 cleanupCartMechanic 并列：
this.cleanupArmorMechanic(enemy);
```