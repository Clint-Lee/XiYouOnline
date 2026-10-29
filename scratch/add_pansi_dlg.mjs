import fs from 'node:fs';
const p = 'js/data/storyQuests.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes('pansi_spring:')) { console.log('已存在'); process.exit(0); }

const L = [];
const push = (l) => L.push(l);

push('  // =========================================================================');
push('  // 第十七回：盘丝岭盘丝洞（七女妖 / 黄花观百眼魔君）');
push('  // 阶段链：huoyan_cleared → pansi_arrived → pansi_webbound → pansi_huanghua');
push('  //        → pansi_poisoned → pansi_seeking_rooster → pansi_breaking_light');
push('  //        → pansi_restoring → pansi_cleared');
push('  // 叙事红线（双重责任）：八戒越界必须担责；蜘蛛精绑缚伤人不因越界获得正当性。');
push('  // 改编口径：破光靠昴日星官两次啼鸣（原著为毗蓝婆绣花针），悟空中毒茶。');
push('  // =========================================================================');
push('');

// 1. 泉边
push('  pansi_spring: {');
push('    steps: [');
push('      {');
push("        speaker: '唐三藏', speakerTitle: '【止步】', speakerIcon: '🧘',");
push("        text: '泉边有人。泉边有人，便应止步；未得应允，不可近前。八戒，问路可以，莫要靠近。'");
push('      },');
push('      {');
push("        speaker: '猪八戒', speakerTitle: '【自有道理】', speakerIcon: '🐗',");
push("        text: '师父放心，俺老猪变条鲇鱼，水底下贴着石头走，谁能瞧见？问清路便上来。'");
push('      },');
push('      {');
push("        speaker: '盘丝七女妖', speakerTitle: '【濯垢泉边】', speakerIcon: '🕷️',");
push("        text: '水底下那位，请你上来。这是我们姊妹的泉，不是你家池塘。'");
push('      },');
push('      {');
push("        speaker: '盘丝七女妖', speakerTitle: '【丝起】', speakerIcon: '🕷️',");
push("        text: '好言请了你不听——那便留下。这泉边的规矩，不是只有你们会立。'");
push('      },');
push('      {');
push("        speaker: '唐三藏', speakerTitle: '【上前制止】', speakerIcon: '🧘',");
push("        text: '八戒越界，是他该认。可扣人、伤人，也须止。先放人，随后我们说清。',");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push("          if (app.storyPhase !== 'pansi_arrived') return;");
push("          app.storyPhase = 'pansi_webbound';");
push('          app.refreshMapNpcs();');
push('          app.saveAutoProgress();');
push("          window.showGameMessage('🕸️ 唐僧制止时同被扣下。先观察主缚与承重丝，再救人。', 'warning', 5000);");
push('        }');
push('      }');
push('    ]');
push('  },');
push('');

// 2. 解缚线索题
push('  pansi_unbind: {');
push('    steps: [');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【细察丝洞】', speakerIcon: '🐒',");
push("        text: '师父、八戒都吊在主缚上。老孙瞧明白了——那七根粗丝是主缚，细丝是牵绊；承重的在东南角那根老丝，断它则主缚自松。'");
push('        options: [');
push("          { text: '【一把火烧了这洞】', nextStep: 2 },");
push("          { text: '【断东南角那根承重老丝】', nextStep: 1 },");
push("          { text: '【为何不能直接烧】', nextStep: 3 }");
push('        ]');
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【救出二人】', speakerIcon: '🐒',");
push("        text: '着！承重丝一断，主缚全松。师父、八戒，下来吧——慢着，八戒身上有勒伤，莫乱挣。',");
push('        options: [');
push('          { text: \'【与盘丝七女妖一战】\', action: () => {');
push('            const app = window.App2D;');
push('            if (!app) return;');
push("            if (app.storyPhase !== 'pansi_webbound') return;");
push('            if (window.Dialogue) window.Dialogue.close();');
push('            app.triggerPansiSpiderBattle();');
push('          } }');
push('        ]');
push('      },');
push('      {');
push("        speaker: '沙僧', speakerTitle: '【拦住】', speakerIcon: '🌊',");
push("        text: '大师兄，不可。火一起，洞里还有没有别的被缚住的人，咱们一个都不知道。'");
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【讲明道理】', speakerIcon: '🐒',");
push("        text: '对。先看清主缚在哪、洞里还有没有别人，再动手。救人不是图痛快。'");
push('      }');
push('    ]');
push('  },');
push('');

