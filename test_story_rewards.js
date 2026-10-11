module.exports = async function (assert) {
  console.log('\n▶️ [旧章奖励回归] 流沙河与白骨岭战后待领');
  const app = window.App2D;
  const makeFixture = (phase, mapId, slots = []) => {
    const fixture = Object.create(app);
    fixture.playerData = new window.Player({level:42});
    fixture.inventory = new window.Inventory(slots);
    fixture.storyPhase = phase;
    fixture.currentMapId = mapId;
    fixture.companions = [];
    fixture.escortQuest = null;
    fixture.interactedNpcSet = new Set();
    fixture.npcs = [];
    fixture.updatePlayerHud = () => {};
    fixture.saveAutoProgress = () => ({success:true});
    fixture.scheduleStoryDialogue = key => { fixture.lastDialogue = key; };
    fixture.refreshMapNpcs = () => { fixture.npcs = window.GAME_DATA.MAPS_2D[mapId].npcs
      .filter(n => fixture.isNpcVisibleInStoryPhase(n.id, fixture.storyPhase, mapId)); };
    fixture.start2DBattle = (_enemies, onWin) => { fixture.battleCount = (fixture.battleCount || 0) + 1; onWin(); };
    return fixture;
  };
  const fill = itemId => Array.from({length:35}, (_,i) => ({instanceId:'fill_'+i,itemId,count:99}));
  const shaseng = makeFixture('huangfeng_cleared','liushahe',fill('jin_liu_lu'));
  shaseng.inventory.maxSlots = 36;
  shaseng.inventory.addItem('qingquan_jiu', 50);
  const before = JSON.stringify(shaseng.inventory.slots), silver = shaseng.playerData.silver, level = shaseng.playerData.level;
  shaseng.triggerShasengBattle();
  assert(shaseng.battleCount === 1 && shaseng.playerData.storyEvents.shaseng_battle_won && shaseng.lastDialogue === 'shaseng_post_battle',
    '战胜沙僧记录可持久化战斗事件并进入战后对白');
  assert(!shaseng.joinShasengToParty() && JSON.stringify(shaseng.inventory.slots) === before &&
    shaseng.playerData.silver === silver && shaseng.playerData.level === level && !shaseng.companions.length &&
    shaseng.storyPhase === 'huangfeng_cleared' && !shaseng.playerData.storyRewards.shaseng_join,
    '背包只有堆叠空位却无装备格时，整批失败且不入队、不推进、不发钱经验');
  shaseng.triggerShasengBattle();
  assert(shaseng.battleCount === 1 && shaseng.isNpcVisibleInStoryPhase('npc_shawujing',shaseng.storyPhase,'liushahe'),
    '战胜后沙僧仍可交谈，不能再次开战');
  const resumed = makeFixture(shaseng.storyPhase,'liushahe',JSON.parse(JSON.stringify(shaseng.inventory.slots)));
  resumed.playerData = new window.Player(JSON.parse(JSON.stringify(shaseng.playerData)));
  resumed.playerData.storyEvents = {...shaseng.playerData.storyEvents};
  resumed.inventory.slots.splice(0,4);
  assert(resumed.joinShasengToParty() && resumed.storyPhase === 'liusha_cleared' &&
    resumed.inventory.getItemCount('liusha_speed_boots') === 1 && resumed.companions.length === 1,
    '读档后腾出格子可一次领取整批奖励并让沙僧入队');
  const claimed = JSON.stringify({player:resumed.playerData,slots:resumed.inventory.slots,companions:resumed.companions});
  assert(!resumed.joinShasengToParty() && JSON.stringify({player:resumed.playerData,slots:resumed.inventory.slots,companions:resumed.companions}) === claimed,
    '沙僧奖励和同伴重复点击均不重复');
  const shasengInterrupted = makeFixture('huangfeng_cleared','liushahe');
  shasengInterrupted.playerData.storyEvents.shaseng_battle_won = true;
  shasengInterrupted.playerData.storyRewards.shaseng_join = true;
  assert(shasengInterrupted.joinShasengToParty() && shasengInterrupted.storyPhase === 'liusha_cleared' &&
    shasengInterrupted.companions.length === 1 && !shasengInterrupted.inventory.slots.length,
    '沙僧奖励已记账但阶段未提交时，读档仍可补入队且不重发物品');

  const baigu = makeFixture('baihu_second_cleared','baihuling',fill('xuelian_dan'));
  baigu.inventory.maxSlots = 36;
  baigu.inventory.addItem('jin_liu_lu', 50);
  const baiguBefore = JSON.stringify(baigu.inventory.slots), baiguSilver = baigu.playerData.silver;
  baigu.triggerBaigujingBattle();
  assert(baigu.battleCount === 1 && baigu.storyPhase === 'baihu_second_cleared' &&
    baigu.playerData.storyEvents.baigu_final_won && !baigu.playerData.storyRewards.baigu_final &&
    JSON.stringify(baigu.inventory.slots) === baiguBefore && baigu.playerData.silver === baiguSilver,
    '白骨终战满包时保留胜利事件，章节与物品银两均不提前结算');
  assert(!baigu.isNpcVisibleInStoryPhase('npc_baigujing',baigu.storyPhase,'baihuling') &&
    baigu.isNpcVisibleInStoryPhase('npc_baihu_wukong',baigu.storyPhase,'baihuling') &&
    baigu.getOrdealAndQuestInfo().stepTarget.includes('悟空'),
    '真身败后妖王退场，悟空与任务簿提供真实领奖入口');
  baigu.triggerBaigujingBattle();
  assert(baigu.battleCount === 1, '白骨终战胜利后不能再次开战');
  const oldApp = window.App2D;
  try {
    window.App2D = baigu;
    const target = baigu.minimap.getCurrentQuestTarget('baihuling',baigu.storyPhase,window.GAME_DATA.MAPS_2D.baihuling);
    assert(target.npcId === 'npc_baihu_wukong', '白骨岭小地图指向待领奖的悟空');
  } finally { window.App2D = oldApp; }
  const baiguResumed = makeFixture(baigu.storyPhase,'baihuling',JSON.parse(JSON.stringify(baigu.inventory.slots)));
  baiguResumed.playerData = new window.Player(JSON.parse(JSON.stringify(baigu.playerData)));
  baiguResumed.playerData.storyEvents = {...baigu.playerData.storyEvents};
  baiguResumed.inventory.slots.shift();
  assert(baiguResumed.claimBaiguFinalReward() && baiguResumed.storyPhase === 'baihu_cleared' &&
    baiguResumed.inventory.getItemCount('eq_ring_baigu') === 1 &&
    baiguResumed.inventory.getItemCount('jin_liu_lu') === 52 &&
    baiguResumed.lastDialogue === 'baigujing_final_aftermath',
    '读档腾格后领到白骨戒、金柳露并继续结局对白');
  const baiguClaimed = JSON.stringify({player:baiguResumed.playerData,slots:baiguResumed.inventory.slots});
  assert(!baiguResumed.claimBaiguFinalReward() &&
    JSON.stringify({player:baiguResumed.playerData,slots:baiguResumed.inventory.slots}) === baiguClaimed,
    '白骨奖励重复点击不会重复领取');
  const baiguInterrupted = makeFixture('baihu_second_cleared','baihuling');
  baiguInterrupted.playerData.storyEvents.baigu_final_won = true;
  baiguInterrupted.playerData.storyRewards.baigu_final = true;
  assert(baiguInterrupted.claimBaiguFinalReward() && baiguInterrupted.storyPhase === 'baihu_cleared' &&
    !baiguInterrupted.inventory.slots.length, '白骨奖励已记账但阶段未提交时可继续主线而不重发');

  const huangpao = makeFixture('baoxiang_boss_ready','baoxiangguo',fill('xuelian_dan'));
  huangpao.inventory.maxSlots = 36;
  huangpao.inventory.addItem('book_high_critical', 50);
  const huangpaoBefore = JSON.stringify(huangpao.inventory.slots), huangpaoSilver = huangpao.playerData.silver;
  huangpao.triggerHuangpaoBattle();
  assert(huangpao.battleCount === 1 && huangpao.playerData.storyEvents.huangpao_battle_won &&
    !huangpao.playerData.storyRewards.huangpao_final && huangpao.storyPhase === 'baoxiang_boss_ready' &&
    JSON.stringify(huangpao.inventory.slots) === huangpaoBefore && huangpao.playerData.silver === huangpaoSilver,
    '黄袍怪战后装备格满时整批待领，钱与经验不提前入账');
  huangpao.triggerHuangpaoBattle();
  assert(huangpao.battleCount === 1 && !huangpao.isNpcVisibleInStoryPhase('npc_huangpao_boss',huangpao.storyPhase,'baoxiangguo') &&
    huangpao.isNpcVisibleInStoryPhase('npc_baoxiang_king',huangpao.storyPhase,'baoxiangguo') &&
    huangpao.getOrdealAndQuestInfo().stepTarget.includes('国王'),
    '奎木狼胜后不重打、不重刷，国王与任务簿提供待领入口');
  try {
    window.App2D = huangpao;
    const target = huangpao.minimap.getCurrentQuestTarget('baoxiangguo',huangpao.storyPhase,window.GAME_DATA.MAPS_2D.baoxiangguo);
    assert(target.npcId === 'npc_baoxiang_king', '宝象国小地图改指待领奖国王');
  } finally { window.App2D = oldApp; }
  const huangpaoResumed = makeFixture(huangpao.storyPhase,'baoxiangguo',JSON.parse(JSON.stringify(huangpao.inventory.slots)));
  huangpaoResumed.playerData = new window.Player(JSON.parse(JSON.stringify(huangpao.playerData)));
  huangpaoResumed.inventory.slots.shift();
  assert(huangpaoResumed.claimHuangpaoReward() && huangpaoResumed.storyPhase === 'baoxiang_cleared' &&
    huangpaoResumed.inventory.getItemCount('eq_wp_lengyue') === 1 &&
    huangpaoResumed.inventory.getItemCount('book_high_critical') === 51 &&
    huangpaoResumed.lastDialogue === 'huangpao_aftermath',
    '读档腾格后宝刀和兽诀整批领取，结局对白继续');
  const huangpaoClaimed = JSON.stringify({player:huangpaoResumed.playerData,slots:huangpaoResumed.inventory.slots});
  assert(!huangpaoResumed.claimHuangpaoReward() &&
    JSON.stringify({player:huangpaoResumed.playerData,slots:huangpaoResumed.inventory.slots}) === huangpaoClaimed,
    '宝象国赏赐重复交谈不会重发');
  const huangpaoInterrupted = makeFixture('baoxiang_boss_ready','baoxiangguo');
  huangpaoInterrupted.playerData.storyEvents.huangpao_battle_won = true;
  huangpaoInterrupted.playerData.storyRewards.huangpao_final = true;
  assert(huangpaoInterrupted.claimHuangpaoReward() && huangpaoInterrupted.storyPhase === 'baoxiang_cleared' &&
    !huangpaoInterrupted.inventory.slots.length, '宝象国赏赐已记账但阶段未提交时可继续主线而不重发');

  const beginner = makeFixture('liujiacun_start','liujiacun',fill('xuelian_dan'));
  beginner.inventory.maxSlots = 35;
  assert(!beginner.grantStarterItems() && !beginner.playerData.storyRewards.liuboqin_starter &&
    beginner.storyPhase === 'liujiacun_start', '刘伯钦赠礼满包不标领取，主线可再次交谈');
  beginner.inventory.slots.length = 0;
  assert(beginner.grantStarterItems() && beginner.inventory.getItemCount('eq_wp_wood') === 1 &&
    beginner.inventory.getItemCount('eq_bt_straw') === 1 && beginner.grantStarterItems() &&
    beginner.inventory.getItemCount('eq_wp_wood') === 1,
    '腾出空位后一次领取刘伯钦整批资助，重进对白可续任务但不重发');
  const guanyin = makeFixture('chentang_guanyin_revelation','chentangguan',fill('xuelian_dan'));
  guanyin.inventory.maxSlots = 35;
  assert(!guanyin.grantGuanyinGift() && guanyin.storyPhase === 'chentang_guanyin_revelation' &&
    !guanyin.playerData.storyRewards.guanyin_gift, '观音赠礼满包不跳到五行山');
  guanyin.inventory.slots.length = 0;
  assert(guanyin.grantGuanyinGift() && guanyin.storyPhase === 'wuxingshan_ready' &&
    guanyin.inventory.getItemCount('eq_nk_dinghun') === 1 && !guanyin.grantGuanyinGift(),
    '观音赠礼腾格后整批发放且不可重领');

  const longgong = makeFixture('longgong_visit','longgong_palace',fill('xuelian_dan'));
  longgong.inventory.maxSlots = 36;
  longgong.loadMap = (mapId,_spawn,options) => {longgong.currentMapId=mapId;options?.onComplete?.();return true;};
  const longgongBefore = JSON.stringify(longgong.inventory.slots);
  assert(!longgong.grantLonggongArmorSet() && longgong.storyPhase === 'longgong_visit' &&
    JSON.stringify(longgong.inventory.slots) === longgongBefore && !longgong.playerData.storyRewards.longgong_armor,
    '龙王整套战装满包不发、不自动换装、不跳观音段');
  longgong.inventory.slots.length = 0;
  assert(longgong.grantLonggongArmorSet() && longgong.storyPhase === 'chentang_guanyin_revelation' &&
    longgong.playerData.equipment.weapon?.itemId === 'longgong_weapon' &&
    longgong.playerData.equipment.armor?.itemId === 'longgong_armor' &&
    longgong.inventory.getItemCount('longgong_weapon') === 0 &&
    longgong.lastDialogue === 'chentang_guanyin_revelation',
    '腾格后龙王战装整批领取并真实穿戴，不在背包复制一份');

  const shop = makeFixture('longgong_visit','longgong_palace',fill('xuelian_dan'));
  shop.inventory.maxSlots = 35;
  shop.openDragonShopModal = () => {};
  const shopSilver = shop.playerData.silver;
  assert(!shop.buyDragonShopItem('eq_wp_lengyue',100) && !shop.buyMedicine('jinchuang_yao',100) &&
    shop.playerData.silver === shopSilver && !shop.inventory.getItemCount('eq_wp_lengyue'),
    '商店满包时龙宫珍宝和药铺均不扣银两');
  shop.inventory.slots.length = 0;
  assert(shop.buyDragonShopItem('eq_wp_lengyue',100) && shop.buyMedicine('jinchuang_yao',100) &&
    shop.playerData.silver === shopSilver-200, '腾格后商店才同时入包并扣准确银两');

  const escort = makeFixture('changan_arrived','changan_city',fill('xuelian_dan'));
  escort.playerData.silver = 5000;
  escort.inventory.maxSlots = 35;
  const escortSilver = escort.playerData.silver;
  assert(!escort.acceptEscortQuest() && escort.playerData.silver === escortSilver && !escort.escortQuest,
    '接镖时背包满不收押金，也不产生没有凭信的任务');
  escort.inventory.slots.length = 0;
  assert(escort.acceptEscortQuest() && escort.playerData.silver === escortSilver-1000 &&
    escort.inventory.getItemCount('biao_letter') === 1 &&
    escort.escortQuest.targetNpc === 'npc_lijing_zongbing',
    '序章较早阶段只分配已可到达的陈塘关收镖人');
  escort.inventory.addItem('biao_letter',1);
  escort.inventory.slots.push(...fill('xuelian_dan').slice(0,34));
  escort.inventory.maxSlots = 35;
  const escortPacked = JSON.stringify(escort.inventory.slots), escrow = escort.playerData.silver;
  assert(!escort.submitEscortQuest(escort.escortQuest.targetNpc) &&
    JSON.stringify(escort.inventory.slots) === escortPacked && escort.playerData.silver === escrow &&
    escort.escortQuest.active && escort.escortQuest.rewardedBookId,
    '满包交镖不扣凭信、不提前退押金，随机兽诀种类保持固定');
  const chosenBook = escort.escortQuest.rewardedBookId;
  escort.inventory.slots.pop();
  assert(escort.submitEscortQuest(escort.escortQuest.targetNpc) && !escort.escortQuest &&
    escort.inventory.getItemCount(chosenBook) === 1 && escort.playerData.silver >= escrow+4500,
    '腾格后凭信与兽诀一次交换，并结清押金赏银');

  const gather = makeFixture('liujiacun_find_mushrooms','liujiacun',fill('xuelian_dan'));
  gather.inventory.maxSlots = 35;
  gather.npcs = [{id:'prop_mushroom_test',x:32,y:32}];
  gather.playerChar = {x:32,y:32};
  gather.questKills = {mushrooms:0,trees:0,rats:0};
  gather.collectedProps = new Set();
  assert(!gather.collectMushroom() && gather.questKills.mushrooms === 0 && gather.npcs.length === 1 &&
    !gather.collectedProps.size, '满包采蘑菇不会增加计数或让地面物品消失');
  gather.inventory.slots.pop();
  assert(gather.collectMushroom() && gather.questKills.mushrooms === 1 && gather.npcs.length === 0,
    '腾格后才采得蘑菇并消除地面实体');

  const loader = makeFixture('heaven_prologue','tiangong_palace');
  loader.playerChar = {x:0,y:0,direction:'down'};
  loader.mountSystem = {mounts:{},isRiding:false};
  loader.loadMap = (mapId,_spawn,options) => {loader.currentMapId=mapId;options?.onComplete?.();return true;};
  const previousLoad = window.SaveManager.loadGameFullState;
  try {
    window.SaveManager.loadGameFullState = () => ({mapId:'liushahe',storyPhase:'huangfeng_cleared',
      pendingStoryDialogue:{key:'shaseng_post_battle',mapId:'liushahe',phase:'huangfeng_cleared'},playerData:{}});
    assert(loader.loadAutoSavedProgress() && loader.playerData.storyEvents.shaseng_battle_won &&
      !loader.playerData.storyRewards.shaseng_join, '旧档沙僧战后对白断点恢复领奖资格，不凭空补物品');
    loader.playerData = new window.Player();
    window.SaveManager.loadGameFullState = () => ({mapId:'baihuling',storyPhase:'baihu_second_cleared',playerData:{}});
    assert(loader.loadAutoSavedProgress() && !loader.playerData.storyEvents.baigu_final_won &&
      !loader.playerData.storyRewards.baigu_final, '旧档白骨第二重阶段不会被误判为已胜终战');
    loader.playerData = new window.Player();
    window.SaveManager.loadGameFullState = () => ({mapId:'baoxiangguo',storyPhase:'baoxiang_cleared',playerData:{}});
    assert(loader.loadAutoSavedProgress() && loader.playerData.storyRewards.shaseng_join &&
      loader.playerData.storyRewards.baigu_final && loader.playerData.storyRewards.huangpao_final &&
      loader.playerData.storyRewards.guanyin_gift && loader.playerData.storyRewards.liuboqin_starter &&
      loader.playerData.storyRewards.taizong_gift,
      '明确越过章节的旧档补领取键，回访不重复发奖');
  } finally {window.SaveManager.loadGameFullState=previousLoad;}

  // 1. 东海深海试炼三件战利待领
  const trial = makeFixture('wuxingshan_ready', 'longgong_palace', fill('xuelian_dan'));
  trial.inventory.maxSlots = 36;
  const trialBefore = JSON.stringify(trial.inventory.slots), trialSilver = trial.playerData.silver;
  trial.triggerDonghaiTrialBattle();
  assert(trial.battleCount === 1 && trial.playerData.storyEvents.donghai_trial_won &&
    !trial.playerData.storyRewards.donghai_trial && JSON.stringify(trial.inventory.slots) === trialBefore &&
    trial.playerData.silver === trialSilver, '深海试炼满包时保留胜利事件，三件神兵与银两经验均不提前结算');
  trial.triggerDonghaiTrialBattle();
  assert(trial.battleCount === 1, '覆海蛟龙王战胜后不能再次开战');
  const aoguangNpc = { id: 'npc_aoguang' };
  trial.triggerNpcDialogue(aoguangNpc);
  assert(aoguangNpc.dialogueKey === 'aoguang_trial_reward_ready', '深海试炼获胜后敖广对话分发至【aoguang_trial_reward_ready】');
  if (window.Dialogue) window.Dialogue.close();
  trial.inventory.slots.splice(0, 3);
  assert(trial.claimDonghaiTrialReward() && trial.playerData.storyRewards.donghai_trial &&
    trial.inventory.getItemCount('dinghai_shenzhen') === 1 &&
    trial.inventory.getItemCount('gold_gourd') === 1 &&
    trial.inventory.getItemCount('bishui_zhu') === 1 &&
    trial.playerData.silver === trialSilver + 6000,
    '腾出3格后一次性领取神珍铁、紫金红葫芦与避水珠，并结清赏银经验');
  assert(!trial.claimDonghaiTrialReward(), '深海试炼重宝领取后绝不重复发放');
  trial.triggerNpcDialogue(aoguangNpc);
  assert(aoguangNpc.dialogueKey === 'aoguang_trial_cleared', '试炼领取后敖广对话切换至安澜致谢【aoguang_trial_cleared】');
  if (window.Dialogue) window.Dialogue.close();

  // 2. 太宗御赐文牒与神丹
  const taizong = makeFixture('changan_meet_taizong', 'changan_city', fill('xuelian_dan'));
  taizong.inventory.maxSlots = 35;
  const taizongSilver = taizong.playerData.silver;
  assert(!taizong.grantTaizongGift() && taizong.storyPhase === 'changan_meet_taizong' &&
    !taizong.playerData.storyRewards.taizong_gift && taizong.playerData.silver === taizongSilver,
    '太宗赐宝满包时不推进阶段、不提前发放文牒与神丹');
  taizong.inventory.slots.splice(0, 2);
  assert(taizong.grantTaizongGift() && taizong.storyPhase === 'changan_farewell' &&
    taizong.playerData.storyRewards.taizong_gift &&
    taizong.inventory.getItemCount('feixing_fu') === 5 &&
    taizong.inventory.getItemCount('jiuzhuan_dan') === 3 &&
    taizong.playerData.silver === taizongSilver + 500,
    '腾出空格后太宗御赐整批入包并推进至送行阶段');
  assert(!taizong.grantTaizongGift(), '太宗赐宝领取后不可重复领取');

  // 3. 钟馗伏魔抓鬼满包保护
  const ghostApp = makeFixture('changan_city', 'changan_city', fill('xuelian_dan'));
  ghostApp.inventory.maxSlots = 35;
  ghostApp.ghostQuest = { active: true, completed: true, targetName: '恶鬼', mapName: '刘家村' };
  const ghostSilver = ghostApp.playerData.silver;
  assert(!ghostApp.submitZhongkuiGhostQuest() && ghostApp.ghostQuest.active && ghostApp.ghostQuest.completed &&
    ghostApp.playerData.silver === ghostSilver, '抓鬼除魔满包时拒绝领赏，保留完成状态且不吞金柳露');
  ghostApp.inventory.slots.pop();
  assert(ghostApp.submitZhongkuiGhostQuest() && !ghostApp.ghostQuest.active &&
    ghostApp.inventory.getItemCount('jin_liu_lu') === 1 && ghostApp.playerData.silver === ghostSilver + 2000,
    '腾格后抓鬼圆满交差，金柳露入包并结清赏银');

  // 4. 蟠桃采摘满包保护
  const peachApp = makeFixture('tiangong_palace', 'tiangong_pantao', fill('xuelian_dan'));
  peachApp.inventory.maxSlots = 35;
  const peachSys2 = new window.PeachGarden({ usedChancesToday: 0 });
  const peachResFail = peachSys2.eatPeach('tier_9000', peachApp.playerData, peachApp.inventory);
  assert(!peachResFail.success && peachSys2.usedChancesToday === 0, '蟠桃掉宝满包时拒绝采摘且不消耗今日采摘次数');
  peachApp.inventory.slots.pop();
  const peachResOk = peachSys2.eatPeach('tier_9000', peachApp.playerData, peachApp.inventory);
  assert(peachResOk.success && peachSys2.usedChancesToday === 1, '腾格后蟠桃采摘成功并消耗次数');

  // 5. 宝石拆卸满包保护
  const gemApp = makeFixture('changan_city', 'changan_city', fill('xuelian_dan'));
  gemApp.inventory.maxSlots = 35;
  gemApp.playerData.equipment = { weapon: { itemId: 'eq_wp_wood', sockets: ['gem_jingang'] } };
  assert(!gemApp.unsocketEquippedGem('weapon', 0) && gemApp.playerData.equipment.weapon.sockets[0] === 'gem_jingang',
    '满包拆卸宝石时安全拦截，孔位中宝石完好保留');
  gemApp.inventory.slots.pop();
  assert(gemApp.unsocketEquippedGem('weapon', 0) && gemApp.playerData.equipment.weapon.sockets[0] === null &&
    gemApp.inventory.getItemCount('gem_jingang') === 1, '腾格后宝石拆卸成功并安全进入背包');

  // 6. 存档容错防御
  const storage = (typeof localStorage !== 'undefined') ? localStorage : window.localStorage;
  if (storage) {
    const oldStorageGet = storage.getItem.bind(storage);
    try {
      storage.getItem = () => '{malformed json';
      assert(window.SaveManager.loadGame(1) === null && window.SaveManager.loadGameFullState() === null,
        '底层存储数据损坏时读档安全回退为 null');
      storage.getItem = () => JSON.stringify({ version: '1.0', data: 'not_an_object' });
      assert(window.SaveManager.loadGameFullState() === null, '非对象存档结构安全过滤回退 null');
    } finally { storage.getItem = oldStorageGet; }
  }
};
