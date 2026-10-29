import fs from 'node:fs';
const p = 'test_heishui_chapter.js';
let s = fs.readFileSync(p, 'utf8');

if (s.includes('真实回合中换甲生效')) { console.log('已存在'); process.exit(0); }

const BT = String.fromCharCode(96);

const block = [
  '  // ── 15. 换甲在真实回合中真实生效（不只是静态方法可用） ──',
  '  {',
  '    const mkBoss = () => ({',
  "      id: 'boss_tuojie_live', name: '鼍洁', level: 60,",
  '      hp: 46000, maxHp: 46000, mp: 9000, maxMp: 9000,',
  '      atk: 430, def: 220, matk: 410, mdef: 215, spd: 50, skills: [],',
  "      mechanicId: 'heishui_current_armor',",
  '      mechanicConfig: { startStance: ' + "'scaled'" + ', switchEvery: 2, scaledDefBonus: 0.45, flowingMdefBonus: 0.45 }',
  '    });',
  '    const player = new window.Player({ classId: ' + "'jingang'" + ', level: 55 });',
  '    const battle = new window.BattleEngine(player, [], [mkBoss()]);',
  '    const boss = battle.enemies[0];',
  '    const ally = battle.allies[0];',
  '',
  "    const st = battle.getArmorState(boss);",
  "    assert(st && st.stance === 'scaled', '开局应为凝鳞');",
  '',
  '    const bossHpBefore = boss.hp;',
  "    battle.setAllyAction('player', { type: 'attack', targetIndex: 0 });",
  '    await battle.executeRound(null);',
  '    const dealt = bossHpBefore - boss.hp;',
  "    assert(dealt > 0, '玩家攻击应对鼍洁造成有效伤害，实际 ' + dealt);",
  '',
  '    // 凝鳞下物理伤害被削减，因此实际伤害应低于同等级普攻对无姿态目标的水平',
  '    const noArmorRef = Object.assign({}, boss, { buffs: [] });',
  '    const refDamage = window.BattleEngine.calculateAttackDamage(ally, noArmorRef).totalDamage;',
  '    assert(dealt < refDamage,',
  "      '凝鳞姿态下真实回合的物理伤害应被削减，实际 ' + dealt + ' < 参考 ' + refDamage);",
  '',
  '    // 鼍洁完成行动后应计数',
  '    const countAfterOne = battle.getArmorState(boss).actionCount;',
  '    assert(countAfterOne >= 1,',
  "      '鼍洁在真实回合中完成行动后应累计有效行动数，实际 ' + countAfterOne);",
  '  }',
  ''
].join('\n');

const from = `  console.log('  ✅ 黑水河章节断言全部通过');`;
const to = block + from;
const c = s.split(from).length - 1;
if (c !== 1) { console.error(`锚点匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已追加真实回合换甲断言');
