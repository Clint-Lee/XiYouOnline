import fs from 'node:fs';
const p = 'test_heishui_chapter.js';
let s = fs.readFileSync(p, 'utf8');

if (s.includes('黑水换甲')) { console.log('已存在'); process.exit(0); }

const from = `  console.log('  ✅ 黑水河章节断言全部通过');`;
const to = `  // ── 14. 鼍洁「黑水换甲」机制 ──
  // 与五行车阵不同：没有蓄力/爆发窗口，核心是伤害类型选择。
  {
    const mkBoss = () => ({
      id: 'boss_tuojie_mt', name: '鼍洁', level: 60,
      hp: 46000, maxHp: 46000, mp: 9000, maxMp: 9000,
      atk: 430, def: 220, matk: 410, mdef: 215, spd: 50, skills: [],
      mechanicId: 'heishui_current_armor',
      mechanicConfig: { startStance: 'scaled', switchEvery: 2, scaledDefBonus: 0.45, flowingMdefBonus: 0.45 }
    });

    const player = new window.Player({ classId: 'jingang', level: 55 });
    const battle = new window.BattleEngine(player, [], [mkBoss()]);
    const boss = battle.enemies[0];
    const BE = window.BattleEngine;

    // 初始姿态
    const st0 = battle.getArmorState(boss);
    assert(st0 && st0.stance === 'scaled',
      '鼍洁开场应固定为凝鳞姿态（让首次接触可学习）');
    assert(st0.actionCount === 0, '初始有效行动计数应为 0');

    // 凝鳞：物理伤害应被削减，法术伤害保持原值
    const phys = BE.applyArmorMitigation(boss, 1000, false);
    const spell = BE.applyArmorMitigation(boss, 1000, true);
    assert(phys.damage < 1000,
      \`凝鳞姿态下物理伤害应被削减，实际 \${phys.damage}\`);
    assert(phys.damage > 0,
      \`减伤不能设为免疫（必须可通过常规伤害击败），实际 \${phys.damage}\`);
    assert(spell.damage === 1000,
      \`凝鳞姿态下法术伤害应保持原值，实际 \${spell.damage}\`);
    assert(typeof phys.note === 'string' && phys.note.length > 0,
      '减伤时应给出可归因的战报文案');

    // 每 2 次有效行动切换
    BE.prototype.recordArmorAction.call(battle, boss);
    let st = battle.getArmorState(boss);
    assert(st.stance === 'scaled' && st.actionCount === 1,
      '第 1 次有效行动后仍在凝鳞姿态');

    BE.prototype.recordArmorAction.call(battle, boss);
    st = battle.getArmorState(boss);
    assert(st.stance === 'flowing' && st.actionCount === 0,
      \`第 2 次有效行动后应切换为散流，实际 \${st.stance}\`);

    // 散流：法术伤害被削减，物理保持原值
    const phys2 = BE.applyArmorMitigation(boss, 1000, false);
    const spell2 = BE.applyArmorMitigation(boss, 1000, true);
    assert(spell2.damage < 1000,
      \`散流姿态下法术伤害应被削减，实际 \${spell2.damage}\`);
    assert(phys2.damage === 1000,
      \`散流姿态下物理伤害应保持原值，实际 \${phys2.damage}\`);

    // 再 2 次切回凝鳞
    BE.prototype.recordArmorAction.call(battle, boss);
    BE.prototype.recordArmorAction.call(battle, boss);
    st = battle.getArmorState(boss);
    assert(st.stance === 'scaled', '再经 2 次有效行动应切回凝鳞');

    // 防御修正不得反复累加到基础属性
    const defBefore = boss.def;
    const mdefBefore = boss.mdef;
    BE.applyArmorMitigation(boss, 1000, false);
    BE.applyArmorMitigation(boss, 1000, true);
    assert(boss.def === defBefore && boss.mdef === mdefBefore,
      '换甲只应做伤害修正，不得改写基础 def/mdef（否则切换会永久叠加）');

    // 真实回合后状态必须存活（与车阵同样的豁免要求）
    const ally = battle.allies[0];
    ally.hp = ally.maxHp;
    battle.setAllyAction('player', { type: 'defend' });
    await battle.executeRound(null);
    assert(battle.getArmorState(boss) !== null,
      '真实回合结束后换甲状态不得被通用 buff 到期过滤删除');

    // 清理
    battle.cleanupArmorMechanic(boss);
    assert(battle.getArmorState(boss) === null,
      'cleanupArmorMechanic 后换甲状态应被移除');
    assert(!(boss.buffs || []).some(b => b.id === 'hh_armor_state'),
      '清理后 buffs 中不得残留 hh_armor_state');
  }

  console.log('  ✅ 黑水河章节断言全部通过');`;

const c = s.split(from).length - 1;
if (c !== 1) { console.error(`锚点匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已追加黑水换甲机制断言');
