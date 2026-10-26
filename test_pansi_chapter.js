/**
 * 汉风西游 - 第十七回 盘丝洞章节回归测试
 * 覆盖：地图与连通、阶段链与五处表、对白键完整、双重责任红线、
 *       线索题结构、破光前提、毒茶一次性、奖励幂等与满包、西行出口终态放行。
 */
module.exports = async function (assert) {
  console.log('\n▶️ [测试 62] 第十七回 盘丝洞 章节闭环');
  const app = window.App2D;

  // ── 1. 地图与 NPC ──
  {
    const map = window.GAME_DATA.MAPS_2D.pansidong;
    assert(!!map, 'pansidong 地图必须存在');
    assert(map.width === 38 && map.height === 28,
      `盘丝洞应为 38x28，实际 ${map.width}x${map.height}`);

    const ids = (map.npcs || []).map(n => n.id);
    for (const id of ['npc_pansi_spider', 'npc_pansi_huanghua', 'npc_pansi_oldwoman',
      'npc_pansi_maori', 'npc_pansi_west_exit']) {
      assert(ids.includes(id), `盘丝洞必须配置 ${id}`);
    }

    const SOLID = new Set(['mountain_rock', 'water', 'city_wall', 'stone_wall', 'void', 'abyss',
      'demon_cave_wall', 'cloud_void', 'heaven_pillar', 'bamboo', 'dark_water', 'hut_wall',
      'palace_eaves', 'wooden_barricade', 'blacksmith_forge', 'ginseng_tree', 'purple_bamboo',
      'tang_palace', 'tang_store', 'stone_temple', 'two_realms_stele', 'lava', 'fire_wall']);
    let walk = 0;
    for (const row of map.tiles) for (const t of row) if (!SOLID.has(t)) walk++;
    const ratio = walk / (map.width * map.height);
    assert(ratio >= 0.35,
      `盘丝洞可行走比例应 ≥35%，实际 ${(ratio * 100).toFixed(1)}%`);

    for (const n of (map.npcs || [])) {
      const gx = Math.floor(n.x / 32), gy = Math.floor(n.y / 32);
      const t = map.tiles[gy] && map.tiles[gy][gx];
      assert(!!t && !SOLID.has(t), `盘丝洞 NPC ${n.id} 不得落在阻挡格`);
    }

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

    assert((map.portals || []).some(p => p.targetMap === 'huoyanshan'),
      '盘丝洞必须有返回火焰山的入口');
    const hy = window.GAME_DATA.MAPS_2D.huoyanshan;
    assert((hy.portals || []).some(p => p.targetMap === 'pansidong'),
      '火焰山必须有通往盘丝洞的出口');
  }

  // ── 2. 对白键完整 ──
  {
    const keys = ['pansi_spring', 'pansi_unbind', 'pansi_after_unbound', 'pansi_huanghua',
      'pansi_poison_tea', 'pansi_maori', 'pansi_light_break', 'pansi_form_revealed',
      'pansi_victory', 'pansi_aftercare', 'pansi_cleared_end'];
    for (const k of keys) {
      const d = window.GAME_DATA.STORY_DIALOGUES[k];
      assert(d && Array.isArray(d.steps) && d.steps.length > 0,
        `盘丝洞对白键「${k}」必须存在且有内容`);
      assert(d.steps.every(s => typeof s.text === 'string' && s.text.length > 0),
        `盘丝洞对白「${k}」每一步都必须有台词正文`);
    }

    // 每个 NPC 的 dialogueKey 都必须有对白
    for (const n of (window.GAME_DATA.MAPS_2D.pansidong.npcs || [])) {
      if (!n.dialogueKey) continue;
      assert(!!window.GAME_DATA.STORY_DIALOGUES[n.dialogueKey],
        `NPC ${n.id} 声明的对白键「${n.dialogueKey}」必须有剧本`);
    }
  }

  // ── 3. 章节开幕 ──
  {
    const cfg = window.GAME_DATA.CHAPTER_CONFIGS.chapter_17;
    assert(!!cfg, '第十七回开幕配置必须存在');
    assert(cfg.triggerMap === 'pansidong', '第十七回应绑定 pansidong');
    assert(cfg.triggerPhase === 'pansi_arrived', '第十七回应绑定 pansi_arrived');
    assert(cfg.chapterNum === '第十七回', '章回号应为第十七回');
  }

  // ── 4. 双重责任红线 ──
  {
    // 唐僧先立边界（原则，不是怯懦）
    const spring = window.GAME_DATA.STORY_DIALOGUES.pansi_spring;
    const tangsengFirst = spring.steps.find(s => s.speaker === '唐三藏');
    assert(tangsengFirst && /便应止步|不可近前/.test(tangsengFirst.text),
      '唐僧必须先在泉边立边界，且是原则而非"怕惹麻烦"');

    // 八戒明确认责，不以"她们是妖"辩解
    const after = window.GAME_DATA.STORY_DIALOGUES.pansi_after_unbound;
    const bajie = after.steps.find(s => s.speaker === '猪八戒');
    assert(bajie && /是我先越了界/.test(bajie.text),
      '八戒必须明确承认"我先越了界"，不得以对方是妖辩解');

    // 唐僧不替他扛，两笔账各算
    const tangseng2 = after.steps.find(s => s.speaker === '唐三藏');
    assert(tangseng2 && /各算各的|也须/.test(tangseng2.text),
      '唐僧必须分清两笔账：越界该认，扣人伤人也须止');

    // 不拿受害者开玩笑：不得出现猎艳/色情双关/羞辱
    const allText = Object.values(window.GAME_DATA.STORY_DIALOGUES)
      .filter(d => d && d.steps)
      .filter(d => d.steps.some(s => ['pansi_spring', 'pansi_unbind', 'pansi_after_unbound'].includes('') || false))
      .map(d => d.steps.map(s => s.text).join('')).join('');
    const pansiText = ['pansi_spring', 'pansi_unbind', 'pansi_after_unbound', 'pansi_huanghua',
      'pansi_poison_tea', 'pansi_maori', 'pansi_light_break', 'pansi_victory', 'pansi_aftercare']
      .map(k => window.GAME_DATA.STORY_DIALOGUES[k])
      .filter(Boolean)
      .map(d => d.steps.map(s => s.text).join(''))
      .join('');
    assert(!/活该|谁让你|妖也讲规矩|欲拒还迎|娇嗔/.test(pansiText),
      '不得出现羞辱受害者、否定对方边界权、把拒绝写成调情的措辞');
  }

  // ── 5. 解缚线索题 ──
  {
    const unbind = window.GAME_DATA.STORY_DIALOGUES.pansi_unbind;
    const first = unbind.steps[0];
    assert(Array.isArray(first.options) && first.options.length >= 3,
      '解缚首步必须提供多个观察选项');
    const wrong = first.options.find(o => typeof o.nextStep === 'number');
    assert(!!wrong, '解缚必须提供返回观察步骤的错答分支');
    // 正确分支应开启战斗
    const hasBattle = unbind.steps.some(s => Array.isArray(s.options) &&
      s.options.some(o => typeof o.action === 'function'));
    assert(hasBattle, '解缚正确分支必须能开启蜘蛛精遭遇战');
  }

  // ── 6. 卷轴八阶段 ──
  {
    const phases = ['pansi_arrived', 'pansi_webbound', 'pansi_huanghua', 'pansi_poisoned',
      'pansi_seeking_rooster', 'pansi_breaking_light', 'pansi_restoring', 'pansi_cleared'];
    const old = app.storyPhase;
    try {
      for (const ph of phases) {
        app.storyPhase = ph;
        const info = app.getOrdealAndQuestInfo();
        assert(info && info.chapter === '第十七回 · 盘丝破妄',
          `阶段 ${ph} 卷轴应属第十七回，实际「${info && info.chapter}」`);
        if (ph !== 'pansi_cleared') {
          assert(!!info.stepName && info.stepName !== '与刘伯钦对话',
            `阶段 ${ph} 不得落回默认旧任务`);
        }
      }
    } finally {
      app.storyPhase = old;
    }
  }

  // ── 7. NPC 显隐矩阵 ──
  {
    const vis = (id, ph) => app.isNpcVisibleInStoryPhase(id, ph, 'pansidong');
    assert(vis('npc_pansi_spider', 'pansi_arrived') === true, '初到时女妖代表可见');
    assert(vis('npc_pansi_spider', 'pansi_huanghua') === false,
      '解缚完成后女妖代表退场');
    assert(vis('npc_pansi_huanghua', 'pansi_huanghua') === true, '解缚后观主可见');
    assert(vis('npc_pansi_oldwoman', 'pansi_poisoned') === true, '中毒后老妇可见');
    assert(vis('npc_pansi_maori', 'pansi_seeking_rooster') === true, '寻援阶段星官可见');
    assert(vis('npc_pansi_maori', 'pansi_huanghua') === false,
      '未寻援前星官不得提前出现');
    // 西行出口只在终态
    assert(vis('npc_pansi_west_exit', 'pansi_restoring') === false,
      '善后阶段不得提前开放西行出口');
    assert(vis('npc_pansi_west_exit', 'pansi_cleared') === true,
      '终态西行出口应放行');
  }

  // ── 8. 战斗守卫（破光是开战前提） ──
  {
    const oldPhase = app.storyPhase;
    const oldBattle = app.currentBattle;
    const oldEvents = app.playerData && app.playerData.storyEvents;
    const oldStart = app.start2DBattle;
    let started = false;
    app.start2DBattle = () => { started = true; return true; };
    try {
      if (app.playerData) app.playerData.storyEvents = {};

      // 未解缚不得开战
      app.storyPhase = 'pansi_arrived';
      started = false; app.triggerPansiSpiderBattle();
      assert(started === false, '泉边阶段不得开战');

      app.storyPhase = 'pansi_webbound';
      started = false; app.triggerPansiSpiderBattle();
      assert(started === true, '解缚阶段应能开战');

      // 未破光不得开最终战
      app.storyPhase = 'pansi_breaking_light';
      app.playerData.storyEvents = {};
      started = false; app.triggerPansiBaiyanBattle();
      assert(started === false, '两声啼鸣未完成不得开启百眼最终战');

      // 破光后可开战
      app.storyPhase = 'pansi_breaking_light';
      app.playerData.storyEvents = { pansi_light_broken: true, pansi_form_revealed: true };
      started = false; app.triggerPansiBaiyanBattle();
      assert(started === true, '破光并显形后应能挑战百眼');

      // 已胜不得重复
      app.storyPhase = 'pansi_breaking_light';
      app.playerData.storyEvents = { pansi_light_broken: true, pansi_form_revealed: true, pansi_boss_won: true };
      started = false; app.triggerPansiBaiyanBattle();
      assert(started === false, '已胜后不得重复触发');
    } finally {
      app.start2DBattle = oldStart;
      app.storyPhase = oldPhase;
      app.currentBattle = oldBattle;
      if (app.playerData) app.playerData.storyEvents = oldEvents;
    }
  }

  // ── 9. 啼鸣顺序与幂等 ──
  {
    const oldPhase = app.storyPhase;
    const oldEvents = app.playerData && app.playerData.storyEvents;
    const oldRefresh = app.refreshMapNpcs;
    const oldSave = app.saveAutoProgress;
    const oldMsg = window.showGameMessage;
    app.refreshMapNpcs = () => {};
    app.saveAutoProgress = () => {};
    window.showGameMessage = () => {};
    try {
      if (app.playerData) app.playerData.storyEvents = {};
      app.storyPhase = 'pansi_seeking_rooster';

      // 第二声不能先于第一声
      app.triggerPansiRoosterCry(2);
      assert(app.playerData.storyEvents.pansi_form_revealed !== true,
        '第二声啼鸣不得先于第一声生效');

      // 第一声
      app.triggerPansiRoosterCry(1);
      assert(app.playerData.storyEvents.pansi_light_broken === true, '第一声应破光');
      assert(app.storyPhase === 'pansi_breaking_light',
        '第一声啼鸣后应进入 breaking_light');

      // 第二声
      app.triggerPansiRoosterCry(2);
      assert(app.playerData.storyEvents.pansi_form_revealed === true, '第二声应显形');

      // 重复调用不覆盖
      app.triggerPansiRoosterCry(1);
      app.triggerPansiRoosterCry(2);
      assert(app.storyPhase === 'pansi_breaking_light', '啼鸣结果不得被重复调用改变');
    } finally {
      app.refreshMapNpcs = oldRefresh;
      app.saveAutoProgress = oldSave;
      window.showGameMessage = oldMsg;
      app.storyPhase = oldPhase;
      if (app.playerData) app.playerData.storyEvents = oldEvents;
    }
  }

  // ── 10. 毒茶一次性 ──
  {
    const oldPhase = app.storyPhase;
    const oldEvents = app.playerData && app.playerData.storyEvents;
    const oldRefresh = app.refreshMapNpcs;
    const oldSave = app.saveAutoProgress;
    const oldSched = app.scheduleStoryDialogue;
    let schedCount = 0;
    app.refreshMapNpcs = () => {};
    app.saveAutoProgress = () => {};
    app.scheduleStoryDialogue = () => { schedCount++; };
    try {
      if (app.playerData) app.playerData.storyEvents = {};
      app.storyPhase = 'pansi_huanghua';
      app.triggerPansiPoisonTea();
      const firstCount = schedCount;
      assert(app.playerData.storyEvents.pansi_poisoned === true, '毒茶事件应记录');
      assert(app.storyPhase === 'pansi_poisoned', '毒茶后应进入 poisoned');

      // 重复触发不再生效
      app.triggerPansiPoisonTea();
      assert(schedCount === firstCount, '毒茶事件只生效一次，不得重复播放');
    } finally {
      app.refreshMapNpcs = oldRefresh;
      app.saveAutoProgress = oldSave;
      app.scheduleStoryDialogue = oldSched;
      app.storyPhase = oldPhase;
      if (app.playerData) app.playerData.storyEvents = oldEvents;
    }
  }

  // ── 11. 奖励幂等与满包 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 68 });
    const inv = new window.Inventory([]);
    const first = p.claimStoryReward('pansi_chapter_reward',
      { items: [{ itemId: 'eq_nk_pansi', count: 1 }], exp: 1000, silver: 500 }, inv);
    assert(first.success === true, '盘丝洞章节奖励首次应发放成功');
    assert(!!window.GAME_DATA.ITEMS.eq_nk_pansi,
      '盘丝洞奖励物品 eq_nk_pansi 必须在物品表定义');

    const second = p.claimStoryReward('pansi_chapter_reward',
      { items: [{ itemId: 'eq_nk_pansi', count: 1 }], exp: 1000, silver: 500 }, inv);
    assert(second.success === false && second.reason === 'already_claimed',
      '重复领取必须被拒绝');

    const p2 = new window.Player({ classId: 'jingang', level: 68 });
    const fullInv = new window.Inventory([]);
    for (let i = 0; i < 36; i++) fullInv.slots.push({ instanceId: 'pf' + i, itemId: 'jinchuang_yao', count: 1 });
    const overflow = p2.claimStoryReward('pansi_full_test',
      { items: [{ itemId: 'eq_nk_pansi', count: 1 }] }, fullInv);
    assert(overflow.success === false && overflow.reason === 'inventory_full',
      '满包时应返回 inventory_full');
    assert(p2.storyRewards['pansi_full_test'] !== true,
      '满包失败不得写入领取标记');
  }

  // ── 12. 章节起点不回退 ──
  {
    const oldPhase = app.storyPhase;
    const oldMap = app.currentMapId;
    const oldRefresh = app.refreshMapNpcs;
    const oldSave = app.saveAutoProgress;
    app.refreshMapNpcs = () => {};
    app.saveAutoProgress = () => {};
    try {
      app.currentMapId = 'pansidong';
      app.storyPhase = 'pansi_cleared';
      app.ensurePansiChapterStarted();
      assert(app.storyPhase === 'pansi_cleared', '已完成本章回访不得重置阶段');

      app.storyPhase = 'huoyan_cleared';
      app.ensurePansiChapterStarted();
      assert(app.storyPhase === 'pansi_arrived', '上一章完结首次入图应初始化盘丝洞起点');

      app.currentMapId = 'liujiacun';
      app.storyPhase = 'huoyan_cleared';
      app.ensurePansiChapterStarted();
      assert(app.storyPhase === 'huoyan_cleared', '非本地图不得触发章节初始化');
    } finally {
      app.refreshMapNpcs = oldRefresh;
      app.saveAutoProgress = oldSave;
      app.storyPhase = oldPhase;
      app.currentMapId = oldMap;
    }
  }

  // ── 13. 主线目标唯一性 ──
  {
    const map = window.GAME_DATA.MAPS_2D.pansidong;
    const activePhases = ['pansi_arrived', 'pansi_webbound', 'pansi_huanghua', 'pansi_poisoned',
      'pansi_seeking_rooster', 'pansi_breaking_light', 'pansi_restoring'];
    for (const ph of activePhases) {
      const t = app.minimap.getCurrentQuestTarget('pansidong', ph, map);
      assert(!!t, `阶段 ${ph} 小地图必须给出主线目标`);
      assert(typeof t.name === 'string' && t.name.length > 0,
        `阶段 ${ph} 目标必须有可读名称`);
    }
    // 终态目标指向西行出口
    const endTarget = app.minimap.getCurrentQuestTarget('pansidong', 'pansi_cleared', map);
    assert(!!endTarget, '终态小地图应指向西行出口');
  }

  console.log('  ✅ 盘丝洞章节断言全部通过');
};
