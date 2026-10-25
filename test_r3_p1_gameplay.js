/**
 * test_r3_p1_gameplay.js
 * 
 * 专门针对交接任务 R3 & P1 的端到端自动化测试回归：
 * R3: 序章至长安统一目标查询 (getUnifiedStoryLead、功德簿、小地图、引路传送、刘伯钦对白分支)
 * P1: 银角大王“移山压顶”策略机制样板 (预告蓄力、应对防御减伤60%、控制法术打断、目标失效落空、调匀气息喘息轮、周期复位)
 */

module.exports = async function runR3P1Tests(assert) {
  console.log('\n▶️ [R3 & P1 主线指引与Boss意图测试] 统一主线引路与银角大王移山压顶策略');

  const app = window.App2D;
  const minimap = app.minimap;

  // =========================================================================
  // R3.1: 统一历程定义字典与纯查询函数 getUnifiedStoryLead
  // =========================================================================
  assert(window.GAME_DATA.UNIFIED_STORY_PHASES, 'R3.1: window.GAME_DATA.UNIFIED_STORY_PHASES 字典存在');
  assert(typeof window.GAME_DATA.getUnifiedStoryLead === 'function', 'R3.1: getUnifiedStoryLead 纯查询函数挂载成功');

  // 验证序章至长安关键阶段均已纳入统一字典
  const requiredPhases = [
    'heaven_prologue', 'heaven_to_water_pavilion', 'heaven_pantao_start', 'heaven_to_lingxiao',
    'heaven_saved_change', 'heaven_saved_juanlian', 'heaven_huaguoshan', 'heaven_huaguoshan_shuilien',
    'heaven_huaguoshan_rescue', 'heaven_juling_defeated', 'heaven_final_wukong', 'heaven_tiangong_trial',
    'liujiacun_start', 'liujiacun_find_mushrooms', 'liujiacun_mushrooms_collected', 'liujiacun_go_cut_wood',
    'liujiacun_wood_gathering', 'liujiacun_wood_collected', 'liujiacun_rat_hunting', 'liujiacun_rats_cleared',
    'liujiacun_go_changan', 'liujiacun_hunted', 'changan_arrived', 'changan_guided', 'chentang_investigate',
    'changan_meet_xuanzang', 'changan_meet_taizong', 'changan_farewell'
  ];
  for (const p of requiredPhases) {
    assert(!!window.GAME_DATA.UNIFIED_STORY_PHASES[p], `R3.1: 统一历程字典包含阶段【${p}】`);
  }

  // 动态进度计算验证：采蘑菇 (0/2 -> 1/2 -> 2/2)
  const lead0 = window.GAME_DATA.getUnifiedStoryLead('liujiacun_find_mushrooms', 'liujiacun', { mushrooms: 0 });
  assert(lead0.stepProgress === '0/2' && !lead0.isDone, 'R3.1: 采蘑菇 0/2 进度准确未完成');

  const lead1 = window.GAME_DATA.getUnifiedStoryLead('liujiacun_find_mushrooms', 'liujiacun', { mushrooms: 1 });
  assert(lead1.stepProgress === '1/2' && !lead1.isDone, 'R3.1: 采蘑菇 1/2 进度准确未完成');

  const lead2 = window.GAME_DATA.getUnifiedStoryLead('liujiacun_find_mushrooms', 'liujiacun', { mushrooms: 2 });
  assert(lead2.stepProgress === '2/2' && lead2.isDone, 'R3.1: 采蘑菇 2/2 进度准确且标记完成');

  // 动态进度计算验证：伐枯树 (1/4 -> 4/4)
  const leadTree1 = window.GAME_DATA.getUnifiedStoryLead('liujiacun_go_cut_wood', 'liujiacun', { trees: 1 });
  assert(leadTree1.stepProgress === '1/4' && !leadTree1.isDone, 'R3.1: 砍柴 1/4 进度准确未完成');

  const leadTree4 = window.GAME_DATA.getUnifiedStoryLead('liujiacun_go_cut_wood', 'liujiacun', { trees: 4 });
  assert(leadTree4.stepProgress === '4/4' && leadTree4.isDone, 'R3.1: 砍柴 4/4 进度准确且标记完成');

  // =========================================================================
  // R3.2: 功德簿、小地图追踪信标与寻路跨图指引三方严格一致
  // =========================================================================
  const originalPhase = app.storyPhase;
  const originalMapId = app.currentMapId;
  const originalKills = app.questKills;

  try {
    // 验证刘家村开局
    app.storyPhase = 'liujiacun_start';
    app.currentMapId = 'liujiacun';
    app.questKills = { mushrooms: 0, trees: 0, rats: 0 };

    const ordealInfo = app.getOrdealAndQuestInfo();
    const mapTarget = minimap.getCurrentQuestTarget('liujiacun', 'liujiacun_start', window.GAME_DATA.MAPS_2D['liujiacun']);
    const unified = window.GAME_DATA.getUnifiedStoryLead('liujiacun_start', 'liujiacun', app.questKills);

    assert(ordealInfo.stepName === unified.stepName, 'R3.2: 任务簿步骤名与统一源一致');
    assert(ordealInfo.ordealNumber === unified.ordealNumber, 'R3.2: 任务簿难数与统一源一致');
    assert(mapTarget.x === unified.targetCoords.x && mapTarget.y === unified.targetCoords.y, 'R3.2: 小地图信标坐标与统一源完全吻合 (384, 352)');
    assert(mapTarget.name === unified.targetName, 'R3.2: 小地图信标名称与统一源一致【镇山太保刘伯钦】');

    // 验证跨地图引导：身在天宫却处于刘家村阶段，引路指向正确目的地
    app.currentMapId = 'tiangong_palace';
    let guidedMap = null;
    let guidedName = null;
    const origGuideToMap = app.guideToMap;
    app.guideToMap = (mapId, name) => { guidedMap = mapId; guidedName = name; };
    app.teleportToStoryLead();
    assert(guidedMap === 'liujiacun', 'R3.2: 身在天宫时跨地图自动寻路精确导航至【liujiacun】');
    assert(guidedName === '两界山·刘家村', 'R3.2: 跨地图导航名称精确指示【两界山·刘家村】');
    app.guideToMap = origGuideToMap;

    // 验证长安阶段
    app.storyPhase = 'changan_arrived';
    app.currentMapId = 'changan_city';
    const changanTarget = minimap.getCurrentQuestTarget('changan_city', 'changan_arrived', window.GAME_DATA.MAPS_2D['changan_city']);
    assert(changanTarget.name.includes('茶肆阿婆'), 'R3.2: 长安抵达后小地图信标指向茶肆阿婆');
    assert(changanTarget.x === 18 * 32 && changanTarget.y === 19 * 32, 'R3.2: 茶肆阿婆小地图坐标精准为 (576, 608)');

  } finally {
    app.storyPhase = originalPhase;
    app.currentMapId = originalMapId;
    app.questKills = originalKills;
  }

  // =========================================================================
  // R3.3: 刘伯钦对白分支与生活化文案验证
  // =========================================================================
  const boqinTalk = window.GAME_DATA.STORY_DIALOGUES.liuboqin_talk;
  assert(boqinTalk && Array.isArray(boqinTalk.steps), 'R3.3: liuboqin_talk 存在且为有效对白流');
  assert(typeof boqinTalk.steps[3].action === 'function', 'R3.3: steps[3].action 保持直接可调用 (旧单元测试向前兼容保证)');
  assert(Array.isArray(boqinTalk.steps[3].options) && boqinTalk.steps[3].options.length === 3, 'R3.3: liuboqin_talk 拥有三个清晰选项分支');
  assert(boqinTalk.steps[3].options[0].text.includes('继续主线'), 'R3.3: 选项一为【继续主线】');
  assert(boqinTalk.steps[3].options[1].text.includes('问问缘由'), 'R3.3: 选项二为【问问缘由】');
  assert(boqinTalk.steps[3].options[2].text.includes('稍后再来'), 'R3.3: 选项三为【稍后再来】');

  const boqinWoodDone = window.GAME_DATA.STORY_DIALOGUES.liuboqin_mushroom_done;
  assert(boqinWoodDone.steps[1].text.includes('干枝带回来，青树留着。明年咱们还得烧火，不能一顿饭把山吃完'),
    'R3.3: 砍柴对白采纳生活化口吻：“干枝带回来，青树留着。明年咱们还得烧火，不能一顿饭把山吃完。”');
  assert(Array.isArray(boqinWoodDone.steps[1].options) && boqinWoodDone.steps[1].options.length === 3, 'R3.3: 交付蘑菇对白拥有清晰选项分支');

  // =========================================================================
  // P1.1: 银角大王“移山压顶” Round 1 蓄力预告
  // =========================================================================
  const player = new window.Player({
    id: 'hero_test',
    name: '齐天少侠',
    level: 50,
    hp: 4000,
    maxHp: 4000,
    mp: 1500,
    maxMp: 1500,
    atk: 360,
    def: 180,
    spd: 50
  });

  const yinjiaoBoss = {
    id: 'boss_yinjiao',
    enemyIndex: 0,
    name: '银角大王',
    level: 50,
    hp: 24000,
    maxHp: 24000,
    mp: 6000,
    maxMp: 6000,
    atk: 340,
    def: 180,
    spd: 45,
    skills: ['移山压顶', '封印咒', '飞沙走石', '三昧真火', '雷霆万钧']
  };

  const battle = new window.BattleEngine(player, [], [yinjiaoBoss]);
  assert(battle.bossIntents && battle.bossIntents.length === 1, 'P1.1: 首回合初始化成功生成 Boss 意图');

  const intentR1 = battle.bossIntents[0];
  assert(intentR1.enemyId === 'boss_yinjiao', 'P1.1: 意图归属敌人为【boss_yinjiao】');
  assert(intentR1.skillName === '移山压顶', 'P1.1: 蓄力招式为【移山压顶】');
  assert(intentR1.status === 'telegraphed', 'P1.1: 第 1 回合状态为已预告【telegraphed】');
  assert(intentR1.targetId === 'player', 'P1.1: 锁定目标为己方主战玩家');
  assert(intentR1.telegraphRound === 1 && intentR1.executeRound === 2, 'P1.1: 明确第 1 回合蓄力，第 2 回合发动');

  // =========================================================================
  // P1.2: Round 2 执行轮与防御减伤 60% 验证
  // =========================================================================
  // 模拟测试一：玩家不防御时受到重创
  const battleUndefended = new window.BattleEngine(player, [], [{ ...yinjiaoBoss, hp: 24000 }]);
  battleUndefended.round = 2; // 跳至第2回合执行
  battleUndefended.updateBossIntents();

  const allyPlayer = battleUndefended.allies.find(a => a.isPlayer);
  allyPlayer.hp = 4000;
  allyPlayer.maxHp = 4000;
  allyPlayer.buffs = []; // 无防御

  let undefendedDmg = 0;
  await battleUndefended.handleYinjiaoYishanTurn(battleUndefended.enemies[0], battleUndefended.bossIntents[0], async (ev) => {
    if (ev.damage) undefendedDmg = ev.damage;
  });

  assert(undefendedDmg > 2000, `P1.2: 未防御时受到移山压顶巨创 (伤害: ${undefendedDmg})`);
  assert(allyPlayer.hp === 4000 - undefendedDmg, 'P1.2: 伤害真实从玩家气血扣除');

  // 模拟测试二：玩家凝神防御，减免 60% 伤害 (承受 40%)
  const battleDefended = new window.BattleEngine(player, [], [{ ...yinjiaoBoss, hp: 24000 }]);
  battleDefended.round = 2;
  battleDefended.updateBossIntents();

  const allyPlayerDef = battleDefended.allies.find(a => a.isPlayer);
  allyPlayerDef.hp = 4000;
  allyPlayerDef.maxHp = 4000;
  allyPlayerDef.buffs = [{ name: '防御', duration: 1 }]; // 开启防御

  let defendedDmg = 0;
  let stepIsDefended = false;
  await battleDefended.handleYinjiaoYishanTurn(battleDefended.enemies[0], battleDefended.bossIntents[0], async (ev) => {
    if (ev.damage) defendedDmg = ev.damage;
    if (ev.isDefended) stepIsDefended = true;
  });

  assert(stepIsDefended === true, 'P1.2: 演出回调准确标记 isDefended 为 true');
  const expectedDefendedDmg = Math.floor(undefendedDmg * 0.40);
  assert(Math.abs(defendedDmg - expectedDefendedDmg) <= 2,
    `P1.2: 防御状态减伤60%生效！未防御伤害 ${undefendedDmg} -> 防御伤害 ${defendedDmg} (预期承受约 40%: ${expectedDefendedDmg})`);

  // =========================================================================
  // P1.3: Round 2 控制法术打断 (封印/定身)
  // =========================================================================
  const battleInterrupt = new window.BattleEngine(player, [], [{ ...yinjiaoBoss, hp: 24000 }]);
  battleInterrupt.round = 2;
  battleInterrupt.updateBossIntents();

  // 给银角大王施加封印咒
  battleInterrupt.enemies[0].buffs = [{ id: 'fengyin', name: '封印', duration: 2 }];
  const targetPlayer = battleInterrupt.allies.find(a => a.isPlayer);
  targetPlayer.hp = 4000;

  let interruptedEvent = null;
  await battleInterrupt.handleYinjiaoYishanTurn(battleInterrupt.enemies[0], battleInterrupt.bossIntents[0], async (ev) => {
    interruptedEvent = ev;
  });

  assert(interruptedEvent && interruptedEvent.type === 'boss_intent_interrupted', 'P1.3: 施加封印后成功触发 boss_intent_interrupted 回调');
  assert(battleInterrupt.bossIntents[0].status === 'interrupted', 'P1.3: 意图状态被标记为【interrupted】');
  assert(targetPlayer.hp === 4000, 'P1.3: 技能被打断，目标未受到任何伤害 (血量保持 4000/4000)');

  // =========================================================================
  // P1.4: 目标失效/离场时安全取消，杜绝偷换目标
  // =========================================================================
  const battleCancel = new window.BattleEngine(player, [], [{ ...yinjiaoBoss, hp: 24000 }]);
  battleCancel.round = 2;
  battleCancel.updateBossIntents();

  // 锁定目标阵亡
  const targetToDie = battleCancel.allies.find(a => a.isPlayer);
  targetToDie.hp = 0;

  let cancelledEvent = null;
  await battleCancel.handleYinjiaoYishanTurn(battleCancel.enemies[0], battleCancel.bossIntents[0], async (ev) => {
    cancelledEvent = ev;
  });

  assert(cancelledEvent && cancelledEvent.type === 'boss_intent_cancelled', 'P1.4: 目标死亡后触发 boss_intent_cancelled 回调');
  assert(battleCancel.bossIntents[0].status === 'cancelled', 'P1.4: 意图状态安全置为【cancelled】');

  // =========================================================================
  // P1.5: Round 3 喘息轮 (调匀气息) 与 Round 4 周期复位
  // =========================================================================
  const battleCycle = new window.BattleEngine(player, [], [{ ...yinjiaoBoss, hp: 24000 }]);

  // 推进到第 3 回合 (喘息轮)
  battleCycle.round = 3;
  battleCycle.updateBossIntents();
  const intentR3 = battleCycle.bossIntents.find(i => i.enemyId === 'boss_yinjiao');
  assert(intentR3 && intentR3.status === 'breathing', 'P1.5: 第 3 回合银角大王进入【breathing】喘息状态');
  assert(intentR3.skillName === '调匀气息', 'P1.5: 喘息轮招式为【调匀气息】');

  // 推进到第 4 回合 (下一周期开始，重新蓄力预告)
  battleCycle.round = 4;
  battleCycle.updateBossIntents();
  const intentR4 = battleCycle.bossIntents.find(i => i.enemyId === 'boss_yinjiao');
  assert(intentR4 && intentR4.status === 'telegraphed', 'P1.5: 第 4 回合周期复位，重新开始蓄力预告【telegraphed】');
  assert(intentR4.executeRound === 5, 'P1.5: 新周期执行回合自动排定为第 5 回合');
};
