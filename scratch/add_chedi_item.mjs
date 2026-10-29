import fs from 'node:fs';
const p = 'js/data/items.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes('eq_nk_chedi:')) { console.log('已存在'); process.exit(0); }

const anchor = '  // === 剧情战利特级神装 ===';
const block = [
  '  // === 第十四回 车迟国战利 ===',
  '  eq_nk_chedi: {',
  "    id: 'eq_nk_chedi',",
  "    name: '【土】车迟伏仙佩',",
  "    type: 'equip',",
  "    slot: 'necklace',",
  "    element: 'earth',",
  '    reqLevel: 60,',
  "    icon: '🟤',",
  '    price: 42000,',
  "    quality: 'gold',",
  '    attrs: { matk: 195, mdef: 160, mp: 800 },',
  '    resists: { phy: 24, shesheng: 20, dingshen: 18 },',
  '    counterShockRate: 0.12,',
  "    desc: '【土属性挂链】车迟国三清观法坛古玉所琢，佩戴后赋予主人五行【土】属性！厚土载德，妖术难侵。'",
  '  },',
  '',
  '  // === 剧情战利特级神装 ==='
].join('\n');

const c = s.split(anchor).length - 1;
if (c !== 1) { console.error(`锚点 ${c} 处`); process.exit(1); }
s = s.replace(anchor, block);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已补 eq_nk_chedi');
