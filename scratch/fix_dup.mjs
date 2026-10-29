import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

const dup = `      const reward = this.playerData.claimStoryReward('pansi_boss',
      const reward = this.playerData.claimStoryReward('pansi_boss',`;
const fix = `      const reward = this.playerData.claimStoryReward('pansi_boss',`;
const c = s.split(dup).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(dup, fix);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已删除重复行');
