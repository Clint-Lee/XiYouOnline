import fs from 'node:fs';
const p = 'js/data/storyQuests.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes('huoyan_appeal:')) { console.log('已存在'); process.exit(0); }

const L = [];
const push = (l) => L.push(l);

push('  // =========================================================================');
push('  // 第十六回：八百里火焰山（铁扇公主 / 牛魔王）');
push('  // 阶段链：tongtian_cleared → huoyan_arrived → huoyan_borrow_fan → huoyan_test_fan');
push('  //        → huoyan_seek_true_fan → huoyan_confront_bull → huoyan_renew_request');
push('  //        → huoyan_quench_fire → huoyan_cleared');
push('  // 叙事红线：铁扇公主的恨有据；悟空须从取巧转向担责；和解不等于原谅。');
push('  // =========================================================================');
push('');

// 1. 灾情
push('  huoyan_appeal: {');
push('    steps: [');
push('      {');
push("        speaker: '灾民代表', speakerTitle: '【火焰山灾民】', speakerIcon: '🧑‍🌾',");
push("        text: '长老们来得不巧。这火焰山烧了六百年，井水是烫的，土是焦的，秋天种不下麦。去年逃了一半人，剩下的都是舍不得祖坟的。'");
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【齐天大圣】', speakerIcon: '🐒',");
push("        text: '老人家莫慌。俺老孙去翠云山芭蕉洞借铁扇公主的宝扇，扇它四十九下，火就灭了。'");
push('      },');
push('      {');
push("        speaker: '灾民代表', speakerTitle: '【欲言又止】', speakerIcon: '🧑‍🌾',");
push("        text: '铁扇公主……长老，老朽多句嘴。她那洞在西北山后，脾气比这山还硬。你们……好歹把话说软些。',");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push("          if (app.storyPhase !== 'huoyan_arrived') return;");
push("          app.storyPhase = 'huoyan_borrow_fan';");
push('          app.refreshMapNpcs();');
push('          app.saveAutoProgress();');
push("          window.showGameMessage('🪭 前往翠云山芭蕉洞借扇。', 'info', 4500);");
push('        }');
push('      }');
push('    ]');
push('  },');
push('');

// 2. 土地（火源）
push('  huoyan_land_talk: {');
push('    steps: [');
push('      {');
push("        speaker: '火焰山土地', speakerTitle: '【本境土地】', speakerIcon: '👴',");
push("        text: '小神拜见大圣。说起这山的来历……五百年前大圣在八卦炉里被煅了四十九日，出来时蹬倒了炉子，几块带火的砖落在此处，就成了这座火焰山。'");
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【一怔】', speakerIcon: '🐒',");
push("        text: '……是老孙。老孙只当是路障，没想到根子在自己脚下。'");
push('      },');
push('      {');
push("        speaker: '火焰山土地', speakerTitle: '【如实相告】', speakerIcon: '👴',");
push("        text: '小神只把来历说清。至于借扇、断根，还得看大圣与公主怎么谈。铁扇公主的心结，也在红孩儿身上。'");
push('      }');
push('    ]');
push('  },');
push('');

// 3. 借扇被拒（铁扇公主的恨有据）
push('  huoyan_borrow_fan: {');
push('    steps: [');
push('      {');
push("        speaker: '铁扇公主', speakerTitle: '【翠云山芭蕉洞】', speakerIcon: '👸',");
push("        text: '芭蕉洞不姓孙。出去。'");
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【捺住性子】', speakerIcon: '🐒',");
push("        text: '嫂子，俺今日不为红孩儿的事来。山下百姓没水喝，俺来借扇，灭了火便还。'");
push('      },');
push('      {');
push("        speaker: '铁扇公主', speakerTitle: '【字字发冷】', speakerIcon: '👸',");
push("        text: '没水喝？我儿在观音菩萨座下，连见一面都不能。你说得轻巧——我失去了什么，你赔得起吗？宝扇是我的，我不借。'");
push('      },');
push('      {');
push("        speaker: '威灵大将', speakerTitle: '【护法天将】', speakerIcon: '🛡️',");
push("        text: '公主，我等不为辩驳而来。红孩儿的事，是将军对不住你；山下百姓，与这段恩怨无关。可否容我们先谈百姓。'");
push('      },');
push('      {');
push("        speaker: '铁扇公主', speakerTitle: '【背过身去】', speakerIcon: '👸',");
push("        text: '……扇可以给你们一柄。是真是假，自己去试。我累了。',");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push("          if (app.storyPhase !== 'huoyan_borrow_fan') return;");
push("          app.storyPhase = 'huoyan_test_fan';");
push('          app.refreshMapNpcs();');
push('          app.saveAutoProgress();');
push("          window.showGameMessage('🪭 取得待验证的芭蕉扇，去试扇火口验明效用。', 'info', 4500);");
push('        }');
push('      }');
push('    ]');
push('  },');
push('');

