import fs from 'node:fs';
const p = 'js/data/items.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes("eq_nk_huoyun:")) {
  console.log('火云辟火珠已存在，跳过');
} else {
  const anchor = `  // === 剧情战利特级神装 ===`;
  const block = `  // === 第十二回 火云洞战利 ===
  eq_nk_huoyun: {
    id: 'eq_nk_huoyun',
    name: '【火】火云辟火珠',
    type: 'equip',
    slot: 'necklace',
    element: 'fire',
    reqLevel: 55,
    icon: '🔴',
    price: 32000,
    quality: 'gold',
    attrs: { matk: 165, mdef: 120, mp: 620 },
    resists: { phy: 20, shesheng: 18, sanmei: 22 },
    counterShockRate: 0.12,
    desc: '【火属性挂链】号山火云洞三昧真火淬炼而成，佩戴后赋予主人五行【火】属性！烈焰绕身，焚尽近身妖邪。'
  },

  // === 第十三回 黑水河战利 ===
  eq_nk_heishui: {
    id: 'eq_nk_heishui',
    name: '【水】黑水辟水佩',
    type: 'equip',
    slot: 'necklace',
    element: 'water',
    reqLevel: 58,
    icon: '🔵',
    price: 38000,
    quality: 'gold',
    attrs: { matk: 180, mdef: 145, mp: 720 },
    resists: { phy: 22, shesheng: 20, leiting: 18 },
    counterAttackRate: 0.12,
    desc: '【水属性挂链】衡阳峪黑水河底玄石所琢，佩戴后赋予主人五行【水】属性！水幕环身，敌招未至已先偏斜。'
  },

  // === 剧情战利特级神装 ===`;

  const c = s.split(anchor).length - 1;
  if (c !== 1) { console.error(`锚点匹配 ${c} 处`); process.exit(1); }
  s = s.replace(anchor, block);
  if (crlf) s = s.replace(/\n/g, '\r\n');
  fs.writeFileSync(p, s, 'utf8');
  console.log('✓ 已补 eq_nk_huoyun 与 eq_nk_heishui');
}
