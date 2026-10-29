import fs from 'node:fs';
const p = 'js/data/maps2d.js';
let s = fs.readFileSync(p, 'utf8');

if (s.includes('npc_chedi_monk')) { console.log('NPC 已存在'); process.exit(0); }

// 用括号配对定位 chediguo 对象的 npcs 数组，安全插入
const k = s.indexOf('"chediguo": {');
if (k < 0) { console.error('未找到 chediguo'); process.exit(1); }
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
if (objEnd < 0) { console.error('对象未闭合'); process.exit(1); }
let seg = s.slice(objStart, objEnd + 1);

const npcsKey = seg.indexOf('"npcs"');
if (npcsKey < 0) { console.error('对象内无 npcs'); process.exit(1); }
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
if (arrClose < 0) { console.error('npcs 数组未闭合'); process.exit(1); }

// 数组内已有元素（保留原国王），在末尾追加四个
const newNpcs = `,
      { "id": "npc_chedi_monk", "name": "受役僧人", "title": "【被役沙门】", "x": 576, "y": 704, "appearance": "stone_monkey", "icon": "🧘", "dialogueKey": "chedi_monk_appeal" },
      { "id": "npc_chedi_tiger", "name": "虎力大仙", "title": "【黄毛虎力】", "x": 832, "y": 384, "appearance": "tiger", "icon": "🐯", "dialogueKey": "chedi_rain_trial" },
      { "id": "npc_chedi_deer", "name": "鹿力大仙", "title": "【白毛鹿力】", "x": 288, "y": 288, "appearance": "fox", "icon": "🦌", "dialogueKey": "chedi_discern_trial" },
      { "id": "npc_chedi_sheep", "name": "羊力大仙", "title": "【灰毛羊力】", "x": 928, "y": 512, "appearance": "wolf", "icon": "🐑", "dialogueKey": "chedi_final_challenge" }`;

// 找数组内最后一个 '}'，在其后插入
const inner = seg.slice(arrOpen + 1, arrClose);
const lastBrace = inner.lastIndexOf('}');
if (lastBrace < 0) { console.error('npcs 数组为空？'); process.exit(1); }
const newInner = inner.slice(0, lastBrace + 1) + newNpcs + inner.slice(lastBrace + 1);
seg = seg.slice(0, arrOpen + 1) + newInner + seg.slice(arrClose);

s = s.slice(0, objStart) + seg + s.slice(objEnd + 1);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已追加 4 个车迟国 NPC');
