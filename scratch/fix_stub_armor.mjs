import fs from 'node:fs';
const p = 'test_suite.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

const from = `      recordCartBreakDamage: Engine.prototype.recordCartBreakDamage,
      applyCartGuard: Engine.prototype.applyCartGuard };`;
const to = `      recordCartBreakDamage: Engine.prototype.recordCartBreakDamage,
      applyCartGuard: Engine.prototype.applyCartGuard,
      // 黑水换甲：夹具同样不参与该机制，补上入口以保持可用
      getArmorState: Engine.prototype.getArmorState,
      recordArmorAction: Engine.prototype.recordArmorAction,
      cleanupArmorMechanic: Engine.prototype.cleanupArmorMechanic };`;

const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ stub 夹具已补换甲入口');
