import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes('triggerChediFinalBattle')) { console.log('方法已存在'); process.exit(0); }

const anchor = `  // === 支线任务：【苍茫三岭伏魔传】逻辑实现 ===`;

const block = [
  '  // =========================================================================',
  '  // 第十四回：车迟国（虎力/鹿力/羊力三仙）',
  '  // 阶段链：heishui_cleared → chedi_arrival → chedi_audience → chedi_rain',
  '  //        → chedi_discern → chedi_final_trial → chedi_reward_pending → chedi_cleared',
  '  // =========================================================================',
  '',
  '  ensureChediChapterStarted() {',
  "    if (this.currentMapId !== 'chediguo') return false;",
  "    if (this.storyPhase !== 'heishui_cleared') return false;",
  "    this.storyPhase = 'chedi_arrival';",
  '    this.refreshMapNpcs();',
  '    this.saveAutoProgress();',
  '    return true;',
  '  }',
  '',
  '  // 终局战：三仙同场（虎力偏物、鹿力偏控、羊力偏法）',
  '  triggerChediFinalBattle() {',
  "    if (this.storyPhase !== 'chedi_final_trial') return;",
  "    if (this.playerData.storyEvents?.chedi_final_won) return;",
  '    if (window.Dialogue) window.Dialogue.close();',
  '',
  '    const tiger = {',
  "      id: 'boss_chedi_tiger', name: '虎力大仙', appearance: 'tiger', modelId: 'tiger',",
  '      level: 62, hp: 48000, maxHp: 48000, mp: 9000, maxMp: 9000,',
  '      atk: 450, def: 225, matk: 340, mdef: 210, spd: 51,',
  "      skills: ['舍生取义', '雷霆万钧']",
  '    };',
  '    const deer = {',
  "      id: 'boss_chedi_deer', name: '鹿力大仙', appearance: 'fox', modelId: 'fox',",
  '      level: 61, hp: 42000, maxHp: 42000, mp: 11000, maxMp: 11000,',
  '      atk: 380, def: 195, matk: 430, mdef: 235, spd: 48,',
  "      skills: ['定身咒', '乱魂咒', '三昧真火']",
  '    };',
  '    const sheep = {',
  "      id: 'boss_chedi_sheep', name: '羊力大仙', appearance: 'wolf', modelId: 'wolf',",
  '      level: 61, hp: 44000, maxHp: 44000, mp: 10000, maxMp: 10000,',
  '      atk: 400, def: 210, matk: 410, mdef: 220, spd: 50,',
  "      skills: ['飞沙走石', '金刚护体', '封印咒']",
  '    };',
  '',
  '    this.start2DBattle([tiger, deer, sheep], () => {',
  '      this.playerData.storyEvents = this.playerData.storyEvents || {};',
  '      this.playerData.storyEvents.chedi_final_won = true;',
  "      this.storyPhase = 'chedi_reward_pending';",
  "      const reward = this.playerData.claimStoryReward('chedi_final',",
  '        { exp: 120000, silver: 28000 }, this.inventory);',
  "      if (!reward.success && reward.reason !== 'already_claimed') {",
  "        window.showGameMessage('🐯 战利暂由国王代管，稍后可再来领取。', 'warning', 5000);",
  '      }',
  '      this.refreshMapNpcs();',
  '      this.updatePlayerHud();',
  '      this.saveAutoProgress();',
  '      window.Sound.playLevelUp();',
  "      this.scheduleStoryDialogue('chedi_victory');",
  '    });',
  '  }',
  '',
  '  // 章节奖励：幂等，满包保留入口',
  '  claimChediReward() {',
  "    if (this.playerData.storyRewards?.chedi_ch14_clear === true) {",
  "      if (this.storyPhase === 'chedi_reward_pending') {",
  "        this.storyPhase = 'chedi_cleared';",
  '        this.refreshMapNpcs();',
  '        this.saveAutoProgress();',
  '      }',
  '      return false;',
  '    }',
  "    if (this.storyPhase !== 'chedi_reward_pending') return false;",
  '',
  "    const result = this.playerData.claimStoryReward('chedi_ch14_clear', {",
  '      items: [',
  "        { itemId: 'eq_nk_chedi', count: 1 },",
  "        { itemId: 'xuelian_dan', count: 5 },",
  "        { itemId: 'jiuzhuan_dan', count: 3 }",
  '      ],',
  '      exp: 80000,',
  '      silver: 18000',
  '    }, this.inventory);',
  '',
  '    if (!result.success) {',
  "      if (result.reason === 'already_claimed') {",
  "        this.storyPhase = 'chedi_cleared';",
  '        this.refreshMapNpcs();',
  '        this.saveAutoProgress();',
  '        return false;',
  '      }',
  "      window.showGameMessage('📜 谢礼暂由国王保管，整理行囊后再来领取。', 'warning', 5000);",
  '      return false;',
  '    }',
  '',
  "    this.storyPhase = 'chedi_cleared';",
  '    this.refreshMapNpcs();',
  '    this.updatePlayerHud();',
  '    this.saveAutoProgress();',
  '    window.Sound.playLevelUp();',
  "    window.showGameMessage('🎉【车迟国功成】获赠【车迟伏仙佩】、【雪莲丹】×5 与【九转还魂丹】×3！西行关文通行资格已定。', 'success', 6000);",
  '    return true;',
  '  }',
  ''
].join('\n');

const c = s.split(anchor).length - 1;
if (c !== 1) { console.error(`锚点 ${c} 处`); process.exit(1); }
s = s.replace(anchor, block + anchor);

// 章节起点接入
if (!s.includes('this.ensureChediChapterStarted();')) {
  const from = '    this.ensureHeishuiChapterStarted();';
  const c2 = s.split(from).length - 1;
  if (c2 === 1) {
    s = s.replace(from, from + '\n    this.ensureChediChapterStarted();');
    console.log('✓ 章节起点已接入 loadMap');
  } else {
    console.error(`章节起点锚点 ${c2} 处`);
  }
}

if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已插入车迟国 App2D 方法');
