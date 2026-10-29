import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

const from = `        { exp: 160000, silver: 38000 }, this.inventory);
        window.showGameMessage('☠️ 战利暂由昴日星官代管，稍后可再来领取。', 'warning', 5000);
      }`;
const to = `        { exp: 160000, silver: 38000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('☠️ 战利暂由昴日星官代管，稍后可再来领取。', 'warning', 5000);
      }`;
const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已补回 if 判断');
