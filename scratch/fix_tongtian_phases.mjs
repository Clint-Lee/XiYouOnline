import fs from 'node:fs';
let n = 0;

// 1) 统一阶段名：把旧的 6 阶段改成 Astra 的 7 阶段
{
  const p = 'js/app2d.js';
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');

  // phaseWeights
  {
    const from = `      tongtian_arrival: 172,
      tongtian_pledge: 174,
      tongtian_offer_ready: 176,
      tongtian_ice_battle: 178,
      tongtian_reward_pending: 180,
      tongtian_cleared: 182,`;
    const to = `      tongtian_arrival: 172,
      tongtian_vowed: 174,
      tongtian_altar: 176,
      tongtian_rescue: 178,
      tongtian_await_guanyin: 180,
      tongtian_reward: 182,
      tongtian_cleared: 184,`;
    const c = s.split(from).length - 1;
    if (c === 1) { s = s.replace(from, to); n++; console.log('✓ phaseWeights'); }
    else console.error(`✗ phaseWeights: ${c}`);
  }

  // MAIN_QUEST_TARGETS
  {
    const from = `      'tongtian_arrival': 'npc_tongtian_chenzhuang',
      'tongtian_pledge': 'npc_tongtian_chenzhuang',
      'tongtian_offer_ready': 'npc_tongtian_altar',
      'tongtian_ice_battle': 'npc_tongtian_boss',
      'tongtian_reward_pending': 'npc_tongtian_chenzhuang',
      'tongtian_cleared': null`;
    const to = `      'tongtian_arrival': 'npc_tongtian_elder',
      'tongtian_vowed': 'npc_tongtian_altar',
      'tongtian_altar': 'npc_tongtian_altar',
      'tongtian_rescue': 'npc_tongtian_watergate',
      'tongtian_await_guanyin': 'npc_tongtian_guanyin',
      'tongtian_reward': 'npc_tongtian_elder',
      'tongtian_cleared': null`;
    const c = s.split(from).length - 1;
    if (c === 1) { s = s.replace(from, to); n++; console.log('✓ MAIN_QUEST_TARGETS'); }
    else console.error(`✗ MAIN_QUEST_TARGETS: ${c}`);
  }

  // NPC 显隐
  {
    const from = `    // 8.1.4 第十五回 通天河
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
    }`;
    const to = `    // 8.1.4 第十五回 通天河
    // 陈家长者：除水府救援战期间外均在场（接案、领奖共用）
    if (npcId === 'npc_tongtian_elder') {
      return storyPhase !== 'tongtian_rescue';
    }
    // 被选中的孩童：只在初到与表态阶段可见，动身即撤（不把儿童当诱饵/可交互对象）
    if (npcId === 'npc_tongtian_child') {
      return ['tongtian_arrival', 'tongtian_vowed'].includes(storyPhase);
    }
    if (npcId === 'npc_tongtian_altar') {
      return ['tongtian_vowed', 'tongtian_altar'].includes(storyPhase);
    }
    if (npcId === 'npc_tongtian_watergate') {
      return storyPhase === 'tongtian_rescue';
    }
    if (npcId === 'npc_tongtian_guanyin') {
      return ['tongtian_await_guanyin', 'tongtian_reward', 'tongtian_cleared'].includes(storyPhase);
    }`;
    const c = s.split(from).length - 1;
    if (c === 1) { s = s.replace(from, to); n++; console.log('✓ isNpcVisibleInStoryPhase'); }
    else console.error(`✗ NPC 显隐: ${c}`);
  }

  // 卷轴
  {
    const from = `    } else if (sp.startsWith('tongtian_')) {
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
    }`;
    const to = `    } else if (sp.startsWith('tongtian_')) {
      const rewardStage = sp === 'tongtian_reward';
      ordealNumber = '【第十六难·通天祭童】';
      ordealName = '八百里通天河 · 灵感大王';
      ordealDesc = '通天河灵感大王年索童男童女为祭，陈家庄世代不敢违抗。需先向乡老立约"祭童之事今日为止"、安置孩子，再与悟空八戒变作替身诱妖，循暗流侧口潜入水府救人，最终引出观音收妖。';
      chapter = '第十五回 · 通天归真';
      stepName = rewardStage ? '向陈家长者辞行，领取谢礼' :
        sp === 'tongtian_await_guanyin' ? '去河畔见观音，收妖除患' :
          sp === 'tongtian_rescue' ? '探查水府入口，救出师父与八戒' :
            sp === 'tongtian_altar' ? '以替身赴约，引妖现身' :
              sp === 'tongtian_vowed' ? '安置孩子，随悟空八戒赴祭坛' : '查明通天河祭童之困';
      stepTarget = rewardStage ? '确认从今不再献祭，领取谢礼后渡河' :
        sp === 'tongtian_await_guanyin' ? '见证观音鱼篮收妖，安抚家长与孩子' :
          sp === 'tongtian_rescue' ? '循暗流侧口进入水府，击退灵感大王' :
            sp === 'tongtian_altar' ? '引妖怪现身，护住撤离的村民' :
              sp === 'tongtian_vowed' ? '让孩子留在家长身边，由师父沙僧留守照应' : '找到陈家长者，问明祭童原委';
      stepProgress = rewardStage ? '妖已收，谢礼待领' :
        sp === 'tongtian_cleared' ? '功德圆满' :
          sp === 'tongtian_await_guanyin' ? '师父已救，待观音收妖' :
            sp === 'tongtian_rescue' ? '立约已成，探查水府' :
              sp === 'tongtian_altar' ? '替身已备' :
                sp === 'tongtian_vowed' ? '已知祭童原委' : '初至通天河';
      stepProgressRatio = rewardStage ? 0.9 : sp === 'tongtian_cleared' ? 1 :
        sp === 'tongtian_await_guanyin' ? 0.8 : sp === 'tongtian_rescue' ? 0.6 :
          sp === 'tongtian_altar' ? 0.45 : sp === 'tongtian_vowed' ? 0.25 : 0.05;
      stepHint = sp === 'tongtian_cleared' ? '通天河事毕，河路复通东去' : '先救下眼前的孩子，再谈除妖';
      isDone = sp === 'tongtian_cleared';
    }`;
    const c = s.split(from).length - 1;
    if (c === 1) { s = s.replace(from, to); n++; console.log('✓ getOrdealAndQuestInfo'); }
    else console.error(`✗ 卷轴: ${c}`);
  }

  if (crlf) s = s.replace(/\n/g, '\r\n');
  fs.writeFileSync(p, s, 'utf8');
}

console.log(`\n共 ${n} 处`);
