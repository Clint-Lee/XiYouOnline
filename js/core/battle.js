/**
 * 汉风西游 - 五行生克法则系统 (FiveElements)
 * 相生：金生水，水生木，木生火，火生土，土生金
 * 相克：金克木，木克土，土克水，水克火，火克金
 * 双向克制：
 * 1. 攻击方克制受击方：普攻与技能伤害提升 10%~30% (约 1.20x，500 打出 550~650)，控制法术命中率 +10%
 * 2. 攻击方被受击方克制：普攻与技能伤害削减 15%~25% (约 0.80x)，控制法术命中率 -10% (80% 降至约 70%~72%)
 * 3. 玩家需佩戴【挂链】装备才具备五行属性，否则为无属性中立；怪物/仙宠种族固定属性。
 */
const FiveElements = {
  REST_MAP: {
    gold: 'wood',   // 金克木
    wood: 'earth',  // 木克土
    earth: 'water', // 土克水
    water: 'fire',  // 水克火
    fire: 'gold'    // 火克金
  },
  NAMES: {
    gold: '金',
    wood: '木',
    water: '水',
    fire: '火',
    earth: '土'
  },
  COLORS: {
    gold: '#fbbf24',
    wood: '#4ade80',
    water: '#38bdf8',
    fire: '#f87171',
    earth: '#f59e0b'
  },
  checkRestraint(elemA, elemB) {
    if (!elemA || !elemB || elemA === elemB) return 'neutral';
    if (this.REST_MAP[elemA] === elemB) return 'counter';     // A 克制 B
    if (this.REST_MAP[elemB] === elemA) return 'countered';   // A 被 B 克制
    return 'neutral';
  },
  getDamageMultiplier(elemA, elemB, options = {}) {
    const rel = this.checkRestraint(elemA, elemB);
    if (rel === 'counter') {
      if (options.forceElemMult !== undefined) return options.forceElemMult;
      return 1.10 + Math.random() * 0.20; // 500 造成约 550 ~ 650 (均值 1.20x)
    }
    if (rel === 'countered') {
      if (options.forceElemMult !== undefined) return options.forceElemMult;
      return 0.75 + Math.random() * 0.10; // 受到五行反制削减 15% ~ 25% (均值 0.80x)
    }
    return 1.0;
  },
  getControlHitModifier(casterElem, targetElem) {
    const rel = this.checkRestraint(casterElem, targetElem);
    if (rel === 'counter') return 0.10;    // 克制方控制命中率 +10%
    if (rel === 'countered') return -0.10; // 被克制方控制命中率 -10% (80% -> 70%~72%)
    return 0;
  }
};

if (typeof window !== 'undefined') {
  window.FiveElements = FiveElements;
}

class BattleEngine {
  // 解析实体当前五行属性 (玩家由所装备挂链决定；野怪与仙宠由种族固定属性决定)
  static getEntityElement(unit) {
    if (!unit) return null;
    // 玩家必须装备挂链方具备五行属性，未佩戴挂链则为无属性中立
    if (unit.isPlayer || unit.type === 'player' || (unit.classId && unit.equipment)) {
      const equipment = unit.equipment || unit.entity?.equipment;
      if (equipment && equipment.necklace) {
        const itemId = equipment.necklace.itemId || equipment.necklace.id;
        const nk = (window.GAME_DATA?.ITEMS && window.GAME_DATA.ITEMS[itemId]) || equipment.necklace;
        return nk.element || null;
      }
      return null;
    }
    if (unit.element) return unit.element;
    if (unit.entity && unit.entity.element) return unit.entity.element;
    if (unit.templateId && window.GAME_DATA?.PETS?.[unit.templateId]?.element) {
      return window.GAME_DATA.PETS[unit.templateId].element;
    }
    if (typeof Character !== 'undefined' && Character.inferMonsterElement) {
      return Character.inferMonsterElement(unit.name, unit.modelId || unit.appearance || unit.id);
    }
    return null;
  }

  constructor(player, activePets = [], enemies = [], options = {}) {
    this.player = player;
    // 确保 activePets 为数组（最多3只，根据玩家等级）
    const maxPets = player.getMaxCombatPets ? player.getMaxCombatPets() : 1;
    this.activePets = (Array.isArray(activePets) ? activePets : (activePets ? [activePets] : [])).slice(0, maxPets);
    this.enemies = Array.isArray(enemies) ? enemies : (enemies ? [enemies] : []); // 敌方单位数组
    this.options = options || {};

    this.round = 1;
    this.status = 'player_input'; // 'player_input' | 'executing' | 'victory' | 'defeat' | 'escaped'
    this.logs = [];

    // 己方出战单位实体包装
    this.allies = [];
    this.rebuildAllies();

    // 敌方单位状态初始化
    this.enemies.forEach((e, idx) => {
      e.enemyIndex = idx;
      e.buffs = e.buffs || [];
      // maxHp 为 0 或缺失时必须给出正数上限，否则伤害恒为 0、复活成 1 血但上限 0、血条 NaN
      e.maxHp = (Number.isFinite(e.maxHp) && e.maxHp > 0) ? e.maxHp : (Number.isFinite(e.hp) && e.hp > 0 ? e.hp : 100);
      e.hp = Number.isFinite(e.hp) ? e.hp : e.maxHp;
      e.maxMp = (Number.isFinite(e.maxMp) && e.maxMp > 0) ? e.maxMp : (Number.isFinite(e.mp) && e.mp > 0 ? e.mp : 100);
      e.mp = Number.isFinite(e.mp) ? e.mp : e.maxMp;
      e.templateId = e.templateId || window.ShanhaiSystem.resolveSpecies(e, window.App2D?.currentMapId);
      const species = window.GAME_DATA.PETS[e.templateId];
      e.quality = species?.quality || e.quality || 'ordinary';
      e.element = species?.element || e.element;
      e.gender = e.gender || species?.gender || (Math.random() < 0.5 ? 'male' : 'female');
    });

    // 临时指令集
    this.actions = {}; // key: ally.id -> action
    this.turnQueue = []; // 全场速度队列

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

    // 计算初始速度序数
    this.calcTurnOrders();

    // 专属 Boss 意图机制 (P1: 银角大王“移山压顶”等机制样板)
    this.bossIntents = [];
    this.updateBossIntents();
  }

  // 刷新与推进 Boss 专属战术意图 (回合初与每轮行动前确定并公开)
  updateBossIntents() {
    this.bossIntents = this.bossIntents || [];
    const aliveEnemies = (typeof this.getAliveEnemies === 'function') ? this.getAliveEnemies() : this.enemies.filter(e => e.hp > 0);
    const yinjiao = aliveEnemies.find(e => e.id === 'boss_yinjiao');
    if (!yinjiao) {
      this.bossIntents = this.bossIntents.filter(i => i.enemyId !== 'boss_yinjiao');
      return;
    }

    // 银角大王 3 回合意图循环：
    // 第 1 轮 (3n+1): 蓄力并预告下回合发动【移山压顶】
    // 第 2 轮 (3n+2): 锁定执行轮 (若被控制则中断，若目标阵亡则取消，若防御则减伤60%)
    // 第 3 轮 (3n): 喘息轮 (调匀气息，不施展强招)
    const cycleTurn = ((this.round - 1) % 3) + 1;
    let yinjiaoIntent = this.bossIntents.find(i => i.enemyId === 'boss_yinjiao');

    if (cycleTurn === 1) {
      const aliveAllies = (typeof this.getAliveAllies === 'function') ? this.getAliveAllies() : this.allies.filter(a => a.hp > 0);
      if (!aliveAllies.length) return;
      const targetAlly = aliveAllies.find(a => a.isPlayer) || aliveAllies[0];

      yinjiaoIntent = {
        id: 'intent_yinjiao_yishan',
        enemyId: yinjiao.id,
        enemyIndex: yinjiao.enemyIndex,
        enemyName: yinjiao.name,
        skillId: 'yishan_yading',
        skillName: '移山压顶',
        targetId: targetAlly.id,
        targetName: targetAlly.name,
        telegraphRound: this.round,
        executeRound: this.round + 1,
        status: 'telegraphed',
        warningText: `【预警】银角大王正在搬运须弥峨眉泰山，锁定了【${targetAlly.name}】！下一回合将施展【移山压顶】！防御可大幅减轻伤害！`
      };
      this.bossIntents = this.bossIntents.filter(i => i.enemyId !== 'boss_yinjiao').concat(yinjiaoIntent);
      this.log(`【移山预告】银角大王脚踏罡斗，口念真言，搬来巍峨大山虚影笼罩在【${targetAlly.name}】头顶！下一回合将施展【移山压顶】！防御可减轻60%伤害！`);
    } else if (cycleTurn === 2) {
      if (!yinjiaoIntent || yinjiaoIntent.executeRound !== this.round) {
        const aliveAllies = (typeof this.getAliveAllies === 'function') ? this.getAliveAllies() : this.allies.filter(a => a.hp > 0);
        const targetAlly = aliveAllies.find(a => a.isPlayer) || aliveAllies[0];
        if (targetAlly) {
          yinjiaoIntent = {
            id: 'intent_yinjiao_yishan',
            enemyId: yinjiao.id,
            enemyIndex: yinjiao.enemyIndex,
            enemyName: yinjiao.name,
            skillId: 'yishan_yading',
            skillName: '移山压顶',
            targetId: targetAlly.id,
            targetName: targetAlly.name,
            telegraphRound: this.round - 1,
            executeRound: this.round,
            status: 'telegraphed',
            warningText: `【预警】银角大王锁定了【${targetAlly.name}】！本回合将发动【移山压顶】！请做好防御或打断！`
          };
          this.bossIntents = this.bossIntents.filter(i => i.enemyId !== 'boss_yinjiao').concat(yinjiaoIntent);
        }
      }
    } else if (cycleTurn === 3) {
      yinjiaoIntent = {
        id: 'intent_yinjiao_breathing',
        enemyId: yinjiao.id,
        enemyIndex: yinjiao.enemyIndex,
        enemyName: yinjiao.name,
        skillId: 'breathing',
        skillName: '调匀气息',
        status: 'breathing',
        warningText: `【调匀气息】银角大王移山真元耗竭，本回合正在调匀气息，无法施展强力法术！`
      };
      this.bossIntents = this.bossIntents.filter(i => i.enemyId !== 'boss_yinjiao').concat(yinjiaoIntent);
      this.log(`【气脉亏耗】银角大王移山法力消耗甚巨，正在调匀气息，本回合无法施展强力法术！`);
    }
  }

  getBossIntents() {
    return this.bossIntents || [];
  }

  // 安全访问接口
  get playerBuffs() {
    const player = this.allies.find(a => a.isPlayer);
    return player ? (player.buffs || []) : [];
  }

  get enemyBuffs() {
    return this.enemies.map(e => e.buffs || []);
  }

  setPlayerAction(action) {
    const player = this.allies.find(a => a.isPlayer);
    if (player) {
      this.setAllyAction(player.id, action);
    }
  }

  log(msg) {
    this.logs.push(msg);
  }

  // 重构己方战斗阵列
  rebuildAllies() {
    const classId = this.player.classId || this.player.class || 'jingang';
    // 天生抗性与装备/门派抗性必须累加，直接 Object.assign 会让 5% 门派加值覆盖 20% 天生抗性
    const merged = {};
    const addRes = (src) => {
      if (!src || typeof src !== 'object') return;
      for (const [k, v] of Object.entries(src)) {
        if (!Number.isFinite(v)) continue;
        merged[k] = (merged[k] || 0) + v;
      }
    };
    if (window.SkillMasteryEngine) addRes(window.SkillMasteryEngine.getInnateResistances(classId));
    addRes(this.player.resistances || {});
    const playerRes = merged;

    this.allies = [
      {
        id: 'player',
        type: 'player',
        name: this.player.name,
        level: this.player.level,
        classId: classId,
        isPlayer: true,
        entity: this.player,
        hp: this.player.hp,
        maxHp: this.player.maxHp,
        mp: this.player.mp,
        maxMp: this.player.maxMp,
        atk: this.player.atk,
        matk: this.player.matk,
        mdef: this.player.mdef,
        def: this.player.def,
        spd: this.player.spd,
        resistances: playerRes,
        critRate: this.player.critRate || 0.08,
        comboRate: this.player.comboRate || 0.05,
        fatalRate: this.player.fatalRate || 0.02,
        dodgeRate: this.player.dodgeRate || 0.05,
        skills: this.normalizeSkills(this.player.getSkills ? this.player.getSkills() : (this.player.skills || []), this.player.gender || 'male'),
        buffs: []
      }
    ];

    this.activePets.forEach((pet, idx) => {
      if (pet) {
        this.allies.push({
          id: 'pet_' + idx,
          type: 'pet',
          petIndex: idx,
          name: pet.name,
          level: pet.level,
          modelId: pet.modelId || pet.appearance || pet.portraitId,
          roleId: pet.roleId || pet.portraitId,
          isPlayer: false,
          entity: pet,
          hp: pet.hp,
          maxHp: pet.maxHp,
          mp: pet.mp,
          maxMp: pet.maxMp,
          atk: pet.atk,
          matk: pet.matk,
          mdef: pet.mdef,
          resistances: pet.resistances || {},
          def: pet.def,
          spd: pet.spd,
          critRate: pet.critRate || 0.08,
          comboRate: pet.comboRate || 0.05,
          fatalRate: pet.fatalRate || 0.02,
          dodgeRate: pet.dodgeRate || 0.05,
          skills: this.normalizeSkills(pet.skills, pet.gender || 'male'),
          buffs: []
        });
      }
    });
  }

  // 旧剧情同伴使用技能名称字符串；在战斗入口转成可执行技能对象，并严格执行性别专属排他法则。
  normalizeSkills(skills = [], unitGender = 'male') {
    const classSkills = Object.values(window.GAME_DATA?.CLASSES || {}).flatMap(c =>
      Array.isArray(c.skills) ? c.skills : Object.values(c.skills || {}).flat());
    let list = (skills || []).map((skill, index) => {
      if (typeof skill !== 'string') return skill;
      const known = classSkills.find(s => s.name === skill);
      return known ? { ...known, level: 1, mastery: 0 } :
        { id: 'companion_skill_' + index, name: skill, level: 1, mastery: 0, costMp: 15 };
    });

    const g = (unitGender === 'female') ? 'female' : 'male';
    list = list.filter(s => {
      if (!s) return false;
      const name = s.name || s.id || '';
      const id = s.id || '';
      if (g === 'female') {
        if (name === '佛光普照' || id === 'sk_jg_foguang') return false;
        if (name === '雷霆万钧' || id === 'sk_ym_leiting') return false;
        if (name === '乱魂咒' || id === 'sk_xr_luanhun') return false;
      } else {
        if (name === '如来神掌' || id === 'sk_jg_ruxiang') return false;
        if (name === '万毒攻心' || id === 'sk_ym_wandu') return false;
        if (name === '封印咒' || id === 'sk_xr_fengyin') return false;
      }
      return true;
    });

    // 确保同一角色严格只能保留【佛光普照】或【如来神掌】其中一个
    const hasFoguang = list.some(s => (s.name === '佛光普照' || s.id === 'sk_jg_foguang'));
    const hasRuxiang = list.some(s => (s.name === '如来神掌' || s.id === 'sk_jg_ruxiang'));
    if (hasFoguang && hasRuxiang) {
      list = list.filter(s => g === 'female'
        ? (s.name !== '佛光普照' && s.id !== 'sk_jg_foguang')
        : (s.name !== '如来神掌' && s.id !== 'sk_jg_ruxiang'));
    }

    return list;
  }

