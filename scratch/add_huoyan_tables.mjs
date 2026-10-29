import fs from 'node:fs';
let n = 0;

// 1) 五处表
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

  rep(`      tongtian_cleared: 184,
      poer_cleared: 186,`,
`      tongtian_cleared: 184,
      huoyan_arrived: 186,
      huoyan_borrow_fan: 188,
      huoyan_test_fan: 190,
      huoyan_seek_true_fan: 192,
      huoyan_confront_bull: 194,
      huoyan_renew_request: 196,
      huoyan_quench_fire: 198,
      huoyan_cleared: 200,
      poer_cleared: 202,`, 'phaseWeights');

  rep(`      'tongtian_cleared': null
    };`,
`      'tongtian_cleared': null,
      // 第十六回 火焰山
      'huoyan_arrived': 'npc_huoyan_villager',
      'huoyan_borrow_fan': 'npc_huoyan_princess',
      'huoyan_test_fan': 'npc_huoyan_fan_trial',
      'huoyan_seek_true_fan': 'npc_huoyan_princess',
      'huoyan_confront_bull': 'npc_huoyan_bull_king',
      'huoyan_renew_request': 'npc_huoyan_princess',
      'huoyan_quench_fire': 'npc_huoyan_fire_root',
      'huoyan_cleared': null
    };`, 'MAIN_QUEST_TARGETS');

  rep(`    // 8.1.4 第十五回 通天河`,
`    // 8.1.5 第十六回 火焰山
    if (npcId === 'npc_huoyan_villager') {
      return ['huoyan_arrived', 'huoyan_borrow_fan', 'huoyan_test_fan',
        'huoyan_seek_true_fan', 'huoyan_confront_bull', 'huoyan_renew_request',
        'huoyan_quench_fire'].includes(storyPhase);
    }
    if (npcId === 'npc_huoyan_land') {
      return ['huoyan_arrived', 'huoyan_borrow_fan', 'huoyan_test_fan',
        'huoyan_seek_true_fan', 'huoyan_quench_fire', 'huoyan_cleared'].includes(storyPhase);
    }
    if (npcId === 'npc_huoyan_princess') {
      // 铁扇公主全章复用同一实体；试扇/对质期间留洞中（旁听对白）
      return ['huoyan_borrow_fan', 'huoyan_seek_true_fan', 'huoyan_renew_request',
        'huoyan_quench_fire', 'huoyan_cleared'].includes(storyPhase);
    }
    if (npcId === 'npc_huoyan_bull_king') {
      return ['huoyan_seek_true_fan', 'huoyan_confront_bull', 'huoyan_renew_request'].includes(storyPhase);
    }
    if (npcId === 'npc_huoyan_fan_trial') {
      return storyPhase === 'huoyan_test_fan';
    }
    if (npcId === 'npc_huoyan_fire_root') {
      // 熄火前台灭火，熄火后领谢礼
      return storyPhase === 'huoyan_quench_fire';
    }

    // 8.1.4 第十五回 通天河`, 'isNpcVisibleInStoryPhase');

  rep(`      stepHint = sp === 'tongtian_cleared' ? '通天河事毕，河路复通东去' : '先救下眼前的孩子，再谈除妖';
      isDone = sp === 'tongtian_cleared';
    }`,
`      stepHint = sp === 'tongtian_cleared' ? '通天河事毕，河路复通东去' : '先救下眼前的孩子，再谈除妖';
      isDone = sp === 'tongtian_cleared';
    } else if (sp.startsWith('huoyan_')) {
      const extinguished = !!(window.App2D && window.App2D.playerData &&
        window.App2D.playerData.storyEvents && window.App2D.playerData.storyEvents.huoyan_fire_extinguished);
      ordealNumber = '【第十七难·火焰借扇】';
      ordealName = '八百里火焰山 · 铁扇公主与牛魔王';
      ordealDesc = '火焰山火源源于五百年前大圣蹬倒八卦炉所落火砖。铁扇公主因红孩儿旧怨拒借芭蕉扇，悟空强取得假扇、再变化骗扇又为牛魔王所骗。须停止取巧、当众认责，重新议借真扇，连扇四十九下断绝火根。';
      chapter = '第十六回 · 火焰借扇';
      stepName = extinguished ? '向百姓领取谢礼' :
        sp === 'huoyan_quench_fire' ? '前往火根台断绝火根' :
          sp === 'huoyan_renew_request' ? '重新议借真扇' :
            sp === 'huoyan_confront_bull' ? '摩云台对质牛魔王' :
              sp === 'huoyan_seek_true_fan' ? '再赴芭蕉洞求取真扇' :
                sp === 'huoyan_test_fan' ? '在试扇火口验明真伪' :
                  sp === 'huoyan_borrow_fan' ? '前往芭蕉洞借扇' : '查明火焰山灾情';
      stepTarget = extinguished ? '向灾民代表领取谢礼，继续西行' :
        sp === 'huoyan_quench_fire' ? '连扇四十九下断绝火根，随后归还宝扇' :
          sp === 'huoyan_renew_request' ? '不再变化欺骗，向铁扇公主说明火源来历并担责' :
            sp === 'huoyan_confront_bull' ? '阻止牛魔王携扇离开' :
              sp === 'huoyan_seek_true_fan' ? '强取已不能解决问题，再赴芭蕉洞' :
                sp === 'huoyan_test_fan' ? '照土地所示，辨明手中扇是真是假' :
                  sp === 'huoyan_borrow_fan' ? '前往翠云山芭蕉洞，向铁扇公主借扇' : '找到灾民代表，问明受灾情形';
      stepProgress = extinguished ? '火根已绝，谢礼待领' :
        sp === 'huoyan_cleared' ? '功德圆满' :
          sp === 'huoyan_quench_fire' ? '真扇已借' :
            sp === 'huoyan_renew_request' ? '牛魔王已退' :
              sp === 'huoyan_confront_bull' ? '真扇被夺' :
                sp === 'huoyan_seek_true_fan' ? '已辨假扇' :
                  sp === 'huoyan_test_fan' ? '待验证的扇已得' :
                    sp === 'huoyan_borrow_fan' ? '已知灾情' : '初至火焰山';
      stepProgressRatio = extinguished ? 0.9 : sp === 'huoyan_cleared' ? 1 :
        sp === 'huoyan_quench_fire' ? 0.8 : sp === 'huoyan_renew_request' ? 0.7 :
          sp === 'huoyan_confront_bull' ? 0.55 : sp === 'huoyan_seek_true_fan' ? 0.45 :
            sp === 'huoyan_test_fan' ? 0.3 : sp === 'huoyan_borrow_fan' ? 0.15 : 0.05;
      stepHint = sp === 'huoyan_cleared' ? '火焰山事毕，继续西行' : '真扇火势当减，假扇越扇越大';
      isDone = sp === 'huoyan_cleared';
    }`, 'getOrdealAndQuestInfo');

  rep(`    // 15. 第十五回：通天河（灵感大王）`,
`    // 16. 第十六回：火焰山（铁扇公主/牛魔王）
    else if (mapId === 'huoyanshan') {
      if (!this.shownChapterSet.has('chapter_16')) {
        matchedChapterKey = 'chapter_16';
      }
    }
    // 15. 第十五回：通天河（灵感大王）`, '章节开幕触发');

  if (crlf) s = s.replace(/\n/g, '\r\n');
  fs.writeFileSync(p, s, 'utf8');
}

console.log(`\n共 ${n} 处`);
