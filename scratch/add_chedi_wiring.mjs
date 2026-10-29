import fs from 'node:fs';
let n = 0;

// 1) NPC 插入 chediguo 地图
{
  const p = 'js/data/maps2d.js';
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('npc_chedi_monk')) { console.log('（NPC 已存在）'); }
  else {
    const k = s.indexOf('"chediguo": {');
    if (k < 0) { console.error('未找到 chediguo'); process.exit(1); }
    const npcsKey = s.indexOf('"npcs"', k);
    const arrOpen = s.indexOf('[', npcsKey);
    const npcs = `"npcs": [
      { "id": "npc_chedi_king", "name": "车迟国国王", "title": "【敬道之主】", "x": 896, "y": 352, "appearance": "dragon_king", "icon": "👑", "dialogueKey": "chedi_royal_terms" },
      { "id": "npc_chedi_monk", "name": "受役僧人", "title": "【被役沙门】", "x": 576, "y": 704, "appearance": "stone_monkey", "icon": "🧘", "dialogueKey": "chedi_monk_appeal" },
      { "id": "npc_chedi_tiger", "name": "虎力大仙", "title": "【黄毛虎力】", "x": 832, "y": 384, "appearance": "tiger", "icon": "🐯", "dialogueKey": "chedi_rain_trial" },
      { "id": "npc_chedi_deer", "name": "鹿力大仙", "title": "【白毛鹿力】", "x": 288, "y": 288, "appearance": "fox", "icon": "🦌", "dialogueKey": "chedi_discern_trial" },
      { "id": "npc_chedi_sheep", "name": "羊力大仙", "title": "【灰毛羊力】", "x": 928, "y": 512, "appearance": "wolf", "icon": "🐑", "dialogueKey": "chedi_final_challenge" }`;
    s = s.slice(0, npcsKey) + npcs + s.slice(arrOpen + 1);
    fs.writeFileSync(p, s, 'utf8');
    console.log('✓ chediguo NPC 已补'); n++;
  }
}

// 2) 小地图目标
{
  const p = 'js/engine/minimap.js';
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('chedi_arrival')) { console.log('（minimap 已存在）'); }
  else {
    const from = `    // 21. 苍茫三岭支线伏魔引导`;
    const to = `    // 20.3 车迟国（第十四回）
    if (mapId === 'chediguo') {
      const chediTargets = {
        chedi_arrival: { x: 576, y: 704, name: '受役僧人', desc: '查明僧人受役情况，接受申诉' },
        chedi_audience: { x: 896, y: 352, name: '车迟国国王', desc: '面见国王，约定停役与斗法条件' },
        chedi_rain: { x: 832, y: 384, name: '虎力大仙', desc: '依序验风云雷雨，赢下第一场祈雨' },
        chedi_discern: { x: 288, y: 288, name: '鹿力大仙', desc: '坐禅定心，隔板辨物' },
        chedi_final_trial: { x: 928, y: 512, name: '羊力大仙', desc: '破除邪术，三仙同场决战' },
        chedi_reward_pending: { x: 896, y: 352, name: '车迟国国王', desc: '领取谢礼与西行关文' }
      };
      const t = chediTargets[storyPhase];
      if (t) return t;
    }

    // 21. 苍茫三岭支线伏魔引导`;
    const c = s.split(from).length - 1;
    if (c !== 1) { console.error(`minimap 匹配 ${c} 处`); process.exit(1); }
    s = s.replace(from, to);
    fs.writeFileSync(p, s, 'utf8');
    console.log('✓ minimap chediguo'); n++;
  }
}