  getAliveAllies() {
    return (this.allies || []).filter(a => a.hp === undefined || a.hp > 0);
  }

  getAliveEnemies() {
    return (this.enemies || []).filter(e => e.hp === undefined || e.hp > 0);
  }

  // 检查是否所有存活己方都已确认指令
  isAllAlliesReady() {
    const alive = this.getAliveAllies();
    return alive.length > 0 && alive.every(a => a.isReady || (this.actions && !!this.actions[a.id]));
  }

  /**
   * 汉风西游全新核心战斗数值法则与公式结算
   * 1. 闪避判定：跳过伤害(0)，显示 MISS，打断连击
   * 2. 致命一击：无视防御和物理抗性，按目标最大血量真实伤害
   * 3. 基础伤害：atk - def，若 def >= atk 保底 1 点伤害
   * 4. 暴击判定：造成 1.5 倍伤害
   * 5. 连击判定：连续追击 1~3 次，每次伤害为上一次的一半 (减半下取整保底1)
   * 6. 随机浮动：±10% (0.90 ~ 1.10)
   */
  static calculateAttackDamage(attacker, target, options = {}) {
    // 虚弱（黄眉老祖）：按 buff 上的 weakenRatio 削减攻击方实际攻击力
    const weakenRatio = Math.max(0, ...((attacker.buffs || []).map(b => Number(b.weakenRatio) || 0)));
    const rawAtk = attacker.atk || (attacker.entity && attacker.entity.atk) || 50;
    const atkVal = Math.max(1, Math.floor(rawAtk * (1 - Math.min(0.8, weakenRatio))));
    const baseDef = target.def !== undefined ? target.def : ((target.entity && target.entity.def) || 20);
    const protection = Math.max(0, ...(target.buffs || []).map(b => b.defBonusRate || 0));
    const defVal = baseDef * (1 + protection);
    const maxHpTarget = target.maxHp || (target.entity && target.entity.maxHp) || 200;

    const dodgeRate = target.dodgeRate !== undefined ? target.dodgeRate : ((target.entity && target.entity.dodgeRate) || 0.05);
    const fatalRate = attacker.fatalRate !== undefined ? attacker.fatalRate : ((attacker.entity && attacker.entity.fatalRate) || 0.02);
    const critRate = attacker.critRate !== undefined ? attacker.critRate : ((attacker.entity && attacker.entity.critRate) || 0.08);
    const comboRate = attacker.comboRate !== undefined ? attacker.comboRate : ((attacker.entity && attacker.entity.comboRate) || 0.05);

    const passives = (attacker.entity && attacker.entity.passives) || (attacker.passives) || [];
    const targetPassives = (target.entity && target.entity.passives) || (target.passives) || [];

    // 计算最终闪避率：高级闪避被动 + 隐身等 buff 提供的临时闪避
    const hasHighDodge = targetPassives.some(p => p.id === 'high_dodge' || p.name === '高级闪避');
    const buffDodge = Math.max(0, ...((target.buffs || []).map(b => Number(b.dodgeBonus) || 0)));
    const finalDodgeRate = Math.min(0.75, dodgeRate + (hasHighDodge ? 0.15 : 0) + buffDodge);

    // 序章剧情战役（天蓬战、大圣战）保证演出打击感与剧情爽感，默认不被普通闪避打断
    const isPrologueBattle = (target.id === 'tianpeng_boss' || attacker.id === 'tianpeng_boss' || target.id === 'wukong_havoc_boss' || attacker.id === 'wukong_havoc_boss');
    const isDodge = options.forceDodge !== undefined ? options.forceDodge : (isPrologueBattle ? false : (Math.random() < finalDodgeRate));

    if (isDodge) {
      return {
        isDodge: true,
        isFatal: false,
        isCrit: false,
        comboCount: 0,
        damages: [0],
        comboHits: [],
        totalDamage: 0
      };
    }

    // 防御姿态减免
    const isDefending = target.buffs && target.buffs.some(b => b.name === '防御');
    const defStanceMult = isDefending ? 0.5 : 1.0;

    // ±10% 伤害浮动函数 (0.90 ~ 1.10)
    const getFlux = () => {
      if (options.dmgFluctuate !== undefined) return options.dmgFluctuate;
      if (options.mockRandomFlux !== undefined) return options.mockRandomFlux;
      return 0.90 + Math.random() * 0.20;
    };

    // === 前戏剧情战役专属数值法则（刘家村前的序章天宫战役）===
    // 1. 玩家大战醉酒天蓬元帅：玩家普攻打天蓬约 45% 血，天蓬打玩家约 10% 血
    if (target.id === 'tianpeng_boss') {
      const flux = getFlux();
      const tpDmg = Math.max(1, Math.floor(maxHpTarget * 0.45 * flux));
      return {
        isDodge: false,
        isFatal: false,
        isCrit: false,
        comboCount: 0,
        damages: [tpDmg],
        comboHits: [tpDmg],
        totalDamage: tpDmg
      };
    }
    if (attacker.id === 'tianpeng_boss') {
      const flux = getFlux();
      const pDmg = Math.max(1, Math.floor(maxHpTarget * 0.10 * flux));
      return {
        isDodge: false,
        isFatal: false,
        isCrit: false,
        comboCount: 0,
        damages: [pDmg],
        comboHits: [pDmg],
        totalDamage: pDmg
      };
    }

    // 2. 四天将大阵决战齐天大圣：队友打大圣约 5% 血，大圣出手神威极境一下秒一人
    if (target.id === 'wukong_havoc_boss') {
      const flux = getFlux();
      const wkDmg = Math.max(1, Math.floor(maxHpTarget * 0.05 * flux));
      return {
        isDodge: false,
        isFatal: false,
        isCrit: false,
        comboCount: 0,
        damages: [wkDmg],
        comboHits: [wkDmg],
        totalDamage: wkDmg
      };
    }
    if (attacker.id === 'wukong_havoc_boss') {
      const killDmg = Math.max(target.hp || 0, maxHpTarget);
      return {
        isDodge: false,
        isFatal: true,
        isCrit: true,
        comboCount: 0,
        damages: [killDmg],
        comboHits: [killDmg],
        totalDamage: killDmg
      };
    }

    // 2. 致命一击判定 (无视防御与物理抗性，按目标生命值百分比造成真实伤害)
    const isFatal = options.forceFatal !== undefined ? options.forceFatal : (Math.random() < fatalRate);
    if (isFatal) {
      const isBoss = target.isBoss;
      const ratio = isBoss ? 0.08 : 0.20; // 20% 最大生命真实伤害 (Boss 8%)
      const fatalDmg = Math.max(1, Math.floor(maxHpTarget * ratio * getFlux() * defStanceMult));
      return {
        isDodge: false,
        isFatal: true,
        isCrit: false,
        comboCount: 0,
        damages: [fatalDmg],
        comboHits: [fatalDmg],
        totalDamage: fatalDmg
      };
    }

    // 3. 基础伤害 = 攻击力 - 防御力；当防御高于或等于攻击时，根据攻击者攻击力与等级提供合理的破坚保底伤害，杜绝强制截断为 1 的抓痒
    let baseDamage;
    if (atkVal > defVal) {
      baseDamage = Math.max(1, atkVal - defVal);
    } else {
      // 攻不破防时的保底穿透伤害 (保底为攻击力的 18%~25%，且至少保底 Math.min(atkVal, 4))
      const minRatio = 0.18 + Math.min(0.08, (attacker.level || 1) * 0.005);
      const minFloor = Math.min(atkVal, Math.max(1, Math.floor((attacker.level || 1) * 1.5)));
      baseDamage = Math.max(1, Math.max(minFloor, Math.floor(atkVal * minRatio)));
    }

    // 物理抗性减免 (区别于防御力数值减免)
    const resPhy = (target.resistances && target.resistances.res_phy) || (target.entity && target.entity.resistances && target.entity.resistances.res_phy) || 0;
    const resMult = Math.max(0, 1 - resPhy);

    // 4. 暴击率判定 (普通攻击造成 1.5 倍伤害)
    let finalCritRate = critRate;
    if (passives.some(p => p.id === 'high_critical')) finalCritRate += 0.20;
    const isCrit = options.forceCrit !== undefined ? options.forceCrit : (Math.random() < finalCritRate);
    const critMult = isCrit ? 1.5 : 1.0;

    // 偷袭增伤
    const sneakMult = passives.some(p => p.id === 'high_sneak') ? 1.15 : 1.0;

    // 五行属性相克计算 (金克木、木克土、土克水、水克火、火克金)
    const elemA = BattleEngine.getEntityElement(attacker);
    const elemB = BattleEngine.getEntityElement(target);
    const elemRel = FiveElements.checkRestraint(elemA, elemB);
    const elemMult = FiveElements.getDamageMultiplier(elemA, elemB, options);

    // 主击伤害 (五行克制乘数与暴击、偷袭乘算，暴击数值在克制基础上进一步放大提升)
    const firstDmg = Math.max(1, Math.floor(baseDamage * critMult * sneakMult * defStanceMult * resMult * getFlux() * elemMult));

    // 5. 连击率判定 (概率连击1~3次，每次连击伤害为上一次的一半)
    let finalComboRate = comboRate;
    if (passives.some(p => p.id === 'high_combo')) finalComboRate += 0.25;
    const triggerCombo = options.forceCombo !== undefined ? options.forceCombo : (Math.random() < finalComboRate);

    const damages = [firstDmg];
    let comboCount = 0;
    if (triggerCombo) {
      const maxCombos = options.forceComboCount !== undefined ? options.forceComboCount : (1 + Math.floor(Math.random() * 3)); // 1~3次
      comboCount = maxCombos;
      let prevDmg = firstDmg;
      for (let c = 0; c < maxCombos; c++) {
        const nextDmg = Math.max(1, Math.floor(prevDmg * 0.5)); // 每次连击伤害减半
        damages.push(nextDmg);
        prevDmg = nextDmg;
      }
    }

    const totalDamage = damages.reduce((sum, d) => sum + d, 0);

    return {
      isDodge: false,
      isFatal: false,
      isCrit: isCrit,
      elementRelation: elemRel,
      elemMult: elemMult,
      attackerElement: elemA,
      targetElement: elemB,
      comboCount: comboCount,
      damages: damages,
      comboHits: damages,
      totalDamage: totalDamage
    };
  }

  // 同步血量与蓝量至真实数据对象
  syncStateBack() {
    // 玩家
    const pAlly = this.allies.find(a => a.isPlayer);
    if (pAlly) {
      this.player.hp = Math.max(0, Math.min(this.player.maxHp, pAlly.hp));
      this.player.mp = Math.max(0, Math.min(this.player.maxMp, pAlly.mp));
    }
    // 仙宠
    this.allies.filter(a => a.type === 'pet').forEach(a => {
      if (a.entity) {
        a.entity.hp = Math.max(0, Math.min(a.entity.maxHp, a.hp));
        a.entity.mp = Math.max(0, Math.min(a.entity.maxMp, a.mp));
      }
    });
  }

  // 计算全场行动顺序序数 (①, ②, ③, ④...)
  calcTurnOrders() {
    const aliveUnits = [];

    // 存活己方
    this.allies.forEach(a => {
      if (a.hp > 0) {
        aliveUnits.push({
          unit: a,
          side: 'ally',
          spd: BattleEngine.getEffectiveSpd(a),
          id: a.id,
          name: a.name
        });
      }
    });

    // 存活敌方
    this.enemies.forEach(e => {
      if (e.hp > 0) {
        aliveUnits.push({
          unit: e,
          side: 'enemy',
          spd: BattleEngine.getEffectiveSpd(e),
          id: 'enemy_' + e.enemyIndex,
          name: e.name
        });
      }
    });

    // 按速度从大到小排序
    aliveUnits.sort((u1, u2) => u2.spd - u1.spd);

    // 分配序号
    aliveUnits.forEach((item, index) => {
      item.level = item.unit.level;
      item.turnOrder = index + 1;
      item.unit.turnOrder = index + 1;
      if (item.unit.entity) {
        item.unit.entity.turnOrder = index + 1;
      }
    });

    this.turnQueue = aliveUnits;
  }

  // 获取尚未输入指令的己方单位列表
  getPendingAllyInputs() {
    return this.allies
      .filter(a => a.hp > 0 && !this.actions[a.id])
      .sort((a1, a2) => (a1.turnOrder || 99) - (a2.turnOrder || 99));
  }

  // 为某个己方单位设置指令
  setAllyAction(allyId, action) {
    this.actions[allyId] = action;
  }

  // 替换仙宠（仅仙宠单位可用，玩家不可替换，同时支持战斗槽位ID与实例ID）
  switchPet(allyId, newPetInstanceId, availablePets = []) {
    const ally = this.allies.find(a => a.id === allyId || (a.entity && a.entity.instanceId === allyId));
    if (!ally || ally.isPlayer) {
      return { success: false, msg: '玩家本尊不可被替换，仅仙宠可替换出战！' };
    }

    const targetPet = availablePets.find(p => p.instanceId === newPetInstanceId);
    if (!targetPet) {
      return { success: false, msg: '随行仙宠不存在！' };
    }

    // 先把被换下的仙宠保存当前血量
    if (ally.entity) {
      ally.entity.hp = ally.hp;
      ally.entity.mp = ally.mp;
    }

    // 替换为新仙宠 (保留其原有的血量和法力)
    ally.id = targetPet.instanceId;
    ally.instanceId = targetPet.instanceId;
    ally.entity = targetPet;
    ally.name = targetPet.name;
    ally.level = targetPet.level;
    ally.modelId = targetPet.modelId || targetPet.appearance || targetPet.portraitId;
    ally.roleId = targetPet.roleId || targetPet.portraitId;
    ally.classId = targetPet.classId;
    ally.atk = targetPet.atk;
    ally.def = targetPet.def;
    ally.matk = targetPet.matk;
    ally.mdef = targetPet.mdef;
    ally.resistances = targetPet.resistances || {};
    ally.critRate = targetPet.critRate || 0.08;
    ally.comboRate = targetPet.comboRate || 0.05;
    ally.fatalRate = targetPet.fatalRate || 0.02;
    ally.dodgeRate = targetPet.dodgeRate || 0.05;
    ally.hp = targetPet.hp;
    ally.maxHp = targetPet.maxHp;
    ally.mp = targetPet.mp;
    ally.maxMp = targetPet.maxMp;
    ally.spd = targetPet.spd;
    ally.skills = this.normalizeSkills(targetPet.skills);
    ally.buffs = [];

    // 更新 activePets 数组
    if (this.activePets[ally.petIndex]) {
      this.activePets[ally.petIndex] = targetPet;
    }

    // 重新排序速度
    this.calcTurnOrders();

    this.log(`【仙宠降临】一道金芒闪烁，灵宠【${targetPet.name}】奉诏入场参战！(当前HP: ${targetPet.hp}/${targetPet.maxHp})`);
    return {
      success: true,
      msg: `成功将【${targetPet.name}】召唤出战！`
    };
  }

