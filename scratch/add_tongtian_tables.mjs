import fs from 'node:fs';
let n = 0;

// 1) 五处表（阶段名按接手文档约定）
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
  rep(`      chedi_cleared: 170,
      poer_cleared: 172,`,
`      chedi_cleared: 170,
      tongtian_arrival: 172,
      tongtian_pledge: 174,
      tongtian_offer_ready: 176,
      tongtian_ice_battle: 178,
      tongtian_reward_pending: 180,
      tongtian_cleared: 182,
      poer_cleared: 184,`, 'phaseWeights');

  // MAIN_QUEST_TARGETS（终态无目标）
  rep(`      'chedi_cleared': null
    };`,
`      'chedi_cleared': null,
      // 第十五回 通天河
      'tongtian_arrival': 'npc_tongtian_chenzhuang',
      'tongtian_pledge': 'npc_tongtian_chenzhuang',
      'tongtian_offer_ready': 'npc_tongtian_altar',
      'tongtian_ice_battle': 'npc_tongtian_boss',
      'tongtian_reward_pending': 'npc_tongtian_chenzhuang',
      'tongtian_cleared': null
    };`, 'MAIN_QUEST_TARGETS');

  // NPC 显隐
  rep(`    // 8.1.3 第十四回 车迟国`,
`    // 8.1.4 第十五回 通天河
    if (npcId === 'npc_tongtian_chenzhuang') {
      // 陈家庄主（受托祭事的乡老）：除决战中均在场
      return !['tongtian_ice_battle'].includes(storyPhase);
    }
    if (npcId === 'npc_tongtian_child') {
      // 被选中的孩童：只在表态与动身前可见，动身即撤（避免把儿童当作可交互对象）
      return ['tongtian_arrival', 'tongtian_pledge'].includes(storyPhase);
    }
    if (npcId === 'npc_tongtian_altar') {
      return storyPhase === 'tongtian_offer_ready';
    }
    if (npcId === 'npc_tongtian_boss') {
      return storyPhase === 'tongtian_ice_battle';
    }
    if (npcId === 'npc_tongtian_guanyin') {
      return ['tongtian_reward_pending', 'tongtian_cleared'].includes(storyPhase);
    }

    // 8.1.3 第十四回 车迟国`, 'isNpcVisibleInStoryPhase');

  // 卷轴
  rep(`      stepHint = sp === 'chedi_cleared' ? '车迟国事毕，关文通行资格已定' : '风不至则云不聚，云不聚则雷不响';
      isDone = sp === 'chedi_cleared';
    }`,
`      stepHint = sp === 'chedi_cleared' ? '车迟国事毕，关文通行资格已定' : '风不至则云不聚，云不聚则雷不响';
      isDone = sp === 'chedi_cleared';
    } else if (sp.startsWith('tongtian_')) {
      const rewardPending = sp === 'tongtian_reward_pending';
      ordealNumber = '【第十六难·通天祭童】';
      ordealName = '八百里通天河 · 灵感大王';
      ordealDesc = '通天河灵感大王年索童男童女为祭。陈家庄世代不敢违抗。需先向乡老立约"祭童之事今日为止"，再与悟空、八戒变作孩童诱妖，破其寒冰法术，引出观音收妖。';
      chapter = '第十五回 · 通天归真';
      stepName = rewardPending ? '向陈家庄与观音致谢' :
        sp === 'tongtian_ice_battle' ? '诱妖现身，破除寒冰法术' :
          sp === 'tongtian_offer_ready' ? '前往河畔祭坛，变作童男女' :
            sp === 'tongtian_pledge' ? '向乡老立约：祭童之事今日为止' : '查明通天河祭童之困';
      stepTarget = rewardPending ? '领取谢礼，确认河路复通' :
        sp === 'tongtian_ice_battle' ? '保护孩童，击退灵感大王' :
          sp === 'tongtian_offer_ready' ? '与悟空八戒会合，变作陈关保与一秤金' :
            sp === 'tongtian_pledge' ? '让乡老亲口答应：从今不再献祭孩童' : '找到陈家庄乡老，问明祭童原委';
      stepProgress = rewardPending ? '妖已收，谢礼待领' :
        sp === 'tongtian_cleared' ? '功德圆满' :
          sp === 'tongtian_ice_battle' ? '已立约，妖将现身' :
            sp === 'tongtian_offer_ready' ? '立约已成' :
              sp === 'tongtian_pledge' ? '已知祭童原委' : '初至通天河';
      stepProgressRatio = rewardPending ? 0.9 : sp === 'tongtian_cleared' ? 1 :
        sp === 'tongtian_ice_battle' ? 0.7 : sp === 'tongtian_offer_ready' ? 0.45 :
          sp === 'tongtian_pledge' ? 0.25 : 0.05;
      stepHint = sp === 'tongtian_cleared' ? '通天河事毕，河路复通东去' : '先救下眼前的孩子，再谈除妖';
      isDone = sp === 'tongtian_cleared';
    }`, 'getOrdealAndQuestInfo');

  // 章节开幕触发
  rep(`    // 14. 第十四回：车迟国（三仙斗法）
    else if (mapId === 'chediguo') {
      if (!this.shownChapterSet.has('chapter_14')) {
        matchedChapterKey = 'chapter_14';
      }
    }`,
`    // 14. 第十四回：车迟国（三仙斗法）
    else if (mapId === 'chediguo') {
      if (!this.shownChapterSet.has('chapter_14')) {
        matchedChapterKey = 'chapter_14';
      }
    }
    // 15. 第十五回：通天河（灵感大王）
    else if (mapId === 'tongtianhe') {
      if (!this.shownChapterSet.has('chapter_15')) {
        matchedChapterKey = 'chapter_15';
      }
    }`, '章节开幕触发');

  if (crlf) s = s.replace(/\n/g, '\r\n');
  fs.writeFileSync(p, s, 'utf8');
}

console.log(`\n共 ${n} 处`);
