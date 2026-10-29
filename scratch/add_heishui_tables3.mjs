import fs from 'node:fs';

const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const hasCRLF = s.includes('\r\n');
console.log('文件换行:', hasCRLF ? 'CRLF' : 'LF');

// 归一化到 LF 处理完再还原
if (hasCRLF) s = s.replace(/\r\n/g, '\n');
let n = 0;

// 1) phaseWeights
{
  const from = '      huoyun_cleared: 140,\n      poer_cleared: 150,\n      chedi_cleared: 160,';
  const to = `      huoyun_cleared: 140,
      heishui_arrived: 142,
      heishui_captives_taken: 144,
      heishui_scout_ready: 146,
      heishui_aid_needed: 148,
      heishui_moang_arrived: 150,
      heishui_boss_ready: 152,
      heishui_reward_pending: 154,
      heishui_cleared: 156,
      poer_cleared: 162,
      chedi_cleared: 164,`;
  const c = s.split(from).length - 1;
  if (c !== 1) { console.error(`phaseWeights 匹配 ${c} 处`); process.exit(1); }
  s = s.replace(from, to); n++; console.log('✓ phaseWeights');
}

// 2) MAIN_QUEST_TARGETS
{
  const from = "      'huoyun_cleared': null\n    };";
  const to = `      'huoyun_cleared': null,
      // 第十三回 黑水河
      'heishui_arrived': 'npc_heishui_ferryman',
      'heishui_captives_taken': 'npc_heishui_rivergod_exiled',
      'heishui_scout_ready': 'npc_heishui_gate_guard',
      'heishui_aid_needed': 'npc_heishui_rivergod_exiled',
      'heishui_moang_arrived': 'npc_heishui_moang',
      'heishui_boss_ready': 'npc_heishui_tuojie',
      'heishui_reward_pending': 'npc_heishui_rivergod_restored',
      'heishui_cleared': 'npc_heishui_tangseng_rescued'
    };`;
  const c = s.split(from).length - 1;
  if (c !== 1) { console.error(`MAIN_QUEST_TARGETS 匹配 ${c} 处`); process.exit(1); }
  s = s.replace(from, to); n++; console.log('✓ MAIN_QUEST_TARGETS');
}

// 3) NPC 显隐
{
  const from = '    // 8.2 苍茫三岭支线伏魔 NPC 与妖物';
  const to = `    // 8.1.2 第十三回 黑水河：按阶段集合严格显隐
    if (npcId === 'npc_heishui_ferryman') {
      return storyPhase === 'heishui_arrived';
    }
    if (npcId === 'npc_heishui_rivergod_exiled') {
      return ['heishui_captives_taken', 'heishui_scout_ready', 'heishui_aid_needed'].includes(storyPhase);
    }
    if (npcId === 'npc_heishui_gate_guard') {
      return storyPhase === 'heishui_scout_ready';
    }
    if (npcId === 'npc_heishui_moang') {
      return ['heishui_moang_arrived', 'heishui_boss_ready'].includes(storyPhase);
    }
    if (npcId === 'npc_heishui_tuojie') {
      return storyPhase === 'heishui_boss_ready';
    }
    if (npcId === 'npc_heishui_rivergod_restored') {
      return ['heishui_reward_pending', 'heishui_cleared'].includes(storyPhase);
    }
    if (npcId === 'npc_heishui_tangseng_rescued') {
      return ['heishui_reward_pending', 'heishui_cleared'].includes(storyPhase);
    }

    // 8.2 苍茫三岭支线伏魔 NPC 与妖物`;
  const c = s.split(from).length - 1;
  if (c !== 1) { console.error(`NPC 显隐匹配 ${c} 处`); process.exit(1); }
  s = s.replace(from, to); n++; console.log('✓ isNpcVisibleInStoryPhase');
}

