import fs from 'node:fs';
let n = 0;

// ── 1) 五处表 + App2D 方法 + 章节起点 ──
{
  const p = 'js/app2d.js';
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');
  const rep = (from, to, label) => {
    const c = s.split(from).length - 1;
    if (c !== 1) { console.error(`✗ ${label}: ${c}`); return false; }
    s = s.replace(from, to); n++; console.log(`✓ ${label}`); return true;
  };

  rep(`      huoyan_cleared: 200,
      poer_cleared: 202,`,
`      huoyan_cleared: 200,
      pansi_arrived: 202,
      pansi_webbound: 204,
      pansi_huanghua: 206,
      pansi_poisoned: 208,
      pansi_seeking_rooster: 210,
      pansi_breaking_light: 212,
      pansi_restoring: 214,
      pansi_cleared: 216,
      poer_cleared: 218,`, 'phaseWeights');

  rep(`      'huoyan_cleared': null
    };`,
`      'huoyan_cleared': null,
      // 第十七回 盘丝洞
      'pansi_arrived': 'npc_pansi_spider',
      'pansi_webbound': 'npc_pansi_spider',
      'pansi_huanghua': 'npc_pansi_huanghua',
      'pansi_poisoned': 'npc_pansi_oldwoman',
      'pansi_seeking_rooster': 'npc_pansi_maori',
      'pansi_breaking_light': 'npc_pansi_maori',
      'pansi_restoring': 'npc_pansi_tangseng',
      'pansi_cleared': 'npc_pansi_west_exit'
    };`, 'MAIN_QUEST_TARGETS');

  rep(`    // 8.1.5 第十六回 火焰山`,
`    // 8.1.6 第十七回 盘丝洞
    // 蜘蛛精代表（七女妖用一名代表承载，群体分歧由对白呈现）
    if (npcId === 'npc_pansi_spider') {
      return ['pansi_arrived', 'pansi_webbound'].includes(storyPhase);
    }
    if (npcId === 'npc_pansi_tangseng') {
      // 泉边与解缚阶段唐僧在场；中毒后被护送照护，仍可见
      return ['pansi_arrived', 'pansi_webbound', 'pansi_huanghua',
        'pansi_poisoned', 'pansi_restoring'].includes(storyPhase);
    }
    if (npcId === 'npc_pansi_huanghua') {
      // 黄花观主：解缚后至啼鸣前在场（毒茶与金光都由他发动）
      return ['pansi_huanghua', 'pansi_poisoned', 'pansi_breaking_light'].includes(storyPhase);
    }
    if (npcId === 'npc_pansi_oldwoman') {
      return storyPhase === 'pansi_poisoned';
    }
    if (npcId === 'npc_pansi_maori') {
      return ['pansi_seeking_rooster', 'pansi_breaking_light', 'pansi_restoring'].includes(storyPhase);
    }
    if (npcId === 'npc_pansi_west_exit') {
      // 西行出口只在终态放行
      return storyPhase === 'pansi_cleared';
    }

    // 8.1.5 第十六回 火焰山`, 'isNpcVisibleInStoryPhase');

  rep(`      stepHint = sp === 'huoyan_cleared' ? '火焰山事毕，继续西行' : '真扇火势当减，假扇越扇越大';
      isDone = sp === 'huoyan_cleared';
    }`,
`      stepHint = sp === 'huoyan_cleared' ? '火焰山事毕，继续西行' : '真扇火势当减，假扇越扇越大';
      isDone = sp === 'huoyan_cleared';
    } else if (sp.startsWith('pansi_')) {
      ordealNumber = '【第十八难·盘丝七难】';
      ordealName = '盘丝岭盘丝洞 · 七女妖与黄花观';
      ordealDesc = '盘丝岭七女妖于濯垢泉边设丝缚人，与黄花观百眼魔君互为同盟。八戒越界被缚，唐僧制止时同遭扣押。须先安全解缚，再往黄花观求援——却遭毒茶暗算。须寻得昴日星官，以两声啼鸣破金光、显原形，方能制服百眼、取得解药。';
      chapter = '第十七回 · 盘丝破妄';
      stepName = sp === 'pansi_cleared' ? '前往西行出口' :
        sp === 'pansi_restoring' ? '向唐僧交代救治与善后' :
          sp === 'pansi_breaking_light' ? '随昴日星官破除金光' :
            sp === 'pansi_seeking_rooster' ? '请昴日星官下山相助' :
              sp === 'pansi_poisoned' ? '向指路老妇询问破光之法' :
                sp === 'pansi_huanghua' ? '往黄花观求解毒之法' :
                  sp === 'pansi_webbound' ? '解除丝洞主缚，救出师父与八戒' : '与唐僧确认泉边边界';
      stepTarget = sp === 'pansi_cleared' ? '盘丝事了，继续西去' :
        sp === 'pansi_restoring' ? '取得解毒药、照料伤者、清点获救者、处置丝洞' :
          sp === 'pansi_breaking_light' ? '一鸣破光，二鸣显形；护住救援通路' :
            sp === 'pansi_seeking_rooster' ? '如实说明金光、毒伤与被困者' :
              sp === 'pansi_poisoned' ? '普通药物只能暂缓，须先找到克制金光之人' :
                sp === 'pansi_huanghua' ? '说明伤情，核实药物；求援不等于信任' :
                  sp === 'pansi_webbound' ? '先观察主缚与承重丝，再救人；不可直接焚烧' : '泉边有人，不得窥探；先问路，不擅入';
      stepProgress = sp === 'pansi_cleared' ? '功德圆满' :
        sp === 'pansi_restoring' ? '百眼已制服' :
          sp === 'pansi_breaking_light' ? '援手已至' :
            sp === 'pansi_seeking_rooster' ? '已得指引' :
              sp === 'pansi_poisoned' ? '毒茶事发' :
                sp === 'pansi_huanghua' ? '解缚已成' :
                  sp === 'pansi_webbound' ? '师父八戒受困' : '初至盘丝岭';
      stepProgressRatio = sp === 'pansi_cleared' ? 1 :
        sp === 'pansi_restoring' ? 0.9 : sp === 'pansi_breaking_light' ? 0.75 :
          sp === 'pansi_seeking_rooster' ? 0.6 : sp === 'pansi_poisoned' ? 0.45 :
            sp === 'pansi_huanghua' ? 0.3 : sp === 'pansi_webbound' ? 0.15 : 0.05;
      stepHint = sp === 'pansi_cleared' ? '盘丝事了，继续西去' :
        (sp === 'pansi_poisoned' || sp === 'pansi_seeking_rooster' || sp === 'pansi_breaking_light')
          ? '不是打掉血条才破金光，须先有克制金光之人' : '泉边有人，便应止步；未得应允，不可近前';
      isDone = sp === 'pansi_cleared';
    }`, 'getOrdealAndQuestInfo');

  rep(`    // 16. 第十六回：火焰山（铁扇公主/牛魔王）`,
`    // 17. 第十七回：盘丝洞（七女妖/百眼魔君）
    else if (mapId === 'pansidong') {
      if (!this.shownChapterSet.has('chapter_17')) {
        matchedChapterKey = 'chapter_17';
      }
    }
    // 16. 第十六回：火焰山（铁扇公主/牛魔王）`, '章节开幕触发');

  // 章节起点接入
  if (!s.includes('this.ensurePansiChapterStarted();')) {
    const from = '    this.ensureHuoyanChapterStarted();';
    const c2 = s.split(from).length - 1;
    if (c2 === 1) { s = s.replace(from, from + '\n    this.ensurePansiChapterStarted();'); console.log('✓ 章节起点已接入'); n++; }
    else console.error(`✗ 章节起点锚点 ${c2}`);
  }

  if (crlf) s = s.replace(/\n/g, '\r\n');
  fs.writeFileSync(p, s, 'utf8');
}

console.log(`\n共 ${n} 处`);
