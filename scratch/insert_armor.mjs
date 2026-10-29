import fs from 'node:fs';

// 从 Opus 输出提取「黑水换甲」方法组，插入 battle.js 车阵方法组之后。
const t = fs.readFileSync('scratch/r_opus11.md', 'utf8').replace(/\r\n/g, '\n');
const re = /^###\s*FILE:\s*(\S+)\s*$/gm;
const marks = [];
let m;
while ((m = re.exec(t)) !== null) marks.push({ i: m.index, e: m.index + m[0].length });
const body = t.slice(marks[1].e, marks[2].i);
const sep = body.indexOf('=======');
const ne = body.indexOf('>>>>>>> NEW');
let block = body.slice(sep + 7, ne).replace(/^\n/, '').replace(/\n+$/, '');

// 只保留从「黑水换甲」注释开始的部分
const start = block.indexOf('  // ===================== 黑水换甲');
if (start < 0) { console.error('未找到黑水换甲方法组'); process.exit(1); }
block = block.slice(start);

// 若尾部混入了后续内容（如 settleRoundBuffs 原文），在最后一个方法结束后截断
const endMark = block.indexOf('async checkBattleEnd');
if (endMark > 0) block = block.slice(0, endMark).replace(/\n+$/, '');

console.log('方法组长度', block.length, '行数', block.split('\n').length);
console.log('首行:', JSON.stringify(block.split('\n')[0]));
console.log('末行:', JSON.stringify(block.split('\n').slice(-1)[0]));

const p = 'js/core/battle.js';
let s = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

if (s.includes('黑水换甲（鼍洁 Boss 机制）')) {
  console.log('已存在，跳过');
  process.exit(0);
}

// 插到车阵 cleanupCartMechanic 方法之后
const anchor = `  cleanupCartMechanic(enemy) {`;
const idx = s.indexOf(anchor);
if (idx < 0) { console.error('未找到 cleanupCartMechanic'); process.exit(1); }
// 找到该方法结束（下一个顶格两空格的 "  //" 或 "  方法名(" 前）
let depth = 0, i = s.indexOf('{', idx), endIdx = -1;
for (; i < s.length; i++) {
  const ch = s[i];
  if (ch === '{') depth++;
  else if (ch === '}') { depth--; if (depth === 0) { endIdx = i; break; } }
}
if (endIdx < 0) { console.error('方法未闭合'); process.exit(1); }

const out = s.slice(0, endIdx + 1) + '\n\n' + block + s.slice(endIdx + 1);
fs.writeFileSync(p, out, 'utf8');
console.log('✓ 已插入黑水换甲方法组');
