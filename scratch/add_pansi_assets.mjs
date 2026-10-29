import fs from 'node:fs';
let n = 0;

// 1) 物品
{
  const p = 'js/data/items.js';
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');
  if (s.includes('eq_nk_pansi:')) { console.log('物品已存在'); }
  else {
    const anchor = '  // === 剧情战利特级神装 ===';
    const L = [];
    L.push('  // === 第十七回 盘丝洞战利 ===');
    L.push('  eq_nk_pansi: {');
    L.push("    id: 'eq_nk_pansi',");
    L.push("    name: '【土】盘丝辟毒佩',");
    L.push("    type: 'equip',");
    L.push("    slot: 'necklace',");
    L.push("    element: 'earth',");
    L.push('    reqLevel: 68,');
    L.push("    icon: '🟤',");
    L.push('    price: 58000,');
    L.push("    quality: 'gold',");
    L.push('    attrs: { atk: 70, matk: 225, mdef: 195, mp: 950 },');
    L.push('    resists: { phy: 30, shesheng: 24, dingshen: 22 },');
    L.push('    counterShockRate: 0.14,');
    L.push("    desc: '【土属性挂链】以破除金光后散落的蜈蚣壳屑与盘丝岭净土共炼，佩戴后赋予主人五行【土】属性！厚土辟毒，妖氛不近。'");
    L.push('  },');
    L.push('');
    L.push('  // === 剧情战利特级神装 ===');
    const c = s.split(anchor).length - 1;
    if (c !== 1) { console.error(`物品锚点 ${c}`); process.exit(1); }
    s = s.replace(anchor, L.join('\n'));
    if (crlf) s = s.replace(/\n/g, '\r\n');
    fs.writeFileSync(p, s, 'utf8');
    console.log('✓ eq_nk_pansi'); n++;
  }
}

// 2) NPC
{
  const p = 'js/data/maps2d.js';
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('npc_pansi_spider')) { console.log('NPC 已存在'); }
  else {
    const k = s.indexOf('"pansidong": {');
    if (k < 0) { console.error('未找到 pansidong'); process.exit(1); }
    const objStart = s.indexOf('{', k);
    function matchBrace(t, openIdx) {
      let depth = 0, inStr = null;
      for (let i = openIdx; i < t.length; i++) {
        const ch = t[i], prev = t[i - 1];
        if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; continue; }
        if (ch === '"') { inStr = ch; continue; }
        if (ch === '{') depth++;
        else if (ch === '}') { depth--; if (depth === 0) return i; }
      }
      return -1;
    }
    const objEnd = matchBrace(s, objStart);
    let seg = s.slice(objStart, objEnd + 1);
    const npcsKey = seg.indexOf('"npcs"');
    const arrOpen = seg.indexOf('[', npcsKey);
    function matchBracket(t, openIdx) {
      let depth = 0, inStr = null;
      for (let i = openIdx; i < t.length; i++) {
        const ch = t[i], prev = t[i - 1];
        if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; continue; }
        if (ch === '"') { inStr = ch; continue; }
        if (ch === '[') depth++;
        else if (ch === ']') { depth--; if (depth === 0) return i; }
      }
      return -1;
    }
    const arrClose = matchBracket(seg, arrOpen);
    const inner = seg.slice(arrOpen + 1, arrClose);
    const lastBrace = inner.lastIndexOf('}');
    const T = 32;
    const add = [
      '',
      '      { "id": "npc_pansi_spider", "name": "盘丝七女妖", "title": "【濯垢泉边】", "x": ' + (13 * T) + ', "y": ' + (13 * T) + ', "appearance": "fox", "icon": "🕷️", "dialogueKey": "pansi_spring" },',
      '      { "id": "npc_pansi_huanghua", "name": "黄花观主", "title": "【百眼魔君】", "x": ' + (25 * T) + ', "y": ' + (10 * T) + ', "appearance": "yecha", "icon": "👁️", "dialogueKey": "pansi_huanghua" },',
      '      { "id": "npc_pansi_oldwoman", "name": "指路老妇", "title": "【黎山故人】", "x": ' + (20 * T) + ', "y": ' + (20 * T) + ', "appearance": "stone_monkey", "icon": "👵", "dialogueKey": "pansi_oldwoman" },',
      '      { "id": "npc_pansi_maori", "name": "昴日星官", "title": "【双冠大公鸡】", "x": ' + (24 * T) + ', "y": ' + (14 * T) + ', "appearance": "stone_monkey", "icon": "🐓", "dialogueKey": "pansi_maori" },',
      '      { "id": "npc_pansi_west_exit", "name": "西行关口", "title": "【西去路】", "x": ' + (36 * T) + ', "y": ' + (14 * T) + ', "appearance": "stone_monkey", "icon": "🌄", "dialogueKey": "pansi_cleared_end" }'
    ].join('\n');
    const newInner = inner.slice(0, lastBrace + 1) + ',' + add + inner.slice(lastBrace + 1);
    seg = seg.slice(0, arrOpen + 1) + newInner + seg.slice(arrClose);
    s = s.slice(0, objStart) + seg + s.slice(objEnd + 1);
    fs.writeFileSync(p, s, 'utf8');
    console.log('✓ 已追加 5 个盘丝洞 NPC'); n++;
  }
}

// 3) 小地图
{
  const p = 'js/engine/minimap.js';
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('pansi_arrived')) { console.log('minimap 已存在'); }
  else {
    const from = `    // 21. 苍茫三岭支线伏魔引导`;
    const to = `    // 20.6 盘丝洞（第十七回）
    if (mapId === 'pansidong') {
      const ps = {
        pansi_arrived: { x: 416, y: 416, name: '盘丝七女妖', desc: '与唐僧确认泉边边界' },
        pansi_webbound: { x: 416, y: 416, name: '盘丝七女妖', desc: '解除丝洞主缚，救出师父与八戒' },
        pansi_huanghua: { x: 800, y: 320, name: '黄花观主', desc: '往黄花观求解毒之法' },
        pansi_poisoned: { x: 640, y: 640, name: '指路老妇', desc: '询问破光救人之法' },
        pansi_seeking_rooster: { x: 768, y: 448, name: '昴日星官', desc: '请昴日星官下山相助' },
        pansi_breaking_light: { x: 768, y: 448, name: '昴日星官', desc: '随昴日星官破除金光' },
        pansi_restoring: { x: 416, y: 416, name: '唐三藏', desc: '交代救治与善后，领取谢礼' }
      };
      const t = ps[storyPhase];
      if (t) return t;
    }

    // 21. 苍茫三岭支线伏魔引导`;
    const c = s.split(from).length - 1;
    if (c !== 1) { console.error(`minimap ${c}`); process.exit(1); }
    s = s.replace(from, to);
    fs.writeFileSync(p, s, 'utf8');
    console.log('✓ minimap 盘丝洞'); n++;
  }
}

console.log(`\n共 ${n} 处`);
