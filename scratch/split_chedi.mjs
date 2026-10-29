import fs from 'node:fs';
const t = fs.readFileSync('scratch/r_opus12.md', 'utf8');
const blocks = [...t.matchAll(/```js\s*\n([\s\S]*?)\n```/g)];
console.log('代码块数:', blocks.length);
const all = blocks.map(b => b[1]).join('\n');
const keys = ['chedi_monk_appeal', 'chedi_royal_terms', 'chedi_rain_trial', 'chedi_discern_trial',
  'chedi_final_challenge', 'chedi_victory', 'chedi_reward', 'chedi_after_clear',
  'chapter_14', 'npc_chedi_monk', 'npc_chedi_tiger', 'npc_chedi_deer', 'npc_chedi_sheep'];
for (const k of keys) console.log('  ', k, all.includes(k) ? 'OK' : 'MISSING');

// 分别保存
if (blocks.length >= 1) fs.writeFileSync('scratch/chedi_dlg.txt', blocks[0][1], 'utf8');
if (blocks.length >= 2) fs.writeFileSync('scratch/chedi_npcs.txt', blocks[1][1], 'utf8');
if (blocks.length >= 3) fs.writeFileSync('scratch/chedi_ch.txt', blocks[2][1], 'utf8');
console.log('\n已分块保存');
