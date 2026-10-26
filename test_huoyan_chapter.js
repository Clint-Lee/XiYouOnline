/**
 * 汉风西游 - 第十六回 火焰山章节回归测试
 * 覆盖：地图重建质量与连通、阶段链与五处表、对白键完整、铁扇公主恨意有据、
 *       假扇线索题、悟空担责节点、牛魔王战斗守卫、奖励幂等与满包、熄火事实持久化。
 */
module.exports = async function (assert) {
  console.log('\n▶️ [测试 61] 第十六回 火焰山 章节闭环');
  const app = window.App2D;

  // ── 1. 地图质量（历史缺陷：7.1% 隧道） ──
  {
    const map = window.GAME_DATA.MAPS_2D.huoyanshan;
    assert(!!map, 'huoyanshan 地图必须存在');
    assert(map.width === 38 && map.height === 28,
      `火焰山应为 38x28，实际 ${map.width}x${map.height}`);

    const SOLID = new Set(['mountain_rock', 'water', 'city_wall', 'stone_wall', 'void', 'abyss',
      'demon_cave_wall', 'cloud_void', 'heaven_pillar', 'bamboo', 'dark_water', 'hut_wall',
      'palace_eaves', 'wooden_barricade', 'blacksmith_forge', 'ginseng_tree', 'purple_bamboo',
      'tang_palace', 'tang_store', 'stone_temple', 'two_realms_stele', 'lava', 'fire_wall']);
    // 注：ash_ground（熄火后的焦土）是可行走地面，不算阻挡
    let walk = 0;
    for (const row of map.tiles) for (const t of row) if (!SOLID.has(t)) walk++;
    const ratio = walk / (map.width * map.height);
    assert(ratio >= 0.35,
      `火焰山可行走比例应 ≥35%（不得退化成隧道），实际 ${(ratio * 100).toFixed(1)}%`);

    const ids = (map.npcs || []).map(n => n.id);
    for (const id of ['npc_huoyan_villager', 'npc_huoyan_land', 'npc_huoyan_princess',
      'npc_huoyan_bull_king', 'npc_huoyan_fan_trial', 'npc_huoyan_fire_root']) {
      assert(ids.includes(id), `火焰山必须配置 ${id}`);
    }

    // 实体落点
    for (const n of (map.npcs || [])) {
      const gx = Math.floor(n.x / 32), gy = Math.floor(n.y / 32);
      const t = map.tiles[gy] && map.tiles[gy][gx];
      assert(!!t && !SOLID.has(t), `火焰山 NPC ${n.id} 不得落在阻挡格`);
    }

    // BFS 连通
    const walkable = (x, y) => {
      if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
      const row = map.tiles[y];
      return !!row && !!row[x] && !SOLID.has(row[x]);
    };
    const sp = map.playerSpawn;
    const sx = Math.floor(sp.x / 32), sy = Math.floor(sp.y / 32);
    const seen = new Set([sx + ',' + sy]);
    const q = [[sx, sy]];
    while (q.length) {
      const [cx, cy] = q.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy, k = nx + ',' + ny;
        if (seen.has(k) || !walkable(nx, ny)) continue;
        seen.add(k); q.push([nx, ny]);
      }
    }
    for (const n of (map.npcs || [])) {
      const k = Math.floor(n.x / 32) + ',' + Math.floor(n.y / 32);
      assert(seen.has(k), `从出生点必须能走到 ${n.id}`);
    }

    // 与通天河连通
    assert((map.portals || []).some(p => p.targetMap === 'tongtianhe'),
      '火焰山必须有返回通天河的入口');
    const tt = window.GAME_DATA.MAPS_2D.tongtianhe;
    assert((tt.portals || []).some(p => p.targetMap === 'huoyanshan'),
      '通天河必须有通往火焰山的出口');
  }

  // ── 2. 对白键完整 ──
  {
    const keys = ['huoyan_appeal', 'huoyan_land_talk', 'huoyan_borrow_fan', 'huoyan_test_fan',
      'huoyan_seek_true_fan', 'huoyan_bull_encounter', 'huoyan_renew_request',
      'huoyan_quench_fire', 'huoyan_reward'];
    for (const k of keys) {
      const d = window.GAME_DATA.STORY_DIALOGUES[k];
      assert(d && Array.isArray(d.steps) && d.steps.length > 0,
        `火焰山对白键「${k}」必须存在且有内容`);
      assert(d.steps.every(s => typeof s.text === 'string' && s.text.length > 0),
        `火焰山对白「${k}」每一步都必须有台词正文`);
    }
  }

  // ── 3. 章节开幕 ──
  {
    const cfg = window.GAME_DATA.CHAPTER_CONFIGS.chapter_16;
    assert(!!cfg, '第十六回开幕配置必须存在');
    assert(cfg.triggerMap === 'huoyanshan', '第十六回应绑定 huoyanshan');
    assert(cfg.triggerPhase === 'huoyan_arrived', '第十六回应绑定 huoyan_arrived');
    assert(cfg.chapterNum === '第十六回', '章回号应为第十六回');
  }

  // ── 4. 铁扇公主的恨有据（叙事红线） ──
  {
    const borrow = window.GAME_DATA.STORY_DIALOGUES.huoyan_borrow_fan;
    const princessLines = borrow.steps
      .filter(s => s.speaker === '铁扇公主')
      .map(s => s.text)
      .join('');
    // 她必须表达"失去了与孩子共同生活、亲自过问其去向的机会"
    assert(/失去了什么|连见一面|不原谅|一辈子不原谅/.test(princessLines),
      '铁扇公主必须表达真实的失子之痛，不能写成无理取闹');
    // 不能出现"得了正果还不知足"式的驳斥
    assert(!/不知足|正果.*还不/.test(princessLines),
      '不得用"孩子得了正果你还不知足"驳倒铁扇公主');
  }

  // ── 5. 悟空必须担责（而非一路取巧） ──
  {
    const renew = window.GAME_DATA.STORY_DIALOGUES.huoyan_renew_request;
    const wukongLines = renew.steps
      .filter(s => s.speaker === '孙悟空')
      .map(s => s.text)
      .join('');
    assert(/根子|老孙蹬倒八卦炉|失信|不原谅/.test(wukongLines),
      '悟空必须当众承认火源责任与失信，不能只靠耍小聪明');
    const princess = renew.steps.find(s => s.speaker === '铁扇公主');
    assert(princess && /不是原谅你|不原谅/.test(princess.text),
      '铁扇公主应明确"同意救灾≠原谅"，不得写成恩怨清零');
  }

  // ── 6. 试扇线索题（固定选择，错答不降阶段） ──
  {
    const trial = window.GAME_DATA.STORY_DIALOGUES.huoyan_test_fan;
    const firstStep = trial.steps[0];
    assert(Array.isArray(firstStep.options) && firstStep.options.length >= 2,
      '试扇首步必须提供可选项');
    // 错答应返回观察步骤（nextStep），不是结束也不是推进
    const wrong = firstStep.options.find(o => typeof o.nextStep === 'number');
    assert(!!wrong, '试扇必须提供返回观察步骤的错答分支');
    // 正确分支应推进到 seek_true_fan
    const correct = trial.steps.find(s => typeof s.action === 'function');
    assert(!!correct, '试扇必须有推进到下一阶段的正确分支');
  }

  // ── 7. 卷轴八阶段 ──
  {
    const phases = ['huoyan_arrived', 'huoyan_borrow_fan', 'huoyan_test_fan',
      'huoyan_seek_true_fan', 'huoyan_confront_bull', 'huoyan_renew_request',
      'huoyan_quench_fire', 'huoyan_cleared'];
    const old = app.storyPhase;
    try {
      for (const ph of phases) {
        app.storyPhase = ph;
        const info = app.getOrdealAndQuestInfo();
        assert(info && info.chapter === '第十六回 · 火焰借扇',
          `阶段 ${ph} 卷轴应属第十六回，实际「${info && info.chapter}」`);
        if (ph !== 'huoyan_cleared') {
          assert(!!info.stepName && info.stepName !== '与刘伯钦对话',
            `阶段 ${ph} 不得落回默认旧任务`);
        }
      }
    } finally {
      app.storyPhase = old;
    }
  }

  // ── 8. NPC 显隐矩阵 ──
  {
    const vis = (id, ph) => app.isNpcVisibleInStoryPhase(id, ph, 'huoyanshan');
    assert(vis('npc_huoyan_princess', 'huoyan_borrow_fan') === true, '借扇阶段铁扇公主可见');
    assert(vis('npc_huoyan_princess', 'huoyan_test_fan') === false,
      '试扇期间铁扇公主留洞中');
    assert(vis('npc_huoyan_bull_king', 'huoyan_seek_true_fan') === true,
      '骗扇事件中牛魔王应出现');
    assert(vis('npc_huoyan_bull_king', 'huoyan_cleared') === false,
      '终态牛魔王不得残留');
    assert(vis('npc_huoyan_fan_trial', 'huoyan_test_fan') === true, '试扇阶段火口可见');
    assert(vis('npc_huoyan_fan_trial', 'huoyan_quench_fire') === false,
      '灭火阶段不应再开放试扇火口');
  }

  // ── 9. 战斗守卫（胜利不等于强制交扇） ──
  {
    const oldPhase = app.storyPhase;
    const oldBattle = app.currentBattle;
    const oldEvents = app.playerData && app.playerData.storyEvents;
    const oldStart = app.start2DBattle;
    let started = false;
    app.start2DBattle = () => { started = true; return true; };
    try {
      if (app.playerData) app.playerData.storyEvents = {};

      app.storyPhase = 'huoyan_test_fan';
      started = false; app.triggerHuoyanBullBattle();
      assert(started === false, '试扇阶段不得提前挑战牛魔王');

      app.storyPhase = 'huoyan_confront_bull';
      started = false; app.triggerHuoyanBullBattle();
      assert(started === true, '对质阶段应能挑战牛魔王');

      app.storyPhase = 'huoyan_confront_bull';
      app.playerData.storyEvents = { huoyan_bull_won: true };
      started = false; app.triggerHuoyanBullBattle();
      assert(started === false, '已胜后不得重复触发');
    } finally {
      app.start2DBattle = oldStart;
      app.storyPhase = oldPhase;
      app.currentBattle = oldBattle;
      if (app.playerData) app.playerData.storyEvents = oldEvents;
    }
  }

  // ── 10. 熄火事实持久化与奖励幂等 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 65 });
    const inv = new window.Inventory([]);
    const first = p.claimStoryReward('huoyan_chapter_reward',
      { items: [{ itemId: 'eq_nk_huoyan', count: 1 }], exp: 1000, silver: 500 }, inv);
    assert(first.success === true, '火焰山章节奖励首次应发放成功');
    assert(!!window.GAME_DATA.ITEMS.eq_nk_huoyan,
      '火焰山奖励物品 eq_nk_huoyan 必须在物品表定义');

    const second = p.claimStoryReward('huoyan_chapter_reward',
      { items: [{ itemId: 'eq_nk_huoyan', count: 1 }], exp: 1000, silver: 500 }, inv);
    assert(second.success === false && second.reason === 'already_claimed',
      '重复领取必须被拒绝');

    const p2 = new window.Player({ classId: 'jingang', level: 65 });
    const fullInv = new window.Inventory([]);
    for (let i = 0; i < 36; i++) fullInv.slots.push({ instanceId: 'hf' + i, itemId: 'jinchuang_yao', count: 1 });
    const overflow = p2.claimStoryReward('huoyan_full_test',
      { items: [{ itemId: 'eq_nk_huoyan', count: 1 }] }, fullInv);
    assert(overflow.success === false && overflow.reason === 'inventory_full',
      '满包时应返回 inventory_full');
    assert(p2.storyRewards['huoyan_full_test'] !== true,
      '满包失败不得写入领取标记');
  }

  // ── 11. 章节起点不回退 ──
  {
    const oldPhase = app.storyPhase;
    const oldMap = app.currentMapId;
    const oldRefresh = app.refreshMapNpcs;
    const oldSave = app.saveAutoProgress;
    app.refreshMapNpcs = () => {};
    app.saveAutoProgress = () => {};
    try {
      app.currentMapId = 'huoyanshan';
      app.storyPhase = 'huoyan_cleared';
      app.ensureHuoyanChapterStarted();
      assert(app.storyPhase === 'huoyan_cleared', '已完成本章回访不得重置阶段');

      app.storyPhase = 'tongtian_cleared';
      app.ensureHuoyanChapterStarted();
      assert(app.storyPhase === 'huoyan_arrived', '上一章完结首次入图应初始化火焰山起点');

      app.currentMapId = 'liujiacun';
      app.storyPhase = 'tongtian_cleared';
      app.ensureHuoyanChapterStarted();
      assert(app.storyPhase === 'tongtian_cleared', '非本地图不得触发章节初始化');
    } finally {
      app.refreshMapNpcs = oldRefresh;
      app.saveAutoProgress = oldSave;
      app.storyPhase = oldPhase;
      app.currentMapId = oldMap;
    }
  }

  // ── 12. 主线目标唯一性 ──
  {
    const map = window.GAME_DATA.MAPS_2D.huoyanshan;
    const activePhases = ['huoyan_arrived', 'huoyan_borrow_fan', 'huoyan_test_fan',
      'huoyan_seek_true_fan', 'huoyan_confront_bull', 'huoyan_renew_request', 'huoyan_quench_fire'];
    for (const ph of activePhases) {
      const t = app.minimap.getCurrentQuestTarget('huoyanshan', ph, map);
      assert(!!t, `阶段 ${ph} 小地图必须给出主线目标`);
      assert(typeof t.name === 'string' && t.name.length > 0,
        `阶段 ${ph} 目标必须有可读名称`);
    }
    const endTarget = app.minimap.getCurrentQuestTarget('huoyanshan', 'huoyan_cleared', map);
    assert(endTarget === null, '终态小地图应清空本章任务指引');
  }

  // ── 13. 熄火表现不破坏连通（阶段切换后地图仍可通行） ──
  {
    const map = window.GAME_DATA.MAPS_2D.huoyanshan;
    const SOLID = new Set(['mountain_rock', 'lava', 'fire_wall', 'void', 'abyss']);
    let walk = 0;
    for (const row of map.tiles) for (const t of row) if (!SOLID.has(t)) walk++;
    assert(walk >= 373,
      `熄火后火焰山仍应保持足量通行格（≥373），实际 ${walk}`);
  }

  console.log('  ✅ 火焰山章节断言全部通过');
};