  // 便捷招降接口
  async captureMonster(targetIndex, cb) {
    const targetEnemy = this.enemies[targetIndex];
    if (!targetEnemy || targetEnemy.hp <= 0) return { success: false, msg: '目标不存在或已阵亡！' };
    if (targetEnemy.isBoss) return { success: false, msg: '首领妖王意志如铁，无法被招降！' };

    const q = targetEnemy.quality || 'ordinary';
    const inv = window.App2D ? window.App2D.inventory : null;

    if (q === 'sanxian') {
      if (!inv || inv.getItemCount('silver_gourd') < 1) {
        return { success: false, msg: '缺少法宝【收仙银壶】（紫竹银葫芦），无法招降散仙野怪！' };
      }
    } else if (q === 'jinxian') {
      if (!inv || inv.getItemCount('gold_gourd') < 1) {
        return { success: false, msg: '缺少法宝【紫金红葫芦】，无法招降金仙圣兽！' };
      }
    }

    let result = null;
    await this.handleAllyTurn(this.allies[0] || { name: '玩家', buffs: [] }, { type: 'capture', targetIndex }, async (res) => {
      result = res;
      if (cb) await cb(res);
    });

    const isSuccess = result && result.type === 'capture_success';
    return {
      success: isSuccess,
      msg: result ? result.text : (isSuccess ? '招降成功' : '招降失败')
    };
  }

  applyDamage(target, damage) {
    if (!target || !Number.isFinite(damage)) return;
    target.hp = Math.max(0, target.hp - damage);
    if (damage > 0) target.buffs = (target.buffs || []).filter(b => b.id !== 'dingshen' && !b.breakOnDamage);
  }

  static playSound(name) {
    if (typeof window !== 'undefined' && window.Sound && typeof window.Sound[name] === 'function') {
      try {
        return window.Sound[name]();
      } catch (e) {}
    }
  }

  tryRebirth(target) {
    if (target.hp !== 0) return false;

    // 金仙九头虫变身天赋：九首重生
    const avatar = BattleEngine.getAvatarTalent(target);
    if (avatar && avatar.def.type === 'reborn' && !target.avatarRebornUsed) {
      target.avatarRebornUsed = true;
      const ratio = avatar.def.getRebornRatio ? avatar.def.getRebornRatio(avatar.points) : 0.30;
      target.hp = Math.max(1, Math.floor(target.maxHp * ratio));
      this.log(`🦅【九首重生】${target.name} 滴血重生，复活并恢复 ${target.hp} 点气血！`);
      BattleEngine.playSound('playSuccess');
      return true;
    }

    const passives = target.entity?.passives || target.passives || [];
    if (!passives.some(p => p.id === 'high_rebirth') || Math.random() >= 0.45) return false;
    target.hp = Math.max(1, Math.floor(target.maxHp * 0.5));
    this.log(`✨【神佑复生】${target.name} 回复 ${target.hp} 点气血！`);
    BattleEngine.playSound('playSuccess');
    return true;
  }

  // =========================================================================
  // 金仙元神变身运行时 (Jinxian Avatar Runtime)
  // 回合初判定变身 → 加载专属天赋 → 回合末递减 → 十二神魔天赋在伤害链真实结算
  // =========================================================================

  // 读取单位当前生效的变身天赋与天赋点 (未变身返回 null)
  static getAvatarTalent(unit) {
    const pet = unit && unit.entity;
    if (!pet || !pet.avatarTransformed || pet.quality !== 'jinxian') return null;
    if (!window.PetSystem || typeof window.PetSystem.getPetAvatarTalent !== 'function') return null;
    const def = window.PetSystem.getPetAvatarTalent(pet);
    if (!def) return null;
    return { def, points: Math.max(0, Math.min(5000, pet.talentPoints || 0)) };
  }

  // 计算单位的实际出手速度：基础速度减去 buff 上的临时减速，
  // 这样黄风怪断速、迟滞等减益到期后可自然还原，不再永久污染 spd。
  static getEffectiveSpd(unit) {
    if (!unit) return 0;
    const base = Number.isFinite(unit.spd) ? unit.spd : 0;
    const penalty = (unit.buffs || []).reduce((sum, b) => {
      const v = Number(b && b.spdPenalty);
      return sum + (Number.isFinite(v) && v > 0 ? v : 0);
    }, 0);
    return Math.max(0, base - penalty);
  }

  // 解析受击方的挂链反击/反震率与变身反震天赋 (此前仅为面板死数据)
  static getCounterTraits(unit) {    let counterAttackRate = 0, counterShockRate = 0, reflectRatio = 0;
    for (const s of [unit, unit && unit.entity]) {
      if (!s) continue;
      if (Number.isFinite(s.counterAttackRate)) counterAttackRate = Math.max(counterAttackRate, s.counterAttackRate);
      if (Number.isFinite(s.counterShockRate)) counterShockRate = Math.max(counterShockRate, s.counterShockRate);
      if (Number.isFinite(s.reflectRatio)) reflectRatio = Math.max(reflectRatio, s.reflectRatio);
    }
    const avatar = BattleEngine.getAvatarTalent(unit);
    if (avatar && avatar.def.type === 'reflect') {
      reflectRatio = Math.max(reflectRatio, avatar.def.getEffects(avatar.points).reflectRatio);
    }
    return { counterAttackRate, counterShockRate, reflectRatio };
  }

  // 受击方防御天赋结算：法力抵扣 → 逆御免伤 → 画皮移伤
  // 返回实际应当扣除的气血与过程说明，法力抵扣不计入气血伤害
  applyAvatarMitigation(defender, rawDamage, options = {}) {
    let damage = Math.max(0, Math.floor(rawDamage || 0));
    const notes = [];
    if (damage <= 0) return { damage: 0, mpAbsorbed: 0, notes };
    const avatar = BattleEngine.getAvatarTalent(defender);

    // 1. 沙僧流沙护体：必中由法力抵扣
    if (avatar && avatar.def.type === 'mp_absorb') {
      const ratio = avatar.def.getMpAbsorbRatio(avatar.points);
      const absorbed = Math.min(damage, Math.floor(defender.mp || 0), Math.floor(damage * ratio));
      if (absorbed > 0) {
        defender.mp = Math.max(0, (defender.mp || 0) - absorbed);
        damage -= absorbed;
        notes.push(`【💧流沙护体】法力抵扣 ${absorbed}`);
      }
    }

    // 2. 银角逆御：已损生命转化为免伤
    if (avatar && avatar.def.type === 'damage_reduction' && damage > 0 && !options.trueDamage) {
      const ratio = avatar.def.getReductionRatio(avatar.points, defender.hp, defender.maxHp);
      if (ratio > 0) {
        const cut = Math.floor(damage * ratio);
        damage -= cut;
        notes.push(`【🛡️羊脂封魄】逆御免伤 ${cut}`);
      }
    }

    // 3. 白骨画皮移伤：按比例转移给场上一名其他单位
    if (avatar && avatar.def.type === 'damage_transfer' && damage > 0) {
      const ratio = avatar.def.getTransferRatio(avatar.points);
      const moved = Math.floor(damage * ratio);
      if (moved > 0) {
        const others = [...this.getAliveAllies(), ...this.getAliveEnemies()].filter(u => u !== defender && u.hp > 0);
        if (others.length) {
          const victim = others[Math.floor(Math.random() * others.length)];
          this.applyDamage(victim, moved);
          damage -= moved;
          notes.push(`【🎭画皮移伤】转移 ${moved} 点给【${victim.name}】`);
        }
      }
    }
    return { damage, mpAbsorbed: 0, notes };
  }

  // 命中后的变身天赋结算：吸血 / 吸蓝 / 断速 / 破障
  applyAvatarOnHit(attacker, target, dealtDamage, options = {}) {
    const notes = [];
    const dealt = Math.max(0, Math.floor(dealtDamage || 0));
    const avatar = BattleEngine.getAvatarTalent(attacker);
    if (!avatar) return notes;
    const isSpell = !!options.isSpell;

    // 红孩儿嗜血 / 黄袍怪普攻吸血
    if (dealt > 0 && (avatar.def.type === 'vampire' || (avatar.def.type === 'vampire_chase' && !isSpell))) {
      const ratio = avatar.def.type === 'vampire'
        ? avatar.def.getVampireRatio(avatar.points)
        : avatar.def.getEffects(avatar.points).vampireRatio;
      const heal = Math.min(Math.floor(dealt * ratio), Math.max(0, attacker.maxHp - attacker.hp));
      if (heal > 0) {
        attacker.hp += heal;
        notes.push(`【🩸嗜血】恢复 ${heal} HP`);
      }
    }

    // 金角吸魂：法术命中抽取法力
    if (dealt > 0 && isSpell && avatar.def.type === 'mp_drain') {
      const ratio = avatar.def.getMpDrainRatio(avatar.points);
      const drained = Math.min(Math.floor((target.mp || 0) * ratio), Math.max(0, attacker.maxMp - attacker.mp));
      if (drained > 0) {
        target.mp = Math.max(0, (target.mp || 0) - drained);
        attacker.mp += drained;
        notes.push(`【💧紫金吸魂】抽取 ${drained} 法力`);
      }
    }

    // 黄风怪断速：命中后强制降低目标速度
    // 必须用临时减益记录并到期还原，直接覆写 target.spd 会让受害者永久低速
    if (dealt > 0 && avatar.def.type === 'speed_slow') {
      const rate = avatar.def.getSlowRate ? avatar.def.getSlowRate(avatar.points) : 0.30;
      if (Math.random() < rate) {
        const others = [...this.getAliveAllies(), ...this.getAliveEnemies()]
          .filter(u => u !== target)
          .map(u => BattleEngine.getEffectiveSpd(u));
        const slowest = others.length ? Math.min(...others) : 0;
        const penalty = Math.max(0, BattleEngine.getEffectiveSpd(target) - slowest);
        target.buffs = target.buffs || [];
        const existing = target.buffs.find(b => b.id === 'slow');
        if (existing) {
          existing.spdPenalty = Math.max(existing.spdPenalty || 0, penalty);
          existing.duration = Math.max(existing.duration || 0, 2);
        } else if (penalty > 0) {
          target.buffs.push({ id: 'slow', name: '迟滞', duration: 2, spdPenalty: penalty, appliedRound: this.round });
        }
        target.avatarSlowed = true;
        notes.push(`【🌪三昧神风】速度降低 ${penalty}（2 回合）`);
        this.calcTurnOrders();
      }
    }

    // 奎木狼星君：造成伤害附加流血2回合
    if (dealt > 0 && avatar.def.type === 'bleed_dot') {
      const ratio = avatar.def.getBleedRatio ? avatar.def.getBleedRatio(avatar.points) : 0.05;
      const dotDmg = Math.max(1, Math.floor((target.maxHp || 100) * ratio));
      target.buffs = target.buffs || [];
      target.buffs.push({
        id: 'bleed',
        name: '流血',
        duration: 2,
        damagePerTurn: dotDmg,
        appliedRound: this.round
      });
      notes.push(`【🩸奎木狼流血】附加2回合流血(每回合-${dotDmg})`);
    }

    // 哪吒三头六臂：攻击概率眩晕目标1回合
    if (dealt > 0 && avatar.def.type === 'stun_strike') {
      const rate = avatar.def.getStunRate ? avatar.def.getStunRate(avatar.points) : 0.35;
      if (Math.random() < rate) {
        target.buffs = target.buffs || [];
        target.buffs.push({
          id: 'dingshen',
          name: '定身',
          duration: 1,
          appliedRound: this.round
        });
        notes.push(`【🪷三头六臂】眩晕目标1回合`);
      }
    }

    // 黄眉老祖：对目标造成伤害使下回合目标伤害降低20% (先手则当回合立即降低)
    if (dealt > 0 && avatar.def.type === 'weaken_strike') {
      const isFaster = (attacker.spd || 0) > (target.spd || 0);
      target.buffs = target.buffs || [];
      target.buffs.push({
        id: 'weaken',
        name: '虚弱',
        duration: isFaster ? 1 : 2,
        weakenRatio: 0.20,
        appliedRound: this.round
      });
      notes.push(`【🔔黄眉老祖】削弱目标20%伤害${isFaster ? '(先手即刻生效)' : '(下回合生效)'}`);
    }

    return notes;
  }

  // 回合初：对出战金仙执行变身判定并加载天赋
  runAvatarTransforms() {
    const events = [];
    for (const ally of this.allies) {
      if (ally.type !== 'pet' || !ally.entity || ally.hp <= 0) continue;
      const pet = ally.entity;
      if (pet.quality !== 'jinxian') continue;
      let res;
      try { res = window.PetSystem.tryTriggerAvatarTransform(pet); } catch (e) { continue; }
      if (!res || !res.triggered) continue;
      ally.avatarTalentId = res.talent ? res.talent.id : null;
      if (res.isNew) this.applyAvatarBuffs(ally, res.talent, res.talentPoints);
      events.push({ allyId: ally.id, name: ally.name, isNew: !!res.isNew, text: res.text || '' });
    }
    if (events.some(e => e.isNew)) this.calcTurnOrders();
    return events;
  }

