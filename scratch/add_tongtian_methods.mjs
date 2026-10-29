import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes('triggerTongtianIceBattle')) { console.log('方法已存在'); process.exit(0); }

const anchor = `  // === 支线任务：【苍茫三岭伏魔传】逻辑实现 ===`;

const block = [
  '  // =========================================================================',
  '  // 第十五回：八百里通天河（灵感大王）',
  '  // 阶段链：chedi_cleared → tongtian_arrival → tongtian_pledge',
  '  //        → tongtian_offer_ready → tongtian_ice_battle',
  '  //        → tongtian_reward_pending → tongtian_cleared',
  '  // =========================================================================',
  '',
  '  ensureTongtianChapterStarted() {',
  "    if (this.currentMapId !== 'tongtianhe') return false;",
  "    if (this.storyPhase !== 'chedi_cleared') return false;",
  "    this.storyPhase = 'tongtian_arrival';",
  '    this.refreshMapNpcs();',
  '    this.saveAutoProgress();',
  '    return true;',
  '  }',
  '',
  '  // 冰封河面之战：灵感大王 + 两名寒冰水卒',
  '  // 机制：姿态型「寒冰覆甲」——凝冰时物理防御提升，法术破冰有效',
  '  triggerTongtianIceBattle() {',
  "    if (this.storyPhase !== 'tongtian_ice_battle') return;",
  "    if (this.playerData.storyEvents?.tongtian_boss_won) return;",
  '    if (window.Dialogue) window.Dialogue.close();',
  '',
  '    const boss = {',
  "      id: 'boss_linggan', name: '灵感大王', appearance: 'shuiyao', modelId: 'shuiyao',",
  '      level: 64, hp: 52000, maxHp: 52000, mp: 12000, maxMp: 12000,',
  '      atk: 460, def: 230, matk: 450, mdef: 225, spd: 53,',
  "      skills: ['三昧真火', '飞沙走石', '定身咒'],",
  "      mechanicId: 'heishui_current_armor',",
  '      mechanicConfig: {',
  "        startStance: 'scaled',",
  '        switchEvery: 2,',
  '        scaledDefBonus: 0.45,',
  '        flowingMdefBonus: 0.45',
  '      }',
  '    };',
  '    const minions = [1, 2].map(i => ({',
  "      id: 'mob_tongtian_ice_' + i, name: '寒冰水卒', appearance: 'shrimp', modelId: 'shrimp',",
  '      level: 60, hp: 14000, maxHp: 14000, mp: 3000, maxMp: 3000,',
  '      atk: 400, def: 200, spd: 46, skills: ["连击"]',
  '    }));',
  '',
  '    this.start2DBattle([boss, ...minions], () => {',
  '      this.playerData.storyEvents = this.playerData.storyEvents || {};',
  '      this.playerData.storyEvents.tongtian_boss_won = true;',
  "      this.storyPhase = 'tongtian_reward_pending';",
  "      const reward = this.playerData.claimStoryReward('tongtian_boss',",
  '        { exp: 140000, silver: 32000 }, this.inventory);',
  "      if (!reward.success && reward.reason !== 'already_claimed') {",
  "        window.showGameMessage('🐟 战利暂由陈家庄代管，稍后可再来领取。', 'warning', 5000);",
  '      }',
  '      this.refreshMapNpcs();',
  '      this.updatePlayerHud();',
  '      this.saveAutoProgress();',
  '      window.Sound.playLevelUp();',
  "      this.scheduleStoryDialogue('tongtian_victory');",
  '    });',
  '  }',
  '',
  '  // 章节奖励：幂等，满包保留入口',
  '  claimTongtianReward() {',
  "    if (this.playerData.storyRewards?.tongtian_ch15_clear === true) {",
  "      if (this.storyPhase === 'tongtian_reward_pending') {",
  "        this.storyPhase = 'tongtian_cleared';",
  '        this.refreshMapNpcs();',
  '        this.saveAutoProgress();',
  '      }',
  '      return false;',
  '    }',
  "    if (this.storyPhase !== 'tongtian_reward_pending') return false;",
  '',
  "    const result = this.playerData.claimStoryReward('tongtian_ch15_clear', {",
  '      items: [',
  "        { itemId: 'eq_nk_tongtian', count: 1 },",
  "        { itemId: 'xuelian_dan', count: 5 },",
  "        { itemId: 'jiuzhuan_dan', count: 3 }",
  '      ],',
  '      exp: 100000,',
  '      silver: 22000',
  '    }, this.inventory);',
  '',
  '    if (!result.success) {',
  "      if (result.reason === 'already_claimed') {",
  "        this.storyPhase = 'tongtian_cleared';",
  '        this.refreshMapNpcs();',
  '        this.saveAutoProgress();',
  '        return false;',
  '      }',
  "      window.showGameMessage('📜 谢礼暂由陈家庄保管，整理行囊后再来领取。', 'warning', 5000);",
  '      return false;',
  '    }',
  '',
  "    this.storyPhase = 'tongtian_cleared';",
  '    this.refreshMapNpcs();',
  '    this.updatePlayerHud();',
  '    this.saveAutoProgress();',
  '    window.Sound.playLevelUp();',
  "    window.showGameMessage('🎉【通天河功成】获赠【通天镇水佩】、【雪莲丹】×5 与【九转还魂丹】×3！河路复通，东去有路。', 'success', 6000);",
  '    return true;',
  '  }',
  ''
].join('\n');

const c = s.split(anchor).length - 1;
if (c !== 1) { console.error(`锚点 ${c} 处`); process.exit(1); }
s = s.replace(anchor, block + anchor);

if (!s.includes('this.ensureTongtianChapterStarted();')) {
  const from = '    this.ensureChediChapterStarted();';
  const c2 = s.split(from).length - 1;
  if (c2 === 1) {
    s = s.replace(from, from + '\n    this.ensureTongtianChapterStarted();');
    console.log('✓ 章节起点已接入 loadMap');
  } else {
    console.error(`章节起点锚点 ${c2} 处`);
  }
}

if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已插入通天河 App2D 方法');
