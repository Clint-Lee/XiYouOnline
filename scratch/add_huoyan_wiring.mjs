import fs from 'node:fs';
let n = 0;

// 1) App2D 方法
{
  const p = 'js/app2d.js';
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');

  if (s.includes('triggerHuoyanBullBattle')) { console.log('方法已存在'); }
  else {
    const anchor = `  // === 支线任务：【苍茫三岭伏魔传】逻辑实现 ===`;
    const L = [];
    const push = (l) => L.push(l);
    push('  // =========================================================================');
    push('  // 第十六回：八百里火焰山（铁扇公主 / 牛魔王）');
    push('  // 阶段链：tongtian_cleared → huoyan_arrived → huoyan_borrow_fan → huoyan_test_fan');
    push('  //        → huoyan_seek_true_fan → huoyan_confront_bull → huoyan_renew_request');
    push('  //        → huoyan_quench_fire → huoyan_cleared');
    push('  // 不新增第三类 Boss 机制；牛魔王战用普通单 Boss 配置。');
    push('  // =========================================================================');
    push('');
    push('  ensureHuoyanChapterStarted() {');
    push("    if (this.currentMapId !== 'huoyanshan') return false;");
    push("    if (this.storyPhase !== 'tongtian_cleared') return false;");
    push("    this.storyPhase = 'huoyan_arrived';");
    push('    this.refreshMapNpcs();');
    push('    this.saveAutoProgress();');
    push('    return true;');
    push('  }');
    push('');
    push('  // 摩云台对质牛魔王（普通单 Boss，无 hh_* 专属状态）');
    push('  triggerHuoyanBullBattle() {');
    push("    if (this.storyPhase !== 'huoyan_confront_bull') return;");
    push("    if (this.playerData.storyEvents?.huoyan_bull_won) return;");
    push('    if (window.Dialogue) window.Dialogue.close();');
    push('');
    push('    const bull = {');
    push("      id: 'boss_niumowang', name: '牛魔王', appearance: 'bull_demon', modelId: 'bull_demon',");
    push('      level: 68, hp: 56000, maxHp: 56000, mp: 14000, maxMp: 14000,');
    push('      atk: 480, def: 240, matk: 460, mdef: 235, spd: 55,');
    push("      skills: ['舍生取义', '雷霆万钧', '三昧真火']");
    push('    };');
    push('');
    push('    this.start2DBattle([bull], () => {');
    push('      this.playerData.storyEvents = this.playerData.storyEvents || {};');
    push('      this.playerData.storyEvents.huoyan_bull_won = true;');
    push("      this.storyPhase = 'huoyan_renew_request';");
    push("      const reward = this.playerData.claimStoryReward('huoyan_bull',");
    push('        { exp: 150000, silver: 35000 }, this.inventory);');
    push("      if (!reward.success && reward.reason !== 'already_claimed') {");
    push("        window.showGameMessage('🐂 战利暂由土地代管，稍后可再来领取。', 'warning', 5000);");
    push('      }');
    push('      this.refreshMapNpcs();');
    push('      this.updatePlayerHud();');
    push('      this.saveAutoProgress();');
    push('      window.Sound.playLevelUp();');
    push("      this.scheduleStoryDialogue('huoyan_renew_request');");
    push('    });');
    push('  }');
    push('');
    push('  // 章节奖励：幂等，满包保留入口（灭火事实不回滚）');
    push('  claimHuoyanReward() {');
    push("    if (this.playerData.storyRewards?.huoyan_chapter_reward === true) {");
    push("      if (this.storyPhase === 'huoyan_quench_fire') {");
    push("        this.storyPhase = 'huoyan_cleared';");
    push('        this.refreshMapNpcs();');
    push('        this.saveAutoProgress();');
    push('      }');
    push('      return false;');
    push('    }');
    push("    if (this.storyPhase !== 'huoyan_quench_fire') return false;");
    push('');
    push("    const result = this.playerData.claimStoryReward('huoyan_chapter_reward', {");
    push('      items: [');
    push("        { itemId: 'eq_nk_huoyan', count: 1 },");
    push("        { itemId: 'xuelian_dan', count: 5 },");
    push("        { itemId: 'jiuzhuan_dan', count: 3 }");
    push('      ],');
    push('      exp: 120000,');
    push('      silver: 26000');
    push('    }, this.inventory);');
    push('');
    push('    if (!result.success) {');
    push("      if (result.reason === 'already_claimed') {");
    push("        this.storyPhase = 'huoyan_cleared';");
    push('        this.refreshMapNpcs();');
    push('        this.saveAutoProgress();');
    push('        return false;');
    push('      }');
    push("      window.showGameMessage('📜 谢礼暂由百姓保管，整理行囊后再来领取。', 'warning', 5000);");
    push('      return false;');
    push('    }');
    push('');
    push("    this.storyPhase = 'huoyan_cleared';");
    push('    this.refreshMapNpcs();');
    push('    this.updatePlayerHud();');
    push('    this.saveAutoProgress();');
    push('    window.Sound.playLevelUp();');
    push("    window.showGameMessage('🎉【火焰山功成】获赠【断火芭蕉佩】、【雪莲丹】×5 与【九转还魂丹】×3！西行继续。', 'success', 6000);");
    push('    return true;');
    push('  }');
    push('');
    const c = s.split(anchor).length - 1;
    if (c !== 1) { console.error(`锚点 ${c}`); process.exit(1); }
    s = s.replace(anchor, L.join('\n') + anchor);
    console.log('✓ App2D 火焰山方法'); n++;
  }

  if (!s.includes('this.ensureHuoyanChapterStarted();')) {
    const from = '    this.ensureTongtianChapterStarted();';
    const c2 = s.split(from).length - 1;
    if (c2 === 1) {
      s = s.replace(from, from + '\n    this.ensureHuoyanChapterStarted();');
      console.log('✓ 章节起点已接入'); n++;
    } else console.error(`章节起点锚点 ${c2}`);
  }

  if (crlf) s = s.replace(/\n/g, '\r\n');
  fs.writeFileSync(p, s, 'utf8');
}