  // 变身天赋的属性增益 (气血/物攻/速度/法力)，结束后原值复原
  applyAvatarBuffs(ally, talent, points) {
    if (!talent || !ally) return;
    // 快照需覆盖所有可能被改写的字段，否则 maxMp / 抗性 / 反震率会永久膨胀并写回存档
    ally.avatarBase = ally.avatarBase || {
      maxHp: ally.maxHp,
      atk: ally.atk,
      spd: ally.spd,
      maxMp: ally.maxMp,
      mp: ally.mp,
      resistances: Object.assign({}, ally.resistances || {}),
      reflectRatio: ally.reflectRatio || 0
    };
    const base = ally.avatarBase;
    let maxHp = base.maxHp, atk = base.atk, spd = base.spd;
    if (talent.type === 'hp_boost') {
      const b = talent.getHpBoost(points, base.maxHp);
      maxHp = base.maxHp + b.totalBonus;
      ally.hp += b.totalBonus;
    } else if (talent.type === 'atk_boost') {
      const b = talent.getBoosts(points, base.maxHp, base.atk);
      maxHp = base.maxHp + b.flatHp + Math.floor(base.maxHp * b.hpPercent);
      atk = Math.floor(base.atk * (1 + b.atkPercent));
      ally.hp += b.flatHp + Math.floor(base.maxHp * b.hpPercent);
    } else if (talent.type === 'spd_combo') {
      spd = base.spd + talent.getEffects(points).spdBonus;
    } else if (talent.type === 'mp_spd_boost') {
      const b = talent.getBoosts(points, ally.maxMp, base.spd);
      ally.maxMp = (ally.maxMp || 300) + b.mpBonus;
      ally.mp = (ally.mp || 300) + b.mpBonus;
      spd = base.spd + b.spdBonus;
    } else if (talent.type === 'spd_atk_boost') {
      const b = talent.getBoosts(points, base.spd, base.atk);
      spd = base.spd + b.spdBonus;
      atk = base.atk + b.atkBonus;
    } else if (talent.type === 'reflect') {
      const b = talent.getEffects(points);
      ally.reflectRatio = b.reflectRatio;
      ally.resistances = Object.assign({}, ally.resistances, {
        res_phy: (ally.resistances?.res_phy || 0) + b.resBonus,
        res_sanmei: (ally.resistances?.res_sanmei || 0) + b.resBonus,
        res_leiting: (ally.resistances?.res_leiting || 0) + b.resBonus
      });
    }
    ally.maxHp = maxHp; ally.atk = atk; ally.spd = spd;
    ally.avatarTalentId = talent.id;
    ally.avatarTalentType = talent.type;
  }

  // 回合末：递减变身回合并解除天赋
  tickAvatars() {
    const events = [];
    for (const ally of this.allies) {
      if (ally.type !== 'pet' || !ally.entity) continue;
      if (!ally.entity.avatarTransformed && !ally.avatarTalentId) continue;
      const res = (window.PetSystem && typeof window.PetSystem.tickAvatarRound === 'function')
        ? window.PetSystem.tickAvatarRound(ally.entity)
        : { expired: false };
      if (res.expired) {
        const base = ally.avatarBase;
        if (base) {
          ally.maxHp = Math.min(base.maxHp, Math.max(1, ally.maxHp));
          ally.hp = Math.min(ally.hp, ally.maxHp);
          ally.atk = base.atk;
          ally.spd = base.spd;
          // 法力上限/当前法力/抗性/反震率一并还原，否则黄风怪每次变身都会永久膨胀
          if (base.maxMp !== undefined) ally.maxMp = base.maxMp;
          if (base.mp !== undefined) ally.mp = Math.min(ally.mp || 0, ally.maxMp);
          if (base.resistances) ally.resistances = Object.assign({}, base.resistances);
        }
        ally.avatarBase = null;
        ally.avatarTalentId = null;
        ally.avatarTalentType = null;
        ally.reflectRatio = (base && base.reflectRatio) || null;
        events.push({ allyId: ally.id, name: ally.name, text: res.text || '' });
      }
    }
    return events;
  }

  async handleControlState(unit, action, cb) {
    const target = this.allies.includes(unit) ? { target: unit.id } : { targetIndex: unit.enemyIndex };
    const sealed = unit.buffs.some(b => b.id === 'fengyin');
    const bound = unit.buffs.some(b => b.id === 'dingshen') && ['attack', 'skill'].includes(action.type);
    if (sealed || bound) {
      this.log(`【${unit.name}】${sealed ? '封印' : '定身'}未解，本回合无法出招。`);
      if (cb) await cb({ type: 'status_block', ...target, text: sealed ? '封印 · 无法行动' : '定身 · 无法出招' });
      return true;
    }
    if (!unit.buffs.some(b => b.id === 'luanhun')) return false;
    const candidates = [...this.getAliveAllies(), ...this.getAliveEnemies()].filter(t => t !== unit);
    if (!candidates.length) return true;
    const victim = candidates[Math.floor(Math.random() * candidates.length)];
    const result = BattleEngine.calculateAttackDamage(unit, victim);
    if (!result.isDodge) this.applyDamage(victim, result.totalDamage);
    const victimTarget = this.allies.includes(victim) ? { target: victim.id } : { targetIndex: victim.enemyIndex };
    this.log(`【乱魂】${unit.name} 神志混乱，误攻【${victim.name}】！`);
    if (cb) await cb({ type: result.isDodge ? 'dodge' : 'damage',
      attacker: this.allies.includes(unit) ? unit.id : 'enemy_' + unit.enemyIndex,
      ...victimTarget, damage: result.totalDamage, isCrit: result.isCrit,
      text: result.isDodge ? '闪避' : `乱魂误攻 -${result.totalDamage}` });
    return true;
  }

