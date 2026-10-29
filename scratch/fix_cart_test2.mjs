import fs from 'node:fs';
const p = 'test_cart_mechanic.js';
let s = fs.readFileSync(p, 'utf8');

const from = [
  '      // 连续推进 5 次，记录每次相位',
  '      const phases = [];',
  '      for (let i = 0; i < 5; i++) {',
  '        battle.advanceCartCycle(boss);',
  '        const cur = battle.getCartState(boss);',
  '        phases.push(cur ? cur.phase : null);',
  '      }',
  '      // 只需保证：爆发只出现一次、恢复出现两次、第 5 次回到蓄力',
  '      const burstCount = phases.filter(function (p) { return p === \'burst\'; }).length;',
  '      const recoveryCount = phases.filter(function (p) { return p === \'recovery\'; }).length;',
  '      assert(',
  '        burstCount === 1 && recoveryCount === 2 && phases.indexOf(\'charge\', 1) > 0,',
  '        \'断言2-阶段确定性：5 次推进内爆发仅 1 次、恢复 2 次，并在恢复后重新回到 charge\'',
  '      );'
].join('\n');

const to = [
  '      // 推进一个完整循环（蓄力→爆发→恢复→恢复→再蓄力），记录每次相位',
  '      const phases = [];',
  '      for (let i = 0; i < 4; i++) {',
  '        battle.advanceCartCycle(boss);',
  '        const cur = battle.getCartState(boss);',
  '        phases.push(cur ? cur.phase : null);',
  '      }',
  '      // 一个完整循环内：爆发恰好 1 次、恢复恰好 2 次、最后回到蓄力',
  '      const burstCount = phases.filter(function (p) { return p === \'burst\'; }).length;',
  '      const recoveryCount = phases.filter(function (p) { return p === \'recovery\'; }).length;',
  '      assert(',
  '        burstCount === 1 && recoveryCount === 2 && phases[3] === \'charge\',',
  '        \'断言2-阶段确定性：一轮循环内爆发 1 次、恢复 2 次，第 4 次推进回到 charge（实际 \' + phases.join(\'→\') + \'）\'',
  '      );'
].join('\n');

const c = s.split(from).length - 1;
if (c !== 1) { console.error(`✗ 匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 断言2 改为一轮完整循环判定');
