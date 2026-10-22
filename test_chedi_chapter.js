/**
 * 汉风西游 - 第十四回 车迟国章节回归测试
 * 覆盖：地图与实体落位、阶段链与四张表、对白键完整、奖励幂等与满包、
 *       NPC 显隐矩阵、战斗入口守卫、主线目标唯一性、卷轴与小地图一致。
 */
module.exports = async function (assert) {
  console.log('\n▶️ [测试 59] 第十四回 车迟国 章节闭环');
  const app = window.App2D;

  // ── 1. 地图与 NPC 落位 ──
  {
    const map = window.GAME_DATA.MAPS_2D.chediguo;
    assert(!!map, 'chediguo 地图必须存在');
    assert(map.width === 38 && map.height === 28,
      `车迟国应为 38x28，实际 ${map.width}x${map.height}`);

    const ids = (map.npcs || []).map(n => n.id);
    for (const id of ['npc_chedi_king', 'npc_chedi_monk', 'npc_chedi_tiger', 'npc_chedi_deer', 'npc_chedi_sheep']) {
      assert(ids.includes(id), `车迟国必须配置 ${id}`);
    }

    // 实体不得落在阻挡格
    const SOLID = new Set(['mountain_rock', 'water', 'city_wall', 'stone_wall', 'void', 'abyss',
      'demon_cave_wall', 'cloud_void', 'heaven_pillar', 'bamboo', 'dark_water', 'hut_wall',
      'palace_eaves', 'wooden_barricade', 'blacksmith_forge', 'ginseng_tree', 'purple_bamboo',
      'tang_palace', 'tang_store', 'stone_temple', 'two_realms_stele', 'lava', 'fire_wall']);
    const TS = 32;
    for (const n of (map.npcs || [])) {
      const gx = Math.floor(n.x / TS), gy = Math.floor(n.y / TS);
      const t = map.tiles[gy] && map.tiles[gy][gx];
      assert(!!t && !SOLID.has(t), `车迟国 NPC ${n.id} 不得落在阻挡格`);
    }

    // BFS 连通：出生点可达全部 NPC
    const walkable = (x, y) => {
      if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
      const row = map.tiles[y];
      return !!row && !!row[x] && !SOLID.has(row[x]);
    };
    const sp = map.playerSpawn;
    const sx = Math.floor(sp.x / TS), sy = Math.floor(sp.y / TS);
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
      const k = Math.floor(n.x / TS) + ',' + Math.floor(n.y / TS);
      assert(seen.has(k), `从出生点必须能走到 ${n.id}`);
    }
  }

  // ── 2. 对白键完整 ──
  {
    const keys = ['chedi_monk_appeal', 'chedi_royal_terms', 'chedi_rain_trial',
      'chedi_discern_trial', 'chedi_final_challenge', 'chedi_victory',
      'chedi_reward', 'chedi_after_clear'];
    for (const k of keys) {
      const d = window.GAME_DATA.STORY_DIALOGUES[k];
      assert(d && Array.isArray(d.steps) && d.steps.length > 0,
        `车迟国对白键「${k}」必须存在且有内容`);
      assert(d.steps.every(s => typeof s.text === 'string' && s.text.length > 0),
        `车迟国对白「${k}」每一步都必须有台词正文`);
    }
  }

  // ── 3. 章节开幕配置 ──
  {
    const cfg = window.GAME_DATA.CHAPTER_CONFIGS.chapter_14;
    assert(!!cfg, '第十四回开幕配置必须存在');
    assert(cfg.triggerMap === 'chediguo', '第十四回应绑定 chediguo');
    assert(cfg.triggerPhase === 'chedi_arrival', '第十四回应绑定 chedi_arrival');
    assert(cfg.chapterNum === '第十四回', '章回号应为第十四回');
  }

  // ── 4. 卷轴八阶段（含终态） ──
  {
    const phases = ['chedi_arrival', 'chedi_audience', 'chedi_rain', 'chedi_discern',
      'chedi_final_trial', 'chedi_reward_pending', 'chedi_cleared'];
    const old = app.storyPhase;
    try {
      for (const ph of phases) {
        app.storyPhase = ph;
        const info = app.getOrdealAndQuestInfo();
        assert(info && info.chapter === '第十四回 · 车迟斗法',
          `阶段 ${ph} 卷轴应属第十四回，实际「${info && info.chapter}」`);
        if (ph !== 'chedi_cleared') {
          assert(!!info.stepName && info.stepName !== '与刘伯钦对话',
            `阶段 ${ph} 不得落回默认旧任务`);
        }
      }
    } finally {
      app.storyPhase = old;
    }
  }

  // ── 5. NPC 显隐矩阵 ──
  {
    const vis = (id, ph) => app.isNpcVisibleInStoryPhase(id, ph, 'chediguo');
    assert(vis('npc_chedi_monk', 'chedi_arrival') === true, '僧人在初入阶段可见');
    assert(vis('npc_chedi_tiger', 'chedi_rain') === true, '虎力在祈雨阶段可见');
    assert(vis('npc_chedi_deer', 'chedi_discern') === true, '鹿力在辨物阶段可见');
    assert(vis('npc_chedi_sheep', 'chedi_final_trial') === true, '羊力在决战阶段可见');
    // 决战胜利进入领奖阶段即隐藏三仙（不等领奖）
    assert(vis('npc_chedi_sheep', 'chedi_reward_pending') === false,
      '胜利进入领奖阶段后三仙应隐藏');
    assert(vis('npc_chedi_tiger', 'chedi_reward_pending') === false,
      '胜利进入领奖阶段后虎力应隐藏');
  }

  // ── 6. 战斗入口守卫 ──
  {
    const oldPhase = app.storyPhase;
    const oldBattle = app.currentBattle;
    const oldEvents = app.playerData && app.playerData.storyEvents;
    const oldStart = app.start2DBattle;
    let started = false;
    app.start2DBattle = () => { started = true; return true; };
    try {
      if (app.playerData) app.playerData.storyEvents = {};

      app.storyPhase = 'chedi_discern';
      started = false; app.triggerChediFinalBattle();
      assert(started === false, '辨物阶段不得提前触发决战');

      app.storyPhase = 'chedi_final_trial';
      started = false; app.triggerChediFinalBattle();
      assert(started === true, '决战阶段应能触发');

      app.storyPhase = 'chedi_final_trial';
      app.playerData.storyEvents = { chedi_final_won: true };
      started = false; app.triggerChediFinalBattle();
      assert(started === false, '决战已胜后不得重复触发');
    } finally {
      app.start2DBattle = oldStart;
      app.storyPhase = oldPhase;
      app.currentBattle = oldBattle;
      if (app.playerData) app.playerData.storyEvents = oldEvents;
    }
  }

  // ── 7. 章节奖励幂等与满包 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 60 });
    const inv = new window.Inventory([]);
    const first = p.claimStoryReward('chedi_ch14_clear',
      { items: [{ itemId: 'eq_nk_chedi', count: 1 }], exp: 1000, silver: 500 }, inv);
    assert(first.success === true, '车迟国章节奖励首次应发放成功');
    assert(!!window.GAME_DATA.ITEMS.eq_nk_chedi,
      '车迟国奖励物品 eq_nk_chedi 必须在物品表定义');

    const second = p.claimStoryReward('chedi_ch14_clear',
      { items: [{ itemId: 'eq_nk_chedi', count: 1 }], exp: 1000, silver: 500 }, inv);
    assert(second.success === false && second.reason === 'already_claimed',
      '重复领取必须被拒绝');

    // 满包：保留入口，不写领取标记
    const p2 = new window.Player({ classId: 'jingang', level: 60 });
    const fullInv = new window.Inventory([]);
    for (let i = 0; i < 36; i++) fullInv.slots.push({ instanceId: 'cf' + i, itemId: 'jinchuang_yao', count: 1 });
    const overflow = p2.claimStoryReward('chedi_full_test',
      { items: [{ itemId: 'eq_nk_chedi', count: 1 }] }, fullInv);
    assert(overflow.success === false && overflow.reason === 'inventory_full',
      '满包时应返回 inventory_full');
    assert(p2.storyRewards['chedi_full_test'] !== true,
      '满包失败不得写入领取标记');
  }

  // ── 8. 章节起点不回退 ──
  {
    const oldPhase = app.storyPhase;
    const oldMap = app.currentMapId;
    const oldRefresh = app.refreshMapNpcs;
    const oldSave = app.saveAutoProgress;
    app.refreshMapNpcs = () => {};
    app.saveAutoProgress = () => {};
    try {
      app.currentMapId = 'chediguo';
      app.storyPhase = 'chedi_cleared';
      app.ensureChediChapterStarted();
      assert(app.storyPhase === 'chedi_cleared', '已完成本章回访不得重置阶段');

      app.storyPhase = 'heishui_cleared';
      app.ensureChediChapterStarted();
      assert(app.storyPhase === 'chedi_arrival', '上一章完结首次入图应初始化车迟国起点');

      app.currentMapId = 'liujiacun';
      app.storyPhase = 'heishui_cleared';
      app.ensureChediChapterStarted();
      assert(app.storyPhase === 'heishui_cleared', '非本地图不得触发章节初始化');
    } finally {
      app.refreshMapNpcs = oldRefresh;
      app.saveAutoProgress = oldSave;
      app.storyPhase = oldPhase;
      app.currentMapId = oldMap;
    }
  }

  // ── 9. 主线目标唯一性 ──
  {
    const map = window.GAME_DATA.MAPS_2D.chediguo;
    const activePhases = ['chedi_arrival', 'chedi_audience', 'chedi_rain',
      'chedi_discern', 'chedi_final_trial', 'chedi_reward_pending'];
    for (const ph of activePhases) {
      const t = app.minimap.getCurrentQuestTarget('chediguo', ph, map);
      assert(!!t, `阶段 ${ph} 小地图必须给出主线目标`);
      // 目标必须与 MAIN_QUEST_TARGETS 一致
      assert(typeof t.name === 'string' && t.name.length > 0,
        `阶段 ${ph} 目标必须有可读名称`);
    }
    // 终态清空
    const endTarget = app.minimap.getCurrentQuestTarget('chediguo', 'chedi_cleared', map);
    assert(endTarget === null, '终态小地图应清空本章任务指引');
  }

  console.log('  ✅ 车迟国章节断言全部通过');
};
