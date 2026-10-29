/**
 * 汉风西游 - 第十八回 狮驼岭章节回归测试
 * 覆盖：地图重建与连通、阶段链与五处表、对白键完整、叙事红线（受害者克制）、
 *       线索题结构、破瓶前提、战斗守卫幂等、奖励原子与满包、西行关口与大雷音寺门禁。
 */
module.exports = async function (assert) {
  console.log('\n▶️ [测试 63] 第十八回 狮驼岭 章节闭环');
  const app = window.App2D;

  // ── 1. 地图与 NPC ──
  {
    const map = window.GAME_DATA.MAPS_2D.shituoling;
    assert(!!map, 'shituoling 地图必须存在');
    assert(map.width === 38 && map.height === 28,
      `狮驼岭应为 38x28，实际 ${map.width}x${map.height}`);

    const ids = (map.npcs || []).map(n => n.id);
    for (const id of ['npc_taibai_warning', 'npc_shituo_zuanfeng', 'npc_shituo_cavemouth',
      'npc_shituo_villager', 'npc_shituo_west_exit']) {
      assert(ids.includes(id), `狮驼岭必须配置 ${id}`);
    }

    const SOLID = new Set(['mountain_rock', 'water', 'city_wall', 'stone_wall', 'void', 'abyss',
      'demon_cave_wall', 'cloud_void', 'heaven_pillar', 'bamboo', 'dark_water', 'hut_wall',
      'palace_eaves', 'wooden_barricade', 'blacksmith_forge', 'ginseng_tree', 'purple_bamboo',
      'tang_palace', 'tang_store', 'stone_temple', 'two_realms_stele', 'lava', 'fire_wall']);
    let walk = 0;
    for (const row of map.tiles) for (const t of row) if (!SOLID.has(t)) walk++;
    const ratio = walk / (map.width * map.height);
    assert(ratio >= 0.35,
      `狮驼岭可行走比例应 ≥35%（重建后），实际 ${(ratio * 100).toFixed(1)}%`);

    for (const n of (map.npcs || [])) {
      const gx = Math.floor(n.x / 32), gy = Math.floor(n.y / 32);
      const t = map.tiles[gy] && map.tiles[gy][gx];
      assert(!!t && !SOLID.has(t), `狮驼岭 NPC ${n.id} 不得落在阻挡格`);
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

    assert((map.portals || []).some(p => p.targetMap === 'pansidong'),
      '狮驼岭必须有返回盘丝洞的入口');
    assert((map.portals || []).some(p => p.targetMap === 'daleiyinsi'),
      '狮驼岭必须有通往大雷音寺的西行出口');
    const ps = window.GAME_DATA.MAPS_2D.pansidong;
    assert((ps.portals || []).some(p => p.targetMap === 'shituoling'),
      '盘丝洞必须有通往狮驼岭的出口');
  }

  // ── 2. 对白键完整 ──
  {
    const keys = ['shituo_warning', 'shituo_recon', 'shituo_flask_event', 'shituo_cave_intro',
      'shituo_after_cave', 'shituo_buddha_arrives', 'shituo_final_intro', 'shituo_victory',
      'shituo_aftercare', 'shituo_cleared_end'];
    for (const k of keys) {
      const d = window.GAME_DATA.STORY_DIALOGUES[k];
      assert(d && Array.isArray(d.steps) && d.steps.length > 0,
        `狮驼岭对白键「${k}」必须存在且有内容`);
      assert(d.steps.every(s => typeof s.text === 'string' && s.text.length > 0),
        `狮驼岭对白「${k}」每一步都必须有台词正文`);
    }

    for (const n of (window.GAME_DATA.MAPS_2D.shituoling.npcs || [])) {
      if (!n.dialogueKey) continue;
      assert(!!window.GAME_DATA.STORY_DIALOGUES[n.dialogueKey],
        `NPC ${n.id} 声明的对白键「${n.dialogueKey}」必须有剧本`);
    }
  }

  // ── 3. 章节开幕 ──
  {
    const cfg = window.GAME_DATA.CHAPTER_CONFIGS.chapter_18;
    assert(!!cfg, '第十八回开幕配置必须存在');
    assert(cfg.triggerMap === 'shituoling', '第十八回应绑定 shituoling');
    assert(cfg.triggerPhase === 'shituo_arrived', '第十八回应绑定 shituo_arrived');
    assert(cfg.chapterNum === '第十八回', '章回号应为第十八回');
    assert(cfg.seal === '狮驼伏魔', '第十八回御印应为狮驼伏魔');
  }

  // ── 4. 叙事红线（受害者克制 + 不渲染凶事） ──
  {
    const text = ['shituo_warning', 'shituo_recon', 'shituo_flask_event', 'shituo_cave_intro',
      'shituo_after_cave', 'shituo_buddha_arrives', 'shituo_final_intro', 'shituo_victory',
      'shituo_aftercare', 'shituo_cleared_end']
      .map(k => window.GAME_DATA.STORY_DIALOGUES[k])
      .filter(Boolean)
      .map(d => d.steps.map(s => s.text).join(''))
      .join('');
    // 受害者不写成笑料：不得出现嘲弄被掳者的措辞
    assert(!/活该|谁让你|装进去炖|下锅|开荤/.test(text),
      '狮驼岭对白不得出现嘲弄受害者或渲染吃人的措辞');
    // 三魔威压但不越线：收服走因果（归座/掌心/守门），不是杀戮狂欢
    const victory = window.GAME_DATA.STORY_DIALOGUES.shituo_victory;
    assert(/归座|掌心|守/.test(victory.steps.map(s => s.text).join('')),
      '三魔收服口径必须是归座/收于掌心/守门，而非处决');
    // 获救者以各自归家收束，不遗忘
    const aftercare = window.GAME_DATA.STORY_DIALOGUES.shituo_aftercare;
    assert(/各回各家|各报各信|名姓都记得/.test(aftercare.steps.map(s => s.text).join('')),
      '善后必须交代获救者名姓与归家安排，不得一笔带过');
  }

  // ── 5. 巡山线索题结构 ──
  {
    const recon = window.GAME_DATA.STORY_DIALOGUES.shituo_recon;
    const first = recon.steps.find(s => Array.isArray(s.options));
    assert(first && first.options.length === 3, '线索题必须提供三个选项');
    const wrongs = first.options.filter(o => typeof o.nextStep === 'number');
    const right = first.options.find(o => typeof o.action === 'function');
    assert(wrongs.length === 2, '线索题必须恰好两个错答分支（回看步骤）');
    assert(!!right && right.text.includes('阴阳二气瓶'), '正确分支必须答出阴阳二气瓶');

    // 错答分支指向回看步骤（步 3/4 的吐槽）
    const tauntSteps = [recon.steps[4], recon.steps[5]];
    assert(tauntSteps.every(s => /再想想|投错/.test(s.text)), '错答吐槽步骤必须引导重选');
    // 正确分支推进阶段
    assert(/shituo_cave/.test(right.action.toString()), '正确分支必须推进至 shituo_cave');
  }

  // ── 6. 卷轴八阶段（7 阶段） ──
  {
    const phases = ['shituo_arrived', 'shituo_recon', 'shituo_cave', 'shituo_plea',
      'shituo_final', 'shituo_restoring', 'shituo_cleared'];
    const old = app.storyPhase;
    try {
      for (const ph of phases) {
        app.storyPhase = ph;
        const info = app.getOrdealAndQuestInfo();
        assert(info && info.chapter === '第十八回 · 狮驼伏魔',
          `阶段 ${ph} 卷轴应属第十八回，实际「${info && info.chapter}」`);
        if (ph !== 'shituo_cleared') {
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
    const vis = (id, ph) => app.isNpcVisibleInStoryPhase(id, ph, 'shituoling');
    assert(vis('npc_taibai_warning', 'shituo_arrived') === true, '初到时太白报信可见');
    assert(vis('npc_taibai_warning', 'shituo_recon') === false, '应下探山后太白退场');
    assert(vis('npc_shituo_zuanfeng', 'shituo_recon') === true, '探山阶段小钻风可见');
    assert(vis('npc_shituo_zuanfeng', 'shituo_cave') === false, '问明底细后小钻风退场');
    assert(vis('npc_shituo_cavemouth', 'shituo_cave') === true, '洞口在对峙阶段可见');
    assert(vis('npc_shituo_cavemouth', 'shituo_final') === true, '洞口在决战阶段可见');
    assert(vis('npc_shituo_cavemouth', 'shituo_restoring') === false, '终战后洞口退场');
    assert(vis('npc_shituo_villager', 'shituo_restoring') === true, '善后阶段樵夫可见');
    assert(vis('npc_shituo_west_exit', 'shituo_restoring') === false,
      '善后阶段不得提前开放西行关口');
    assert(vis('npc_shituo_west_exit', 'shituo_cleared') === true, '终态西行关口应放行');
  }

  // ── 8. 战斗守卫（问明底细与佛援是开战前提） ──
  {
    const oldPhase = app.storyPhase;
    const oldBattle = app.currentBattle;
    const oldEvents = app.playerData && app.playerData.storyEvents;
    const oldStart = app.start2DBattle;
    let started = false;
    app.start2DBattle = () => { started = true; return true; };
    try {
      if (app.playerData) app.playerData.storyEvents = {};

      // 洞前战：未问明底细（未到 cave 阶段）不得开战
      app.storyPhase = 'shituo_arrived';
      started = false; app.triggerShituoCaveBattle();
      assert(started === false, '报信阶段不得开启洞前战');

      app.storyPhase = 'shituo_cave';
      started = false; app.triggerShituoCaveBattle();
      assert(started === true, '对峙阶段应能开启狮象决战');

      // 已胜不重复
      app.playerData.storyEvents.shituo_cave_won = true;
      started = false; app.triggerShituoCaveBattle();
      assert(started === false, '狮象已败不得重复开战');

      // 终战：未得佛援不得开战
      app.storyPhase = 'shituo_final';
      app.playerData.storyEvents = { shituo_cave_won: true };
      started = false; app.triggerShituoFinalBattle();
      assert(started === false, '未得如来应允不得开启终战');

      app.playerData.storyEvents.shituo_buddha_pledge = true;
      started = false; app.triggerShituoFinalBattle();
      assert(started === true, '佛光垂岭后应能挑战大鹏');

      // 已胜不重复
      app.playerData.storyEvents.shituo_boss_won = true;
      started = false; app.triggerShituoFinalBattle();
      assert(started === false, '大鹏已伏不得重复触发');
    } finally {
      app.start2DBattle = oldStart;
      app.storyPhase = oldPhase;
      app.currentBattle = oldBattle;
      if (app.playerData) app.playerData.storyEvents = oldEvents;
    }
  }

  // ── 9. 章节谢礼：原子入包、满包保留、领取即放行西行 ──
  {
    const fixture = Object.create(app);
    fixture.playerData = new window.Player({ level: 68 });
    fixture.playerData.storyEvents = { shituo_cave_won: true, shituo_boss_won: true };
    fixture.inventory = new window.Inventory();
    fixture.storyPhase = 'shituo_restoring';
    fixture.currentMapId = 'shituoling';
    fixture.updatePlayerHud = () => { };
    fixture.saveAutoProgress = () => ({ success: true });
    fixture.refreshMapNpcs = () => { };

    // 满包：装备格不足 → 拒绝且阶段不推进
    const fill = Array.from({ length: 36 }, (_, i) => ({ instanceId: 'fill_' + i, itemId: 'jinchuang_yao', count: 99 }));
    fixture.inventory = new window.Inventory(fill);
    fixture.inventory.maxSlots = 36;
    let fullBagMsg = null;
    const origShow = window.showGameMessage;
    window.showGameMessage = (msg) => { fullBagMsg = msg; };
    try {
      fixture.claimShituoChapterReward();
    } finally { window.showGameMessage = origShow; }
    assert(fixture.storyPhase === 'shituo_restoring' && fullBagMsg && fullBagMsg.includes('腾出'),
      '满包领取谢礼安全拦截，阶段保留可重试');

    // 腾格后领取：入包 + 阶段推进至 cleared
    fixture.inventory.slots.splice(0, 2);
    const silverBefore = fixture.playerData.silver;
    fixture.claimShituoChapterReward();
    assert(fixture.storyPhase === 'shituo_cleared',
      '领取谢礼后阶段推进至 shituo_cleared');
    assert(fixture.inventory.getItemCount('eq_peishi_shituo') === 1,
      '狮驼辟邪玉佩×1 实际入包');
    assert(fixture.playerData.silver === silverBefore + 12000,
      '谢礼银两 12000 到账');

    // 重复领取不重发
    const afterClaim = { silver: fixture.playerData.silver, cnt: fixture.inventory.getItemCount('eq_peishi_shituo') };
    fixture.storyPhase = 'shituo_restoring';
    fixture.claimShituoChapterReward();
    assert(fixture.playerData.silver === afterClaim.silver &&
      fixture.inventory.getItemCount('eq_peishi_shituo') === afterClaim.cnt,
      '重复领取绝不重复发放（claimStoryReward 幂等）');
    assert(fixture.storyPhase === 'shituo_cleared',
      '已领取状态下重复交互仍保持终态');
  }

  // ── 10. 大雷音寺门禁 ──
  {
    const code = require('fs').readFileSync(
      require('path').join(__dirname, 'js/app2d.js'), 'utf8');
    assert(code.includes("p.targetMap === 'daleiyinsi' && this.storyPhase !== 'shituo_cleared'"),
      '大雷音寺传送门必须挂狮驼终态门禁');
  }

  // ── 10.5 章回开幕分支已接入 ──
  {
    const code = require('fs').readFileSync(
      require('path').join(__dirname, 'js/app2d.js'), 'utf8');
    assert(code.includes("mapId === 'shituoling'") && code.includes("shownChapterSet.has('chapter_18')"),
      '章回开幕触发链必须包含狮驼岭分支（画卷展开不缺席）');
  }

  // ── 11. 主线唯一感叹号：狮驼七阶段目标全部有归属 ──
  {
    // 感叹号目标表闭包于 getQuestTargets 内，以源码断言防回归
    const code = require('fs').readFileSync(
      require('path').join(__dirname, 'js/app2d.js'), 'utf8');
    const targets = [
      ['shituo_arrived', 'npc_taibai_warning'], ['shituo_recon', 'npc_shituo_zuanfeng'],
      ['shituo_cave', 'npc_shituo_cavemouth'], ['shituo_plea', 'npc_shituo_cavemouth'],
      ['shituo_final', 'npc_shituo_cavemouth'], ['shituo_restoring', 'npc_shituo_villager'],
      ['shituo_cleared', 'npc_shituo_west_exit']
    ];
    for (const [ph, npc] of targets) {
      const needle = "'" + ph + "': '" + npc + "'";
      assert(code.includes(needle),
        '主线感叹号表必须包含 ' + ph + ' → ' + npc);
    }
  }
};
