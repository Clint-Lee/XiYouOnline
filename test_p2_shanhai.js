/**
 * test_p2_shanhai.js
 * 
 * 专门针对交接任务 P2 山海经寻访与实例保护的端到端自动化测试回归：
 * P2.1: 77种物种真实来源字典 (50 凡兽 / 12 散仙 / 15 金仙划分四类来源与可达性)
 * P2.2: 轻量筛选 (全部 / 未献录 / 可献录 / 名称搜索) 与一条寻访目标 (方向指引、不覆盖主线、任务簿联动)
 * P2.3: 仙宠实例加锁保护 (isProtected 按 instanceId、献录拦截、放生拦截、多实例仅消耗所选一只、读写存档持久化)
 */

module.exports = async function runP2ShanhaiTests(assert) {
  console.log('\n▶️ [P2 山海经寻访与实例保护测试] 真实物种来源、轻量筛选搜索、独立寻访目标与实例加锁保护');

  const app = window.App2D;
  const gameData = window.GAME_DATA;

  // =========================================================================
  // P2.1: 77种物种真实来源与可达性字典核验
  // =========================================================================
  assert(gameData.SHANHAI_SPECIES_SOURCES, 'P2.1: window.GAME_DATA.SHANHAI_SPECIES_SOURCES 真实来源字典存在');
  assert(typeof gameData.getShanhaiSpeciesSource === 'function', 'P2.1: getShanhaiSpeciesSource 来源查询函数挂载成功');

  const allPets = Object.values(gameData.PETS || {});
  const ordinaryPets = allPets.filter(p => p.quality === 'ordinary');
  const sanxianPets = allPets.filter(p => p.quality === 'sanxian');
  const jinxianPets = allPets.filter(p => p.quality === 'jinxian');

  assert(ordinaryPets.length === 50, 'P2.1: 凡兽物种数量精确为 50 种');
  assert(sanxianPets.length === 12, 'P2.1: 散仙物种数量精确为 12 种');
  assert(jinxianPets.length === 15, 'P2.1: 金仙物种数量精确为 15 种');
  assert(allPets.length === 77, 'P2.1: 山海经全卷生灵总数严格为 77 种');

  const validCategories = new Set(['common_wild', 'encounter', 'gift_only', 'unreachable']);

  // 核验 77 种物种每一只均有详尽的真实来源定义
  let categoryCounts = { common_wild: 0, encounter: 0, gift_only: 0, unreachable: 0 };
  for (const pet of allPets) {
    const src = gameData.getShanhaiSpeciesSource(pet.id);
    assert(!!src, `P2.1: 物种【${pet.name}】(${pet.id}) 拥有明确的来源档案`);
    assert(validCategories.has(src.category), `P2.1: 物种【${pet.name}】来源分类【${src.category}】属于四大合法分类之一`);
    assert(typeof src.categoryName === 'string' && src.categoryName.length > 0, `P2.1: 物种【${pet.name}】拥有分类中文名【${src.categoryName}】`);
    assert(typeof src.conditionDesc === 'string' && src.conditionDesc.length > 0, `P2.1: 物种【${pet.name}】拥有偶遇条件说明【${src.conditionDesc}】`);
    assert(typeof src.accessible === 'boolean', `P2.1: 物种【${pet.name}】拥有明确的主线可达性标记`);
    categoryCounts[src.category]++;

    // 模板上也成功挂载了 .sourceInfo
    assert(!!pet.sourceInfo, `P2.1: PETS 模板【${pet.id}】上已附带 sourceInfo 镜像`);
  }

  assert(categoryCounts.common_wild > 0, `P2.1: 包含【地图常见】物种 (${categoryCounts.common_wild} 种)`);
  assert(categoryCounts.encounter > 0, `P2.1: 包含【概率偶遇】物种 (${categoryCounts.encounter} 种)`);
  assert(categoryCounts.gift_only > 0, `P2.1: 包含【赠礼专属】物种 (${categoryCounts.gift_only} 种)`);
  assert(categoryCounts.unreachable > 0, `P2.1: 包含【尚未开放】物种 (${categoryCounts.unreachable} 种)`);

  // =========================================================================
  // P2.2: 轻量筛选、名称搜索与独立寻访目标
  // =========================================================================
  const testApp = Object.assign(Object.create(Object.getPrototypeOf(app)), app, {
    pets: [],
    shanhai: new window.ShanhaiSystem(),
    _currentRosterTab: 'ordinary',
    _shanhaiFilter: 'all',
    _shanhaiSearchKeyword: '',
    shanhaiPursuitTarget: null
  });

  // 1. 全部筛选
  testApp.setShanhaiFilter('all');
  assert(testApp._shanhaiFilter === 'all', 'P2.2: 成功切换筛选为【全部】');

  // 2. 模拟收录与未献录筛选
  testApp.shanhai.entries['wolf_wild'] = { time: Date.now() };
  testApp.shanhai.entries['wild_boar'] = { time: Date.now() };
  testApp.setShanhaiFilter('uncollected');
  assert(testApp._shanhaiFilter === 'uncollected', 'P2.2: 成功切换筛选为【未献录】');

  // 3. 可献录筛选：需玩家当前持有且尚未收录
  const collectibleWolf = window.PetSystem.createPet('shuo_shu', true, 5, false); // 硕鼠
  testApp.pets = [collectibleWolf];
  testApp.setShanhaiFilter('collectible');
  assert(testApp._shanhaiFilter === 'collectible', 'P2.2: 成功切换筛选为【可献录】');

  // 4. 名称搜索
  testApp.setShanhaiSearch('青牛');
  assert(testApp._shanhaiSearchKeyword === '青牛', 'P2.2: 成功设定搜索关键字【青牛】');
  testApp.setShanhaiSearch('');
  assert(testApp._shanhaiSearchKeyword === '', 'P2.2: 成功清空搜索关键字');

  // 5. 寻访目标设定与取消
  const mainQuestLeadBefore = window.GAME_DATA.getUnifiedStoryLead(testApp.storyPhase, testApp.currentMapId, testApp.storyProgress);
  testApp.setShanhaiPursuitTarget('wolf_wild');
  assert(testApp.shanhaiPursuitTarget === 'wolf_wild', 'P2.2: 成功将【wolf_wild】设为山海经寻访目标');

  // 寻访目标不覆盖唯一主线目标
  const mainQuestLeadAfter = window.GAME_DATA.getUnifiedStoryLead(testApp.storyPhase, testApp.currentMapId, testApp.storyProgress);
  assert(mainQuestLeadAfter.stepName === mainQuestLeadBefore.stepName, 'P2.2: 设定山海寻访目标后主线任务指引严格保持独立');
  assert(mainQuestLeadAfter.stepTarget === mainQuestLeadBefore.stepTarget, 'P2.2: 设定山海寻访目标后主线导航信标完全不受影响');

  // 任务簿独立卡片联动展示
  const trackerCardHtml = testApp._renderQuestTrackerShanhaiCard();
  assert(trackerCardHtml.includes('山海寻访:'), 'P2.2: 任务簿卡片正确展示山海寻访板块');
  assert(trackerCardHtml.includes('野狼'), 'P2.2: 任务簿卡片准确包含寻访目标名称【野狼】');
  assert(trackerCardHtml.includes('招降要诀：'), 'P2.2: 任务簿卡片展示招降要诀说明');

  // 再次调用 setShanhaiPursuitTarget('wolf_wild') 切换取消
  testApp.setShanhaiPursuitTarget('wolf_wild');
  assert(testApp.shanhaiPursuitTarget === null, 'P2.2: 再次点击同一物种成功取消寻访目标');
  assert(testApp._renderQuestTrackerShanhaiCard() === '', 'P2.2: 取消寻访后任务簿寻访卡片安全清空隐藏');

  // 6. 存档与读档持久化寻访目标
  testApp.setShanhaiPursuitTarget('shuo_shu');
  const savedState = testApp.saveAutoProgress();
  assert(savedState.success === true, 'P2.2: 带有寻访目标的进度自动存档成功');

  const loadedState = window.SaveManager.loadGameFullState();
  assert(loadedState && loadedState.shanhaiPursuitTarget === 'shuo_shu', 'P2.2: 存档完整记录 shanhaiPursuitTarget');

  // =========================================================================
  // P2.3: 仙宠实例加锁保护与献录/放生拦截
  // =========================================================================
  const wolf1 = window.PetSystem.createPet('wolf_wild', true, 10, false);
  const wolf2 = window.PetSystem.createPet('wolf_wild', true, 12, false);
  testApp.pets = [wolf1, wolf2];
  delete testApp.shanhai.entries['wolf_wild']; // 重置收录状态

  // 初始均为未加锁
  assert(wolf1.isProtected === false || wolf1.isProtected === undefined, 'P2.3: 仙宠实例创建时默认未加锁');
  assert(wolf2.isProtected === false || wolf2.isProtected === undefined, 'P2.3: 另一仙宠实例创建时默认未加锁');

  // 加锁 Wolf1
  const lockResult = window.PetSystem.toggleProtection(wolf1);
  assert(lockResult === true && wolf1.isProtected === true, 'P2.3: 成功对第一只野狼执行加锁保护');
  assert(!wolf2.isProtected, 'P2.3: 加锁严格按 instanceId 生效，未保护同种第二只野狼');

  // 尝试放生受保护的 Wolf1
  const releaseProtectedResult = window.PetSystem.releasePet(testApp, wolf1.instanceId);
  assert(releaseProtectedResult.success === false, 'P2.3: 放生受保护仙宠被安全拦截');
  assert(releaseProtectedResult.msg.includes('处于加锁保护状态'), 'P2.3: 拦截提示明确告知处于加锁保护');
  assert(testApp.pets.some(p => p.instanceId === wolf1.instanceId), 'P2.3: 被拦截后受保护仙宠完好留在队伍中');

  // 尝试献录受保护的 Wolf1
  const collectProtectedResult = testApp.shanhai.collect(testApp, wolf1.instanceId);
  assert(collectProtectedResult.success === false, 'P2.3: 献录受保护仙宠被核心入口安全拦截');
  assert(collectProtectedResult.msg.includes('处于加锁保护状态'), 'P2.3: 献录拦截提示明确告知需先解除保护');
  assert(!testApp.shanhai.entries['wolf_wild'], 'P2.3: 拦截后山海经未提前收录该物种');

  // 献录未加锁的同种 Wolf2
  const collectUnprotectedResult = testApp.shanhai.collect(testApp, wolf2.instanceId);
  assert(collectUnprotectedResult.success === true, 'P2.3: 未加锁的第二只同种野狼成功奉纳献录');
  assert(testApp.shanhai.entries['wolf_wild'] !== undefined, 'P2.3: 奉纳献录后山海经成功收录【wolf_wild】');
  assert(!testApp.pets.some(p => p.instanceId === wolf2.instanceId), 'P2.3: 被献录的这一只野狼从队伍中移出');

  // 验证 Wolf1 完好保留且依然加锁
  assert(testApp.pets.length === 1 && testApp.pets[0].instanceId === wolf1.instanceId, 'P2.3: 队伍中同种受保护的 Wolf1 完好保留');
  assert(testApp.pets[0].isProtected === true, 'P2.3: 保留的 Wolf1 加锁保护状态依然维持有效');

  // 解锁 Wolf1 并成功放生
  const unlockResult = window.PetSystem.toggleProtection(wolf1);
  assert(unlockResult === false && wolf1.isProtected === false, 'P2.3: 成功对 Wolf1 解除加锁保护');
  const releaseSuccessResult = window.PetSystem.releasePet(testApp, wolf1.instanceId);
  assert(releaseSuccessResult.success === true, 'P2.3: 解锁后 Wolf1 成功放归天地山林');
  assert(testApp.pets.length === 0, 'P2.3: 放生后队伍中已无该仙宠');

  // 持久化保护状态跨存档读写验证
  const petToSave = window.PetSystem.createPet('shuo_shu', true, 20, false);
  window.PetSystem.toggleProtection(petToSave);
  testApp.pets = [petToSave];
  testApp.saveAutoProgress();

  const restored = window.SaveManager.loadGameFullState();
  assert(restored && restored.pets && restored.pets.length === 1, 'P2.3: 存档成功保存宠物列表');
  assert(restored.pets[0].isProtected === true, 'P2.3: 读档后仙宠的 isProtected 加锁标记完整还原');

  testApp.pets = [];
  testApp.loadAutoSavedProgress();
  assert(testApp.pets.length === 1 && testApp.pets[0].isProtected === true, 'P2.3: loadAutoSavedProgress 还原后仙宠受保护状态为 true');
};
