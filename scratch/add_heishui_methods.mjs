import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');

const anchor = `  // === 支线任务：【苍茫三岭伏魔传】逻辑实现 ===`;

const block = `  // =========================================================================
  // 第十三回：黑水河·衡阳峪（鼍洁）
  // 阶段链：huoyun_cleared → heishui_arrived → heishui_captives_taken
  //        → heishui_scout_ready → heishui_aid_needed → heishui_moang_arrived
  //        → heishui_boss_ready → heishui_reward_pending → heishui_cleared
  // =========================================================================

  // 首次进入黑水河：只在上一章刚刚完结时初始化，重复入图/后续章节回访均不回退
  ensureHeishuiChapterStarted() {
    if (this.currentMapId !== 'heishuihe') return false;
    if (this.storyPhase !== 'huoyun_cleared') return false;
    this.storyPhase = 'heishui_arrived';
    this.refreshMapNpcs();
    this.saveAutoProgress();
    return true;
  }

  // 探战：水府守将（含两名水卒）
  triggerHeishuiScoutBattle() {
    if (this.storyPhase !== 'heishui_scout_ready') return;
    if (this.playerData.storyEvents?.heishui_scout_won) return;
    if (window.Dialogue) window.Dialogue.close();

    const guard = {
      id: 'boss_heishui_guard',
      name: '水府守将',
      appearance: 'yecha',
      modelId: 'yecha',
      level: 58,
      hp: 20000,
      maxHp: 20000,
      mp: 4000,
      maxMp: 4000,
      atk: 400,
      def: 205,
      matk: 300,
      mdef: 195,
      spd: 46,
      skills: ['连击', '飞沙走石']
    };
    const minions = [1, 2].map(i => ({
      id: 'mob_heishui_gate_' + i,
      name: '水府甲卒',
      appearance: 'shrimp',
      modelId: 'shrimp',
      level: 55,
      hp: 9000,
      maxHp: 9000,
      mp: 1500,
      maxMp: 1500,
      atk: 320,
      def: 165,
      spd: 42,
      skills: ['连击']
    }));

    this.start2DBattle([guard, ...minions], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.heishui_scout_won = true;
      // 先持久化阶段再排对白：离图导致对白取消也不能丢进展
      this.storyPhase = 'heishui_scout_ready';
      const reward = this.playerData.claimStoryReward('heishui_scout',
        { exp: 70000, silver: 15000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🔱 战利暂由河神代管，稍后可再来领取。', 'warning', 5000);
      }
      this.refreshMapNpcs();
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('heishui_scout_victory');
    });
  }

  // 首领战：鼍洁（黑水换甲：凝鳞偏物防 / 散流偏法防，每 2 次有效行动切换）
  triggerTuojieBattle() {
    if (this.storyPhase !== 'heishui_boss_ready') return;
    if (this.playerData.storyEvents?.heishui_boss_won) return;
    if (window.Dialogue) window.Dialogue.close();

    const tuojie = {
      id: 'boss_tuojie',
      name: '鼍洁·黑水大王',
      appearance: 'shuiyao',
      modelId: 'shuiyao',
      level: 60,
      hp: 46000,
      maxHp: 46000,
      mp: 9000,
      maxMp: 9000,
      atk: 430,
      def: 220,
      matk: 410,
      mdef: 215,
      spd: 50,
      skills: ['三昧真火', '飞沙走石', '金刚护体'],
      // 黑水换甲：不做蓄力爆发，只切换物理/法术防护侧重
      mechanicId: 'heishui_current_armor',
      mechanicConfig: {
        startStance: 'scaled',
        switchEvery: 2,
        scaledDefBonus: 0.45,   // 凝鳞：物防 +45%
        flowingMdefBonus: 0.45  // 散流：法防 +45%
      }
    };

    this.start2DBattle([tuojie], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.heishui_boss_won = true;
      this.storyPhase = 'heishui_boss_ready';
      const reward = this.playerData.claimStoryReward('heishui_boss',
        { exp: 110000, silver: 26000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🐊 战利暂由河神代管，稍后可再来领取。', 'warning', 5000);
      }
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('heishui_tuojie_defeated');
    });
  }

  // 章节奖励：站在 heishui_reward_pending 才有资格，幂等，满包保留入口
  claimHeishuiReward() {
    if (this.playerData.storyRewards?.heishui_chapter_reward === true) {
      // 已领过：补齐终态，不重复发放
      if (this.storyPhase === 'heishui_reward_pending') {
        this.storyPhase = 'heishui_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
      }
      return false;
    }
    if (this.storyPhase !== 'heishui_reward_pending') return false;

    const result = this.playerData.claimStoryReward('heishui_chapter_reward', {
      items: [
        { itemId: 'eq_nk_heishui', count: 1 },
        { itemId: 'xuelian_dan', count: 5 },
        { itemId: 'jiuzhuan_dan', count: 3 }
      ],
      exp: 60000,
      silver: 14000
    }, this.inventory);

    if (!result.success) {
      if (result.reason === 'already_claimed') {
        this.storyPhase = 'heishui_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
        return false;
      }
      window.showGameMessage('🌊 谢礼暂由河神保管，整理行囊后再来领取。', 'warning', 5000);
      return false;
    }

    this.storyPhase = 'heishui_cleared';
    this.refreshMapNpcs();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.Sound.playLevelUp();
    window.showGameMessage('🎉【黑水河功成】获赠【黑水辟水佩】、【雪莲丹】×5 与【九转还魂丹】×3！河神复位，师徒渡河。', 'success', 6000);
    return true;
  }

${anchor}`;

const c = s.split(anchor).length - 1;
if (c !== 1) { console.error(`锚点匹配 ${c} 处`); process.exit(1); }
s = s.replace(anchor, block);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已插入黑水河 App2D 方法');