// 3) App2D 方法 + 章节起点
{
  const p = 'js/app2d.js';
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');

  if (s.includes('triggerChediFinalBattle')) { console.log('（App2D 方法已存在）'); }
  else {
    const anchor = `  // === 支线任务：【苍茫三岭伏魔传】逻辑实现 ===`;
    const block = `  // =========================================================================
  // 第十四回：车迟国（虎力/鹿力/羊力三仙）
  // 阶段链：heishui_cleared → chedi_arrival → chedi_audience → chedi_rain
  //        → chedi_discern → chedi_final_trial → chedi_reward_pending → chedi_cleared
  // =========================================================================

  ensureChediChapterStarted() {
    if (this.currentMapId !== 'chediguo') return false;
    if (this.storyPhase !== 'heishui_cleared') return false;
    this.storyPhase = 'chedi_arrival';
    this.refreshMapNpcs();
    this.saveAutoProgress();
    return true;
  }

  // 终局战：三仙同场（虎力偏物、鹿力偏控、羊力偏法）
  triggerChediFinalBattle() {
    if (this.storyPhase !== 'chedi_final_trial') return;
    if (this.playerData.storyEvents?.chedi_final_won) return;
    if (window.Dialogue) window.Dialogue.close();

    const tiger = {
      id: 'boss_chedi_tiger', name: '虎力大仙', appearance: 'tiger', modelId: 'tiger',
      level: 62, hp: 48000, maxHp: 48000, mp: 9000, maxMp: 9000,
      atk: 450, def: 225, matk: 340, mdef: 210, spd: 51,
      skills: ['舍生取义', '雷霆万钧']
    };
    const deer = {
      id: 'boss_chedi_deer', name: '鹿力大仙', appearance: 'fox', modelId: 'fox',
      level: 61, hp: 42000, maxHp: 42000, mp: 11000, maxMp: 11000,
      atk: 380, def: 195, matk: 430, mdef: 235, spd: 48,
      skills: ['定身咒', '乱魂咒', '三昧真火']
    };
    const sheep = {
      id: 'boss_chedi_sheep', name: '羊力大仙', appearance: 'wolf', modelId: 'wolf',
      level: 61, hp: 44000, maxHp: 44000, mp: 10000, maxMp: 10000,
      atk: 400, def: 210, matk: 410, mdef: 220, spd: 50,
      skills: ['飞沙走石', '金刚护体', '封印咒']
    };

    this.start2DBattle([tiger, deer, sheep], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.chedi_final_won = true;
      this.storyPhase = 'chedi_reward_pending';
      const reward = this.playerData.claimStoryReward('chedi_final',
        { exp: 120000, silver: 28000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🐯 战利暂由国王代管，稍后可再来领取。', 'warning', 5000);
      }
      this.refreshMapNpcs();
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('chedi_victory');
    });
  }

  // 章节奖励：幂等，满包保留入口
  claimChediReward() {
    if (this.playerData.storyRewards?.chedi_ch14_clear === true) {
      if (this.storyPhase === 'chedi_reward_pending') {
        this.storyPhase = 'chedi_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
      }
      return false;
    }
    if (this.storyPhase !== 'chedi_reward_pending') return false;

    const result = this.playerData.claimStoryReward('chedi_ch14_clear', {
      items: [
        { itemId: 'eq_nk_chedi', count: 1 },
        { itemId: 'xuelian_dan', count: 5 },
        { itemId: 'jiuzhuan_dan', count: 3 }
      ],
      exp: 80000,
      silver: 18000
    }, this.inventory);

    if (!result.success) {
      if (result.reason === 'already_claimed') {
        this.storyPhase = 'chedi_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
        return false;
      }
      window.showGameMessage('📜 谢礼暂由国王保管，整理行囊后再来领取。', 'warning', 5000);
      return false;
    }

    this.storyPhase = 'chedi_cleared';
    this.refreshMapNpcs();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.Sound.playLevelUp();
    window.showGameMessage('🎉【车迟国功成】获赠【车迟伏仙佩】、【雪莲丹】×5 与【九转还魂丹】×3！西行关文通行资格已定。', 'success', 6000);
    return true;
  }

${anchor}`;

    const c = s.split(anchor).length - 1;
    if (c !== 1) { console.error(`方法锚点 ${c} 处`); process.exit(1); }
    s = s.replace(anchor, block);
    n++;
  }

  // 章节起点接入 loadMap 完成处
  if (!s.includes('this.ensureChediChapterStarted();')) {
    const from = `    this.ensureHeishuiChapterStarted();`;
    const to = `    this.ensureHeishuiChapterStarted();
    this.ensureChediChapterStarted();`;
    const c = s.split(from).length - 1;
    if (c === 1) { s = s.replace(from, to); n++; console.log('✓ 章节起点已接入'); }
    else console.error(`章节起点锚点 ${c} 处`);
  }

  if (crlf) s = s.replace(/\n/g, '\r\n');
  fs.writeFileSync(p, s, 'utf8');
  if (n > 0 || !s.includes('triggerChediFinalBattle')) console.log('✓ App2D 车迟国方法');
}

console.log(`\n共 ${n} 处`);
