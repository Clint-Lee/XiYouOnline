import fs from 'node:fs';
const p = 'js/data/items.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes('eq_nk_tongtian:')) { console.log('已存在'); process.exit(0); }

const anchor = '  // === 剧情战利特级神装 ===';
const block = [
  '  // === 第十五回 通天河战利 ===',
  '  eq_nk_tongtian: {',
  "    id: 'eq_nk_tongtian',",
  "    name: '【水】通天镇水佩',",
  "    type: 'equip',",
  "    slot: 'necklace',",
  "    element: 'water',",
  '    reqLevel: 62,',
  "    icon: '🔵',",
  '    price: 46000,',
  "    quality: 'gold',",
  '    attrs: { matk: 205, mdef: 170, mp: 850 },',
  '    resists: { phy: 26, shesheng: 22, fengyin: 20 },',
  '    counterAttackRate: 0.12,',
  "    desc: '【水属性挂链】通天河底镇水古玉所琢，佩戴后赋予主人五行【水】属性！水势归心，寒冰自消。'",
  '  },',
  '',
  '  // === 剧情战利特级神装 ==='
].join('\n');

const c = s.split(anchor).length - 1;
if (c !== 1) { console.error(`锚点 ${c} 处`); process.exit(1); }
s = s.replace(anchor, block);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已补 eq_nk_tongtian');