// 4) 任务卷轴：在 huoyun_ 分支后补 heishui_
{
  const from = `      stepHint = sp === 'huoyun_cleared' ? '火云洞已平，西行大道重开' : '三昧真火非同凡火，水浇不灭，先破车阵';
      isDone = sp === 'huoyun_cleared';
    }`;
  const to = `      stepHint = sp === 'huoyun_cleared' ? '火云洞已平，西行大道重开' : '三昧真火非同凡火，水浇不灭，先破车阵';
      isDone = sp === 'huoyun_cleared';
    } else if (sp.startsWith('heishui_')) {
      const rewardPending = sp === 'heishui_reward_pending';
      ordealNumber = '【第十四难·黑水沉波】';
      ordealName = '衡阳峪黑水河 · 鼍洁夺府';
      ordealDesc = '泾河龙王第九子鼍洁占衡阳峪黑水河神府，赶走原河神，化作船夫摄走唐僧与八戒。需寻访失府河神、探明水府、请西海龙太子摩昂擒妖。';
      chapter = '第十三回 · 黑水擒龙';
      stepName = rewardPending ? '领取黑水河谢礼' :
        sp === 'heishui_boss_ready' ? '破其水势，为摩昂创造擒拿之机' :
          sp === 'heishui_moang_arrived' ? '听摩昂战前交代' :
            sp === 'heishui_aid_needed' ? '商议请援西海' :
              sp === 'heishui_scout_ready' ? '探查水府，击退守将' :
                sp === 'heishui_captives_taken' ? '寻访失府河神，问明河情' : '询问摆渡之法';
      stepTarget = rewardPending ? '整理行囊，向黑水河神领取谢礼' :
        sp === 'heishui_boss_ready' ? '牵制鼍洁、破其水势，由摩昂擒拿' :
          sp === 'heishui_moang_arrived' ? '与摩昂会合，确认救人及收服次序' :
            sp === 'heishui_aid_needed' ? '核实鼍洁来历，商议请西海援手' :
              sp === 'heishui_scout_ready' ? '随沙僧探查水府，击退守门水卒' :
                sp === 'heishui_captives_taken' ? '找到失府河神，问明夺府经过与水府入口' : '与渡口船夫交涉，安排过河';
      stepProgress = rewardPending ? '妖已擒，谢礼待领' :
        sp === 'heishui_cleared' ? '功德圆满' :
          sp === 'heishui_boss_ready' ? '摩昂已备，可战鼍洁' :
            sp === 'heishui_moang_arrived' ? '援军已至' :
              sp === 'heishui_aid_needed' ? '探战已胜，待请援' :
                sp === 'heishui_scout_ready' ? '入口已明' :
                  sp === 'heishui_captives_taken' ? '师父八戒失陷' : '初入黑水河';
      stepProgressRatio = rewardPending ? 0.9 : sp === 'heishui_cleared' ? 1 :
        sp === 'heishui_boss_ready' ? 0.8 : sp === 'heishui_moang_arrived' ? 0.65 :
          sp === 'heishui_aid_needed' ? 0.5 : sp === 'heishui_scout_ready' ? 0.35 :
            sp === 'heishui_captives_taken' ? 0.2 : 0.05;
      stepHint = sp === 'heishui_cleared' ? '黑水河事毕，师徒渡河东去' : '悟空不善水战，水中强攻不利，宜请援手';
      isDone = sp === 'heishui_cleared';
    }`;
  const c = s.split(from).length - 1;
  if (c !== 1) { console.error(`任务卷轴匹配 ${c} 处`); process.exit(1); }
  s = s.replace(from, to); n++; console.log('✓ getOrdealAndQuestInfo');
}

// 5) 章节开幕 chapter_13
{
  const p2 = 'js/data/storyQuests.js';
  let s2 = fs.readFileSync(p2, 'utf8');
  const crlf2 = s2.includes('\r\n');
  if (crlf2) s2 = s2.replace(/\r\n/g, '\n');
  const from = `      triggerMap: 'huoyundong',
      triggerPhase: 'huoyun_arrived'
    }
  };`;
  const to = `      triggerMap: 'huoyundong',
      triggerPhase: 'huoyun_arrived'
    },
    'chapter_13': {
      id: 'chapter_13',
      chapterNum: '第十三回',
      title: '第十三回 · 黑水擒龙',
      subtitle: '黑水横流摄圣僧，龙子奉令擒妖鼍',
      seal: '黑水伏鼍',
      triggerMap: 'heishuihe',
      triggerPhase: 'heishui_arrived'
    }
  };`;
  const c = s2.split(from).length - 1;
  if (c !== 1) { console.error(`chapter_13 匹配 ${c} 处`); process.exit(1); }
  s2 = s2.replace(from, to);
  if (crlf2) s2 = s2.replace(/\n/g, '\r\n');
  fs.writeFileSync(p2, s2, 'utf8'); n++; console.log('✓ CHAPTER_CONFIGS chapter_13');
}

if (hasCRLF) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log(`\n共修改 ${n} 处`);