  async settleRoundBuffs(cb) {
    for (const unit of [...this.allies, ...this.enemies]) {
      for (const buff of [...unit.buffs]) {
        // 单位已阵亡时立即停止后续结算，避免对尸体反复放毒花
        if (unit.hp <= 0) break;
        if (buff.id === 'wandu' && buff.appliedRound < this.round && unit.hp > 0) {
          const baseTick = Number(buff.poisonDmg);
          const decay = Number(buff.decayRatio);
          // NaN 防护：非法存档或旧数据会让中毒伤害变 NaN，进而把气血写成 NaN 造成"无损判胜"
          buff.poisonDmg = Math.max(1, Math.floor((Number.isFinite(baseTick) ? baseTick : 1) *
            (Number.isFinite(decay) ? decay : 0.75)));
          this.applyDamage(unit, buff.poisonDmg);
          this.log(`【毒伤】${unit.name} 损失 ${buff.poisonDmg} 点气血。`);
          if (cb) await cb({ type: 'poison_tick', ...(this.allies.includes(unit) ? { target: unit.id } : { targetIndex: unit.enemyIndex }),
            damage: buff.poisonDmg, text: `毒伤 -${buff.poisonDmg}` });
        }
        if (buff.id === 'bleed' && buff.appliedRound < this.round && unit.hp > 0) {
          const tick = Math.max(1, Math.floor(Number(buff.damagePerTurn) || 1));
          this.applyDamage(unit, tick);
          this.log(`【流血】${unit.name} 损失 ${tick} 点气血。`);
          if (cb) await cb({ type: 'poison_tick', ...(this.allies.includes(unit) ? { target: unit.id } : { targetIndex: unit.enemyIndex }),
            damage: tick, text: `流血 -${tick}` });
        }
        // 只在"施加回合之后"递减，保证后手施加的控制至少完整生效一回合。
        // 防御是"本回合内有效"的姿态：新代码用 expiresSameRound 显式标记，
        // 同时保留按名称兜底，兼容旧存档与既有断言里的裸 { name: '防御' } 写法。
        // 五行车阵的 duration 由 advanceCartCycle 单独推进，这里必须跳过，
        // 否则同一回合会被递减两次（恢复期从 2 回合缩成 1 回合）。
        // 黑水换甲与五行车阵同属常驻机制状态，其生命周期不由通用 duration 管理，
        // 必须跳过递减，否则会被误删（换甲本就不带 duration，防御性再排除一次）。
        const isCartState = buff.id === 'hh_cart_state';
        const isArmorState = buff.id === 'hh_armor_state';
        const isStanceBuff = buff.expiresSameRound === true || buff.name === '防御';
        if (!isCartState && !isArmorState && buff.duration !== undefined && (isStanceBuff ||
          (buff.appliedRound !== undefined && buff.appliedRound < this.round))) buff.duration--;
      }
      // 中毒/流血致死也要走复活与死亡判定，与主动攻击链保持一致
      if (unit.hp <= 0) this.tryRebirth(unit);
      // 五行车阵是常驻机制状态，生命周期由 advanceCartCycle 全权管理，
      // 不能被通用到期过滤删除（否则机制只活一轮就消失）。
      unit.buffs = unit.buffs.filter(b => b.duration === undefined || b.duration > 0 ||
        (b && b.id === 'hh_cart_state') || (b && b.id === 'hh_armor_state'));
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
      // 阵眼已破：维持到本轮恢复期结束再重开蓄力。
      // 若 duration 只给 1，破阵反而会让下一轮蓄力提前到来（玩家越努力越挨打）。
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

  // 检查战斗结束
  checkBattleEnd() {
    const aliveEnemies = this.getAliveEnemies();
    const aliveAllies = this.getAliveAllies();

    if (aliveEnemies.length === 0) {
      this.status = 'victory';
      this.syncStateBack();
      return true;
    }

    const playerAlive = this.allies.some(a => a.isPlayer && a.hp > 0);
    if (!playerAlive) {
      this.status = 'defeat';
      this.syncStateBack();
      return true;
    }

    return false;
  }

  // 执行整个回合
  async executeRound(onStepCallback) {
    this.status = 'executing';
    for (const unit of [...this.allies, ...this.enemies]) {
      // appliedRound 的唯一初始化点：把"上一回合遗留但未标时"的 buff 视为上一回合施加，
      // 使其在回合末正常递减一次。新施加的 buff 必须在 push 时显式写入 appliedRound，
      // 否则会被这里当成旧 buff 立刻减一回合（历史缺陷：后手控制时长 ±1 回合）。
      unit.buffs.forEach(b => { if (b.appliedRound === undefined) b.appliedRound = this.round - 1; });
    }

    // 0. 回合初金仙元神变身判定 (早于速度重排，保证变身速度立即生效)
    const avatarEvents = this.runAvatarTransforms();
    for (const ev of avatarEvents) {
      if (!ev.isNew || !ev.text) continue;
      this.log(ev.text);
      if (onStepCallback) {
        const ally = this.allies.find(a => a.id === ev.allyId);
        if (ally) await onStepCallback({ type: 'avatar_transform', target: ally.id, text: '✨ 元神变身' });
      }
    }

    // 1. 为敌方单位自动生成 AI 决策
    const enemyActions = {};
    this.enemies.forEach(enemy => {
      if (enemy.hp > 0) {
        // Boss 专属机制意图优先消费 (P1: 银角大王“移山压顶”)
        const activeIntent = (this.bossIntents || []).find(i =>
          (i.enemyId === enemy.id || i.enemyIndex === enemy.enemyIndex) &&
          i.executeRound === this.round &&
          i.status === 'telegraphed'
        );
        if (activeIntent) {
          enemyActions['enemy_' + enemy.enemyIndex] = {
            type: 'boss_intent',
            intent: activeIntent,
            targetId: activeIntent.targetId
          };
          return;
        }

        const breathingIntent = (this.bossIntents || []).find(i =>
          (i.enemyId === enemy.id || i.enemyIndex === enemy.enemyIndex) &&
          i.status === 'breathing'
        );
        if (breathingIntent) {
          const aliveAllies = this.getAliveAllies();
          if (aliveAllies.length > 0) {
            enemyActions['enemy_' + enemy.enemyIndex] = {
              type: 'attack',
              targetId: aliveAllies[Math.floor(Math.random() * aliveAllies.length)].id
            };
          }
          return;
        }

        const aliveAllies = this.getAliveAllies();
        if (aliveAllies.length > 0) {
          const targetAlly = aliveAllies[Math.floor(Math.random() * aliveAllies.length)];
          const activeSkills = (enemy.skills || []).filter(s => !/^高级/.test(typeof s === 'string' ? s : s.name || ''));
          if (activeSkills.length > 0 && Math.random() < 0.45) {
            enemyActions['enemy_' + enemy.enemyIndex] = {
              type: 'skill',
              skill: activeSkills[Math.floor(Math.random() * activeSkills.length)],
              targetId: targetAlly.id
            };
          } else {
            enemyActions['enemy_' + enemy.enemyIndex] = {
              type: 'attack',
              targetId: targetAlly.id
            };
          }
        }
      }
    });

    // 2. 按照全场速度降序执行
    const queue = [...this.turnQueue].sort((a, b) => {
      let spdA = a.spd;
      let spdB = b.spd;
      const actA = a.side === 'ally' ? this.actions[a.id] : enemyActions[a.id];
      const actB = b.side === 'ally' ? this.actions[b.id] : enemyActions[b.id];
      if (actA && actA.type === 'flee') spdA += 9999;
      if (actB && actB.type === 'flee') spdB += 9999;
      if (actA && actA.type === 'item') spdA += 5000;
      if (actB && actB.type === 'item') spdB += 5000;
      return spdB - spdA;
    });

    for (const actor of queue) {
      if (this.checkBattleEnd()) break;

      if (actor.side === 'ally') {
        const ally = this.allies.find(a => a.id === actor.id);
        if (ally && ally.hp > 0) {
          const act = this.actions[ally.id] || { type: 'attack', targetIndex: 0 };
          await this.handleAllyTurn(ally, act, onStepCallback);
        }
      } else {
        const enemy = this.enemies.find(e => 'enemy_' + e.enemyIndex === actor.id);
        if (enemy && enemy.hp > 0) {
          const act = enemyActions[actor.id] || { type: 'attack', targetId: 'player' };
          await this.handleEnemyTurn(enemy, act, onStepCallback);
        }
      }
      if (this.status === 'escaped') { this.syncStateBack(); return this.status; }
    }

    // 3. 回合末毒素/持续恢复结算
    if (!this.checkBattleEnd()) await this.settleRoundBuffs(onStepCallback);

    // 3.1 回合末递减金仙变身回合并解除天赋
    if (!this.checkBattleEnd()) {
      for (const ev of this.tickAvatars()) {
        if (ev.text) this.log(ev.text);
      }
    }
    this.syncStateBack();

    if (this.checkBattleEnd()) {
      return this.status;
    }

    this.round += 1;
    this.actions = {};
    this.calcTurnOrders();
    this.updateBossIntents();
    this.status = 'player_input';
    return this.status;
  }

  // 己方单位回合行动
  async handleAllyTurn(ally, action, cb) {
    if (await this.handleControlState(ally, action, cb)) return;

    // 逃跑
    if (action.type === 'flee') {
      const fleeSuccess = Math.random() < 0.75;
      if (fleeSuccess) {
        this.status = 'escaped';
        this.log(`【脱离战场】${ally.name} 身形一闪，成功逃离了战斗！`);
        BattleEngine.playSound('playFailure');
        if (cb) await cb({ type: 'flee_success', text: '逃跑成功！' });
      } else {
        this.log(`【逃跑失败】敌人封锁了退路，逃跑失败！`);
        BattleEngine.playSound('playFailure');
        if (cb) await cb({ type: 'flee_fail', text: '逃跑失败！' });
      }
      return;
    }

    // 防御
    if (action.type === 'defend') {
      ally.buffs.push({ id: 'defend', name: '防御', duration: 1, defRate: 0.5, appliedRound: this.round, expiresSameRound: true });
      this.log(`【${ally.name}】摆开防御架势，本回合受到伤害减半！`);
      // 五行车阵：防御同时获得守息避火（蓄力/爆发期且本轮未结算）
      this.applyCartGuard(ally);
      if (cb) await cb({ type: 'defend', target: ally.id, text: '凝神防御！' });
      return;
    }

    // 使用药品：必须先校验持有量并真实扣除，否则战斗可无限吃药、永远打不死
    if (action.type === 'item') {
      const item = window.GAME_DATA.ITEMS[action.itemId];
      const targetAlly = this.allies.find(a => a.id === action.targetAllyId) || ally;
      const inventory = window.App2D?.inventory;
      if (!item || !item.effect) {
        this.log(`【用药失败】未识别的药品。`);
        if (cb) await cb({ type: 'message', text: '未识别的药品' });
        return;
      }
      if (inventory && typeof inventory.getItemCount === 'function' &&
        inventory.getItemCount(action.itemId) < 1) {
        this.log(`【用药失败】${ally.name} 的【${item.name}】已用尽。`);
        if (cb) await cb({ type: 'message', text: `【${item.name}】已用尽` });
        return;
      }

      let healed = 0;
      let restored = 0;
      if (item.effect.hp) {
        const heal = Math.max(0, Math.min(item.effect.hp, targetAlly.maxHp - targetAlly.hp));
        if (heal > 0) {
          targetAlly.hp += heal;
          healed = heal;
          this.log(`【使用药品】${ally.name} 对【${targetAlly.name}】使用了【${item.name}】，恢复了 ${heal} 点气血！`);
          BattleEngine.playSound('playMagic');
          if (cb) await cb({ type: 'heal', target: targetAlly.id, amount: heal, text: `+${heal} HP` });
        }
      }
      if (item.effect.mp) {
        const restore = Math.max(0, Math.min(item.effect.mp, targetAlly.maxMp - targetAlly.mp));
        if (restore > 0) {
          targetAlly.mp += restore;
          restored = restore;
          this.log(`【使用药品】${ally.name} 对【${targetAlly.name}】使用了【${item.name}】，恢复了 ${restore} 点精力！`);
          BattleEngine.playSound('playMagic');
          if (cb) await cb({ type: 'mana', target: targetAlly.id, amount: restore, text: `+${restore} MP` });
        }
      }

      // 只有在真正产生疗效后才扣除药品；无疗效时不浪费玩家的药。
      if (healed > 0 || restored > 0) {
        if (inventory && typeof inventory.removeItem === 'function') {
          inventory.removeItem(action.itemId, 1);
        }
      } else {
        this.log(`【用药无效】${targetAlly.name} 当前气血与精力充盈，无需服用【${item.name}】。`);
        if (cb) await cb({ type: 'message', text: `${targetAlly.name} 状态充盈，未消耗药品` });
      }
      return;
    }

    // 招降保留实际物种、五行、性别与变异身份，不使用默认仙宠冒充目标。
    if (action.type === 'capture') {
      let targetEnemy = this.enemies[action.targetIndex];
      if (!targetEnemy || targetEnemy.hp <= 0) targetEnemy = this.getAliveEnemies()[0];
      if (!targetEnemy || targetEnemy.hp <= 0) return;
      const templateId = window.ShanhaiSystem.resolveSpecies(targetEnemy, window.App2D?.currentMapId);
      const template = window.GAME_DATA.PETS[templateId];
      if (!template || !window.ShanhaiSystem.isCollectible({ ...targetEnemy, templateId })) {
        this.log('【招降失败】首领、剧情神佛或尚未定义的物种无法招降。');
        if (cb) await cb({ type: 'capture_fail', text: '此生灵无法招降！' });
        return;
      }
      const q = template.quality;
      const app = window.App2D;
      if (!Array.isArray(app?.pets)) return;
      const itemId = q === 'sanxian' ? 'silver_gourd' : q === 'jinxian' ? 'gold_gourd' : null;
      // 物品表与代码不同步时，直接读 .name 会抛异常并让整条招降指令空放
      const itemDef = itemId ? window.GAME_DATA.ITEMS[itemId] : null;
      const itemName = itemDef ? itemDef.name : '招降法宝';
      if (itemId && !itemDef) {
        this.log(`【招降失败】法宝数据缺失（${itemId}），请联系维护者修正物品表。`);
        if (cb) await cb({ type: 'capture_fail', text: '法宝数据缺失' });
        return;
      }
      if (itemId && !app.inventory?.removeItem(itemId, 1)) {
        this.log(`【法宝不足】需携带【${itemName}】才能招降。`);
        if (cb) await cb({ type: 'capture_fail', text: `缺少${itemName}！` });
        return;
      }
      const success = Math.random() < (q === 'jinxian' ? 0.60 : q === 'sanxian' ? 0.70 : 0.80);
      if (!success) {
        this.log(`【招降未成】${targetEnemy.name}挣脱了招引${itemId ? '，消耗一只' + itemName : ''}。`);
        if (cb) await cb({ type: 'capture_fail', text: '挣脱招引！' });
        return;
      }
      const pet = window.PetSystem.createPet(templateId, true, targetEnemy.level ?? 1, !!targetEnemy.isMutated);
      if (targetEnemy.gender) pet.gender = targetEnemy.gender;
      targetEnemy.hp = 0;
      targetEnemy.isCaptured = true;
      app.pets.push(pet);
      app.getShanhai?.().observe(pet);
      this.log(`【招降成功】${pet.name}已随行，山海经增添见闻。`);
      BattleEngine.playSound('playSuccess');
      if (cb) await cb({ type: 'capture_success', targetIndex: targetEnemy.enemyIndex, pet, text: '招降成功！' });
      this.checkBattleEnd();
      return;
    }

    // 普通物理攻击
    if (action.type === 'attack') {
      const aliveEnemies = this.getAliveEnemies();
      if (aliveEnemies.length === 0) return;
      let targetEnemy = this.enemies[action.targetIndex];
      if (!targetEnemy || targetEnemy.hp <= 0) {
        targetEnemy = aliveEnemies[0];
      }
      // 目标可能在本回合前序单位结算中全部阵亡，此时本次指令必须放弃而不是写入 undefined
      if (!targetEnemy) {
        this.log(`【指令失效】${ally.name} 先前的目标已阵亡，本次攻击落空。`);
        if (cb) await cb({ type: 'message', text: '目标已阵亡，本次指令失效' });
        return;
      }

      // 调用全新核心法则结算公式
      const attackRes = BattleEngine.calculateAttackDamage(ally, targetEnemy);

      // 1. 闪避判定：跳过伤害(0)，显示 MISS，打断连击
      if (attackRes.isDodge) {
        this.log(`【${targetEnemy.name}】身法如电，轻盈【闪避 MISS】了【${ally.name}】的致命杀招！`);
        if (!cb) BattleEngine.playSound('playFailure');
        if (cb) await cb({
          type: 'dodge',
          attacker: ally.id,
          targetIndex: targetEnemy.enemyIndex,
          text: '闪避 MISS'
        });
        return;
      }

      // 扣除目标生命值 (支持连击总伤与多段衰减)
      // 黑水换甲：按目标当前姿态做物理/法术修正（不改写基础属性）
      const armorHit = BattleEngine.applyArmorMitigation(targetEnemy, attackRes.totalDamage, false);
      this.applyDamage(targetEnemy, armorHit.damage);
      if (armorHit.note) this.log(`　└ ${armorHit.note}`);
      // 五行车阵：玩家主动攻击计入破阵进度
      this.recordCartBreakDamage(ally, targetEnemy, attackRes.totalDamage);

      let logMsg = `【${ally.name}】挥舞神兵，轰击【${targetEnemy.name}】！`;
      if (attackRes.isFatal) {
        logMsg += ` 触发【⚡致命一击】无视防御与物理抗性，贯穿造成 ${attackRes.damages[0]} 点纯正真实伤害！`;
      } else {
        logMsg += ` 造成 ${attackRes.damages[0]} 点物理伤害${attackRes.isCrit ? '（💥暴击1.5倍！）' : ''}！`;
        if (attackRes.comboCount > 0) {
          logMsg += ` 并且激发【🔥连续追击 ${attackRes.comboCount} 次】（连击每次伤害减半：${attackRes.damages.slice(1).join('、')}）！`;
        }
        logMsg += ` 本轮普攻共造成 ${attackRes.totalDamage} 点总伤害！`;
      }
      if (attackRes.elementRelation === 'counter') {
        logMsg += `【⚡五行克制 ${FiveElements.NAMES[attackRes.attackerElement]}克${FiveElements.NAMES[attackRes.targetElement]} +${Math.round((attackRes.elemMult - 1) * 100)}%】`;
      } else if (attackRes.elementRelation === 'countered') {
        logMsg += `【🛡️五行被克 ${FiveElements.NAMES[attackRes.attackerElement]}逢${FiveElements.NAMES[attackRes.targetElement]} -${Math.round((1 - attackRes.elemMult) * 100)}%】`;
      }

      // 命中后的变身天赋结算：嗜血 / 吸蓝 / 断速 / 破障
      const onHitNotes = this.applyAvatarOnHit(ally, targetEnemy, attackRes.totalDamage, { isSpell: false });

      // 高级吸血结算 (仙宠技能)
      const passives = (ally.entity && ally.entity.passives) || (ally.passives) || [];
      const hasHighVampire = passives.some(p => p.id === 'high_vampire');
      if (hasHighVampire && attackRes.totalDamage > 0) {
        const leech = Math.min(Math.floor(attackRes.totalDamage * 0.35), ally.maxHp - ally.hp);
        if (leech > 0) {
          ally.hp += leech;
          logMsg += `【🩸高级吸血恢复 +${leech} HP】`;
        }
      }
      if (onHitNotes.length) logMsg += '　└ ' + onHitNotes.join('　');

      // 黄袍怪噬魂：击杀后概率对随机敌人追加攻击
      if (targetEnemy.hp <= 0) {
        const avatarAfter = BattleEngine.getAvatarTalent(ally);
        if (avatarAfter && avatarAfter.def.type === 'vampire_chase') {
          const chaseRate = avatarAfter.def.getEffects(avatarAfter.points).chaseRate;
          const others = this.getAliveEnemies();
          if (others.length && Math.random() < chaseRate) {
            const next = others[Math.floor(Math.random() * others.length)];
            const chaseRes = BattleEngine.calculateAttackDamage(ally, next);
            if (!chaseRes.isDodge) {
              this.applyDamage(next, chaseRes.totalDamage);
              this.log(`【🌟奎木凶星】${ally.name} 追加追击【${next.name}】，造成 ${chaseRes.totalDamage} 点伤害！`);
              if (cb) await cb({ type: 'damage', attacker: ally.id, targetIndex: next.enemyIndex,
                damage: chaseRes.totalDamage, totalDamage: chaseRes.totalDamage, isCrit: chaseRes.isCrit,
                isFatal: false, comboCount: 0, damages: chaseRes.damages, text: `🌟追击 -${chaseRes.totalDamage}` });
            }
          }
        }
      }

      this.log(logMsg);
      if (!cb) {
        if (attackRes.isFatal || attackRes.isCrit) BattleEngine.playSound('playCrit');
        else BattleEngine.playSound('playHit');
      }

      if (cb) await cb({
        type: 'damage',
        attacker: ally.id,
        targetIndex: targetEnemy.enemyIndex,
        attackResult: attackRes,
        damage: attackRes.damages[0],
        totalDamage: attackRes.totalDamage,
        isCrit: attackRes.isCrit,
        isFatal: attackRes.isFatal,
        comboCount: attackRes.comboCount,
        damages: attackRes.damages,
        text: attackRes.isFatal ? `⚡致命 -${attackRes.damages[0]}` : (attackRes.isCrit ? `💥暴击 -${attackRes.damages[0]}` : `-${attackRes.damages[0]}`)
      });
      return;
    }

    // 释放绝技
    if (action.type === 'skill') {
      await this.handleSkillCast(ally, action, cb);
    }
  }

  // 技能法术详细结算 (抗性抵消与 SkillMasteryEngine 深度集成)
  async handleSkillCast(ally, action, cb) {
    const allSkills = ally.isPlayer
      ? (this.player.getSkills ? this.player.getSkills() : (this.player.skills || []))
      : (ally.skills || []);
    const skillKey = action.skillId || (typeof action.skill === 'string' ? action.skill : (action.skill?.id || action.skill?.name));
    let skill = (skillKey && allSkills.find(s => s.id === skillKey || s.name === skillKey))
      || (typeof action.skill === 'object' && action.skill ? { ...action.skill } : allSkills[0]);
    if (!skill) return;

    // 把真实施放的技能身份交给表现层；不能从最近一条战报猜测法术。
    const onSkillStep = cb;
    cb = onSkillStep ? (event) => onSkillStep({ ...event, skillId: skill.id, skillName: skill.name }) : null;

    skill.level = skill.level || 1;
    skill.mastery = (skill.mastery !== undefined) ? skill.mastery : (skill.proficiency || 0);

    const aliveEnemies = this.getAliveEnemies();
    if (aliveEnemies.length === 0) return;
    let targetEnemy = this.enemies[action.targetIndex];
    if (!targetEnemy || targetEnemy.hp <= 0) {
      targetEnemy = aliveEnemies[0];
    }
    const selectedEnemies = [targetEnemy, ...aliveEnemies.filter(e => e !== targetEnemy)];

    const getAdjustedSkillDamage = (targetUnit, rawDmg) => {
      if (targetUnit.id === 'wukong_havoc_boss') {
        return Math.max(1, Math.floor(targetUnit.maxHp * (0.048 + Math.random() * 0.006)));
      }
      if (targetUnit.id === 'tianpeng_boss') {
        // 序章技能伤害阶序法则：单体绝杀与强大技能必须明显高于普通攻击(普攻约45%)
        if (skill.name === '舍生取义' || skill.id === 'sk_jg_shesheng') {
          return Math.max(1, Math.floor(targetUnit.maxHp * (0.72 + Math.random() * 0.05)));
        }
        if (skill.name === '雷霆万钧' || skill.id === 'sk_ym_leiting') {
          return Math.max(1, Math.floor(targetUnit.maxHp * (0.65 + Math.random() * 0.05)));
        }
        if (skill.name === '佛光普照' || skill.id === 'sk_jg_foguang') {
          return Math.max(1, Math.floor(targetUnit.maxHp * (0.55 + Math.random() * 0.05)));
        }
        return Math.max(1, Math.floor(targetUnit.maxHp * (0.52 + Math.random() * 0.05)));
      }
      if (['舍生取义', '佛光普照', '如来神掌'].includes(skill.name)) return rawDmg;
      const protection = Math.max(0, ...(targetUnit.buffs || []).map(b => b.mdefBonusRate || 0));
      return Math.max(1, Math.floor(rawDmg * (1 - Math.min(0.8, protection))));
    };

    // 1. 金刚系：舍生取义 (自损换爆发核心神技，纯强力技能伤害无破甲)
    if (skill.name === '舍生取义' || skill.id === 'sk_jg_shesheng') {
      // 气血限制法则：当前气血低于 10% 无法施展
      const hpCheck = window.SkillMasteryEngine.canCastShesheng ? window.SkillMasteryEngine.canCastShesheng(ally) : { canCast: ally.hp >= Math.ceil((ally.maxHp || 100) * 0.1) };
      if (!hpCheck.canCast) {
        this.log(`【气血枯竭】${ally.name} 气血不足 10% (${ally.hp}/${ally.maxHp})，无力施展【舍生取义】！(需恢复至 10% 以上方可使用)`);
        if (cb) await cb({ type: 'message', text: '气血低于10%无法施展！' });
        return;
      }

      const calc = window.SkillMasteryEngine.calculateShesheng(ally, targetEnemy, skill.level, skill.mastery);
      if (ally.mp < calc.costMp) {
        this.log(`【法力枯竭】精力不足 (${ally.mp}/${calc.costMp})，无法施展【舍生取义】！`);
        if (cb) await cb({ type: 'status_block', text: '法力不足！', target: ally.id });
        if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
        return;
      }
      ally.mp = Math.max(0, ally.mp - calc.costMp);

      // 自损反噬法则：如果不够单次扣血或刚好耗尽，血量保持在 1，下次因低于 10% 无法使用
      if (calc.selfDamage > 0) {
        if (ally.hp <= calc.selfDamage) {
          ally.hp = 1;
          this.log(`【决死成仁】${ally.name} 承受反噬 ${calc.selfDamage} 点真伤！气血枯竭保持在 1 点濒死，下次无法施展！`);
        } else {
          ally.hp = Math.max(1, ally.hp - calc.selfDamage);
          this.log(`【决死成仁】${ally.name} 自身承受反噬 ${calc.selfDamage} 点真伤！(剩余气血: ${ally.hp})`);
        }
        if (cb) await cb({ type: 'damage', attacker: 'self', target: ally.id, damage: calc.selfDamage, text: `自损 -${calc.selfDamage}` });
      }

      const res = (targetEnemy.resistances && targetEnemy.resistances.res_shesheng) || 0;
      let finalDmg = Math.max(50, Math.floor(calc.damage * (1 - res)));
      finalDmg = getAdjustedSkillDamage(targetEnemy, finalDmg);

      const elemA = BattleEngine.getEntityElement(ally);
      const elemB = BattleEngine.getEntityElement(targetEnemy);
      const elemRel = FiveElements.checkRestraint(elemA, elemB);
      let elemMult = 1.0;
      if (!['tianpeng_boss', 'wukong_havoc_boss'].includes(targetEnemy.id)) {
        elemMult = FiveElements.getDamageMultiplier(elemA, elemB);
        finalDmg = Math.max(1, Math.floor(finalDmg * elemMult));
      }

      this.applyDamage(targetEnemy, finalDmg);
      let sheshengLog = `【舍生取义 Lv.${skill.level}】${ally.name} 悍然轰击【${targetEnemy.name}】造成 ${finalDmg} 点强力技能伤害！`;
      if (elemRel === 'counter') sheshengLog += `【⚡五行克制 ${FiveElements.NAMES[elemA]}克${FiveElements.NAMES[elemB]} +${Math.round((elemMult - 1) * 100)}%】`;
      else if (elemRel === 'countered') sheshengLog += `【🛡️五行被克 ${FiveElements.NAMES[elemA]}逢${FiveElements.NAMES[elemB]} -${Math.round((1 - elemMult) * 100)}%】`;
      this.log(sheshengLog);

      if (!cb && window.Sound) window.Sound.playCrit();
      if (cb) await cb({ type: 'damage', attacker: ally.id, targetIndex: targetEnemy.enemyIndex, damage: finalDmg, text: `舍生 -${finalDmg}` });
      this.rewardSkillProficiency(ally, skill);
      return;
    }

    // 2. 金刚系：佛光普照 (男金刚单体玄击：伤害基数 + 当前生命百分比 + 扣除当前法力百分比)
    if (skill.name === '佛光普照' || skill.id === 'sk_jg_foguang') {
      const calc = window.SkillMasteryEngine.calculateMpDrainAttack(false, ally, targetEnemy, skill.level, skill.mastery);
      if (ally.mp < calc.costMp) {
        this.log(`【法力枯竭】精力不足 (${ally.mp}/${calc.costMp})，无法施展【佛光普照】！`);
        if (cb) await cb({ type: 'status_block', text: '法力不足！', target: ally.id });
        if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
        return;
      }
      ally.mp = Math.max(0, ally.mp - calc.costMp);

      let hpDmg = getAdjustedSkillDamage(targetEnemy, calc.damage);
      const elemA = BattleEngine.getEntityElement(ally);
      const elemB = BattleEngine.getEntityElement(targetEnemy);
      const elemRel = FiveElements.checkRestraint(elemA, elemB);
      let elemMult = 1.0;
      if (!['tianpeng_boss', 'wukong_havoc_boss'].includes(targetEnemy.id)) {
        elemMult = FiveElements.getDamageMultiplier(elemA, elemB);
        hpDmg = Math.max(1, Math.floor(hpDmg * elemMult));
      }

      this.applyDamage(targetEnemy, hpDmg);
      targetEnemy.mp = Math.max(0, (targetEnemy.mp || 0) - calc.mpDrain);
      let foguangLog = `【佛光普照 Lv.${skill.level}】纯阳玄击！对【${targetEnemy.name}】造成【基数${calc.baseDmg} + 当前生命${(calc.hpRatio * 100).toFixed(0)}%】共 ${hpDmg} 点伤害，并焚毁其 ${(calc.mpRatio * 100).toFixed(0)}% (${calc.mpDrain}MP) 法力！(受抗玄击减免)`;
      if (elemRel === 'counter') foguangLog += `【⚡五行克制 ${FiveElements.NAMES[elemA]}克${FiveElements.NAMES[elemB]} +${Math.round((elemMult - 1) * 100)}%】`;
      else if (elemRel === 'countered') foguangLog += `【🛡️五行被克 ${FiveElements.NAMES[elemA]}逢${FiveElements.NAMES[elemB]} -${Math.round((1 - elemMult) * 100)}%】`;
      this.log(foguangLog);

      if (window.Sound) window.Sound.playMagic();
      if (cb) await cb({ type: 'damage', attacker: ally.id, targetIndex: targetEnemy.enemyIndex, damage: hpDmg, text: `玄击 -${hpDmg}` });
      this.rewardSkillProficiency(ally, skill);
      return;
    }

    // 3. 金刚系：如来神掌 (女金刚群体玄击：基数+生命百分比+法力百分比，单体威力低于佛光，升级覆盖多目标)
    if (skill.name === '如来神掌' || skill.id === 'sk_jg_ruxiang') {
      const calc = window.SkillMasteryEngine.calculateMpDrainAttack(true, ally, targetEnemy, skill.level, skill.mastery);
      if (ally.mp < calc.costMp) {
        this.log(`【法力枯竭】精力不足 (${ally.mp}/${calc.costMp})，无法施展【如来神掌】！`);
        if (cb) await cb({ type: 'status_block', text: '法力不足！', target: ally.id });
        if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
        return;
      }
      ally.mp = Math.max(0, ally.mp - calc.costMp);

      const hitTargets = selectedEnemies.slice(0, calc.maxTargets);
      const hits = [];
      const elemA = BattleEngine.getEntityElement(ally);
      for (const e of hitTargets) {
        const targetCalc = window.SkillMasteryEngine.calculateMpDrainAttack(true, ally, e, skill.level, skill.mastery);
        let hpDmg = getAdjustedSkillDamage(e, targetCalc.damage);
        const elemB = BattleEngine.getEntityElement(e);
        if (!['tianpeng_boss', 'wukong_havoc_boss'].includes(e.id)) {
          const elemMult = FiveElements.getDamageMultiplier(elemA, elemB);
          hpDmg = Math.max(1, Math.floor(hpDmg * elemMult));
        }
        this.applyDamage(e, hpDmg);
        e.mp = Math.max(0, (e.mp || 0) - targetCalc.mpDrain);
        hits.push({ type: 'damage', targetIndex: e.enemyIndex, damage: hpDmg, text: `玄击 -${hpDmg}` });
      }
      this.log(`【如来神掌 Lv.${skill.level}】大日如来佛光盖顶！群体玄击轰击敌方 ${hitTargets.length} 个目标！`);
      if (cb) await cb({ ...hits[0], attacker: ally.id, hits });
      if (window.Sound) window.Sound.playHit();
      this.rewardSkillProficiency(ally, skill);
      return;
    }

    // 4. 金刚系：金刚护体 (团队双抗)
    if (skill.name === '金刚护体' || skill.id === 'sk_jg_huti') {
      const calc = window.SkillMasteryEngine.calculateHutiBuff(skill.level, skill.mastery);
      if (ally.mp < calc.costMp) {
        this.log(`【法力枯竭】精力不足 (${ally.mp}/${calc.costMp})，无法施展【金刚护体】！`);
        if (cb) await cb({ type: 'status_block', text: '法力不足！', target: ally.id });
        if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
        return;
      }
      ally.mp = Math.max(0, ally.mp - calc.costMp);

      const aliveAllies = this.allies.filter(a => a.hp > 0).sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp));
      let targets;
      if (action.targetAllyId) {
        const primary = this.allies.find(a => a.id === action.targetAllyId && a.hp > 0);
        if (primary) {
          const others = aliveAllies.filter(a => a.id !== primary.id);
          targets = [primary, ...others].slice(0, calc.targetCount);
        } else {
          targets = aliveAllies.slice(0, calc.targetCount);
        }
      } else {
        targets = aliveAllies.slice(0, calc.targetCount);
      }
      targets.forEach(t => {
        t.buffs = t.buffs || [];
        t.buffs.push({ name: '金刚护体', duration: calc.duration, defBonusRate: calc.resRate, mdefBonusRate: calc.resRate, appliedRound: this.round });
      });
      const names = targets.map(t => t.name).join('、');
      this.log(`【金刚护体 Lv.${skill.level}】罗汉金身普照【${names}】！物防与法抗激增 ${(calc.resRate * 100).toFixed(0)}%！`);
      if (window.Sound) window.Sound.playMagic();
      if (cb) await cb({ type: 'buff', attacker: ally.id, target: 'allies', targetIds: targets.map(t => t.id), text: '金刚护体' });
      this.rewardSkillProficiency(ally, skill);
      return;
    }

    // 5. 妖魔系：雷霆万钧 (男妖魔单体极高法伤高蓝耗)
    if (skill.name === '雷霆万钧' || skill.id === 'sk_ym_leiting') {
      const calc = window.SkillMasteryEngine.calculateLeiting(ally, targetEnemy, skill.level, skill.mastery);
      if (ally.mp < calc.costMp) {
        this.log(`【法力枯竭】妖魔法力消耗巨大 (${ally.mp}/${calc.costMp})，无法引动【雷霆万钧】！`);
        if (cb) await cb({ type: 'status_block', text: '法力不足！', target: ally.id });
        if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
        return;
      }
      ally.mp = Math.max(0, ally.mp - calc.costMp);

      const res = (targetEnemy.resistances && targetEnemy.resistances.res_leiting) || 0;
      let dmg = Math.max(60, Math.floor(calc.damage * (1 - res)));
      dmg = getAdjustedSkillDamage(targetEnemy, dmg);

      const elemA = BattleEngine.getEntityElement(ally);
      const elemB = BattleEngine.getEntityElement(targetEnemy);
      const elemRel = FiveElements.checkRestraint(elemA, elemB);
      let elemMult = 1.0;
      if (!['tianpeng_boss', 'wukong_havoc_boss'].includes(targetEnemy.id)) {
        elemMult = FiveElements.getDamageMultiplier(elemA, elemB);
        dmg = Math.max(1, Math.floor(dmg * elemMult));
      }

      this.applyDamage(targetEnemy, dmg);
      let leitingLog = `【雷霆万钧 Lv.${skill.level}】九霄魔雷裂空轰击！对【${targetEnemy.name}】造成 ${dmg} 点极高雷罚伤害！`;
      if (elemRel === 'counter') leitingLog += `【⚡五行克制 ${FiveElements.NAMES[elemA]}克${FiveElements.NAMES[elemB]} +${Math.round((elemMult - 1) * 100)}%】`;
      else if (elemRel === 'countered') leitingLog += `【🛡️五行被克 ${FiveElements.NAMES[elemA]}逢${FiveElements.NAMES[elemB]} -${Math.round((1 - elemMult) * 100)}%】`;
      this.log(leitingLog);

      if (!cb && window.Sound) window.Sound.playCrit();
      if (cb) await cb({ type: 'damage', attacker: ally.id, targetIndex: targetEnemy.enemyIndex, damage: dmg, text: `雷霆 -${dmg}` });

      // 白龙马变身天赋：八部天龙 (法术连击)
      const avatar = BattleEngine.getAvatarTalent(ally);
      if (avatar && avatar.def.type === 'spell_combo' && targetEnemy.hp > 0) {
        const doubleRate = avatar.def.getDoubleCastRate ? avatar.def.getDoubleCastRate(avatar.points) : 0.35;
        if (Math.random() < doubleRate) {
          const comboDmg = Math.max(1, Math.floor(dmg * 0.5));
          this.applyDamage(targetEnemy, comboDmg);
          this.log(`【🐉八部天龙】法术连击追加轰击【${targetEnemy.name}】，造成 ${comboDmg} 点伤害！`);
          if (cb) await cb({ type: 'damage', attacker: ally.id, targetIndex: targetEnemy.enemyIndex, damage: comboDmg, text: `连击 -${comboDmg}` });
        }
      }

      this.rewardSkillProficiency(ally, skill);
      return;
    }

    // 6. 妖魔系：万毒攻心 (女妖魔群体挂毒75%衰减)
    if (skill.name === '万毒攻心' || skill.id === 'sk_ym_wandu') {
      const calc = window.SkillMasteryEngine.calculateWandu(ally, targetEnemy, skill.level, skill.mastery);
      if (ally.mp < calc.costMp) {
        this.log(`【法力枯竭】精力不足 (${ally.mp}/${calc.costMp})，无法施展【万毒攻心】！`);
        if (cb) await cb({ type: 'status_block', text: '法力不足！', target: ally.id });
        if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
        return;
      }
      ally.mp = Math.max(0, ally.mp - calc.costMp);

      const hitTargets = selectedEnemies.slice(0, calc.maxTargets);
      const hits = [];
      const elemA = BattleEngine.getEntityElement(ally);
      const wanduAvatar = BattleEngine.getAvatarTalent(ally);
      let wanduMult = 1.0;
      if (wanduAvatar && wanduAvatar.def.type === 'poison_boost') {
        wanduMult += (wanduAvatar.def.getPoisonBoost ? wanduAvatar.def.getPoisonBoost(wanduAvatar.points) : 0.45);
      }
      for (const e of hitTargets) {
        const elemB = BattleEngine.getEntityElement(e);
        const ctrlMod = FiveElements.getControlHitModifier(elemA, elemB);
        if (Math.random() < Math.max(0, Math.min(1, calc.hitRate + ctrlMod - (e.resistances?.res_wandu || 0)))) {
          const pDmg = Math.floor(calc.firstRoundDmg * wanduMult);
          e.buffs = e.buffs || [];
          e.buffs.push({ id: 'wandu', name: '中毒', duration: calc.duration, poisonDmg: pDmg, decayRatio: calc.decayRatio, appliedRound: this.round });
          this.applyDamage(e, pDmg);
          hits.push({ type: 'damage', targetIndex: e.enemyIndex, damage: pDmg, text: `毒伤 -${pDmg}` });
        } else {
          hits.push({ type: 'resist', targetIndex: e.enemyIndex, text: '毒术未中' });
        }
      }
      if (cb) await cb({ type: 'cast', attacker: ally.id, hits });
      this.log(`【万毒攻心 Lv.${skill.level}】九幽魔毒侵蚀敌阵 ${hitTargets.length} 人，每回合按75%持续衰减扣血！`);
      if (window.Sound) window.Sound.playMagic();
      this.rewardSkillProficiency(ally, skill);
      return;
    }

    // 7. 妖魔系：三昧真火 / 飞沙走石 (群体必中法术)
    if (skill.name === '三昧真火' || skill.id === 'sk_ym_sanmei' || skill.name === '飞沙走石' || skill.id === 'sk_ym_feisha') {
      const spellTitle = (skill.name === '三昧真火' || skill.id === 'sk_ym_sanmei') ? '三昧真火' : '飞沙走石';
      const calc = window.SkillMasteryEngine.calculateGroupSpell(spellTitle, ally, aliveEnemies.length, skill.level, skill.mastery);
      if (ally.mp < calc.costMp) {
        this.log(`【法力枯竭】群法消耗高昂 (${ally.mp}/${calc.costMp})，无法施展【${spellTitle}】！`);
        if (cb) await cb({ type: 'status_block', text: '法力不足！', target: ally.id });
        if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
        return;
      }
      ally.mp = Math.max(0, ally.mp - calc.costMp);

      const hitTargets = selectedEnemies.slice(0, calc.actualTargets);
      const hits = [];
      const elemA = BattleEngine.getEntityElement(ally);
      const spellAvatar = BattleEngine.getAvatarTalent(ally);
      let spellMult = 1.0;
      if (spellAvatar) {
        if (spellTitle === '三昧真火' && spellAvatar.def.type === 'fire_boost') {
          spellMult += (spellAvatar.def.getFireBoost ? spellAvatar.def.getFireBoost(spellAvatar.points) : 0.40);
        } else if (spellAvatar.def.type === 'wind_fire_boost') {
          spellMult += (spellAvatar.def.getWindFireBoost ? spellAvatar.def.getWindFireBoost(spellAvatar.points) : 0.35);
        }
      }
      for (const e of hitTargets) {
        let dmg = getAdjustedSkillDamage(e, calc.perTargetDamage);
        if (spellMult > 1.0) dmg = Math.floor(dmg * spellMult);
        const elemB = BattleEngine.getEntityElement(e);
        if (!['tianpeng_boss', 'wukong_havoc_boss'].includes(e.id)) {
          const elemMult = FiveElements.getDamageMultiplier(elemA, elemB);
          dmg = Math.max(1, Math.floor(dmg * elemMult));
        }
        this.applyDamage(e, dmg);
        hits.push({ type: 'damage', targetIndex: e.enemyIndex, damage: dmg, text: `${spellTitle} -${dmg}` });
      }
      if (cb) await cb({ ...hits[0], attacker: ally.id, hits });
      this.log(`【${spellTitle} Lv.${skill.level}】神法必中席卷敌方 ${hitTargets.length} 人，轰出 ${Math.floor(calc.totalDamage * spellMult)} 点群伤！`);
      if (window.Sound) window.Sound.playHit();
      this.rewardSkillProficiency(ally, skill);
      return;
    }

    // 8. 仙人系：乱魂咒 (男仙人混乱)
    if (skill.name === '乱魂咒' || skill.id === 'sk_xr_luanhun') {
      const calc = window.SkillMasteryEngine.calculateControlSpell('luanhun', skill.level, skill.mastery);
      if (ally.mp < calc.costMp) {
        this.log(`【法力枯竭】精力不足 (${ally.mp}/${calc.costMp})，无法施展【乱魂咒】！`);
        if (cb) await cb({ type: 'status_block', text: '法力不足！', target: ally.id });
        if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
        return;
      }
      ally.mp = Math.max(0, ally.mp - calc.costMp);

      const hitTargets = selectedEnemies.slice(0, calc.maxTargets);
      const hits = [];
      const elemA = BattleEngine.getEntityElement(ally);
      const luanhunAvatar = BattleEngine.getAvatarTalent(ally);
      const hitBoost = (luanhunAvatar && luanhunAvatar.def.type === 'xianren_hit_boost')
        ? (luanhunAvatar.def.getHitBoost ? luanhunAvatar.def.getHitBoost(luanhunAvatar.points) : 0.25)
        : 0;
      for (const e of hitTargets) {
        const elemB = BattleEngine.getEntityElement(e);
        const ctrlMod = FiveElements.getControlHitModifier(elemA, elemB);
        if (Math.random() < Math.max(0, Math.min(1, calc.hitRate + ctrlMod + hitBoost - (e.resistances?.res_luanhun || 0)))) {
          e.buffs = e.buffs || [];
          e.buffs.push({ id: 'luanhun', name: '混乱', duration: calc.duration, appliedRound: this.round });
          this.log(`【乱魂咒 Lv.${skill.level}】灵犀乱魄，【${e.name}】陷入混乱神智不清！`);
          hits.push({ type: 'luanhun', targetIndex: e.enemyIndex, text: '混乱' });
        } else {
          this.log(`【乱魂未果】${e.name} 灵台清明挣脱了乱魂术！`);
          hits.push({ type: 'resist', targetIndex: e.enemyIndex, text: '乱魂未中' });
        }
      }
      if (cb) await cb({ type: 'cast', attacker: ally.id, hits });
      if (window.Sound) window.Sound.playMagic();
      this.rewardSkillProficiency(ally, skill);
      return;
    }

    // 9. 仙人系：封印咒 (女仙人刚性硬控)
    if (skill.name === '封印咒' || skill.id === 'sk_xr_fengyin') {
      const calc = window.SkillMasteryEngine.calculateControlSpell('fengyin', skill.level, skill.mastery);
      if (ally.mp < calc.costMp) {
        this.log(`【法力枯竭】精力不足 (${ally.mp}/${calc.costMp})，无法施展【封印咒】！`);
        if (cb) await cb({ type: 'status_block', text: '法力不足！', target: ally.id });
        if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
        return;
      }
      ally.mp = Math.max(0, ally.mp - calc.costMp);

      const hitTargets = selectedEnemies.slice(0, calc.maxTargets);
      const hits = [];
      const elemA = BattleEngine.getEntityElement(ally);
      const fengyinAvatar = BattleEngine.getAvatarTalent(ally);
      const hitBoost = (fengyinAvatar && fengyinAvatar.def.type === 'xianren_hit_boost')
        ? (fengyinAvatar.def.getHitBoost ? fengyinAvatar.def.getHitBoost(fengyinAvatar.points) : 0.25)
        : 0;
      for (const e of hitTargets) {
        const elemB = BattleEngine.getEntityElement(e);
        const ctrlMod = FiveElements.getControlHitModifier(elemA, elemB);
        if (Math.random() < Math.max(0, Math.min(1, calc.hitRate + ctrlMod + hitBoost - (e.resistances?.res_fengyin || 0)))) {
          e.buffs = e.buffs || [];
          e.buffs.push({ id: 'fengyin', name: '封印', duration: calc.duration, blocksAllActions: true, appliedRound: this.round });
          this.log(`【封印大成 Lv.${skill.level}】八卦神符化作万道金锁，彻底封禁【${e.name}】！`);
          hits.push({ type: 'sealed', targetIndex: e.enemyIndex, text: '封印' });
        } else {
          this.log(`【封印落空】${e.name} 遁法敏捷闪避了封印！`);
          hits.push({ type: 'resist', targetIndex: e.enemyIndex, text: '封印未中' });
        }
      }
      if (cb) await cb({ type: 'cast', attacker: ally.id, hits });
      if (window.Sound) window.Sound.playMagic();
      this.rewardSkillProficiency(ally, skill);
      return;
    }

    // 10. 仙人系：定身咒 (仙人通用半控，挨打即解)
    if (skill.name === '定身咒' || skill.id === 'sk_xr_dingshen') {
      const calc = window.SkillMasteryEngine.calculateControlSpell('dingshen', skill.level, skill.mastery);
      if (ally.mp < calc.costMp) {
        this.log(`【法力枯竭】精力不足 (${ally.mp}/${calc.costMp})，无法施展【定身咒】！`);
        if (cb) await cb({ type: 'status_block', text: '法力不足！', target: ally.id });
        if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
        return;
      }
      ally.mp = Math.max(0, ally.mp - calc.costMp);

      const hitTargets = selectedEnemies.slice(0, calc.maxTargets);
      const hits = [];
      const elemA = BattleEngine.getEntityElement(ally);
      for (const e of hitTargets) {
        const elemB = BattleEngine.getEntityElement(e);
        const ctrlMod = FiveElements.getControlHitModifier(elemA, elemB);
        if (Math.random() < Math.max(0, Math.min(1, calc.hitRate + ctrlMod - (e.resistances?.res_dingshen || 0)))) {
          e.buffs = e.buffs || [];
          e.buffs.push({ id: 'dingshen', name: '定身', duration: calc.duration, breakOnDamage: true, appliedRound: this.round });
          this.log(`【定身神咒 Lv.${skill.level}】金索缚定【${e.name}】，禁止攻击法术，受击即解！`);
          hits.push({ type: 'dingshen', targetIndex: e.enemyIndex, text: '定身' });
        } else {
          this.log(`【定身落空】定身灵光被【${e.name}】闪避！`);
          hits.push({ type: 'resist', targetIndex: e.enemyIndex, text: '定身未中' });
        }
      }
      if (cb) await cb({ type: 'cast', attacker: ally.id, hits });
      if (window.Sound) window.Sound.playMagic();
      this.rewardSkillProficiency(ally, skill);
      return;
    }

    // 11. 仙人系：隐身咒
    if (skill.name === '隐身咒' || skill.id === 'sk_xr_yinshen') {
      const calc = window.SkillMasteryEngine.calculateControlSpell('yinshen', skill.level, skill.mastery);
      if (ally.mp < calc.costMp) {
        this.log(`【法力枯竭】精力不足 (${ally.mp}/${calc.costMp})，无法施展【隐身咒】！`);
        if (cb) await cb({ type: 'status_block', text: '法力不足！', target: ally.id });
        if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
        return;
      }
      ally.mp = Math.max(0, ally.mp - calc.costMp);

      ally.buffs = ally.buffs || [];
      ally.buffs.push({ id: 'yinshen', name: '隐身潜行', duration: calc.duration, hideAttributes: true, dodgeBonus: calc.dodgeBonus, appliedRound: this.round });
      this.log(`【隐身咒 Lv.${skill.level}】${ally.name} 遁入虚空隐匿血条时序！`);
      if (window.Sound) window.Sound.playMagic();
      if (cb) await cb({ type: 'invis', target: ally.id, text: '隐匿身形！' });
      this.rewardSkillProficiency(ally, skill);
      return;
    }

    // === 通用绝技与仙宠法术保底结算 (保障天雷引等任意绝技不失效、不卡死) ===
    const costMp = skill.costMp || 15;
    if (ally.mp < costMp) {
      this.log(`【精力不足】${ally.name} 精力不足 (${ally.mp}/${costMp})，无法施展【${skill.name}】！`);
      if (cb) await cb({ type: 'message', text: '精力不足无法施法' });
      return;
    }
    ally.mp = Math.max(0, ally.mp - costMp);
    const baseDmg = Math.max(20, Math.floor((ally.atk || 50) * 1.35 + (skill.level || 1) * 20));
    let finalDmg = getAdjustedSkillDamage(targetEnemy, baseDmg);
    const elemA = BattleEngine.getEntityElement(ally);
    const elemB = BattleEngine.getEntityElement(targetEnemy);
    if (!['tianpeng_boss', 'wukong_havoc_boss'].includes(targetEnemy.id)) {
      const elemMult = FiveElements.getDamageMultiplier(elemA, elemB);
      finalDmg = Math.max(1, Math.floor(finalDmg * elemMult));
    }
    this.applyDamage(targetEnemy, finalDmg);
    this.log(`【${skill.name}】${ally.name} 催动玄光法决轰击【${targetEnemy.name}】，造成 ${finalDmg} 点法术重创！`);
    if (window.Sound) window.Sound.playMagic();
    if (cb) await cb({ type: 'damage', attacker: ally.id, targetIndex: targetEnemy.enemyIndex, damage: finalDmg, text: `${skill.name} -${finalDmg}` });
    this.rewardSkillProficiency(ally, skill);
  }