// 3. 解缚后（八戒担责）
push('  pansi_after_unbound: {');
push('    steps: [');
push('      {');
push("        speaker: '猪八戒', speakerTitle: '【低头认责】', speakerIcon: '🐗',");
push("        text: '师父，俺老猪认。是我先越了界——不能因为她们是妖，就当俺没做错。'");
push('      },');
push('      {');
push("        speaker: '唐三藏', speakerTitle: '【不替他扛】', speakerIcon: '🧘',");
push("        text: '你认，是你的事。她们扣人、伤人，也须有个交代——两笔账，各算各的。'");
push('      },');
push('      {');
push("        speaker: '猪八戒', speakerTitle: '【伤处作痛】', speakerIcon: '🐗',");
push("        text: '这丝上的勒伤倒还罢了，只是里头有毒，发冷。得找个懂医理的瞧瞧。'");
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【提议求援】', speakerIcon: '🐒',");
push("        text: '前头有座黄花观，观主据说通医理。去求一副解毒的药——只求药，不提防。',");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push("          if (app.storyPhase !== 'pansi_huanghua') return;");
push('          app.refreshMapNpcs();');
push('          app.saveAutoProgress();');
push("          window.showGameMessage('🏯 八戒有蛛毒伤势，前往黄花观求解毒之法。', 'info', 4500);");
push('        }');
push('      }');
push('    ]');
push('  },');
push('');

// 4. 黄花观 / 毒茶
push('  pansi_huanghua: {');
push('    steps: [');
push('      {');
push("        speaker: '黄花观主', speakerTitle: '【殷勤相待】', speakerIcon: '👁️',");
push("        text: '几位来得巧。贫道略通医理，最擅解毒。先服一副药茶，再论其余。'");
push('      },');
push('      {');
push("        speaker: '猪八戒', speakerTitle: '【伤重心切】', speakerIcon: '🐗',");
push("        text: '多谢道长！猴哥，俺先饮为敬。'");
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【已饮下方知】', speakerIcon: '🐒',");
push("        text: '不好……这茶里有东西。老孙竟没看出来——道行……提不起来了。'");
push('      },');
push('      {');
push("        speaker: '黄花观主', speakerTitle: '【撕下面皮】', speakerIcon: '👁️',");
push("        text: '现在才知？晚了。盘丝岭的丝，黄花观的药，本是一路的。'");
push('      },');
push('      {');
push("        speaker: '沙僧', speakerTitle: '【护伤撤退】', speakerIcon: '🌊',");
push("        text: '大师兄护住师父与八戒，我断后！先退到安全处，再作打算！',");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push('          app.triggerPansiPoisonTea();');
push('        }');
push('      }');
push('    ]');
push('  },');
push('');

// 5. 毒后 / 老妇指路
push('  pansi_poison_tea: {');
push('    steps: [');
push('      {');
push("        speaker: '唐三藏', speakerTitle: '【照护伤者】', speakerIcon: '🧘',");
push("        text: '悟空、八戒都倒了。沙僧，取水来，慢些。将军，毒一时解不了，先想法子破那金光。'");
push('      },');
push('      {');
push("        speaker: '指路老妇', speakerTitle: '【黎山故人】', speakerIcon: '👵',");
push("        text: '老婆子瞧你们半晌了。那道士肋下千目，放起来的是金光——寻常药物只缓得一时，克不住它。'");
push('      },');
push('      {');
push("        speaker: '指路老妇', speakerTitle: '【指点去向】', speakerIcon: '👵',");
push("        text: '往高处去，寻昴日星官。他是双冠大公鸡，一声啼鸣破金光，二声啼鸣那蜈蚣便藏不住。'");
push('      },');
push('      {');
push("        speaker: '威灵大将', speakerTitle: '【记下方位】', speakerIcon: '🛡️',");
push("        text: '高处、双冠、两声啼鸣。我记下了。师父守着伤者，我去请星官。',");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push("          if (app.storyPhase !== 'pansi_poisoned') return;");
push("          app.storyPhase = 'pansi_seeking_rooster';");
push('          app.refreshMapNpcs();');
push('          app.saveAutoProgress();');
push("          window.showGameMessage('🐓 已得指引：往高处请昴日星官。', 'info', 4500);");
push('        }');
push('      }');
push('    ]');
push('  },');
push('');

