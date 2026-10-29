import fs from 'node:fs';
let n = 0;

// 1) minimap：黑水河阶段目标
{
  const p = 'js/engine/minimap.js';
  let s = fs.readFileSync(p, 'utf8');
  const from = `    // 21. 苍茫三岭支线伏魔引导`;
  const to = `    // 20.2 黑水河·衡阳峪（第十三回）
    if (mapId === 'heishuihe') {
      const targets = {
        heishui_arrived: { x: 320, y: 288, name: '摆渡船夫', desc: '与渡口船夫交涉，安排过河' },
        heishui_captives_taken: { x: 192, y: 672, name: '失府河神', desc: '寻访失府河神，问明夺府经过' },
        heishui_scout_ready: { x: 768, y: 320, name: '水府守将', desc: '随沙僧探查水府，击退守门水卒' },
        heishui_aid_needed: { x: 192, y: 672, name: '失府河神', desc: '核实鼍洁来历，商议请西海援手' },
        heishui_moang_arrived: { x: 864, y: 352, name: '西海龙太子摩昂', desc: '与摩昂会合，确认收服次序' },
        heishui_boss_ready: { x: 1024, y: 448, name: '鼍洁', desc: '破其水势，为摩昂创造擒拿之机' },
        heishui_reward_pending: { x: 960, y: 544, name: '黑水河神', desc: '领取黑水河谢礼' },
        heishui_cleared: { x: 1088, y: 800, name: '唐三藏', desc: '黑水河事毕，与师父确认渡河行程' }
      };
      const t = targets[storyPhase];
      if (t) return t;
    }

    // 21. 苍茫三岭支线伏魔引导`;
  const c = s.split(from).length - 1;
  if (c !== 1) { console.error(`minimap 匹配 ${c} 处`); process.exit(1); }
  s = s.replace(from, to);
  fs.writeFileSync(p, s, 'utf8'); n++; console.log('✓ minimap heishuihe');
}

// 2) 章节开幕触发 chapter_13
{
  const p = 'js/app2d.js';
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');
  const from = `    // 12. 第十二回：平顶山莲花洞（双角伏魔）
    else if (mapId === 'pingdingshan') {
      if (!this.shownChapterSet.has('chapter_11')) {
        matchedChapterKey = 'chapter_11';
      }
    }`;
  const to = `    // 12. 第十二回：号山火云洞（圣婴大王）
    else if (mapId === 'huoyundong') {
      if (!this.shownChapterSet.has('chapter_12')) {
        matchedChapterKey = 'chapter_12';
      }
    }
    // 13. 第十三回：黑水河（鼍洁）
    else if (mapId === 'heishuihe') {
      if (!this.shownChapterSet.has('chapter_13')) {
        matchedChapterKey = 'chapter_13';
      }
    }`;
  const c = s.split(from).length - 1;
  if (c !== 1) { console.error(`章节触发匹配 ${c} 处`); process.exit(1); }
  s = s.replace(from, to);
  if (crlf) s = s.replace(/\n/g, '\r\n');
  fs.writeFileSync(p, s, 'utf8'); n++; console.log('✓ 章节开幕触发 chapter_12/13');
}

// 3) huoyundong 补西行出口传送门（指向 heishuihe）
{
  const p = 'js/data/maps2d.js';
  let s = fs.readFileSync(p, 'utf8');
  const from = `      {
        "x": 32,
        "y": 448,
        "targetMap": "poerdong",`;
  // 在 huoyundong 的 portals 开头插入新出口
  const keyIdx = s.indexOf('"huoyundong": {');
  const key2 = s.indexOf('"heishuihe": {');
  if (keyIdx < 0 || key2 < 0) { console.error('地图定位失败'); process.exit(1); }
  const seg = s.slice(keyIdx, key2);
  if (seg.includes('"targetMap": "heishuihe"')) {
    console.log('（huoyundong 已有通往黑水河的出口）');
  } else {
    const portalAnchor = `    "portals": [\n      {\n        "x": 1152,`;
    const idx = seg.indexOf(portalAnchor);
    if (idx < 0) { console.error('huoyundong portals 锚点未找到'); process.exit(1); }
    const out = seg.replace(portalAnchor,
`    "portals": [
      {
        "x": 1152,
        "y": 480,
        "targetMap": "heishuihe",
        "targetX": 160,
        "targetY": 224,
        "name": "黑水河",
        "minLevel": 1
      },
      {
        "x": 1152,`);
    s = s.slice(0, keyIdx) + out + s.slice(key2);
    fs.writeFileSync(p, s, 'utf8'); n++; console.log('✓ huoyundong 新增西行出口');
  }
}

console.log(`\n共修改 ${n} 处`);