// 4. 试扇（固定线索题）
push('  huoyan_test_fan: {');
push('    steps: [');
push('      {');
push("        speaker: '火焰山土地', speakerTitle: '【隔离试扇台】', speakerIcon: '👴',");
push("        text: '大圣，此处是隔离的小火口，四周无民无粮。真扇一扇，火势当减；若火势反增，便是假的。'");
push('        options: [');
push("          { text: '【照土地说的，扇一下试试】', nextStep: 1 },");
push("          { text: '【先问问怎么分辨真假】', nextStep: 2 }");
push('        ]');
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【火势反增】', speakerIcon: '🐒',");
push("        text: '不对——火比刚才还旺！老孙扇的是风，它给的是柴！'");
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【自嘲】', speakerIcon: '🐒',");
push("        text: '真扇火势当减，假扇越扇越大。这是她给的假扇——老孙认了，这亏吃在俺急着救火上。',");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push("          if (app.storyPhase !== 'huoyan_test_fan') return;");
push("          app.storyPhase = 'huoyan_seek_true_fan';");
push('          app.refreshMapNpcs();');
push('          app.saveAutoProgress();');
push("          window.showGameMessage('⚠️ 确认是假扇。再赴芭蕉洞——强取已不能解决问题。', 'warning', 5000);");
push('        }');
push('      },');
push('      {');
push("        speaker: '威灵大将', speakerTitle: '【提出正事】', speakerIcon: '🛡️',");
push("        text: '变化蒙骗，公主已经受过一次。这次不变她，不变牛魔王，我去跟她谈火源与担责。'");
push('      }');
push('    ]');
push('  },');
push('');

// 5. 骗扇与被反骗（事件串）
push('  huoyan_seek_true_fan: {');
push('    steps: [');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【变成牛魔王】', speakerIcon: '🐒',");
push("        text: '嫂嫂，是俺。莫哭，红孩儿的事俺们从长计议……扇先借俺，俺去灭了火就回。'");
push('      },');
push('      {');
push("        speaker: '铁扇公主', speakerTitle: '【交出真扇】', speakerIcon: '👸',");
push("        text: '……罢了。真扇拿去。灭了火，你我再谈孩儿的事。'");
push('      },');
push('      {');
push("        speaker: '猪八戒', speakerTitle: '【忽然警觉】', speakerIcon: '🐗',");
push("        text: '猴哥，那个八戒走路脚底板不着地——是牛魔王变的！'");
push('      },');
push('      {');
push("        speaker: '牛魔王', speakerTitle: '【现出本相】', speakerIcon: '🐂',");
push("        text: '孙悟空，你变化骗我妻，我便变化骗你。一报还一报。芭蕉扇，牛某带走了。'");
push('      },');
push('      {');
push("        speaker: '威灵大将', speakerTitle: '【不再追骗】', speakerIcon: '🛡️',");
push("        text: '夺回来也不解决问题。牛魔王，去摩云台把话说清——包括这座山的火，是谁的责任。',");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push("          if (app.storyPhase !== 'huoyan_seek_true_fan') return;");
push("          app.storyPhase = 'huoyan_confront_bull';");
push('          app.refreshMapNpcs();');
push('          app.saveAutoProgress();');
push("          window.showGameMessage('🐂 前往摩云台对质牛魔王。', 'warning', 4500);");
push('        }');
push('      }');
push('    ]');
push('  },');
push('');

// 6. 牛魔王遭遇战
push('  huoyan_bull_encounter: {');
push('    steps: [');
push('      {');
push("        speaker: '牛魔王', speakerTitle: '【摩云洞平天大圣】', speakerIcon: '🐂',");
push("        text: '芭蕉扇在牛某手上。你要救灾，我要护妻，各凭本事。'");
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【此战不为夺扇】', speakerIcon: '🐒',");
push("        text: '老孙这一战，不为抢扇，为止住这场没完的夺来夺去。'");
push('        options: [');
push("          { text: '【与牛魔王一战】', action: () => {");
push('            const app = window.App2D;');
push('            if (!app) return;');
push("            if (app.storyPhase !== 'huoyan_confront_bull') return;");
push('            if (window.Dialogue) window.Dialogue.close();');
push('            app.triggerHuoyanBullBattle();');
push('          } }');
push('        ]');
push('      }');
push('    ]');
push('  },');
push('');