// 6. 昴日求援
push('  pansi_maori: {');
push('    steps: [');
push('      {');
push("        speaker: '昴日星官', speakerTitle: '【双冠大公鸡】', speakerIcon: '🐓',");
push("        text: '金光、毒伤、还有人被困。你说的可是盘丝岭那位黄花观主？'");
push('      },');
push('      {');
push("        speaker: '威灵大将', speakerTitle: '【如实以告】', speakerIcon: '🛡️',");
push("        text: '正是。他肋下千目放金光，我等近不得身；悟空与八戒中了毒茶，师父尚在照护。只求星官一行。'");
push('      },');
push('      {');
push("        speaker: '昴日星官', speakerTitle: '【慨然应允】', speakerIcon: '🐓',");
push("        text: '好。我随你走一遭。事先说明——我只破光、显形；那道士的处置，仍按你们的规矩来。',");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push("          if (app.storyPhase !== 'pansi_seeking_rooster') return;");
push("          app.storyPhase = 'pansi_breaking_light';");
push('          app.refreshMapNpcs();');
push('          app.saveAutoProgress();');
push("          window.showGameMessage('🐓 昴日星官已应允随行。', 'success', 4500);");
push('        }');
push('      }');
push('    ]');
push('  },');
push('');

// 7. 破光（两声啼鸣）
push('  pansi_light_break: {');
push('    steps: [');
push('      {');
push("        speaker: '黄花观主', speakerTitle: '【千目金光】', speakerIcon: '👁️',");
push("        text: '肋下众目齐张，金光如山——你们哪个也近不得我身！'");
push('      },');
push('      {');
push("        speaker: '昴日星官', speakerTitle: '【第一声啼鸣】', speakerIcon: '🐓',");
push("        text: '咯咯——喔！'");
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【金光散开】', speakerIcon: '🐒',");
push("        text: '散了！金光散开了！师父，能近了！'");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push("          if (app.storyPhase !== 'pansi_breaking_light') return;");
push('          app.triggerPansiRoosterCry(1);');
push('        }');
push('      },');
push('      {');
push("        speaker: '昴日星官', speakerTitle: '【第二声啼鸣】', speakerIcon: '🐓',");
push("        text: '咯咯——喔！再看你还往哪里藏！'");
push('      },');
push('      {');
push("        speaker: '黄花观主', speakerTitle: '【现出本相】', speakerIcon: '👁️',");
push("        text: '不可能……这金光从未……啊——'");
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【一条大蜈蚣】', speakerIcon: '🐒',");
push("        text: '现形了！不是什么黄花观主，是一条丈长大蜈蚣。星官，有劳！',");
push('        action: () => {');
push('          const app = window.App2D;');
push('          if (!app) return;');
push("          if (app.storyPhase !== 'pansi_breaking_light') return;");
push('          app.triggerPansiRoosterCry(2);');
push('        }');
push('      }');
push('    ]');
push('  },');
push('');

// 8. 显形后开战
push('  pansi_form_revealed: {');
push('    steps: [');
push('      {');
push("        speaker: '昴日星官', speakerTitle: '【让开通路】', speakerIcon: '🐓',");
push("        text: '金光已破，本相已现。它再无屏障——接下来是你们的规矩。'");
push('        options: [');
push('          { text: \'【与百眼魔君一战】\', action: () => {');
push('            const app = window.App2D;');
push('            if (!app) return;');
push("            if (app.storyPhase !== 'pansi_breaking_light') return;");
push('            if (window.Dialogue) window.Dialogue.close();');
push('            app.triggerPansiBaiyanBattle();');
push('          } }');
push('        ]');
push('      }');
push('    ]');
push('  },');
push('');

