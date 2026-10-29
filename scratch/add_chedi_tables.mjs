import fs from 'node:fs';
let n = 0;

// 1) phaseWeights + MAIN_QUEST_TARGETS + NPC 显隐 + 卷轴 + 章节触发
{
  const p = 'js/app2d.js';
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');

  const rep = (from, to, label) => {
    const c = s.split(from).length - 1;
    if (c !== 1) { console.error(`✗ ${label}: ${c} 处`); return false; }
    s = s.replace(from, to); n++; console.log(`✓ ${label}`); return true;
  };

  // phaseWeights
  rep(`      heishui_cleared: 156,
      poer_cleared: 162,`,
`      heishui_cleared: 156,
      chedi_arrival: 158,
      chedi_audience: 160,
      chedi_rain: 162,
      chedi_discern: 164,
      chedi_final_trial: 166,
      chedi_reward_pending: 168,
      chedi_cleared: 170,
      poer_cleared: 172,`, 'phaseWeights');

  // MAIN_QUEST_TARGETS
  rep(`      'heishui_cleared': 'npc_heishui_tangseng_rescued'
    };`,
`      'heishui_cleared': 'npc_heishui_tangseng_rescued',
      // 第十四回 车迟国（终态无目标）
      'chedi_arrival': 'npc_chedi_monk',
      'chedi_audience': 'npc_chedi_king',
      'chedi_rain': 'npc_chedi_tiger',
      'chedi_discern': 'npc_chedi_deer',
      'chedi_final_trial': 'npc_chedi_sheep',
      'chedi_reward_pending': 'npc_chedi_king',
      'chedi_cleared': null
    };`, 'MAIN_QUEST_TARGETS');

  // NPC 显隐
  rep(`    // 8.1.2 第十三回 黑水河：按阶段集合严格显隐`,
`    // 8.1.3 第十四回 车迟国：三仙在决战前可见，胜利进入领奖阶段即隐藏
    if (npcId === 'npc_chedi_monk') {
      return ['chedi_arrival', 'chedi_audience', 'chedi_rain', 'chedi_discern',
        'chedi_final_trial', 'chedi_reward_pending'].includes(storyPhase);
    }
    if (npcId === 'npc_chedi_tiger') {
      return ['chedi_rain', 'chedi_discern', 'chedi_final_trial'].includes(storyPhase);
    }
    if (npcId === 'npc_chedi_deer') {
      return ['chedi_discern', 'chedi_final_trial'].includes(storyPhase);
    }
    if (npcId === 'npc_chedi_sheep') {
      return storyPhase === 'chedi_final_trial';
    }
    if (npcId === 'npc_chedi_king') {
      // 国王常驻，但决战后的纠错与领奖只在 reward_pending / cleared 显示
      return storyPhase === 'chedi_audience' || storyPhase === 'chedi_reward_pending' ||
        storyPhase === 'chedi_cleared';
    }

    // 8.1.2 第十三回 黑水河：按阶段集合严格显隐`, 'isNpcVisibleInStoryPhase');

  // 卷轴
  rep(`      stepHint = sp === 'heishui_cleared' ? '黑水河事毕，师徒渡河东去' : '悟空不善水战，水中强攻不利，宜请援手';
      isDone = sp === 'heishui_cleared';
    }`,
`      stepHint = sp === 'heishui_cleared' ? '黑水河事毕，师徒渡河东去' : '悟空不善水战，水中强攻不利，宜请援手';
      isDone = sp === 'heishui_cleared';
    } else if (sp.startsWith('chedi_')) {
      const rewardPending = sp === 'chedi_reward_pending';
      ordealNumber = '【第十五难·车迟护僧】';
      ordealName = '车迟国三清观 · 三仙欺佛';
      ordealDesc = '车迟国敬道灭僧，虎力、鹿力、羊力三大仙役使全国僧众。需解救受役沙门、与国王立约，凭祈雨、辨物两场斗法揭穿邪术，再于第三场决战破除三仙。';
      chapter = '第十四回 · 车迟斗法';
      stepName = rewardPending ? '领取谢礼与西行关文' :
        sp === 'chedi_final_trial' ? '破除邪术，三仙同场决战' :
          sp === 'chedi_discern' ? '坐禅定心，隔板辨物' :
            sp === 'chedi_rain' ? '验证求雨本领' :
              sp === 'chedi_audience' ? '面见国王，约定停役与斗法条件' : '查明僧人受役情况';
      stepTarget = rewardPending ? '向国王领取谢礼与西行关文' :
        sp === 'chedi_final_trial' ? '破除三仙邪术，保护在场众人' :
          sp === 'chedi_discern' ? '识破鹿力借干扰与暗示改判' :
            sp === 'chedi_rain' ? '依序验风云雷雨，赢下第一场' :
              sp === 'chedi_audience' ? '要求公开见证、僧人不得继续受罚' : '接受受役僧人申诉';
      stepProgress = rewardPending ? '三仙伏诛，谢礼待领' :
        sp === 'chedi_cleared' ? '功德圆满' :
          sp === 'chedi_final_trial' ? '两场已胜，决战在即' :
            sp === 'chedi_discern' ? '祈雨已胜' :
              sp === 'chedi_rain' ? '立约已成' :
                sp === 'chedi_audience' ? '申诉已接' : '初入车迟国';
      stepProgressRatio = rewardPending ? 0.9 : sp === 'chedi_cleared' ? 1 :
        sp === 'chedi_final_trial' ? 0.8 : sp === 'chedi_discern' ? 0.6 :
          sp === 'chedi_rain' ? 0.4 : sp === 'chedi_audience' ? 0.2 : 0.05;
      stepHint = sp === 'chedi_cleared' ? '车迟国事毕，关文通行资格已定' : '风不至则云不聚，云不聚则雷不响';
      isDone = sp === 'chedi_cleared';
    }`, 'getOrdealAndQuestInfo');

  // 章节开幕触发
  rep(`    // 13. 第十三回：黑水河（鼍洁）
    else if (mapId === 'heishuihe') {
      if (!this.shownChapterSet.has('chapter_13')) {
        matchedChapterKey = 'chapter_13';
      }
    }`,
`    // 13. 第十三回：黑水河（鼍洁）
    else if (mapId === 'heishuihe') {
      if (!this.shownChapterSet.has('chapter_13')) {
        matchedChapterKey = 'chapter_13';
      }
    }
    // 14. 第十四回：车迟国（三仙斗法）
    else if (mapId === 'chediguo') {
      if (!this.shownChapterSet.has('chapter_14')) {
        matchedChapterKey = 'chapter_14';
      }
    }`, '章节开幕触发');

  if (crlf) s = s.replace(/\n/g, '\r\n');
  fs.writeFileSync(p, s, 'utf8');
}

console.log(`\n共 ${n} 处`);
