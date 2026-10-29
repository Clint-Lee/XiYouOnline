import fs from 'node:fs';
const p = 'js/core/battle.js';
let s = fs.readFileSync(p, 'utf8');
let n = 0;

// 用正则处理缩进不确定的两处 appliedRound 初始化
const initRe = /([ \t]*)for \(const unit of \[\.\.\.this\.allies, \.\.\.this\.enemies\]\) \{\r?\n([ \t]*)unit\.buffs\.forEach\(b => \{ if \(b\.appliedRound === undefined\) b\.appliedRound = this\.round; \}\);\r?\n[ \t]*\}\r?\n/g;
const hits = [...s.matchAll(initRe)];
console.log('找到 "= this.round" 初始化块:', hits.length);

if (hits.length === 1) {
  s = s.replace(initRe, '');
  console.log('✓ 已移除循环内重复初始化（= this.round）');
  n++;
} else if (hits.length > 1) {
  console.error('✗ 匹配到多块，拒绝自动处理');
} else {
  console.log('（该块可能已移除）');
}

// 给回合初的初始化补注释
const head = `      unit.buffs.forEach(b => { if (b.appliedRound === undefined) b.appliedRound = this.round - 1; });`;
if (s.includes(head) && !s.includes('appliedRound 的唯一初始化点')) {
  s = s.replace(head,
`      // appliedRound 的唯一初始化点：把"上一回合遗留但未标时"的 buff 视为上一回合施加，
      // 使其在回合末正常递减一次。新施加的 buff 必须在 push 时显式写入 appliedRound，
      // 否则会被这里当成旧 buff 立刻减一回合（历史缺陷：后手控制时长 ±1 回合）。
${head}`);
  console.log('✓ 已为回合初初始化补注释');
  n++;
}

// 敌方金刚护体（换行写法的那个）
const enemyHuti = /targets\.forEach\(t => t\.buffs\.push\(\{ name: '金刚护体', duration: calc\.duration,\s*\n\s*defBonusRate: calc\.resRate, mdefBonusRate: calc\.resRate \}\)\);/;
if (enemyHuti.test(s)) {
  s = s.replace(enemyHuti,
`targets.forEach(t => t.buffs.push({ name: '金刚护体', duration: calc.duration,
        defBonusRate: calc.resRate, mdefBonusRate: calc.resRate, appliedRound: this.round }));`);
  console.log('✓ 敌方金刚护体补 appliedRound');
  n++;
} else {
  console.log('（敌方金刚护体已处理或无匹配）');
}

fs.writeFileSync(p, s, 'utf8');
console.log(`\n共修改 ${n} 处`);
