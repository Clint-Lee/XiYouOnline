// 诊断车阵相位推进的真实行为
import fs from 'node:fs';
import vm from 'node:vm';

const sb = { window: {}, console, JSON, Object, Array, Number, Math, String, Date };
sb.window = sb; sb.global = sb;
vm.createContext(sb);
for (const f of ['js/data/classes.js', 'js/core/skills.js', 'js/data/pets.js', 'js/core/petSystem.js',
  'js/core/shanhai.js', 'js/data/items.js', 'js/core/inventory.js', 'js/core/player.js', 'js/core/battle.js']) {
  try { vm.runInContext(fs.readFileSync(f, 'utf8'), sb); } catch (e) { console.log('skip', f, e.message); }
}

const mkBoss = () => ({
  id: 'boss_test', name: '红孩儿', level: 56,
  hp: 42000, maxHp: 42000, mp: 9999, maxMp: 9999,
  atk: 420, def: 215, matk: 400, mdef: 205, spd: 52, skills: [],
  mechanicId: 'five_element_cart',
  mechanicConfig: { breakRatio: 0.05, burstFactor: 1.5, guardFactor: 0.65, recoveryRounds: 2,
    elements: ['gold', 'wood', 'water', 'fire', 'earth'] }
});

const p = new sb.Player({ classId: 'jingang', level: 50 });
const boss = mkBoss();
const b = new sb.BattleEngine(p, [], [boss]);
const st = b.getCartState(b.enemies[0]);
console.log('初始:', st && st.phase, '| threshold:', st && st.breakThreshold, '| activeFrom:', st && st.activeFromRound, '| round:', b.round);

console.log('\n推进序列:');
for (let i = 1; i <= 6; i++) {
  b.advanceCartCycle(b.enemies[0]);
  const s = b.getCartState(b.enemies[0]);
  console.log(`  第${i}次推进 -> phase=${s && s.phase}, duration=${s && s.duration}, round=${b.round}, resolved=${s && s.resolved}`);
}

// 破阵后
console.log('\n破阵测试:');
const boss2 = mkBoss();
const b2 = new sb.BattleEngine(p, [], [boss2]);
const e2 = b2.enemies[0];
const s2 = b2.getCartState(e2);
b2.recordCartBreakDamage(b2.allies[0], e2, s2.breakThreshold);
console.log('破阵后 phase:', b2.getCartState(e2).phase);
for (let i = 1; i <= 3; i++) {
  b2.advanceCartCycle(e2);
  const s = b2.getCartState(e2);
  console.log(`  破阵后第${i}次推进 -> phase=${s && s.phase}`);
}

// 爆发
console.log('\n爆发测试:');
const boss3 = mkBoss();
const b3 = new sb.BattleEngine(p, [], [boss3]);
const e3 = b3.enemies[0];
b3.advanceCartCycle(e3); // charge -> burst
const s3 = b3.getCartState(e3);
console.log('推进一次后 phase:', s3 && s3.phase, 'activeFrom:', s3 && s3.activeFromRound, 'round:', b3.round);
const ally = b3.allies[0];
const hpBefore = ally.hp;
b3.resolveCartBurst(e3, null).then(() => {
  console.log('爆发后 ally hp:', hpBefore, '->', ally.hp);
  const s4 = b3.getCartState(e3);
  console.log('爆发后 resolved:', s4 && s4.resolved, 'phase:', s4 && s4.phase);
});
