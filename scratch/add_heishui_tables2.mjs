import fs from 'node:fs';
let n = 0;

// ── 1. phaseWeights ──
{
  const p = 'js/app2d.js';
  let s = fs.readFileSync(p, 'utf8');
  // 用 huoyun_cleared + 后续三行做唯一锚点
  const from = `      huoyun_cleared: 140,
      poer_cleared: 150,
      chedi_cleared: 160,`;
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
  if (s.split(from).length - 1 !== 1) { console.error('phaseWeights 锚点不唯一'); process.exit(1); }
  s = s.replace(from, to);
  fs.writeFileSync(p, s, 'utf8');
  console.log('✓ phaseWeights'); n++;
}

// ── 2. MAIN_QUEST_TARGETS ──
{
  const p = 'js/app2d.js';
  let s = fs.readFileSync(p, 'utf8');
  const from = `      'huoyun_cleared': null
    };`;
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
  if (s.split(from).length - 1 !== 1) { console.error('MAIN_QUEST_TARGETS 锚点不唯一'); process.exit(1); }
  s = s.replace(from, to);
  fs.writeFileSync(p, s, 'utf8');
  console.log('✓ MAIN_QUEST_TARGETS'); n++;
}

// ── 3. NPC 显隐 ──
{
  const p = 'js/app2d.js';
  let s = fs.readFileSync(p, 'utf8');
  const from = `    // 8.2 苍茫三岭支线伏魔 NPC 与妖物`;
  const to = `    // 8.1.2 第十三回 黑水河：按阶段集合严格显隐，避免船夫/守将/鼍洁长期残留
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
  if (s.split(from).length - 1 !== 1) { console.error('NPC 显隐锚点不唯一'); process.exit(1); }
  s = s.replace(from, to);
  fs.writeFileSync(p, s, 'utf8');
  console.log('✓ isNpcVisibleInStoryPhase'); n++;
}

console.log(`\n共修改 ${n} 处`);
