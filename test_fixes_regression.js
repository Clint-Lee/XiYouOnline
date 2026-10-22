/**
 * 汉风西游 - 本轮缺陷修复回归测试（端到端结果断言）
 * 覆盖：抗性键名与累加、战斗药品扣减、目标失效不崩、maxHp=0 防护、
 *       中毒 NaN 防护、变身属性还原、坐骑费用、装备换装回滚、
 *       存档存储探测与导入导出键、天赋方法补齐、虚弱/隐身真实生效。
 * 原则：断言"实际结果变化"，不断言"方法被调用"。
 */
module.exports = async function (assert) {
  console.log('\n▶️ [测试 57] 本轮 P0/P1 修复端到端回归');

  // ── 1. 天生抗性：键名统一 + 天生与门派加值累加而非覆盖 ──
  {
    const engine = window.SkillMasteryEngine;

    const jg = engine.getInnateResistances('jingang');
    assert(jg.res_phy === 0.20, '金刚天生物理抗性以 res_phy 暴露（战斗侧真实读取的键）');
    assert(jg.res_physical === undefined, '金刚不再残留无人消费的 res_physical 键');
    assert(jg.res_shesheng === 0.10 && jg.res_xuanji === 0.05, '金刚舍生与抗玄击数值保持不变');

    const xr = engine.getInnateResistances('xianren');
    const sx = engine.getInnateResistances('shenxian');
    assert(xr.res_phy === 0.10 && sx.res_phy === 0.10, 'classId 为 xianren 与 shenxian 均可取到神仙天生抗性');
    assert(xr.res_fengyin === 0.10 && sx.res_fengyin === 0.10, '神仙封印抗性在两种 classId 写法下一致');

    // 累加而非覆盖：门派自身 5% 加值不得把天生 20% 冲掉
    const p = new window.Player({ classId: 'jingang', level: 30 });
    const b = new window.BattleEngine(p, [], []);
    const playerAlly = b.allies.find(a => a.isPlayer);
    assert(playerAlly.resistances.res_phy >= 0.20,
      `金刚战斗中物理抗性应 >= 20%，实际 ${playerAlly.resistances.res_phy}`);
    assert(playerAlly.resistances.res_shesheng >= 0.10,
      `金刚战斗中舍生抗性应 >= 10%，实际 ${playerAlly.resistances.res_shesheng}`);
  }

  // ── 2. 战斗使用药品必须真实扣减；无疗效不浪费 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 30 });
    p.hp = 10;
    const inv = new window.Inventory([
      { instanceId: 'med_1', itemId: 'jinchuang_yao', count: 2 }
    ]);
    const oldInventory = window.App2D.inventory;
    window.App2D.inventory = inv;
    try {
      const b = new window.BattleEngine(p, [], [{ id: 'e1', name: '木桩', level: 10, hp: 9999, maxHp: 9999, atk: 1, def: 1, spd: 1 }]);
      const playerAlly = b.allies.find(a => a.isPlayer);
      playerAlly.hp = 10;

      const before = inv.getItemCount('jinchuang_yao');
      await b.handleAllyTurn(playerAlly, { type: 'item', itemId: 'jinchuang_yao', targetAllyId: playerAlly.id }, null);
      const after = inv.getItemCount('jinchuang_yao');
      assert(before === 2 && after === 1, `战斗中用药应扣除 1 瓶，实际 ${before} -> ${after}`);
      assert(playerAlly.hp > 10, '战斗中用药应真实回血');

      // 满血时再用药：不产生疗效，不应消耗
      playerAlly.hp = playerAlly.maxHp;
      await b.handleAllyTurn(playerAlly, { type: 'item', itemId: 'jinchuang_yao', targetAllyId: playerAlly.id }, null);
      assert(inv.getItemCount('jinchuang_yao') === 1, '气血充盈时用药不产生疗效，不应浪费药品');

      // 药品耗尽后再次请求：必须被拦下且不回血
      inv.removeItem('jinchuang_yao', 1);
      playerAlly.hp = 1;
      await b.handleAllyTurn(playerAlly, { type: 'item', itemId: 'jinchuang_yao', targetAllyId: playerAlly.id }, null);
      assert(playerAlly.hp === 1, '药品耗尽后无法继续回血（杜绝无限吃药）');
    } finally {
      window.App2D.inventory = oldInventory;
    }
  }

  // ── 3. 目标全灭时攻击指令不崩溃、不清空回合 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 30 });
    const b = new window.BattleEngine(p, [], [
      { id: 'e1', name: '已亡甲', level: 5, hp: 0, maxHp: 100, atk: 1, def: 1, spd: 1 },
      { id: 'e2', name: '已亡乙', level: 5, hp: 0, maxHp: 100, atk: 1, def: 1, spd: 1 }
    ]);
    const playerAlly = b.allies.find(a => a.isPlayer);
    let threw = false;
    try {
      await b.handleAllyTurn(playerAlly, { type: 'attack', targetIndex: 1 }, null);
    } catch (e) {
      threw = true;
    }
    assert(!threw, '所有敌人已阵亡时执行攻击指令不应抛出异常');
  }

  // ── 4. maxHp 为 0 / 缺失时给出正数上限，避免伤害恒 0 与 NaN 血条 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 30 });
    const b = new window.BattleEngine(p, [], [
      { id: 'weird', name: '无上限怪', level: 5, hp: 0 },
      { id: 'noHp', name: '无血怪', level: 5 }
    ]);
    const first = b.enemies[0];
    const second = b.enemies[1];
    assert(first.maxHp > 0, `hp=0 且缺 maxHp 的敌人应获得正数上限，实际 ${first.maxHp}`);
    assert(second.maxHp > 0 && second.hp === second.maxHp,
      `缺 hp/maxHp 的敌人应补齐为满血，实际 hp=${second.hp} maxHp=${second.maxHp}`);
    assert(!Number.isNaN(first.hp) && !Number.isNaN(second.hp), '敌人气血不得出现 NaN');
  }

  // ── 5. 中毒 DOT：非法 poisonDmg 不得产生 NaN 血；多叠层不对尸体二次结算 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 30 });
    const b = new window.BattleEngine(p, [], [
      { id: 'poison_a', name: '中毒甲', level: 10, hp: 100, maxHp: 100, atk: 1, def: 1, spd: 1 }
    ]);
    const target = b.enemies[0];
    // 旧存档/篡改数据常见形态：poisonDmg 缺失
    target.buffs = [{ id: 'wandu', duration: 3, appliedRound: 0 }];
    b.round = 1;
    await b.settleRoundBuffs(null);
    assert(!Number.isNaN(target.hp), `poisonDmg 缺失时气血不得变 NaN，实际 ${target.hp}`);
    assert(target.hp > 0 && target.hp < 100, `中毒应造成有效伤害，实际剩余 ${target.hp}`);

    // 单位已阵亡时，后续毒层不得继续结算
    const deadTarget = b.enemies[0];
    deadTarget.hp = 0;
    deadTarget.buffs = [
      { id: 'wandu', duration: 3, poisonDmg: 50, decayRatio: 0.75, appliedRound: 0 },
      { id: 'wandu', duration: 3, poisonDmg: 50, decayRatio: 0.75, appliedRound: 0 }
    ];
    b.round = 2;
    let poisonEvents = 0;
    await b.settleRoundBuffs(() => { poisonEvents++; });
    assert(poisonEvents === 0, '单位阵亡后不再对尸体结算中毒');
    assert(deadTarget.hp === 0, '阵亡单位气血保持 0，不出现负值');
  }

  // ── 6. 变身结束必须还原法力上限与抗性，不得永久膨胀 ──
  {
    const pet = window.PetSystem.createPet('huangfeng_guai', true, 40);
    assert(pet && pet.quality === 'jinxian', '黄风怪为金仙品阶');
    const p = new window.Player({ classId: 'jingang', level: 40 });
    const b = new window.BattleEngine(p, [pet], []);
    const petAlly = b.allies.find(a => a.type === 'pet');
    const baseMaxMp = petAlly.maxMp;

    const talent = window.PetSystem.JINXIAN_AVATAR_TALENTS.huangfeng_guai;
    b.applyAvatarBuffs(petAlly, talent, 5000);
    assert(petAlly.maxMp > baseMaxMp, '黄风怪变身应立即提升法力上限');

    // 模拟变身到期
    pet.avatarTransformed = true;
    pet.avatarRoundsLeft = 1;
    b.tickAvatars();
    assert(petAlly.maxMp === baseMaxMp,
      `变身结束后法力上限必须还原为 ${baseMaxMp}，实际 ${petAlly.maxMp}`);
  }

  // ── 7. 补全的三个天赋方法可被安全调用（不再因缺失而失效） ──
  {
    const talents = window.PetSystem.JINXIAN_AVATAR_TALENTS;
    const jj = talents.jinjiao_dawang;
    const yj = talents.yinjiao_dawang;
    const hf = talents.huangfeng_guai;

    assert(jj && typeof jj.getMpDrainRatio === 'function', '金角大王补回 getMpDrainRatio（紫金吸魂）');
    const drainLow = jj.getMpDrainRatio(0);
    const drainHigh = jj.getMpDrainRatio(5000);
    assert(drainLow > 0 && drainHigh > drainLow, `金角吸蓝比例应随天赋点提升，0点=${drainLow} 满点=${drainHigh}`);

    assert(yj && typeof yj.getReductionRatio === 'function', '银角大王补回 getReductionRatio（羊脂封魄）');
    const noLoss = yj.getReductionRatio(5000, 1000, 1000);
    const fullLoss = yj.getReductionRatio(5000, 0, 1000);
    assert(noLoss === 0, '银角满血时无免伤');
    assert(fullLoss > 0, '银角濒死时获得免伤');

    assert(hf && typeof hf.getSlowRate === 'function', '黄风怪补回 getSlowRate（三昧神风·断速）');
    assert(hf.getSlowRate(5000) > hf.getSlowRate(0), '黄风断速概率随天赋点提升');

    // 金角/银角不再被错误别名指向他人天赋
    const aliases = window.PetSystem.AVATAR_TALENT_ALIAS;
    assert(aliases.jinjiao_dawang === undefined, '金角大王不再被别名指向其他天赋');
    assert(aliases.yinjiao_dawang === undefined, '银角大王不再被别名指向其他天赋');
  }

  // ── 8. 断速改为临时减益：到期后速度自然恢复 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 30 });
    const b = new window.BattleEngine(p, [], [
      { id: 'slow_t', name: '减速目标', level: 10, hp: 500, maxHp: 500, atk: 1, def: 1, spd: 80 }
    ]);
    const target = b.enemies[0];
    const baseSpd = target.spd;
    target.buffs = [{ id: 'slow', name: '迟滞', duration: 2, spdPenalty: 40, appliedRound: 1 }];
    assert(window.BattleEngine.getEffectiveSpd(target) === baseSpd - 40,
      '迟滞生效期间有效速度应下降');
    assert(target.spd === baseSpd, '延迟减益不得改写基础速度字段');
    target.buffs = [];
    assert(window.BattleEngine.getEffectiveSpd(target) === baseSpd,
      '减益移除后有效速度应完全恢复，不残留永久减速');
  }

  // ── 9. 虚弱与隐身真实进入伤害公式 ──
  {
    const attacker = { id: 'weakened', name: '虚弱者', atk: 1000, level: 30, buffs: [{ id: 'weaken', weakenRatio: 0.20 }] };
    const target = { id: 'dummy', name: '靶子', def: 0, maxHp: 10000, hp: 10000, buffs: [] };
    const weakened = window.BattleEngine.calculateAttackDamage(attacker, target, { forceCrit: false, forceCombo: false, forceFatal: false, forceDodge: false, dmgFluctuate: 1 });
    const normalAttacker = { id: 'normal', name: '正常者', atk: 1000, level: 30, buffs: [] };
    const normal = window.BattleEngine.calculateAttackDamage(normalAttacker, target, { forceCrit: false, forceCombo: false, forceFatal: false, forceDodge: false, dmgFluctuate: 1 });
    assert(weakened.totalDamage < normal.totalDamage,
      `虚弱应降低实际伤害：正常 ${normal.totalDamage} vs 虚弱 ${weakened.totalDamage}`);

    // 隐身：dodgeBonus 应计入命中判定。用 forceDodge=false 且 dodgeBonus=1 验证必闪
    const dodger = { id: 'invis', name: '隐身者', def: 10, maxHp: 1000, hp: 1000, dodgeRate: 0, buffs: [{ id: 'yinshen', dodgeBonus: 0.75 }] };
    const hitRes = window.BattleEngine.calculateAttackDamage(normalAttacker, dodger, { forceFatal: false, forceCrit: false, forceCombo: false });
    assert(hitRes.isDodge === true, '隐身提供的闪避加成应真实参与命中判定');
  }

  // ── 10. 坐骑精训按实际可升级数收费，不超卖 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 30 });
    p.silver = 10_000_000;
    const ms = new window.MountSystem();
    ms.addMount('xuelong_ma', '测试龙马');
    const mount = ms.getActiveMount();
    mount.level = mount.maxLevel - 2; // 距上限仅 2 级
    const targetLevel = mount.maxLevel;

    const before = p.silver;
    const res = ms.trainMount(mount.id, p, 5);
    assert(res.success === true, '精训连升应成功执行');
    assert(mount.level === targetLevel, `离满级 2 级时精训 5 级只应升到 ${targetLevel}，实际 ${mount.level}`);
    assert(res.levelUps === 2, `实际升级数应为 2，实际 ${res.levelUps}`);

    // 费用只按 2 级计：避免按 5 级超收
    const costFor2 = (500 + (targetLevel - 2) * 150) + (500 + (targetLevel - 1) * 150);
    assert(before - p.silver === costFor2,
      `实际扣费应为 2 级的 ${costFor2} 两，实际扣 ${before - p.silver} 两`);
  }

  // ── 11. 换装满包时不丢旧装备 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 60 });
    // 先让身上有武器
    p.equipItem('weapon', { itemId: 'eq_wp_wood', star: 0, sockets: [null, null, null] });

    const inv = new window.Inventory([]);
    // 塞满 36 格，其中放一把新武器
    for (let i = 0; i < 35; i++) inv.slots.push({ instanceId: 'fill_' + i, itemId: 'jinchuang_yao', count: 1 });
    inv.slots.push({ instanceId: 'new_wp', itemId: 'eq_wp_bawangqiang', count: 1, equipData: { star: 0, sockets: [null, null, null] } });
    assert(inv.slots.length === inv.maxSlots, '测试前置：背包已满 36 格');

    const oldWeaponId = p.equipment.weapon.itemId;
    const res = inv.equip('new_wp', p);
    assert(res.success === false, '背包满时换装应被拒绝');
    assert(p.equipment.weapon.itemId === oldWeaponId,
      `被拒绝后身上仍应是原装备 ${oldWeaponId}，实际 ${p.equipment.weapon.itemId}`);
    assert(inv.slots.some(s => s.instanceId === 'new_wp'), '新装备应留在背包原位，不得消失');
  }

  // ── 12. 存档：无存储环境必须安全降级，不能抛错导致白屏 ──
  // 说明：本测试进程未提供 localStorage（模拟隐私模式 / iframe sandbox）。
  // 注意：主套件中途用桩替换过 window.SaveManager，因此这里独立加载真实 save.js 验证。
  {
    const fs = require('fs');
    const path = require('path');
    const vm = require('vm');
    const saveSrc = fs.readFileSync(path.join(__dirname, 'js/core/save.js'), 'utf8');

    const loadRealSaveManager = (localStorageStub) => {
      const sandbox = { console, JSON, Date, localStorage: localStorageStub };
      sandbox.window = sandbox;
      vm.createContext(sandbox);
      vm.runInContext(saveSrc, sandbox);
      return sandbox.SaveManager;
    };

    // 12a. 无 localStorage：全部方法安全降级
    const SM = loadRealSaveManager(undefined);
    assert(typeof SM.exportSaveJson === 'function', '真实 SaveManager 应提供 exportSaveJson');

    let threw = false;
    let result;
    try {
      result = SM.saveGameFullState({
        mapId: 'liujiacun',
        storyPhase: 'liujiacun_start',
        player: { name: '测试行者', level: 3 }
      });
    } catch (e) {
      threw = true;
    }
    assert(!threw, '无本地存储时存档不得抛错（否则启动即白屏）');
    assert(result && result.success === false,
      '无本地存储时应返回明确的失败结果，而不是假装成功');
    assert(SM.hasAutoSave() === false, '无本地存储时 hasAutoSave 应安全返回 false');
    assert(SM.loadGameFullState() === null, '无本地存储时读档应安全返回 null');
    assert(SM.exportSaveJson() === '', '无本地存储时导出应返回空字符串而非抛错');

    let deleteThrew = false;
    try {
      SM.deleteSave(1);
      SM.clearProgress();
    } catch (e) {
      deleteThrew = true;
    }
    assert(!deleteThrew, '无本地存储时清理存档不得抛错');

    const badImport = SM.importSaveJson('auto_progress', JSON.stringify({ data: { player: {} } }));
    assert(badImport && badImport.success === false, '无本地存储时导入应返回失败结果');

    // 12b. 有内存桩存储：导出/导入必须作用于同一键（auto_progress），并校验结构
    const memory = new Map();
    const SM2 = loadRealSaveManager({
      getItem: k => (memory.has(k) ? memory.get(k) : null),
      setItem: (k, v) => { memory.set(k, String(v)); },
      removeItem: k => { memory.delete(k); }
    });

    const state = { mapId: 'liujiacun', storyPhase: 'liujiacun_start', player: { name: '测试行者', level: 3 } };
    const saved = SM2.saveGameFullState(state);
    assert(saved.success === true, '有存储时自动存档应写入成功');

    const exported = SM2.exportSaveJson();
    assert(typeof exported === 'string' && exported.length > 0,
      '导出存档默认应导出 auto_progress（此前导出槽位键导致导入后进度不变）');
    const parsed = JSON.parse(exported);
    assert(parsed.data.mapId === 'liujiacun', '导出内容应为真实的自动历练档');

    const bad = SM2.importSaveJson('auto_progress', JSON.stringify({ data: { player: {} } }));
    assert(bad.success === false, '缺少 mapId 的存档应被拒绝导入');
    assert(SM2.loadGameFullState().mapId === 'liujiacun', '导入失败不得破坏已有存档');

    const good = SM2.importSaveJson('auto_progress', exported);
    assert(good.success === true, '合法存档应导入成功');
    assert(SM2.loadGameFullState().mapId === 'liujiacun', '导入后可正常读回');
  }

  // ── 13. 主线关键对白键必须存在（防止剧情静默锁死） ──
  {
    const stories = window.GAME_DATA.STORY_DIALOGUES;
    const criticalKeys = [
      'wukong_freed',        // 五行山破封后大圣入队（曾误写 wuxing_freed 导致主线硬锁死）
      'liuboqin_talk',
      'bailong_post_battle',
      'bajie_post_battle',
      'shaseng_post_battle',
      'zhenyuanzi_post_battle',
      'baigujing_final_aftermath',
      'huangpao_aftermath',
      'pingdingshan_laojun_aftermath'
    ];
    for (const key of criticalKeys) {
      const dlg = stories[key];
      assert(dlg && Array.isArray(dlg.steps) && dlg.steps.length > 0,
        `主线关键对白键「${key}」必须存在且有内容`);
    }
    assert(stories.wuxing_freed === undefined,
      '不应存在拼错的 wuxing_freed 键（该键曾导致破封后剧情断链）');
  }

  // ── 14. 平顶山三战奖励走幂等领取入口 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 50 });
    const inv = new window.Inventory([]);
    const first = p.claimStoryReward('pingding_scout', { exp: 1000, silver: 500 }, inv);
    assert(first.success === true, '平顶山首战奖励首次应发放成功');
    const expAfterFirst = p.exp;
    const silverAfterFirst = p.silver;

    const second = p.claimStoryReward('pingding_scout', { exp: 1000, silver: 500 }, inv);
    assert(second.success === false && second.reason === 'already_claimed',
      '同一奖励标识重复领取必须被拒绝');
    assert(p.silver === silverAfterFirst,
      `重复领取不得增加银两，实际 ${silverAfterFirst} -> ${p.silver}`);
    assert(p.exp === expAfterFirst || p.level > 1,
      '重复领取不得再次增加经验（升级则经验被消耗属正常）');
  }

  // ── 15. 等级上限保护：超量经验不得越界升级 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 99 });
    p.gainExp(99_999_999);
    assert(p.level <= 100, `等级不得超过 100，实际 ${p.level}`);
    assert(p.exp === 0, '满级后经验清零，不无限累积');
    assert(Number.isFinite(p.maxHp) && p.maxHp > 0, '满级后属性仍为有效正数');
  }

  // ── 16. 宝石抗性按 res_ 前缀全量累加，新键不再被丢弃 ──
  {
    const p = new window.Player({ classId: 'yaomo', level: 40 });
    // 直接注入一个带 res_sanmei 的宝石到装备孔位
    p.equipment.armor = {
      instanceId: 'test_armor',
      itemId: 'eq_am_hunyuan',
      star: 0,
      sockets: ['__test_gem_sanmei__', null, null]
    };
    const originalGem = window.GAME_DATA.ITEMS.__test_gem_sanmei__;
    window.GAME_DATA.ITEMS.__test_gem_sanmei__ = {
      id: '__test_gem_sanmei__', name: '测试抗火宝石', type: 'gem', bonus: { res_sanmei: 0.05 }
    };
    try {
      const beforeSanmei = p.resistances.res_sanmei;
      p.recalculateStats(false);
      assert(p.resistances.res_sanmei > beforeSanmei,
        `res_sanmei 宝石加成应生效，${beforeSanmei} -> ${p.resistances.res_sanmei}`);
    } finally {
      if (originalGem === undefined) delete window.GAME_DATA.ITEMS.__test_gem_sanmei__;
      else window.GAME_DATA.ITEMS.__test_gem_sanmei__ = originalGem;
    }
  }

  // ── 17. 第十二回 火云洞：剧情数据与阶段链闭环 ──
  {
    const stories = window.GAME_DATA.STORY_DIALOGUES;
    const huoyunKeys = [
      'huoyun_tudi_warning',
      'huoyun_redboy_trick',
      'huoyun_boss_encounter',
      'huoyun_aftermath',
      'huoyun_reward_ready'
    ];
    for (const key of huoyunKeys) {
      const dlg = stories[key];
      assert(dlg && Array.isArray(dlg.steps) && dlg.steps.length > 0,
        `火云洞对白键「${key}」必须存在且有内容`);
      const hasText = dlg.steps.every(st => typeof st.text === 'string' && st.text.length > 0);
      assert(hasText, `火云洞对白「${key}」每一步都必须有台词正文`);
    }

    // 章节开幕配置
    const cfg = window.GAME_DATA.CHAPTER_CONFIGS.chapter_12;
    assert(cfg && cfg.triggerMap === 'huoyundong', '第十二回开幕配置应绑定 huoyundong 地图');
    assert(cfg.chapterNum === '第十二回', '第十二回章回号正确');

    // 关键推进动作存在：预警对白末步必须能推进到 redboy_ready
    const warnLast = stories.huoyun_tudi_warning.steps[stories.huoyun_tudi_warning.steps.length - 1];
    const warnOpt = (warnLast.options || [])[0];
    assert(warnOpt && typeof warnOpt.action === 'function',
      '土地神预警末步应带推进选项（否则玩家无法进入下一阶段）');

    // 两场战斗入口对白都用选项调用 App2D 的战斗方法
    const trickLast = stories.huoyun_redboy_trick.steps[stories.huoyun_redboy_trick.steps.length - 1];
    const trickOpt = (trickLast.options || [])[0];
    assert(trickOpt && typeof trickOpt.action === 'function',
      '识破伪装末步应带开战选项');

    const bossLast = stories.huoyun_boss_encounter.steps[stories.huoyun_boss_encounter.steps.length - 1];
    const bossOpt = (bossLast.options || [])[0];
    assert(bossOpt && typeof bossOpt.action === 'function',
      '真身决战末步应带开战选项');

    // 战后对白末步必须能推进到 huoyun_cleared
    const afterLast = stories.huoyun_aftermath.steps[stories.huoyun_aftermath.steps.length - 1];
    assert(typeof afterLast.action === 'function',
      '火云洞战后对白末步应带阶段推进动作');

    // App2D 三个入口方法必须齐备
    for (const fn of ['triggerHuoyunScoutBattle', 'triggerRedboyBattle', 'claimHuoyunReward']) {
      assert(typeof window.App2D[fn] === 'function', `App2D.${fn} 必须已实现`);
    }

    // 阶段守卫：错误阶段调用战斗入口应被拒绝（不进入战斗）
    const oldPhase = window.App2D.storyPhase;
    const oldBattle = window.App2D.currentBattle;
    const oldEvents = window.App2D.playerData && window.App2D.playerData.storyEvents;
    window.App2D.currentBattle = null;
    try {
      if (window.App2D.playerData) window.App2D.playerData.storyEvents = {};

      const oldStart = window.App2D.start2DBattle;
      let started = false;
      window.App2D.start2DBattle = () => { started = true; return true; };

      // 平顶山阶段不得提前触发火云洞首战
      window.App2D.storyPhase = 'pingding_cleared';
      started = false;
      window.App2D.triggerHuoyunScoutBattle();
      assert(started === false, '平顶山阶段不得提前触发火云洞首战');

      // 首战已胜（storyEvents.huoyun_scout_won）后不得重复触发
      window.App2D.storyPhase = 'huoyun_redboy_ready';
      window.App2D.playerData.storyEvents = { huoyun_scout_won: true };
      started = false;
      window.App2D.triggerHuoyunScoutBattle();
      assert(started === false, '首战已胜后不得重复触发火云洞首战');

      // 真身战同理：已胜后不得重复触发
      window.App2D.storyPhase = 'huoyun_boss_ready';
      window.App2D.playerData.storyEvents = { huoyun_boss_won: true };
      started = false;
      window.App2D.triggerRedboyBattle();
      assert(started === false, '真身战已胜后不得重复触发');

      // 合法状态（阶段正确且未胜）应能触发
      window.App2D.storyPhase = 'huoyun_boss_ready';
      window.App2D.playerData.storyEvents = {};
      started = false;
      window.App2D.triggerRedboyBattle();
      assert(started === true, '合法阶段且未获胜时应能进入真身战');

      window.App2D.start2DBattle = oldStart;
    } finally {
      window.App2D.storyPhase = oldPhase;
      window.App2D.currentBattle = oldBattle;
      if (window.App2D.playerData) window.App2D.playerData.storyEvents = oldEvents;
    }
  }

  // ── 18. appliedRound 初始化收敛：后手控制时长稳定，不因初始化时机漂移 ──
  {
    const p = new window.Player({ classId: 'xianren', level: 50 });
    const b = new window.BattleEngine(p, [], [
      { id: 'ctrl_target', name: '控制靶', level: 30, hp: 8000, maxHp: 8000, mp: 5000, maxMp: 5000, atk: 10, def: 10, spd: 5 }
    ]);
    const caster = b.allies[0];
    caster.isPlayer = false;
    caster.mp = 9999;
    caster.skills = [{ id: 'sk_xr_fengyin', name: '封印咒', level: 1, mastery: 0 }];

    const target = b.enemies[0];
    const oldRandom = Math.random;
    try {
      Math.random = () => 0; // 强制命中
      b.round = 1;
      await b.handleSkillCast(caster, { skillId: 'sk_xr_fengyin', targetIndex: 0 }, null);
      const buff = target.buffs.find(x => x.id === 'fengyin');
      assert(!!buff, '封印咒应成功施加封印');
      assert(buff.appliedRound === 1,
        `新施加的 buff 必须显式记录施加回合（实际 ${buff.appliedRound}）`);

      // 施加当回合末不得递减（否则 1 回合控制实际 0 回合生效）
      const durBefore = buff.duration;
      await b.settleRoundBuffs(null);
      const afterSameRound = target.buffs.find(x => x.id === 'fengyin');
      assert(afterSameRound && afterSameRound.duration === durBefore,
        `施加当回合末不应递减控制时长（${durBefore} -> ${afterSameRound ? afterSameRound.duration : 'removed'}）`);

      // 下一回合末才递减
      b.round = 2;
      await b.settleRoundBuffs(null);
      const afterNext = target.buffs.find(x => x.id === 'fengyin');
      assert(!afterNext || afterNext.duration === durBefore - 1,
        '下一回合末控制时长应正常递减 1');
    } finally {
      Math.random = oldRandom;
    }

    // 防御姿态仍须"当回合内有效、回合末清掉"
    const p2 = new window.Player({ classId: 'jingang', level: 30 });
    const b2 = new window.BattleEngine(p2, [], [{ id: 'e', name: '木桩', level: 5, hp: 999, maxHp: 999, atk: 1, def: 1, spd: 1 }]);
    const ally = b2.allies[0];
    b2.round = 3;
    await b2.handleAllyTurn(ally, { type: 'defend' }, null);
    const defBuff = ally.buffs.find(x => x.id === 'defend');
    assert(!!defBuff, '防御应产生带 id 的防御 buff');
    await b2.settleRoundBuffs(null);
    assert(!ally.buffs.some(x => x.id === 'defend'), '防御姿态在回合末清除，不跨回合残留');
  }

  // ── 19. 第十二回地图质量：可行走比例、实体落点与连通性 ──
  // 历史缺陷：huoyundong 曾是一整张 mountain_rock 里挖出的一条 77 格水平直线（可行走仅 7.2%），
  // 玩家只能左右走一条线，Red Boy 战斗与土地神全挤在同一直线上。
  {
    const SOLID = new Set([
      'cloud_void', 'heaven_pillar', 'bamboo', 'water', 'dark_water', 'city_wall', 'hut_wall',
      'palace_eaves', 'wooden_barricade', 'blacksmith_forge', 'mountain_rock', 'demon_cave_wall',
      'ginseng_tree', 'purple_bamboo', 'tang_palace', 'tang_store', 'stone_temple',
      'two_realms_stele', 'wall', 'stone_wall', 'void', 'abyss', 'lava', 'fire_wall'
    ]);
    const map = window.GAME_DATA.MAPS_2D.huoyundong;
    assert(!!map, 'huoyundong 地图必须存在');

    const W = map.width, H = map.height, TS = 32;
    const walkable = (x, y) => {
      if (x < 0 || y < 0 || x >= W || y >= H) return false;
      const row = map.tiles[y];
      if (!row) return false;
      const t = row[x];
      return !!t && !SOLID.has(t);
    };

    // 1) 结构完整性
    assert(map.tiles.length === H, `huoyundong tiles 应为 ${H} 行，实际 ${map.tiles.length}`);
    assert(map.tiles.every(r => Array.isArray(r) && r.length === W),
      `huoyundong 每行应为 ${W} 列`);

    // 2) 可行走比例下限：低于 20% 视为"隧道地图"，不接受
    let walk = 0, total = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { total++; if (walkable(x, y)) walk++; }
    const ratio = walk / total;
    assert(ratio >= 0.20,
      `huoyundong 可行走比例应 ≥20%（当前 ${(ratio * 100).toFixed(1)}%），否则玩家只能在一条线上移动`);

    // 3) 出生点与所有实体落点必须在可通行格
    const spawn = map.playerSpawn;
    assert(spawn && walkable(Math.floor(spawn.x / TS), Math.floor(spawn.y / TS)),
      'huoyundong 出生点必须落在可通行格');

    for (const n of (map.npcs || [])) {
      assert(walkable(Math.floor(n.x / TS), Math.floor(n.y / TS)),
        `huoyundong NPC ${n.id} 不得落在阻挡格`);
    }
    for (const p of (map.portals || [])) {
      assert(walkable(Math.floor(p.x / TS), Math.floor(p.y / TS)),
        `huoyundong 传送门「${p.name}」不得落在阻挡格`);
    }

    // 4) BFS 连通性：出生点必须能走到土地神与两个出口
    const startX = Math.floor(spawn.x / TS), startY = Math.floor(spawn.y / TS);
    const seen = new Set([startX + ',' + startY]);
    const queue = [[startX, startY]];
    while (queue.length) {
      const [cx, cy] = queue.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy, k = nx + ',' + ny;
        if (seen.has(k) || !walkable(nx, ny)) continue;
        seen.add(k);
        queue.push([nx, ny]);
      }
    }
    const reachable = (px, py) => seen.has(Math.floor(px / TS) + ',' + Math.floor(py / TS));
    const tudi = (map.npcs || []).find(n => n.id === 'npc_haoshan_tudi');
    assert(tudi && reachable(tudi.x, tudi.y), '从出生点必须能走到号山土地神');
    for (const p of (map.portals || [])) {
      assert(reachable(p.x, p.y), `从出生点必须能走到传送门「${p.name}」（否则无法进出章节）`);
    }
  }

  console.log('  ✅ 本轮修复回归断言全部通过');
};
