import fs0 from 'node:fs';
import vm0 from 'node:vm';
const fs = fs0, vm = vm0;

const sb = { window: {}, console, JSON, Object, Array, Number, Math, String, Date, Promise, Set, Map };
sb.window = sb; sb.global = sb;
vm.createContext(sb);
for (const f of ['js/data/classes.js', 'js/core/skills.js', 'js/data/pets.js', 'js/core/petSystem.js',
  'js/core/shanhai.js', 'js/data/items.js', 'js/core/inventory.js', 'js/core/player.js', 'js/core/battle.js']) {
  vm.runInContext(fs.readFileSync(f, 'utf8'), sb);
}

const p = new sb.Player({ classId: 'jingang', level: 50 });
const boss = {
  id: 'b', name: '红孩儿', level: 56, hp: 42000, maxHp: 42000, mp: 9999, maxMp: 9999,
  atk: 420, def: 215, matk: 400, mdef: 205, spd: 52, skills: ['三昧真火'],
  mechanicId: 'five_element_cart',
  mechanicConfig: { breakRatio: 0.05, burstFactor: 1.5, guardFactor: 0.65, recoveryRounds: 2,
    elements: ['gold', 'wood', 'water', 'fire', 'earth'] }
};
const b = new sb.BattleEngine(p, [], [boss]);
const e = b.enemies[0];

const dump = (tag) => {
  const st = b.getCartState(e);
  console.log(tag, st ? JSON.stringify({ phase: st.phase, duration: st.duration, appliedRound: st.appliedRound, activeFrom: st.activeFromRound, resolved: st.resolved }) : 'NULL');
};

dump('构造后:');
b.advanceCartCycle(e);
dump('推进1次(应burst,dur=1):');
b.round = 2;
await b.settleRoundBuffs(null);
dump('settle后:');
b.round = 3;
await b.settleRoundBuffs(null);
dump('再settle:');
