import fs from 'node:fs';
let n = 0;

// 1) NPC 插入 tongtianhe
{
  const p = 'js/data/maps2d.js';
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('npc_tongtian_elder')) { console.log('NPC 已存在'); }
  else {
    const k = s.indexOf('"tongtianhe": {');
    if (k < 0) { console.error('未找到 tongtianhe'); process.exit(1); }
    const objStart = s.indexOf('{', k);
    function matchBrace(s, openIdx) {
      let depth = 0, inStr = null;
      for (let i = openIdx; i < s.length; i++) {
        const ch = s[i], prev = s[i - 1];
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
    if (npcsKey < 0) { console.error('无 npcs'); process.exit(1); }
    const arrOpen = seg.indexOf('[', npcsKey);
    function matchBracket(text, openIdx) {
      let depth = 0, inStr = null;
      for (let i = openIdx; i < text.length; i++) {
        const ch = text[i], prev = text[i - 1];
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
      '      { "id": "npc_tongtian_elder", "name": "陈家长者", "title": "【陈家庄乡老】", "x": ' + (7 * T) + ', "y": ' + (13 * T) + ', "appearance": "stone_monkey", "icon": "👴", "dialogueKey": "tongtian_appeal" },',
      '      { "id": "npc_tongtian_child", "name": "陈关保与一秤金", "title": "【被选中的祭童】", "x": ' + (6 * T) + ', "y": ' + (10 * T) + ', "appearance": "stone_monkey", "icon": "🧒", "dialogueKey": "tongtian_child_words" },',
      '      { "id": "npc_tongtian_altar", "name": "河畔祭坛", "title": "【寒祭旧约】", "x": ' + (18 * T) + ', "y": ' + (14 * T) + ', "appearance": "stone_monkey", "icon": "🕯️", "dialogueKey": "tongtian_altar_rite" },',
      '      { "id": "npc_tongtian_watergate", "name": "水府入口", "title": "【暗流侧口】", "x": ' + (27 * T) + ', "y": ' + (20 * T) + ', "appearance": "shrimp", "icon": "🌊", "dialogueKey": "tongtian_watergate" },',
      '      { "id": "npc_tongtian_guanyin", "name": "观世音菩萨", "title": "【南海大慈大悲】", "x": ' + (20 * T) + ', "y": ' + (13 * T) + ', "appearance": "stone_monkey", "icon": "🪷", "dialogueKey": "tongtian_guanyin_arrival" }'
    ].join('\n');
    const newInner = inner.slice(0, lastBrace + 1) + ',' + add + inner.slice(lastBrace + 1);
    seg = seg.slice(0, arrOpen + 1) + newInner + seg.slice(arrClose);
    s = s.slice(0, objStart) + seg + s.slice(objEnd + 1);
    fs.writeFileSync(p, s, 'utf8');
    console.log('✓ 已追加 5 个通天河 NPC'); n++;
  }
}

// 2) 小地图
{
  const p = 'js/engine/minimap.js';
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('tongtian_arrival')) { console.log('minimap 已存在'); }
  else {
    const from = `    // 21. 苍茫三岭支线伏魔引导`;
    const to = `    // 20.4 通天河（第十五回）
    if (mapId === 'tongtianhe') {
      const tt = {
        tongtian_arrival: { x: 224, y: 416, name: '陈家长者', desc: '查明通天河祭童之事' },
        tongtian_vowed: { x: 576, y: 448, name: '河畔祭坛', desc: '安置孩子，随替身赴约' },
        tongtian_altar: { x: 576, y: 448, name: '河畔祭坛', desc: '引妖现身，护住村民' },
        tongtian_rescue: { x: 864, y: 640, name: '水府入口', desc: '循暗流侧口潜入，救出师父' },
        tongtian_await_guanyin: { x: 640, y: 416, name: '观世音菩萨', desc: '请菩萨鱼篮收妖' },
        tongtian_reward: { x: 224, y: 416, name: '陈家长者', desc: '领取谢礼，渡河东去' }
      };
      const t = tt[storyPhase];
      if (t) return t;
    }

    // 21. 苍茫三岭支线伏魔引导`;
    const c = s.split(from).length - 1;
    if (c !== 1) { console.error(`minimap 匹配 ${c} 处`); process.exit(1); }
    s = s.replace(from, to);
    fs.writeFileSync(p, s, 'utf8');
    console.log('✓ minimap 通天河'); n++;
  }
}

// 3) 战斗方法改名：triggerTongtianIceBattle -> triggerTongtianRescueBattle
{
  const p = 'js/app2d.js';
  let s = fs.readFileSync(p, 'utf8');
  const before = (s.match(/triggerTongtianIceBattle/g) || []).length;
  if (before > 0) {
    s = s.replace(/triggerTongtianIceBattle/g, 'triggerTongtianRescueBattle');
    fs.writeFileSync(p, s, 'utf8');
    console.log(`✓ 战斗方法改名（${before} 处）`); n++;
  } else {
    console.log('（方法名已是新名或不存在）');
  }
}

console.log(`\n共 ${n} 处`);
