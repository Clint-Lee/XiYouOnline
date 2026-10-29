import fs from 'node:fs';
import vm from 'node:vm';

const sb = { window: {}, console, JSON, Object, Array, Number, Math, String, Date, Promise, Set, Map };
sb.window = sb; sb.global = sb;
vm.createContext(sb);
for (const f of ['js/data/classes.js', 'js/core/skills.js', 'js/data/pets.js', 'js/core/petSystem.js',
  'js/core/shanhai.js', 'js/data/items.js', 'js/core/inventory.js', 'js/core/player.js', 'js/core/battle.js']) {
  try { vm.runInContext(fs.readFileSync(f, 'utf8'), sb); } catch (e) { }
}
sb.window.App2D = { currentMapId: 'heishuihe', inventory: { getItemCount: () => 5, removeItem: () => true } };

const mkBoss = () => ({
  id: 'boss_tuojie_it', name: '鼍洁', level: 60,
  hp: 46000, maxHp: 46000, mp: 9000, maxMp: 9000,
  atk: 430, def: 220, matk: 410, mdef: 215, spd: 50, skills: ['三昧真火'],
  mechanicId: 'heishui_current_armor',
  mechanicConfig: { startStance: 'scaled', switchEvery: 2, scaledDefBonus: 0.45, flowingMdefBonus: 0.45 }
});

const p = new sb.Player({ classId: 'jingang', level: 55 });
const boss = mkBoss();
const b = new sb.BattleEngine(p, [], [boss]);
const e = b.enemies[0];
const ally = b.allies[0];

const st0 = b.getArmorState(e);
console.log('初始姿态:', st0 && st0.stance, '| actionCount:', st0 && st0.actionCount);

// 直接测 static 减伤
console.log('物伤基值 1000 ->', JSON.stringify(sb.BattleEngine.applyArmorMitigation(e, 1000, false)));
console.log('法伤基值 1000 ->', JSON.stringify(sb.BattleEngine.applyArmorMitigation(e, 1000, true)));

// 计数与切换
console.log('\n计数切换:');
for (let i = 1; i <= 4; i++) {
  sb.BattleEngine.prototype.recordArmorAction.call(b, e);
  const st = b.getArmorState(e);
  console.log(`  第${i}次有效行动 -> stance=${st.stance} count=${st.actionCount}`);
}

// 真实回合：结算后状态应仍在
console.log('\n真实回合存活:');
ally.hp = ally.maxHp;
b.setAllyAction('player', { type: 'defend' });
await b.executeRound(null);
const after = b.getArmorState(e);
console.log('  回合后状态:', after ? (after.stance + '/' + after.actionCount) : 'NULL（被误删）');
