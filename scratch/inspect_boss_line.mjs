import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

// 修复被上一轮误替换导致缺失的 push( 行
const from = `      this.playerData.storyEvents.pansi_boss_won = true;
      this.storyPhase = 'pansi_restoring';
      const reward = this.playerData.claimStoryReward('pansi_boss',
        { exp: 160000, silver: 38000 }, this.inventory);`;
const to = `      this.playerData.storyEvents.pansi_boss_won = true;
      this.storyPhase = 'pansi_restoring';
      const reward = this.playerData.claimStoryReward('pansi_boss',
        { exp: 160000, silver: 38000 }, this.inventory);`;
// 上面看起来一样，实际问题在那行前面多了个 push( 。检查真实内容
const idx = s.indexOf("pansi_boss_won = true;");
console.log(JSON.stringify(s.slice(idx - 60, idx + 220)));