// 9. 战后 / 善后
push('  pansi_victory: {');
push('    steps: [');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【取得解药】', speakerIcon: '🐒',");
push("        text: '蜈蚣已伏。老孙在观里寻到解毒的方子——沙师弟，先给师父和八戒服下。'");
push('      },');
push('      {');
push("        speaker: '猪八戒', speakerTitle: '【缓过劲来】', speakerIcon: '🐗',");
push("        text: '活了活了……这一回老孙……不，这一回老猪是真长了记性。下处关口，俺先问清了再走。'");
push('      },');
push('      {');
push("        speaker: '唐三藏', speakerTitle: '【交代善后】', speakerIcon: '🧘',");
push("        text: '善后尚有几桩：确认获救者都已带离、盘丝洞的毒丝须清除、七位女妖如何处置也须定论。'");
push('        options: [');
push('          { text: \'【完成善后】\', action: () => {');
push('            const app = window.App2D;');
push('            if (!app) return;');
push('            app.completePansiAftercare();');
push('            app.claimPansiReward();');
push('          } }');
push('        ]');
push('      }');
push('    ]');
push('  },');
push('');

// 10. 善后细节（七女妖处置）
push('  pansi_aftercare: {');
push('    steps: [');
push('      {');
push("        speaker: '盘丝七女妖', speakerTitle: '【分歧已显】', speakerIcon: '🕷️',");
push("        text: '七妹还想争，大姐，别争了。泉边的规矩我们立得，扣人役使我们也做得出——如今百眼已伏，该认的认。'");
push('      },');
push('      {');
push("        speaker: '唐三藏', speakerTitle: '【分别定论】', speakerIcon: '🧘',");
push("        text: '七位请自便。岭上毒丝与捕人的设施，须一并清除；若有仍被缚住的人，先带离。'");
push('      },');
push('      {');
push("        speaker: '威灵大将', speakerTitle: '【清除危险】', speakerIcon: '🛡️',");
push("        text: '撤空已核，无仍被缚者。焚除毒丝与捕人设施——不毁其居，不为报复。',");
push('        action: () => { if (window.App2D) window.App2D.saveAutoProgress(); }');
push('      }');
push('    ]');
push('  },');
push('');

// 11. 终态尾声
push('  pansi_cleared_end: {');
push('    steps: [');
push('      {');
push("        speaker: '唐三藏', speakerTitle: '【西行在望】', speakerIcon: '🧘',");
push("        text: '盘丝事了。悟空、八戒的毒既解，我们便继续西去。'");
push('      },');
push('      {');
push("        speaker: '孙悟空', speakerTitle: '【谨慎得过分】', speakerIcon: '🐒',");
push("        text: '沙师弟，这水你从哪儿取的？……你亲自取的？嗯，拿来吧。'");
push('      },');
push('      {');
push("        speaker: '威灵大将', speakerTitle: '【收束】', speakerIcon: '🛡️',");
push("        text: '伤者已脱险，前路已明。动身吧。'");
push('        action: () => { if (window.App2D) window.App2D.saveAutoProgress(); }');
push('      }');
push('    ]');
push('  },');

const from = `  // =========================================================================
  // 支线任务：【苍茫三岭伏魔传】剧情与交互
  // =========================================================================`;
const c = s.split(from).length - 1;
if (c !== 1) { console.error(`锚点 ${c} 处`); process.exit(1); }
s = s.replace(from, L.join('\n') + '\n\n' + from);

// chapter_17
const chAnchor = `      triggerMap: 'huoyanshan',
      triggerPhase: 'huoyan_arrived'
    }
  };`;
const chBlock = `      triggerMap: 'huoyanshan',
      triggerPhase: 'huoyan_arrived'
    },
    'chapter_17': {
      id: 'chapter_17',
      chapterNum: '第十七回',
      title: '第十七回 · 盘丝破妄',
      subtitle: '濯垢泉边丝缚客，啼鸣两声破金光',
      seal: '盘丝破妄',
      triggerMap: 'pansidong',
      triggerPhase: 'pansi_arrived'
    }
  };`;
const c2 = s.split(chAnchor).length - 1;
if (c2 === 1) { s = s.replace(chAnchor, chBlock); console.log('✓ chapter_17'); }
else console.error(`✗ chapter_17 锚点 ${c2}`);

const badRe = /^(        text: '.*')\n(        (?:action|options):)/gm;
let fixed = 0;
s = s.replace(badRe, (_m, g1, g2) => { fixed++; return g1 + ',\n' + g2; });
console.log(`补逗号 ${fixed} 处`);

if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已插入盘丝洞对白');