// 2) 小地图
{
  const p = 'js/engine/minimap.js';
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('huoyan_arrived')) { console.log('minimap 已存在'); }
  else {
    const from = `    // 21. 苍茫三岭支线伏魔引导`;
    const to = `    // 20.5 火焰山（第十六回）
    if (mapId === 'huoyanshan') {
      const hy = {
        huoyan_arrived: { x: 192, y: 672, name: '灾民代表', desc: '查明火焰山灾情' },
        huoyan_borrow_fan: { x: 384, y: 160, name: '铁扇公主', desc: '前往芭蕉洞借扇' },
        huoyan_test_fan: { x: 608, y: 416, name: '试扇火口', desc: '验明手中扇是真是假' },
        huoyan_seek_true_fan: { x: 384, y: 160, name: '铁扇公主', desc: '再赴芭蕉洞求取真扇' },
        huoyan_confront_bull: { x: 768, y: 192, name: '牛魔王', desc: '摩云台对质牛魔王' },
        huoyan_renew_request: { x: 384, y: 160, name: '铁扇公主', desc: '重新议借真扇' },
        huoyan_quench_fire: { x: 608, y: 576, name: '火根台', desc: '断绝火根，领取谢礼' }
      };
      const t = hy[storyPhase];
      if (t) return t;
    }

    // 21. 苍茫三岭支线伏魔引导`;
    const c = s.split(from).length - 1;
    if (c !== 1) { console.error(`minimap ${c}`); process.exit(1); }
    s = s.replace(from, to);
    fs.writeFileSync(p, s, 'utf8');
    console.log('✓ minimap 火焰山'); n++;
  }
}

// 3) 奖励物品
{
  const p = 'js/data/items.js';
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');
  if (s.includes('eq_nk_huoyan:')) { console.log('物品已存在'); }
  else {
    const anchor = '  // === 剧情战利特级神装 ===';
    const L = [];
    L.push('  // === 第十六回 火焰山战利 ===');
    L.push('  eq_nk_huoyan: {');
    L.push("    id: 'eq_nk_huoyan',");
    L.push("    name: '【火】断火芭蕉佩',");
    L.push("    type: 'equip',");
    L.push("    slot: 'necklace',");
    L.push("    element: 'fire',");
    L.push('    reqLevel: 65,');
    L.push("    icon: '🟠',");
    L.push('    price: 52000,');
    L.push("    quality: 'gold',");
    L.push('    attrs: { atk: 60, matk: 215, mdef: 180, mp: 900 },');
    L.push('    resists: { phy: 28, shesheng: 22, sanmei: 24 },');
    L.push('    counterShockRate: 0.14,');
    L.push("    desc: '【火属性挂链】以断绝火根的余烬与芭蕉叶脉共炼，佩戴后赋予主人五行【火】属性！烈焰归心，焚邪而不伤身。'");
    L.push('  },');
    L.push('');
    L.push('  // === 剧情战利特级神装 ===');
    const c = s.split(anchor).length - 1;
    if (c !== 1) { console.error(`物品锚点 ${c}`); process.exit(1); }
    s = s.replace(anchor, L.join('\n'));
    if (crlf) s = s.replace(/\n/g, '\r\n');
    fs.writeFileSync(p, s, 'utf8');
    console.log('✓ eq_nk_huoyan'); n++;
  }
}

console.log(`\n共 ${n} 处`);
