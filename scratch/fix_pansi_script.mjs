import fs from 'node:fs';
const p = 'scratch/add_pansi_methods.mjs';
let s = fs.readFileSync(p, 'utf8');

const from = `      "      const reward = this.playerData.claimStoryReward('pansi_boss',"
push '        { exp: 160000, silver: 38000 }, this.inventory);'.length ? "        { exp: 160000, silver: 38000 }, this.inventory);" : '';`;
const to = `push("      const reward = this.playerData.claimStoryReward('pansi_boss',");
push('        { exp: 160000, silver: 38000 }, this.inventory);');`;

const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已修正');
