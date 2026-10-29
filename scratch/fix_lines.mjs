import fs from 'node:fs';
const p = 'scratch/add_pansi_methods.mjs';
const lines = fs.readFileSync(p, 'utf8').split('\n');
console.log('当前行119:', lines[119]);
console.log('当前行120:', lines[120]);

const a = 'push("      const reward = this.playerData.claimStoryReward(\'pansi_boss\',");';
const b = "push('        { exp: 160000, silver: 38000 }, this.inventory);');";
lines[119] = a;
lines[120] = b;
fs.writeFileSync(p, lines.join('\n'), 'utf8');
console.log('已改为:', a);
console.log('已改为:', b);
