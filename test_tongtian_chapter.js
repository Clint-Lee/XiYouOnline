/**
 * 汉风西游 - 第十五回 通天河章节回归测试
 * 覆盖：地图与实体落位、阶段链与五处表、对白键完整、奖励幂等与满包、
 *       NPC 显隐矩阵、战斗入口守卫、表态前禁止动手、线索题结构、
 *       主线目标唯一性、章节地图连通。
 */
module.exports = async function (assert) {
  console.log('\n▶️ [测试 60] 第十五回 通天河 章节闭环');
  const app = window.App2D;

  // ── 1. 地图与 NPC 落位 ──
  {
    const map = window.GAME_DATA.MAPS_2D.tongtianhe;
    assert(!!map, 'tongtianhe 地图必须存在');
    assert(map.width === 38 && map.height === 28,
      `通天河应为 38x28，实际 ${map.width}x${map.height}`);

    const ids = (map.npcs || []).map(n => n.id);
    for (const id of ['npc_tongtian_yuan', 'npc_tongtian_elder', 'npc_tongtian_child',
      'npc_tongtian_altar', 'npc_tongtian_watergate', 'npc_tongtian_guanyin']) {
      assert(ids.includes(id), `通天河必须配置 ${id}`);
    }

    const SOLID = new Set(['mountain_rock', 'water', 'city_wall', 'stone_wall', 'void', 'abyss',
      'demon_cave_wall', 'cloud_void', 'heaven_pillar', 'bamboo', 'dark_water', 'hut_wall',
      'palace_eaves', 'wooden_barricade', 'blacksmith_forge', 'ginseng_tree', 'purple_bamboo',
      'tang_palace', 'tang_store', 'stone_temple', 'two_realms_stele', 'lava', 'fire_wall']);
    const TS = 32;
    for (const n of (map.npcs || [])) {
      const gx = Math.floor(n.x / TS), gy = Math.floor(n.y / TS);
      const t = map.tiles[gy] && map.tiles[gy][gx];
      assert(!!t && !SOLID.has(t), `通天河 NPC ${n.id} 不得落在阻挡格`);
    }

    // BFS 连通
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

    // 与车迟国双向连通
    const cd = window.GAME_DATA.MAPS_2D.chediguo;
    assert((map.portals || []).some(p => p.targetMap === 'chediguo'),
      '通天河必须有返回车迟国的入口');
    assert((cd.portals || []).some(p => p.targetMap === 'tongtianhe'),
      '车迟国必须有通往通天河的出口');
  }

  // ── 2. 对白键完整 ──
  {
    const keys = ['tongtian_appeal', 'tongtian_child_words', 'tongtian_vow',
      'tongtian_altar_rite', 'tongtian_watergate', 'tongtian_victory',
      'tongtian_guanyin_arrival', 'tongtian_reward'];
    for (const k of keys) {
      const d = window.GAME_DATA.STORY_DIALOGUES[k];
      assert(d && Array.isArray(d.steps) && d.steps.length > 0,
        `通天河对白键「${k}」必须存在且有内容`);
      assert(d.steps.every(s => typeof s.text === 'string' && s.text.length > 0),
        `通天河对白「${k}」每一步都必须有台词正文`);
    }

    // 表态选项必须存在（本章叙事红线）
    const appeal = window.GAME_DATA.STORY_DIALOGUES.tongtian_appeal;
    const lastStep = appeal.steps[appeal.steps.length - 1];
    const opts = lastStep.options || [];
    const hasVow = opts.some(o => typeof o.text === 'string' && o.text.includes('祭童的事今日为止'));
    assert(hasVow, '陈家长者对白必须提供"祭童的事今日为止"的表态选项');
  }

  // ── 3. 章节开幕配置 ──
  {
    const cfg = window.GAME_DATA.CHAPTER_CONFIGS.chapter_15;
    assert(!!cfg, '第十五回开幕配置必须存在');
    assert(cfg.triggerMap === 'tongtianhe', '第十五回应绑定 tongtianhe');
    assert(cfg.triggerPhase === 'tongtian_arrival', '第十五回应绑定 tongtian_arrival');
    assert(cfg.chapterNum === '第十五回', '章回号应为第十五回');
  }

  // ── 4. 卷轴七阶段（含终态） ──
  {
    const phases = ['tongtian_arrival', 'tongtian_vowed', 'tongtian_altar',
      'tongtian_rescue', 'tongtian_await_guanyin', 'tongtian_reward', 'tongtian_cleared'];
    const old = app.storyPhase;
    try {
      for (const ph of phases) {
        app.storyPhase = ph;
        const info = app.getOrdealAndQuestInfo();
        assert(info && info.chapter === '第十五回 · 通天归真',
          `阶段 ${ph} 卷轴应属第十五回，实际「${info && info.chapter}」`);
        if (ph !== 'tongtian_cleared') {
          assert(!!info.stepName && info.stepName !== '与刘伯钦对话',
            `阶段 ${ph} 不得落回默认旧任务`);
        }
      }
    } finally {
      app.storyPhase = old;
    }
  }

  // ── 5. NPC 显隐矩阵（叙事红线） ──
  {
    const vis = (id, ph) => app.isNpcVisibleInStoryPhase(id, ph, 'tongtianhe');
    // 孩子只在初到与表态可见，动身即撤（不把儿童当诱饵）
    assert(vis('npc_tongtian_child', 'tongtian_arrival') === true, '初到时孩子可见');
    assert(vis('npc_tongtian_child', 'tongtian_altar') === false,
      '替身赴约时孩子必须已撤离（不充当诱饵）');
    assert(vis('npc_tongtian_child', 'tongtian_rescue') === false,
      '水府救援时孩子不得在场');
    // 观音只在收妖后出现
    assert(vis('npc_tongtian_guanyin', 'tongtian_rescue') === false,
      '救援阶段观音不得提前出现');
    assert(vis('npc_tongtian_guanyin', 'tongtian_await_guanyin') === true,
      '战斗胜利后观音应出现');
    // 水府入口只在救援阶段
    assert(vis('npc_tongtian_watergate', 'tongtian_rescue') === true,
      '救援阶段水府入口应可见');
    assert(vis('npc_tongtian_watergate', 'tongtian_altar') === false,
      '祭坛阶段不应提前开放水府入口');
  }

  // ── 6. 战斗入口守卫（表态前禁止动手） ──
  {
    const oldPhase = app.storyPhase;
    const oldBattle = app.currentBattle;
    const oldEvents = app.playerData && app.playerData.storyEvents;
    const oldStart = app.start2DBattle;
    let started = false;
    app.start2DBattle = () => { started = true; return true; };
    try {
      if (app.playerData) app.playerData.storyEvents = {};

      // 未表态不得开战
      app.storyPhase = 'tongtian_arrival';
      started = false; app.triggerTongtianRescueBattle();
      assert(started === false, '未表态阶段不得开战');

      app.storyPhase = 'tongtian_altar';
      started = false; app.triggerTongtianRescueBattle();
      assert(started === false, '祭坛阶段不得跳过线索直接开战');

      // 救援阶段可开战
      app.storyPhase = 'tongtian_rescue';
      started = false; app.triggerTongtianRescueBattle();
      assert(started === true, '救援阶段应能开战');

      // 已胜不得重复
      app.storyPhase = 'tongtian_rescue';
      app.playerData.storyEvents = { tongtian_boss_won: true };
      started = false; app.triggerTongtianRescueBattle();
      assert(started === false, '已胜后不得重复触发');
    } finally {
      app.start2DBattle = oldStart;
      app.storyPhase = oldPhase;
      app.currentBattle = oldBattle;
      if (app.playerData) app.playerData.storyEvents = oldEvents;
    }
  }

  // ── 7. 奖励幂等与满包 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 62 });
    const inv = new window.Inventory([]);
    const first = p.claimStoryReward('tongtian_ch15_clear',
      { items: [{ itemId: 'eq_nk_tongtian', count: 1 }], exp: 1000, silver: 500 }, inv);
    assert(first.success === true, '通天河章节奖励首次应发放成功');
    assert(!!window.GAME_DATA.ITEMS.eq_nk_tongtian,
      '通天河奖励物品 eq_nk_tongtian 必须在物品表定义');

    const second = p.claimStoryReward('tongtian_ch15_clear',
      { items: [{ itemId: 'eq_nk_tongtian', count: 1 }], exp: 1000, silver: 500 }, inv);
    assert(second.success === false && second.reason === 'already_claimed',
      '重复领取必须被拒绝');

    const p2 = new window.Player({ classId: 'jingang', level: 62 });
    const fullInv = new window.Inventory([]);
    for (let i = 0; i < 36; i++) fullInv.slots.push({ instanceId: 'tf' + i, itemId: 'jinchuang_yao', count: 1 });
    const overflow = p2.claimStoryReward('tongtian_full_test',
      { items: [{ itemId: 'eq_nk_tongtian', count: 1 }] }, fullInv);
    assert(overflow.success === false && overflow.reason === 'inventory_full',
      '满包时应返回 inventory_full');
    assert(p2.storyRewards['tongtian_full_test'] !== true,
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
      app.currentMapId = 'tongtianhe';
      app.storyPhase = 'tongtian_cleared';
      app.ensureTongtianChapterStarted();
      assert(app.storyPhase === 'tongtian_cleared', '已完成本章回访不得重置阶段');

      app.storyPhase = 'chedi_cleared';
      app.ensureTongtianChapterStarted();
      assert(app.storyPhase === 'tongtian_arrival', '上一章完结首次入图应初始化通天河起点');

      app.currentMapId = 'liujiacun';
      app.storyPhase = 'chedi_cleared';
      app.ensureTongtianChapterStarted();
      assert(app.storyPhase === 'chedi_cleared', '非本地图不得触发章节初始化');
    } finally {
      app.refreshMapNpcs = oldRefresh;
      app.saveAutoProgress = oldSave;
      app.storyPhase = oldPhase;
      app.currentMapId = oldMap;
    }
  }

  // ── 9. 主线目标唯一性 ──
  {
    const map = window.GAME_DATA.MAPS_2D.tongtianhe;
    const activePhases = ['tongtian_arrival', 'tongtian_vowed', 'tongtian_altar',
      'tongtian_rescue', 'tongtian_await_guanyin', 'tongtian_reward'];
    for (const ph of activePhases) {
      const t = app.minimap.getCurrentQuestTarget('tongtianhe', ph, map);
      assert(!!t, `阶段 ${ph} 小地图必须给出主线目标`);
      assert(typeof t.name === 'string' && t.name.length > 0,
        `阶段 ${ph} 目标必须有可读名称`);
    }
    const endTarget = app.minimap.getCurrentQuestTarget('tongtianhe', 'tongtian_cleared', map);
    assert(endTarget === null, '终态小地图应清空本章任务指引');
  }

  console.log('  ✅ 通天河章节断言全部通过');
};
