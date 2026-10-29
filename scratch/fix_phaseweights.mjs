import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

const from = `      tongtian_cleared: 184,
      poer_cleared: 184,`;
const to = `      tongtian_cleared: 184,
      huoyan_arrived: 186,
      huoyan_borrow_fan: 188,
      huoyan_test_fan: 190,
      huoyan_seek_true_fan: 192,
      huoyan_confront_bull: 194,
      huoyan_renew_request: 196,
      huoyan_quench_fire: 198,
      huoyan_cleared: 200,
      poer_cleared: 202,`;
const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ phaseWeights 已补火焰山八阶段');