  // 绝技熟练度结算 (严格遵循 SkillMasteryEngine 5级25000法则与神坛菩提老祖突破铁律)
  rewardSkillProficiency(ally, skill) {
    if (!skill || !window.SkillMasteryEngine) return;
    const gain = Math.floor(Math.random() * 5 + 10);
    const res = window.SkillMasteryEngine.gainMastery(skill, gain);

    // 双向同步字段兼容
    skill.proficiency = skill.mastery;

    if (res.locked) {
      this.log(`⚠️【熟练度瓶颈】${skill.name} 已达 Lv.${skill.level} 熟练度极境 (${skill.mastery})！已自动锁级，请前往长安城神坛拜谒【菩提老祖】突破升级！`);
      if (window.showGameMessage) {
        window.showGameMessage(`⚠️ 绝技【${skill.name}】已达 ${skill.mastery} 熟练度极境！需前往长安城神坛拜谒菩提老祖突破！`, 'warning', 4500);
      }
    }
  }

  // 已有门派元素法术按同一技能公式执行，不能只换法术名后仍结算物理普攻。
  async handleEnemyElementSpell(enemy, skillName, targetAlly, cb) {
    const engine = window.SkillMasteryEngine;
    if (!engine) return false;
    if (skillName === '金刚护体') {
      const calc = engine.calculateHutiBuff(1, 0);
      if ((enemy.mp || 0) < calc.costMp) return false;
      enemy.mp -= calc.costMp;
      const targets = this.getAliveEnemies().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp).slice(0, calc.targetCount);
      targets.forEach(t => t.buffs.push({ name: '金刚护体', duration: calc.duration,
        defBonusRate: calc.resRate, mdefBonusRate: calc.resRate, appliedRound: this.round }));
      this.log(`【${enemy.name}】施展金刚护体，护住 ${targets.map(t => t.name).join('、')}。`);
      if (cb) await cb({ type: 'buff', attacker: 'enemy_' + enemy.enemyIndex, skillName,
        hits: targets.map(t => ({ type: 'buff', targetIndex: t.enemyIndex, text: '金刚护体' })) });
      return true;
    }
    const control = { '封印咒': ['fengyin', 'res_fengyin', 'sealed', '封印'],
      '定身咒': ['dingshen', 'res_dingshen', 'dingshen', '定身'],
      '乱魂咒': ['luanhun', 'res_luanhun', 'luanhun', '混乱'] }[skillName];
    if (control) {
      const [id, resistance, type, label] = control;
      const calc = engine.calculateControlSpell(id, 1, 0);
      if ((enemy.mp || 0) < calc.costMp) return false;
      enemy.mp -= calc.costMp;
      const alive = this.getAliveAllies();
      const targets = [targetAlly, ...alive.filter(t => t !== targetAlly)].slice(0, calc.maxTargets);
      const casterElem = BattleEngine.getEntityElement(enemy);
      const hits = targets.map(t => {
        const targetElem = BattleEngine.getEntityElement(t);
        const ctrlMod = FiveElements.getControlHitModifier(casterElem, targetElem);
        const success = Math.random() < Math.max(0, Math.min(1, calc.hitRate + ctrlMod - (t.resistances?.[resistance] || 0)));
        if (success) t.buffs.push({ id, name: label, duration: calc.duration, breakOnDamage: id === 'dingshen', appliedRound: this.round });
        return { type: success ? type : 'resist', target: t.id, text: success ? label : label + '未中' };
      });
      this.log(`【${enemy.name}】施展【${skillName}】。`);
      if (cb) await cb({ type: 'cast', attacker: 'enemy_' + enemy.enemyIndex, skillName, hits });
      return true;
    }
    if (!['雷霆万钧', '三昧真火', '飞沙走石'].includes(skillName)) return false;
    const single = skillName === '雷霆万钧';
    const alive = this.getAliveAllies();
    const calc = single ? engine.calculateLeiting(enemy, targetAlly, 1, 0) :
      engine.calculateGroupSpell(skillName, enemy, alive.length, 1, 0);
    if ((enemy.mp || 0) < calc.costMp) return false;
    enemy.mp -= calc.costMp;
    const targets = single ? [targetAlly] : alive.slice(0, calc.actualTargets);
    const resistance = single ? 'res_leiting' : skillName === '三昧真火' ? 'res_sanmei' : 'res_feisha';
    const casterElem = BattleEngine.getEntityElement(enemy);
    const hits = targets.map(target => {
      const targetElem = BattleEngine.getEntityElement(target);
      const elemMult = FiveElements.getDamageMultiplier(casterElem, targetElem);
      const raw = single ? calc.damage : calc.perTargetDamage;
      const res = Math.max(0, Math.min(1, target.resistances?.[resistance] || 0));
      const defending = target.buffs.some(b => b.name === '防御') ? 0.5 : 1;
      const protection = Math.max(0, ...target.buffs.map(b => b.mdefBonusRate || 0));
      const damage = Math.max(1, Math.floor(raw * (1 - res) * defending * (1 - Math.min(0.8, protection)) * elemMult));
      this.applyDamage(target, damage);
      const revived = this.tryRebirth(target);
      return { type: revived ? 'revive' : 'damage', target: target.id, damage,
        text: revived ? '神佑复生' : `${skillName} -${damage}` };
    });
    this.log(`【${enemy.name}】施展【${skillName}】，命中 ${targets.length} 人！`);
    if (window.Sound) window.Sound.playMagic();
    if (cb) await cb({ type: 'cast', attacker: 'enemy_' + enemy.enemyIndex, skillName, hits });
    return true;
  }

  // 银角大王专属“移山压顶”策略轮执行 (P1)
  async handleYinjiaoYishanTurn(enemy, intent, cb) {
    // 1. 控制打断检测：封印或定身 (明确控制是否取消蓄力并给出清晰反馈)
    const sealed = enemy.buffs && enemy.buffs.some(b => b.id === 'fengyin');
    const bound = enemy.buffs && enemy.buffs.some(b => b.id === 'dingshen');
    if (sealed || bound) {
      intent.status = 'interrupted';
      const reason = sealed ? '封印咒' : '定身咒';
      this.log(`【移山打断】银角大王身受【${reason}】制约真言溃散，万钧大山未能压下，【移山压顶】被迫中断！`);
      if (cb) {
        await cb({
          type: 'boss_intent_interrupted',
          attacker: 'enemy_' + enemy.enemyIndex,
          target: intent.targetId,
          skillName: '移山压顶',
          text: `移山被打断！(${reason})`
        });
      }
      return;
    }

    // 乱魂控制
    const confused = enemy.buffs && enemy.buffs.some(b => b.id === 'luanhun');
    if (confused) {
      intent.status = 'interrupted';
      this.log(`【神志混乱】银角大王中【乱魂咒】气机错乱，移山大法溃散未能成阵！`);
      if (cb) {
        await cb({
          type: 'boss_intent_interrupted',
          attacker: 'enemy_' + enemy.enemyIndex,
          target: intent.targetId,
          skillName: '移山压顶',
          text: '乱魂错乱·移山中断！'
        });
      }
      return;
    }

    // 2. 目标存活与有效性检测 (目标已离场或被替换时取消蓄力，不偷换目标)
    const targetAlly = this.allies.find(a => a.id === intent.targetId && a.hp > 0);
    if (!targetAlly) {
      intent.status = 'cancelled';
      this.log(`【移山落空】原锁定目标已不在阵中，万钧须弥大山轰然落空，震裂周围石径！`);
      if (cb) {
        await cb({
          type: 'boss_intent_cancelled',
          attacker: 'enemy_' + enemy.enemyIndex,
          skillName: '移山压顶',
          text: '目标失锁·移山落空！'
        });
      }
      return;
    }

    // 3. 执行移山压顶 (防御只使用一次减伤计算，减免 60% 伤害)
    intent.status = 'completed';
    const rawDamage = Math.max(120, Math.floor(targetAlly.maxHp * 0.52 + (enemy.atk || 340) * 0.6));
    const isDefending = targetAlly.buffs && targetAlly.buffs.some(b => b.name === '防御');

    // 防御可减免 60% 伤害 (只承受 40%)
    let finalDamage = isDefending ? Math.max(1, Math.floor(rawDamage * 0.40)) : rawDamage;

    // 防御天赋结算：法力抵扣 / 逆御免伤 / 画皮移伤
    const mitigation = this.applyAvatarMitigation(targetAlly, finalDamage);
    if (mitigation.notes.length) this.log(`　└ ${mitigation.notes.join('　')}`);
    finalDamage = mitigation.damage;

    this.applyDamage(targetAlly, finalDamage);

    // 挂链反击/反震判定
    if (finalDamage > 0) {
      const traits = BattleEngine.getCounterTraits(targetAlly);
      const reflectRatio = Math.max(traits.reflectRatio, traits.counterShockRate);
      if (reflectRatio > 0) {
        const reflected = Math.max(1, Math.floor(finalDamage * reflectRatio));
        const capped = Math.min(reflected, enemy.hp);
        this.applyDamage(enemy, capped);
        this.log(`【🔄反震】${targetAlly.name} 反弹 ${capped} 点伤害给 ${enemy.name}！`);
        if (cb) {
          await cb({
            type: 'reflect',
            attacker: targetAlly.id,
            targetIndex: enemy.enemyIndex,
            damage: capped,
            text: `🔄 反震 -${capped}`
          });
        }
      }
    }

    const didRevive = this.tryRebirth(targetAlly);

    if (isDefending) {
      this.log(`【移山压顶·坚守】万钧大山当头压下！【${targetAlly.name}】摆开防御架势沉稳硬扛，受到伤害大幅减轻 60%，承受 ${finalDamage} 点重压伤害！`);
    } else {
      this.log(`【移山压顶·重创】万钧须弥泰山轰然倾压！【${targetAlly.name}】未及完全防御，承受 ${finalDamage} 点浩瀚巨创！`);
    }

    if (cb) {
      await cb({
        type: didRevive ? 'revive' : 'boss_special_cast',
        attacker: 'enemy_' + enemy.enemyIndex,
        target: targetAlly.id,
        skillName: '移山压顶',
        damage: finalDamage,
        isDefended: isDefending,
        text: didRevive ? '✨高级神佑复活！' : (isDefending ? `🛡️防御减免 -${finalDamage}` : `💥移山压顶 -${finalDamage}`)
      });
    }
  }

  // 敌方单位行动
  async handleEnemyTurn(enemy, action, cb) {
    // 0. Boss 专属机制意图消费 (P1: 银角大王“移山压顶”)
    if (action.type === 'boss_intent' && action.intent) {
      if (action.intent.skillId === 'yishan_yading') {
        await this.handleYinjiaoYishanTurn(enemy, action.intent, cb);
        return;
      }
    }

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

    const targetAlly = this.allies.find(a => a.id === action.targetId && a.hp > 0) || aliveAllies[0];
    let skillName = action.type === 'skill'
      ? (typeof action.skill === 'string' ? action.skill : action.skill?.name)
      : null;
    const implementedSpells = ['雷霆万钧', '三昧真火', '飞沙走石', '封印咒', '定身咒', '乱魂咒', '金刚护体'];
    if (skillName && implementedSpells.includes(skillName)) {
      if (await this.handleEnemyElementSpell(enemy, skillName, targetAlly, cb)) return;
      skillName = null;
    }
    const isSkill = !!skillName && skillName !== '普通攻击';

    // 调用统一核心伤害计算公式
    const attackRes = BattleEngine.calculateAttackDamage(enemy, targetAlly);
    // 敌方技能原先只被 AI 选中，结算时仍当普攻；现在保留原伤害体系并赋予独立招式。
    if (isSkill && !['tianpeng_boss', 'wukong_havoc_boss'].includes(enemy.id) && !attackRes.isDodge) {
      attackRes.damages = attackRes.damages.map(d => Math.max(1, Math.floor(d * 1.16)));
      attackRes.totalDamage = attackRes.damages.reduce((sum, d) => sum + d, 0);
    }

    // 1. 玩家/仙宠闪避判定
    if (attackRes.isDodge) {
      this.log(`【${targetAlly.name}】身形飘逸，轻盈【闪避 MISS】了【${enemy.name}】的凶残扑击！`);
      if (!cb) BattleEngine.playSound('playFailure');
      if (cb) await cb({
        type: 'dodge',
        attacker: 'enemy_' + enemy.enemyIndex,
        skillName: isSkill ? skillName : null,
        target: targetAlly.id,
        text: '闪避 MISS'
      });
      return;
    }

    // 防御天赋结算：法力抵扣 / 逆御免伤 / 画皮移伤
    const mitigation = this.applyAvatarMitigation(targetAlly, attackRes.totalDamage);
    if (mitigation.notes.length) this.log(`　└ ${mitigation.notes.join('　')}`);
    attackRes.totalDamage = mitigation.damage;

    this.applyDamage(targetAlly, mitigation.damage);

    // 挂链反击率与反震率真实结算 (此前为面板死数据)
    if (mitigation.damage > 0) {
      const traits = BattleEngine.getCounterTraits(targetAlly);
      const reflectRatio = Math.max(traits.reflectRatio, traits.counterShockRate);
      if (reflectRatio > 0 && !attackRes.isFatal) {
        const reflected = Math.max(1, Math.floor(mitigation.damage * reflectRatio));
        const capped = Math.min(reflected, enemy.hp);
        this.applyDamage(enemy, capped);
        this.log(`【🔄反震】${targetAlly.name} 反弹 ${capped} 点伤害给 ${enemy.name}！`);
        if (cb) {
          await cb({ type: 'reflect', attacker: targetAlly.id, targetIndex: enemy.enemyIndex,
            damage: capped, text: `🔄 反震 -${capped}` });
        }
      }
      if (traits.counterAttackRate > 0 && targetAlly.hp > 0 && Math.random() < traits.counterAttackRate) {
        const back = Math.max(1, Math.floor(mitigation.damage * 0.35));
        const capped = Math.min(back, enemy.hp);
        this.applyDamage(enemy, capped);
        this.log(`【⚔️反击】${targetAlly.name} 顺势还击 ${enemy.name}，造成 ${capped} 点伤害！`);
        if (cb) {
          await cb({ type: 'counter', attacker: targetAlly.id, targetIndex: enemy.enemyIndex,
            damage: capped, text: `⚔️ 反击 -${capped}` });
        }
      }
    }

    // 黑水换甲：敌方（鼍洁）完成一次有效行动后计数，用于姿态切换
    this.recordArmorAction(enemy);

    const didRevive = this.tryRebirth(targetAlly);

    let logMsg = isSkill
      ? `【${enemy.name}】施展【${skillName}】攻向【${targetAlly.name}】！`
      : `【${enemy.name}】凶猛扑击【${targetAlly.name}】！`;
    if (attackRes.isFatal) {
      logMsg += ` 竟触发【⚡致命一击】无视防御与物理抗性，贯穿造成 ${attackRes.damages[0]} 点纯正真实伤害！`;
    } else {
      logMsg += ` 造成 ${attackRes.damages[0]} 点伤害${attackRes.isCrit ? '（💥暴击1.5倍！）' : ''}！`;
      if (attackRes.comboCount > 0) {
        logMsg += ` 并且激发【🔥连续撕咬 ${attackRes.comboCount} 次】（连击每次伤害减半：${attackRes.damages.slice(1).join('、')}）！`;
      }
      logMsg += ` 本轮攻击共造成 ${attackRes.totalDamage} 点总伤害！`;
    }
    if (attackRes.elementRelation === 'counter') {
      logMsg += `【⚡五行克制 ${FiveElements.NAMES[attackRes.attackerElement]}克${FiveElements.NAMES[attackRes.targetElement]} 增伤】`;
    } else if (attackRes.elementRelation === 'countered') {
      logMsg += `【🛡️五行被克 ${FiveElements.NAMES[attackRes.attackerElement]}逢${FiveElements.NAMES[attackRes.targetElement]} 削伤】`;
    }
    this.log(logMsg);

    if (!cb) {
      if (attackRes.isFatal || attackRes.isCrit) BattleEngine.playSound('playCrit');
      else BattleEngine.playSound('playHit');
    }

    if (cb) await cb({
      type: didRevive ? 'revive' : 'damage',
      attacker: 'enemy_' + enemy.enemyIndex,
      skillName: isSkill ? skillName : null,
      target: targetAlly.id,
      attackResult: attackRes,
      damage: attackRes.damages[0],
      totalDamage: attackRes.totalDamage,
      isCrit: attackRes.isCrit,
      isFatal: attackRes.isFatal,
      comboCount: attackRes.comboCount,
      damages: attackRes.damages,
      text: didRevive ? '✨高级神佑复活！' : (attackRes.isFatal ? `⚡致命 -${attackRes.damages[0]}` : (attackRes.isCrit ? `💥暴击 -${attackRes.damages[0]}` : `-${attackRes.damages[0]}`))
    });
  }
}

window.BattleEngine = BattleEngine;