// 7. 战后重新议借（悟空担责）
push('  huoyan_renew_request: {');
push('    steps: [');
push('      {');
push("        speaker: '牛魔王', speakerTitle: '【收手】', speakerIcon: '🐂',");
push("        text: '罢了。扇还她——她肯不肯，俺不替她答。'");
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【当众认责】', speakerIcon: '🐒',");
push("        text: '公主，老孙把话说明白。这山的火，根子落在俺老孙蹬倒八卦炉上；俺变作你丈夫骗扇，是俺失信。俺不要你原谅，俺只要你让百姓有条活路。'");
push('      },');
push('      {');
push("        speaker: '铁扇公主', speakerTitle: '【长久沉默】', speakerIcon: '👸',");
push("        text: '……我不是原谅你。红孩儿的事，一辈子不原谅。可山下的人没水喝，与他们无关。扇，借你。'");
push('      },');
push('      {');
push("        speaker: '铁扇公主', speakerTitle: '【亲手交扇】', speakerIcon: '👸',");
push("        text: '四十九下，一下不能少。灭了火，把扇还我。'");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push("          if (app.storyPhase !== 'huoyan_renew_request') return;");
push("          app.storyPhase = 'huoyan_quench_fire';");
push('          app.refreshMapNpcs();');
push('          app.saveAutoProgress();');
push("          window.showGameMessage('🪭 借得真扇，前往火根台断绝火根。', 'success', 4500);");
push('        }');
push('      }');
push('    ]');
push('  },');
push('');

// 8. 灭火与谢礼
push('  huoyan_quench_fire: {');
push('    steps: [');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【连扇四十九下】', speakerIcon: '🐒',");
push("        text: '一、二、三……四十九。火根断了，从今往后，这座山只是座山。'");
push('      },');
push('      {');
push("        speaker: '火焰山土地', speakerTitle: '【叩谢】', speakerIcon: '👴',");
push("        text: '小神代山下百姓，谢大圣、谢公主。'");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push("          if (app.storyPhase !== 'huoyan_quench_fire') return;");
push("          app.playerData.storyEvents = app.playerData.storyEvents || {};");
push('          app.playerData.storyEvents.huoyan_fire_extinguished = true;');
push('          app.refreshMapNpcs();');
push('          app.saveAutoProgress();');
push("          window.showGameMessage('🔥 火根已绝，可向百姓领取谢礼。', 'success', 5000);");
push('        }');
push('      }');
push('    ]');
push('  },');
push('');

// 9. 谢礼
push('  huoyan_reward: {');
push('    steps: [');
push('      {');
push("        speaker: '灾民代表', speakerTitle: '【全庄之谢】', speakerIcon: '🧑‍🌾',");
push("        text: '这点谢仪，是全村凑的。长老们若不嫌弃，过了山再回来坐坐——这回有的坐了。'");
push('        options: [');
push("          { text: '【领取谢礼，继续西行】', action: () => {");
push('            const app = window.App2D;');
push('            if (!app) return;');
push('            app.claimHuoyanReward();');
push('          } }');
push('        ]');
push('      }');
push('    ]');
push('  },');

const from = `  // =========================================================================
  // 支线任务：【苍茫三岭伏魔传】剧情与交互
  // =========================================================================`;
const c = s.split(from).length - 1;
if (c !== 1) { console.error(`锚点 ${c} 处`); process.exit(1); }
s = s.replace(from, L.join('\n') + '\n\n' + from);

// chapter_16
const chAnchor = `      triggerMap: 'tongtianhe',
      triggerPhase: 'tongtian_arrival'
    }
  };`;
const chBlock = `      triggerMap: 'tongtianhe',
      triggerPhase: 'tongtian_arrival'
    },
    'chapter_16': {
      id: 'chapter_16',
      chapterNum: '第十六回',
      title: '第十六回 · 火焰借扇',
      subtitle: '八百里火缘起八卦，四十九扇断焦根',
      seal: '断火还扇',
      triggerMap: 'huoyanshan',
      triggerPhase: 'huoyan_arrived'
    }
  };`;
const c2 = s.split(chAnchor).length - 1;
if (c2 === 1) { s = s.replace(chAnchor, chBlock); console.log('✓ chapter_16'); }
else console.error(`✗ chapter_16 锚点 ${c2}`);

// 修逗号
const badRe = /^(        text: '.*')\n(        (?:action|options):)/gm;
let fixed = 0;
s = s.replace(badRe, (_m, g1, g2) => { fixed++; return g1 + ',\n' + g2; });
console.log(`补逗号 ${fixed} 处`);

if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已插入火焰山对白');
