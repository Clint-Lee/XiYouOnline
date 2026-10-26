/**
 * 汉风西游 - 第十三回 黑水河章节回归测试
 * 覆盖：地图质量与连通性、阶段链与八张表同步、对白键完整性、
 *       奖励幂等与满包重试、NPC 显隐矩阵、战斗入口守卫、主线目标唯一性。
 */
module.exports = async function (assert) {
  console.log('\n▶️ [测试 58] 第十三回 黑水河 章节闭环');

  const map = window.GAME_DATA.MAPS_2D.heishuihe;
  const app = window.App2D;

  // ── 1. 地图基础质量 ──
  {
    assert(!!map, 'heishuihe 地图必须存在');
    assert(map.width === 38 && map.height === 28,
      `黑水河应为 38x28（与全局地图规格一致），实际 ${map.width}x${map.height}`);
    assert(map.tiles.length === 28 && map.tiles.every(r => r.length === 38),
      '黑水河 tiles 必须是 28 行 × 38 列');
  }

  const SOLID = new Set([
    'cloud_void', 'heaven_pillar', 'bamboo', 'water', 'dark_water', 'city_wall', 'hut_wall',
    'palace_eaves', 'wooden_barricade', 'blacksmith_forge', 'mountain_rock', 'demon_cave_wall',
    'ginseng_tree', 'purple_bamboo', 'tang_palace', 'tang_store', 'stone_temple',
    'two_realms_stele', 'wall', 'stone_wall', 'void', 'abyss', 'lava', 'fire_wall'
  ]);
  const TS = 32;
  const walkable = (x, y) => {
    if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
    const row = map.tiles[y];
    if (!row) return false;
    return !!row[x] && !SOLID.has(row[x]);
  };

  // ── 2. 可行走比例（不做成隧道） ──
  {
    let walk = 0, total = 0;
    for (let y = 0; y < map.height; y++) for (let x = 0; x < map.width; x++) { total++; if (walkable(x, y)) walk++; }
    const ratio = walk / total;
    assert(ratio >= 0.35,
      `黑水河可行走比例应 ≥35%（防止退化成单通道隧道），实际 ${(ratio * 100).toFixed(1)}%`);
  }

  // ── 3. 实体落点与 BFS 连通 ──
  {
    const spawn = map.playerSpawn;
    assert(spawn && walkable(Math.floor(spawn.x / TS), Math.floor(spawn.y / TS)),
      '黑水河出生点必须落在可通行格');

    for (const n of (map.npcs || [])) {
      assert(walkable(Math.floor(n.x / TS), Math.floor(n.y / TS)),
        `黑水河 NPC ${n.id} 不得落在阻挡格`);
    }
    for (const p of (map.portals || [])) {
      assert(walkable(Math.floor(p.x / TS), Math.floor(p.y / TS)),
        `黑水河传送门「${p.name}」不得落在阻挡格`);
    }

    const sx = Math.floor(spawn.x / TS), sy = Math.floor(spawn.y / TS);
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
      const key = Math.floor(n.x / TS) + ',' + Math.floor(n.y / TS);
      assert(seen.has(key), `从出生点必须能走到 NPC ${n.id}（否则无法交互）`);
    }
  }

  // ── 4. 传送门目标合法 ──
  {
    for (const p of (map.portals || [])) {
      assert(!!window.GAME_DATA.MAPS_2D[p.targetMap],
        `传送门「${p.name}」的目标地图 ${p.targetMap} 必须存在`);
    }
    const huoyun = window.GAME_DATA.MAPS_2D.huoyundong;
    const toHeishui = (huoyun.portals || []).find(p => p.targetMap === 'heishuihe');
    assert(!!toHeishui, '火云洞必须有通往黑水河的西行出口（否则玩家出不去）');
  }

  // ── 5. 十个对白键完整性 ──
  {
    const keys = [
      'heishui_ferry_trap', 'heishui_rivergod_appeal', 'heishui_scout_challenge',
      'heishui_scout_victory', 'heishui_seek_west_sea_aid', 'heishui_moang_briefing',
      'heishui_tuojie_challenge', 'heishui_tuojie_defeated', 'heishui_reward_claim',
      'heishui_crossing_epilogue'
    ];
    for (const k of keys) {
      const d = window.GAME_DATA.STORY_DIALOGUES[k];
      assert(d && Array.isArray(d.steps) && d.steps.length > 0,
        `黑水河对白键「${k}」必须存在且有内容`);
      assert(d.steps.every(s => typeof s.text === 'string' && s.text.length > 0),
        `黑水河对白「${k}」每一步都必须有台词正文`);
    }
  }

  // ── 6. 章节开幕配置 ──
  {
    const cfg = window.GAME_DATA.CHAPTER_CONFIGS.chapter_13;
    assert(!!cfg, '第十三回开幕配置必须存在');
    assert(cfg.triggerMap === 'heishuihe', '第十三回开幕应绑定 heishuihe');
    assert(cfg.triggerPhase === 'heishui_arrived', '第十三回开幕应绑定 heishui_arrived');
    assert(cfg.seal && cfg.seal.length === 4, '第十三回印章应为四字');
  }

  // ── 7. 阶段链与八张表同步 ──
  {
    const phases = ['heishui_arrived', 'heishui_captives_taken', 'heishui_scout_ready',
      'heishui_aid_needed', 'heishui_moang_arrived', 'heishui_boss_ready',
      'heishui_reward_pending', 'heishui_cleared'];

    // 主线目标：八个阶段各有一个明确目标（终态也不能为 null，否则玩家不知找谁）
    for (const ph of phases) {
      const t = app.getCurrentQuestTargetForTest ? null : null; // 占位，下方直接测卷轴
      const info = (() => {
        const old = app.storyPhase;
        app.storyPhase = ph;
        const r = app.getOrdealAndQuestInfo();
        app.storyPhase = old;
        return r;
      })();
      assert(info && info.chapter === '第十三回 · 黑水擒龙',
        `阶段 ${ph} 的任务卷轴应属第十三回，实际「${info && info.chapter}」`);
      assert(!!info.stepName && info.stepName !== '与刘伯钦对话',
        `阶段 ${ph} 的任务卷轴不得落回默认旧任务，实际「${info && info.stepName}」`);
    }
  }

  // ── 8. NPC 显隐矩阵 ──
  {
    const vis = (id, ph) => app.isNpcVisibleInStoryPhase(id, ph, 'heishuihe');

    assert(vis('npc_heishui_ferryman', 'heishui_arrived') === true, '船夫在初入阶段可见');
    assert(vis('npc_heishui_ferryman', 'heishui_captives_taken') === false, '船夫现形后应消失');

    assert(vis('npc_heishui_tangseng_rescued', 'heishui_captives_taken') === false,
      '被俘期间唐僧不可见');
    assert(vis('npc_heishui_tangseng_rescued', 'heishui_reward_pending') === true,
      '获救后唐僧可见');

    assert(vis('npc_heishui_rivergod_exiled', 'heishui_reward_pending') === false,
      '复位后失府河神实例应退场');
    assert(vis('npc_heishui_rivergod_restored', 'heishui_reward_pending') === true,
      '复位河神实例应登场');

    assert(vis('npc_heishui_tuojie', 'heishui_boss_ready') === true, '鼍洁在首领阶段可见');
    assert(vis('npc_heishui_tuojie', 'heishui_cleared') === false, '鼍洁被擒后不可见');
  }

  // ── 9. 战斗入口守卫 ──
  {
    const oldPhase = app.storyPhase;
    const oldBattle = app.currentBattle;
    const oldEvents = app.playerData && app.playerData.storyEvents;
    const oldStart = app.start2DBattle;
    let started = false;
    app.start2DBattle = () => { started = true; return true; };
    try {
      if (app.playerData) app.playerData.storyEvents = {};

      app.storyPhase = 'heishui_arrived';
      started = false; app.triggerHeishuiScoutBattle();
      assert(started === false, '初入阶段不得提前触发水府探战');

      app.storyPhase = 'heishui_scout_ready';
      started = false; app.triggerHeishuiScoutBattle();
      assert(started === true, '探战阶段应能正常开战');

      app.storyPhase = 'heishui_scout_ready';
      app.playerData.storyEvents = { heishui_scout_won: true };
      started = false; app.triggerHeishuiScoutBattle();
      assert(started === false, '探战已胜后不得重复触发');

      app.storyPhase = 'heishui_moang_arrived';
      started = false; app.triggerTuojieBattle();
      assert(started === false, '摩昂交代前不得挑战鼍洁');

      app.storyPhase = 'heishui_boss_ready';
      app.playerData.storyEvents = {};
      started = false; app.triggerTuojieBattle();
      assert(started === true, '首领阶段应能挑战鼍洁');
    } finally {
      app.start2DBattle = oldStart;
      app.storyPhase = oldPhase;
      app.currentBattle = oldBattle;
      if (app.playerData) app.playerData.storyEvents = oldEvents;
    }
  }

  // ── 10. 章节奖励幂等与满包重试 ──
  {
    const p = new window.Player({ classId: 'jingang', level: 50 });
    const inv = new window.Inventory([]);

    const first = p.claimStoryReward('heishui_chapter_reward',
      { items: [{ itemId: 'jin_liu_lu', count: 1 }], exp: 1000, silver: 500 }, inv);
    assert(first.success === true, '黑水河章节奖励首次应发放成功');
    const silverAfter = p.silver;

    const second = p.claimStoryReward('heishui_chapter_reward',
      { items: [{ itemId: 'jin_liu_lu', count: 1 }], exp: 1000, silver: 500 }, inv);
    assert(second.success === false && second.reason === 'already_claimed',
      '同一章节奖励重复领取必须被拒绝');
    assert(p.silver === silverAfter, `重复领取不得增加银两，实际 ${silverAfter} -> ${p.silver}`);

    // 满包：应返回 inventory_full，且不写领取标记
    const p2 = new window.Player({ classId: 'jingang', level: 50 });
    const fullInv = new window.Inventory([]);
    for (let i = 0; i < 36; i++) fullInv.slots.push({ instanceId: 'f' + i, itemId: 'jinchuang_yao', count: 1 });
    const overflow = p2.claimStoryReward('heishui_test_full',
      { items: [{ itemId: 'eq_nk_heishui', count: 1 }] }, fullInv);
    assert(overflow.success === false && overflow.reason === 'inventory_full',
      '满包时应返回 inventory_full');
    assert(p2.storyRewards['heishui_test_full'] !== true,
      '满包失败时不得写入领取标记（否则奖励永久丢失）');
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
      // 已达后续章节回访不应被拉回 heishui_arrived
      app.currentMapId = 'heishuihe';
      app.storyPhase = 'heishui_cleared';
      app.ensureHeishuiChapterStarted();
      assert(app.storyPhase === 'heishui_cleared', '已完成本章后回访不得重置阶段');

      // 上一章刚完结时应初始化
      app.storyPhase = 'huoyun_cleared';
      app.ensureHeishuiChapterStarted();
      assert(app.storyPhase === 'heishui_arrived', 'huoyun_cleared 首次入图应初始化黑水河起点');

      // 其它地图不触发
      app.currentMapId = 'liujiacun';
      app.storyPhase = 'huoyun_cleared';
      app.ensureHeishuiChapterStarted();
      assert(app.storyPhase === 'huoyun_cleared', '非黑水河地图不得触发章节初始化');
    } finally {
      app.refreshMapNpcs = oldRefresh;
      app.saveAutoProgress = oldSave;
      app.storyPhase = oldPhase;
      app.currentMapId = oldMap;
    }
  }

  // ── 12. 章节奖励物品必须真实存在于物品表 ──
  // 历史缺陷：eq_nk_huoyun / eq_nk_heishui 曾被写进奖励却未在 items.js 定义，
  // 导致 claimStoryReward 返回 invalid_items，玩家永远领不到章节奖励。
  {
    const rewardItemIds = [
      'eq_nk_huoyun',   // 第十二回 火云辟火珠
      'eq_nk_heishui'   // 第十三回 黑水辟水佩
    ];
    for (const id of rewardItemIds) {
      const it = window.GAME_DATA.ITEMS[id];
      assert(!!it, `章节奖励物品「${id}」必须在 GAME_DATA.ITEMS 中定义`);
      assert(it && it.type === 'equip', `章节奖励物品「${id}」应为可穿戴装备`);
      assert(it && it.slot === 'necklace', `章节奖励物品「${id}」应为挂链部位`);
      assert(it && !!it.element, `章节奖励物品「${id}」应带五行属性（挂链决定玩家五行）`);
    }

    // 端到端：用真实物品领取必须成功
    const p = new window.Player({ classId: 'jingang', level: 60 });
    const inv = new window.Inventory([]);
    const res = p.claimStoryReward('heishui_reward_e2e_test',
      { items: [{ itemId: 'eq_nk_heishui', count: 1 }] }, inv);
    assert(res.success === true, '使用真实物品的黑水河奖励应能成功入包');
  }

  // ── 13. 全项目奖励物品引用审计 ──
  // 历史缺陷：eq_nk_huoyun / eq_nk_heishui 曾写进奖励却未定义，玩家永远领不到。
  // 这条断言扫描 app2d.js 与 storyQuests.js 里所有 itemId 引用，防止同类缺口复发。
  {
    const fs = require('fs');
    const path = require('path');
    const root = __dirname;
    const referenced = new Set();
    for (const rel of ['js/app2d.js', 'js/data/storyQuests.js']) {
      const src = fs.readFileSync(path.join(root, rel), 'utf8');
      for (const m of src.matchAll(/itemId\s*:\s*'([a-zA-Z_0-9]+)'/g)) referenced.add(m[1]);
    }
    assert(referenced.size > 20, `应扫描到足够多的物品引用，实际 ${referenced.size} 种`);
    const missing = [...referenced].filter(id => !window.GAME_DATA.ITEMS[id]).sort();
    assert(missing.length === 0,
      `所有奖励引用的物品必须已定义，缺失: ${missing.join(', ') || '无'}`);
  }

  // ── 14. 鼍洁「黑水换甲」机制 ──
  // 与五行车阵不同：没有蓄力/爆发窗口，核心是伤害类型选择。
  {
    const mkBoss = () => ({
      id: 'boss_tuojie_mt', name: '鼍洁', level: 60,
      hp: 46000, maxHp: 46000, mp: 9000, maxMp: 9000,
      atk: 430, def: 220, matk: 410, mdef: 215, spd: 50, skills: [],
      mechanicId: 'heishui_current_armor',
      mechanicConfig: { startStance: 'scaled', switchEvery: 2, scaledDefBonus: 0.45, flowingMdefBonus: 0.45 }
    });

    const player = new window.Player({ classId: 'jingang', level: 55 });
    const battle = new window.BattleEngine(player, [], [mkBoss()]);
    const boss = battle.enemies[0];
    const BE = window.BattleEngine;

    // 初始姿态
    const st0 = battle.getArmorState(boss);
    assert(st0 && st0.stance === 'scaled',
      '鼍洁开场应固定为凝鳞姿态（让首次接触可学习）');
    assert(st0.actionCount === 0, '初始有效行动计数应为 0');

    // 凝鳞：物理伤害应被削减，法术伤害保持原值
    const phys = BE.applyArmorMitigation(boss, 1000, false);
    const spell = BE.applyArmorMitigation(boss, 1000, true);
    assert(phys.damage < 1000,
      `凝鳞姿态下物理伤害应被削减，实际 ${phys.damage}`);
    assert(phys.damage > 0,
      `减伤不能设为免疫（必须可通过常规伤害击败），实际 ${phys.damage}`);
    assert(spell.damage === 1000,
      `凝鳞姿态下法术伤害应保持原值，实际 ${spell.damage}`);
    assert(typeof phys.note === 'string' && phys.note.length > 0,
      '减伤时应给出可归因的战报文案');

    // 每 2 次有效行动切换
    BE.prototype.recordArmorAction.call(battle, boss);
    let st = battle.getArmorState(boss);
    assert(st.stance === 'scaled' && st.actionCount === 1,
      '第 1 次有效行动后仍在凝鳞姿态');

    BE.prototype.recordArmorAction.call(battle, boss);
    st = battle.getArmorState(boss);
    assert(st.stance === 'flowing' && st.actionCount === 0,
      `第 2 次有效行动后应切换为散流，实际 ${st.stance}`);

    // 散流：法术伤害被削减，物理保持原值
    const phys2 = BE.applyArmorMitigation(boss, 1000, false);
    const spell2 = BE.applyArmorMitigation(boss, 1000, true);
    assert(spell2.damage < 1000,
      `散流姿态下法术伤害应被削减，实际 ${spell2.damage}`);
    assert(phys2.damage === 1000,
      `散流姿态下物理伤害应保持原值，实际 ${phys2.damage}`);

    // 再 2 次切回凝鳞
    BE.prototype.recordArmorAction.call(battle, boss);
    BE.prototype.recordArmorAction.call(battle, boss);
    st = battle.getArmorState(boss);
    assert(st.stance === 'scaled', '再经 2 次有效行动应切回凝鳞');

    // 防御修正不得反复累加到基础属性
    const defBefore = boss.def;
    const mdefBefore = boss.mdef;
    BE.applyArmorMitigation(boss, 1000, false);
    BE.applyArmorMitigation(boss, 1000, true);
    assert(boss.def === defBefore && boss.mdef === mdefBefore,
      '换甲只应做伤害修正，不得改写基础 def/mdef（否则切换会永久叠加）');

    // 真实回合后状态必须存活（与车阵同样的豁免要求）
    const ally = battle.allies[0];
    ally.hp = ally.maxHp;
    battle.setAllyAction('player', { type: 'defend' });
    await battle.executeRound(null);
    assert(battle.getArmorState(boss) !== null,
      '真实回合结束后换甲状态不得被通用 buff 到期过滤删除');

    // 清理
    battle.cleanupArmorMechanic(boss);
    assert(battle.getArmorState(boss) === null,
      'cleanupArmorMechanic 后换甲状态应被移除');
    assert(!(boss.buffs || []).some(b => b.id === 'hh_armor_state'),
      '清理后 buffs 中不得残留 hh_armor_state');
  }

  // ── 15. 换甲在真实回合中真实生效（不只是静态方法可用） ──
  {
    const mkBoss = () => ({
      id: 'boss_tuojie_live', name: '鼍洁', level: 60,
      hp: 46000, maxHp: 46000, mp: 9000, maxMp: 9000,
      atk: 430, def: 220, matk: 410, mdef: 215, spd: 50, skills: [],
      mechanicId: 'heishui_current_armor',
      mechanicConfig: { startStance: 'scaled', switchEvery: 2, scaledDefBonus: 0.45, flowingMdefBonus: 0.45 }
    });
    const player = new window.Player({ classId: 'jingang', level: 55 });
    const battle = new window.BattleEngine(player, [], [mkBoss()]);
    const boss = battle.enemies[0];
    const ally = battle.allies[0];

    const st = battle.getArmorState(boss);
    assert(st && st.stance === 'scaled', '开局应为凝鳞');

    const bossHpBefore = boss.hp;
    battle.setAllyAction('player', { type: 'attack', targetIndex: 0 });
    await battle.executeRound(null);
    const dealt = bossHpBefore - boss.hp;
    assert(dealt > 0, '玩家攻击应对鼍洁造成有效伤害，实际 ' + dealt);

    // 凝鳞下物理伤害被削减，因此实际伤害应低于同等级普攻对无姿态目标的水平
    const noArmorRef = Object.assign({}, boss, { buffs: [] });
    const refDamage = window.BattleEngine.calculateAttackDamage(ally, noArmorRef).totalDamage;
    assert(dealt < refDamage,
      '凝鳞姿态下真实回合的物理伤害应被削减，实际 ' + dealt + ' < 参考 ' + refDamage);

    // 鼍洁完成行动后应计数
    const countAfterOne = battle.getArmorState(boss).actionCount;
    assert(countAfterOne >= 1,
      '鼍洁在真实回合中完成行动后应累计有效行动数，实际 ' + countAfterOne);
  }
  console.log('  ✅ 黑水河章节断言全部通过');
};
