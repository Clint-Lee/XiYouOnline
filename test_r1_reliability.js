/**
 * R1 稳定性与实际生效回归测试：
 * R1.1 读档保留真实气血与法力
 * R1.2 存储不可用与坏档保护防覆盖
 * R1.3 飞行符真实传送与安全扣除
 * R1.4 强化窗口接入定星石防降星
 */

module.exports = async function runR1Tests(assert) {
  console.log('\n▶️ [R1 存档与道具生效测试] 真实气血、坏档保护、神符传送与强化定星');

  // =========================================================================
  // R1.1: 读档保留真实气血与法力
  // =========================================================================
  {
    const player = new window.Player('威灵大将', 'jingang');
    player.level = 10;
    player.recalculateStats(true);
    const fullHp = player.maxHp;
    const fullMp = player.maxMp;

    // 受伤扣蓝测试
    player.hp = Math.floor(fullHp * 0.35);
    player.mp = Math.floor(fullMp * 0.2);
    const damagedHp = player.hp;
    const damagedMp = player.mp;

    // 默认 recalculateStats(false) 重算派生属性，必须保留残血残蓝
    player.recalculateStats(false);
    assert(player.hp === damagedHp && player.mp === damagedMp, 'R1.1: recalculateStats(false) 派生属性重算时保留残血与残蓝');

    // 合法0点生命值（战败/虚弱）不能被误当作缺失而回满
    player.hp = 0;
    player.recalculateStats(false);
    assert(player.hp === 0, 'R1.1: 生命值为 0 时 recalculateStats(false) 保持 0，不被 fallback 误回满');

    // 上限缩小时（如卸下加气血装备），生命值被正确钳制在 [0, maxHp]
    player.hp = player.maxHp + 200;
    player.recalculateStats(false);
    assert(player.hp === player.maxHp, 'R1.1: 生命值超过新上限时自动钳制为新 maxHp');

    // 主动恢复接口 recalculateStats(true) 依然正常恢复满血满蓝
    player.recalculateStats(true);
    assert(player.hp === fullHp && player.mp === fullMp, 'R1.1: recalculateStats(true) 主动治疗/升级时正常恢复满状态');

    // App2D 读档集成验证：存档中记录的残血残蓝加载后如实保留
    const app = Object.create(window.App2D);
    app.playerData = new window.Player('测试行者', 'jingang');
    app.inventory = new window.Inventory(40);
    app.activeCombatPets = [];
    app.activePets = [];
    app.storedPets = [];
    app.updatePlayerHud = () => {};
    app.saveAutoProgress = () => ({ success: true });

    const fakeState = {
      mapId: 'changan_city',
      storyPhase: 'changan_arrived',
      playerData: {
        name: '测试行者',
        classId: 'jingang',
        level: 15,
        hp: 310,
        mp: 95,
        silver: 8888,
        allocatedStats: { con: 5, str: 10, int: 0, spd: 5 },
        equipment: { weapon: null, armor: null, helmet: null, necklace: null, boots: null, ring: null },
        storyEvents: {},
        storyRewards: {}
      },
      inventorySlots: [],
      activePets: [],
      storedPets: []
    };

    localStorage.setItem('hanfeng_xy_save_auto_progress', JSON.stringify({
      version: '2.0.0',
      timestamp: Date.now(),
      data: fakeState
    }));

    const loaded = app.loadAutoSavedProgress();
    assert(loaded === true, 'R1.1: loadAutoSavedProgress 成功加载存档');
    assert(app.playerData.hp === 310 && app.playerData.mp === 95, 'R1.1: 读档后人物生命与法力保持存档中的 310/95，未被覆写为满血满蓝');
  }

  // =========================================================================
  // R1.2: 存储不可用与坏档保护防覆盖
  // =========================================================================
  {
    // 1. 存储环境可用性检查与异常防御
    assert(window.SaveManager.isStorageAvailable() === true, 'R1.2: 正常环境 isStorageAvailable 返回 true');
    const realSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      const err = new Error('QuotaExceeded or SecurityError');
      err.name = 'SecurityError';
      throw err;
    };
    assert(window.SaveManager.isStorageAvailable() === false, 'R1.2: 当 setItem 抛出异常时 isStorageAvailable 安全返回 false');
    localStorage.setItem = realSetItem;

    // 2. 坏档自动灾备备份：格式损坏（非法 JSON）
    localStorage.setItem('hanfeng_xy_save_auto_progress', '<<< corrupted json string >>>');
    const resBroken = window.SaveManager.loadGameFullState();
    assert(resBroken === null, 'R1.2: loadGameFullState 遇到损坏 JSON 返回 null');
    const backup = window.SaveManager.getCorruptedBackup();
    assert(backup && backup.reason === 'json_syntax_error', 'R1.2: 坏档被保留至 corruptedBackup 灾备副本中');

    // 3. 坏档被标记后，自动存档机制阻止静默覆写
    const app = Object.create(window.App2D);
    app.playerData = new window.Player('测试行者', 'jingang');
    app.playerChar = { x: 100, y: 100, direction: 'down', appearance: {} };
    app.isSaveCorrupted = true; // 模拟开机发现坏档标记
    app.updateSaveIndicator = () => {};
    const autoSaveRes = app.saveAutoProgress(false);
    assert(autoSaveRes && autoSaveRes.success === false && autoSaveRes.reason === 'corrupted_protection', 'R1.2: saveAutoProgress 在坏档受保护状态下拒绝自动覆写');

    // 4. 导入外部存档结构安全校验
    const invalidEmpty = window.SaveManager.importSaveJson('auto_progress', '');
    assert(invalidEmpty.success === false, 'R1.2: 空字符串导入被安全拦截');

    const invalidStructure = window.SaveManager.importSaveJson('auto_progress', JSON.stringify({
      version: '2.0.0',
      data: { mapId: 'changan_city' } // 缺少 playerData
    }));
    assert(invalidStructure.success === false && invalidStructure.msg.includes('playerData'), 'R1.2: 缺少 playerData 的无效结构被安全拦截且不破坏存储');

    const validJson = JSON.stringify({
      version: '2.0.0',
      data: {
        mapId: 'changan_city',
        playerData: { name: '正规存档', classId: 'jingang', level: 5 },
        inventorySlots: []
      }
    });
    const validImport = window.SaveManager.importSaveJson('auto_progress', validJson);
    assert(validImport.success === true, 'R1.2: 合法结构的外部存档导入成功');
  }

  // =========================================================================
  // R1.3: 飞行符真正传送与安全扣除
  // =========================================================================
  {
    const app = Object.create(window.App2D);
    app.playerData = new window.Player('威灵大将', 'jingang');
    app.inventory = new window.Inventory(40);
    app.activeCombatPets = [];
    app.updatePlayerHud = () => {};
    app.storyPhase = 'changan_arrived';
    app.currentMapId = 'datang_border';
    app.inventory.addItem('feixing_fu', 3);

    const fuSlot = app.inventory.slots.find(s => s && s.itemId === 'feixing_fu');
    assert(fuSlot && fuSlot.count === 3, 'R1.3: 背包内准备 3 张飞行符');

    // 1. 战斗中禁止使用
    app.currentBattle = { isOver: false };
    app.useConsumableItem(fuSlot.instanceId);
    assert(app.inventory.getItemCount('feixing_fu') === 3, 'R1.3: 战斗中引动飞行符被拦截，且不扣除道具');
    assert(app.currentMapId === 'datang_border', 'R1.3: 战斗中场景未发生变化');
    app.currentBattle = null;

    // 2. 早期未解锁章节禁止使用
    app.storyPhase = 'liujiacun_start';
    app.useConsumableItem(fuSlot.instanceId);
    assert(app.inventory.getItemCount('feixing_fu') === 3, 'R1.3: 序章刘家村阶段神符受禁制，不越过剧情解锁，不扣除道具');
    app.storyPhase = 'changan_arrived';

    // 3. 已在长安城使用提示已在王都，不扣除
    app.currentMapId = 'changan_city';
    app.useConsumableItem(fuSlot.instanceId);
    assert(app.inventory.getItemCount('feixing_fu') === 3, 'R1.3: 已在长安城使用提示已在王都，不扣除道具');

    // 4. 合法场景引动传送：扣除 1 张，切换至 changan_city，坐标落在安全主道 (640, 512)
    app.currentMapId = 'datang_border';
    let mapLoaded = null;
    let spawnCoord = null;
    app.loadMap = (mapId, spawn) => {
      mapLoaded = mapId;
      spawnCoord = spawn;
      app.currentMapId = mapId;
    };
    app.useConsumableItem(fuSlot.instanceId);
    assert(app.inventory.getItemCount('feixing_fu') === 2, 'R1.3: 合法引动后精确扣除 1 张飞行符');
    assert(mapLoaded === 'changan_city', 'R1.3: 场景真正切换至 changan_city');
    assert(spawnCoord && spawnCoord.x === 640 && spawnCoord.y === 512, 'R1.3: 角色安全降落在长安中心大街 (640, 512)');
  }

  // =========================================================================
  // R1.4: 强化窗口接入定星石保护能力
  // =========================================================================
  {
    const player = new window.Player('神兵行者', 'jingang');
    player.silver = 100000;
    const inv = new window.Inventory(40);
    inv.addItem('qianghua_shi', 50);
    inv.addItem('dingxing_shi', 2);

    const weapon = {
      instanceId: 'test_weapon_1',
      itemId: 'eq_wp_wood',
      slotKey: 'weapon',
      star: 0
    };
    player.equipment.weapon = weapon;

    // 1. 低星强化 (penalty === 'none')：即使开启 protect 也不消耗定星石
    const resLow = window.ForgeSystem.enhance(weapon, inv, player, true);
    assert(inv.getItemCount('dingxing_shi') === 2, 'R1.4: 低星安全强化时不消耗定星石');

    // 2. 高星强化失败降星保护 (+6 -> +7)
    weapon.star = 6;
    const info6 = window.ForgeSystem.getEnhanceInfo(6);
    assert(info6.penalty === 'down_1', 'R1.4: +6 强化若失手惩罚为 down_1');

    // 模拟强化失手 (Math.random = () => 0.99 确保失败)
    const savedRandom = Math.random;
    Math.random = () => 0.99;

    // 2.1 无保护石时失手：星级滑落至 +5
    const resFailNoProtect = window.ForgeSystem.enhance(weapon, inv, player, false);
    assert(resFailNoProtect.success === false, 'R1.4: 淬火判定为失败');
    assert(weapon.star === 5, 'R1.4: 未开启保护时失败降为 +5 星');

    // 2.2 恢复到 +6，开启定星石保护强化
    weapon.star = 6;
    const resFailWithProtect = window.ForgeSystem.enhance(weapon, inv, player, true);
    assert(resFailWithProtect.success === false, 'R1.4: 淬火失手');
    assert(weapon.star === 6, 'R1.4: 定星石保护生效，失手后依然维持 +6 星不降！');
    assert(inv.getItemCount('dingxing_shi') === 1, 'R1.4: 成功消耗 1 颗定星石');

    // 2.3 保护石耗尽后若继续要求保护，安全拦截并不消耗材料和银两
    inv.removeItem('dingxing_shi', 1);
    const beforeSilver = player.silver;
    const beforeStones = inv.getItemCount('qianghua_shi');
    const resNoStone = window.ForgeSystem.enhance(weapon, inv, player, true);
    assert(resNoStone.success === false && resNoStone.msg.includes('未发现【定星石】'), 'R1.4: 开启保护但背包无定星石时前置拦截');
    assert(player.silver === beforeSilver && inv.getItemCount('qianghua_shi') === beforeStones, 'R1.4: 拦截后未扣除任何银两与强化石');

    Math.random = savedRandom;
  }
};
