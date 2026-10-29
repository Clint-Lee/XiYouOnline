// 收敛 appliedRound：删除"每个 actor 行动后再补一轮"的第二处初始化，
// 改为在 executeRound 开头统一补，并让所有 buff push 显式带上 appliedRound。
import fs from 'node:fs';

const p = 'js/core/battle.js';
let s = fs.readFileSync(p, 'utf8');
let changed = 0;

function mustReplace(from, to, label) {
  const n = s.split(from).length - 1;
  if (n !== 1) {
    console.error(`✗ ${label}: 匹配 ${n} 处，跳过`);
    return false;
  }
  s = s.replace(from, to);
  changed++;
  console.log(`✓ ${label}`);
  return true;
}

// 1) 删除循环内第二处初始化（它的存在导致后手施加的 buff 被标成"本回合"，从而不减 duration）
mustReplace(
`      for (const unit of [...this.allies, ...this.enemies]) {
        unit.buffs.forEach(b => { if (b.appliedRound === undefined) b.appliedRound = this.round; });
      }
      if (this.status === 'escaped') { this.syncStateBack(); return this.status; }`,
`      if (this.status === 'escaped') { this.syncStateBack(); return this.status; }`,
'移除循环内重复的 appliedRound 初始化');

// 2) 回合初的初始化补上注释，明确这是唯一来源
mustReplace(
`    for (const unit of [...this.allies, ...this.enemies]) {
      unit.buffs.forEach(b => { if (b.appliedRound === undefined) b.appliedRound = this.round - 1; });
    }`,
`    // appliedRound 的唯一初始化点：把"上一回合遗留但未标时"的 buff 视为上一回合施加，
    // 使它们在回合末正常递减一次。新施加的 buff 必须在 push 时显式写入 appliedRound，
    // 否则会被这里当成旧 buff 立刻减一回合（历史缺陷：后手控制时长 ±1 回合）。
    for (const unit of [...this.allies, ...this.enemies]) {
      unit.buffs.forEach(b => { if (b.appliedRound === undefined) b.appliedRound = this.round - 1; });
    }`,
'回合初初始化加注释说明唯一来源');

// 3) 补齐未写 appliedRound 的 push 点
const fixes = [
  [`          e.buffs.push({ id: 'wandu', name: '中毒', duration: calc.duration, poisonDmg: pDmg, decayRatio: calc.decayRatio });`,
   `          e.buffs.push({ id: 'wandu', name: '中毒', duration: calc.duration, poisonDmg: pDmg, decayRatio: calc.decayRatio, appliedRound: this.round });`,
   '万毒攻心中毒 buff'],

  [`          e.buffs.push({ id: 'luanhun', name: '混乱', duration: calc.duration });`,
   `          e.buffs.push({ id: 'luanhun', name: '混乱', duration: calc.duration, appliedRound: this.round });`,
   '乱魂咒 buff'],

  [`          e.buffs.push({ id: 'fengyin', name: '封印', duration: calc.duration, blocksAllActions: true });`,
   `          e.buffs.push({ id: 'fengyin', name: '封印', duration: calc.duration, blocksAllActions: true, appliedRound: this.round });`,
   '封印咒 buff'],

  [`          e.buffs.push({ id: 'dingshen', name: '定身', duration: calc.duration, breakOnDamage: true });`,
   `          e.buffs.push({ id: 'dingshen', name: '定身', duration: calc.duration, breakOnDamage: true, appliedRound: this.round });`,
   '定身咒 buff'],

  [`      ally.buffs.push({ id: 'yinshen', name: '隐身潜行', duration: calc.duration, hideAttributes: true, dodgeBonus: calc.dodgeBonus });`,
   `      ally.buffs.push({ id: 'yinshen', name: '隐身潜行', duration: calc.duration, hideAttributes: true, dodgeBonus: calc.dodgeBonus, appliedRound: this.round });`,
   '隐身咒 buff'],

  [`        t.buffs.push({ name: '金刚护体', duration: calc.duration, defBonusRate: calc.resRate, mdefBonusRate: calc.resRate });`,
   `        t.buffs.push({ name: '金刚护体', duration: calc.duration, defBonusRate: calc.resRate, mdefBonusRate: calc.resRate, appliedRound: this.round });`,
   '玩家金刚护体 buff'],

  [`      targets.forEach(t => t.buffs.push({ name: '金刚护体', duration: calc.duration,
        defBonusRate: calc.resRate, mdefBonusRate: calc.resRate }));`,
   `      targets.forEach(t => t.buffs.push({ name: '金刚护体', duration: calc.duration,
        defBonusRate: calc.resRate, mdefBonusRate: calc.resRate, appliedRound: this.round }));`,
   '敌方金刚护体 buff'],

  [`        if (success) t.buffs.push({ id, name: label, duration: calc.duration, breakOnDamage: id === 'dingshen' });`,
   `        if (success) t.buffs.push({ id, name: label, duration: calc.duration, breakOnDamage: id === 'dingshen', appliedRound: this.round });`,
   '敌方控制 buff']
];

for (const [from, to, label] of fixes) mustReplace(from, to, label);

fs.writeFileSync(p, s, 'utf8');
console.log(`\n共修改 ${changed} 处`);
