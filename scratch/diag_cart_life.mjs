import fs from 'node:fs';
import vm from 'node:vm';
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
    elements: ['gold','wood','water','fire','earth'] }
};
const b = new sb.BattleEngine(p, [], [boss]);
const e = b.enemies[0];

console.log('构造后:', JSON.stringify(b.getCartState(e), null, 0));

// 手动模拟一轮：先 advanceCartCycle 看 charge->burst 后 duration 是多少
b.advanceCartCycle(e);
console.log('推进1次:', JSON.stringify(b.getCartState(e), null, 0));

// 再看 settleRoundBuffs 会不会把它删掉
b.round = 2;
await b.settleRoundBuffs(null);
console.log('settle后:', JSON.stringify(b.getCartState(e), null, 0));
