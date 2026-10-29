import fs from 'node:fs';
const p = 'js/engine/minimap.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

const from = `        pansi_restoring: { x: 416, y: 416, name: '唐三藏', desc: '交代救治与善后，领取谢礼' }
      };`;
const to = `        pansi_restoring: { x: 416, y: 416, name: '唐三藏', desc: '交代救治与善后，领取谢礼' },
        pansi_cleared: { x: 1056, y: 480, name: '西行关口', desc: '盘丝事了，继续西去' }
      };`;
const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 终态小地图目标已补');
