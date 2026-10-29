// 集成验证：真实 executeRound 流程下车阵是否按预期介入。
import fs from 'node:fs';
import vm from 'node:vm';

const sb = { window: {}, console, JSON, Object, Array, Number, Math, String, Date, Promise, Set, Map };
sb.window = sb; sb.global = sb;
vm.createContext(sb);
for (const f of ['js/data/classes.js', 'js/core/skills.js', 'js/data/pets.js', 'js/core/petSystem.js',
  'js/core/shanhai.js', 'js/data/items.js', 'js/core/inventory.js', 'js/core/player.js', 'js/core/battle.js']) {
  try { vm.runInContext(fs.readFileSync(f, 'utf8'), sb); } catch (e) { console.log('skip', f, e.message); }
}

const mkBoss = () => ({
  id: 'boss_redboy_it', name: '红孩儿', level: 56,
  hp: 42000, maxHp: 42000, mp: 9999, maxMp: 9999,
  atk: 420, def: 215, matk: 400, mdef: 205, spd: 52, skills: ['三昧真火'],
  mechanicId: 'five_element_cart',
  mechanicConfig: { breakRatio: 0.05, burstFactor: 1.5, guardFactor: 0.65, recoveryRounds: 2,
    elements: ['gold', 'wood', 'water', 'fire', 'earth'] }
});

const p = new sb.Player({ classId: 'jingang', level: 50 });
const boss = mkBoss();
const b = new sb.BattleEngine(p, [], [boss]);
const e = b.enemies[0];
const ally = b.allies[0];

console.log('=== 真实 executeRound 下车阵行为 ===');
console.log('初始 phase:', b.getCartState(e)?.phase, '| round:', b.round);

const logPhase = (tag) => {
  const st = b.getCartState(e);
  console.log(`  ${tag}: phase=${st?.phase} resolved=${st?.resolved} activeFrom=${st?.activeFromRound} round=${b.round} allyHp=${ally.hp}`);
};

// 第 1 回合：玩家防御（守息），观察红孩儿是否只蓄火不伤害
ally.hp = ally.maxHp;
const hp0 = ally.hp;
b.setAllyAction('player', { type: 'defend' });
await b.executeRound(null);
logPhase('R1 防御后');
console.log(`  R1 玩家掉血: ${hp0 - ally.hp}（应为 0，蓄力回合不造成伤害）`);
console.log('  守息 buff:', ally.buffs.filter(x => x.id === 'hh_cart_guard').length);

// 第 2 回合：观察爆发
const hp1 = ally.hp;
b.setAllyAction('player', { type: 'defend' });
await b.executeRound(null);
logPhase('R2 后');
console.log(`  R2 玩家掉血: ${hp1 - ally.hp}（应为爆发减伤后的数值）`);

// 继续跑几个回合，确认循环
for (let i = 3; i <= 6; i++) {
  ally.hp = Math.min(ally.maxHp, ally.hp + 5000);
  b.setAllyAction('player', { type: 'defend' });
  await b.executeRound(null);
  logPhase(`R${i}`);
}
