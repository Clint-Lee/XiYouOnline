/**
 * test_p3_gameplay.js
 *
 * 专门针对交接任务 P3 培养反馈与队伍选择的端到端自动化测试回归：
 * P3.1: 加点定位建议 (纯文字、门派/定位分发、宠物成长率区间展示、取消不修改角色)
 * P3.2: 祖师传法资格指引 (普通不可受法 / 未到10级 / 已受法 / 已可受法 四种准确原因)
 * P3.3: 物种战斗定位标签 (同档百分位判定、三只前期宠定位互异、设计原型核对、战时仙宠名册真实残血与出战位)
 * P5.2: 舒适设置 (战斗演出速度持久化、低动态效果开关、开战沿用速度偏好)
 * P4.2: 同行闲谈 (三组按剧情解锁、纯对话无奖励无状态写入、战斗中不开放)
 */

module.exports = async function runP3GameplayTests(assert) {
  console.log('\n▶️ [P3 培养反馈与队伍选择测试] 定位标签、传法指引、加点建议、战时名册、舒适设置与同行闲谈');

  const app = window.App2D;
  const gameData = window.GAME_DATA;

  // 隔离测试 App 工厂 (沿用 P2 测试的隔离模式，不污染真实运行状态)
  const makeTestApp = (overrides = {}) => Object.assign(Object.create(Object.getPrototypeOf(app)), app, overrides);
  const captureBodyHtml = (fn) => {
    const prev = global.document.body.innerHTML;
    global.document.body.innerHTML = '';
    try {
      fn();
      return global.document.body.innerHTML;
    } finally {
      global.document.body.innerHTML = prev;
    }
  };

  // =========================================================================
  // P3.3a: 物种战斗定位标签 getSpeciesRoleProfile
  // =========================================================================
  assert(typeof gameData.getSpeciesRoleProfile === 'function', 'P3.3: getSpeciesRoleProfile 物种定位函数挂载成功');

  const VALID_TAGS = new Set(['耐久承伤', '速度先手', '物理输出', '均衡成长']);
  const allSpecies = Object.values(gameData.PETS || {}).filter(s => s.initialStats);
  assert(allSpecies.length === 77, `P3.3: 物种库共 ${allSpecies.length} 种 (50凡兽+12散仙+15金仙)`);

  for (const sp of allSpecies) {
    const role = gameData.getSpeciesRoleProfile(sp.id);
    assert(!!role && VALID_TAGS.has(role.tag), `P3.3: 物种【${sp.name}】定位标签合法【${role ? role.tag : '无'}】`);
    assert(typeof role.icon === 'string' && role.icon.length > 0 && typeof role.desc === 'string' && role.desc.length > 0,
      `P3.3: 物种【${sp.name}】定位附带图标与用途说明`);
  }

  // 三只前期可得普通宠定位互异 (P3.3 首批样板要求)
  const ratRole = gameData.getSpeciesRoleProfile('shuo_shu');
  const treeRole = gameData.getSpeciesRoleProfile('kushu_jing');
  const hooliganRole = gameData.getSpeciesRoleProfile('hooligan_wild');
  assert(ratRole.tag === '均衡成长', `P3.3: 偷粮硕鼠定位【${ratRole.tag}】为均衡成长 (各维平稳的起步宠)`);
  assert(treeRole.tag === '耐久承伤', `P3.3: 百年树精定位【${treeRole.tag}】为耐久承伤 (血防见长)`);
  assert(hooliganRole.tag === '速度先手', `P3.3: 街头混混定位【${hooliganRole.tag}】为速度先手 (相对同类出手靠前)`);
  assert(new Set([ratRole.tag, treeRole.tag, hooliganRole.tag]).size === 3, 'P3.3: 三只前期宠定位标签互不相同，构成不同队伍样板');

  // 设计原型核对：散仙/金仙代表物种与策划文档口径一致
  assert(gameData.getSpeciesRoleProfile('leigong').tag === '速度先手', 'P3.3: 雷公定位为速度先手 (散仙速度型)');
  assert(gameData.getSpeciesRoleProfile('juling_shen').tag === '耐久承伤', 'P3.3: 巨灵神定位为耐久承伤 (散仙气血型)');
  assert(gameData.getSpeciesRoleProfile('yuanhou_jiang').tag === '物理输出', 'P3.3: 猿猴将定位为物理输出 (凡宠攻血之冠)');
  assert(gameData.getSpeciesRoleProfile('zhu_bajie').tag === '物理输出', 'P3.3: 猪八戒定位为物理输出 (金仙高攻)');
  assert(gameData.getSpeciesRoleProfile('baigu_jing').tag === '速度先手', 'P3.3: 白骨精定位为速度先手 (金仙速度特化型)');

  // 非法入参安全
  assert(gameData.getSpeciesRoleProfile('no_such_species') === null, 'P3.3: 未知物种ID安全返回 null');
  assert(gameData.getSpeciesRoleProfile(null) === null, 'P3.3: 空入参安全返回 null');

  // =========================================================================
  // P3.2: 祖师传法资格指引 getMasterLessonGuidance (四种准确原因)
  // =========================================================================
  const ordinaryPet = window.PetSystem.createPet('shuo_shu', false, 12);
  const g1 = app.getMasterLessonGuidance(ordinaryPet);
  assert(g1.status === 'ineligible' && g1.hint.includes('普通仙宠'), 'P3.2: 普通仙宠提示无法受法的准确原因');

  const sanxianLow = window.PetSystem.createPet('baihua_she', false, 8);
  const g2 = app.getMasterLessonGuidance(sanxianLow);
  assert(g2.status === 'under_level' && g2.hint.includes('Lv.8') && g2.hint.includes('还差 2 级'),
    'P3.2: 未满10级散仙提示当前等级与还差级数');

  const sanxianReady = window.PetSystem.createPet('baihua_she', false, 10);
  const g3 = app.getMasterLessonGuidance(sanxianReady);
  assert(g3.status === 'ready' && g3.hint.includes('长安神坛') && g3.hint.includes('每只一次'),
    'P3.2: 满级散仙提示前往长安神坛菩提祖师处受法');

  const learned = window.PetSystem.createPet('baihua_she', false, 10);
  const learnRes = window.PetSystem.learnSkill(learned);
  assert(learnRes.success, 'P3.2: 测试夹具散仙成功受法');
  const g4 = app.getMasterLessonGuidance(learned);
  assert(g4.status === 'learned' && g4.hint.includes(learned.skills[0].name),
    `P3.2: 已受法仙宠展示已学技能名【${learned.skills[0].name}】而非笼统置灰`);
  assert(app.getMasterLessonGuidance(null) === null, 'P3.2: 空入参安全返回 null');

  // =========================================================================
  // P3.1: 加点定位建议 getAllocationAdvice (纯文字，不自动分配)
  // =========================================================================
  const adviceApp = makeTestApp({
    playerData: new window.Player({ name: '加点测试', classId: 'jingang', level: 45, hp: 3000, maxHp: 3000, mp: 5000, maxMp: 5000 })
  });
  const jgAdvice = adviceApp.getAllocationAdvice('hero');
  assert(Array.isArray(jgAdvice) && jgAdvice.length >= 2 && jgAdvice.length <= 3, 'P3.1: 金刚门派建议为 2~3 条');
  assert(jgAdvice.some(a => a.text.includes('血')) && jgAdvice.every(a => a.name && a.text), 'P3.1: 金刚建议文案血量优先且条目完整');

  adviceApp.playerData.classId = 'yaomo';
  assert(adviceApp.getAllocationAdvice('hero').some(a => a.text.includes('精')), 'P3.1: 妖魔门派建议法力优先');
  adviceApp.playerData.classId = 'xianren';
  assert(adviceApp.getAllocationAdvice('hero').some(a => a.text.includes('速')), 'P3.1: 神仙门派建议速度优先');
  adviceApp.playerData.classId = null;
  const genericAdvice = adviceApp.getAllocationAdvice('hero');
  assert(genericAdvice.length === 3 && genericAdvice.some(a => a.name === '耐久生存'), 'P3.1: 未选门派时回落通用三向建议');

  // 宠物建议按定位标签分发
  const tankAdvice = adviceApp.getAllocationAdvice('pet', ordinaryPet); // 均衡成长
  assert(tankAdvice.some(a => a.text.includes('血')) && tankAdvice.every(a => a.name && a.text), 'P3.1: 均衡成长宠建议保守偏血');
  const speedPet = window.PetSystem.createPet('hooligan_wild', false, 5); // 速度先手
  assert(adviceApp.getAllocationAdvice('pet', speedPet).some(a => a.text.includes('速')), 'P3.1: 速度先手宠建议速度优先');
  const tankPet = window.PetSystem.createPet('kushu_jing', false, 5); // 耐久承伤
  assert(adviceApp.getAllocationAdvice('pet', tankPet).some(a => a.text.includes('血')), 'P3.1: 耐久承伤宠建议血量优先');

  // =========================================================================
  // P3.1: 加点弹窗渲染 (建议区块 + 宠物成长率区间 + 取消不修改角色)
  // =========================================================================
  const heroAlloc = makeTestApp({
    playerData: new window.Player({ name: '加点面板', classId: 'jingang', level: 45, hp: 3000, maxHp: 3000, mp: 5000, maxMp: 5000 }),
    pets: []
  });
  heroAlloc.playerData.potentialPoints = 5;
  const heroHtml = captureBodyHtml(() => heroAlloc.openStatAllocationModal('hero'));
  assert(heroHtml.includes('加点定位参考') && heroHtml.includes('金刚铁壁'), 'P3.1: 本尊加点面板渲染定位建议区块');
  assert(heroHtml.includes('id="preview-hp"') && heroHtml.includes('id="preview-atk"'), 'P3.1: 面板保留原有实时属性预览');

  const petAlloc = makeTestApp({
    playerData: new window.Player({ name: '宠物加点面板', classId: 'jingang', level: 45, hp: 3000, maxHp: 3000, mp: 5000, maxMp: 5000 }),
    pets: [window.PetSystem.createPet('kushu_jing', false, 5)]
  });
  const petHtml = captureBodyHtml(() => petAlloc.openStatAllocationModal('pet', 0));
  assert(petHtml.includes('物种区间') && petHtml.includes('实际成长'), 'P3.1: 仙宠加点面板展示实际成长与物种区间对照');
  assert(petHtml.includes('耐久承伤'), 'P3.1: 仙宠加点面板带出物种定位标签');

  // 取消不修改：加点后直接关闭弹窗，角色与潜能点保持原状
  const beforeAttrs = { ...heroAlloc.playerData.attributes };
  const beforePts = heroAlloc.playerData.potentialPoints;
  heroAlloc.openStatAllocationModal('hero');
  heroAlloc.adjustAlloc('sheng', 2);
  assert(heroAlloc._allocSession.tempAttrs.sheng === beforeAttrs.con + 2 && heroAlloc._allocSession.tempPoints === beforePts - 2,
    'P3.1: 会话内加点点数与预览正确联动');
  heroAlloc._allocSession = null; // 直接关闭弹窗 (不点保存)
  assert(heroAlloc.playerData.attributes.con === beforeAttrs.con && heroAlloc.playerData.potentialPoints === beforePts,
    'P3.1: 未保存关闭弹窗不修改任何角色属性 (取消不生效)');

  // 保存才生效
  heroAlloc.openStatAllocationModal('hero');
  heroAlloc.adjustAlloc('li', 1);
  heroAlloc.saveAlloc();
  assert(heroAlloc.playerData.attributes.str === beforeAttrs.str + 1 && heroAlloc.playerData.potentialPoints === beforePts - 1,
    'P3.1: 确认保存后加点正式生效');

  // =========================================================================
  // P3.2/P3.3: 仙宠面板渲染 (定位徽章 + 传法准确指引)
  // =========================================================================
  const petPanelApp = makeTestApp({
    playerData: new window.Player({ name: '面板测试', classId: 'jingang', level: 45, hp: 3000, maxHp: 3000, mp: 5000, maxMp: 5000 }),
    pets: [ordinaryPet, sanxianLow, learned],
    activeCombatPets: []
  });
  const panelHtml = captureBodyHtml(() => petPanelApp.openPetManageModal());
  assert(panelHtml.includes('耐久承伤') || panelHtml.includes('速度先手') || panelHtml.includes('均衡成长'),
    'P3.3: 仙宠面板渲染物种定位徽章');
  assert(panelHtml.includes('普通仙宠仅能普攻'), 'P3.2: 普通仙宠卡片展示不可受法原因');
  assert(panelHtml.includes('还差 2 级'), 'P3.2: 未满级仙宠卡片展示差级数');
  assert(panelHtml.includes(learned.skills[0].name), `P3.2: 已受法仙宠卡片展示所学技能名【${learned.skills[0].name}】`);

  // =========================================================================
  // P3.3: 战时仙宠名册 (战斗仙宠按钮 → 真实残血/状态/出战位)
  // =========================================================================
  const rosterPet1 = window.PetSystem.createPet('kushu_jing', false, 10);
  const rosterPet2 = window.PetSystem.createPet('hooligan_wild', false, 10);
  rosterPet1.hp = Math.max(1, Math.floor(rosterPet1.maxHp * 0.2)); // 残血样板
  const rosterApp = makeTestApp({
    playerData: new window.Player({ name: '战时名册', classId: 'jingang', level: 45, hp: 3000, maxHp: 3000, mp: 5000, maxMp: 5000 }),
    pets: [rosterPet1, rosterPet2],
    activeCombatPets: [rosterPet1],
    currentBattle: {
      status: 'awaiting',
      allies: [{ id: 'player', isPlayer: true, hp: 3000 }, { id: 'pet_1', instanceId: rosterPet1.instanceId, hp: rosterPet1.hp }],
      enemies: [{ id: 'enemy_0', enemyIndex: 0, hp: 100 }]
    }
  });
  assert(rosterApp.openBattlePetRosterModal !== undefined, 'P3.3: 战时仙宠名册方法存在');

  const rosterHtml = captureBodyHtml(() => rosterApp.openBattlePetRosterModal());
  assert(rosterHtml.includes('战时仙宠名册'), 'P3.3: 名册面板标题渲染');
  assert(rosterHtml.includes('⚔️ 阵前作战') && rosterHtml.includes('🛡️ 备战待命'), 'P3.3: 名册区分阵前作战与备战待命');
  assert(rosterHtml.includes(`气血 ${rosterPet1.hp}/${rosterPet1.maxHp}`), 'P3.3: 名册展示真实残血数值');
  assert(rosterHtml.includes('⚠气血偏低'), 'P3.3: 低气血同伴附带醒目警示');
  assert(rosterHtml.includes('出战 1 / 3'), 'P3.3: 名册头部展示出战位占用 1/3');

  // 战斗蜂窝"仙宠"按钮接入名册
  const hexHtml = captureBodyHtml(() => rosterApp.handleHexCombatAction('pet'));
  assert(hexHtml.includes('战时仙宠名册'), 'P3.3: 战斗蜂窝【仙宠】按钮真实打开战时名册 (不再是空提示)');

  // 无战斗时安全空操作
  const noBattleApp = makeTestApp({ currentBattle: null });
  const guardHtml = captureBodyHtml(() => noBattleApp.openBattlePetRosterModal());
  assert(!guardHtml.includes('战时仙宠名册'), 'P3.3: 非战斗状态调用名册安全空操作');

  // =========================================================================
  // P5.2: 舒适设置 (演出速度持久化 + 低动态效果)
  // =========================================================================
  localStorage.removeItem('xiyou_combat_speed_pref');
  localStorage.removeItem('xiyou_reduced_motion');
  assert(app.getCombatSpeedPref() === 1, 'P5.2: 演出速度默认 1x');
  assert(app.isReducedMotionEnabled() === false, 'P5.2: 低动态效果默认关闭');

  app.setCombatSpeedPref(2);
  assert(app.getCombatSpeedPref() === 2 && localStorage.getItem('xiyou_combat_speed_pref') === '2',
    'P5.2: 演出速度偏好 2x 写入并回读一致');
  app.setCombatSpeedPref(1);
  assert(app.getCombatSpeedPref() === 1, 'P5.2: 演出速度偏好恢复 1x');
  localStorage.setItem('xiyou_combat_speed_pref', '9');
  assert(app.getCombatSpeedPref() === 1, 'P5.2: 非法速度值安全回落 1x');
  localStorage.removeItem('xiyou_combat_speed_pref');

  localStorage.setItem('xiyou_reduced_motion', '1');
  assert(app.isReducedMotionEnabled() === true, 'P5.2: 低动态效果标记可开启');
  localStorage.setItem('xiyou_reduced_motion', '0');
  assert(app.isReducedMotionEnabled() === false, 'P5.2: 低动态效果标记可关闭');
  localStorage.removeItem('xiyou_reduced_motion');

  const comfortHtml = captureBodyHtml(() => app.openComfortSettingsModal());
  assert(comfortHtml.includes('战斗演出速度') && comfortHtml.includes('低动态效果'), 'P5.2: 舒适设置面板渲染两项设置');
  assert(comfortHtml.includes('不影响出手顺序') && comfortHtml.includes('信息保持完整'),
    'P5.2: 设置面板明示仅影响演出、不影响结算与信息');

  // 开战沿用已保存的速度偏好 (真实 start2DBattle 链路)
  const layerEl = global.document.createElement('div');
  layerEl.id = 'battle-screen-layer';
  global.document.body.appendChild(layerEl);
  app.setCombatSpeedPref(2);
  const battleStartApp = makeTestApp({
    currentBattle: null,
    isTransitioning: false,
    autoMovePath: [],
    autoMoveTargetCallback: null,
    keysDown: {},
    companions: [],
    pets: [],
    activeCombatPets: [],
    currentMapId: 'liujiacun',
    playerData: new window.Player({ name: '速度偏好', classId: 'jingang', level: 45, hp: 3000, maxHp: 3000, mp: 5000, maxMp: 5000 }),
    getShanhai: () => ({ observe() { } }),
    renderBattleInterface() { },
    startBattleCountdown() { },
    startBattleLoop() { }
  });
  try {
    // 显式取原型方法：套件中较早的用例可能把实例上的 start2DBattle 替换为桩 (测试38遗留)，
    // 直接调用原型实现可确保验证的是真实开战链路。
    Object.getPrototypeOf(app).start2DBattle.call(battleStartApp,
      [{ id: 'speed_enemy', name: '速度试炼桩', level: 1, hp: 500, maxHp: 500, mp: 100, maxMp: 100, atk: 1, def: 0, spd: 1 }], () => { });
    assert(battleStartApp.currentBattle !== null, 'P5.2: 试炼战斗成功开启');
    assert(battleStartApp.combatSpeedMultiplier === 2, 'P5.2: 新战斗沿用已保存的 2x 演出速度偏好');
  } finally {
    app.setCombatSpeedPref(1);
    battleStartApp.currentBattle = null;
  }

  // =========================================================================
  // P4.2: 同行闲谈 (三组按剧情解锁，纯对话无奖励)
  // =========================================================================
  const banterApp = makeTestApp({
    companions: [],
    playerData: new window.Player({ name: '闲谈测试', classId: 'jingang', level: 45, hp: 3000, maxHp: 3000, mp: 5000, maxMp: 5000 }),
    currentBattle: null,
    isTransitioning: false
  });
  banterApp.playerData.storyEvents = {};

  let groups = banterApp.getCompanionBanterGroups();
  assert(Array.isArray(groups) && groups.length === 3, 'P4.2: 同行闲谈共三组话题定义');
  assert(groups.every(g => !g.available), 'P4.2: 初始无同伴无事件时三组均未解锁');
  assert(groups.every(g => Array.isArray(g.steps) && g.steps.length >= 2 && g.steps.length <= 4),
    'P4.2: 每组闲谈为 2~4 句轻量对话');

  const emptyHtml = captureBodyHtml(() => banterApp.openCompanionBanterModal());
  assert(emptyHtml.includes('同行闲谈') && emptyHtml.includes('同行之人尚未到齐'), 'P4.2: 无解锁时展示空态引导而非空白');

  // 八戒入队 → 高老庄闲谈解锁
  banterApp.companions = [{ id: 'companion_bajie', name: '天蓬元帅猪八戒' }];
  groups = banterApp.getCompanionBanterGroups();
  assert(groups.find(g => g.id === 'banter_gaolao').available, 'P4.2: 八戒入队解锁高老庄闲谈');
  assert(!groups.find(g => g.id === 'banter_wuzhuang').available, 'P4.2: 五庄观闲谈仍锁定');

  // 救树完成 → 五庄观闲谈解锁
  banterApp.playerData.storyEvents.wuzhuang_tree_restored = true;
  assert(banterApp.getCompanionBanterGroups().find(g => g.id === 'banter_wuzhuang').available,
    'P4.2: 人参果树复生事件解锁五庄观闲谈');

  // 平顶山收宝 → 平顶山闲谈解锁
  banterApp.storyPhase = 'pingding_cleared';
  assert(banterApp.getCompanionBanterGroups().find(g => g.id === 'banter_pingding').available,
    'P4.2: 老君收宝后 (pingding_cleared) 解锁平顶山闲谈');

  // 解锁后面板渲染话题入口
  const banterHtml = captureBodyHtml(() => banterApp.openCompanionBanterModal());
  assert(banterHtml.includes('高老庄路上') && banterHtml.includes('五庄观') && banterHtml.includes('平顶山下'),
    'P4.2: 已解锁话题在面板中全部可见');
  assert(banterHtml.includes('不影响主线'), 'P4.2: 面板明示闲谈不影响主线不发奖励');

  // 闲谈对话纯净化：无 action、无奖励、说话人均为在册同伴
  const KNOWN_SPEAKERS = new Set(['孙悟空', '猪八戒', '沙和尚', '唐三藏']);
  for (const g of banterApp.getCompanionBanterGroups()) {
    for (const step of g.steps) {
      assert(!step.action && !step.options && !step.reward, `P4.2: 话题【${g.title}】对白不携带 action/选项/奖励`);
      assert(KNOWN_SPEAKERS.has(step.speaker) && typeof step.text === 'string' && step.text.length > 0,
        `P4.2: 话题【${g.title}】说话人【${step.speaker}】在册且台词完整`);
    }
  }

  // 战斗中不开放闲谈
  banterApp.currentBattle = { status: 'awaiting', allies: [], enemies: [] };
  let battleGuardMsg = null;
  const origShowMsg = window.showGameMessage;
  window.showGameMessage = (msg) => { battleGuardMsg = msg; };
  try {
    const inBattleHtml = captureBodyHtml(() => banterApp.openCompanionBanterModal());
    assert(battleGuardMsg && battleGuardMsg.includes('不是闲聊'), 'P4.2: 战斗中打开闲谈被温和拦截');
    assert(!inBattleHtml.includes('banter-modal') || !inBattleHtml.includes('高老庄路上'), 'P4.2: 战斗中不渲染闲谈面板');
  } finally {
    window.showGameMessage = origShowMsg;
    banterApp.currentBattle = null;
  }

  // 播放闲谈走真实 Dialogue.start，传入纯步骤副本
  let startedScript = null;
  const origDialogueStart = window.Dialogue.start;
  window.Dialogue.start = (script) => { startedScript = script; };
  try {
    banterApp.playCompanionBanter('banter_gaolao');
    assert(startedScript && Array.isArray(startedScript.steps) && startedScript.steps.length === 4,
      'P4.2: 播放闲谈以 4 句纯对白进入对话引擎');
    assert(!startedScript.steps.some(s => s.action), 'P4.2: 进入对话引擎的步骤不含任何剧情动作');
    banterApp.playCompanionBanter('banter_wuzhuang');
    assert(startedScript.steps[0].speaker === '猪八戒', 'P4.2: 重复播放另一组话题正常切换');
  } finally {
    window.Dialogue.start = origDialogueStart;
  }
};
